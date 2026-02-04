/**
 * Validate email format
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Validate phone number format (international)
 */
export declare const isValidPhoneNumber: (phone: string) => boolean;
/**
 * Validate UUID format
 */
export declare const isValidUUID: (uuid: string) => boolean;
/**
 * Sanitize string input to prevent XSS
 */
export declare const sanitizeString: (input: string) => string;
/**
 * Validate pagination parameters
 */
export declare const validatePagination: (limit?: number, offset?: number) => {
    limit: number;
    offset: number;
};
/**
 * Validate price
 */
export declare const isValidPrice: (price: number) => boolean;
/**
 * Validate coordinates (latitude, longitude)
 */
export declare const isValidCoordinates: (latitude: number, longitude: number) => boolean;
/**
 * Validate date range
 */
export declare const isValidDateRange: (startDate: Date, endDate: Date) => boolean;
//# sourceMappingURL=validators.d.ts.map