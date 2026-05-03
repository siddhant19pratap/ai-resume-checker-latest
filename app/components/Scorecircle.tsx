import React from "react";

// ScoreCircle component takes a 'score' (default 75) and renders a circular progress indicator
const ScoreCircle = ({ score = 75 }: { score?: number }) => {
  // Radius of the circle
  const radius = 50;
  // Stroke width of the circle
  const stroke = 8;
  // Adjusted Radius to Account for Stroke Width
  const normalizedRadius = radius - stroke / 2;
  // Circumference of the circle (used for Stroke Dash Array)
  const circumference = 2 * Math.PI * normalizedRadius;
  // Progress as a value between 0 and 1
  const progress = score / 100;
  // Stroke Offset for the Progress Circle
  const strokeDashoffset = circumference * (1 - progress);

  return (
    
    // Container for the circle with fixed width and height
    <div className="relative w-[100px] h-[100px]">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90" // Rotate to start the progress from the top
      >
        {/* Background Circle (Full Grey Circle) */}
        <circle
          cx="50" // x-coordinate of circle center
          cy="50" // y-coordinate of circle center
          r={normalizedRadius} // radius of the circle
          stroke="#e5e7eb" // gray color of the background
          strokeWidth={stroke} // stroke thickness
          fill="transparent" // no fill
        />

        {/* Define gradient for the progress circle */}
        <defs>
          <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF97AD" /> {/* Start Color */}
            <stop offset="100%" stopColor="#5171FF" /> {/* Stop Color */}
          </linearGradient>
        </defs>

        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="url(#grad)" // Use the gradient defined above
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference} // Set Dasharray to circumference
          strokeDashoffset={strokeDashoffset} // Set Stroke Dash Offset based on score
          strokeLinecap="round" // Rounded ends for smooth appearance
        />
      </svg>

      {/* Centered Score Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg leading-none">{score}</span>
          <span className="text-xs text-gray-500 mt-0.5">/100</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;
