import express from 'express';
import { authenticate } from '../middleware/auth.js';
import db from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const roles = await db.Role.findAll({
      include: [
        {
          model: db.Permission,
          as: 'permissions',
        },
      ],
      order: [['name', 'ASC']],
    });

    return ApiResponse.success(res, 'Roles retrieved successfully', roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve roles',
      data: [],
    });
  }
});

export default router;
