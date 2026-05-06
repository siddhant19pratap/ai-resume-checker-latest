import { useEffect } from "react";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume AI Checker" },
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
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            AI-powered resume analysis
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">
            Analyze your Resume with AI
          </h1>

          <p className="text-zinc-400 text-base max-w-xl mx-auto">
            Get instant, actionable insights to improve your resume and land jobs faster.
          </p>
        </div>
      </section>

      {/* Resume Section */}
      {resumes.length > 0 ? (
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-white">Your Resumes</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {resumes.length} {resumes.length === 1 ? "resume" : "resumes"} analyzed
                </p>
              </div>
              <a
                href="/upload"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-all duration-200"
              >
                + Upload New
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resumes.map((resume: Resume, index) => (
                <ResumeCard key={resume.id ?? index} resume={resume} />
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-8">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center hover:border-zinc-700 transition-all duration-200">
                <div>
                  <h3 className="text-sm font-semibold text-white">Data Engineering Quiz</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Continue skills validation</p>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  Open →
                </button>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center hover:border-zinc-700 transition-all duration-200">
                <div>
                  <h3 className="text-sm font-semibold text-white">Performance Dashboard</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Review resume and quiz signals</p>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  View →
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-sm mx-auto text-center">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-10">
                <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">No resumes yet</h3>
                <p className="text-sm text-zinc-500 mb-6">
                  Upload your first resume to get AI-powered feedback.
                </p>
                <a
                  href="/upload"
                  className="inline-block px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-all duration-200"
                >
                  Upload Resume
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
