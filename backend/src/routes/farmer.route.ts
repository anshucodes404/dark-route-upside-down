import { Router } from 'express';
import { attendance, getAnimalsAttendanceLogsOwnedByUserinQRpage, getAttendanceRecordsforDashboard } from '../controllers/animal.controller';
// import { upload } from '../middlewares/multer';
import { verifyJWT } from '../middlewares/verifyJwt';

const router = Router()

router.get("/today-attendance", verifyJWT, getAnimalsAttendanceLogsOwnedByUserinQRpage) //this will get today's attendance records
router.get("/all-attendance", verifyJWT, getAttendanceRecordsforDashboard) //this will get all attendance records for dashboard


export default router
