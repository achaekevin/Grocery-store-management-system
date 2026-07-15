import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Create a new product
 */
export const createProduct = async (productData, userId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { branchId, quantity = 0, ...productFields } = productData;

    // Check if SKU or barcode already exists
    if (productFields.sku || productFields.barcode) {
      const existingProduct = await db.Product.findOne({
        where: {
          [Op.or]: [
            productFields.sku ? { sku: productFields.sku } : null,
            productFields.barcode ? { barcode: productFields.barcode } : null,
          ].filter(Boolean),
        },
      });

      if (existingProduct) {
        throw ApiError.conflict('Product with this SKU or barcode already exists');
      }
    }

    // Create product
    const product = await db.Product.create(
      {
        ...productFields,
        businessId: productData.businessId,
      },
      { transaction }
    );

    // Create initial inventory record
    await db.Inventory.create(
      {
        branchId,
        productId: product.id,
        quantity,
        reorderLevel: productFields.reorderLevel || 10,
      },
      { transaction }
    );

    // If initial quantity > 0, create inventory movement
    if (quantity > 0) {
      await db.InventoryMovement.create(
        {
          inventoryId: null, // Will be set after inventory creation
          productId: product.id,
          branchId,
          userId,
          type: 'stock_in',
          quantityBefore: 0,
          quantityChanged: quantity,
          quantityAfter: quantity,
          reason: 'Initial stock',
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Fetch complete product with relations
    return await db.Product.findByPk(product.id, {
      include: [
        { model: db.Category, as: 'category' },
        { model: db.Brand, as: 'brand' },
        { model: db.Unit, as: 'unit' },
      ],
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Create product failed:', error);
    throw error;
  }
};

/**
 * Get all products with filters and pagination
 */
export const getProducts = async (filters, pagination) => {
  const {
    search,
    categoryId,
    brandId,
    branchId,
    status,
    minPrice,
    maxPrice,
    lowStock,
    expired,
    expiringIn,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const { limit, offset } = pagination;

  const where = {};
  const inventoryWhere = {};

  // Text search
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
      { barcode: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filters
  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;
  if (status) where.status = status;
  if (minPrice) where.sellingPrice = { [Op.gte]: minPrice };
  if (maxPrice) where.sellingPrice = { ...where.sellingPrice, [Op.lte]: maxPrice };

  // Expiry filters
  if (expired) {
    where.expiryDate = { [Op.lt]: new Date() };
  } else if (expiringIn) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + expiringIn);
    where.expiryDate = {
      [Op.between]: [new Date(), futureDate],
    };
  }

  // Branch filter for inventory
  if (branchId) inventoryWhere.branchId = branchId;

  // Low stock filter
  if (lowStock) {
    inventoryWhere[Op.and] = db.sequelize.where(
      db.sequelize.col('inventory.quantity'),
      Op.lte,
      db.sequelize.col('inventory.reorder_level')
    );
  }

  const { count, rows } = await db.Product.findAndCountAll({
    where,
    include: [
      { model: db.Category, as: 'category', attributes: ['id', 'name'] },
      { model: db.Brand, as: 'brand', attributes: ['id', 'name'] },
      { model: db.Unit, as: 'unit', attributes: ['id', 'name', 'symbol'] },
      {
        model: db.Inventory,
        as: 'inventory',
        where: Object.keys(inventoryWhere).length > 0 ? inventoryWhere : undefined,
        required: Object.keys(inventoryWhere).length > 0,
      },
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
    distinct: true,
  });

  return { count, products: rows };
};

/**
 * Get product by ID
 */
export const getProductById = async (productId) => {
  const product = await db.Product.findByPk(productId, {
    include: [
      { model: db.Category, as: 'category' },
      { model: db.Brand, as: 'brand' },
      { model: db.Unit, as: 'unit' },
      { model: db.Inventory, as: 'inventory' },
    ],
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  return product;
};

/**
 * Update product
 */
export const updateProduct = async (productId, updateData) => {
  const product = await db.Product.findByPk(productId);

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Check if SKU or barcode is being changed and already exists
  if (updateData.sku || updateData.barcode) {
    const existingProduct = await db.Product.findOne({
      where: {
        id: { [Op.ne]: productId },
        [Op.or]: [
          updateData.sku ? { sku: updateData.sku } : null,
          updateData.barcode ? { barcode: updateData.barcode } : null,
        ].filter(Boolean),
      },
    });

    if (existingProduct) {
      throw ApiError.conflict('Product with this SKU or barcode already exists');
    }
  }

  await product.update(updateData);

  return await getProductById(productId);
};

/**
 * Delete product
 */
export const deleteProduct = async (productId) => {
  const product = await db.Product.findByPk(productId);

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Soft delete
  await product.destroy();

  return true;
};

/**
 * Bulk update products
 */
export const bulkUpdateProducts = async (productIds, updates) => {
  const result = await db.Product.update(updates, {
    where: {
      id: { [Op.in]: productIds },
    },
  });

  return result[0]; // Number of affected rows
};

/**
 * Get low stock products
 */
export const getLowStockProducts = async (businessId, branchId) => {
  const where = { businessId };
  const inventoryWhere = {
    [Op.and]: db.sequelize.where(
      db.sequelize.col('inventory.quantity'),
      Op.lte,
      db.sequelize.col('inventory.reorder_level')
    ),
  };

  if (branchId) inventoryWhere.branchId = branchId;

  const products = await db.Product.findAll({
    where,
    include: [
      {
        model: db.Inventory,
        as: 'inventory',
        where: inventoryWhere,
        required: true,
      },
      { model: db.Category, as: 'category', attributes: ['name'] },
    ],
  });

  return products;
};

/**
 * Get expiring products
 */
export const getExpiringProducts = async (businessId, days = 30) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const products = await db.Product.findAll({
    where: {
      businessId,
      expiryDate: {
        [Op.between]: [new Date(), futureDate],
      },
      status: 'active',
    },
    include: [
      { model: db.Category, as: 'category', attributes: ['name'] },
      { model: db.Inventory, as: 'inventory' },
    ],
    order: [['expiryDate', 'ASC']],
  });

  return products;
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
  getLowStockProducts,
  getExpiringProducts,
};
