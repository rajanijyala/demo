const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

const getHealth = (req, res) => {
  res.json({
    success: true,
    message: "Health check successful",
    services: {
      api: "running",
      mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      cloudinary: cloudinary.config().cloud_name ? "configured" : "not configured"
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealth
};
