import { Request, Response, NextFunction } from 'express';
import Resume from '../models/Resume';
import { AuthRequest } from '../middleware/authMiddleware';

export const getResumes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    res.json({ resumes });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const resume = await Resume.findOne({ _id: req.params.id, userId });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ resume });
  } catch (error) {
    next(error);
  }
};

export const createResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const resume = await Resume.create({ userId, ...req.body });
    res.status(201).json({ resume });
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ resume });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};
