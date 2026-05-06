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
  Cell,
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
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 text-sm mb-4">No result data available.</p>
          <a
            href="/upload"
            className="px-5 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            Upload Resume
          </a>
        </div>
      </main>
    );
  }

  const correctAnswers =
    typeof percentage === "number" && typeof total === "number"
      ? Math.round((percentage / 100) * total)
      : 0;

  const chartData = [
    { name: "Matched", value: matchedSkills.length, fill: "#22c55e" },
    { name: "Missing", value: missingSkills.length, fill: "#ef4444" },
  ];

  const getReadiness = () => {
    if (typeof percentage !== "number") return null;
    if (percentage > 80)
      return { label: "Interview Ready", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", color: "#4ade80", dot: "#22c55e" };
    if (percentage > 50)
      return { label: "Almost There", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)", color: "#fbbf24", dot: "#f59e0b" };
    return { label: "Needs More Prep", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", color: "#f87171", dot: "#ef4444" };
  };

  const readiness = getReadiness();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div
          className="px-3 py-2 rounded-xl text-xs"
          style={{ background: "#0d1525", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
        >
          <p className="font-semibold">{label}</p>
          <p style={{ color: payload[0].fill }}>{payload[0].value} skills</p>
        </div>
      );
    }
    return null;
  };

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

      {/* Atmospheric blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-blue-600/7 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-violet-600/6 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <section className="pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Performance Dashboard</p>
              <h1 className="text-3xl font-bold text-white tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                Your Results
              </h1>
              <p className="text-sm text-white/35 mt-1">Here's how you performed overall</p>
            </div>
            {readiness && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto"
                style={{ background: readiness.bg, border: `1px solid ${readiness.border}`, color: readiness.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: readiness.dot }} />
                {readiness.label}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 space-y-4">

          {/* Score Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {typeof percentage === "number" && (
              <div
                className="rounded-2xl p-6 text-center animate-fade-in-up"
                style={{
                  background: "#0a0f1e",
                  border: "1px solid rgba(255,255,255,0.065)",
                  animationDelay: "0.05s",
                }}
              >
                <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5">Quiz Score</p>
                <div className="flex justify-center mb-4">
                  <ScoreCircle score={percentage} size={100} />
                </div>
                <p className="text-xs text-white/35">
                  {correctAnswers} of {total} correct
                </p>
              </div>
            )}

            <div
              className="rounded-2xl p-6 text-center animate-fade-in-up"
              style={{
                background: "#0a0f1e",
                border: "1px solid rgba(255,255,255,0.065)",
                animationDelay: "0.1s",
              }}
            >
              <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5">Resume Match</p>
              <div className="flex justify-center mb-4">
                <ScoreCircle score={resumeScore ?? 0} size={100} />
              </div>
              <p className="text-xs text-white/35">Based on skill matching</p>
            </div>
          </div>

          {/* Skill Analysis */}
          <div
            className="rounded-2xl p-6 animate-fade-in-up"
            style={{
              background: "#0a0f1e",
              border: "1px solid rgba(255,255,255,0.065)",
              animationDelay: "0.15s",
            }}
          >
            <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-6">Skill Analysis</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Chart */}
              <div
                className="lg:col-span-2 h-[240px] rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={48}>
                    <XAxis
                      dataKey="name"
                      stroke="transparent"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="transparent"
                      tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Skill Lists */}
              <div className="flex flex-col gap-3">
                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Matched</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.length > 0 ? (
                      matchedSkills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-white/20">None matched</p>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Missing</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-white/20">None missing</p>
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
