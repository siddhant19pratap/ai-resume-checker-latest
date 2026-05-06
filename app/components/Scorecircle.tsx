import React from "react";

const ScoreCircle = ({ score = 75, size = 88 }: { score?: number; size?: number }) => {
  const radius = size / 2 - 7;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference * (1 - score / 100);

  const getGradientId = () => `score-grad-${Math.random().toString(36).slice(2, 7)}`;
  const gradId = React.useId().replace(/:/g, "");

  const gradientColors = () => {
    if (score >= 80) return { start: "#22c55e", end: "#06b6d4" };
    if (score >= 60) return { start: "#f59e0b", end: "#f97316" };
    return { start: "#ef4444", end: "#f97316" };
  };

  const { start, end } = gradientColors();

  const textColor = score >= 80
    ? "#4ade80"
    : score >= 60
    ? "#fbbf24"
    : "#f87171";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id={gradId} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={start} />
            <stop offset="100%" stopColor={end} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>

      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <span
            className="font-bold leading-none tabular-nums"
            style={{ fontSize: size < 80 ? 14 : 18, color: textColor }}
          >
            {score}
          </span>
          <span className="text-[9px] text-white/30 mt-0.5 font-medium">/100</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;
