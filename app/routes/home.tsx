import { useEffect } from "react";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — Ambixious" },
    { name: "description", content: "Smart AI Checker for Resumes" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <main className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      {/* Atmospheric blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/3 w-[600px] h-[500px] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 -right-32 w-[400px] h-[400px] bg-violet-600/7 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: "rgba(5,8,22,0.8)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Hero */}
      <section className="pt-16 pb-12 relative">
        <div className="bg-grid-subtle absolute inset-0 opacity-50 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-2xl animate-fade-in-up">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              AI-Powered Resume Intelligence
            </div>

            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4"
              style={{ letterSpacing: "-0.03em" }}
            >
              Analyze your resume,
              <br />
              <span className="text-gradient-blue">land jobs faster</span>
            </h1>

            <p className="text-base text-white/45 leading-relaxed max-w-lg">
              Get instant AI feedback, skill gap analysis, and job match scoring
              to optimize your resume for the roles you want.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { value: "10K+", label: "Resumes Analyzed" },
              { value: "94%", label: "ATS Pass Rate" },
              { value: "5 sec", label: "Avg. Analysis Time" },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">{value}</span>
                <span className="text-xs text-white/35">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {resumes.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-7">
                <div>
                  <p className="eyebrow mb-1">Your Resumes</p>
                  <h2 className="text-lg font-semibold text-white">
                    {resumes.length}{" "}
                    {resumes.length === 1 ? "resume" : "resumes"} analyzed
                  </h2>
                </div>
                <a
                  href="/upload"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200"
                  style={{
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.2)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.2)";
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload New
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume: Resume, index: number) => (
                  <ResumeCard key={resume.id ?? index} resume={resume} />
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto text-center py-8 mb-8">
              <div
                className="rounded-2xl p-10"
                style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.065)" }}
              >
                <div
                  className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}
                >
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  No resumes yet
                </h3>
                <p className="text-sm text-white/35 mb-7 leading-relaxed">
                  Upload your first resume to get instant AI-powered feedback and job match scoring.
                </p>
                <a
                  href="/upload"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9m-5-4v8m0 0l-3-3m3 3l3-3" />
                  </svg>
                  Upload Resume
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Skills Quiz */}
            <button
              onClick={() => navigate("/quiz")}
              className="group text-left w-full rounded-2xl p-5 transition-all duration-200"
              style={{
                background: "#0a0f1e",
                border: "1px solid rgba(255,255,255,0.065)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.25)";
                (e.currentTarget as HTMLElement).style.background = "#0d1525";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(139,92,246,0.1), 0 12px 32px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.065)";
                (e.currentTarget as HTMLElement).style.background = "#0a0f1e";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
                  >
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Skills Quiz</p>
                    <p className="text-xs text-white/35 mt-0.5">Validate your technical skills</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors shrink-0">
                  Open →
                </span>
              </div>
            </button>

            {/* Performance Dashboard */}
            <button
              onClick={() => navigate("/result")}
              className="group text-left w-full rounded-2xl p-5 transition-all duration-200"
              style={{
                background: "#0a0f1e",
                border: "1px solid rgba(255,255,255,0.065)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.25)";
                (e.currentTarget as HTMLElement).style.background = "#0d1525";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(59,130,246,0.1), 0 12px 32px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.065)";
                (e.currentTarget as HTMLElement).style.background = "#0a0f1e";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
                  >
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Performance Dashboard</p>
                    <p className="text-xs text-white/35 mt-0.5">Review resume and quiz signals</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors shrink-0">
                  View →
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
