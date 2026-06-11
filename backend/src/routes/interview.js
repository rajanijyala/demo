import { Router } from 'express';
import {
  generateInterview,
  startInterview,
  submitAnswer,
  finishInterview,
  getInterview,
  getUserInterviews,
} from '../controllers/interviewController.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { generateInterviewSchema, submitAnswerSchema } from '../validators/interview.js';

const router = Router();

router.post('/generate', auth, validate(generateInterviewSchema), generateInterview);
router.post('/start/:id', auth, startInterview);
router.post('/answer', auth, validate(submitAnswerSchema), submitAnswer);
router.post('/finish/:id', auth, finishInterview);
router.get('/list', auth, getUserInterviews);
router.get('/:id', auth, getInterview);

export default router;
