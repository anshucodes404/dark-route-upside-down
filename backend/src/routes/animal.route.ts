import { Router } from 'express';
import { attendance } from '../controllers/animal.controller';
import { upload } from '../middlewares/multer';
import { verifyJWT } from '../middlewares/verifyJwt';

const router = Router();

router.post('/attendance', verifyJWT, upload.single('image'), attendance); //this will handle animal attendance

export default router;
