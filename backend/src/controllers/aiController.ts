import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as aiService from '../services/aiService';
import User from '../models/User';

const checkProPlan = async (userId: string): Promise<boolean> => {
  const user = await User.findById(userId);
  return user?.plan === 'pro';
};

export const generateSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId!;
    if (!(await checkProPlan(userId))) {
      res.status(403).json({ message: 'AI features require Pro plan' });
      return;
    }
    const result = await aiService.generateResumeSummary(req.body);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export const improveSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId!;
    if (!(await checkProPlan(userId))) {
      res.status(403).json({ message: 'AI features require Pro plan' });
      return;
    }
    const { section, content } = req.body as { section: string; content: string };
    const result = await aiService.improveSection(section, content);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export const makeATSFriendly = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId!;
    if (!(await checkProPlan(userId))) {
      res.status(403).json({ message: 'AI features require Pro plan' });
      return;
    }
    const { content } = req.body as { content: string };
    const result = await aiService.makeATSFriendly(content);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export const addActionWords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId!;
    if (!(await checkProPlan(userId))) {
      res.status(403).json({ message: 'AI features require Pro plan' });
      return;
    }
    const { content } = req.body as { content: string };
    const result = await aiService.addActionWords(content);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export const getATSScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resumeText } = req.body as { resumeText: string };
    const result = await aiService.calculateATSScore(resumeText);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export const generateFullResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId!;
    if (!(await checkProPlan(userId))) {
      res.status(403).json({ message: 'AI features require Pro plan' });
      return;
    }
    const { jobTitle, skills, yearsExp } = req.body as { jobTitle: string; skills: string[]; yearsExp: number };
    const result = await aiService.generateFullResume(jobTitle, skills, yearsExp);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};
