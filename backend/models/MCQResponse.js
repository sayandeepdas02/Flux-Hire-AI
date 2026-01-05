import mongoose from 'mongoose';

const mcqResponseSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true,
    },
    questionNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 30,
    },
    selectedIndices: {
        type: [Number],
        default: [],
    },
    timeSpent: {
        type: Number,
        default: 0,
    },
    skipped: {
        type: Boolean,
        default: false,
    },
    answeredAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure one response per question per session
mcqResponseSchema.index({ sessionId: 1, questionNumber: 1 }, { unique: true });

const MCQResponse = mongoose.model('MCQResponse', mcqResponseSchema);

export default MCQResponse;
