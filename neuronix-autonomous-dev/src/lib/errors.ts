/**
 * Error Handling Utilities
 * 
 * Centralized error handling with error codes and structured error responses.
 */

export enum ErrorCode {
  INVALID_BRIEF = "INVALID_BRIEF",
  MALICIOUS_CONTENT = "MALICIOUS_CONTENT",
  AGENT_UNAVAILABLE = "AGENT_UNAVAILABLE",
  GENERATION_FAILED = "GENERATION_FAILED",
  REPOSITORY_ERROR = "REPOSITORY_ERROR",
  DEPLOYMENT_ERROR = "DEPLOYMENT_ERROR",
  TIMEOUT = "TIMEOUT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Handles errors and returns appropriate error response
 */
export function handleError(error: unknown): {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  statusCode: number;
} {
  const timestamp = new Date().toISOString();

  // Handle AppError instances
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp,
      statusCode: error.statusCode,
    };
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: error.message,
      },
      timestamp,
      statusCode: 500,
    };
  }

  // Handle unknown error types
  return {
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: "An unexpected error occurred",
      details: { originalError: String(error) },
    },
    timestamp,
    statusCode: 500,
  };
}

/**
 * Creates a validation error
 */
export function createValidationError(message: string): AppError {
  return new AppError(message, ErrorCode.INVALID_BRIEF, 400);
}

/**
 * Creates a malicious content error
 */
export function createMaliciousContentError(): AppError {
  return new AppError(
    "Brief contains potentially malicious content",
    ErrorCode.MALICIOUS_CONTENT,
    400
  );
}

/**
 * Creates an agent unavailable error
 */
export function createAgentUnavailableError(agentName: string): AppError {
  return new AppError(
    `${agentName} is currently unavailable`,
    ErrorCode.AGENT_UNAVAILABLE,
    503,
    { agent: agentName }
  );
}

/**
 * Creates a timeout error
 */
export function createTimeoutError(phase: string): AppError {
  return new AppError(
    `Request timeout exceeded during ${phase} phase`,
    ErrorCode.TIMEOUT,
    408,
    { phase }
  );
}
