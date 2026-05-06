import { Link } from "react-router";
import ScoreCircle from "~/components/Scorecircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const score = feedback.overallScore;

  const badgeCfg = (s: number) =>
    s >= 80
      ? { label: "Excellent", cls: "bg-green-500/10 border-green-500/20 text-green-400" }
      : s >= 60
      ? { label: "Good", cls: "bg-amber-500/10 border-amber-500/20 text-amber-400" }
      : { label: "Needs Work", cls: "bg-red-500/10 border-red-500/20 text-red-400" };

  const { label, cls } = badgeCfg(score);

  return (
    <Link
      to={`/resume/${id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "#0a0f1e",
        border: "1px solid rgba(255,255,255,0.065)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.11)";
        (e.currentTarget as HTMLElement).style.background = "#0d1525";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.065)";
        (e.currentTarget as HTMLElement).style.background = "#0a0f1e";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            {companyName && (
              <h2 className="text-sm font-semibold text-white truncate leading-snug group-hover:text-blue-400 transition-colors duration-200">
                {companyName}
              </h2>
            )}
            {jobTitle && (
              <p className="text-xs text-white/35 truncate mt-0.5">{jobTitle}</p>
            )}
            {!companyName && !jobTitle && (
              <h2 className="text-sm font-semibold text-white">Resume</h2>
            )}
            <span className={`inline-block text-[10px] font-semibold mt-2.5 px-2 py-0.5 rounded-full border ${cls}`}>
              {label}
            </span>
          </div>
          <div className="shrink-0 mt-0.5">
            <ScoreCircle score={score} size={72} />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="mx-4 mb-4 rounded-xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {imagePath ? (
          <img
            src={imagePath}
            alt="Resume preview"
            className="w-full h-[200px] object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
            loading="lazy"
          />
        ) : (
          <div className="p-4 space-y-2.5">
            <div className="h-2 rounded-full bg-white/6 w-3/4" />
            <div className="h-2 rounded-full bg-white/5 w-1/2" />
            <div className="h-2 rounded-full bg-white/4 w-2/3" />
            <div className="h-2 rounded-full bg-white/5 w-4/5 mt-1" />
            <div className="flex gap-1.5 mt-3">
              <div className="h-4 w-10 rounded-full bg-blue-500/20" />
              <div className="h-4 w-10 rounded-full bg-purple-500/15" />
              <div className="h-4 w-10 rounded-full bg-blue-500/15" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-1.5 text-xs text-white/30">
          <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Analyzed
        </div>
        <span className="text-xs text-white/25 group-hover:text-blue-400 transition-colors duration-200">
          View Details →
        </span>
      </div>
    </Link>
  );
};

export default ResumeCard;
