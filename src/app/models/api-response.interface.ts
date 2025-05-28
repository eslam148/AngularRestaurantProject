import { ResponseStatus } from './response-status.enum';

/**
 * Standard API Response Interface
 * Matches the backend Response<T> structure
 */
export interface ApiResponse<T = any> {
  data: T;
  status: ResponseStatus;
  message: string;
  internalMessage?: string;
}

/**
 * Paginated Response Interface
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Error Response Interface
 */
export interface ErrorResponse {
  status: ResponseStatus;
  message: string;
  errors?: { [key: string]: string[] };
  timestamp: string;
  path: string;
}

/**
 * Helper functions for API responses
 */
export class ApiResponseHelper {
  static isSuccess<T>(response: ApiResponse<T>): boolean {
    return response.status >= 200 && response.status < 300;
  }

  static isError<T>(response: ApiResponse<T>): boolean {
    return response.status >= 400;
  }

  static getErrorMessage<T>(response: ApiResponse<T>): string {
    return response.message || 'An unexpected error occurred';
  }

  static createSuccessResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      data,
      status: ResponseStatus.Success,
      message
    };
  }

  static createErrorResponse(status: ResponseStatus, message: string): ApiResponse<null> {
    return {
      data: null,
      status,
      message
    };
  }
}
