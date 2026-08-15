/**
 * Standardized API Response Utility
 * Supports both:
 * 1. ApiResponse.success(res, message, data, statusCode)
 * 2. res.json(ApiResponse.success(message, data))
 */

class ApiResponse {
  static success(arg1, arg2 = 'Success', arg3 = null, arg4 = 200) {
    // If arg1 is Express response object
    if (arg1 && typeof arg1.status === 'function') {
      const res = arg1;
      const message = typeof arg2 === 'string' ? arg2 : 'Success';
      const data = arg3 !== undefined ? arg3 : (typeof arg2 !== 'string' ? arg2 : null);
      const statusCode = typeof arg4 === 'number' ? arg4 : 200;
      return res.status(statusCode).json({
        success: true,
        message,
        data,
      });
    }

    // Standalone object return
    const message = typeof arg1 === 'string' ? arg1 : 'Success';
    const data = arg2 !== undefined ? arg2 : (typeof arg1 !== 'string' ? arg1 : null);
    return {
      success: true,
      message,
      data,
    };
  }

  static created(arg1, arg2 = 'Resource created successfully', arg3 = null) {
    if (arg1 && typeof arg1.status === 'function') {
      const res = arg1;
      const message = typeof arg2 === 'string' ? arg2 : 'Resource created successfully';
      const data = arg3 !== undefined ? arg3 : (typeof arg2 !== 'string' ? arg2 : null);
      return res.status(201).json({
        success: true,
        message,
        data,
      });
    }

    const message = typeof arg1 === 'string' ? arg1 : 'Resource created successfully';
    const data = arg2 !== undefined ? arg2 : (typeof arg1 !== 'string' ? arg1 : null);
    return {
      success: true,
      message,
      data,
    };
  }

  static error(arg1, arg2 = 'Error', arg3 = [], arg4 = 400) {
    if (arg1 && typeof arg1.status === 'function') {
      const res = arg1;
      const message = typeof arg2 === 'string' ? arg2 : 'Error';
      const errors = Array.isArray(arg3) ? arg3 : [arg3];
      const statusCode = typeof arg4 === 'number' ? arg4 : 400;
      return res.status(statusCode).json({
        success: false,
        message,
        errors,
      });
    }

    const message = typeof arg1 === 'string' ? arg1 : 'Error';
    const errors = Array.isArray(arg2) ? arg2 : [arg2];
    return {
      success: false,
      message,
      errors,
    };
  }

  static paginated(arg1, arg2 = 'Success', arg3 = [], arg4 = {}) {
    if (arg1 && typeof arg1.status === 'function') {
      const res = arg1;
      const message = typeof arg2 === 'string' ? arg2 : 'Success';
      const data = Array.isArray(arg3) ? arg3 : [];
      const pagination = arg4 || {};
      return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
          total: pagination.total || pagination.totalItems || data.length,
          page: pagination.page || pagination.currentPage || 1,
          pageSize: pagination.pageSize || pagination.perPage || 20,
          totalPages: pagination.totalPages || Math.ceil((pagination.total || data.length) / 20) || 1,
        },
      });
    }

    const message = typeof arg1 === 'string' ? arg1 : 'Success';
    const data = Array.isArray(arg2) ? arg2 : [];
    const pagination = arg3 || {};
    return {
      success: true,
      message,
      data,
      pagination: {
        total: pagination.total || pagination.totalItems || data.length,
        page: pagination.page || pagination.currentPage || 1,
        pageSize: pagination.pageSize || pagination.perPage || 20,
        totalPages: pagination.totalPages || Math.ceil((pagination.total || data.length) / 20) || 1,
      },
    };
  }

  static noContent(res) {
    if (res && typeof res.status === 'function') {
      return res.status(204).send();
    }
    return { success: true };
  }

  static badRequest(res, message = 'Bad request', errors = []) {
    return this.error(res, message, errors, 400);
  }

  static unauthorized(res, message = 'Unauthorized', errors = []) {
    return this.error(res, message, errors, 401);
  }

  static forbidden(res, message = 'Forbidden', errors = []) {
    return this.error(res, message, errors, 403);
  }

  static notFound(res, message = 'Resource not found', errors = []) {
    return this.error(res, message, errors, 404);
  }

  static conflict(res, message = 'Conflict', errors = []) {
    return this.error(res, message, errors, 409);
  }

  static unprocessable(res, message = 'Unprocessable entity', errors = []) {
    return this.error(res, message, errors, 422);
  }

  static internal(res, message = 'Internal server error', errors = []) {
    return this.error(res, message, errors, 500);
  }
}

export default ApiResponse;
