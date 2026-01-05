import React, { useState, useEffect } from "react";
import ResumeUpload from "../ui/components/ResumeUpload";
import Chat from "../ui/components/Chat";
import { useSelector, useDispatch } from "react-redux";
import { updateCandidateField } from "../slices/candidateSlice";
import { FileUp, Play } from "lucide-react";
import Card from "../ui/components/Card";
import Button from "../ui/components/Button";
import Badge from "../ui/components/Badge";
import EmptyState from "../ui/components/EmptyState";

export default function IntervieweePage() {
  const candidates = useSelector((state) => state.candidate.candidates) || [];
  const dispatch = useDispatch();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    // Check if there's a candidate mid-interview
    const ongoing = candidates.find((c) => c.progress > 0 && c.score === null);
    if (ongoing) {
      setShowWelcomeBack(true);
      setSelectedCandidate(ongoing.id);
    }
  }, [candidates]);

  const handleStartOver = () => {
    if (selectedCandidate) {
      // reset candidate's progress
      dispatch(
        updateCandidateField({
          id: selectedCandidate,
          field: "answers",
          value: [],
        })
      );
      dispatch(
        updateCandidateField({
          id: selectedCandidate,
          field: "progress",
          value: 0,
        })
      );
      dispatch(
        updateCandidateField({
          id: selectedCandidate,
          field: "currentIndex",
          value: 0,
        })
      );
      dispatch(
        updateCandidateField({
          id: selectedCandidate,
          field: "timeLeft",
          value: 0,
        })
      );
    }
    setShowWelcomeBack(false);
    setSelectedCandidate(null);
  };

  const handleResume = () => {
    setShowWelcomeBack(false);
  };

  return (
    <div className="min-h-screen bg-bg-dark dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-border dark:border-slate-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-2 mb-6">
            <img src="/flux-logo.png" alt="Flux Hire AI" className="h-8 w-8" />
            <span className="font-bold text-lg text-foreground">Flux Hire AI</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Candidate Interview</h1>
          <p className="text-body">Upload your resume and start your AI-powered interview</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {!selectedCandidate && (
          <div className="space-y-6">
            {/* Resume Upload Section */}
            <Card>
              <Card.Header>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Card.Title>Upload Your Resume</Card.Title>
                    <Card.Description>
                      Start by uploading your resume (PDF or DOCX format)
                    </Card.Description>
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                <ResumeUpload />
              </Card.Content>
            </Card>

            {/* Continue Interview Section */}
            {candidates.length > 0 && (
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <Card.Title>Continue Your Interview</Card.Title>
                      <Card.Description>
                        Resume a previous interview session
                      </Card.Description>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="grid gap-3">
                    {candidates.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCandidate(c.id)}
                        className="w-full p-4 text-left rounded-lg border-2 border-border dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {c.name || "Unnamed Candidate"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {c.email}
                            </p>
                          </div>
                          {c.score !== null ? (
                            <Badge variant="success">Completed</Badge>
                          ) : c.progress > 0 ? (
                            <Badge variant="info">In Progress ({c.progress} questions)</Badge>
                          ) : (
                            <Badge variant="outline">Not Started</Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            )}

            {candidates.length === 0 && (
              <EmptyState
                icon={FileUp}
                title="No interviews yet"
                description="Upload your resume above to start your first interview"
              />
            )}
          </div>
        )}

        {selectedCandidate && (
          <Card>
            <Card.Content className="p-0">
              <Chat candidateId={selectedCandidate} />
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
}
