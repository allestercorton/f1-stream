import nodemailer from 'nodemailer';
import logger from './logger';

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
  if (process.env.NODE_ENV === 'development') {
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
  const { EMAIL_SERVICE, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;
  if (!EMAIL_SERVICE || !EMAIL_USERNAME || !EMAIL_PASSWORD) {
    throw new Error(
      '❌ Missing email service credentials in environment variables.'
    );
  }

  // For production, use a real email service (e.g., Gmail)
  return nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
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
      from: `F1Stream <${process.env.EMAIL_FROM || 'noreply@f1stream.vercel.app'}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log URL for Ethereal emails (development only)
    if (process.env.NODE_ENV === 'development') {
      logger.info(
        `📬 Preview Reset Password URL: ${nodemailer.getTestMessageUrl(info)}`
      );
    }
  } catch (error) {
    logger.error('❌ Failed to send email:', error);
    throw new Error('Email sending failed.');
  }
};
