import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "~/components/Navbar";

export default function ResumeAnalysis() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const domainLabels: Record<string, string> = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    dataEngineering: "Data Engineer",
    dataAnalyst: "Data Analyst",
    uiux: "UI/UX Designer",
  };

  if (!state) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No data found. Please upload a resume first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Header */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-semibold text-white mb-1">Resume Analysis</h1>
          <p className="text-sm text-zinc-500">AI-powered insights for your resume</p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 space-y-5">

          {/* Domain Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">Detected Domain</p>
              <p className="text-xl font-semibold text-white">
                {domainLabels[state.resumeDomain] ?? state.resumeDomain}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              Auto-detected
            </div>
          </div>

          {/* Feedback */}
          {state.feedback && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">AI Feedback</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{state.feedback}</p>
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Strong Skills */}
            {state.insights?.strongSkills?.length > 0 && (
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-sm font-medium text-zinc-300">Strong Skills</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.insights.strongSkills.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills to Improve */}
            {state.insights?.missingSkills?.length > 0 && (
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <p className="text-sm font-medium text-zinc-300">Skills to Improve</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.insights.missingSkills.slice(0, 10).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* All Resume Skills */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">All Detected Skills</p>
            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1">
              {state.resumeSkills?.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-zinc-600 transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {state.suggestions?.length > 0 && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">You Can Also Explore</p>
              <div className="flex gap-2 flex-wrap">
                {state.suggestions.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-600/10 border border-blue-500/20 text-blue-400"
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
                },
              })
            }
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-all duration-200 shadow-lg"
          >
            Take {domainLabels[state.resumeDomain] ?? "Domain"} Quiz →
          </button>

        </div>
      </section>
    </main>
  );
}
