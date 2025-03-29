import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { loginSchema, registerSchema } from '../utils/validation';
import UserModel from '../models/user.model';
import { generateToken } from '../utils/token';
import { AuthRequest } from '../types';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate the request body
    const { email, ...rest } = registerSchema.parse(req.body);
    const lowerCaseEmail = email.toLowerCase();

    // Check if user already exists
    const userExists = await UserModel.exists({ email: lowerCaseEmail });
    if (userExists) {
      throw createHttpError(400, 'User already exists');
    }

    // Create user
    const user = await UserModel.create({ email: lowerCaseEmail, ...rest });
    if (!user) {
      throw createHttpError(500, 'User registration failed');
    }

    // Generate token
    const token = generateToken({ id: user._id.toString() });

    // Respond with user data and token
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  }
);

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate the request body
  const { email, password } = loginSchema.parse(req.body);
  const lowerCaseEmail = email.toLowerCase();

  // Find user by email
  const user = await UserModel.findOne({ email: lowerCaseEmail });

  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Generate token
  const token = generateToken({ id: user._id.toString() });

  // Respond with user data and token
  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { _id, name, email } = req.user!;
    res.status(200).json({ id: _id, name, email });
  }
);
