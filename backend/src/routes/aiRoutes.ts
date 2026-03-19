import { Router } from 'express';
import {
  atsAnalyze, upload,
  generateSummary, improveSection,
  makeATSFriendly, addActionWords, getATSScore,
  generateFullResume,
} from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Full ATS analysis — accepts JSON body OR multipart PDF upload
// Use multer conditionally: only parse multipart, skip for JSON
router.post('/ats-analyze', (req, res, next) => {
  const ct = req.headers['content-type'] || '';
  if (ct.includes('multipart/form-data')) {
    upload.single('resume')(req, res, next);
  } else {
    next();
  }
}, atsAnalyze);

// Other AI endpoints
router.post('/generate-summary', generateSummary);
router.post('/improve-section',  improveSection);
router.post('/ats-friendly',     makeATSFriendly);
router.post('/action-words',     addActionWords);
router.post('/ats-score',        getATSScore);
router.post('/generate-resume',  generateFullResume);

export default router;
