import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY as string;

const TONES = [
  { id: "professional", label: "Professional", desc: "Formal & structured" },
  { id: "enthusiastic", label: "Enthusiastic", desc: "Energetic & passionate" },
  { id: "concise", label: "Concise", desc: "Short & to the point" },
];

const domainLabels: Record<string, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  dataEngineering: "Data Engineer",
  dataAnalyst: "Data Analyst",
  uiux: "UI/UX Designer",
};

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.75, maxOutputTokens: 1200 },
      }),
    }
  );
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export default function CoverLetter() {
  const navigate = useNavigate();
  const location = useLocation();

  const [resumeCache, setResumeCache] = useState<{ skills: string[]; domain: string } | null>(null);
  const [background, setBackground] = useState("");
  const [jobDescription, setJobDescription] = useState((location.state as any)?.jobDescription || "");
  const [jobTitle, setJobTitle] = useState((location.state as any)?.jobTitle || "");
  const [company, setCompany] = useState((location.state as any)?.company || "");
  const [tone, setTone] = useState("professional");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("ambix_resume_cache");
    if (raw) {
      try {
        const cache = JSON.parse(raw);
        setResumeCache(cache);
        const domainLabel = domainLabels[cache.domain] ?? cache.domain;
        setBackground(`Role: ${domainLabel}\nKey skills: ${cache.skills.slice(0, 15).join(", ")}`);
      } catch {}
    }
  }, []);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }
    setError("");
    setGenerating(true);
    try {
      const prompt = `Write a compelling, tailored cover letter for a job application.

Candidate Background:
${background.trim() || "Not provided"}

${jobTitle ? `Position: ${jobTitle}` : ""}
${company ? `Company: ${company}` : ""}

Job Description:
${jobDescription.trim()}

Tone: ${tone}

Rules:
- 3 to 4 focused paragraphs only
- Reference specific skills and requirements from the job description
- Keep language human and genuine — no generic openers like "I am writing to express my interest"
- No salary mentions
- End with a clear call to action
- Return ONLY the cover letter text — start with "Dear Hiring Manager,"`;

      const letter = await callGemini(prompt);
      setResult(letter.trim());
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter${jobTitle ? `-${jobTitle.replace(/\s+/g, "-").toLowerCase()}` : ""}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <div
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{ background: "rgba(5,8,22,0.85)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Header */}
      <section className="pt-12 pb-8 relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[260px] bg-violet-600/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-2">AI Writing</p>
          <h1
            className="text-3xl font-bold text-white tracking-tight mb-2"
            style={{ letterSpacing: "-0.03em" }}
          >
            Cover Letter Generator
          </h1>
          <p className="text-sm text-white/35">
            Generate a tailored cover letter in seconds using your resume profile and the job description.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`grid gap-6 ${result ? "lg:grid-cols-2" : ""}`}>
            {/* ── Input Panel ── */}
            <div className={`space-y-4 ${!result ? "max-w-2xl mx-auto w-full" : ""}`}>

              {/* Resume status banner */}
              {resumeCache ? (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)" }}>
                    <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-green-400">Resume profile loaded</p>
                    <p className="text-xs text-white/35 truncate">
                      {domainLabels[resumeCache.domain] ?? resumeCache.domain} · {resumeCache.skills.length} skills detected
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/upload")}
                    className="text-xs text-white/25 hover:text-white/55 transition-colors shrink-0"
                  >
                    Update →
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-amber-300/70 flex-1">No resume uploaded yet — add your background manually below.</p>
                  <button
                    onClick={() => navigate("/upload")}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors shrink-0"
                  >
                    Upload →
                  </button>
                </div>
              )}

              {/* Background */}
              <div
                className="rounded-2xl p-5 space-y-3"
                style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest">
                  Your Background
                </label>
                <textarea
                  rows={4}
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="e.g. 3 years React/TypeScript, worked at fintech startups, built dashboards and payment flows..."
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none transition-all duration-200 placeholder-white/15"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.85)",
                    outline: "none",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.07)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              {/* Job Details */}
              <div
                className="rounded-2xl p-5 space-y-4"
                style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest">Job Details</label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5">Job Title <span className="text-white/20">(optional)</span></label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Senior Frontend Engineer"
                      className="w-full rounded-lg px-3 py-2.5 text-sm placeholder-white/15 outline-none transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5">Company <span className="text-white/20">(optional)</span></label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Inc."
                      className="w-full rounded-lg px-3 py-2.5 text-sm placeholder-white/15 outline-none transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/30 mb-1.5">
                    Job Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={7}
                    value={jobDescription}
                    onChange={(e) => { setJobDescription(e.target.value); setError(""); }}
                    placeholder="Paste the full job description here..."
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none transition-all duration-200 placeholder-white/15"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: error ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.85)",
                      outline: "none",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.07)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  {error && (
                    <p className="flex items-center gap-1.5 text-xs text-red-400 mt-2">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>
              </div>

              {/* Tone */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Writing Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className="flex flex-col gap-1 p-3 rounded-xl text-center transition-all duration-200"
                      style={{
                        background: tone === t.id ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                        border: tone === t.id ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <span className={`text-xs font-semibold ${tone === t.id ? "text-violet-300" : "text-white/55"}`}>{t.label}</span>
                      <span className="text-[10px] text-white/25 leading-tight">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  background: generating
                    ? "rgba(139,92,246,0.2)"
                    : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                  boxShadow: generating ? "none" : "0 4px 20px rgba(139,92,246,0.3)",
                }}
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Writing your cover letter…
                  </span>
                ) : result ? (
                  "Regenerate Cover Letter"
                ) : (
                  "Generate Cover Letter →"
                )}
              </button>
            </div>

            {/* ── Output Panel ── */}
            {result && (
              <div
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "#0a0f1e",
                  border: "1px solid rgba(255,255,255,0.07)",
                  maxHeight: "calc(100vh - 220px)",
                  position: "sticky",
                  top: "80px",
                }}
              >
                {/* Output header */}
                <div
                  className="flex items-center justify-between px-5 py-4 shrink-0"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                      Generated Cover Letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
                        border: copied ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,255,255,0.09)",
                        color: copied ? "#4ade80" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Letter body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="text-sm text-white/75 leading-8 whitespace-pre-wrap" style={{ fontFamily: "Georgia, serif" }}>
                    {result}
                  </div>
                </div>

                {/* Character count footer */}
                <div
                  className="px-5 py-3 shrink-0"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-xs text-white/20 text-right">
                    {result.length.toLocaleString()} characters · {result.split(/\s+/).length.toLocaleString()} words
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
