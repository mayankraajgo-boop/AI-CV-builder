import { Router } from 'express';
import {
  generateSummary,
  improveSection,
  makeATSFriendly,
  addActionWords,
  getATSScore,
  generateFullResume,
} from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/generate-summary', generateSummary);
router.post('/improve-section', improveSection);
router.post('/ats-friendly', makeATSFriendly);
router.post('/action-words', addActionWords);
router.post('/ats-score', getATSScore);
router.post('/generate-resume', generateFullResume);

export default router;
