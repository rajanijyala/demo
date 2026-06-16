const express = require("express");
const { generateFeedback, getFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);
router.post("/generate", validateRequest({ sessionId: { required: true } }), generateFeedback);
router.get("/:id", getFeedback);

module.exports = router;
