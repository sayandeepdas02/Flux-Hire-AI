import rateLimit from 'express-rate-limit';

/**
 * Strict rate limiter for signin attempts
 * 5 requests per 15 minutes per IP
 */
export const signinLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Strict rate limiter for signup attempts
 * 3 requests per hour per IP
 */
export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 requests per hour
    message: { error: 'Too many signup attempts. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Standard rate limiter for auth endpoints
 * 10 requests per 15 minutes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
