import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionAPI from '../services/sessionAPI';

function SessionJoinPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateAndJoin = async () => {
      try {
        setLoading(true);
        const sessionData = await sessionAPI.validateSession(token);

        // Check if round is already completed
        if (sessionData.round1Completed) {
          navigate(`/interviewee/session/${token}/complete`);
          return;
        }

        // Redirect to test page
        navigate(`/interviewee/session/${token}/test`);
      } catch (err) {
        console.error('Session validation error:', err);
        if (err.response?.status === 404) {
          setError('Session not found. Please check your link.');
        } else if (err.response?.status === 403) {
          setError('This session has expired.');
        } else {
          setError('Failed to validate session. Please try again.');
        }
        setLoading(false);
      }
    };

    if (token) {
      validateAndJoin();
    } else {
      setError('Invalid session link.');
      setLoading(false);
    }
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Validating session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Please contact the interviewer for a new link.</p>
        </div>
      </div>
    );
  }

  return null;
}

export default SessionJoinPage;
