import ApiError from '../errors';
import httpStatus from 'http-status';

/**
 * Class representing an API error
 * @extends ExtendableError
 */
export class StatusCodeError extends ApiError {
  readonly details: Array<any> | undefined;

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
      code,
    }: { status?: number; code?: string; isPublic?: boolean },
    error?: Error,
    details?: Array<any>,
  ) {
    super(message, { status, isPublic, code }, error);
    this.details = details;
  }
}

export class ResourceNotFoundError extends StatusCodeError {
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

export class UserDuplicated extends ApiError {
  constructor(username: string, error: any) {
    super(
      `An account with the name ${username} already exists.`,
      { code: 'error.duplicated', status: httpStatus.INTERNAL_SERVER_ERROR, isPublic: true },
      error,
    );
  }
}

export default ApiError;
