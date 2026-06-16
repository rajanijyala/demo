const express = require("express");
const { generatePracticePlanController, getPracticePlan } = require("../controllers/practicePlanController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);
router.post("/generate", validateRequest({ sessionId: { required: true } }), generatePracticePlanController);
router.get("/:id", getPracticePlan);

module.exports = router;
