import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import Navbar from "~/components/Navbar";

export default function Upload() {
  const navigate = useNavigate();
  const location = useLocation();

  const domainLabels: Record<string, string> = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    dataEngineering: "Data Engineer",
    dataAnalyst: "Data Analyst",
    uiux: "UI/UX Designer",
  };

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState(location.state?.jobDescription || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);

  const isJDMode = jobDescription.trim().length > 0;

  const callAPI = async () => {
    if (!file) {
      message.error("Please upload a resume");
      return null;
    }
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);
      const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApiData(data);
      return data;
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Please try again.");
      message.error("Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleResumeOnly = async () => {
    const data = await callAPI();
    if (!data) return;
    navigate("/resume-analysis", { state: data });
  };

  const handleJDMode = async () => {
    if (!isJDMode) {
      message.warning("Please enter a job description");
      return;
    }
    const data = await callAPI();
    if (!data) return;
    setIsModalOpen(true);
  };

  const handleCancel = () => setIsModalOpen(false);
  const isSameDomain = apiData && apiData.resumeDomain === apiData.jdDomain;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
    } else {
      message.error("Only PDF files are supported");
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <div
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ background: "rgba(5,8,22,0.85)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Header */}
      <section className="pt-14 pb-10 relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-2xl mx-auto px-6 text-center relative animate-fade-in-up">
          <p className="eyebrow mb-3">Resume Analyzer</p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            Get instant AI feedback
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Upload your resume for a detailed AI analysis, or match it against a job description.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <div
            className="rounded-2xl p-7 space-y-6"
            style={{
              background: "#0a0f1e",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
            }}
          >
            {/* File Upload */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                Resume <span className="text-blue-400 normal-case tracking-normal font-medium">PDF only</span>
              </label>
              <label
                className="flex flex-col items-center justify-center w-full rounded-2xl p-8 cursor-pointer transition-all duration-200 relative overflow-hidden"
                style={{
                  border: dragOver
                    ? "2px dashed rgba(59,130,246,0.6)"
                    : file
                    ? "2px dashed rgba(59,130,246,0.35)"
                    : "2px dashed rgba(255,255,255,0.1)",
                  background: dragOver
                    ? "rgba(59,130,246,0.06)"
                    : file
                    ? "rgba(59,130,246,0.04)"
                    : "rgba(255,255,255,0.02)",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                {loading ? (
                  /* Scanning state */
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-14 h-14">
                      <div
                        className="w-14 h-14 rounded-full border-2 animate-spin"
                        style={{ borderColor: "rgba(59,130,246,0.2)", borderTopColor: "#3b82f6" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-blue-400">Scanning your resume…</p>
                    <p className="text-xs text-white/30">AI is analyzing your content</p>
                  </div>
                ) : file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                      style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-white max-w-[260px] truncate text-center">
                      {file.name}
                    </p>
                    <p className="text-xs text-white/35">
                      {(file.size / 1024).toFixed(0)} KB · Click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9m-5-4v8m0 0l-3-3m3 3l3-3" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-white/60">
                      Drag & drop or <span className="text-blue-400">browse file</span>
                    </p>
                    <p className="text-xs text-white/25">PDF up to 10 MB</p>
                  </div>
                )}
              </label>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                Job Description{" "}
                <span className="text-white/25 normal-case tracking-normal font-normal">— optional</span>
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description to get a match score and tailored insights…"
                className="w-full rounded-xl px-4 py-3 text-sm placeholder-white/20 resize-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.85)",
                  outline: "none",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.4)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(59,130,246,0.08)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#fca5a5",
                }}
              >
                <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={handleResumeOnly}
                disabled={!file || loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  background: !file || loading
                    ? "rgba(255,255,255,0.04)"
                    : "linear-gradient(135deg, #3b82f6, #6366f1)",
                  color: !file || loading ? "rgba(255,255,255,0.2)" : "white",
                  boxShadow: !file || loading ? "none" : "0 4px 20px rgba(59,130,246,0.3)",
                  border: !file || loading ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Analyzing…
                  </span>
                ) : (
                  "Analyze Resume"
                )}
              </button>

              <button
                onClick={handleJDMode}
                disabled={!file || !isJDMode || loading}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: !file || !isJDMode || loading ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.75)",
                }}
                onMouseEnter={(e) => {
                  if (!(!file || !isJDMode || loading)) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                {loading ? "Processing…" : "Match with Job Description"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Match / Mismatch Modal — custom overlay, no Ant Design */}
      {isModalOpen && apiData && apiData.mode === "JD_MODE" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={handleCancel}
        >
          <div
            className="relative w-full max-w-[460px] rounded-2xl overflow-hidden animate-fade-in-up"
            style={{
              background: "#0a0f1e",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors z-10"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: isSameDomain ? "rgba(34,197,94,0.12)" : "rgba(59,130,246,0.12)",
                    border: isSameDomain ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  {isSameDomain ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-base font-semibold text-white">
                  {isSameDomain ? "Great Match!" : "Domain Analysis"}
                </h3>
              </div>
              <p className="text-xs text-white/35 ml-11">
                {isSameDomain
                  ? "Your resume aligns with this job's domain. You're ready to test your skills."
                  : "Your resume and the job target different domains. Choose which quiz to take."}
              </p>
            </div>

            {/* Domain Cards */}
            <div className={`grid ${isSameDomain ? "grid-cols-1" : "grid-cols-2"} gap-3 p-5`}>
              {/* Resume domain card */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: isSameDomain ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)",
                  border: isSameDomain ? "1px solid rgba(34,197,94,0.15)" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isSameDomain ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
                      border: isSameDomain ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <svg className={`w-3 h-3 ${isSameDomain ? "text-green-400" : "text-white/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Your Resume</p>
                </div>
                <p className="text-sm font-bold text-white mb-0.5">
                  {domainLabels[apiData.resumeDomain] ?? apiData.resumeDomain}
                </p>
                <p className="text-xs text-white/30 mb-3">
                  Match score: <span className="text-white/60 font-semibold">{apiData.resumeScore}%</span>
                </p>
                <button
                  onClick={() =>
                    navigate("/quiz", {
                      state: {
                        domain: apiData.resumeDomain,
                        questions: apiData.resumeQuestions,
                        score: apiData.resumeScore,
                        matchedSkills: apiData.matchedSkills,
                        missingSkills: apiData.missingSkills,
                      },
                    })
                  }
                  className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200"
                  style={{
                    background: isSameDomain
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "rgba(255,255,255,0.07)",
                    border: isSameDomain ? "none" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isSameDomain ? "0 2px 12px rgba(34,197,94,0.25)" : "none",
                  }}
                >
                  {isSameDomain ? "Take Quiz →" : "Quiz for My Domain"}
                </button>
              </div>

              {/* JD domain card (only if mismatch) */}
              {!isSameDomain && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
                    >
                      <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/60">Job Requires</p>
                  </div>
                  <p className="text-sm font-bold text-white mb-0.5">
                    {domainLabels[apiData.jdDomain] ?? apiData.jdDomain}
                  </p>
                  <p className="text-xs text-white/30 mb-3">
                    Prepare for <span className="text-blue-300/70 font-semibold">this role</span>
                  </p>
                  <button
                    onClick={() =>
                      navigate("/quiz", {
                        state: {
                          domain: apiData.jdDomain,
                          questions: apiData.jdQuestions,
                          score: apiData.resumeScore,
                          matchedSkills: apiData.matchedSkills,
                          missingSkills: apiData.missingSkills,
                        },
                      })
                    }
                    className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                      boxShadow: "0 2px 12px rgba(59,130,246,0.25)",
                    }}
                  >
                    Quiz for This Job →
                  </button>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-5 pb-5 space-y-2">
              <button
                onClick={() => {
                  handleCancel();
                  navigate("/resume-analysis", { state: apiData });
                }}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-white/60 hover:text-white/85"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                View Full Resume Analysis
              </button>
              <button
                onClick={handleCancel}
                className="w-full py-2 text-xs text-white/25 hover:text-white/45 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
