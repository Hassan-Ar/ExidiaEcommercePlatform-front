import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  /**
   * Extract error message from various error response formats
   */
  extractErrorMessage(error: any): string {
    // Handle ABP framework error format
    if (error.error?.error?.message) {
      return error.error.error.message;
    }
    
    // Handle standard error format
    if (error.error?.message) {
      return error.error.message;
    }
    
    // Handle validation errors
    if (error.error?.validationErrors) {
      const validationErrors = error.error.validationErrors;
      if (Array.isArray(validationErrors)) {
        return validationErrors.map((err: any) => err.message).join(', ');
      }
    }
    
    // Handle error message directly
    if (error.message) {
      return error.message;
    }
    
    // Handle HTTP status errors
    if (error.status) {
      switch (error.status) {
        case 400:
          return 'Bad request. Please check your input data.';
        case 401:
          return 'Unauthorized. Please login again.';
        case 403:
          return 'Access denied. You do not have permission to perform this action.';
        case 404:
          return 'Resource not found.';
        case 409:
          return 'Conflict. The resource already exists or has been modified.';
        case 422:
          return 'Validation failed. Please check your input data.';
        case 500:
          return 'Internal server error. Please try again later.';
        case 502:
          return 'Bad gateway. Please try again later.';
        case 503:
          return 'Service unavailable. Please try again later.';
        default:
          return `An error occurred (${error.status}). Please try again.`;
      }
    }
    
    // Default error message
    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Extract validation errors from error response
   */
  extractValidationErrors(error: any): { [key: string]: string[] } {
    const validationErrors: { [key: string]: string[] } = {};
    
    if (error.error?.validationErrors) {
      const errors = error.error.validationErrors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.members && err.members.length > 0) {
            err.members.forEach((member: string) => {
              if (!validationErrors[member]) {
                validationErrors[member] = [];
              }
              validationErrors[member].push(err.message);
            });
          }
        });
      }
    }
    
    return validationErrors;
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(error: any): boolean {
    return error.status === 400 || error.status === 422 || 
           (error.error?.validationErrors && error.error.validationErrors.length > 0);
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(error: any): boolean {
    return error.status === 0 || error.statusText === 'Unknown Error';
  }

  /**
   * Get user-friendly error message based on error type
   */
  getUserFriendlyMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    if (this.isValidationError(error)) {
      return 'Please correct the errors in the form and try again.';
    }
    
    return this.extractErrorMessage(error);
  }

  /**
   * Log error for debugging purposes
   */
  logError(error: any, context?: string): void {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    // You can also send errors to a logging service here
    // this.loggingService.logError(error, context);
  }
} 