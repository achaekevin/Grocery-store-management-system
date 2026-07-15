import * as inventoryService from '../services/inventory.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

/**
 * Get inventory
 */
export const getInventory = async (req, res) => {
  try {
    const { count, inventory } = await inventoryService.getInventory(
      req.query,
      req.pagination
    );

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Inventory retrieved successfully', inventory, {
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

/**
 * Adjust stock
 */
export const adjustStock = async (req, res) => {
  try {
    const movement = await inventoryService.adjustStock(req.body, req.user.id);

    logger.info(`Stock adjusted by user ${req.user.id}`);
    res.json(ApiResponse.success('Stock adjusted successfully', movement));
  } catch (error) {
    throw error;
  }
};

/**
 * Batch stock update
 */
export const batchStockUpdate = async (req, res) => {
  try {
    const movements = await inventoryService.batchStockUpdate(req.body, req.user.id);

    logger.info(`Batch stock update: ${movements.length} items by user ${req.user.id}`);
    res.json(
      ApiResponse.success('Batch stock updated successfully', {
        count: movements.length,
        movements,
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Transfer stock between branches
 */
export const transferStock = async (req, res) => {
  try {
    const result = await inventoryService.transferStock(req.body, req.user.id);

    logger.info(`Stock transferred by user ${req.user.id}`);
    res.json(ApiResponse.success('Stock transferred successfully', result));
  } catch (error) {
    throw error;
  }
};

/**
 * Get inventory movements
 */
export const getInventoryMovements = async (req, res) => {
  try {
    const { count, movements } = await inventoryService.getInventoryMovements(
      req.query,
      req.pagination
    );

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Inventory movements retrieved', movements, {
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

/**
 * Perform stock take
 */
export const performStockTake = async (req, res) => {
  try {
    const adjustments = await inventoryService.performStockTake(req.body, req.user.id);

    logger.info(`Stock take performed: ${adjustments.length} adjustments by user ${req.user.id}`);
    res.json(
      ApiResponse.success('Stock take completed successfully', {
        count: adjustments.length,
        adjustments,
      })
    );
  } catch (error) {
    throw error;
  }
};

export default {
  getInventory,
  adjustStock,
  batchStockUpdate,
  transferStock,
  getInventoryMovements,
  performStockTake,
};
