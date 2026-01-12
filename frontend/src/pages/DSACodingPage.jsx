import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import dsaAPI from '../services/dsaAPI';

function DSACodingPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [code, setCode] = useState({});
    const [language, setLanguage] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(5400); // 90 minutes in seconds
    const [output, setOutput] = useState('');
    const [executing, setExecuting] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [customInput, setCustomInput] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);

    const timerRef = useRef(null);
    const autoSaveRef = useRef(null);

    const currentQuestion = questions[currentQuestionIndex];
    const currentLang = language[currentQuestionIndex] || 'cpp';
    const currentCode = code[currentQuestionIndex] || (currentQuestion?.starterCode?.[currentLang] || '');

    // Language map for Monaco editor
    const monacoLanguageMap = {
        cpp: 'cpp',
        java: 'java',
        javascript: 'javascript',
        go: 'go',
        python: 'python',
    };

    // Load questions and submissions
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await dsaAPI.getQuestions(token);

                setQuestions(data.questions);
                setTimeRemaining(data.timeRemaining);

                // Load existing submissions
                const codeMap = {};
                const langMap = {};

                data.submissions.forEach(sub => {
                    codeMap[sub.questionNumber - 1] = sub.code;
                    langMap[sub.questionNumber - 1] = sub.language;
                });

                setCode(codeMap);
                setLanguage(langMap);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load questions:', error);
                if (error.response?.status === 403) {
                    alert(error.response.data.error);
                    navigate(`/interviewee/session/${token}/complete`);
                }
            }
        };

        loadData();
    }, [token, navigate]);

    // Timer countdown
    useEffect(() => {
        if (loading) return;

        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [loading]);

    // Auto-save on code change
    useEffect(() => {
        if (!currentQuestion || loading) return;

        if (autoSaveRef.current) {
            clearTimeout(autoSaveRef.current);
        }

        autoSaveRef.current = setTimeout(() => {
            saveCode(currentQuestionIndex, currentLang, currentCode);
        }, 2000); // Save after 2 seconds of inactivity

        return () => {
            if (autoSaveRef.current) {
                clearTimeout(autoSaveRef.current);
            }
        };
    }, [currentCode, currentLang, currentQuestionIndex]);

    // Save code to backend
    const saveCode = async (questionIndex, lang, codeContent) => {
        try {
            await dsaAPI.saveCode(token, questionIndex + 1, lang, codeContent);
        } catch (error) {
            console.error('Failed to save code:', error);
        }
    };

    // Handle code change
    const handleCodeChange = (value) => {
        setCode(prev => ({
            ...prev,
            [currentQuestionIndex]: value || '',
        }));
    };

    // Handle language change
    const handleLanguageChange = (newLang) => {
        setLanguage(prev => ({
            ...prev,
            [currentQuestionIndex]: newLang,
        }));

        // Load starter code if no code exists for this language
        if (!code[currentQuestionIndex]) {
            setCode(prev => ({
                ...prev,
                [currentQuestionIndex]: currentQuestion.starterCode[newLang] || '',
            }));
        }
    };

    // Handle question switch
    const handleQuestionSwitch = async (index) => {
        // Save current code before switching
        await saveCode(currentQuestionIndex, currentLang, currentCode);

        setCurrentQuestionIndex(index);
        setOutput('');
        setSubmitResult(null);
        setShowInput(false);
        setCustomInput('');
    };

    // Run code
    const handleRun = async () => {
        try {
            setExecuting(true);
            setOutput('Running...');
            setSubmitResult(null);

            const result = await dsaAPI.executeCode(
                token,
                currentQuestionIndex + 1,
                currentLang,
                currentCode,
                customInput
            );

            if (result.status === 'Accepted') {
                setOutput(result.stdout || '(No output)');
            } else if (result.compileOutput) {
                setOutput(`Compilation Error:\n${result.compileOutput}`);
            } else if (result.stderr) {
                setOutput(`Runtime Error:\n${result.stderr}`);
            } else {
                setOutput(`Status: ${result.status}\n${result.stdout || ''}`);
            }
        } catch (error) {
            setOutput(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setExecuting(false);
        }
    };

    // Submit code
    const handleSubmit = async () => {
        if (!window.confirm('Submit your solution? This will run against all test cases.')) {
            return;
        }

        try {
            setSubmitting(true);
            setOutput('Submitting...');
            setSubmitResult(null);

            const result = await dsaAPI.submitCode(
                token,
                currentQuestionIndex + 1,
                currentLang,
                currentCode
            );

            setSubmitResult(result);
            setOutput(`Test Results: ${result.testsPassed}/${result.totalTests} passed`);
        } catch (error) {
            setOutput(`Submission Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Complete Round 2
    const handleComplete = async () => {
        if (!window.confirm('End Round 2? You will not be able to make further changes.')) {
            return;
        }

        try {
            // Save current code
            await saveCode(currentQuestionIndex, currentLang, currentCode);

            await dsaAPI.completeRound2(token);
            navigate(`/interviewee/session/${token}/round2/complete`);
        } catch (error) {
            alert(`Failed to complete: ${error.response?.data?.error || error.message}`);
        }
    };

    // Auto-submit on time expiry
    const handleAutoSubmit = useCallback(async () => {
        try {
            await saveCode(currentQuestionIndex, currentLang, currentCode);
            await dsaAPI.completeRound2(token);
            navigate(`/interviewee/session/${token}/round2/complete`);
        } catch (error) {
            console.error('Auto-submit failed:', error);
        }
    }, [token, currentQuestionIndex, currentLang, currentCode, navigate]);

    // Format time
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading coding environment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Round 2 - DSA Coding</h1>
                    <p className="text-sm text-gray-500">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600 animate-pulse' : 'text-purple-600'}`}>
                        {formatTime(timeRemaining)}
                    </div>
                    <button
                        onClick={handleComplete}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-semibold"
                    >
                        End Round 2
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Navigation Panel */}
                <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Questions</h3>
                        <div className="space-y-2">
                            {questions.map((q, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuestionSwitch(index)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${index === currentQuestionIndex
                                            ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Q{index + 1}</span>
                                        {code[index] && code[index].trim() && (
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{q.title}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center: Question & Editor */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Question Panel */}
                    <div className="h-1/3 overflow-y-auto bg-white border-b border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <h2 className="text-xl font-bold text-gray-900">{currentQuestion.title}</h2>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                    currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {currentQuestion.difficulty}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                {currentQuestion.topic}
                            </span>
                        </div>

                        <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700">{currentQuestion.description}</div>

                            {currentQuestion.constraints && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Constraints:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {currentQuestion.constraints.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 flex flex-col">
                        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                            <select
                                value={currentLang}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
                            >
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="javascript">JavaScript</option>
                                <option value="go">Go</option>
                                <option value="python">Python</option>
                            </select>
                        </div>
                        <Editor
                            height="100%"
                            language={monacoLanguageMap[currentLang]}
                            value={currentCode}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>

                    {/* Execution Panel */}
                    <div className="h-48 bg-white border-t border-gray-200 flex flex-col">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowInput(!showInput)}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {showInput ? 'Hide' : 'Show'} Custom Input
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRun}
                                    disabled={executing || !currentCode.trim()}
                                    className="px-4 py-1.5 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {executing ? 'Running...' : 'Run'}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !currentCode.trim()}
                                    className="px-4 py-1.5 bg-purple-600 text-white rounded text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>

                        {showInput && (
                            <div className="px-4 py-2 border-b border-gray-200">
                                <textarea
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    placeholder="Enter custom input..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono resize-none"
                                    rows="2"
                                />
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto px-4 py-3">
                            {submitResult && (
                                <div className={`mb-3 p-3 rounded ${submitResult.allPassed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                                    <div className="font-semibold text-sm">
                                        {submitResult.allPassed ? '✓ All Tests Passed!' : `${submitResult.testsPassed}/${submitResult.totalTests} Tests Passed`}
                                    </div>
                                </div>
                            )}
                            <pre className="text-sm font-mono whitespace-pre-wrap text-gray-700">
                                {output || 'Output will appear here...'}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DSACodingPage;
