import { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/auth";
import { useLocation, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Authentication" },
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
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Ambixious</h1>
          <p className="text-sm text-zinc-500 mt-1">AI-powered resume analysis</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-zinc-500">Sign in to continue your job journey</p>
          </div>

          {isLoading ? (
            <button
              disabled
              className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-500 text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Signing you in...
            </button>
          ) : (
            <>
              {auth.isAuthenticated ? (
                <button
                  onClick={auth.signOut}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm font-medium text-white transition-all duration-200"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={auth.signIn}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-all duration-200 shadow-lg"
                >
                  Sign In
                </button>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </main>
  );
}
