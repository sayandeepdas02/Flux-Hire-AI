import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Create axios instance with auth token
const getAuthClient = () => {
    // Get token from window (set by AuthContext)
    const token = window.__accessToken__;

    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
    });
};

export const interviewerAPI = {
    // Create new interview session
    createSession: async (title, interviewer) => {
        const client = getAuthClient();
        const response = await client.post('/api/session/create', {
            title,
            interviewer
        });
        return response.data;
    },
};

export default interviewerAPI;