import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dsaAPI from '../services/dsaAPI';

function Round2IntroPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState(null);

    const handleStartCoding = async () => {
        try {
            setStarting(true);
            setError(null);

            await dsaAPI.startRound2(token);

            // Navigate to coding page
            navigate(`/interviewee/session/${token}/round2/coding`);
        } catch (err) {
            console.error('Failed to start Round 2:', err);
            setError(err.response?.data?.error || 'Failed to start Round 2. Please try again.');
            setStarting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Round 2: DSA Coding Challenge
                    </h1>
                    <p className="text-lg text-gray-600">
                        Test your problem-solving and coding skills
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">What to Expect</h2>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <span className="font-semibold">4 DSA Questions</span>
                                <p className="text-sm text-gray-600">Solve coding problems covering arrays, strings, stacks, and hashing</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <span className="font-semibold">90 Minutes Total</span>
                                <p className="text-sm text-gray-600">Global timer for all 4 questions combined</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <span className="font-semibold">5 Languages Supported</span>
                                <p className="text-sm text-gray-600">C++, Java, JavaScript, Go, Python</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            <div>
                                <span className="font-semibold">Navigate Freely</span>
                                <p className="text-sm text-gray-600">Skip and revisit questions anytime</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start">
                        <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-yellow-900 mb-1">Important</h3>
                            <ul className="text-sm text-yellow-800 space-y-1">
                                <li>• Your code will be auto-saved when switching questions</li>
                                <li>• The test will auto-submit when time expires</li>
                                <li>• You can run code with custom input before submitting</li>
                                <li>• Once started, the timer cannot be paused</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Start Button */}
                <button
                    onClick={handleStartCoding}
                    disabled={starting}
                    className="w-full px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg text-lg"
                >
                    {starting ? 'Starting...' : 'Start Coding Challenge 🚀'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Make sure you have a stable internet connection
                </p>
            </div>
        </div>
    );
}

export default Round2IntroPage;
