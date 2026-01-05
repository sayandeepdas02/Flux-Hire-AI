import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import OpenAI from "openai";

// Import database and authentication
import connectDatabase from "./config/database.js";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.routes.js";
import { requireAuth, requireRole } from "./middleware/auth.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - restrict to frontend origin
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parser and cookie parser
app.use(express.json({ limit: "150kb" }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// OpenAI client (backend only)
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// simple in-memory store (dev only)
const store = {}; // { [candidateId]: { questions, correct, answers, dsa: {...} } }

const QUESTIONS_COUNT = 30;
const PER_Q_SECONDS = 20;

/* ---------- Utility: safe JSON parser ---------- */
function safeParseJSON(input) {
  if (!input) return null;
  try {
    let s = String(input).trim();
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
    return JSON.parse(s);
  } catch (err) {
    const m = String(input).match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (m) {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/* ---------- Helper: normalize outputs for comparison ---------- */
function normalizeForCompare(output) {
  if (output == null) return "";
  const s = String(output).trim();

  // if looks like an array (e.g. "[0, 1]" or "[0,1]"), normalize by removing whitespace inside brackets
  if (s.startsWith("[") && s.endsWith("]")) {
    return s.replace(/\s+/g, "");
  }

  // normalize newlines & whitespace, then trim
  return s.replace(/\r?\n/g, "").trim();
}

/* ---------- Authentication Routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);

/* ---------- Endpoint: generate-mcqs (uses OpenAI) ---------- */
app.post("/api/generate-mcqs", requireAuth, requireRole(['INTERVIEWER']), async (req, res) => {
  try {
    const { resumeText, candidateId } = req.body;
    if (!resumeText || !candidateId)
      return res.status(400).json({ error: "resumeText and candidateId required" });

    // Strict prompt that asks for ONLY a JSON array
    const prompt = `You are a test-generator for SHORT multiple-choice questions.
Return EXACTLY a JSON array of length ${QUESTIONS_COUNT}. Each item must be an object:
{ "question": "<text>", "options": ["optA","optB","optC","optD"], "correctIndices": [<0..3>, ...] }

Rules:
- The first 20 items must each have exactly ONE correctIndices (single correct).
- The last 10 items must each have exactly TWO correctIndices (two correct answers).
- Questions should come from core Computer Science fundamentals (Data structures, Algorithms, Complexity, Big-O, Arrays, Strings, Trees, Graphs, Hashing, OS basics, Networking basics, Databases, SQL basics, System design basics, JavaScript fundamentals, Node.js/React basics, Testing).
- Avoid trivial phrasing like 'Which statement is true about X?'. Use short, concrete MCQs (example: 'Which data structure gives O(1) average lookup?').
- Provide concise options (max 60 chars each).
- Do NOT include any explanatory text, markdown, backticks, or labels. Return ONLY the JSON array.
Resume (for context, but questions should be general CS fundamentals):
${resumeText}
`;

    // Try twice (first candidate attempt); if parsing fails, fall back to deterministic set below
    let parsed = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 2500,
      });

      const raw = response?.choices?.[0]?.message?.content ?? response?.choices?.[0]?.text ?? "";
      parsed = safeParseJSON(raw);
      if (Array.isArray(parsed) && parsed.length === QUESTIONS_COUNT) break;
    }

    // If AI failed to produce clean JSON, use a deterministic fallback (clean, CS-focused)
    if (!Array.isArray(parsed) || parsed.length !== QUESTIONS_COUNT) {
      console.warn("AI failed to produce expected MCQs — using deterministic fallback.");
      const topics = [
        // 30 concise CS-fundamental question templates (you can customize)
        ["Which data structure gives O(1) average key lookup?", ["Array", "LinkedList", "Hash table", "Binary tree"], [2]],
        ["Which traversal visits left, root, right?", ["Preorder", "Inorder", "Postorder", "Level-order"], [1]],
        ["Which algorithm sorts in O(n log n) worst-case?", ["Quicksort", "Mergesort", "Bubble sort", "Selection sort"], [1]],
        ["What is the time complexity of binary search?", ["O(n)", "O(log n)", "O(n log n)", "O(1)"], [1]],
        ["Which structure uses FIFO ordering?", ["Stack", "Queue", "HashMap", "Tree"], [1]],
        ["Which is a stable sort?", ["Quicksort", "Mergesort", "Heapsort", "Selection sort"], [1]],
        ["Which is used for LIFO?", ["Queue", "Stack", "Graph", "Hash table"], [1]],
        ["Which graph representation uses adjacency lists?", ["Matrix", "List", "Set", "Queue"], [1]],
        ["Which is best for implemented LRU cache?", ["Hash + LinkedList", "BST", "Array", "Trie"], [0]],
        ["Which is a NoSQL database type?", ["Relational", "Document", "CSV", "XML"], [1]],
        ["(multi) Which are binary search tree properties?", ["Left < root", "Right > root", "Both", "Neither"], [2]],
        ["(multi) Which are stable sorting algorithms?", ["Mergesort", "Quicksort", "Insertion sort", "Heapsort"], [0, 2]],
        // ... repeat until 30 total; if fewer templates, duplicate with safe variants
      ];

      // Expand/fill to 30: rotate and ensure first 20 single-answers, last 10 multi-answer
      const normalized = [];
      while (normalized.length < QUESTIONS_COUNT) {
        const idx = normalized.length % topics.length;
        const [q, opts, corr] = topics[idx];
        // For first 20, ensure single correct; for last 10 ensure two correct
        const i = normalized.length;
        if (i < 20) {
          // if our corr has multiple pick only first
          const correct = Array.isArray(corr) ? [corr[0]] : [corr];
          normalized.push({ question: q.replace(/^\(multi\)\s*/i, ""), options: opts.slice(0, 4), correctIndices: correct });
        } else {
          // ensure two answers (if cors length < 2, push a second safe index)
          let correct = Array.isArray(corr) ? corr.slice(0, 2) : [corr, (corr + 1) % 4];
          if (correct.length < 2) correct = [0, 1];
          normalized.push({ question: q.replace(/^\(multi\)\s*/i, ""), options: opts.slice(0, 4), correctIndices: correct });
        }
      }

      // Normalize store and respond
      const stored = normalized.slice(0, QUESTIONS_COUNT).map((x) => ({
        question: x.question,
        options: x.options,
        correctIndices: x.correctIndices.map(Number).filter((n) => n >= 0 && n < 4),
      }));

      store[candidateId] = {
        questions: stored.map(({ question, options }) => ({ question, options })),
        correct: stored.map((q) => q.correctIndices),
      };

      return res.json({ questions: store[candidateId].questions, perQuestionSeconds: PER_Q_SECONDS, fallback: true });
    }

    // AI parsed OK — normalize
    const normalized = parsed.map((q, i) => {
      const opts = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
      while (opts.length < 4) opts.push("N/A");
      let correct = Array.isArray(q.correctIndices)
        ? q.correctIndices.map(Number).filter((n) => n >= 0 && n < 4)
        : [];
      // Enforce counts: first 20 -> 1, last 10 -> 2 (if AI violated, adjust deterministically)
      const needTwo = i >= 20;
      if (!needTwo && correct.length !== 1) correct.splice(1); // keep first only
      if (needTwo && correct.length < 2) {
        // add a second index not equal to first
        const pick = correct[0] || 0;
        correct = [pick, (pick + 1) % 4];
      }
      return { question: q.question, options: opts, correctIndices: correct };
    });

    store[candidateId] = {
      questions: normalized.map(({ question, options }) => ({ question, options })),
      correct: normalized.map((q) => q.correctIndices),
    };

    res.json({ questions: store[candidateId].questions, perQuestionSeconds: PER_Q_SECONDS, fallback: false });
  } catch (err) {
    console.error("generate-mcqs error:", err);
    res.status(500).json({ error: err.message || "generate-mcqs failed" });
  }
});


/* ---------- Endpoint: evaluate (MCQ round) ---------- */
app.post("/api/evaluate", requireAuth, (req, res) => {
  try {
    const { candidateId, answers } = req.body;
    const data = store[candidateId];
    if (!data) return res.status(400).json({ error: "candidateId not found or questions not generated yet" });
    if (!Array.isArray(data.correct)) return res.status(400).json({ error: "no correct answers available for candidate" });

    const correct = data.correct;
    if (!answers || !Array.isArray(answers) || answers.length !== correct.length) {
      return res.status(400).json({ error: `answers array required and must have length ${correct.length}` });
    }

    const QUESTION_WEIGHT = 100 / correct.length;

    let total = 0;
    correct.forEach((corr, i) => {
      const ans = Array.isArray(answers[i]) ? answers[i] : [];
      const right = ans.filter((a) => corr.includes(a)).length;
      const wrong = ans.filter((a) => !corr.includes(a)).length;
      const score = Math.max((right / Math.max(corr.length, 1)) - wrong / 4, 0);
      total += score * QUESTION_WEIGHT;
    });

    const finalScore = Math.round(total);
    res.json({ score: finalScore, summary: `Auto-scored ${correct.length} MCQs. Score: ${finalScore}` });
  } catch (err) {
    console.error("evaluate error:", err);
    res.status(500).json({ error: err.message || "evaluate failed" });
  }
});

/* ----------------- DSA Round: coding execution & evaluation ----------------- */

// Simple DSA problem set (3 problems)
const DSA_QUESTIONS = [
  {
    id: "dsa1",
    title: "Two Sum",
    description:
      "Given space-separated integers as an array on first line and target on second line. Output indices as [i,j].",
    sampleInput: "2 7 11 15\n9",
    expectedOutput: "[0,1]",
    defaultLanguage: "python3",
    points: 33,
  },
  {
    id: "dsa2",
    title: "Reverse List",
    description: "Given space-separated integers, return them reversed separated by spaces.",
    sampleInput: "1 2 3 4 5",
    expectedOutput: "5 4 3 2 1",
    defaultLanguage: "python3",
    points: 33,
  },
  {
    id: "dsa3",
    title: "Palindrome Check",
    description:
      "Given a string, print YES if it's a palindrome (ignore spaces & case) else NO.",
    sampleInput: "Race car",
    expectedOutput: "YES",
    defaultLanguage: "python3",
    points: 34,
  },
];

// map language name -> Judge0 language id
const LANGUAGE_MAP = {
  python3: 71,
  cpp: 54,
  javascript: 63,
  java: 62,
};

// Helper to call Judge0 via RapidAPI (wait=true synchronous)
async function runOnJudge0({ language_id, source_code, stdin = "" }) {
  const host = process.env.RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new Error("RAPIDAPI_KEY not set in server .env");

  const url = `https://${host}/submissions?base64_encoded=false&wait=true`;
  const body = { language_id, source_code, stdin };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Judge0 call failed: ${resp.status} ${text}`);
  }
  return resp.json();
}

// GET /api/dsa-questions
app.get("/api/dsa-questions", requireAuth, (req, res) => {
  return res.json({ questions: DSA_QUESTIONS });
});

// POST /api/run-code
app.post("/api/run-code", requireAuth, async (req, res) => {
  try {
    const { language = "python3", code = "", input = "" } = req.body;
    if (!code) return res.status(400).json({ error: "code is required" });

    const language_id = LANGUAGE_MAP[language] || LANGUAGE_MAP.python3;
    const result = await runOnJudge0({ language_id, source_code: code, stdin: input });

    const output = {
      status: result.status,
      stdout: result.stdout ?? null,
      stderr: result.stderr ?? null,
      compile_output: result.compile_output ?? null,
      time: result.time ?? null,
      memory: result.memory ?? null,
    };
    return res.json(output);
  } catch (err) {
    console.error("run-code error:", err);
    return res.status(500).json({ error: err.message || "run-code failed" });
  }
});

// POST /api/evaluate-dsa
app.post("/api/evaluate-dsa", requireAuth, requireRole(['INTERVIEWER']), async (req, res) => {
  try {
    const { candidateId, submissions } = req.body;
    if (!candidateId || !Array.isArray(submissions)) {
      return res.status(400).json({ error: "candidateId and submissions[] required" });
    }

    let totalPointsAvailable = 0;
    let totalPointsEarned = 0;
    const results = [];

    for (const s of submissions) {
      const q = DSA_QUESTIONS.find((qq) => qq.id === s.questionId);
      const points = (q && q.points) || 0;
      totalPointsAvailable += points;

      const language = s.language || (q && q.defaultLanguage) || "python3";
      const language_id = LANGUAGE_MAP[language] || LANGUAGE_MAP.python3;
      const code = s.code || "";
      const input = typeof s.input !== "undefined" ? s.input : (q && q.sampleInput) || "";

      let runResult;
      try {
        runResult = await runOnJudge0({ language_id, source_code: code, stdin: input });
      } catch (err) {
        results.push({
          questionId: s.questionId,
          passed: false,
          pointsAwarded: 0,
          error: String(err.message || err),
        });
        continue;
      }

      const stdout = (runResult.stdout || "").trim();
      const expected = (s.expectedOutput ?? (q && q.expectedOutput) ?? "").trim();

      // normalize both for tolerant comparison
      const outNorm = normalizeForCompare(stdout);
      const expNorm = normalizeForCompare(expected);
      const passed = expNorm.length > 0 ? outNorm === expNorm : false;
      const pointsAwarded = passed ? points : 0;
      totalPointsEarned += pointsAwarded;

      results.push({
        questionId: s.questionId,
        passed,
        pointsAwarded,
        stdout,
        expected,
        status: runResult.status,
        stderr: runResult.stderr,
        compile_output: runResult.compile_output,
      });
    }

    const score = totalPointsAvailable > 0 ? Math.round((totalPointsEarned / totalPointsAvailable) * 100) : 0;

    store[candidateId] = store[candidateId] || {};
    store[candidateId].dsa = {
      evaluatedAt: Date.now(),
      totalPointsAvailable,
      totalPointsEarned,
      score,
      results,
    };

    return res.json({ score, totalPointsAvailable, totalPointsEarned, results });
  } catch (err) {
    console.error("evaluate-dsa error:", err);
    return res.status(500).json({ error: err.message || "evaluate-dsa failed" });
  }
});

/* ---------- start server ---------- */
const startServer = async () => {
  try {
    // Connect to database first
    await connectDatabase();

    // Only start server after successful DB connection
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
