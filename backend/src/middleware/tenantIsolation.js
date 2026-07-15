import ApiError from '../utils/ApiError.js';

/**
 * Ensure user can only access their own business data
 */
export const ensureBusinessAccess = (req, res, next) => {
  const userBusinessId = req.user?.businessId;
  const requestBusinessId = parseInt(req.params.businessId || req.body.businessId || req.query.businessId);

  // If no businessId in request, allow (will use user's businessId)
  if (!requestBusinessId) {
    return next();
  }

  // Check if user is trying to access different business
  if (userBusinessId !== requestBusinessId) {
    throw ApiError.forbidden('Access denied to this business');
  }

  next();
};

/**
 * Ensure user can only access their assigned branch or branches
 */
export const ensureBranchAccess = (req, res, next) => {
  const userBranchId = req.user?.branchId;
  const requestBranchId = parseInt(req.params.branchId || req.body.branchId || req.query.branchId);

  // Super Admin and Branch Manager can access all branches
  const allowedRoles = ['Super Admin', 'Branch Manager'];
  if (req.user?.role && allowedRoles.includes(req.user.role.name)) {
    return next();
  }

  // If no branchId in request, allow (will use user's branchId)
  if (!requestBranchId) {
    return next();
  }

  // Check if user is trying to access different branch
  if (userBranchId !== requestBranchId) {
    throw ApiError.forbidden('Access denied to this branch');
  }

  next();
};

/**
 * Automatically inject businessId to request body/query
 */
export const injectBusinessId = (req, res, next) => {
  const businessId = req.user?.businessId;

  if (businessId) {
    // Inject to query for GET requests
    if (req.method === 'GET') {
      req.query.businessId = businessId;
    }
    
    // Inject to body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.body.businessId) {
      req.body.businessId = businessId;
    }
  }

  next();
};

/**
 * Automatically inject branchId to request body/query
 */
export const injectBranchId = (req, res, next) => {
  const branchId = req.user?.branchId;

  if (branchId) {
    // Inject to query for GET requests
    if (req.method === 'GET' && !req.query.branchId) {
      req.query.branchId = branchId;
    }
    
    // Inject to body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.body.branchId) {
      req.body.branchId = branchId;
    }
  }

  next();
};

export default {
  ensureBusinessAccess,
  ensureBranchAccess,
  injectBusinessId,
  injectBranchId,
};
