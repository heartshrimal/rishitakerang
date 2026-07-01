"use client";

import { useState, useEffect, useRef } from "react";

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState("writing");
  const [clipPct, setClipPct] = useState(0);
  const [penPos, setPenPos] = useState({ x: 0, y: 0 });
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    let start = null;
    const duration = 2200;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      path.style.strokeDashoffset = length * (1 - eased);
      setClipPct(eased * 100);

      const pt = path.getPointAtLength(Math.max(2, length * eased - 2));
      setPenPos({ x: pt.x, y: pt.y });

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        setPhase("done");
        setTimeout(() => setPhase("fading"), 400);
        setTimeout(() => onFinish?.(), 1400);
      }
    }

    requestAnimationFrame(step);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="fixed inset-0 -z-10 bg-noise" aria-hidden>
        <div className="absolute -top-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-primary/25" />
        <div className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] bg-primary/20" />
      </div>

      <svg
        viewBox="0 0 600 300"
        className="w-full max-w-[500px] h-auto px-8"
        aria-hidden
      >
        <defs>
          <linearGradient id="swashGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c4956a" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#d48464" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c4956a" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <text
          x="300"
          y="160"
          textAnchor="middle"
          fontFamily="'Dancing Script', cursive"
          fontSize="52"
          fill="#2c2420"
          className="select-none"
          opacity="0.15"
        >
          Rishita Ke Rang
        </text>

        <text
          x="300"
          y="160"
          textAnchor="middle"
          fontFamily="'Dancing Script', cursive"
          fontSize="52"
          fill="#2c2420"
          className="select-none"
          style={{
            clipPath: `inset(0 ${100 - clipPct}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - clipPct}% 0 0)`,
          }}
        >
          Rishita Ke Rang
        </text>

        <path
          ref={pathRef}
          d="M 50 195 Q 200 170 300 185 Q 400 200 550 180"
          fill="none"
          stroke="url(#swashGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <circle
          cx={penPos.x}
          cy={penPos.y}
          r="5"
          fill="#d48464"
          opacity={phase === "writing" && clipPct > 1 ? 1 : 0}
          className="transition-opacity duration-150"
        />
        <circle
          cx={penPos.x}
          cy={penPos.y}
          r="2.5"
          fill="#fffdf9"
          opacity={phase === "writing" && clipPct > 1 ? 1 : 0}
          className="transition-opacity duration-150"
        />

        {phase === "done" && (
          <g opacity="0" className="animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
            <circle cx="80" cy="130" r="3" fill="#c4956a" opacity="0.5" />
            <circle cx="525" cy="170" r="2.5" fill="#d48464" opacity="0.5" />
            <circle cx="550" cy="155" r="4" fill="#c4956a" opacity="0.4" />
            <circle cx="65" cy="190" r="2" fill="#9ab0a0" opacity="0.5" />
            <text
              x="300"
              y="255"
              textAnchor="middle"
              fontFamily="'Dancing Script', cursive"
              fontSize="18"
              fill="#8a7a6e"
              opacity="0.6"
            >
              handmade clay art
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
