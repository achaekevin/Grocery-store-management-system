import * as userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

export const createUser = async (req, res) => {
  try {
    const userData = {
      ...req.body,
      businessId: req.user.businessId,
    };

    const user = await userService.createUser(userData);

    logger.info(`User created: ${user.id} by user ${req.user.id}`);
    res.status(201).json(ApiResponse.created('User created successfully', user));
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (req, res) => {
  try {
    const { count, users } = await userService.getUsers(req.query, req.pagination);

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Users retrieved successfully', users, {
        currentPage: page,
        perPage: limit,
        totalItems: count,
        totalPages,
      })
    );
  } catch (error) {
    throw error;
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(ApiResponse.success('User retrieved successfully', user));
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    logger.info(`User updated: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('User updated successfully', user));
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);

    logger.info(`User deleted: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('User deleted successfully'));
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(ApiResponse.success('Profile retrieved successfully', user));
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);

    logger.info(`Profile updated by user ${req.user.id}`);
    res.json(ApiResponse.success('Profile updated successfully', user));
  } catch (error) {
    throw error;
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = await userService.getUserActivity(req.params.id, limit);

    res.json(ApiResponse.success('User activity retrieved', activities));
  } catch (error) {
    throw error;
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
