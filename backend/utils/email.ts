import nodemailer from 'nodemailer';
import logger from './logger.js';
import env from '../config/env.js';

// NOTE: if the NODE_ENV is set to development check your server terminal, if production check the email.

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

/**
 * Creates a mail transporter based on the environment
 * - Uses Ethereal for testing in development
 * - Uses a real email service in production
 * @returns {Promise<nodemailer.Transporter>} Configured transporter
 */
const createTransporter = async (): Promise<nodemailer.Transporter> => {
  // For development, user Ethereal (fake SMTP service)
  if (env.server.mode === 'development') {
    // Generate test SMTP service account from ethereal email.
    const testAccount = await nodemailer.createTestAccount();

    // Create a SMTP transporter object
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Validate environment variables for email services
  if (!env.email.service || !env.email.username || !env.email.password) {
    throw new Error(
      '❌ Missing email service credentials in environment variables.'
    );
  }

  // For production, use a real email service (e.g., Gmail)
  return nodemailer.createTransport({
    service: env.email.service,
    auth: {
      user: env.email.username,
      pass: env.email.password,
    },
  });
};

/**
 * Sends an email using the configured transporter
 * @params {EmailOptions} options - Email details (recipient, subject, message)
 * @returns {promise<void>}
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = await createTransporter();

    // Define email options
    const mailOptions = {
      from: `F1Stream <${env.email.from || 'noreply@f1stream.vercel.app'}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log URL for Ethereal emails (development only)
    if (env.server.mode === 'development') {
      logger.info(
        `📬 Preview Reset Password URL: ${nodemailer.getTestMessageUrl(info)}`
      );
    }
  } catch (error) {
    logger.error('❌ Failed to send email:', error);
    throw new Error('Email sending failed.');
  }
};
