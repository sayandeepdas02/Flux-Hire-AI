import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addSession } from "../slices/sessionSlice";
import { Copy, Search, Users, Calendar, TrendingUp, FileText } from "lucide-react";
import Button from "../ui/components/Button";
import Card from "../ui/components/Card";
import Input from "../ui/components/Input";
import Modal from "../ui/components/Modal";
import Table from "../ui/components/Table";
import Badge from "../ui/components/Badge";
import EmptyState from "../ui/components/EmptyState";
import interviewerAPI from "../services/interviewerAPI";

export default function InterviewerPage() {
  const sessions = useSelector((state) => state.session.sessions) || [];
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  // Create session
  const handleCreateSession = async () => {
    if (!title.trim()) return alert("Enter a session title!");

    setCreating(true);
    setError(null);

    try {
      const sessionData = await interviewerAPI.createSession(title, interviewer);

      // Add to Redux store with the token and link
      dispatch(addSession({
        id: sessionData.token, // Use token as ID for consistency
        title,
        interviewer: sessionData.interviewer,
        token: sessionData.token,
        link: sessionData.link,
        createdAt: new Date().toISOString(),
      }));

      setTitle("");
      setInterviewer("");
      alert("Session created successfully!");
    } catch (err) {
      console.error("Create session error:", err);
      const errorMessage = err.response?.data?.error || "Failed to create session";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  // Flatten all candidates across sessions
  const allCandidates = sessions.flatMap((s) =>
    s.candidates.map((c) => ({
      ...c,
      sessionTitle: s.title,
      sessionId: s.id,
      interviewer: s.interviewer,
    }))
  );

  // Search + Sort
  const filteredCandidates = allCandidates
    .filter(
      (c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return (a.score || 0) - (b.score || 0);
      return (b.score || 0) - (a.score || 0);
    });

  // Stats
  const totalCandidates = allCandidates.length;
  const evaluatedCandidates = allCandidates.filter((c) => c.score !== null).length;
  const avgScore = evaluatedCandidates > 0
    ? Math.round(allCandidates.filter((c) => c.score !== null).reduce((sum, c) => sum + c.score, 0) / evaluatedCandidates)
    : 0;

  return (
    <div className="min-h-screen bg-bg-dark dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-border dark:border-slate-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-2 mb-6">
            <img src="/flux-logo.png" alt="Flux Hire AI" className="h-8 w-8" />
            <span className="font-bold text-lg text-foreground">Flux Hire AI</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Interviewer Dashboard</h1>
          <p className="text-body">Manage your interview sessions and review candidates</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card padding="default" hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold text-foreground">{totalCandidates}</p>
              </div>
            </div>
          </Card>

          <Card padding="default" hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Evaluated</p>
                <p className="text-2xl font-bold text-foreground">{evaluatedCandidates}</p>
              </div>
            </div>
          </Card>

          <Card padding="default" hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold text-foreground">{avgScore}/100</p>
              </div>
            </div>
          </Card>

          <Card padding="default" hoverable>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Create Session Card */}
        <Card className="mb-8">
          <Card.Header>
            <Card.Title>Create New Interview Session</Card.Title>
            <Card.Description>
              Start a new interview session and share the link with candidates
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Session Title"
                placeholder="e.g., Senior Frontend Engineer - Q1 2024"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                label="Interviewer Name/Email"
                placeholder="e.g., john@company.com"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
              />
            </div>
          </Card.Content>
          <Card.Footer>
            <Button onClick={handleCreateSession} size="lg" disabled={creating}>
              {creating ? 'Creating...' : 'Create Session'}
            </Button>
          </Card.Footer>
        </Card>

        {/* Sessions List */}
        <Card className="mb-8">
          <Card.Header>
            <Card.Title>Your Sessions</Card.Title>
            <Card.Description>
              Manage and share interview session links
            </Card.Description>
          </Card.Header>
          <Card.Content>
            {sessions.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No sessions yet"
                description="Create your first interview session to get started"
              />
            ) : (
              <div className="space-y-4">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-lg border border-border dark:border-slate-700 hover:bg-bg-dark dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>ID: {s.id.slice(0, 8)}...</span>
                          <span>Interviewer: {s.interviewer || "Not specified"}</span>
                          <span>Created: {new Date(s.createdAt).toLocaleDateString()}</span>
                          <Badge variant="primary" size="sm">
                            {s.candidates.length} candidate{s.candidates.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={s.link || `${window.location.origin}/interviewee/session/${s.token || s.id}`}
                          readOnly
                          className="w-64 text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Copy className="h-4 w-4" />}
                          onClick={() => {
                            const linkToCopy = s.link || `${window.location.origin}/interviewee/session/${s.token || s.id}`;
                            navigator.clipboard.writeText(linkToCopy);
                            alert("Link copied!");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Candidates Table */}
        <Card>
          <Card.Header>
            <Card.Title>All Candidates</Card.Title>
            <Card.Description>
              Review and evaluate candidates from all sessions
            </Card.Description>
          </Card.Header>
          <Card.Content>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                containerClassName="flex-1"
              />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="input w-full sm:w-48"
              >
                <option value="desc">Score: High → Low</option>
                <option value="asc">Score: Low → High</option>
              </select>
            </div>

            {/* Table */}
            {filteredCandidates.length === 0 ? (
              <EmptyState
                icon={Users}
                title={search ? "No candidates found" : "No candidates yet"}
                description={search ? "Try adjusting your search" : "Candidates will appear here once they join sessions"}
              />
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Name</Table.Head>
                    <Table.Head>Email</Table.Head>
                    <Table.Head>Session</Table.Head>
                    <Table.Head>Score</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Actions</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredCandidates.map((c) => (
                    <Table.Row key={c.id}>
                      <Table.Cell className="font-medium text-foreground">
                        {c.name || "Unnamed"}
                      </Table.Cell>
                      <Table.Cell>{c.email}</Table.Cell>
                      <Table.Cell className="max-w-xs truncate">
                        {c.sessionTitle}
                      </Table.Cell>
                      <Table.Cell>
                        {c.score !== null ? (
                          <Badge
                            variant={c.score >= 70 ? "success" : c.score >= 50 ? "warning" : "danger"}
                          >
                            {c.score}/100
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not evaluated</Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {c.score !== null ? (
                          <Badge variant="success">Completed</Badge>
                        ) : c.progress > 0 ? (
                          <Badge variant="info">In Progress</Badge>
                        ) : (
                          <Badge variant="outline">Not Started</Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCandidate(c)}
                        >
                          View Details
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Candidate Detail Modal */}
      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        size="lg"
      >
        {selectedCandidate && (
          <>
            <Modal.Header>
              <Modal.Title>Candidate Profile</Modal.Title>
              <Modal.Description>
                Detailed information and interview results
              </Modal.Description>
            </Modal.Header>
            <Modal.Content>
              {/* Candidate Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-foreground">Name:</span>
                      <span className="text-sm text-body ml-2">{selectedCandidate.name}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Email:</span>
                      <span className="text-sm text-body ml-2">{selectedCandidate.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Phone:</span>
                      <span className="text-sm text-body ml-2">{selectedCandidate.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Session:</span>
                      <span className="text-sm text-body ml-2">{selectedCandidate.sessionTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                    Interview Score
                  </h4>
                  <div className="text-5xl font-bold text-primary mb-2">
                    {selectedCandidate.score !== null ? `${selectedCandidate.score}/100` : "—"}
                  </div>
                  <p className="text-sm text-body">
                    {selectedCandidate.score !== null
                      ? selectedCandidate.score >= 70
                        ? "Excellent performance"
                        : selectedCandidate.score >= 50
                          ? "Good performance"
                          : "Needs improvement"
                      : "Not yet evaluated"}
                  </p>
                </div>
              </div>

              {/* Summary */}
              {selectedCandidate.summary && (
                <div className="mb-6 p-4 rounded-lg bg-bg-dark dark:bg-slate-700/50 border border-border dark:border-slate-600">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Evaluation Summary
                  </h4>
                  <p className="text-sm text-body leading-relaxed">
                    {selectedCandidate.summary}
                  </p>
                </div>
              )}

              {/* Interview Q&A */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  Interview Questions & Answers
                </h4>
                {selectedCandidate.answers.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCandidate.answers.map((a, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border border-border dark:border-slate-700"
                      >
                        <p className="font-medium text-foreground mb-2">
                          Q{i + 1}: {a.question}
                        </p>
                        <p className="text-sm text-body">
                          <strong>Answer:</strong> {Array.isArray(a.answer) ? a.answer.join(", ") : a.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No answers recorded yet.</p>
                )}
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button variant="outline" onClick={() => setSelectedCandidate(null)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}
