import nodemailer from 'nodemailer';
import config from '../config/index.js';
import logger from '../config/logger.js';

// Create reusable transporter
let transporter = null;

// Initialize transporter lazily
const getTransporter = () => {
  if (!transporter) {
    try {
      transporter = nodemailer.createTransporter({
        host: config.email?.host || 'smtp.gmail.com',
        port: config.email?.port || 587,
        secure: config.email?.port === 465,
        auth: {
          user: config.email?.user,
          pass: config.email?.password,
        },
      });
    } catch (error) {
      logger.warn('Email transporter not configured:', error.message);
      transporter = null;
    }
  }
  return transporter;
};

// Email templates
const templates = {
  'email-verification': (data) => ({
    subject: 'Verify Your Email - GroceryOS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to GroceryOS!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p>${data.verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">GroceryOS - Grocery Store Management System</p>
      </div>
    `,
    text: `Hi ${data.name},\n\nPlease verify your email by visiting: ${data.verificationUrl}\n\nThis link will expire in 24 hours.`,
  }),

  'password-reset': (data) => ({
    subject: 'Reset Your Password - GroceryOS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <div style="margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p>${data.resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">GroceryOS - Grocery Store Management System</p>
      </div>
    `,
    text: `Hi ${data.name},\n\nReset your password by visiting: ${data.resetUrl}\n\nThis link will expire in 1 hour.`,
  }),

  'welcome': (data) => ({
    subject: 'Welcome to GroceryOS!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to GroceryOS!</h2>
        <p>Hi ${data.name},</p>
        <p>Your account has been successfully created.</p>
        <p>You can now start managing your grocery store with our comprehensive management system.</p>
        <div style="margin: 30px 0;">
          <a href="${config.frontendUrl}/login" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Login Now
          </a>
        </div>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">GroceryOS - Grocery Store Management System</p>
      </div>
    `,
    text: `Hi ${data.name},\n\nWelcome to GroceryOS! Your account has been successfully created.`,
  }),
};

/**
 * Send email
 */
export const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const trans = getTransporter();
    if (!trans) {
      logger.warn('Email not sent: transporter not configured');
      return { success: false, error: 'Email not configured' };
    }

    // Use template if provided
    let emailContent = { subject, html, text };

    if (template && templates[template]) {
      emailContent = {
        ...emailContent,
        ...templates[template](data),
      };
    }

    const mailOptions = {
      from: `"${config.email?.from || 'GroceryOS'}" <${config.email?.user}>`,
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html || html,
      text: emailContent.text || text,
    };

    const info = await trans.sendMail(mailOptions);

    logger.info(`Email sent: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send bulk emails
 */
export const sendBulkEmails = async (emails) => {
  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return {
    total: emails.length,
    successful,
    failed,
  };
};

/**
 * Verify email configuration
 */
export const verifyEmailConfig = async () => {
  try {
    const trans = getTransporter();
    if (!trans) {
      logger.warn('Email not configured');
      return false;
    }
    await trans.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed:', error);
    return false;
  }
};

export default {
  sendEmail,
  sendBulkEmails,
  verifyEmailConfig,
};
