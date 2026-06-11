import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js';
import cloudinary from '../config/cloudinary.js';

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ fullName, email, password });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    success: true,
    data: { user, accessToken, refreshToken },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    data: { user, accessToken, refreshToken },
  });
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  const updates = {};

  if (fullName) updates.fullName = fullName;
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) throw new ApiError(409, 'Email already in use');
    updates.email = email;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ success: true, data: user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'ai-interview-mocker/avatars',
    transformation: [{ width: 200, height: 200, crop: 'fill' }],
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true },
  );

  res.json({ success: true, data: user });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new ApiError(400, 'Refresh token is required');

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.json({
    success: true,
    data: { accessToken, refreshToken: newRefreshToken },
  });
});
