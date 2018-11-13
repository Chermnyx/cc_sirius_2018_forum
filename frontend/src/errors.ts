export class UserNotFoundError extends Error {
  email?: string;
  username?: string;

  constructor(email?: string; username?: string) {
    super(`User email:${email} username:${username} not found`);
    this.email = email;
    this.username = username;
  }
}

export class UserExistError extends Error {
  email?: string;
  username?: string;

  constructor(email?:string, username?:string) {
    super(`User email:${email} username:${username} already exist`);
    this.email = email;
    this.username = username;
  }
}

export class UnauthorizedError extends Error {}
