import { Router } from 'express';
import { attendance, getAttendanceRecords } from '../controllers/animal.controller';
import { upload } from '../middlewares/multer';
import { verifyJWT } from '../middlewares/verifyJwt';

const router = Router();

router.post('/attendance', verifyJWT, upload.single('image'), attendance);
router.get('/:animalId/attendance', verifyJWT, getAttendanceRecords);

export default router;
