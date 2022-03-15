import { AuthenticationError } from 'apollo-server-core';

export class AuthorizedError extends AuthenticationError {
  static readonly message = 'Access denied! You need to be authorized to perform this action!';

  constructor(extensions?: Record<string, unknown>) {
    super(AuthorizedError.message, extensions);
  }
}
