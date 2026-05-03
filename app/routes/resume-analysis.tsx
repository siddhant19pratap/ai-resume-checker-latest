import { useLocation, useNavigate } from "react-router-dom";

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
      <div className="text-center mt-20 text-white">
        No data found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* 🔥 DOMAIN CARD */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <h2 className="text-xl text-gray-400 mb-2">Detected Domain</h2>

          <p className="text-3xl font-bold text-cyan-400">
            {domainLabels[state.resumeDomain]}
          </p>
        </div>

        {/* 🔥 SKILLS CARD */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <h2 className="text-lg text-gray-400 mb-4">Your Skills</h2>

          <div className="flex flex-wrap gap-3 max-h-[300px] overflow-y-auto pr-2">
            {state.resumeSkills?.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-4 py-1 rounded-full text-sm
                bg-blue-500/20 border border-blue-400/30
                hover:bg-blue-500/30 transition"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 🔥 AI FEEDBACK (NEW) */}
        {state.feedback && (
          <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-cyan-400/20 rounded-2xl p-6">
            <h2 className="text-lg text-cyan-300 mb-2">
              Feedback
            </h2>

            <p className="text-gray-300 leading-relaxed">
              {state.feedback}
            </p>
          </div>
        )}

        {/* 🔥 STRONG SKILLS (NEW) */}
        {state.insights?.strongSkills?.length > 0 && (
          <div className="bg-white/5 border border-green-400/20 rounded-2xl p-6">
            <h2 className="text-lg text-green-400 mb-4">
              You are strong in
            </h2>

            <div className="flex flex-wrap gap-3">
              {state.insights.strongSkills.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-4 py-1 rounded-full text-sm
                  bg-green-500/20 border border-green-400/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 MISSING SKILLS (NEW) */}
        {state.insights?.missingSkills?.length > 0 && (
          <div className="bg-white/5 border border-red-400/20 rounded-2xl p-6">
            <h2 className="text-lg text-red-400 mb-4">
              You should improve
            </h2>

            <div className="flex flex-wrap gap-3">
              {state.insights.missingSkills
                .slice(0, 10)
                .map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-1 rounded-full text-sm
                    bg-red-500/20 border border-red-400/30"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* 🔥 SUGGESTIONS */}
        {state.suggestions?.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
            <h2 className="text-lg text-gray-400 mb-3">
              You can also explore
            </h2>

            <div className="flex gap-3 flex-wrap">
              {state.suggestions.map((s: string, i: number) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300"
                >
                  {domainLabels[s]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 ACTION BUTTON */}
        <button
          onClick={() =>
            navigate("/quiz", {
              state: {
                domain: state.resumeDomain,
                questions: state.resumeQuestions,
              },
            })
          }
          className="w-full py-4 rounded-xl text-lg font-semibold
          bg-gradient-to-r from-blue-600 to-cyan-500
          hover:scale-[1.02] transition"
        >
          Take {domainLabels[state.resumeDomain]} Quiz →
        </button>

      </div>
    </main>
  );
}