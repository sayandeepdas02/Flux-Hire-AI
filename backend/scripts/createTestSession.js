import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CandidateSession from '../models/CandidateSession.js';
import crypto from 'crypto';

dotenv.config();

const createTestSession = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Generate a test token
        const testToken = crypto.randomBytes(32).toString('hex');

        // Create expiration date (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // Create test session
        const session = await CandidateSession.create({
            sessionId: `test-session-${Date.now()}`,
            candidateEmail: 'test.candidate@example.com',
            candidateName: 'Test Candidate',
            signedToken: testToken,
            interviewerId: new mongoose.Types.ObjectId(), // Dummy interviewer ID
            expiresAt,
            used: false,
            round1Completed: false,
            currentQuestionNumber: 1,
        });

        console.log('\n✅ Test session created successfully!');
        console.log('\n📋 Session Details:');
        console.log(`   Session ID: ${session.sessionId}`);
        console.log(`   Candidate Email: ${session.candidateEmail}`);
        console.log(`   Candidate Name: ${session.candidateName}`);
        console.log(`   Expires At: ${session.expiresAt}`);
        console.log('\n🔗 Test URL:');
        console.log(`   http://localhost:5173/interviewee/session/${testToken}`);
        console.log('\n📝 Token (for API testing):');
        console.log(`   ${testToken}`);
        console.log('\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error creating test session:', error);
        process.exit(1);
    }
};

createTestSession();
