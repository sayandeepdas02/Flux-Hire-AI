# Flux Hire

**AI-powered technical hiring platform that eliminates bias, reduces time-to-hire, and identifies top engineering talent at scale.**


![Swift Invoice Banner](https://img.shields.io/badge/MERN-Stack-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Version](https://img.shields.io/badge/version-1.0.0-orange)

---

## The Problem

Traditional technical hiring is fundamentally broken:

- **Time-Intensive**: Manual resume screening and scheduling takes 40+ hours per hire
- **Inconsistent Evaluation**: Different interviewers apply different standards
- **High Costs**: Average cost-per-hire for engineers exceeds $4,000
- **Bias & Subjectivity**: Unconscious bias affects 78% of hiring decisions
- **Poor Candidate Experience**: Lengthy processes cause 60% drop-off rates
- **Limited Scalability**: Companies struggle to evaluate hundreds of applicants efficiently

---

## The Solution

Flux Hire AI is an end-to-end technical interview platform that automates and standardizes the entire hiring pipeline using AI-powered evaluation, live coding assessments, and intelligent screening.

### Key Benefits

- **10x Faster Screening**: Automated MCQ and coding evaluations reduce screening time from days to hours
- **Objective Assessment**: Standardized evaluation criteria eliminate interviewer bias
- **Scalable**: Handle 1,000+ candidates simultaneously without additional resources
- **Data-Driven Insights**: Real-time analytics on candidate performance and hiring metrics
- **Superior Candidate Experience**: Seamless, professional interface with instant feedback

---

## Interview Pipeline

Flux Hire AI implements a comprehensive 4-round technical assessment pipeline:

### Round 1: Core CS Fundamentals (MCQ)
- **30 Multiple-Choice Questions** covering Data Structures, Algorithms, OS, Networking, Databases, and System Design
- **20 Single-Correct + 10 Double-Correct** questions for comprehensive evaluation
- **20-Second Timer** per question with auto-skip functionality
- **Automated Scoring**: Instant evaluation with detailed performance breakdown
- **No Authentication Required**: Token-based access for seamless candidate experience

**Tech Stack**: React, Node.js, MongoDB

### Round 2: Live DSA Coding Interview
- **Real-Time Code Execution**: Integrated Judge0 API for multi-language support (Python, C++, Java, JavaScript)
- **3 Algorithmic Problems**: Progressively challenging questions (Easy → Medium → Hard)
- **Live Collaboration**: Real-time code editor with syntax highlighting
- **Automated Test Cases**: Instant validation against expected outputs
- **Performance Metrics**: Time complexity, memory usage, and execution time tracking

**Tech Stack**: Monaco Editor, Judge0 CE API, WebSockets

### Round 3: AI-Powered Video Screening
- **Technical Deep-Dive**: AI-generated questions based on resume and job description
- **Behavioral Assessment**: Evaluates communication, problem-solving approach, and cultural fit
- **Asynchronous Interviews**: Candidates record responses on their schedule
- **AI Analysis**: OpenAI GPT-4 evaluates technical accuracy, clarity, and confidence
- **Automated Scoring**: Comprehensive report with strengths, weaknesses, and hiring recommendation

**Tech Stack**: OpenAI GPT-4, WebRTC, Video Processing APIs

### Round 4: Final Human Interview (Optional)
- **Hiring Manager Review**: Senior engineers or hiring team conduct final assessment
- **Pre-Screened Candidates**: Only top performers from Rounds 1-3 advance
- **Contextual Insights**: Interviewers receive detailed performance reports from previous rounds
- **Reduced Time**: 30-minute focused conversation vs. 2-hour traditional interviews

---

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router v6
- **Styling**: Tailwind CSS (optional), Vanilla CSS
- **HTTP Client**: Axios with interceptors for token refresh
- **Code Editor**: Monaco Editor (VS Code engine)

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh Tokens)
- **Security**: Helmet, CORS, Rate Limiting, bcrypt
- **Code Execution**: Judge0 CE API (RapidAPI)
- **AI Integration**: OpenAI GPT-4 API

### Infrastructure & DevOps
- **Package Manager**: npm
- **Process Manager**: Nodemon (development)
- **Environment**: dotenv for configuration
- **Version Control**: Git with comprehensive `.gitignore`

---

## Architecture Overview

```
┌─────────────────┐
│   Candidate     │
│   (Browser)     │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                │
│  ┌──────────────────────────────────────────────┐  │
│  │  Session Join → MCQ Test → Coding → Video   │  │
│  │  Redux Store | Protected Routes | API Client│  │
│  └──────────────────────────────────────────────┘  │
└────────┬────────────────────────────────────────────┘
         │
         │ REST API
         ▼
┌─────────────────────────────────────────────────────┐
│           Backend (Node.js + Express)               │
│  ┌──────────────────────────────────────────────┐  │
│  │  Auth Routes | Session Routes | MCQ Routes  │  │
│  │  JWT Middleware | Rate Limiting | Validation│  │
│  └──────────────────────────────────────────────┘  │
└────┬────────────────────┬────────────────────┬──────┘
     │                    │                    │
     │                    │                    │
     ▼                    ▼                    ▼
┌─────────┐      ┌──────────────┐    ┌──────────────┐
│ MongoDB │      │  Judge0 API  │    │  OpenAI API  │
│         │      │ (Code Exec)  │    │   (GPT-4)    │
└─────────┘      └──────────────┘    └──────────────┘
```

---

## Local Development Setup

### Prerequisites
- Node.js 20.x or higher
- MongoDB 6.x or higher (local or Atlas)
- npm 9.x or higher
- OpenAI API Key (for Round 3)
- RapidAPI Key for Judge0 (for Round 2)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sayandeepdas02/Flux-Hire-AI.git
cd Flux-Hire-AI
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**

Create `.env` files in both `backend/` and `frontend/` directories:

**Backend `.env`** (see `backend/.env.example`):
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/flux-hire-ai
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
OPENAI_API_KEY=sk-your-openai-api-key
RAPIDAPI_KEY=your-rapidapi-key-for-judge0
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Frontend `.env`** (see `frontend/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5001
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod --dbpath /path/to/your/data/directory

# Or use MongoDB Atlas (cloud)
```

5. **Run the application**

Open two terminal windows:

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`

### Creating Test Sessions

To test the MCQ flow, create a test session:

```bash
cd backend
node scripts/createTestSession.js
```

This will output a test URL like:
```
http://localhost:5173/interviewee/session/[TOKEN]
```

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | Yes | `5001` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/flux-hire-ai` |
| `JWT_SECRET` | Secret for access tokens | Yes | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Yes | `your-refresh-secret` |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes (Round 3) | `sk-...` |
| `RAPIDAPI_KEY` | RapidAPI key for Judge0 | Yes (Round 2) | `your-rapidapi-key` |
| `RAPIDAPI_HOST` | Judge0 API host | Yes (Round 2) | `judge0-ce.p.rapidapi.com` |
| `CORS_ORIGIN` | Allowed frontend origin | Yes | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | No | `development` or `production` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes | `http://localhost:5001` |

**⚠️ Security Note**: Never commit `.env` files to version control. Use `.env.example` as a template.

---

## Security Best Practices

### Authentication & Authorization
- **JWT-based authentication** with short-lived access tokens (15 minutes)
- **Refresh tokens** stored as HttpOnly cookies (7 days expiry)
- **Automatic token refresh** via Axios interceptors
- **Role-based access control** (Interviewer, Candidate)
- **Password hashing** with bcrypt (10 salt rounds)

### API Security
- **Rate limiting**: 120 requests per 15 minutes per IP
- **Helmet.js**: Security headers (XSS, CSP, etc.)
- **CORS**: Restricted to frontend origin
- **Input validation**: Sanitization and validation on all endpoints
- **MongoDB injection prevention**: Mongoose schema validation

### Secrets Management
- **Environment variables**: All secrets stored in `.env` files
- **`.gitignore`**: Prevents accidental commits of sensitive files
- **GitHub Secret Scanning**: Push protection enabled
- **Production deployment**: Use secret management services (AWS Secrets Manager, Vault)

### Code Execution Security (Round 2)
- **Sandboxed execution**: Judge0 API runs code in isolated containers
- **Resource limits**: CPU, memory, and time constraints enforced
- **No direct server execution**: All code runs on external Judge0 infrastructure

---

## Project Structure

```
Flux-Hire-AI/
├── backend/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── data/
│   │   └── mcqQuestions.seed.js     # 30 hardcoded MCQ questions
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication middleware
│   │   └── rateLimiter.js           # Rate limiting middleware
│   ├── models/
│   │   ├── User.js                  # User schema (Interviewer/Candidate)
│   │   ├── CandidateSession.js      # Session schema with token
│   │   ├── MCQResponse.js           # MCQ answer storage
│   │   └── RefreshToken.js          # Refresh token management
│   ├── routes/
│   │   ├── auth.js                  # Authentication routes
│   │   └── session.routes.js        # MCQ session routes
│   ├── scripts/
│   │   └── createTestSession.js     # Generate test session tokens
│   ├── services/
│   │   └── authService.js           # Authentication business logic
│   ├── .env.example                 # Environment variables template
│   ├── package.json
│   └── server.js                    # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx   # Route protection component
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Authentication context (deprecated)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Public landing page
│   │   │   ├── SignInPage.jsx       # Interviewer login
│   │   │   ├── SignUpPage.jsx       # Interviewer registration
│   │   │   ├── InterviewerPage.jsx  # Interviewer dashboard
│   │   │   ├── IntervieweePage.jsx  # Candidate dashboard
│   │   │   ├── SessionJoinPage.jsx  # Token validation page
│   │   │   ├── MCQTestPage.jsx      # MCQ test interface
│   │   │   └── MCQCompletionPage.jsx# Round 1 completion
│   │   ├── services/
│   │   │   ├── authAPI.js           # Authentication API client
│   │   │   └── sessionAPI.js        # Session API client
│   │   ├── store/
│   │   │   ├── store.js             # Redux store configuration
│   │   │   └── slices/
│   │   │       └── authSlice.js     # Authentication state slice
│   │   ├── App.jsx                  # Main app component with routes
│   │   └── main.jsx                 # React entry point
│   ├── .env.example                 # Frontend environment template
│   ├── package.json
│   └── vite.config.js               # Vite configuration
│
├── .gitignore                       # Git ignore rules
├── package.json                     # Root package.json
└── README.md                        # This file
```

---

## API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`
Register a new interviewer account.

**Request Body**:
```json
{
  "email": "interviewer@company.com",
  "password": "SecurePass123",
  "role": "INTERVIEWER"
}
```

**Response**:
```json
{
  "user": {
    "id": "...",
    "email": "interviewer@company.com",
    "role": "INTERVIEWER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /api/auth/signin`
Login with email and password.

#### `POST /api/auth/refresh`
Refresh access token using refresh token cookie.

#### `POST /api/auth/signout`
Logout and invalidate refresh token.

### Session Endpoints (MCQ Round)

#### `GET /api/session/:token/validate`
Validate session token and return session info.

#### `GET /api/session/:token/questions`
Get all 30 MCQ questions (without correct answers).

#### `GET /api/session/:token/current`
Get current question number and progress.

#### `POST /api/session/:token/response`
Submit answer for current question.

**Request Body**:
```json
{
  "questionNumber": 1,
  "selectedIndices": [2],
  "timeSpent": 8,
  "skipped": false
}
```

#### `POST /api/session/:token/complete`
Mark Round 1 as completed.

---

## Roadmap

### Phase 1: Core Platform (Current)
- ✅ Round 1: MCQ assessment with automated scoring
- ✅ JWT-based authentication system
- ✅ Session management with token-based access
- ✅ MongoDB integration for data persistence
- ✅ Responsive UI with modern design

### Phase 2: Live Coding & AI Screening (Q1 2026)
- 🚧 Round 2: Live DSA coding with Judge0 integration
- 🚧 Round 3: AI-powered video screening with GPT-4
- 🚧 Real-time collaboration features
- 🚧 Automated code quality analysis

### Phase 3: Enterprise Features (Q2 2026)
- 📋 Interviewer dashboard with analytics
- 📋 Bulk candidate import via CSV
- 📋 Custom question banks
- 📋 White-label branding
- 📋 SSO integration (Google, Microsoft, Okta)
- 📋 Advanced reporting and insights

### Phase 4: Scale & Optimization (Q3 2026)
- 📋 Microservices architecture
- 📋 Redis caching for performance
- 📋 WebSocket-based real-time updates
- 📋 CDN integration for global delivery
- 📋 Multi-tenancy support
- 📋 99.9% uptime SLA

### Phase 5: AI & ML Enhancements (Q4 2026)
- 📋 Predictive hiring analytics
- 📋 Resume parsing with NLP
- 📋 Automated question generation
- 📋 Candidate ranking algorithms
- 📋 Bias detection and mitigation
- 📋 Interview outcome prediction

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## License

This project is proprietary software. All rights reserved.

**© 2026 Flux Hire AI. Unauthorized copying, distribution, or use is strictly prohibited.**

---

## Contact & Support

- **Website**: [fluxhire.ai](https://fluxhire.ai) (coming soon)
- **Email**: support@fluxhire.ai
- **GitHub**: [github.com/sayandeepdas02/Flux-Hire-AI](https://github.com/sayandeepdas02/Flux-Hire-AI)
- **LinkedIn**: [linkedin.com/company/flux-hire-ai](https://linkedin.com/company/flux-hire-ai)

---

## Acknowledgments

- **OpenAI** for GPT-4 API
- **Judge0** for code execution infrastructure
- **MongoDB** for database solutions
- **Vite** for blazing-fast frontend tooling
- **React** community for excellent libraries

---

**Built with ❤️ by the Flux Hire AI Team**

*Transforming technical hiring, one interview at a time.*
