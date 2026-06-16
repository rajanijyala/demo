const CandidateProfile = require("../models/CandidateProfile");
const InterviewTemplate = require("../models/InterviewTemplate");
const InterviewSession = require("../models/InterviewSession");
const Question = require("../models/Question");
const Response = require("../models/Response");
const Evaluation = require("../models/Evaluation");
const FeedbackReport = require("../models/FeedbackReport");
const PracticeTask = require("../models/PracticeTask");
const Notification = require("../models/Notification");
const { createQuestionsForSession } = require("../services/questionService");
const { generateEvaluation } = require("../services/evaluationService");
const { generateFeedbackReport } = require("../services/feedbackService");
const { generatePracticePlan } = require("../services/practicePlanService");
const { logAuditEvent } = require("../services/auditService");

const normalizeConfig = (body) => ({
  role: body.role || "Full Stack Developer",
  experienceLevel: body.experienceLevel || "fresher",
  interviewType: body.interviewType || "mixed",
  durationMinutes: Number(body.durationMinutes) || 30,
  questionCount: Math.min(Number(body.questionCount) || 6, 10)
});

const configureInterview = async (req, res, next) => {
  try {
    const config = normalizeConfig(req.body);

    await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        targetRole: config.role,
        experienceLevel: config.experienceLevel,
        preferredInterviewTypes: [config.interviewType]
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const template = await InterviewTemplate.create({
      title: `${config.role} ${config.interviewType.replace("_", " ")} interview`,
      ...config,
      createdBy: req.user._id
    });

    await logAuditEvent({ req, action: "interview.configure", entityType: "InterviewTemplate", entityId: template._id, metadata: config });

    res.status(201).json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

const getTemplates = async (req, res, next) => {
  try {
    const templates = await InterviewTemplate.find({
      $or: [{ isSystem: true }, { createdBy: req.user._id }]
    }).sort({ createdAt: -1 });

    res.json({ success: true, templates });
  } catch (error) {
    next(error);
  }
};

const startInterview = async (req, res, next) => {
  try {
    let template = null;
    let config = normalizeConfig(req.body);

    if (req.body.templateId) {
      template = await InterviewTemplate.findOne({
        _id: req.body.templateId,
        $or: [{ isSystem: true }, { createdBy: req.user._id }]
      });

      if (!template) {
        return res.status(404).json({ success: false, message: "Interview template not found" });
      }

      config = normalizeConfig(template);
    }

    const session = await InterviewSession.create({
      user: req.user._id,
      template: template?._id,
      ...config,
      status: "in_progress"
    });

    const questions = await createQuestionsForSession({ session, template, config });
    session.questions = questions.map((question) => question._id);
    await session.save();

    await Notification.create({
      user: req.user._id,
      title: "Interview started",
      message: `Your ${config.role} mock interview is ready.`,
      type: "success"
    });
    await logAuditEvent({ req, action: "interview.start", entityType: "InterviewSession", entityId: session._id, metadata: config });

    res.status(201).json({ success: true, session: { ...session.toObject(), questions }, responses: [] });
  } catch (error) {
    next(error);
  }
};

const saveResponse = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user._id });

    if (!session) {
      return res.status(404).json({ success: false, message: "Interview session not found" });
    }

    const question = await Question.findOne({ _id: req.body.questionId, session: session._id });

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found for this session" });
    }

    const answer = req.body.answer || "";
    const response = await Response.findOneAndUpdate(
      { user: req.user._id, session: session._id, question: question._id },
      {
        user: req.user._id,
        session: session._id,
        question: question._id,
        answer,
        timeSpentSeconds: Number(req.body.timeSpentSeconds) || 0,
        wordCount: answer.trim() ? answer.trim().split(/\s+/).length : 0
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (Number.isInteger(req.body.currentQuestionIndex)) {
      session.currentQuestionIndex = req.body.currentQuestionIndex;
      await session.save();
    }

    res.json({ success: true, response });
  } catch (error) {
    next(error);
  }
};

const runSubmissionPipeline = async ({ req, session }) => {
  const responses = await Response.find({ user: req.user._id, session: session._id }).populate("question");
  const evaluation = await generateEvaluation({ userId: req.user._id, sessionId: session._id, responses });
  const feedback = await generateFeedbackReport({ userId: req.user._id, session, evaluation });
  const practicePlan = await generatePracticePlan({ userId: req.user._id, session, feedback });

  session.status = "evaluated";
  session.submittedAt = session.submittedAt || new Date();
  session.completedAt = new Date();
  await session.save();

  await Notification.create({
    user: req.user._id,
    title: "Feedback report ready",
    message: `Your interview score is ${evaluation.totalScore}. Review your practice plan next.`,
    type: "success"
  });
  await logAuditEvent({ req, action: "interview.submit", entityType: "InterviewSession", entityId: session._id });

  return { evaluation, feedback, practicePlan };
};

const submitInterview = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.body.sessionId, user: req.user._id }).populate("questions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Interview session not found" });
    }

    const answers = Array.isArray(req.body.responses) ? req.body.responses : [];

    await Promise.all(answers.map((item) => {
      const answer = item.answer || "";
      return Response.findOneAndUpdate(
        { user: req.user._id, session: session._id, question: item.questionId },
        {
          user: req.user._id,
          session: session._id,
          question: item.questionId,
          answer,
          timeSpentSeconds: Number(item.timeSpentSeconds) || 0,
          wordCount: answer.trim() ? answer.trim().split(/\s+/).length : 0
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }));

    session.status = "submitted";
    session.submittedAt = new Date();
    await session.save();

    const result = await runSubmissionPipeline({ req, session });

    res.json({ success: true, session, ...result });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("questions");
    const evaluations = await Evaluation.find({ user: req.user._id });
    const scoreBySession = new Map(evaluations.map((item) => [String(item.session), item.totalScore]));

    res.json({
      success: true,
      history: sessions.map((session) => ({
        ...session.toObject(),
        totalScore: scoreBySession.get(String(session._id)) || null
      }))
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewById = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user._id }).populate("questions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Interview session not found" });
    }

    const [responses, evaluation, feedback, practicePlan] = await Promise.all([
      Response.find({ user: req.user._id, session: session._id }),
      Evaluation.findOne({ user: req.user._id, session: session._id }),
      FeedbackReport.findOne({ user: req.user._id, session: session._id }),
      PracticeTask.find({ user: req.user._id, session: session._id }).sort({ day: 1 })
    ]);

    res.json({ success: true, session, responses, evaluation, feedback, practicePlan });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  configureInterview,
  getTemplates,
  startInterview,
  saveResponse,
  submitInterview,
  getHistory,
  getInterviewById
};
