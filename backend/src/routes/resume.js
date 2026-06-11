import { Router } from 'express';
import { uploadResume, getResumes, deleteResume } from '../controllers/resumeController.js';
import auth from '../middlewares/auth.js';
import { uploadResume as uploadResumeMiddleware } from '../middlewares/upload.js';

const router = Router();

router.post('/upload', auth, uploadResumeMiddleware, uploadResume);
router.get('/', auth, getResumes);
router.delete('/:id', auth, deleteResume);

export default router;
