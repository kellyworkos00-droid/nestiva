import { findUserByEmail, createUser, findUserById, updateUserProfile, updateVerificationDocument, } from '../models/userModel';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password';
import { isValidEmail } from '../utils/validators';
import { AuthenticationError, ValidationError, ConflictError, } from '../utils/errors';
/**
 * Auth Service - Handles authentication operations
 */
/**
 * Register a new user
 */
export const registerUser = async (payload) => {
    // Validate input
    if (!isValidEmail(payload.email)) {
        throw new ValidationError('Invalid email format');
    }
    if (!payload.first_name?.trim() || !payload.last_name?.trim()) {
        throw new ValidationError('First and last names are required');
    }
    // Validate password strength
    const passwordValidation = validatePasswordStrength(payload.password);
    if (!passwordValidation.isValid) {
        throw new ValidationError('Password does not meet strength requirements', {
            errors: passwordValidation.errors,
        });
    }
    // Check if user already exists
    const existingUser = await findUserByEmail(payload.email);
    if (existingUser) {
        throw new ConflictError('User with this email already exists');
    }
    // Hash password
    const passwordHash = await hashPassword(payload.password);
    // Create user
    const user = await createUser({
        email: payload.email,
        password_hash: passwordHash,
        first_name: payload.first_name,
        last_name: payload.last_name,
        user_type: payload.user_type,
    });
    // Generate tokens
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
    };
    const token = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);
    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token,
        refreshToken,
    };
};
/**
 * Login user
 */
export const loginUser = async (payload) => {
    // Validate input
    if (!isValidEmail(payload.email)) {
        throw new ValidationError('Invalid email format');
    }
    if (!payload.password) {
        throw new ValidationError('Password is required');
    }
    // Find user
    const user = await findUserByEmail(payload.email);
    if (!user) {
        throw new AuthenticationError('Invalid email or password');
    }
    // Verify password
    const isPasswordValid = await comparePassword(payload.password, user.password_hash);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
    }
    // Generate tokens
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
    };
    const token = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);
    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token,
        refreshToken,
    };
};
/**
 * Verify phone number
 */
export const sendPhoneVerificationCode = async (phoneNumber) => {
    // In production, integrate with Twilio or similar service
    // For now, generate a random 6-digit code
    const code = Math.random().toString().slice(2, 8);
    // TODO: Send code via SMS
    // await sendSMS(phoneNumber, `Your Nestiva verification code is: ${code}`);
    console.log(`Phone verification code for ${phoneNumber}: ${code}`);
    return code;
};
/**
 * Verify phone code
 */
export const verifyPhoneCode = async (userId, phoneNumber, code) => {
    // TODO: Validate code against stored verification code
    // For now, just update user phone number as verified
    const user = await findUserById(userId);
    if (!user) {
        throw new AuthenticationError('User not found');
    }
    // Update user with verified phone
    const updatedUser = await updateUserProfile(userId, {
        phone_number: phoneNumber,
    });
    return updatedUser;
};
/**
 * Handle ID verification upload
 */
export const uploadVerificationDocument = async (userId, documentUrl, documentType) => {
    // In production, integrate with ID verification service (e.g., Onfido, IDology)
    // For now, just store the document URL
    const user = await findUserById(userId);
    if (!user) {
        throw new AuthenticationError('User not found');
    }
    // Store document
    const updatedUser = await updateVerificationDocument(userId, documentUrl);
    // TODO: Send to third-party verification service
    // const verificationResult = await verifyIdDocument(documentUrl, documentType);
    // await updateVerificationStatus(userId, verificationResult.status);
    return updatedUser;
};
/**
 * Verify JWT token and get user
 */
export const verifyTokenAndGetUser = async (userId) => {
    return await findUserById(userId);
};
//# sourceMappingURL=authService.js.map