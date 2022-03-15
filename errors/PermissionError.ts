import { AuthenticationError } from 'apollo-server-core';

export class PermissionError extends AuthenticationError {
  static readonly message = "Access denied! You don't have permission for this action!";

  constructor(extensions?: Record<string, unknown>) {
    super(PermissionError.message, extensions);
  }
}
