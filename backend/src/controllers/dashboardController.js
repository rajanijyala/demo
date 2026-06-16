const { getDashboardAnalytics } = require("../services/dashboardService");

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await getDashboardAnalytics(req.user._id);
    res.json({ success: true, dashboard });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
