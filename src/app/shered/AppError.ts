class AppError extends Error {
  statusCode: number;
  constructor(statusCode: number, messgae: string | undefined, stack = "") {
    super(messgae);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
