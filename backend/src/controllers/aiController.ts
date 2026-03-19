import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import * as aiService from '../services/aiService';

// Lazy-load pdf-parse to avoid test-file path issues at startup
let pdfParse: ((buffer: Buffer) => Promise<{ text: string }>) | null = null;
const getPdfParse = async () => {
  if (!pdfParse) {
    const mod = await import('pdf-parse');
    pdfParse = (mod.default || mod) as any;
  }
  return pdfParse!;
};

// Multer: memory storage for PDF uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

// POST /api/ai/ats-analyze
export const atsAnalyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let resumeText: string = req.body.resumeText || '';
    const jobDescription: string = req.body.jobDescription || '';
    const multerReq = req as any;

    if (multerReq.file) {
      try {
        const parse = await getPdfParse();
        const parsed = await parse(multerReq.file.buffer);
        resumeText = parsed.text;
        if (!resumeText.trim()) {
          res.status(400).json({ message: 'Could not extract text from PDF. Try a text-based PDF or paste your resume text.' });
          return;
        }
      } catch (pdfErr) {
        res.status(400).json({ message: 'Failed to parse PDF. Please paste your resume text instead.' });
        return;
      }
    }

    if (!resumeText.trim()) {
      res.status(400).json({ message: 'Resume text or PDF is required' });
      return;
    }

    const result = await aiService.fullATSAnalysis(resumeText, jobDescription || undefined);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/generate-summary
export const generateSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await aiService.generateResumeSummary(req.body);
    res.json({ result });
  } catch (error) { next(error); }
};

// POST /api/ai/improve-section
export const improveSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { section, content } = req.body as { section: string; content: string };
    const result = await aiService.improveSection(section, content);
    res.json({ result });
  } catch (error) { next(error); }
};

// POST /api/ai/generate-resume
export const generateFullResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { jobTitle, skills, yearsExp } = req.body as { jobTitle: string; skills: string[]; yearsExp: number };
    const result = await aiService.generateFullResume(jobTitle, skills, yearsExp);
    res.json({ result });
  } catch (error) { next(error); }
};

// Legacy stubs
export const makeATSFriendly = async (_req: Request, res: Response): Promise<void> => { res.json({ result: '' }); };
export const addActionWords   = async (_req: Request, res: Response): Promise<void> => { res.json({ result: '' }); };
export const getATSScore      = async (_req: Request, res: Response): Promise<void> => { res.json({ result: { score: 0, suggestions: [] } }); };
