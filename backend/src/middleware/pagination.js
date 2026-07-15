/**
 * Pagination middleware
 * Extracts and validates pagination parameters from query
 */
export const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Validate page and limit
  if (page < 1) {
    req.pagination = { page: 1, limit, offset: 0 };
  } else if (limit < 1 || limit > 100) {
    req.pagination = { page, limit: 10, offset: (page - 1) * 10 };
  } else {
    req.pagination = { page, limit, offset };
  }

  next();
};

/**
 * Build pagination metadata
 */
export const buildPaginationMeta = (count, page, limit) => {
  const totalPages = Math.ceil(count / limit);
  
  return {
    currentPage: page,
    perPage: limit,
    totalItems: count,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export default {
  paginate,
  buildPaginationMeta,
};
