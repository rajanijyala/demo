import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  refreshToken,
} from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../validators/auth.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../middlewares/upload.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', auth, logout);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validate(updateProfileSchema), updateProfile);
router.put('/change-password', auth, validate(changePasswordSchema), changePassword);
router.post('/upload-avatar', auth, uploadAvatarMiddleware, uploadAvatar);
router.post('/refresh-token', refreshToken);

export default router;
