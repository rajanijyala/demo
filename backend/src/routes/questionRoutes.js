const express = require("express");
const { generateQuestions, getQuestions } = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/generate", generateQuestions);
router.get("/", getQuestions);

module.exports = router;
