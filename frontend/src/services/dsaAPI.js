import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Create axios instance for DSA Round 2 endpoints (no auth required for candidates)
const dsaClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const dsaAPI = {
    // Start Round 2
    startRound2: async (token) => {
        const response = await dsaClient.post(`/api/session/${token}/round2/start`);
        return response.data;
    },

    // Get all questions and current progress
    getQuestions: async (token) => {
        const response = await dsaClient.get(`/api/session/${token}/round2/questions`);
        return response.data;
    },

    // Execute code with custom input (Run)
    executeCode: async (token, questionNumber, language, code, input = '') => {
        const response = await dsaClient.post(`/api/session/${token}/round2/execute`, {
            questionNumber,
            language,
            code,
            input,
        });
        return response.data;
    },

    // Submit code against test cases
    submitCode: async (token, questionNumber, language, code) => {
        const response = await dsaClient.post(`/api/session/${token}/round2/submit-code`, {
            questionNumber,
            language,
            code,
        });
        return response.data;
    },

    // Save code (auto-save)
    saveCode: async (token, questionNumber, language, code) => {
        const response = await dsaClient.post(`/api/session/${token}/round2/save-code`, {
            questionNumber,
            language,
            code,
        });
        return response.data;
    },

    // Complete Round 2
    completeRound2: async (token) => {
        const response = await dsaClient.post(`/api/session/${token}/round2/complete`);
        return response.data;
    },
};

export default dsaAPI;
