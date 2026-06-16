const getTestMessage = (req, res) => {
  res.json({
    success: true,
    message: "Frontend connected to backend successfully"
  });
};

const createTestMessage = (req, res) => {
  res.status(201).json({
    success: true,
    message: "Backend received data successfully",
    data: req.body
  });
};

module.exports = {
  getTestMessage,
  createTestMessage
};
