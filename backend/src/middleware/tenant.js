import ApiError from '../utils/ApiError.js';
import db from '../models/index.js';

/**
 * Ensure tenant isolation
 * Validates that user can only access their tenant's data
 */
export const validateTenant = (req, res, next) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    if (!req.user.tenantId && !req.user.businessId) {
      throw ApiError.forbidden('No tenant associated with user');
    }

    // Attach tenantId to request for easy access
    req.tenantId = req.user.tenantId || req.user.businessId;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Tenant validation failed',
    });
  }
};

/**
 * Ensure branch isolation
 * Validates that user can only access their branch's data
 */
export const validateBranch = (allowAllBranches = false) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      // Super Admin and roles with cross-branch access
      const crossBranchRoles = ['Super Admin', 'Accountant'];
      
      if (allowAllBranches || crossBranchRoles.includes(req.user.role?.name)) {
        // User can access all branches
        req.branchId = req.query.branchId || req.body.branchId || req.user.branchId;
        return next();
      }

      // Regular users restricted to their branch
      if (!req.user.branchId) {
        throw ApiError.forbidden('No branch associated with user');
      }

      req.branchId = req.user.branchId;

      // If request specifies a branch, ensure it matches user's branch
      const requestedBranchId = req.query.branchId || req.body.branchId || req.params.branchId;
      
      if (requestedBranchId && requestedBranchId !== req.user.branchId) {
        throw ApiError.forbidden('Access denied to this branch');
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Branch validation failed',
      });
    }
  };
};

/**
 * Ensure business is active
 */
export const validateBusinessStatus = async (req, res, next) => {
  try {
    if (!req.user || !req.user.businessId) {
      throw ApiError.unauthorized('No business associated with user');
    }

    const business = await db.Business.findByPk(req.user.businessId);

    if (!business) {
      throw ApiError.notFound('Business not found');
    }

    if (business.status !== 'active') {
      throw ApiError.forbidden(`Business account is ${business.status}`);
    }

    // Check subscription status if applicable
    if (business.subscriptionStatus && business.subscriptionStatus !== 'active') {
      throw ApiError.forbidden('Business subscription is not active');
    }

    req.business = business;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Business validation failed',
    });
  }
};

/**
 * Add tenant filter to query
 * Automatically adds tenantId filter to all queries
 */
export const addTenantFilter = (req, res, next) => {
  if (req.user && req.user.tenantId) {
    // Store original query method
    const originalFind = db.sequelize.Model.findAll;
    const originalFindOne = db.sequelize.Model.findOne;
    const originalCount = db.sequelize.Model.count;

    // Override to automatically add tenant filter
    db.sequelize.Model.findAll = function (options = {}) {
      if (!options.where) {
        options.where = {};
      }
      if (!options.where.tenantId) {
        options.where.tenantId = req.user.tenantId;
      }
      return originalFind.call(this, options);
    };

    db.sequelize.Model.findOne = function (options = {}) {
      if (!options.where) {
        options.where = {};
      }
      if (!options.where.tenantId) {
        options.where.tenantId = req.user.tenantId;
      }
      return originalFindOne.call(this, options);
    };

    db.sequelize.Model.count = function (options = {}) {
      if (!options.where) {
        options.where = {};
      }
      if (!options.where.tenantId) {
        options.where.tenantId = req.user.tenantId;
      }
      return originalCount.call(this, options);
    };
  }

  next();
};

/**
 * Validate tenant ownership of resource
 */
export const validateTenantOwnership = (Model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];

      if (!resourceId) {
        throw ApiError.badRequest(`${paramName} parameter is required`);
      }

      const resource = await Model.findByPk(resourceId);

      if (!resource) {
        throw ApiError.notFound('Resource not found');
      }

      if (resource.tenantId !== req.user.tenantId) {
        throw ApiError.forbidden('Access denied to this resource');
      }

      req.resource = resource;
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Resource validation failed',
      });
    }
  };
};

export default {
  validateTenant,
  validateBranch,
  validateBusinessStatus,
  addTenantFilter,
  validateTenantOwnership,
};
