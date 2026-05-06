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
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/20 text-green-400";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    return "bg-red-500/10 border-red-500/20 text-red-400";
  };

  return (
    <Link
      to={`/resume/${id}`}
      className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 flex flex-col gap-4 hover:border-zinc-700 hover:shadow-xl transition-all duration-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          {companyName || jobTitle ? (
            <>
              {companyName && (
                <h2 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors duration-200">
                  {companyName}
                </h2>
              )}
              {jobTitle && (
                <p className="text-xs text-zinc-500 truncate mt-0.5">{jobTitle}</p>
              )}
            </>
          ) : (
            <h2 className="text-sm font-semibold text-white">Resume</h2>
          )}
          <span className={`inline-block text-xs font-medium mt-2 px-2.5 py-1 rounded-full border ${getScoreBadge(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>

        <div className="shrink-0">
          <ScoreCircle score={score} />
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-800/30 overflow-hidden">
        {imagePath ? (
          <img
            src={imagePath}
            alt="Resume Preview"
            className="w-full h-[220px] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-300"
            loading="lazy"
          />
        ) : (
          <div className="p-4 space-y-2">
            <div className="h-2.5 bg-zinc-700 rounded w-3/4" />
            <div className="h-2.5 bg-zinc-700 rounded w-1/2" />
            <div className="h-2.5 bg-zinc-700 rounded w-2/3" />
            <div className="flex gap-2 mt-3">
              <div className="h-5 w-12 bg-zinc-700 rounded-full" />
              <div className="h-5 w-12 bg-zinc-700 rounded-full" />
              <div className="h-5 w-12 bg-zinc-700 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Analyzed
        </div>
        <span className="text-zinc-600 group-hover:text-blue-400 transition-colors duration-200">
          View Details →
        </span>
      </div>
    </Link>
  );
};

export default ResumeCard;
