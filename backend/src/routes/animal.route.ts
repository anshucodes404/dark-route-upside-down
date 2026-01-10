import { Router } from 'express';
import { attendance, getAttendanceRecords, getDashboardStats } from '../controllers/animal.controller';
import { upload } from '../middlewares/multer';
import { verifyJWT } from '../middlewares/verifyJwt';

const router = Router();

router.get('/stats', verifyJWT, getDashboardStats);
router.post('/attendance', verifyJWT, upload.single('image'), attendance);
router.get('/:animalId/attendance', verifyJWT, getAttendanceRecords);

export default router;
