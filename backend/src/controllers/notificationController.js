const Notification = require("../models/Notification");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications };
