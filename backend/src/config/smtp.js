const nodemailer = require("nodemailer");

const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpPass = process.env.SMTP_PASS
  ? process.env.SMTP_PASS.replace(/\s+/g, "")
  : "";

const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: smtpPass
  }
});

module.exports = smtpTransporter;
