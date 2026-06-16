const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const v1Routes = require("./routes/v1Routes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is running"
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is running"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/v1", v1Routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
