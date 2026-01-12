import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import InterviewerPage from "./pages/InterviewerPage";
import IntervieweePage from "./pages/IntervieweePage";
import SessionJoinPage from "./pages/sessionJoinPage";
import MCQTestPage from "./pages/MCQTestPage";
import MCQCompletionPage from "./pages/MCQCompletionPage";
import CandidateOnboardingPage from "./pages/CandidateOnboardingPage";
import Round2IntroPage from "./pages/Round2IntroPage";
import DSACodingPage from "./pages/DSACodingPage";
import Round2CompletionPage from "./pages/Round2CompletionPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/interviewer"
          element={
            <ProtectedRoute allowedRoles={['INTERVIEWER']}>
              <InterviewerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviewee"
          element={
            <ProtectedRoute allowedRoles={['INTERVIEWER', 'CANDIDATE']}>
              <IntervieweePage />
            </ProtectedRoute>
          }
        />
        {/* Public MCQ Test Routes - No authentication required */}
        <Route path="/interviewee/session/:token" element={<SessionJoinPage />} />
        <Route path="/interviewee/session/:token/onboarding" element={<CandidateOnboardingPage />} />
        <Route path="/interviewee/session/:token/test" element={<MCQTestPage />} />
        <Route path="/interviewee/session/:token/complete" element={<MCQCompletionPage />} />

        {/* Round 2 Routes - No authentication required */}
        <Route path="/interviewee/session/:token/round2/intro" element={<Round2IntroPage />} />
        <Route path="/interviewee/session/:token/round2/coding" element={<DSACodingPage />} />
        <Route path="/interviewee/session/:token/round2/complete" element={<Round2CompletionPage />} />

        <Route
          path="/join/:roomId"
          element={
            <ProtectedRoute>
              <SessionJoinPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
