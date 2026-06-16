const express = require("express");
const {
  configureInterview,
  getTemplates,
  startInterview,
  saveResponse,
  submitInterview,
  getHistory,
  getInterviewById
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const configRules = {
  role: { required: true },
  experienceLevel: { required: true, enum: ["fresher", "junior", "mid", "senior"] },
  interviewType: { required: true, enum: ["technical", "behavioral", "hr", "system_design", "mixed"] }
};

router.use(protect);
router.post("/configure", validateRequest(configRules), configureInterview);
router.get("/templates", getTemplates);
router.post("/start", startInterview);
router.post("/submit", validateRequest({ sessionId: { required: true } }), submitInterview);
router.get("/history", getHistory);
router.post("/:id/responses", validateRequest({ questionId: { required: true } }), saveResponse);
router.get("/:id", getInterviewById);

module.exports = router;
