import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Chat from "../ui/components/Chat";
import { upsertCandidate } from "../slices/candidateSlice";
import { User, Calendar } from "lucide-react";
import Card from "../ui/components/Card";

export default function ChatWrapper() {
  const { id: sessionId, candidateId } = useParams();
  const dispatch = useDispatch();

  // select the session from store
  const session = useSelector((state) =>
    state.session.sessions.find((s) => s.id === sessionId)
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-bg-dark dark:bg-slate-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <Card.Content className="py-12">
            <div className="mb-4 p-4 rounded-full bg-red-100 dark:bg-red-900/30 inline-flex">
              <Calendar className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Invalid Session
            </h2>
            <p className="text-body">
              Please check the link and try again.
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  // Read candidate from session in Redux so updates (score/summary) re-render this component
  const candidate = session.candidates.find((c) => c.id === candidateId);

  if (!candidate) {
    return (
      <div className="min-h-screen bg-bg-dark dark:bg-slate-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <Card.Content className="py-12">
            <div className="mb-4 p-4 rounded-full bg-red-100 dark:bg-red-900/30 inline-flex">
              <User className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Candidate Not Found
            </h2>
            <p className="text-body">
              This candidate was not found in the session.
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  // Ref to ensure we upsert only once per completed evaluation
  const upsertDoneRef = useRef(false);

  useEffect(() => {
    // If candidate has a score (evaluation finished) and we haven't upserted yet -> upsert
    if (!candidate) return;

    const hasScore = candidate.score !== null && candidate.score !== undefined;
    if (hasScore && !upsertDoneRef.current) {
      upsertDoneRef.current = true; // mark so we don't re-dispatch
      const payload = {
        id: candidate.id,
        sessionId,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        resumeText: candidate.resumeText,
        answers: candidate.answers,
        score: candidate.score,
        summary: candidate.summary,
        completedAt: candidate.completedAt || new Date().toISOString(),
      };

      // dispatch the thunk and optionally handle the result
      (async () => {
        try {
          const resultAction = await dispatch(upsertCandidate(payload));
          // resultAction may have payload on fulfilled or error on rejected
          if (upsertCandidate.fulfilled.match(resultAction)) {
            // success: server echo is in resultAction.payload
            console.log("Candidate upserted:", resultAction.payload);
          } else {
            // failure — keep error logged and you can show a UI retry later
            console.error("Failed to upsert candidate:", resultAction);
            // allow retry by resetting upsertDoneRef if desired
            upsertDoneRef.current = false;
          }
        } catch (err) {
          console.error("Upsert candidate threw:", err);
          upsertDoneRef.current = false;
        }
      })();
    }
  }, [candidate, candidate?.score, candidate?.summary, dispatch, sessionId]);

  return (
    <div className="min-h-screen bg-bg-dark dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-border dark:border-slate-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                AI Interview for {candidate.name || "Candidate"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Session: {session.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <Chat sessionId={sessionId} candidateId={candidateId} />
      </div>
    </div>
  );
}
