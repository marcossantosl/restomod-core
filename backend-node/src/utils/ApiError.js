class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'Não autorizado') {
    return new ApiError(401, message);
  }

  static notFound(message = 'Recurso não encontrado') {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }
}

module.exports = ApiError;
