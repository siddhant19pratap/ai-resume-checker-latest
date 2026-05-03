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
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No result available
      </div>
    );
  }

  // ✅ Calculate correct answers
  const correctAnswers =
    typeof percentage === "number" && typeof total === "number"
      ? Math.round((percentage / 100) * total)
      : 0;

  const chartData = [
    { name: "Matched", value: matchedSkills.length },
    { name: "Missing", value: missingSkills.length },
  ];

  return (
    <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-black to-cyan-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Navbar />
        </div>
      </div>

      {/* Title */}
      <section className="relative z-10 text-center py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Your Performance Dashboard
        </h1>

        {/* ✅ RESULT MESSAGE MOVED HERE */}
        {typeof percentage === "number" && (
          <div className="mt-6">
            {percentage > 80 ? (
              <p className="text-green-400 font-semibold text-lg">
                Excellent! You're interview-ready 🚀
              </p>
            ) : percentage > 50 ? (
              <p className="text-yellow-400 font-semibold text-lg">
                Good, but needs improvement 💡
              </p>
            ) : (
              <p className="text-red-400 font-semibold text-lg">
                ❌ Not suitable for this role
              </p>
            )}
          </div>
        )}
      </section>

      {/* Content */}
      <section className="relative z-10 pb-20">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Quiz Performance */}
            {typeof percentage === "number" && (
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 text-center">
                <h2 className="text-lg text-gray-300 mb-4">
                  Quiz Performance
                </h2>

                <div className="flex justify-center mb-4">
                  <ScoreCircle score={percentage} />
                </div>

                {/* ✅ FIXED TEXT */}
                <p className="text-gray-400 text-sm">
                  {correctAnswers}/{total} questions correct
                </p>
              </div>
            )}

            {/* Resume Match */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 text-center">
              <h2 className="text-lg text-gray-300 mb-4">
                Resume Match
              </h2>

              <div className="flex justify-center mb-4">
                <ScoreCircle score={resumeScore} />
              </div>

              <p className="text-gray-400 text-sm">
                Based on skill matching
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
            <h2 className="text-xl text-center text-gray-300 mb-6">
              Skill Analysis
            </h2>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

              <div className="lg:col-span-2 h-[300px] bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis stroke="#9ca3af" dataKey="name" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="value" fill="url(#gradient)" />
                    <defs>
                      <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                  <h3 className="text-lg text-green-400 mb-4">
                    Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((skill: string, i: number) => (
                      <span key={i}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                  <h3 className="text-lg text-red-400 mb-4">
                    Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill: string, i: number) => (
                      <span key={i}>{skill}</span>
                    ))}
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