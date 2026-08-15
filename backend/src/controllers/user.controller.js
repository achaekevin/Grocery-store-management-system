import * as userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

export const createUser = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || req.user?.businessId || 'c154fe50-8407-11f1-83ba-e4e7491fe1d4';
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    if (!firstName && req.body.name) {
      const parts = req.body.name.trim().split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    const userData = {
      ...req.body,
      firstName: firstName || 'Staff',
      lastName: lastName || 'User',
      tenantId,
    };

    const user = await userService.createUser(userData);

    logger.info(`User created: ${user.id} by user ${req.user?.id}`);
    return ApiResponse.created(res, 'User created successfully', user);
  } catch (error) {
    logger.error('Error creating user:', error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to create user',
      errors: error.errors || [error.message],
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const pagination = req.pagination || {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      offset: 0,
    };

    const { count, users } = await userService.getUsers(req.query, pagination);

    const { page, limit } = pagination;
    const totalPages = Math.ceil(count / limit) || 1;

    return ApiResponse.paginated(res, 'Users retrieved successfully', users, {
      currentPage: page,
      perPage: limit,
      totalItems: count,
      totalPages,
    });
  } catch (error) {
    logger.error('Error getting users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      data: [],
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return ApiResponse.success(res, 'User retrieved successfully', user);
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message || 'User not found',
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    if (!firstName && req.body.name) {
      const parts = req.body.name.trim().split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    const updateData = {
      ...req.body,
      ...(firstName && { firstName }),
      ...(lastName !== undefined && { lastName }),
    };

    const user = await userService.updateUser(req.params.id, updateData);

    logger.info(`User updated: ${req.params.id} by user ${req.user?.id}`);
    return ApiResponse.success(res, 'User updated successfully', user);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update user',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);

    logger.info(`User deleted: ${req.params.id} by user ${req.user?.id}`);
    return ApiResponse.success(res, 'User deleted successfully');
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    return ApiResponse.success(res, 'Profile retrieved successfully', user);
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message || 'Profile not found',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);

    logger.info(`Profile updated by user ${req.user?.id}`);
    return ApiResponse.success(res, 'Profile updated successfully', user);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = await userService.getUserActivity(req.params.id, limit);

    return ApiResponse.success(res, 'User activity retrieved', activities);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve activity',
    });
  }
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  getUserActivity,
};
