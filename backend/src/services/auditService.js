const AuditEvent = require("../models/AuditEvent");

const logAuditEvent = async ({ req, action, entityType, entityId, metadata = {} }) => {
  try {
    await AuditEvent.create({
      user: req.user?._id,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress: req.ip
    });
  } catch (error) {
    console.warn("Audit logging failed:", error.message);
  }
};

module.exports = { logAuditEvent };
