const { eventSchema } = require("../schema/event.schema");

const validateEvent = (req, res, next) => {
  try {
    eventSchema.parse(req.body); // Validate request body
    next();
  } catch (error) {
    res.status(400).json({
      message: "Validation error",
      errors: error.errors.map((err) => ({
        path: err.path,
        message: err.message,
      })),
    });
  }
};

module.exports = {
  validateEvent,
};
