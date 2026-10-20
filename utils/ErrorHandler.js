/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */

class AuthendicationError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = 401
    Error.captureStackTrace(this, this.constructor)
  }
}

class UnprocessableError extends Error {
  constructor(message, data) {
    super(message)
    this.statusCode = 422
    this.ValidationArr = data
    Error.captureStackTrace(this, this.constructor)
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 400
    Error.captureStackTrace(this, this.constructor)
  }
}
class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class UnAuthorizedError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 403
    Error.captureStackTrace(this, this.constructor)
  }
}

class ServiceModuleError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = 404
    Error.captureStackTrace(this, this.constructor)
  }
}

export {
  AuthendicationError,
  ValidationError,
  ServiceModuleError,
  UnAuthorizedError,
  NotFoundError,
  BadRequestError,
  UnprocessableError
}
