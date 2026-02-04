/**
 * Custom error classes for consistent error handling
 */
export class ApiError extends Error {
    constructor(status, code, message, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
        this.name = 'ApiError';
    }
}
export class ValidationError extends ApiError {
    constructor(message, details) {
        super(400, 'VALIDATION_ERROR', message, details);
        this.name = 'ValidationError';
    }
}
export class AuthenticationError extends ApiError {
    constructor(message = 'Authentication failed') {
        super(401, 'AUTHENTICATION_ERROR', message);
        this.name = 'AuthenticationError';
    }
}
export class AuthorizationError extends ApiError {
    constructor(message = 'Insufficient permissions') {
        super(403, 'AUTHORIZATION_ERROR', message);
        this.name = 'AuthorizationError';
    }
}
export class NotFoundError extends ApiError {
    constructor(resource) {
        super(404, 'NOT_FOUND', `${resource} not found`);
        this.name = 'NotFoundError';
    }
}
export class ConflictError extends ApiError {
    constructor(message, details) {
        super(409, 'CONFLICT', message, details);
        this.name = 'ConflictError';
    }
}
export class UnprocessableEntityError extends ApiError {
    constructor(message, details) {
        super(422, 'UNPROCESSABLE_ENTITY', message, details);
        this.name = 'UnprocessableEntityError';
    }
}
export class InternalServerError extends ApiError {
    constructor(message = 'Internal server error', details) {
        super(500, 'INTERNAL_SERVER_ERROR', message, details);
        this.name = 'InternalServerError';
    }
}
export const createSuccessResponse = (data, meta) => ({
    success: true,
    data,
    meta: {
        timestamp: new Date().toISOString(),
        ...meta,
    },
});
export const createErrorResponse = (error, path, requestId) => ({
    success: false,
    error: {
        code: error.code,
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.details : undefined,
    },
    meta: {
        timestamp: new Date().toISOString(),
        path,
        requestId,
    },
});
//# sourceMappingURL=errors.js.map