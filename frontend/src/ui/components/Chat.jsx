// src/ui/components/Chat.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useCountdown from "../hooks/useCountdown";
import {
  addCandidateAnswer,
  evaluateCandidateSuccess,
  updateCandidateTimer,
  updateCandidateField,
} from "../../slices/sessionSlice";
import {
  addCandidate as addGlobalCandidate,
  updateCandidateField as updateGlobalCandidateField,
} from "../../slices/candidateSlice";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

/**
 * Chat component - handles:
 *  - Round 1: MCQ flow (30 questions, timer per question)
 *  - Round 1 -> show result page and "Start Round 2"
 *  - Round 2: DSA (3 problems) using /api/dsa-questions, /api/run-code, /api/evaluate-dsa
 */
export default function Chat({ sessionId, candidateId }) {
  const dispatch = useDispatch();

  const candidate = useSelector((state) => {
    const session = state.session.sessions.find((s) => s.id === sessionId);
    return session?.candidates.find((c) => c.id === candidateId);
  });

  const globalCandidates = useSelector((state) => state.candidate?.candidates || []);

  // Round + state
  // round: 'mcq' | 'mcq_done' | 'dsa' | 'final'
  const [round, setRound] = useState("mcq");

  // MCQ state
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [loadingMcq, setLoadingMcq] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [evaluating, setEvaluating] = useState(false);

  // DSA state
  const [dsaQuestions, setDsaQuestions] = useState([]);
  const [loadingDsa, setLoadingDsa] = useState(false);
  const [dsaIndex, setDsaIndex] = useState(0);
  const [dsaCode, setDsaCode] = useState("");
  const [dsaLanguage, setDsaLanguage] = useState("python3");
  const [dsaRunResult, setDsaRunResult] = useState(null);
  const [dsaSubmissions, setDsaSubmissions] = useState([]);

  // refs to avoid stale closures
  const candidateRef = useRef(candidate);
  const answersRef = useRef(candidate?.answers || []);
  useEffect(() => {
    candidateRef.current = candidate;
    answersRef.current = candidate?.answers || [];
  }, [candidate]);

  const currentIndex = candidate?.currentIndex || 0;
  const submittedRef = useRef(false);
  const fetchedMcqOnce = useRef(false);

  // ---------- Utility: clean fallback text ----------
  const stripFallbackPrefix = (s) => {
    if (!s || typeof s !== "string") return s;
    return s.replace(/^\(Fallback\)\s*/i, "").trim();
  };

  // ---------- MCQ generation: call backend once when resume is available ----------
  useEffect(() => {
    if (!candidate?.resumeText || fetchedMcqOnce.current) return;
    fetchedMcqOnce.current = true;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setLoadingMcq(true);
        const resp = await fetch(`${API_BASE}/api/generate-mcqs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: candidate.resumeText, candidateId }),
        });

        if (!resp.ok) {
          const text = await resp.text();
          console.error("generate-mcqs failed:", resp.status, text);
          if (!cancelled) setMcqQuestions([]);
          return;
        }

        const data = await resp.json();
        const incoming = Array.isArray(data.questions) ? data.questions : [];

        // Normalize and strip fallback markers
        const normalized = incoming.map((q) => ({
          question: stripFallbackPrefix(q.question || ""),
          options: Array.isArray(q.options) ? q.options.slice(0, 4) : ["N/A", "N/A", "N/A", "N/A"],
        }));

        if (!cancelled) setMcqQuestions(normalized);
      } catch (err) {
        console.error("generate-mcqs error:", err);
        if (!cancelled) setMcqQuestions([]);
      } finally {
        if (!cancelled) setLoadingMcq(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [candidate?.resumeText, candidateId]);

  // When MCQ questions exist reset candidate progress/answers
  useEffect(() => {
    if (mcqQuestions.length > 0) {
      dispatch(updateCandidateField({ sessionId, candidateId, field: "currentIndex", value: 0 }));
      dispatch(updateCandidateField({ sessionId, candidateId, field: "answers", value: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcqQuestions.length]);

  // ---------- MCQ evaluation (backend) ----------
  const evaluateMCQ = useCallback(async () => {
    setEvaluating(true);
    try {
      const payload = { candidateId, answers: answersRef.current.map((a) => a.answer) };
      const resp = await fetch(`${API_BASE}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("evaluate failed:", resp.status, text);
        return null;
      }

      const data = await resp.json();
      const score = typeof data.score === "number" ? data.score : null;
      const summary = data.summary || "MCQ evaluation complete.";

      // update session + global
      dispatch(evaluateCandidateSuccess({ sessionId, candidateId, score, summary }));

      try {
        const latestCandidate = candidateRef.current || {};
        const existing = globalCandidates.find(
          (gc) => gc.email && gc.email.toLowerCase() === (latestCandidate.email || "").toLowerCase()
        );
        const candidatePayload = {
          id: latestCandidate.id,
          name: latestCandidate.name,
          email: latestCandidate.email,
          phone: latestCandidate.phone,
          resumeText: latestCandidate.resumeText,
          answers: answersRef.current,
          score,
          summary,
          progress: latestCandidate.progress,
          currentIndex: latestCandidate.currentIndex,
          timeLeft: latestCandidate.timeLeft,
        };
        if (existing) {
          dispatch(updateGlobalCandidateField({ id: existing.id, field: "score", value: score }));
          dispatch(updateGlobalCandidateField({ id: existing.id, field: "summary", value: summary }));
          dispatch(updateGlobalCandidateField({ id: existing.id, field: "answers", value: answersRef.current }));
        } else {
          dispatch(addGlobalCandidate(candidatePayload));
        }
      } catch (err) {
        console.error("sync to global candidate failed:", err);
      }

      return data;
    } catch (err) {
      console.error("MCQ evaluation error:", err);
      return null;
    } finally {
      setEvaluating(false);
    }
  }, [dispatch, sessionId, candidateId, globalCandidates]);

  // ---------- Save current answer helper ----------
  const saveCurrentAnswer = useCallback(() => {
    const answerPayload = Array.isArray(selectedOptions) ? selectedOptions.slice() : [];
    dispatch(
      addCandidateAnswer({
        sessionId,
        candidateId,
        question: mcqQuestions[currentIndex]?.question || "Unknown question",
        answer: answerPayload,
        timestamp: new Date().toISOString(),
      })
    );
  }, [dispatch, sessionId, candidateId, selectedOptions, currentIndex, mcqQuestions]);

  // ---------- MCQ submit / next ----------
  const handleMcqNext = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    saveCurrentAnswer();

    const nextIndex = currentIndex + 1;
    dispatch(updateCandidateField({ sessionId, candidateId, field: "currentIndex", value: nextIndex }));
    dispatch(updateCandidateTimer({ sessionId, candidateId, timeLeft: 0 }));

    // if finished => evaluate and move to mcq_done
    if (nextIndex >= mcqQuestions.length) {
      await evaluateMCQ();
      setRound("mcq_done");
    } else {
      // allow interaction on next
      setSelectedOptions([]);
      submittedRef.current = false;
    }
  }, [saveCurrentAnswer, currentIndex, dispatch, sessionId, candidateId, mcqQuestions.length, evaluateMCQ]);

  // ---------- Countdown integration ----------
  const onMcqExpire = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    saveCurrentAnswer();
    const nextIndex = currentIndex + 1;
    dispatch(updateCandidateField({ sessionId, candidateId, field: "currentIndex", value: nextIndex }));
    if (nextIndex >= mcqQuestions.length) {
      evaluateMCQ().then(() => setRound("mcq_done"));
    } else {
      setSelectedOptions([]);
      submittedRef.current = false;
    }
  }, [saveCurrentAnswer, currentIndex, dispatch, sessionId, candidateId, mcqQuestions.length, evaluateMCQ]);

  const { seconds: mcqSeconds, reset: resetMcq } = useCountdown(20, onMcqExpire);

  useEffect(() => {
    if (!candidate) return;
    dispatch(updateCandidateTimer({ sessionId, candidateId, timeLeft: mcqSeconds }));
  }, [mcqSeconds, dispatch, sessionId, candidateId, candidate]);

  // Reset selection & timer only when currentIndex actually changes
  useEffect(() => {
    submittedRef.current = false;
    setSelectedOptions([]);
    resetMcq(20);
  }, [currentIndex, resetMcq]);

  useEffect(() => {
    answersRef.current = candidate?.answers || [];
  }, [candidate?.answers]);

  // ---------- DSA: fetch questions (start round 2) ----------
  const fetchDsaQuestions = useCallback(async () => {
    try {
      setLoadingDsa(true);
      const resp = await fetch(`${API_BASE}/api/dsa-questions`);
      if (!resp.ok) {
        console.error("dsa-questions failed", resp.status);
        setDsaQuestions([]);
        return;
      }
      const data = await resp.json();
      const list = Array.isArray(data.questions) ? data.questions.slice(0, 3) : [];
      setDsaQuestions(list);
      setDsaIndex(0);
      setDsaCode("");
      setDsaLanguage((list[0] && list[0].defaultLanguage) || "python3");
      setRound("dsa");
      setDsaSubmissions([]);
      setDsaRunResult(null);
    } catch (err) {
      console.error("fetch dsa questions error:", err);
      setDsaQuestions([]);
    } finally {
      setLoadingDsa(false);
    }
  }, []);

  // DSA: run code on server
  const runCodeOnServer = useCallback(async ({ code, language, input }) => {
    try {
      setDsaRunResult(null);
      const resp = await fetch(`${API_BASE}/api/run-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, input }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`run-code failed ${resp.status}: ${text}`);
      }
      const data = await resp.json();
      setDsaRunResult(data);
      return data;
    } catch (err) {
      setDsaRunResult({ error: String(err.message || err) });
      return { error: String(err.message || err) };
    }
  }, []);

  // DSA: submit for current question
  const submitDsaForCurrent = useCallback(async () => {
    const q = dsaQuestions[dsaIndex];
    const submission = {
      questionId: q?.id || `dsa-${dsaIndex}`,
      code: dsaCode,
      language: dsaLanguage,
      input: q?.sampleInput ?? "",
      expectedOutput: q?.expectedOutput ?? "",
    };
    const newSub = [...dsaSubmissions, submission];
    setDsaSubmissions(newSub);

    const next = dsaIndex + 1;
    if (next >= dsaQuestions.length) {
      // evaluate-dsa on backend
      try {
        const resp = await fetch(`${API_BASE}/api/evaluate-dsa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateId, submissions: newSub }),
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`evaluate-dsa failed ${resp.status}: ${text}`);
        }
        const result = await resp.json();
        const dsaScore = typeof result.score === "number" ? result.score : null;
        const summary = `DSA Round complete. Score: ${dsaScore}`;
        dispatch(evaluateCandidateSuccess({ sessionId, candidateId, score: dsaScore, summary }));
        setRound("final");
      } catch (err) {
        console.error("evaluate-dsa error", err);
        alert("DSA evaluation failed. Check server logs.");
      }
    } else {
      setDsaIndex(next);
      setDsaCode("");
      setDsaLanguage((dsaQuestions[next] && dsaQuestions[next].defaultLanguage) || "python3");
      setDsaRunResult(null);
    }
  }, [dsaIndex, dsaQuestions, dsaCode, dsaLanguage, dsaSubmissions, candidateId, dispatch, sessionId]);

  // ---------- UI branches ----------

  if (!candidate) return <div>❌ Candidate not found in session.</div>;

  // If MCQ round active
  if (round === "mcq") {
    if (!candidate?.resumeText)
      return <div className="p-4 text-gray-600">Please upload your resume to start the interview.</div>;
    if (loadingMcq) return <p className="p-4">⚡ Generating questions...</p>;
    if (evaluating) return <p className="p-4">🤖 Evaluating answers...</p>;
    if (!mcqQuestions.length)
      return (
        <div className="p-4 bg-yellow-50 rounded">
          <h3 className="font-semibold">Waiting to start Round 1</h3>
          <p className="text-sm mt-2">Generating questions — please wait.</p>
        </div>
      );

    if (currentIndex >= mcqQuestions.length) {
      // This is a safe fallback — after evaluateMCQ we should set round to 'mcq_done'
      return (
        <div className="p-4 bg-yellow-50 rounded">Round 1 complete — preparing evaluation...</div>
      );
    }

    const currentQ = mcqQuestions[currentIndex] || { question: "Loading...", options: [] };

    const toggleOption = (index) => {
      setSelectedOptions((prev) => {
        const set = new Set(prev || []);
        const multi = currentIndex >= 20; // last 10 are multi
        if (set.has(index)) set.delete(index);
        else {
          if (!multi) set.clear();
          set.add(index);
        }
        return Array.from(set).sort((a, b) => a - b);
      });
    };

    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800">Question {currentIndex + 1}/{mcqQuestions.length}</h3>
        <p className="mt-4 text-gray-700 text-lg">{currentQ.question}</p>

        <div className="mt-4 space-y-2">
          {Array.isArray(currentQ.options) &&
            currentQ.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleOption(i)}
                className={`w-full text-left p-3 border rounded transition ${
                  selectedOptions.includes(i) ? "bg-indigo-600 text-white border-indigo-600" : "hover:bg-gray-100 bg-white text-gray-900"
                }`}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                <span>{opt}</span>
              </button>
            ))}
        </div>

        <div className={`mt-4 p-2 rounded ${mcqSeconds < 10 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-800"}`}>
          ⏳ Time left: {mcqSeconds}s
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={handleMcqNext} disabled={submittedRef.current} className={`px-4 py-2 rounded text-white ${submittedRef.current ? "opacity-50 bg-gray-400" : "bg-indigo-600 hover:bg-indigo-500"}`}>
            {currentIndex + 1 >= mcqQuestions.length ? "Finish Round 1" : "Next Question"}
          </button>
          <button type="button" onClick={() => setSelectedOptions([])} className="px-3 py-2 rounded border bg-white text-gray-700 hover:bg-gray-50">
            Clear
          </button>
        </div>

        <div className="mt-2 text-sm text-gray-600">Progress: {currentIndex + 1}/{mcqQuestions.length}</div>
      </div>
    );
  }

  // After MCQ evaluation: allow start of round 2
  if (round === "mcq_done") {
    const mcqScore = candidate?.score ?? null;
    const mcqSummary = candidate?.summary ?? "Round 1 complete.";
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <h2 className="text-xl font-bold">✅ Round 1 Complete</h2>
        <div className="mt-4">
          <h3 className="font-semibold">Score: {mcqScore !== null ? `${mcqScore}/100` : "—"}</h3>
          <p className="mt-2">{mcqSummary}</p>
        </div>
        <div className="mt-6">
          <p className="mb-3">Next: Round 2 — DSA assessment (3 problems). Click below to start.</p>
          <button onClick={fetchDsaQuestions} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500">
            Start Round 2 (DSA)
          </button>
        </div>
      </div>
    );
  }

  // DSA UI
  if (round === "dsa") {
    if (loadingDsa) return <p className="p-4">Loading DSA questions...</p>;
    if (!dsaQuestions.length) return <div className="p-4 text-gray-600">No DSA questions available.</div>;

    const q = dsaQuestions[dsaIndex];
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800">DSA Round — Problem {dsaIndex + 1}/{dsaQuestions.length}</h3>
        <h4 className="mt-2 font-semibold">{q.title}</h4>
        <p className="mt-2 text-gray-700">{q.description}</p>

        <div className="mt-3 text-sm text-gray-600">
          <strong>Sample Input:</strong> <pre className="inline">{q.sampleInput}</pre>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">Language</label>
          <select value={dsaLanguage} onChange={(e) => setDsaLanguage(e.target.value)} className="p-2 border rounded">
            <option value="python3">Python 3</option>
            <option value="javascript">JavaScript (Node)</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">Code</label>
          <textarea rows={12} value={dsaCode} onChange={(e) => setDsaCode(e.target.value)} className="w-full p-2 border rounded font-mono" placeholder="# write your solution"></textarea>
        </div>

        <div className="flex gap-2 mt-3">
          <button onClick={async () => await runCodeOnServer({ code: dsaCode, language: dsaLanguage, input: q.sampleInput })} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500">
            Run
          </button>

          <button onClick={async () => await submitDsaForCurrent()} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500">
            {dsaIndex + 1 >= dsaQuestions.length ? "Submit & Finish DSA" : "Submit & Next"}
          </button>
        </div>

        {dsaRunResult && (
          <div className="mt-4 p-3 bg-gray-50 border rounded">
            <div><strong>Status:</strong> {dsaRunResult.status?.description ?? (dsaRunResult.error ? "Error" : "Done")}</div>
            <div className="mt-2"><strong>Stdout:</strong><pre className="whitespace-pre-wrap">{dsaRunResult.stdout ?? ""}</pre></div>
            {dsaRunResult.stderr && <div className="mt-2 text-red-600"><strong>Stderr:</strong><pre>{dsaRunResult.stderr}</pre></div>}
            {dsaRunResult.compile_output && <div className="mt-2 text-red-600"><strong>Compile:</strong><pre>{dsaRunResult.compile_output}</pre></div>}
            {dsaRunResult.error && <div className="mt-2 text-red-600"><strong>Error:</strong> {String(dsaRunResult.error)}</div>}
          </div>
        )}
      </div>
    );
  }

  // Final page
  if (round === "final") {
    const finalScore = candidate?.score ?? "—";
    const finalSummary = candidate?.summary ?? "Interview complete.";
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <h2 className="text-xl font-bold">🎉 Interview Complete</h2>
        <div className="mt-4">
          <h3 className="font-semibold">Final Score: {finalScore}/100</h3>
          <p className="mt-2">{finalSummary}</p>
        </div>
        <div className="mt-6">
          <p>Thank you — candidate may now close the tab.</p>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}
