import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "~/components/Navbar";
import ScoreCircle from "~/components/Scorecircle";

const domainLabels: Record<string, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  dataEngineering: "Data Engineer",
  dataAnalyst: "Data Analyst",
  uiux: "UI/UX Designer",
};

function SkillTag({ label, variant }: { label: string; variant: "strong" | "missing" | "neutral" }) {
  const cfg = {
    strong: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.18)", color: "#4ade80" },
    missing: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.18)", color: "#fbbf24" },
    neutral: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
  }[variant];

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      {label}
    </span>
  );
}

export default function ResumeAnalysis() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 text-sm mb-4">No analysis data found.</p>
          <button
            onClick={() => navigate("/upload")}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            Upload a Resume
          </button>
        </div>
      </main>
    );
  }

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
      <section className="pt-12 pb-8 relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-blue-600/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in-up">
            <div>
              <p className="eyebrow mb-2">Resume Analysis</p>
              <h1 className="text-3xl font-bold text-white tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                AI-Powered Insights
              </h1>
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Auto-detected: {domainLabels[state.resumeDomain] ?? state.resumeDomain}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 space-y-4">

          {/* AI Feedback */}
          {state.feedback && (
            <div
              className="rounded-2xl p-6 animate-fade-in-up"
              style={{
                background: "#0a0f1e",
                border: "1px solid rgba(255,255,255,0.065)",
                animationDelay: "0.05s",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">AI Feedback</p>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{state.feedback}</p>
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {state.insights?.strongSkills?.length > 0 && (
              <div
                className="rounded-2xl p-6 animate-fade-in-up"
                style={{
                  background: "#0a0f1e",
                  border: "1px solid rgba(255,255,255,0.065)",
                  animationDelay: "0.1s",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Strong Skills</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.insights.strongSkills.map((skill: string, i: number) => (
                    <SkillTag key={i} label={skill} variant="strong" />
                  ))}
                </div>
              </div>
            )}

            {state.insights?.missingSkills?.length > 0 && (
              <div
                className="rounded-2xl p-6 animate-fade-in-up"
                style={{
                  background: "#0a0f1e",
                  border: "1px solid rgba(255,255,255,0.065)",
                  animationDelay: "0.15s",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Skills to Improve</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.insights.missingSkills.slice(0, 10).map((skill: string, i: number) => (
                    <SkillTag key={i} label={skill} variant="missing" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* All Resume Skills */}
          {state.resumeSkills?.length > 0 && (
            <div
              className="rounded-2xl p-6 animate-fade-in-up"
              style={{
                background: "#0a0f1e",
                border: "1px solid rgba(255,255,255,0.065)",
                animationDelay: "0.2s",
              }}
            >
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                All Detected Skills
              </p>
              <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1">
                {state.resumeSkills.map((skill: string, i: number) => (
                  <SkillTag key={i} label={skill} variant="neutral" />
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {state.suggestions?.length > 0 && (
            <div
              className="rounded-2xl p-6 animate-fade-in-up"
              style={{
                background: "#0a0f1e",
                border: "1px solid rgba(255,255,255,0.065)",
                animationDelay: "0.25s",
              }}
            >
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                You Can Also Explore
              </p>
              <div className="flex gap-2 flex-wrap">
                {state.suggestions.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.18)",
                      color: "#60a5fa",
                    }}
                  >
                    {domainLabels[s] ?? s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() =>
              navigate("/quiz", {
                state: {
                  domain: state.resumeDomain,
                  questions: state.resumeQuestions,
                  score: state.resumeScore,
                  matchedSkills: state.matchedSkills,
                  missingSkills: state.missingSkills,
                },
              })
            }
            className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-all duration-200 animate-fade-in-up"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              boxShadow: "0 4px 24px rgba(59,130,246,0.3)",
              animationDelay: "0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 32px rgba(59,130,246,0.45)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(59,130,246,0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Take {domainLabels[state.resumeDomain] ?? "Domain"} Quiz →
          </button>
        </div>
      </section>
    </main>
  );
}
