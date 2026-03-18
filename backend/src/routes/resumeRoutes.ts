import { Router } from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getResumes);
router.get('/:id', getResume);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
