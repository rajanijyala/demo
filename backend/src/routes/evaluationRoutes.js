const express = require("express");
const { generateEvaluationController, getEvaluation } = require("../controllers/evaluationController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);
router.post("/generate", validateRequest({ sessionId: { required: true } }), generateEvaluationController);
router.get("/:id", getEvaluation);

module.exports = router;
