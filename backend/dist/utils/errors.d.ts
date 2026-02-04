/**
 * Custom error classes for consistent error handling
 */
export declare class ApiError extends Error {
    status: number;
    code: string;
    details?: any | undefined;
    constructor(status: number, code: string, message: string, details?: any | undefined);
}
export declare class ValidationError extends ApiError {
    constructor(message: string, details?: any);
}
export declare class AuthenticationError extends ApiError {
    constructor(message?: string);
}
export declare class AuthorizationError extends ApiError {
    constructor(message?: string);
}
export declare class NotFoundError extends ApiError {
    constructor(resource: string);
}
export declare class ConflictError extends ApiError {
    constructor(message: string, details?: any);
}
export declare class UnprocessableEntityError extends ApiError {
    constructor(message: string, details?: any);
}
export declare class InternalServerError extends ApiError {
    constructor(message?: string, details?: any);
}
/**
 * Create a formatted API response
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        timestamp: string;
        path?: string;
        requestId?: string;
    };
}
export declare const createSuccessResponse: <T>(data: T, meta?: any) => ApiResponse<T>;
export declare const createErrorResponse: (error: ApiError, path?: string, requestId?: string) => ApiResponse<null>;
//# sourceMappingURL=errors.d.ts.map