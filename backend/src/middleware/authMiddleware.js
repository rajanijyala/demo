const jwt = require("jsonwebtoken");
const User = require("../models/User");

const DEV_BYPASS_TOKEN = "dev-bypass-token";

const canBypassAuth = () => process.env.AUTH_BYPASS === "true";

const getDevUser = async () =>
  User.findOneAndUpdate(
    { email: "demo.candidate@example.com" },
    {
      $setOnInsert: {
        name: "Demo Candidate",
        email: "demo.candidate@example.com",
        password: "dev-bypass-password",
        isEmailVerified: true,
        role: "candidate"
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

    if (token === DEV_BYPASS_TOKEN && canBypassAuth()) {
      req.user = await getDevUser();
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired"
    });
  }
};

const authorize = (...allowedRoles) => (req, res, next) => {
  const role = req.user?.role || "candidate";

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action"
    });
  }

  next();
};

module.exports = { protect, authorize };
