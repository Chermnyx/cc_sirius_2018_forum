// FIXME: connect to the backend
import { UserExistError, UserNotFoundError, UnauthorizedError } from './errors';

export async function register(email: string, username: string, password: string): Promise<string> {
  throw new UserExistError(email, username);
}

export async function login(email: string, password: string): Promise<string> {
  throw new UserNotFoundError(email);
}

export async function editProfile(
  username?: string,
  email?: string,
  password?: string,
): Promise<void> {
  throw new UnauthorizedError();
}
