class ApiError extends Error {
  constructor(txt) {
    super(txt);
    this.fields = [];
  }

  toJSON() {
    const obj = {
      error: this.constructor.name,
      message: this.message,
    };
    for (const field of this.fields) {
      obj[field] = this[field];
    }
    return obj;
  }
}

class UserNotFoundError extends ApiError {
  constructor(email) {
    super(`User email:${email} not found`);
    this.fields = ['email'];
    this.email = email;
  }
}

class ThreadNotFoundError extends ApiError {
  constructor(threadId) {
    super(`thread ${threadId} not found`);
    this.fields = ['threadId'];
    this.threadId = threadId;
  }
}

class UserExistError extends ApiError {
  constructor(email, username) {
    super(`User email:${email} username:${username} already exist`);
    this.fields = ['email', 'username'];
    this.email = email;
    this.username = username;
  }
}

class UnauthorizedError extends ApiError {}
class InvalidPasswordError extends ApiError {}
class AlreadyVotedError extends ApiError {}
class TokenExpiredError extends ApiError {}

class InvalidPictureError extends ApiError {}
class InvalidPostError extends ApiError {}

class ValidationError extends ApiError {
  constructor(err) {
    super(`Validation error`);
    this.fields = ['details'];
    this.details = err.details;
  }
}

module.exports = {
  ApiError,
  UserExistError,
  UserNotFoundError,
  UnauthorizedError,
  InvalidPasswordError,
  AlreadyVotedError,
  ValidationError,
  TokenExpiredError,
  ThreadNotFoundError,
  InvalidPictureError,
  InvalidPostError,
};
