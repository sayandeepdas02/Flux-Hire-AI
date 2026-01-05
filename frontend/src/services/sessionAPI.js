import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Create axios instance for session endpoints (no auth required)
const sessionClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sessionAPI = {
    // Validate session token
    validateSession: async (token) => {
        const response = await sessionClient.get(`/api/session/${token}/validate`);
        return response.data;
    },

    // Get all questions for the session
    getQuestions: async (token) => {
        const response = await sessionClient.get(`/api/session/${token}/questions`);
        return response.data;
    },

    // Get current question and progress
    getCurrentQuestion: async (token) => {
        const response = await sessionClient.get(`/api/session/${token}/current`);
        return response.data;
    },

    // Submit response for a question
    submitResponse: async (token, questionNumber, selectedIndices, timeSpent, skipped = false) => {
        const response = await sessionClient.post(`/api/session/${token}/response`, {
            questionNumber,
            selectedIndices,
            timeSpent,
            skipped,
        });
        return response.data;
    },

    // Complete Round 1
    completeRound: async (token) => {
        const response = await sessionClient.post(`/api/session/${token}/complete`);
        return response.data;
    },
};

export default sessionAPI;
