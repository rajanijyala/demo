import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF, JPEG, PNG, and WebP files are allowed'), false);
  }
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('resume');

export const uploadAvatar = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const imageMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (imageMimes.includes(file.mimetype)) cb(null, true);
    else cb(new ApiError(400, 'Only image files are allowed'), false);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('avatar');
