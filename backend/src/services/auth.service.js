import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import { generateTokenPair, verifyToken } from '../helpers/jwt.js';
import ApiError from '../utils/ApiError.js';
import db from '../models/index.js';
import { sendEmail } from '../helpers/email.js';

/**
 * Register new business
 */
export const registerBusiness = async (data) => {
  const { businessName, email, phone, password, address, taxId } = data;

  // Check if email already exists
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  // Start transaction
  const transaction = await db.sequelize.transaction();

  try {
    // Create business
    const business = await db.Business.create(
      {
        name: businessName,
        email,
        phone,
        address,
        taxId,
        status: 'active',
      },
      { transaction }
    );

    // Get Super Admin role
    const superAdminRole = await db.Role.findOne({
      where: { name: 'Super Admin' },
    });

    if (!superAdminRole) {
      throw new Error('Super Admin role not found');
    }

    // Create user
    const user = await db.User.create(
      {
        businessId: business.id,
        roleId: superAdminRole.id,
        name: businessName,
        email,
        phone,
        password,
        status: 'active',
      },
      { transaction }
    );

    // Create default branch
    const branch = await db.Branch.create(
      {
        businessId: business.id,
        name: 'Main Branch',
        phone,
        address: address || 'Main Branch',
        city: 'Nairobi',
        status: 'active',
      },
      { transaction }
    );

    // Update user with branch
    await user.update({ branchId: branch.id }, { transaction });

    // Commit transaction
    await transaction.commit();

    return {
      business: business.toJSON(),
      user: user.toSafeObject(),
      branch: branch.toJSON(),
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (email, password) => {
  // Find user
  const user = await db.User.findOne({
    where: { email },
    include: [
      {
        model: db.Role,
        as: 'role',
        include: [
          {
            model: db.Permission,
            as: 'permissions',
          },
        ],
      },
      {
        model: db.Business,
        as: 'business',
      },
    ],
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    throw ApiError.unauthorized('Account is not active');
  }

  // Check if business is active
  if (!user.business.isActive) {
    throw ApiError.unauthorized('Business account is suspended');
  }

  // Generate tokens
  const tokens = generateTokenPair({
    id: user.id,
    email: user.email,
    tenantId: user.tenantId,
    roleId: user.roleId,
  });

  // Update refresh token and last login
  await user.update({
    refreshToken: tokens.refreshToken,
    lastLoginAt: new Date(),
    lastLoginIp: null, // Will be set from request
  });

  return {
    user: user.toSafeObject(),
    role: user.role,
    business: user.business,
    branch: user.branch,
    tokens,
  };
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    // Find user
    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    // Check if refresh token matches
    if (user.refreshToken !== refreshToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw ApiError.unauthorized('Account is not active');
    }

    // Generate new token pair
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      businessId: user.businessId,
      roleId: user.roleId,
    });

    // Update refresh token
    await user.update({
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
};

/**
 * Logout user
 */
export const logout = async (userId) => {
  const user = await db.User.findByPk(userId);

  if (user) {
    await user.update({
      refreshToken: null,
    });
  }

  return true;
};

/**
 * Change password
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  // Update password
  await user.update({
    password: newPassword,
  });

  return true;
};

export default {
  registerBusiness,
  login,
  refreshAccessToken,
  logout,
  changePassword,
};

/**
 * Send email verification
 */
export const sendEmailVerification = async (userId) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (user.emailVerified) {
    throw ApiError.badRequest('Email already verified');
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await user.update({
    emailVerificationToken: verificationToken,
    emailVerificationExpiry: verificationTokenExpiry,
  });

  // Send verification email
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      template: 'email-verification',
      data: {
        name: user.name,
        verificationUrl,
      },
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }

  return true;
};

/**
 * Verify email
 */
export const verifyEmail = async (token) => {
  const user = await db.User.findOne({
    where: {
      emailVerificationToken: token,
    },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid verification token');
  }

  if (new Date() > user.emailVerificationExpiry) {
    throw ApiError.badRequest('Verification token has expired');
  }

  await user.update({
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpiry: null,
  });

  return true;
};

/**
 * Forgot password
 */
export const forgotPassword = async (email) => {
  const user = await db.User.findOne({ where: { email } });

  if (!user) {
    // Don't reveal that email doesn't exist
    return true;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await user.update({
    passwordResetToken: resetToken,
    passwordResetExpiry: resetTokenExpiry,
  });

  // Send reset email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      data: {
        name: user.name,
        resetUrl,
      },
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }

  return true;
};

/**
 * Reset password
 */
export const resetPassword = async (token, newPassword) => {
  const user = await db.User.findOne({
    where: {
      passwordResetToken: token,
    },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid reset token');
  }

  if (new Date() > user.passwordResetExpiry) {
    throw ApiError.badRequest('Reset token has expired');
  }

  // Update password
  await user.update({
    password: newPassword,
    passwordResetToken: null,
    passwordResetExpiry: null,
    refreshToken: null, // Logout from all devices
  });

  return true;
};

/**
 * Enable 2FA
 */
export const enableTwoFactor = async (userId) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (user.twoFactorEnabled) {
    throw ApiError.badRequest('2FA is already enabled');
  }

  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `GroceryOS (${user.email})`,
    length: 32,
  });

  await user.update({
    twoFactorSecret: secret.base32,
  });

  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url,
  };
};

/**
 * Verify and activate 2FA
 */
export const verifyTwoFactor = async (userId, token) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (!user.twoFactorSecret) {
    throw ApiError.badRequest('2FA setup not initiated');
  }

  // Verify token
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!verified) {
    throw ApiError.badRequest('Invalid 2FA code');
  }

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex')
  );

  await user.update({
    twoFactorEnabled: true,
    twoFactorBackupCodes: JSON.stringify(backupCodes),
  });

  return { backupCodes };
};

/**
 * Disable 2FA
 */
export const disableTwoFactor = async (userId, password) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (!user.twoFactorEnabled) {
    throw ApiError.badRequest('2FA is not enabled');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid password');
  }

  await user.update({
    twoFactorEnabled: false,
    twoFactorSecret: null,
    twoFactorBackupCodes: null,
  });

  return true;
};

/**
 * Verify 2FA code during login
 */
export const verifyTwoFactorLogin = async (userId, token) => {
  const user = await db.User.findByPk(userId);

  if (!user || !user.twoFactorEnabled) {
    throw ApiError.badRequest('2FA not enabled for this user');
  }

  // Check if it's a backup code
  const backupCodes = user.twoFactorBackupCodes ? JSON.parse(user.twoFactorBackupCodes) : [];

  if (backupCodes.includes(token)) {
    // Remove used backup code
    const remainingCodes = backupCodes.filter(code => code !== token);
    await user.update({
      twoFactorBackupCodes: JSON.stringify(remainingCodes),
    });
    return true;
  }

  // Verify TOTP code
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!verified) {
    throw ApiError.unauthorized('Invalid 2FA code');
  }

  return true;
};
