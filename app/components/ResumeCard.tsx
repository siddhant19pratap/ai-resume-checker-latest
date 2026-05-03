import { Link } from "react-router";
import ScoreCircle from "~/components/Scorecircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const score = feedback.overallScore;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <Link
      to={`/resume/${id}`}
      className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      {/* 🔹 Header */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex flex-col gap-1 min-w-0">
          {companyName || jobTitle ? (
            <>
              {companyName && (
                <h2 className="text-lg font-semibold text-white truncate group-hover:text-cyan-400 transition">
                  {companyName}
                </h2>
              )}
              {jobTitle && (
                <p className="text-sm text-gray-400 truncate">
                  {jobTitle}
                </p>
              )}
            </>
          ) : (
            <h2 className="text-lg font-semibold text-white">Resume</h2>
          )}

          {/* Status */}
          <span
            className={`text-xs font-medium mt-2 ${getScoreColor(score)}`}
          >
            {getScoreLabel(score)}
          </span>
        </div>

        {/* 🔵 Score */}
        <div className="shrink-0">
          <ScoreCircle score={score} />
        </div>
      </div>

      {/* 🧾 Preview Section */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 overflow-hidden">
        {imagePath ? (
          <img
            src={imagePath}
            alt="Resume Preview"
            className="w-full h-[330px] object-cover rounded-lg opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
            <div className="h-3 bg-white/10 rounded w-2/3" />

            <div className="flex gap-2 mt-3">
              <div className="h-6 w-10 bg-white/10 rounded" />
              <div className="h-6 w-10 bg-white/10 rounded" />
              <div className="h-6 w-10 bg-white/10 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* 🔻 Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Analyzed
        </div>

        <span className="text-gray-500 group-hover:text-cyan-400 transition">
          View Details →
        </span>
      </div>
    </Link>
  );
};

export default ResumeCard;