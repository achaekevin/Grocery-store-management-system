import bcrypt from 'bcryptjs';
import { generateTokenPair, verifyToken } from '../helpers/jwt.js';
import ApiError from '../utils/ApiError.js';
import db from '../models/index.js';

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
      {
        model: db.Branch,
        as: 'branch',
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
  if (user.status !== 'active') {
    throw ApiError.unauthorized('Account is not active');
  }

  // Check if business is active
  if (user.business.status !== 'active') {
    throw ApiError.unauthorized('Business account is suspended');
  }

  // Generate tokens
  const tokens = generateTokenPair({
    id: user.id,
    email: user.email,
    businessId: user.businessId,
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
