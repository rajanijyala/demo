import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/token.js';
import User from '../models/User.js';

const auth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token is required');
    }

    const token = header.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password -refreshToken');

    if (!user) throw new ApiError(401, 'User not found');

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, 'Invalid or expired token'));
  }
};

export default auth;
