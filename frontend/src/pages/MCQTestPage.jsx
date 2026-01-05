import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionAPI from '../services/sessionAPI';

function MCQTestPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const [submitting, setSubmitting] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    const isSingleCorrect = currentQuestion?.type === 'single';
    const isDoubleCorrect = currentQuestion?.type === 'double';

    // Load questions on mount
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);

                // Validate session first
                const sessionData = await sessionAPI.validateSession(token);

                if (sessionData.round1Completed) {
                    navigate(`/interviewee/session/${token}/complete`);
                    return;
                }

                // Get questions
                const { questions: mcqQuestions } = await sessionAPI.getQuestions(token);
                setQuestions(mcqQuestions);

                // Get current progress
                const currentData = await sessionAPI.getCurrentQuestion(token);
                if (currentData.completed) {
                    navigate(`/interviewee/session/${token}/complete`);
                    return;
                }

                // Set current question index (API returns 1-based, we use 0-based)
                setCurrentQuestionIndex((currentData.currentQuestionNumber || 1) - 1);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load questions:', error);
                navigate(`/interviewee/session/${token}`);
            }
        };

        loadQuestions();
    }, [token, navigate]);

    // Timer countdown
    useEffect(() => {
        if (loading || !currentQuestion) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Auto-skip when time runs out
                    handleAutoSkip();
                    return 20;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, currentQuestion, currentQuestionIndex]);

    // Auto-skip handler
    const handleAutoSkip = useCallback(async () => {
        if (submitting) return;

        setSubmitting(true);
        try {
            const timeSpent = 20 - timeLeft;
            await sessionAPI.submitResponse(token, questionNumber, selectedOptions, timeSpent, true);

            // Move to next question or complete
            if (questionNumber >= 30) {
                await sessionAPI.completeRound(token);
                navigate(`/interviewee/session/${token}/complete`);
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOptions([]);
                setTimeLeft(20);
            }
        } catch (error) {
            console.error('Failed to auto-skip:', error);
        } finally {
            setSubmitting(false);
        }
    }, [token, questionNumber, selectedOptions, timeLeft, submitting, navigate]);

    // Handle option selection
    const handleOptionSelect = (optionIndex) => {
        if (isSingleCorrect) {
            setSelectedOptions([optionIndex]);
        } else if (isDoubleCorrect) {
            if (selectedOptions.includes(optionIndex)) {
                setSelectedOptions(selectedOptions.filter(i => i !== optionIndex));
            } else if (selectedOptions.length < 2) {
                setSelectedOptions([...selectedOptions, optionIndex]);
            } else {
                // Replace first selection with new one
                setSelectedOptions([selectedOptions[1], optionIndex]);
            }
        }
    };

    // Handle clear selection
    const handleClear = () => {
        setSelectedOptions([]);
    };

    // Handle next button
    const handleNext = async () => {
        if (submitting) return;

        setSubmitting(true);
        try {
            const timeSpent = 20 - timeLeft;
            await sessionAPI.submitResponse(token, questionNumber, selectedOptions, timeSpent, false);

            // Move to next question or complete
            if (questionNumber >= 30) {
                await sessionAPI.completeRound(token);
                navigate(`/interviewee/session/${token}/complete`);
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOptions([]);
                setTimeLeft(20);
            }
        } catch (error) {
            console.error('Failed to submit response:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Check if next button should be enabled
    const isNextEnabled = () => {
        if (isSingleCorrect) {
            return selectedOptions.length === 1;
        } else if (isDoubleCorrect) {
            return selectedOptions.length === 2;
        }
        return false;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading test...</p>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">No questions available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Round 1 - MCQ Test</h1>
                        <p className="text-sm text-gray-500">Question {questionNumber} of 30</p>
                    </div>
                    <div className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                        {timeLeft}s
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto px-6 mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(questionNumber / 30) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Question Type Badge */}
                    <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${isSingleCorrect ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                            {isSingleCorrect ? 'Single Correct' : 'Double Correct (Select 2)'}
                        </span>
                    </div>

                    {/* Question Text */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                        {currentQuestion.questionText}
                    </h2>

                    {/* Options */}
                    <div className="space-y-4 mb-8">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedOptions.includes(index);
                            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 ${isSelected
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'border-gray-300'
                                            }`}>
                                            {isSingleCorrect ? (
                                                <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-white' : ''}`}></div>
                                            ) : (
                                                isSelected && (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">{optionLabel}.</span>
                                            <span className="ml-2 text-gray-700">{option}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                        {isDoubleCorrect && (
                            <button
                                onClick={handleClear}
                                disabled={selectedOptions.length === 0}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Clear Selection
                            </button>
                        )}

                        <div className={isDoubleCorrect ? '' : 'ml-auto'}>
                            <button
                                onClick={handleNext}
                                disabled={!isNextEnabled() || submitting}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                            >
                                {submitting ? 'Submitting...' : questionNumber === 30 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>

                    {/* Validation Message */}
                    {isDoubleCorrect && selectedOptions.length === 1 && (
                        <p className="mt-4 text-sm text-amber-600 text-center">
                            Please select exactly 2 options to continue
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MCQTestPage;
