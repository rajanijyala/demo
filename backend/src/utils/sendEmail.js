const smtpTransporter = require("../config/smtp");

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP settings are missing in environment variables");
  }

  try {
    await smtpTransporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    });
  } catch (error) {
    if (error.code === "EAUTH" || error.responseCode === 535) {
      throw new Error(
        "Gmail SMTP login failed. Use a valid Gmail App Password for SMTP_PASS, not your normal Gmail password."
      );
    }

    throw error;
  }
};

module.exports = sendEmail;
