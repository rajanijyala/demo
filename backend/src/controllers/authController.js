const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

const otpExpiryDate = () => {
  const minutes = Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10;
  return new Date(Date.now() + minutes * 60 * 1000);
};

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "candidate",
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const sendOtpToUser = async (user, purpose) => {
  const otp = generateOtp();
  user.otp = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = otpExpiryDate();
  await user.save();

  const appName = process.env.APP_NAME || "Auth App";
  const subject = purpose === "login" ? "Your login OTP" : "Verify your email";

  try {
    await sendEmail({
      to: user.email,
      subject,
      text: `Your ${appName} OTP is ${otp}. It expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>${subject}</h2>
          <p>Your OTP is:</p>
          <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
          <p>This OTP expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.</p>
        </div>
      `
    });

    return { emailSent: true };
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn(`Email sending failed. Development OTP for ${user.email}: ${otp}`);

    return {
      emailSent: false,
      devOtp: otp,
      emailError: error.message
    };
  }
};

const verifyOtpForUser = async (email, otp) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+otp +otpExpiresAt");

  if (!user) {
    return { errorStatus: 404, errorMessage: "User not found" };
  }

  if (!user.otp || !user.otpExpiresAt) {
    return { errorStatus: 400, errorMessage: "OTP not found. Please request a new OTP." };
  }

  if (user.otpExpiresAt < new Date()) {
    return { errorStatus: 400, errorMessage: "OTP has expired. Please request a new OTP." };
  }

  const isOtpValid = await bcrypt.compare(otp, user.otp);

  if (!isOtpValid) {
    return { errorStatus: 400, errorMessage: "Invalid OTP" };
  }

  user.otp = undefined;
  user.otpExpiresAt = undefined;

  return { user };
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail }).select("+password");

    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        existingUser.name = name;
        existingUser.password = await bcrypt.hash(password, 10);
        const otpResult = await sendOtpToUser(existingUser, "register");

        return res.status(200).json({
          success: true,
          message: otpResult.emailSent
            ? "Account already exists but is not verified. A new OTP has been sent to your email."
            : "Account is not verified. SMTP failed, so use the development OTP shown here.",
          devOtp: otpResult.devOtp
        });
      }

      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: false
    });

    const otpResult = await sendOtpToUser(user, "register");

    return res.status(201).json({
      success: true,
      message: otpResult.emailSent
        ? "Registration successful. OTP sent to your email."
        : "Registration successful. SMTP failed, so use the development OTP shown here.",
      devOtp: otpResult.devOtp
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
};

const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const result = await verifyOtpForUser(email, otp);

    if (result.errorMessage) {
      return res.status(result.errorStatus).json({
        success: false,
        message: result.errorMessage
      });
    }

    result.user.isEmailVerified = true;
    await result.user.save();

    const token = generateToken(result.user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: safeUser(result.user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "OTP verification failed"
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isEmailVerified) {
      const otpResult = await sendOtpToUser(user, "register");

      return res.status(403).json({
        success: false,
        message: otpResult.emailSent
          ? "Please verify your email first. A new registration OTP has been sent."
          : "Please verify your email first. SMTP failed, so use the development OTP shown here.",
        needsEmailVerification: true,
        devOtp: otpResult.devOtp
      });
    }

    const otpResult = await sendOtpToUser(user, "login");

    return res.status(200).json({
      success: true,
      message: otpResult.emailSent
        ? "Login OTP sent to your email"
        : "SMTP failed, so use the development OTP shown here.",
      devOtp: otpResult.devOtp
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed"
    });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const result = await verifyOtpForUser(email, otp);

    if (result.errorMessage) {
      return res.status(result.errorStatus).json({
        success: false,
        message: result.errorMessage
      });
    }

    await result.user.save();

    const token = generateToken(result.user._id);

    return res.status(200).json({
      success: true,
      message: "Login verified successfully",
      token,
      user: safeUser(result.user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login OTP verification failed"
    });
  }
};

const profile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: safeUser(req.user)
  });
};

module.exports = {
  register,
  verifyRegisterOtp,
  login,
  verifyLoginOtp,
  profile
};
