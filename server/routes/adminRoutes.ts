import { Router } from 'express';
import {
  adminLogin,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
  getAdminStats,
} from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Public admin login
router.post('/login', adminLogin);

// Protected routes
router.use(authMiddleware);

router.get('/stats', getAdminStats);
router.get('/submissions', getSubmissions);
router.get('/submissions/:id', getSubmissionById);
router.patch('/submissions/:id/status', updateSubmissionStatus);
router.delete('/submissions/:id', deleteSubmission);

export default router;

