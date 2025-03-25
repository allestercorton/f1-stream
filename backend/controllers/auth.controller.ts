import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { badRequest, unauthorized } from '../utils/error.response';
import { generateToken } from '../utils/token.utils';
import UserModel from '../models/user.model';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { AuthRequest } from '../types';

/**
 * @desc    Register user
 * @route   POST /api/auth/v1/register
 * @access  Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = registerSchema.parse(req.body);

    if (await UserModel.findOne({ email })) {
      return next(badRequest('User already exists'));
    }

    const user = await UserModel.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: { id: user._id, name, email, token },
    });
  }
);

/**
 * @desc    Login user
 * @route   POST /api/auth/v1/login
 * @access  Public
 */
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.isPasswordMatch(password))) {
      return next(unauthorized('Invalid email or password'));
    }

    const token = generateToken(user);

    res.json({
      success: true,
      data: { id: user._id, name: user.name, email, token },
    });
  }
);

/**
 * @desc    Get current user profile
 * @route   POST /api/auth/v1/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { _id, name, email } = req.user!;
    res.json({
      success: true,
      data: { id: _id, name, email },
    });
  }
);
