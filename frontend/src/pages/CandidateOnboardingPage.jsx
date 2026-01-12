import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionAPI from '../services/sessionAPI';
import axios from 'axios';

function CandidateOnboardingPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [step, setStep] = useState('upload'); // 'upload', 'details', 'confirm'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form data
    const [resumeFile, setResumeFile] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Handle resume upload
    const handleResumeUpload = async (e) => {
        e.preventDefault();

        if (!resumeFile) {
            setError('Please select a resume file');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);

            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
            const response = await axios.post(
                `${API_BASE_URL}/api/session/${token}/upload-resume`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Pre-fill extracted data
            if (response.data.extractedData) {
                setName(response.data.extractedData.name || '');
                setEmail(response.data.extractedData.email || '');
                setPhone(response.data.extractedData.phone || '');
            }

            setStep('details');
        } catch (err) {
            console.error('Resume upload error:', err);
            setError(err.response?.data?.error || 'Failed to upload resume');
        } finally {
            setLoading(false);
        }
    };

    // Handle details confirmation
    const handleConfirmDetails = async (e) => {
        e.preventDefault();

        if (!name || !email) {
            setError('Name and email are required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
            await axios.post(
                `${API_BASE_URL}/api/session/${token}/confirm-details`,
                { name, email, phone }
            );

            setStep('confirm');
        } catch (err) {
            console.error('Confirm details error:', err);
            setError(err.response?.data?.error || 'Failed to confirm details');
        } finally {
            setLoading(false);
        }
    };

    // Start test
    const handleStartTest = () => {
        navigate(`/interviewee/session/${token}/test`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome to Flux Hire AI
                    </h1>
                    <p className="text-gray-600">
                        Let's get started with your technical assessment
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'upload' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                            }`}>
                            {step === 'upload' ? '1' : '✓'}
                        </div>
                        <div className={`w-24 h-1 ${step === 'upload' ? 'bg-gray-300' : 'bg-green-600'
                            }`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'upload' ? 'bg-gray-300 text-gray-600' :
                                step === 'details' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                            }`}>
                            {step === 'confirm' ? '✓' : '2'}
                        </div>
                        <div className={`w-24 h-1 ${step === 'confirm' ? 'bg-green-600' : 'bg-gray-300'
                            }`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'confirm' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            3
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Step 1: Upload Resume */}
                {step === 'upload' && (
                    <form onSubmit={handleResumeUpload}>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Step 1: Upload Your Resume
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Please upload your resume in PDF format (max 5MB)
                            </p>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className="cursor-pointer"
                                >
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-lg font-medium text-gray-700 mb-1">
                                        {resumeFile ? resumeFile.name : 'Click to upload resume'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        PDF only, up to 5MB
                                    </p>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!resumeFile || loading}
                            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Uploading...' : 'Continue'}
                        </button>
                    </form>
                )}

                {/* Step 2: Enter/Edit Details */}
                {step === 'details' && (
                    <form onSubmit={handleConfirmDetails}>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Step 2: Confirm Your Details
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Please verify and complete your information
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Saving...' : 'Confirm Details'}
                        </button>
                    </form>
                )}

                {/* Step 3: Confirmation */}
                {step === 'confirm' && (
                    <div>
                        <div className="mb-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                All Set!
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Your details have been confirmed
                            </p>

                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Name:</span>
                                        <p className="text-gray-900 font-medium">{name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Email:</span>
                                        <p className="text-gray-900 font-medium">{email}</p>
                                    </div>
                                    {phone && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Phone:</span>
                                            <p className="text-gray-900 font-medium">{phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-1">What's Next?</h3>
                                        <p className="text-sm text-blue-800">
                                            You'll complete a 30-question MCQ test. Each question has a 20-second timer. Good luck!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStartTest}
                            className="w-full py-4 px-6 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg"
                        >
                            Start Test →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CandidateOnboardingPage;
