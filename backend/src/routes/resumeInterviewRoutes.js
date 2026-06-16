const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { startResumeInterview, uploadResume } = require("../controllers/resumeInterviewController");

const router = express.Router();

router.use(protect);
router.post("/start", uploadResume, startResumeInterview);

module.exports = router;
