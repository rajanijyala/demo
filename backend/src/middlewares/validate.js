import ApiError from '../utils/ApiError.js';

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(', ');
    return next(new ApiError(400, message));
  }
  req.body = result.data;
  next();
};

export default validate;
