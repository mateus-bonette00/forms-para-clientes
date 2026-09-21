import { Router } from 'express';
import { createSubmission, getPublicConfig } from '../controllers/clientController';

const router = Router();

router.post('/submissions', createSubmission);
router.get('/config', getPublicConfig);

export default router;

