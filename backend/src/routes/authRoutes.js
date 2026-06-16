const express = require("express");
const {
  register,
  verifyRegisterOtp,
  login,
  verifyLoginOtp,
  profile
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-register-otp", verifyRegisterOtp);
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOtp);
router.get("/profile", protect, profile);

module.exports = router;
