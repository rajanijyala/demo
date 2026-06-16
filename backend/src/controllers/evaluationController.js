const InterviewSession = require("../models/InterviewSession");
const Response = require("../models/Response");
const Evaluation = require("../models/Evaluation");
const { generateEvaluation } = require("../services/evaluationService");

const generateEvaluationController = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.body.sessionId, user: req.user._id });

    if (!session) {
      return res.status(404).json({ success: false, message: "Interview session not found" });
    }

    const responses = await Response.find({ user: req.user._id, session: session._id }).populate("question");
    const evaluation = await generateEvaluation({ userId: req.user._id, sessionId: session._id, responses });

    res.status(201).json({ success: true, evaluation });
  } catch (error) {
    next(error);
  }
};

const getEvaluation = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findOne({ _id: req.params.id, user: req.user._id });

    if (!evaluation) {
      return res.status(404).json({ success: false, message: "Evaluation not found" });
    }

    res.json({ success: true, evaluation });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateEvaluationController, getEvaluation };
