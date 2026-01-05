# AI-Interview-Assistant

An AI-driven interview platform that allows interviewers to create sessions and share unique links with candidates. Candidates can upload resumes, get AI-generated personalized interview questions, answer them in real time with timers, and finally receive automated AI evaluation (score + summary). Interviewers can then view candidate responses and results in their dashboard.

🎥 Demo Video:

🚀 Features
👨‍🏫 For Interviewers
Create new interview sessions with title + interviewer name.
Generate a unique shareable session link for candidates.
Monitor candidate participation.
View candidate scores, summaries, and full Q&A transcripts.
Search & sort candidates by name, email, or score.

👩‍💻 For Candidates
Join an interview session via a link.
Upload resume (PDF/DOCX) → AI extracts details.
Get AI-generated technical questions (Easy, Medium, Hard).
Answer in a chat-like interface with timers.
Receive an AI-generated evaluation (score out of 100 + summary).


🛠️ Tech Stack
Frontend: React + Redux Toolkit + TailwindCSS State Persistence: redux-persist AI Integration: OpenAI GPT (gpt-4o-mini) Resume Parsing: PDF.js + Mammoth (for docx) Routing: React Router DOM


Flow
Interviewer logs in and creates a session. → Copy the generated session link.
Candidate opens the session link. → Uploads resume (PDF/DOCX). → AI generates personalized questions. → Candidate answers with a timer. → AI evaluates answers → gives score + summary.
Interviewer sees results in the dashboard with detailed Q&A.


📊 Example Output
Score: 78/100


Summary: Candidate demonstrated strong problem-solving skills and good knowledge of system design. Minor gaps in optimization strategies.


✅ Next Improvements
Add Authentication (JWT / Clerk / Firebase)
Store data in a real database (MongoDB / PostgreSQL)
Export candidate reports as PDF
Add video/audio interview support
Deploy to Vercel/Netlify + Backend on Render
👨‍💻 Author Sayandeep Das
