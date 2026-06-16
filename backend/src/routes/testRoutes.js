const express = require("express");
const {
  getTestMessage,
  createTestMessage
} = require("../controllers/testController");

const router = express.Router();

router.get("/", getTestMessage);
router.post("/", createTestMessage);

module.exports = router;
