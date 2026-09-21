import { Router } from 'express';
import { getUploadSignature } from '../controllers/uploadController';

const router = Router();

router.get('/signature', getUploadSignature);

export default router;

