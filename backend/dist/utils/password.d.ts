/**
 * Hash a password
 */
export declare const hashPassword: (password: string) => Promise<string>;
/**
 * Compare password with hash
 */
export declare const comparePassword: (password: string, passwordHash: string) => Promise<boolean>;
/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export declare const validatePasswordStrength: (password: string) => {
    isValid: boolean;
    errors: string[];
};
//# sourceMappingURL=password.d.ts.map