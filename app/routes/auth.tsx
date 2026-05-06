import { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/auth";
import { useLocation, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In — Ambixious" },
    { name: "description", content: "Log into Your Account" },
  ];
}

export default function Auth() {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get("next") || "/";

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="bg-grid-subtle absolute inset-0 opacity-60" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Ambix<span className="text-blue-400">ious</span>
            </span>
          </div>
          <p className="text-sm text-white/40">AI-powered resume intelligence</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#0a0f1e",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-1.5 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-white/40">
              Sign in to continue your career journey
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["AI Analysis", "Job Matching", "Skills Quiz"].map((f) => (
              <span
                key={f}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium text-blue-300/70"
                style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}
              >
                {f}
              </span>
            ))}
          </div>

          {isLoading ? (
            <button
              disabled
              className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Signing you in…
            </button>
          ) : auth.isAuthenticated ? (
            <button
              onClick={auth.signOut}
              className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={auth.signIn}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.3), 0 0 0 1px rgba(99,102,241,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 6px 28px rgba(59,130,246,0.45), 0 0 0 1px rgba(99,102,241,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 20px rgba(59,130,246,0.3), 0 0 0 1px rgba(99,102,241,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              Continue with Puter
            </button>
          )}
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </main>
  );
}
