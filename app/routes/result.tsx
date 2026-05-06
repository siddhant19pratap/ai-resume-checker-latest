import { useLocation } from "react-router";
import Navbar from "~/components/Navbar";
import ScoreCircle from "~/components/Scorecircle";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Result() {
  const location = useLocation();

  const {
    resumeScore,
    percentage,
    total,
    matchedSkills = [],
    missingSkills = [],
  } = location.state || {};

  if (!location.state) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No result available.</p>
      </main>
    );
  }

  const correctAnswers =
    typeof percentage === "number" && typeof total === "number"
      ? Math.round((percentage / 100) * total)
      : 0;

  const chartData = [
    { name: "Matched", value: matchedSkills.length },
    { name: "Missing", value: missingSkills.length },
  ];

  const getResultBadge = () => {
    if (typeof percentage !== "number") return null;
    if (percentage > 80) return { label: "Interview Ready", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" };
    if (percentage > 50) return { label: "Needs Improvement", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
    return { label: "Not Suitable Yet", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };
  };

  const badge = getResultBadge();

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
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-1">Performance Dashboard</h1>
              <p className="text-sm text-zinc-500">Here's how you did overall</p>
            </div>
            {badge && (
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 space-y-5">

          {/* Score Cards */}
          <div className="grid md:grid-cols-2 gap-5">

            {typeof percentage === "number" && (
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 text-center shadow-lg">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-5">Quiz Score</p>
                <div className="flex justify-center mb-4">
                  <ScoreCircle score={percentage} />
                </div>
                <p className="text-sm text-zinc-500">
                  {correctAnswers} / {total} correct answers
                </p>
              </div>
            )}

            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 text-center shadow-lg">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-5">Resume Match</p>
              <div className="flex justify-center mb-4">
                <ScoreCircle score={resumeScore} />
              </div>
              <p className="text-sm text-zinc-500">Based on skill matching</p>
            </div>

          </div>

          {/* Skill Analysis */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-6">Skill Analysis</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* Chart */}
              <div className="lg:col-span-2 h-[260px] bg-zinc-800/40 border border-zinc-700 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={40}>
                    <XAxis stroke="#52525b" dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                    <YAxis stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#fff" }}
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    />
                    <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Skill Lists */}
              <div className="flex flex-col gap-4">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="text-xs font-medium text-zinc-400">Matched Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.length > 0 ? matchedSkills.map((skill: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-green-500/10 border border-green-500/20 text-green-400">
                        {skill}
                      </span>
                    )) : (
                      <p className="text-xs text-zinc-600">None matched</p>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <p className="text-xs font-medium text-zinc-400">Missing Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.length > 0 ? missingSkills.map((skill: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-red-500/10 border border-red-500/20 text-red-400">
                        {skill}
                      </span>
                    )) : (
                      <p className="text-xs text-zinc-600">None missing</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
