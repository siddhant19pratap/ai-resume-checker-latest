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
    <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

      {/* 🌌 Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-black to-cyan-900/20" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* 🔝 Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Navbar />
        </div>
      </div>

      {/* 🚀 Hero */}
      <section className="relative z-10 text-center py-20">
        <div className="max-w-4xl mx-auto px-4">

          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            ✨ AI-powered feedback to land jobs faster
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl text-white! font-bold leading-tight mb-6">
            Parse your Resume using{" "}
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Use AI-powered feedback to land jobs faster. Get instant, actionable insights to improve your resume.
          </p>
        </div>
      </section>

      {/* 📄 Resume Section */}
      {resumes.length > 0 ? (
        <section className="relative z-10 pt-10 pb-20">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Heading */}
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-2">
                Your Resumes
              </h2>
              <p className="text-gray-400">
                {resumes.length} {resumes.length === 1 ? "resume" : "resumes"} analyzed
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume: Resume, index) => (
                <ResumeCard key={resume.id ?? index} resume={resume} />
              ))}
            </div>

            {/* Bottom Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center hover:border-cyan-500/30 transition">
                <div>
                  <h3 className="font-semibold">DATA ENGINEERING Quiz</h3>
                  <p className="text-gray-400 text-sm">Continue skills validation</p>
                </div>
                <button className="text-cyan-400 hover:underline">
                  Open quiz →
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center hover:border-cyan-500/30 transition">
                <div>
                  <h3 className="font-semibold">Your Performance Dashboard</h3>
                  <p className="text-gray-400 text-sm">Review resume and quiz signals</p>
                </div>
                <button className="text-cyan-400 hover:underline">
                  View result →
                </button>
              </div>

            </div>

          </div>
        </section>
      ) : (
        <section className="relative z-10 pt-20 pb-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-md mx-auto text-center">

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-12">

                <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  📄
                </div>

                <h3 className="text-2xl font-semibold mb-3">
                  No Resumes Yet
                </h3>

                <p className="text-gray-400 mb-6">
                  Upload your first resume to get AI-powered feedback and improve your chances.
                </p>

                <a
                  href="/upload"
                  className="px-6 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20"
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