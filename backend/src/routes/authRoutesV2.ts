import { Router } from 'express';
import {
  register, login, getMe, updateProfile,
  registerValidation, loginValidation,
} from '../controllers/authControllerV2';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
