import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/UserV2';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (userId: string): string =>
  jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);

const userPayload = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  plan: user.plan,
});

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ message: errors.array()[0].msg }); return; }

    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) { res.status(400).json({ message: 'Email already registered' }); return; }

    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password });
    const token = generateToken(user._id.toString());
    res.status(201).json({ token, user: userPayload(user) });
  } catch (error) { next(error); }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ message: errors.array()[0].msg }); return; }

    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' }); return;
    }

    const token = generateToken(user._id.toString());
    res.json({ token, user: userPayload(user) });
  } catch (error) { next(error); }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const user = await User.findById(userId).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json({ user: userPayload(user) });
  } catch (error) { next(error); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const { name, email } = req.body as { name: string; email: string };
    const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true }).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json({ user: userPayload(user) });
  } catch (error) { next(error); }
};
