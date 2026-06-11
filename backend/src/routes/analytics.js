import { Router } from 'express';
import { getDashboard } from '../controllers/analyticsController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/dashboard', auth, getDashboard);

export default router;
