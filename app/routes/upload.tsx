import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Modal } from "antd";
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

      {/* Domain Mismatch Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
        width={480}
      >
        {apiData && apiData.mode === "JD_MODE" && (
          <div>
            {/* Modal Header */}
            <div
              className="px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h3 className="text-base font-semibold text-white">Resume vs Job Analysis</h3>
              <p className="text-xs text-white/35 mt-1">
                {isSameDomain
                  ? "Your resume matches this job domain."
                  : "Your resume targets a different domain than the job."}
              </p>
            </div>

            {/* Domain Cards */}
            <div className={`grid ${isSameDomain ? "grid-cols-1" : "grid-cols-2"} gap-4 p-6`}>
              {/* Resume domain */}
              <div
                className="rounded-xl p-5 text-center"
                style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-green-400/60 mb-3">
                  Your Resume
                </p>
                <div
                  className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  {domainLabels[apiData.resumeDomain] ?? apiData.resumeDomain}
                </p>
                {isSameDomain && (
                  <p className="text-xs text-green-400 font-semibold mb-2">Perfect Match</p>
                )}
                <p className="text-2xl font-bold text-white mb-4">{apiData.resumeScore}%</p>
                <button
                  onClick={() =>
                    navigate("/quiz", { state: { domain: apiData.resumeDomain, questions: apiData.resumeQuestions } })
                  }
                  className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    boxShadow: "0 2px 12px rgba(34,197,94,0.25)",
                  }}
                >
                  Take Quiz →
                </button>
              </div>

              {/* JD domain (only if mismatch) */}
              {!isSameDomain && (
                <div
                  className="rounded-xl p-5 text-center"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400/60 mb-3">
                    Job Requires
                  </p>
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">
                    {domainLabels[apiData.jdDomain] ?? apiData.jdDomain}
                  </p>
                  <p className="text-2xl font-bold text-white mb-4">{apiData.resumeScore}%</p>
                  <button
                    onClick={() =>
                      navigate("/quiz", { state: { domain: apiData.jdDomain, questions: apiData.jdQuestions } })
                    }
                    className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      boxShadow: "0 2px 12px rgba(239,68,68,0.25)",
                    }}
                  >
                    Take Quiz →
                  </button>
                </div>
              )}
            </div>

            {/* Cancel */}
            <div className="px-6 pb-6">
              <button
                onClick={handleCancel}
                className="w-full py-2.5 rounded-xl text-sm text-white/40 transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
