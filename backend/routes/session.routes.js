import express from 'express';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import CandidateSession from '../models/CandidateSession.js';
import MCQResponse from '../models/MCQResponse.js';
import { getQuestionsForSession } from '../data/mcqQuestions.seed.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/resumes';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.params.token}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Create new interview session (for interviewer)
router.post('/create', requireAuth, async (req, res) => {
    try {
        const { title, interviewer } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Session title is required' });
        }

        // Generate unique session ID and token
        const sessionId = `session-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        const signedToken = crypto.randomBytes(32).toString('hex');

        // Set expiration to 7 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Create session in database
        const session = await CandidateSession.create({
            sessionId,
            candidateEmail: 'pending@example.com', // Placeholder, will be updated when candidate joins
            signedToken,
            interviewerId: req.user.userId,
            expiresAt,
            used: false,
            round1Completed: false,
            currentQuestionNumber: 1,
        });

        // Return session data with shareable link
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const link = `${frontendUrl}/interviewee/session/${signedToken}`;

        res.json({
            sessionId: session.sessionId,
            token: signedToken,
            title: title,
            interviewer: interviewer || req.user.email,
            expiresAt: session.expiresAt,
            link,
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// Upload resume and extract details
router.post('/:token/upload-resume', upload.single('resume'), async (req, res) => {
    try {
        const { token } = req.params;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (new Date() > session.expiresAt) {
            return res.status(403).json({ error: 'Session has expired' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Resume file is required' });
        }

        // Store resume URL
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;
        session.resumeUrl = resumeUrl;
        await session.save();

        // Simple extraction (you can enhance this with actual PDF parsing)
        // For now, return placeholder data that frontend can edit
        const extractedData = {
            name: '',
            email: '',
            phone: ''
        };

        res.json({
            extractedData,
            resumeUrl,
            message: 'Resume uploaded successfully. Please fill in your details.'
        });
    } catch (error) {
        console.error('Upload resume error:', error);
        res.status(500).json({ error: 'Failed to upload resume' });
    }
});

// Confirm candidate details
router.post('/:token/confirm-details', async (req, res) => {
    try {
        const { token } = req.params;
        const { name, email, phone } = req.body;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (new Date() > session.expiresAt) {
            return res.status(403).json({ error: 'Session has expired' });
        }

        // Update session with candidate details
        session.candidateName = name;
        session.candidateEmail = email;
        session.candidatePhone = phone;
        session.used = true;
        session.usedAt = new Date();
        await session.save();

        res.json({
            success: true,
            message: 'Details confirmed successfully'
        });
    } catch (error) {
        console.error('Confirm details error:', error);
        res.status(500).json({ error: 'Failed to confirm details' });
    }
});

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

// ==================== ROUND 2: DSA CODING ROUTES ====================

import DSASubmission from '../models/DSASubmission.js';
import { getQuestionsForRound2, getTestCases } from '../data/dsaQuestions.seed.js';
import { executeCode, runTestCases } from '../services/judge0Service.js';

// Start Round 2
router.post('/:token/round2/start', async (req, res) => {
    try {
        const { token } = req.params;
        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (new Date() > session.expiresAt) {
            return res.status(403).json({ error: 'Session has expired' });
        }

        if (!session.round1Completed) {
            return res.status(403).json({ error: 'Round 1 not completed' });
        }

        if (session.round2Completed) {
            return res.status(403).json({ error: 'Round 2 already completed' });
        }

        if (session.round2Started) {
            // Already started - return current state
            return res.json({
                alreadyStarted: true,
                startedAt: session.round2StartedAt,
            });
        }

        // Start Round 2
        session.round2Started = true;
        session.round2StartedAt = new Date();
        await session.save();

        res.json({
            success: true,
            startedAt: session.round2StartedAt,
        });
    } catch (error) {
        console.error('Start Round 2 error:', error);
        res.status(500).json({ error: 'Failed to start Round 2' });
    }
});

// Get Round 2 questions
router.get('/:token/round2/questions', async (req, res) => {
    try {
        const { token } = req.params;
        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (!session.round2Started) {
            return res.status(403).json({ error: 'Round 2 not started' });
        }

        if (session.round2Completed) {
            return res.status(403).json({ error: 'Round 2 already completed' });
        }

        // Calculate time remaining
        const startTime = new Date(session.round2StartedAt).getTime();
        const elapsed = Date.now() - startTime;
        const timeRemaining = Math.max(0, 5400000 - elapsed); // 90 min in ms

        // Get all submissions for this session
        const submissions = await DSASubmission.find({ sessionId: session.sessionId });

        res.json({
            questions: getQuestionsForRound2(),
            timeRemaining: Math.floor(timeRemaining / 1000), // in seconds
            submissions: submissions.map(s => ({
                questionNumber: s.questionNumber,
                language: s.language,
                code: s.code,
                status: s.status,
            })),
        });
    } catch (error) {
        console.error('Get Round 2 questions error:', error);
        res.status(500).json({ error: 'Failed to get questions' });
    }
});

// Execute code (Run with custom input)
router.post('/:token/round2/execute', async (req, res) => {
    try {
        const { token } = req.params;
        const { questionNumber, language, code, input } = req.body;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.round2Completed) {
            return res.status(403).json({ error: 'Round 2 already completed' });
        }

        // Check time
        const startTime = new Date(session.round2StartedAt).getTime();
        const elapsed = Date.now() - startTime;
        if (elapsed > 5400000) {
            return res.status(403).json({ error: 'Time expired' });
        }

        // Execute code
        const result = await executeCode(language, code, input || '');

        // Auto-save code as attempted
        await DSASubmission.findOneAndUpdate(
            { sessionId: session.sessionId, questionNumber },
            {
                sessionId: session.sessionId,
                questionNumber,
                language,
                code,
                status: 'attempted',
            },
            { upsert: true }
        );

        res.json(result);
    } catch (error) {
        console.error('Execute code error:', error);
        res.status(500).json({ error: error.message || 'Failed to execute code' });
    }
});

// Submit code (Run against test cases)
router.post('/:token/round2/submit-code', async (req, res) => {
    try {
        const { token } = req.params;
        const { questionNumber, language, code } = req.body;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.round2Completed) {
            return res.status(403).json({ error: 'Round 2 already completed' });
        }

        // Check time
        const startTime = new Date(session.round2StartedAt).getTime();
        const elapsed = Date.now() - startTime;
        if (elapsed > 5400000) {
            return res.status(403).json({ error: 'Time expired' });
        }

        // Get test cases
        const testCases = getTestCases(questionNumber);

        // Run against test cases
        const testResults = await runTestCases(language, code, testCases);

        // Save submission
        await DSASubmission.findOneAndUpdate(
            { sessionId: session.sessionId, questionNumber },
            {
                sessionId: session.sessionId,
                questionNumber,
                language,
                code,
                status: 'submitted',
                submittedAt: new Date(),
                testsPassed: testResults.passed,
                totalTests: testResults.total,
            },
            { upsert: true }
        );

        res.json({
            success: true,
            testsPassed: testResults.passed,
            totalTests: testResults.total,
            allPassed: testResults.passed === testResults.total,
        });
    } catch (error) {
        console.error('Submit code error:', error);
        res.status(500).json({ error: error.message || 'Failed to submit code' });
    }
});

// Save code (auto-save on question switch)
router.post('/:token/round2/save-code', async (req, res) => {
    try {
        const { token } = req.params;
        const { questionNumber, language, code } = req.body;

        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.round2Completed) {
            return res.status(403).json({ error: 'Round 2 already completed' });
        }

        // Save code
        await DSASubmission.findOneAndUpdate(
            { sessionId: session.sessionId, questionNumber },
            {
                sessionId: session.sessionId,
                questionNumber,
                language,
                code,
                status: code.trim() ? 'attempted' : 'not_attempted',
            },
            { upsert: true }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Save code error:', error);
        res.status(500).json({ error: 'Failed to save code' });
    }
});

// Complete Round 2
router.post('/:token/round2/complete', async (req, res) => {
    try {
        const { token } = req.params;
        const session = await CandidateSession.findOne({ signedToken: token });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.round2Completed) {
            return res.status(403).json({ error: 'Round 2 already completed' });
        }

        // Mark as completed
        session.round2Completed = true;
        session.round2CompletedAt = new Date();
        await session.save();

        res.json({
            success: true,
            completedAt: session.round2CompletedAt,
        });
    } catch (error) {
        console.error('Complete Round 2 error:', error);
        res.status(500).json({ error: 'Failed to complete Round 2' });
    }
});

export default router;

