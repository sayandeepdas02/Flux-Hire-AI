import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import sessionAPI from '../services/sessionAPI';

function MCQCompletionPage() {
    const { token } = useParams();
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSessionData = async () => {
            try {
                const data = await sessionAPI.validateSession(token);
                setSessionData(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load session data:', error);
                setLoading(false);
            }
        };

        loadSessionData();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Round 1 Completed! 🎉
                </h1>

                {/* Message */}
                <p className="text-lg text-gray-600 mb-8">
                    Congratulations! You have successfully completed the MCQ round.
                </p>

                {/* Stats */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Questions</p>
                            <p className="text-3xl font-bold text-gray-900">30</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Completed At</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {sessionData?.round1CompletedAt
                                    ? new Date(sessionData.round1CompletedAt).toLocaleString()
                                    : 'Just now'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start">
                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-left">
                            <h3 className="font-semibold text-blue-900 mb-1">What's Next?</h3>
                            <p className="text-sm text-blue-800">
                                Your responses have been recorded. The interviewer will review your performance and contact you regarding the next steps.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <p className="text-sm text-gray-500">
                    You may now close this window. Thank you for participating!
                </p>
            </div>
        </div>
    );
}

export default MCQCompletionPage;
