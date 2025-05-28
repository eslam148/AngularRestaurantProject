/**
 * HTTP Response Status Codes
 * Matches the backend ResponseStatus enum
 */
export enum ResponseStatus {
  // Success responses
  Success = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,

  // Client error responses
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  TooManyRequests = 429,

  // Server error responses
  InternalServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503
}

/**
 * Helper functions for status code checking
 */
export class ResponseStatusHelper {
  static isSuccess(status: number): boolean {
    return status >= 200 && status < 300;
  }

  static isClientError(status: number): boolean {
    return status >= 400 && status < 500;
  }

  static isServerError(status: number): boolean {
    return status >= 500 && status < 600;
  }

  static isError(status: number): boolean {
    return status >= 400;
  }

  static getStatusMessage(status: ResponseStatus): string {
    switch (status) {
      case ResponseStatus.Success:
        return 'Success';
      case ResponseStatus.Created:
        return 'Created';
      case ResponseStatus.Accepted:
        return 'Accepted';
      case ResponseStatus.NoContent:
        return 'No Content';
      case ResponseStatus.BadRequest:
        return 'Bad Request';
      case ResponseStatus.Unauthorized:
        return 'Unauthorized';
      case ResponseStatus.Forbidden:
        return 'Forbidden';
      case ResponseStatus.NotFound:
        return 'Not Found';
      case ResponseStatus.Conflict:
        return 'Conflict';
      case ResponseStatus.TooManyRequests:
        return 'Too Many Requests';
      case ResponseStatus.InternalServerError:
        return 'Internal Server Error';
      case ResponseStatus.NotImplemented:
        return 'Not Implemented';
      case ResponseStatus.ServiceUnavailable:
        return 'Service Unavailable';
      default:
        return 'Unknown Status';
    }
  }
}
