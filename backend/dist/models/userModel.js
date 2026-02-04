import { pool } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';
/**
 * User model - Database query functions
 */
/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`, [email.toLowerCase()]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    catch (error) {
        console.error('Database error in findUserByEmail:', error);
        throw error;
    }
};
/**
 * Find user by ID
 */
export const findUserById = async (userId) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`, [userId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    catch (error) {
        console.error('Database error in findUserById:', error);
        throw error;
    }
};
/**
 * Create new user
 */
export const createUser = async (userData) => {
    try {
        const userId = uuidv4();
        const now = new Date();
        const result = await pool.query(`INSERT INTO users (
        id, email, password_hash, first_name, last_name, user_type,
        is_superhost, response_rate, trust_score, verification_status,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`, [
            userId,
            userData.email.toLowerCase(),
            userData.password_hash,
            userData.first_name,
            userData.last_name,
            userData.user_type,
            false,
            0,
            50, // Initial trust score
            'pending',
            now,
            now,
        ]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Database error in createUser:', error);
        throw error;
    }
};
/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new NotFoundError('User');
        }
        // Build dynamic UPDATE query
        const allowedFields = [
            'first_name',
            'last_name',
            'bio',
            'phone_number',
            'profile_picture_url',
            'response_time_hours',
        ];
        const updateFields = [];
        const values = [];
        let paramCount = 1;
        for (const field of allowedFields) {
            if (field in updates) {
                updateFields.push(`${field} = $${paramCount}`);
                values.push(updates[field]);
                paramCount++;
            }
        }
        if (updateFields.length === 0) {
            return user;
        }
        updateFields.push(`updated_at = $${paramCount}`);
        values.push(new Date());
        values.push(userId);
        const query = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount + 1} AND deleted_at IS NULL
      RETURNING *
    `;
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new NotFoundError('User');
        }
        return result.rows[0];
    }
    catch (error) {
        console.error('Database error in updateUserProfile:', error);
        throw error;
    }
};
/**
 * Update user verification status
 */
export const updateVerificationStatus = async (userId, status) => {
    try {
        const result = await pool.query(`UPDATE users
       SET verification_status = $1, updated_at = NOW()
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`, [status, userId]);
        if (result.rows.length === 0) {
            throw new NotFoundError('User');
        }
        return result.rows[0];
    }
    catch (error) {
        console.error('Database error in updateVerificationStatus:', error);
        throw error;
    }
};
/**
 * Update user verification document
 */
export const updateVerificationDocument = async (userId, documentUrl) => {
    try {
        const result = await pool.query(`UPDATE users
       SET verification_document_url = $1, updated_at = NOW()
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING *`, [documentUrl, userId]);
        if (result.rows.length === 0) {
            throw new NotFoundError('User');
        }
        return result.rows[0];
    }
    catch (error) {
        console.error('Database error in updateVerificationDocument:', error);
        throw error;
    }
};
/**
 * Increment user response rate
 */
export const updateResponseMetrics = async (userId, responseTimeHours) => {
    try {
        // Get current stats
        const user = await findUserById(userId);
        if (!user) {
            throw new NotFoundError('User');
        }
        // Calculate new response rate
        const newResponseRate = Math.min(100, user.response_rate + 2);
        const result = await pool.query(`UPDATE users
       SET response_rate = $1, response_time_hours = $2, updated_at = NOW()
       WHERE id = $3 AND deleted_at IS NULL
       RETURNING *`, [newResponseRate, responseTimeHours, userId]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Database error in updateResponseMetrics:', error);
        throw error;
    }
};
/**
 * Soft delete user
 */
export const softDeleteUser = async (userId) => {
    try {
        await pool.query(`UPDATE users
       SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`, [userId]);
    }
    catch (error) {
        console.error('Database error in softDeleteUser:', error);
        throw error;
    }
};
/**
 * Search users by name or email (for public profiles)
 */
export const searchUsers = async (query, limit = 20, offset = 0) => {
    try {
        // Search query
        const searchQuery = `%${query}%`;
        const result = await pool.query(`SELECT * FROM users
       WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1)
       AND deleted_at IS NULL
       AND verification_status = 'verified'
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`, [searchQuery, limit, offset]);
        // Count total
        const countResult = await pool.query(`SELECT COUNT(*) as total FROM users
       WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1)
       AND deleted_at IS NULL
       AND verification_status = 'verified'`, [searchQuery]);
        return {
            users: result.rows,
            total: parseInt(countResult.rows[0].total),
        };
    }
    catch (error) {
        console.error('Database error in searchUsers:', error);
        throw error;
    }
};
/**
 * Get user trust score and statistics
 */
export const getUserTrustStats = async (userId) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            return null;
        }
        // Get review statistics
        const reviewStats = await pool.query(`SELECT COUNT(*) as count, AVG(rating) as avg_rating
       FROM reviews
       WHERE reviewee_id = $1 AND deleted_at IS NULL`, [userId]);
        const reviewCount = parseInt(reviewStats.rows[0].count) || 0;
        const averageRating = parseFloat(reviewStats.rows[0].avg_rating) || 0;
        return {
            trustScore: user.trust_score,
            responseRate: user.response_rate,
            isSuperhost: user.is_superhost,
            reviewCount,
            averageRating,
        };
    }
    catch (error) {
        console.error('Database error in getUserTrustStats:', error);
        throw error;
    }
};
//# sourceMappingURL=userModel.js.map