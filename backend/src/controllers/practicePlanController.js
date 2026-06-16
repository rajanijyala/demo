const InterviewSession = require("../models/InterviewSession");
const FeedbackReport = require("../models/FeedbackReport");
const PracticeTask = require("../models/PracticeTask");
const { generatePracticePlan } = require("../services/practicePlanService");

const generatePracticePlanController = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.body.sessionId, user: req.user._id });
    const feedback = await FeedbackReport.findOne({ session: req.body.sessionId, user: req.user._id });

    if (!session || !feedback) {
      return res.status(404).json({ success: false, message: "Session or feedback report not found" });
    }

    const practicePlan = await generatePracticePlan({ userId: req.user._id, session, feedback });
    res.status(201).json({ success: true, practicePlan });
  } catch (error) {
    next(error);
  }
};

const getPracticePlan = async (req, res, next) => {
  try {
    const practicePlan = await PracticeTask.find({ session: req.params.id, user: req.user._id }).sort({ day: 1 });
    res.json({ success: true, practicePlan });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePracticePlanController, getPracticePlan };
