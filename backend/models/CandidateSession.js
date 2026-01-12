import mongoose from 'mongoose';

const candidateSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    candidateEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    signedToken: {
        type: String,
        required: true,
    },
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    usedAt: {
        type: Date,
    },
    candidateName: {
        type: String,
        trim: true,
    },
    candidatePhone: {
        type: String,
        trim: true,
    },
    resumeUrl: {
        type: String,
    },
    round1Completed: {
        type: Boolean,
        default: false,
    },
    round1CompletedAt: {
        type: Date,
    },
    currentQuestionNumber: {
        type: Number,
        default: 1,
        min: 1,
        max: 30,
    },
    // Round 2 fields
    round2Started: {
        type: Boolean,
        default: false,
    },
    round2StartedAt: {
        type: Date,
    },
    round2Completed: {
        type: Boolean,
        default: false,
    },
    round2CompletedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Automatic cleanup of expired sessions
candidateSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const CandidateSession = mongoose.model('CandidateSession', candidateSessionSchema);

export default CandidateSession;
