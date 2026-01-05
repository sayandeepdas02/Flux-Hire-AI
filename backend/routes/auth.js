import express from 'express';
import User from '../models/User.js';
import {
    hashPassword,
    generateAccessToken,
    generateRefreshToken,
    rotateRefreshToken,
    revokeRefreshToken,
} from '../services/authService.js';
import { signinLimiter, signupLimiter, authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create new interviewer account
 */
router.post('/signup', signupLimiter, async (req, res) => {
    try {
        const { email, password, fullName, dateOfBirth } = req.body;

        // Validation
        if (!email || !password || !fullName) {
            return res.status(400).json({ error: 'Email, password, and full name are required' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ error: 'Password must contain at least one number' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash,
            fullName,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            role: 'INTERVIEWER',
        });

        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = await generateRefreshToken(user._id.toString());

        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });

        // Return user info and access token
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
            accessToken,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

/**
 * POST /api/auth/signin
 * Authenticate user and issue tokens
 */
router.post('/signin', signinLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Generic error message to prevent user enumeration
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = await generateRefreshToken(user._id.toString());

        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });

        // Return user info and access token
        res.json({
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
            accessToken,
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Signin failed' });
    }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', authLimiter, async (req, res) => {
    try {
        const { refreshToken: oldToken } = req.cookies;

        if (!oldToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        // Rotate refresh token
        const { token: newRefreshToken, expiresAt } = await rotateRefreshToken(oldToken);

        // Get user ID from token record to generate new access token
        const crypto = await import('crypto');
        const tokenHash = crypto.createHash('sha256').update(oldToken).digest('hex');
        const RefreshToken = (await import('../models/RefreshToken.js')).default;
        const tokenRecord = await RefreshToken.findOne({ tokenHash });

        if (!tokenRecord) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const User = (await import('../models/User.js')).default;
        const user = await User.findById(tokenRecord.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id.toString(), user.role);

        // Set new refresh token cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.json({ accessToken });
    } catch (error) {
        console.error('Refresh error:', error);
        res.status(401).json({ error: 'Token refresh failed' });
    }
});

/**
 * POST /api/auth/logout
 * Revoke refresh token and clear cookie
 */
router.post('/logout', async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            await revokeRefreshToken(refreshToken);
        }

        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            path: '/',
        });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

export default router;
