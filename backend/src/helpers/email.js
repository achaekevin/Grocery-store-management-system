import nodemailer from 'nodemailer';
import config from '../config/index.js';
import logger from '../config/logger.js';

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
};

/**
 * Send email
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${config.email.from.name} <${config.email.from.email}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, token, name) => {
  const verificationUrl = `${config.app.frontendUrl}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ${config.app.name}!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html,
    text: `Welcome to ${config.app.name}! Please verify your email by visiting: ${verificationUrl}`,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, token, name) => {
  const resetUrl = `${config.app.frontendUrl}/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
    text: `You requested to reset your password. Visit: ${resetUrl}`,
  });
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email, name, businessName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ${config.app.name}!</h2>
      <p>Hello ${name},</p>
      <p>Your ${businessName} account has been successfully created.</p>
      <p>You can now start managing your grocery store with our comprehensive features:</p>
      <ul>
        <li>Product Management</li>
        <li>Inventory Tracking</li>
        <li>Point of Sale (POS)</li>
        <li>Sales Reports</li>
        <li>Customer Management</li>
        <li>And much more!</li>
      </ul>
      <a href="${config.app.frontendUrl}/login" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
        Login Now
      </a>
      <p>If you need help, feel free to contact our support team.</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Welcome to ${config.app.name}!`,
    html,
    text: `Welcome to ${config.app.name}! Your account has been created successfully.`,
  });
};

/**
 * Send low stock alert email
 */
export const sendLowStockAlert = async (email, products) => {
  const productList = products
    .map((p) => `<li>${p.name} - Current Stock: ${p.quantity}</li>`)
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Low Stock Alert</h2>
      <p>The following products are running low on stock:</p>
      <ul>${productList}</ul>
      <p>Please restock these items soon.</p>
      <a href="${config.app.frontendUrl}/inventory" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
        View Inventory
      </a>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Low Stock Alert',
    html,
    text: `Low stock alert for ${products.length} product(s).`,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendLowStockAlert,
};
