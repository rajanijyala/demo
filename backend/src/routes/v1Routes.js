const express = require("express");
const interviewRoutes = require("./interviewRoutes");
const questionRoutes = require("./questionRoutes");
const evaluationRoutes = require("./evaluationRoutes");
const feedbackRoutes = require("./feedbackRoutes");
const practicePlanRoutes = require("./practicePlanRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const notificationRoutes = require("./notificationRoutes");
const resumeInterviewRoutes = require("./resumeInterviewRoutes");

const router = express.Router();

router.use("/interview", interviewRoutes);
router.use("/questions", questionRoutes);
router.use("/evaluation", evaluationRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/practice-plan", practicePlanRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/notifications", notificationRoutes);
router.use("/resume-interview", resumeInterviewRoutes);

module.exports = router;
