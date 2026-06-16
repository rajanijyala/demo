const validateRequest = (rules) => (req, res, next) => {
  const errors = [];

  Object.entries(rules).forEach(([field, rule]) => {
    const value = req.body[field];

    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      return;
    }

    if (value !== undefined && rule.enum && !rule.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rule.enum.join(", ")}`);
    }

    if (value !== undefined && rule.type === "number" && Number.isNaN(Number(value))) {
      errors.push(`${field} must be a number`);
    }
  });

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

module.exports = validateRequest;
