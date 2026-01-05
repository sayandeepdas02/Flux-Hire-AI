import express from 'express';
import CandidateSession from '../models/CandidateSession.js';
import MCQResponse from '../models/MCQResponse.js';
import { getQuestionsForSession } from '../data/mcqQuestions.seed.js';

const router = express.Router();

// Validate session token and return session info
router.get('/:token/validate', async (req, res) => {
    try {
        const { token } = req.params;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Check if session has expired
        if (new Date() > session.expiresAt) {
            return res.status(403).json({ error: 'Session has expired' });
        }

        // Return session info
        res.json({
            sessionId: session.sessionId,
            candidateEmail: session.candidateEmail,
            candidateName: session.candidateName,
            expiresAt: session.expiresAt,
            round1Completed: session.round1Completed,
            currentQuestionNumber: session.currentQuestionNumber,
        });
    } catch (error) {
        console.error('Session validation error:', error);
        res.status(500).json({ error: 'Failed to validate session' });
    }
});

// Get all MCQ questions for the session (without correct answers)
router.get('/:token/questions', async (req, res) => {
    try {
        const { token } = req.params;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (new Date() > session.expiresAt) {
            return res.status(403).json({ error: 'Session has expired' });
        }

        // Get questions without correct answers
        const questions = getQuestionsForSession();

        res.json({
            questions,
            totalQuestions: 30,
            perQuestionSeconds: 20,
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ error: 'Failed to get questions' });
    }
});

// Get current question and progress
router.get('/:token/current', async (req, res) => {
    try {
        const { token } = req.params;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (new Date() > session.expiresAt) {
            return res.status(403).json({ error: 'Session has expired' });
        }

        if (session.round1Completed) {
            return res.json({
                completed: true,
                completedAt: session.round1CompletedAt,
            });
        }

        // Get all questions
        const questions = getQuestionsForSession();
        const currentQuestion = questions.find(q => q.questionNumber === session.currentQuestionNumber);

        // Get responses so far
        const responses = await MCQResponse.find({ sessionId: session.sessionId }).sort({ questionNumber: 1 });

        res.json({
            currentQuestionNumber: session.currentQuestionNumber,
            currentQuestion,
            totalQuestions: 30,
            responsesCount: responses.length,
            completed: false,
        });
    } catch (error) {
        console.error('Get current question error:', error);
        res.status(500).json({ error: 'Failed to get current question' });
    }
});

// Submit response for current question
router.post('/:token/response', async (req, res) => {
    try {
        const { token } = req.params;
        const { questionNumber, selectedIndices = [], timeSpent = 0, skipped = false } = req.body;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (new Date() > session.expiresAt) {
            return res.status(403).json({ error: 'Session has expired' });
        }

        if (session.round1Completed) {
            return res.status(403).json({ error: 'Round 1 already completed' });
        }

        // Validate question number
        if (questionNumber < 1 || questionNumber > 30) {
            return res.status(400).json({ error: 'Invalid question number' });
        }

        // Save or update response
        await MCQResponse.findOneAndUpdate(
            { sessionId: session.sessionId, questionNumber },
            {
                sessionId: session.sessionId,
                questionNumber,
                selectedIndices,
                timeSpent,
                skipped,
                answeredAt: new Date(),
            },
            { upsert: true, new: true }
        );

        // Update current question number if moving forward
        if (questionNumber >= session.currentQuestionNumber && questionNumber < 30) {
            session.currentQuestionNumber = questionNumber + 1;
            await session.save();
        }

        res.json({
            success: true,
            nextQuestionNumber: questionNumber < 30 ? questionNumber + 1 : null,
        });
    } catch (error) {
        console.error('Submit response error:', error);
        res.status(500).json({ error: 'Failed to submit response' });
    }
});

// Complete Round 1
router.post('/:token/complete', async (req, res) => {
    try {
        const { token } = req.params;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (new Date() > session.expiresAt) {
            return res.status(403).json({ error: 'Session has expired' });
        }

        if (session.round1Completed) {
            return res.json({
                success: true,
                message: 'Round 1 already completed',
                completedAt: session.round1CompletedAt,
            });
        }

        // Mark round as completed
        session.round1Completed = true;
        session.round1CompletedAt = new Date();
        await session.save();

        // Get total responses
        const responsesCount = await MCQResponse.countDocuments({ sessionId: session.sessionId });

        res.json({
            success: true,
            completedAt: session.round1CompletedAt,
            totalResponses: responsesCount,
        });
    } catch (error) {
        console.error('Complete round error:', error);
        res.status(500).json({ error: 'Failed to complete round' });
    }
});

export default router;
