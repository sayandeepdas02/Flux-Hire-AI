import { verifyAccessToken } from '../services/authService.js';

/**
 * Middleware to require authentication
 * Verifies JWT access token from Authorization header
 */
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Middleware to require specific role(s)
 * Must be used after requireAuth
 * @param {Array<string>} allowedRoles - Array of allowed roles
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

/**
 * Optional authentication middleware
 * Attaches user if token present, continues if not
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyAccessToken(token);

            req.user = {
                userId: decoded.userId,
                role: decoded.role,
            };
        }
    } catch (error) {
        // Silently fail - auth is optional
    }

    next();
};
