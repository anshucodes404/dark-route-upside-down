import { Router } from 'express';
import { attendance, getHealthRecordsOftheAnimalInitiatedByVet } from '../controllers/animal.controller';
import { upload } from '../middlewares/multer';
import { verifyJWT } from '../middlewares/verifyJwt';

const router = Router();

router.post('/attendance', verifyJWT, upload.single('image'), attendance);
router.get('/:tagId/health-records', verifyJWT, getHealthRecordsOftheAnimalInitiatedByVet);

export default router;
