import mongoose from 'mongoose';

const dsaSubmissionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true,
    },
    questionNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
    },
    language: {
        type: String,
        required: true,
        enum: ['cpp', 'java', 'javascript', 'go', 'python'],
    },
    code: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['not_attempted', 'attempted', 'submitted'],
        default: 'not_attempted',
    },
    submittedAt: {
        type: Date,
    },
    testsPassed: {
        type: Number,
        default: 0,
    },
    totalTests: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index for efficient queries
dsaSubmissionSchema.index({ sessionId: 1, questionNumber: 1 }, { unique: true });

const DSASubmission = mongoose.model('DSASubmission', dsaSubmissionSchema);

export default DSASubmission;
