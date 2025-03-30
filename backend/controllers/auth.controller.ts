import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation';
import UserModel from '../models/user.model';
import { generateToken } from '../utils/token';
import { AuthRequest } from '../types';
import { sendEmail } from '../utils/email';
import PasswordResetTokenModel from '../models/token.model';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, ...rest } = registerSchema.parse(req.body);
    const lowerCaseEmail = email.toLowerCase();

    // Check if user already exists
    const userExists = await UserModel.exists({ email: lowerCaseEmail });
    if (userExists) {
      throw createHttpError(400, 'Email address already registered.');
    }

    // create user and verify if success
    const user = await UserModel.create({ email: lowerCaseEmail, ...rest });
    if (!user) {
      throw createHttpError(500, 'Account creation failed. Please try again.');
    }

    // Generate token
    const token = generateToken({ id: user._id.toString() });

    res.status(201).json({
      success: true,
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
  const { email, password } = loginSchema.parse(req.body);
  const lowerCaseEmail = email.toLowerCase();

  // Find user by email and verify if user exist and password is correct
  const user = await UserModel.findOne({ email: lowerCaseEmail });
  if (!user || !(await user.comparePassword(password))) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  // Generate token
  const token = generateToken({ id: user._id.toString() });

  res.status(200).json({
    success: true,
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

/**
 * @desc    Forgot password - send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'No user found with that email.');
    }

    // Remove any existing reset tokens for the user
    await PasswordResetTokenModel.deleteMany({ user: user._id });

    // Generate new reset token and save to MongoDB
    const resetToken = PasswordResetTokenModel.generateResetToken();
    await PasswordResetTokenModel.create({
      user: user._id,
      token: resetToken,
    });

    // Create reset URL and email content
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    try {
      // Send password reset email
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      // If email sending fails, remove the token
      await PasswordResetTokenModel.deleteMany({ user: user._id });
      throw createHttpError(500, 'Email could not be sent.');
    }
  }
);

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = resetPasswordSchema.parse(req.body);

    // Find token in MongoDB
    const resetToken = await PasswordResetTokenModel.findOne({ token });
    if (!resetToken) {
      throw createHttpError(400, 'Invalid or expired token.');
    }

    // Find user and select password field
    const user = await UserModel.findById(resetToken.user).select('+password');
    if (!user) {
      throw createHttpError(404, 'User not found.');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete token after successful password reset
    await PasswordResetTokenModel.deleteMany({ user: user._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  }
);
