const InterviewSession = require("../models/InterviewSession");
const Evaluation = require("../models/Evaluation");
const FeedbackReport = require("../models/FeedbackReport");
const { generateFeedbackReport } = require("../services/feedbackService");

const generateFeedback = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.body.sessionId, user: req.user._id });
    const evaluation = await Evaluation.findOne({ session: req.body.sessionId, user: req.user._id });

    if (!session || !evaluation) {
      return res.status(404).json({ success: false, message: "Session or evaluation not found" });
    }

    const feedback = await generateFeedbackReport({ userId: req.user._id, session, evaluation });
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const feedback = await FeedbackReport.findOne({ _id: req.params.id, user: req.user._id });

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback report not found" });
    }

    res.json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateFeedback, getFeedback };
