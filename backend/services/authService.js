import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';

// Environment variables with fallbacks (should be in .env)
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

/**
 * Hash password using bcrypt with 12 salt rounds
 */
export const hashPassword = async (plainPassword) => {
    return await User.hashPassword(plainPassword);
};

/**
 * Verify password against hash using constant-time comparison
 */
export const verifyPassword = async (plainPassword, hash) => {
    return await bcrypt.compare(plainPassword, hash);
};

/**
 * Generate short-lived JWT access token
 * @param {string} userId - User ID
 * @param {string} role - User role (INTERVIEWER, CANDIDATE)
 * @returns {string} Signed JWT token
 */
export const generateAccessToken = (userId, role) => {
    const payload = {
        userId,
        role,
        type: 'access',
    };

    return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRY,
        issuer: 'flux-hire-ai',
        audience: 'flux-hire-api',
    });
};

/**
 * Generate cryptographically secure refresh token
 * @param {string} userId - User ID
 * @returns {Object} { token, tokenHash, expiresAt }
 */
export const generateRefreshToken = async (userId) => {
    // Generate cryptographically secure random token
    const token = crypto.randomBytes(64).toString('hex');

    // Hash the token before storing in database
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Calculate expiry
    const expiresAt = new Date();
    const days = parseInt(JWT_REFRESH_EXPIRY.replace('d', '')) || 7;
    expiresAt.setDate(expiresAt.getDate() + days);

    // Store in database
    await RefreshToken.create({
        userId,
        tokenHash,
        expiresAt,
    });

    return { token, tokenHash, expiresAt };
};

/**
 * Verify and decode JWT access token
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET, {
            issuer: 'flux-hire-ai',
            audience: 'flux-hire-api',
        });

        if (decoded.type !== 'access') {
            throw new Error('Invalid token type');
        }

        return decoded;
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

/**
 * Rotate refresh token (revoke old, issue new)
 * Implements token rotation for enhanced security
 * @param {string} oldToken - Current refresh token
 * @returns {Object} { token, expiresAt }
 */
export const rotateRefreshToken = async (oldToken) => {
    // Hash the provided token
    const oldTokenHash = crypto.createHash('sha256').update(oldToken).digest('hex');

    // Find and verify the token
    const tokenRecord = await RefreshToken.findOne({ tokenHash: oldTokenHash });

    if (!tokenRecord) {
        throw new Error('Invalid refresh token');
    }

    if (tokenRecord.revokedAt) {
        throw new Error('Refresh token has been revoked');
    }

    if (new Date() > tokenRecord.expiresAt) {
        throw new Error('Refresh token has expired');
    }

    // Revoke the old token
    tokenRecord.revokedAt = new Date();
    await tokenRecord.save();

    // Generate new refresh token
    const newRefreshToken = await generateRefreshToken(tokenRecord.userId);

    return {
        token: newRefreshToken.token,
        expiresAt: newRefreshToken.expiresAt,
    };
};

/**
 * Revoke a refresh token (for logout)
 * @param {string} token - Refresh token to revoke
 */
export const revokeRefreshToken = async (token) => {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await RefreshToken.findOne({ tokenHash });

    if (tokenRecord && !tokenRecord.revokedAt) {
        tokenRecord.revokedAt = new Date();
        await tokenRecord.save();
    }
};

/**
 * Revoke all refresh tokens for a user (logout all devices)
 * @param {string} userId - User ID
 */
export const revokeAllUserTokens = async (userId) => {
    await RefreshToken.updateMany(
        { userId, revokedAt: null },
        { revokedAt: new Date() }
    );
};
