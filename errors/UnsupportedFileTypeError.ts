export class UnsupportedFileTypeError extends Error {
  static readonly message = 'Unsupported file type';

  constructor() {
    super(UnsupportedFileTypeError.message);
  }
}
