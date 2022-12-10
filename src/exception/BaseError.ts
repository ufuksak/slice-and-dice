export default class BaseError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : (this.stack = new Error().stack);
  }
}
