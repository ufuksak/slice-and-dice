import httpStatus from 'http-status';

/**
 * Base Error for all application errors.
 * Extends the native JavaScript Error class with a mandatory errorCode.
 * @extends Error
 */
export class ExtendableError extends Error {
  readonly code: string;

  constructor(message: string, code: string, error?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code;
    if (error) {
      this.stack = `${this.stack} \nCaused by:\n ${error.stack}`;
    }
  }
}

/**
 * Class representing an API error. Defines a HTTP response status code and
 * isPublic flag for displaying error details to end users.
 * @extends ExtendableError
 */
export default class ApiError extends ExtendableError {
  readonly status: number;

  readonly isPublic: boolean;

  /**
   * Creates API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    message: string,
    {
      code = 'error.unexpected',
      status = httpStatus.INTERNAL_SERVER_ERROR,
      isPublic = false,
    }: { code?: string; status?: number; isPublic?: boolean },
    error?: Error,
  ) {
    super(message, code, error);

    this.status = status;
    this.isPublic = isPublic;
  }
}

/**
 * Class representing an error with additional details.
 * @extends ApiError
 */
export class DetailedError extends ApiError {
  readonly details: Array<any>;

  /**
   * Creates API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    message: string,
    details: Array<any>,
    { code, status, isPublic }: { code?: string; status?: number; isPublic?: boolean },
    error?: Error,
  ) {
    super(message, { status, code, isPublic }, error);
    this.details = details;
  }
}

export class ResourceNotFoundError extends ApiError {
  constructor(id: string, error?: Error) {
    super(
      `Requested resource with ID: ${id} was not found`,
      {
        status: httpStatus.NOT_FOUND,
        code: 'error.resource.not-found',
        isPublic: true,
      },
      error,
    );
  }
}

export class UnauthorizedError extends ApiError {
  constructor(msg: string, error?: Error) {
    super(
      msg,
      {
        status: httpStatus.UNAUTHORIZED,
        code: 'error.unauthorized',
        isPublic: true,
      },
      error,
    );
  }
}

export class EndpointNotFoundError extends ApiError {
  constructor(msg: string, error?: Error) {
    super(
      msg,
      {
        status: httpStatus.NOT_FOUND,
        code: 'error.endpoint.not-found',
        isPublic: true,
      },
      error,
    );
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor(msg: string, error?: Error) {
    super(
      msg,
      {
        status: httpStatus.METHOD_NOT_ALLOWED,
        code: 'error.method-not-allowed',
        isPublic: true,
      },
      error,
    );
  }
}

export class NotAcceptableError extends ApiError {
  constructor(msg: string, error?: Error) {
    super(
      msg,
      {
        status: httpStatus.NOT_ACCEPTABLE,
        code: 'error.not-acceptable',
        isPublic: true,
      },
      error,
    );
  }
}

export class UnsupportedMediaTypeError extends ApiError {
  constructor(msg: string, error?: Error) {
    super(
      msg,
      {
        status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
        code: 'error.unsupported-media-type',
        isPublic: true,
      },
      error,
    );
  }
}

/**
 * Class representing an API error
 * @extends ApiError
 */
export class StatusCodeError extends ApiError {
  statusCode?: string;

  /**
   * Creates API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    message: string,
    {
      status = httpStatus.INTERNAL_SERVER_ERROR,
      isPublic = true,
      statusCode,
    }: { status?: number; statusCode?: string; isPublic?: boolean },
    error?: Error,
  ) {
    super(
      message,
      {
        status,
        isPublic,
        code: statusCode,
      },
      error,
    );

    this.statusCode = statusCode;
  }
}
