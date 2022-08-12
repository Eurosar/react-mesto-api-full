class ApiError extends Error {
  constructor(status, message) {
    super();
    this.message = message;
    this.status = status;
  }

  static Conflict(message) {
    return new ApiError(409, message);
  }

  static NotFoundError(message) {
    return new ApiError(404, message);
  }

  static Forbidden(message) {
    return new ApiError(403, message);
  }

  static Unauthorized(message) {
    return new ApiError(401, message);
  }

  static BadRequestError(message) {
    return new ApiError(400, message);
  }
}

module.exports = ApiError;
