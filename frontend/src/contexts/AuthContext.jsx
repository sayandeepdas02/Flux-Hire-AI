import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosclient from '../api/axiosClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Store access token in memory only (NOT localStorage)
    useEffect(() => {
        window.__accessToken__ = accessToken;
    }, [accessToken]);

    // Listen for logout events from axios interceptor
    useEffect(() => {
        const handleLogoutEvent = () => {
            setUser(null);
            setAccessToken(null);
            setIsAuthenticated(false);
            // Don't navigate here - let components handle their own navigation
        };

        window.addEventListener('auth:logout', handleLogoutEvent);
        return () => window.removeEventListener('auth:logout', handleLogoutEvent);
    }, []);

    // Try to refresh token on app load
    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await axiosclient.post('/api/auth/refresh');
                const { accessToken: token } = response.data;

                setAccessToken(token);
                window.__accessToken__ = token;

                // Decode JWT to get user info (basic decode, no verification needed on client)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    userId: payload.userId,
                    role: payload.role,
                });
                setIsAuthenticated(true);
            } catch (error) {
                // No valid refresh token - user needs to sign in
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const signup = useCallback(async (email, password, fullName, dateOfBirth) => {
        try {
            const response = await axiosclient.post('/api/auth/signup', {
                email,
                password,
                fullName,
                dateOfBirth,
            });

            const { user: userData, accessToken: token } = response.data;

            setUser(userData);
            setAccessToken(token);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Signup failed';
            return { success: false, error: message };
        }
    }, []);

    const signin = useCallback(async (email, password) => {
        try {
            const response = await axiosclient.post('/api/auth/signin', {
                email,
                password,
            });

            const { user: userData, accessToken: token } = response.data;

            setUser(userData);
            setAccessToken(token);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Sign in failed';
            return { success: false, error: message };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await axiosclient.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setAccessToken(null);
            setIsAuthenticated(false);
            window.__accessToken__ = null;
            navigate('/signin');
        }
    }, [navigate]);

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await axiosclient.post('/api/auth/refresh');
            const { accessToken: token } = response.data;

            setAccessToken(token);
            return token;
        } catch (error) {
            throw new Error('Failed to refresh token');
        }
    }, []);

    const value = {
        user,
        accessToken,
        isLoading,
        isAuthenticated,
        signup,
        signin,
        logout,
        refreshAccessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
