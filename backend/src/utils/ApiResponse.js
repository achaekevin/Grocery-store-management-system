/**
 * Standardized API Response Utility
 */

class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {*} data - Response data
   * @param {number} statusCode - HTTP status code
   */
  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {Array} errors - Error details
   * @param {number} statusCode - HTTP status code
   */
  static error(res, message = 'Error', errors = [], statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [errors],
    });
  }

  /**
   * Paginated response
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {Array} data - Response data
   * @param {Object} pagination - Pagination metadata
   */
  static paginated(res, message = 'Success', data = [], pagination = {}) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total: pagination.total || 0,
        page: pagination.page || 1,
        pageSize: pagination.pageSize || 20,
        totalPages: pagination.totalPages || 0,
      },
    });
  }

  /**
   * Created response (201)
   */
  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, message, data, 201);
  }

  /**
   * No content response (204)
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Bad request (400)
   */
  static badRequest(res, message = 'Bad request', errors = []) {
    return this.error(res, message, errors, 400);
  }

  /**
   * Unauthorized (401)
   */
  static unauthorized(res, message = 'Unauthorized', errors = []) {
    return this.error(res, message, errors, 401);
  }

  /**
   * Forbidden (403)
   */
  static forbidden(res, message = 'Forbidden', errors = []) {
    return this.error(res, message, errors, 403);
  }

  /**
   * Not found (404)
   */
  static notFound(res, message = 'Resource not found', errors = []) {
    return this.error(res, message, errors, 404);
  }

  /**
   * Conflict (409)
   */
  static conflict(res, message = 'Conflict', errors = []) {
    return this.error(res, message, errors, 409);
  }

  /**
   * Unprocessable entity (422)
   */
  static unprocessable(res, message = 'Unprocessable entity', errors = []) {
    return this.error(res, message, errors, 422);
  }

  /**
   * Internal server error (500)
   */
  static internal(res, message = 'Internal server error', errors = []) {
    return this.error(res, message, errors, 500);
  }
}

export default ApiResponse;
