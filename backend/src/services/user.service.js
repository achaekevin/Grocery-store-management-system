import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Create a new user
 */
export const createUser = async (userData) => {
  try {
    // Check if email already exists
    const existingUser = await db.User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Create user
    const user = await db.User.create(userData);

    return user.toSafeObject();
  } catch (error) {
    logger.error('Create user failed:', error);
    throw error;
  }
};

/**
 * Get all users with filters
 */
export const getUsers = async (filters, pagination) => {
  const {
    search,
    branchId,
    roleId,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const { limit, offset } = pagination;

  const where = {};

  // Text search
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filters
  if (branchId) where.branchId = branchId;
  if (roleId) where.roleId = roleId;
  if (status) where.status = status;

  const { count, rows } = await db.User.findAndCountAll({
    where,
    include: [
      { model: db.Role, as: 'role', attributes: ['id', 'name'] },
      { model: db.Branch, as: 'branch', attributes: ['id', 'name'] },
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
    attributes: { exclude: ['password', 'twoFactorSecret', 'refreshToken'] },
  });

  return { count, users: rows };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  const user = await db.User.findByPk(userId, {
    include: [
      {
        model: db.Role,
        as: 'role',
        include: [{ model: db.Permission, as: 'permissions' }],
      },
      { model: db.Branch, as: 'branch' },
      { model: db.Business, as: 'business' },
    ],
    attributes: { exclude: ['password', 'twoFactorSecret', 'refreshToken'] },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};

/**
 * Update user
 */
export const updateUser = async (userId, updateData) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Check if email is being changed and already exists
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await db.User.findOne({
      where: {
        email: updateData.email,
        id: { [Op.ne]: userId },
      },
    });

    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }
  }

  // Don't allow password update through this method
  delete updateData.password;

  await user.update(updateData);

  return await getUserById(userId);
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Soft delete
  await user.destroy();

  return true;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId, updateData) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  let firstName = updateData.firstName;
  let lastName = updateData.lastName;
  if (!firstName && updateData.name) {
    const parts = updateData.name.trim().split(' ');
    firstName = parts[0];
    lastName = parts.slice(1).join(' ');
  }

  const filteredData = {};
  if (firstName !== undefined) filteredData.firstName = firstName;
  if (lastName !== undefined) filteredData.lastName = lastName;
  if (updateData.phone !== undefined) filteredData.phone = updateData.phone;
  if (updateData.avatar !== undefined) filteredData.avatar = updateData.avatar;
  if (updateData.preferences !== undefined) {
    filteredData.preferences = {
      ...(user.preferences || {}),
      ...updateData.preferences,
    };
  }

  await user.update(filteredData);

  return user.toSafeObject();
};

/**
 * Get user activity
 */
export const getUserActivity = async (userId, limit = 20) => {
  const activities = await db.AuditLog.findAll({
    where: { userId },
    limit,
    order: [['createdAt', 'DESC']],
  });

  return activities;
};

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  getUserActivity,
};
