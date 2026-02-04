import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256',
    });
};
/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRY,
        algorithm: 'HS256',
    });
};
/**
 * Verify access token
 */
export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256'],
        });
        return decoded;
    }
    catch (error) {
        return null;
    }
};
/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
            algorithms: ['HS256'],
        });
        return decoded;
    }
    catch (error) {
        return null;
    }
};
/**
 * Decode token without verification (for inspection)
 */
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=jwt.js.map