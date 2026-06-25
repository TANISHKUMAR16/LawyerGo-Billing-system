import React from "react";

interface CompanyLogoProps {
  className?: string; // For sizing the graphic wrapper
  showText?: boolean; // Whether to include the "lawyergo.in" subtitle
  textColor?: "dark" | "light"; // Text color style
}

export default function CompanyLogo({ className = "h-11", showText = true, textColor = "dark" }: CompanyLogoProps) {
  return (
    <div className={`flex ${showText ? "flex-col" : "flex-row"} items-center gap-1 shrink-0`}>
      {/* SVG Icon of the LG logo */}
      <svg
        viewBox="0 0 240 180"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* L Shape in Blue */}
        <path
          d="M30 40V120H100V102H48V40H30Z"
          fill="#0091d5"
        />

        {/* Gavel / Hammer overlay */}
        {/* Rest blocks of Gavel */}
        <path
          d="M50 115H78V120H50V115Z"
          fill="#0091d5"
        />
        <path
          d="M54 110H74V114H54V110Z"
          fill="#0091d5"
        />
        
        {/* Mallet body */}
        <path
          d="M56.5 88.5L78.5 66.5L88.5 76.5L66.5 98.5L56.5 88.5Z"
          fill="#0091d5"
        />
        {/* Mallet Handle */}
        <path
          d="M78 80L118 120L111 127L71 87L78 80Z"
          fill="#0091d5"
        />
        <circle
          cx="114"
          cy="123"
          r="4"
          fill="#0091d5"
        />

        {/* G Shape in Green */}
        <path
          d="M142 40C110 40 92 64 92 92C92 120 110 144 142 144C164 144 178 132 178 114V90H142V104H164V114C164 124 154 130 142 130C120 130 108 112 108 92C108 72 120 54 142 54C154 54 163 60 166 69L181 60C174 48 160 40 142 40Z"
          fill="#76bc21"
        />

        {/* Columns / Buildings inside Green "G" */}
        {/* Building 1 (small) */}
        <path
          d="M118 100V120H124V100H118Z"
          fill="#76bc21"
        />
        {/* Building 2 (medium) */}
        <path
          d="M126 84V124H134V84H126Z"
          fill="#76bc21"
        />
        {/* Building 3 (tall) with "CA" text */}
        <path
          d="M136 60V124H144V60H136Z"
          fill="#76bc21"
        />
        {/* CA mark inside buildings group */}
        <text
          x="128"
          y="118"
          fill="#ffffff"
          fontSize="5"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          CA
        </text>
      </svg>

      {/* Subtext layer "lawyergo.in" */}
      {showText && (
        <div className="font-sans font-extrabold text-base tracking-tight leading-none mt-1 select-none flex">
          <span className={textColor === "light" ? "text-white" : "text-slate-800"}>
            lawyergo
          </span>
          <span className="text-[#76bc21]">.in</span>
        </div>
      )}
    </div>
  );
}
