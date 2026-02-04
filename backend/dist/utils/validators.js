/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * Validate phone number format (international)
 */
export const isValidPhoneNumber = (phone) => {
    // Basic international phone validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};
/**
 * Validate UUID format
 */
export const isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (input) => {
    return input
        .trim()
        .replace(/[<>]/g, '')
        .substring(0, 500); // Max 500 chars
};
/**
 * Validate pagination parameters
 */
export const validatePagination = (limit, offset) => {
    const maxLimit = 100;
    const validLimit = Math.min(Math.max(limit || 20, 1), maxLimit);
    const validOffset = Math.max(offset || 0, 0);
    return {
        limit: validLimit,
        offset: validOffset,
    };
};
/**
 * Validate price
 */
export const isValidPrice = (price) => {
    return typeof price === 'number' && price > 0 && price <= 10000;
};
/**
 * Validate coordinates (latitude, longitude)
 */
export const isValidCoordinates = (latitude, longitude) => {
    return (typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180);
};
/**
 * Validate date range
 */
export const isValidDateRange = (startDate, endDate) => {
    return startDate < endDate && startDate > new Date();
};
//# sourceMappingURL=validators.js.map