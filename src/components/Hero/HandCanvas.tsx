import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { audio } from '../../services/audioService';

interface HandCanvasProps {
  progress: number; // 0 (far apart) to 1 (hands holding)
  onConnected?: () => void;
}

export const HandCanvas: React.FC<HandCanvasProps> = ({ progress, onConnected }) => {
  const [hasTriggeredConnected, setHasTriggeredConnected] = useState(false);

  useEffect(() => {
    if (progress >= 0.94 && !hasTriggeredConnected) {
      setHasTriggeredConnected(true);
      audio.playHarmonicConvergence();

      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.52, x: 0.5 },
          colors: ['#10b981', '#34d399', '#f59e0b', '#06b6d4', '#84cc16'],
          disableForReducedMotion: true,
        });
      } catch {
        // Safe fallback
      }

      if (onConnected) onConnected();
    } else if (progress < 0.85 && hasTriggeredConnected) {
      setHasTriggeredConnected(false);
    }
  }, [progress, hasTriggeredConnected, onConnected]);

  // Smooth interpolation calculations
  // p: 0 -> 1
  const p = Math.max(0, Math.min(1, progress));
  const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const eased = easeInOut(p);

  // Left AI Hand wrist position (moves from X=80 to X=350)
  // Right Groot Hand wrist position (moves from X=720 to X=450)
  const leftWristX = 70 + eased * 270;
  const rightWristX = 730 - eased * 270;
  const contactX = 400; // Center contact point
  const contactY = 220; // Center contact Y

  // Finger reach extension
  const leftReach = eased * 75;
  const rightReach = eased * 75;

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[380px] md:h-[440px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#020d07]/60 via-[#03150b]/80 to-[#020b06] border border-emerald-500/15 shadow-2xl backdrop-blur-md">
      {/* Background Soft Radial Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, ${0.12 + p * 0.25}) 0%, rgba(6, 182, 212, ${0.08 + p * 0.15}) 45%, transparent 70%)`,
        }}
      />

      {/* Main Articulated Vector Hands SVG Canvas */}
      <svg
        viewBox="0 0 800 440"
        className="w-full h-full relative z-20 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* AI Glow & Gradients */}
          <linearGradient id="aiArmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#082f49" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="aiCircuitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>

          {/* Groot Nature Glow & Gradients */}
          <linearGradient id="grootWoodGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#291807" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#5c3814" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#78451b" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="grootSapGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>

          {/* Contact Energy Burst Gradient */}
          <radialGradient id="energyBurstGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="subtleGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* LEFT: AI CYBERNETIC HAND & ARM (Clean Cyber-Biomech)     */}
        {/* ======================================================== */}
        <g id="ai-hand-group" filter="url(#subtleGlow)">
          {/* Forearm Structure */}
          <path
            d={`M -50,180 L ${leftWristX - 40},190 Q ${leftWristX - 10},205 ${leftWristX},220 Q ${leftWristX - 10},235 ${leftWristX - 40},250 L -50,260 Z`}
            fill="url(#aiArmGrad)"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Glowing Neural Circuit Bus along arm */}
          <path
            d={`M -40,210 L ${leftWristX - 50},210 L ${leftWristX - 25},218 L ${leftWristX + 10},218`}
            fill="none"
            stroke="url(#aiCircuitGrad)"
            strokeWidth="2.5"
            strokeDasharray="8 4"
            className="animate-pulse"
          />
          <path
            d={`M -40,230 L ${leftWristX - 45},230 L ${leftWristX - 20},224 L ${leftWristX + 10},224`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.7"
          />

          {/* Holographic Wrist Ring */}
          <ellipse
            cx={leftWristX}
            cy="220"
            rx="12"
            ry="30"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="6 3"
            opacity="0.8"
          />

          {/* AI Palm Chassis */}
          <path
            d={`M ${leftWristX},200 Q ${leftWristX + 35},195 ${leftWristX + 60},205 Q ${leftWristX + 75},220 ${leftWristX + 60},235 Q ${leftWristX + 35},245 ${leftWristX},240 Z`}
            fill="#0369a1"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* AI Core Reactor in Palm */}
          <circle
            cx={leftWristX + 35}
            cy="220"
            r={6 + p * 2}
            fill="#38bdf8"
            filter="url(#superGlow)"
          />
          <circle cx={leftWristX + 35} cy="220" r="3" fill="#ffffff" />

          {/* 5 Articulated Cyber Fingers */}
          {/* Finger 1 (Thumb) */}
          <path
            d={`M ${leftWristX + 25},202 Q ${leftWristX + 45},170 ${leftWristX + 60 + leftReach * 0.7},${185 + (1 - p) * 10}`}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle cx={leftWristX + 60 + leftReach * 0.7} cy={185 + (1 - p) * 10} r="2.5" fill="#38bdf8" />

          {/* Finger 2 (Index - Main reaching finger) */}
          <path
            d={`M ${leftWristX + 55},208 Q ${leftWristX + 90},208 ${leftWristX + 65 + leftReach * 1.05},${210 + (1 - p) * 6}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={leftWristX + 65 + leftReach * 1.05} cy={210 + (1 - p) * 6} r="3" fill="#67e8f9" />

          {/* Finger 3 (Middle) */}
          <path
            d={`M ${leftWristX + 60},218 Q ${leftWristX + 95},218 ${leftWristX + 68 + leftReach * 1.08},220`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={leftWristX + 68 + leftReach * 1.08} cy="220" r="3" fill="#67e8f9" />

          {/* Finger 4 (Ring) */}
          <path
            d={`M ${leftWristX + 58},228 Q ${leftWristX + 90},228 ${leftWristX + 63 + leftReach * 0.95},${228 - (1 - p) * 4}`}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle cx={leftWristX + 63 + leftReach * 0.95} cy={228 - (1 - p) * 4} r="2.5" fill="#38bdf8" />

          {/* Finger 5 (Pinky) */}
          <path
            d={`M ${leftWristX + 45},238 Q ${leftWristX + 75},245 ${leftWristX + 50 + leftReach * 0.8},${242 - (1 - p) * 8}`}
            fill="none"
            stroke="#0284c7"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={leftWristX + 50 + leftReach * 0.8} cy={242 - (1 - p) * 8} r="2" fill="#38bdf8" />
        </g>

        {/* ======================================================== */}
        {/* RIGHT: GROOT ANCIENT WOOD HAND & VINES (Living Nature)   */}
        {/* ======================================================== */}
        <g id="groot-hand-group" filter="url(#subtleGlow)">
          {/* Wooden Forearm Trunk */}
          <path
            d={`M 850,175 L ${rightWristX + 45},188 Q ${rightWristX + 15},205 ${rightWristX},220 Q ${rightWristX + 15},235 ${rightWristX + 45},252 L 850,265 Z`}
            fill="url(#grootWoodGrad)"
            stroke="#92400e"
            strokeWidth="2"
          />

          {/* Bioluminescent Sap Veins inside wood */}
          <path
            d={`M 840,210 Q ${rightWristX + 60},205 ${rightWristX + 30},218 L ${rightWristX - 10},218`}
            fill="none"
            stroke="url(#grootSapGrad)"
            strokeWidth="2.5"
            strokeDasharray="10 5"
            className="animate-pulse"
          />
          <path
            d={`M 840,230 Q ${rightWristX + 55},235 ${rightWristX + 25},224 L ${rightWristX - 10},224`}
            fill="none"
            stroke="#84cc16"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Sprouting Moss & Leaf Foliage on Wrist */}
          <ellipse
            cx={rightWristX + 15}
            cy="195"
            rx="9"
            ry="5"
            fill="#22c55e"
            transform={`rotate(-25 ${rightWristX + 15} 195)`}
          />
          <ellipse
            cx={rightWristX + 20}
            cy="245"
            rx="10"
            ry="6"
            fill="#16a34a"
            transform={`rotate(20 ${rightWristX + 20} 245)`}
          />
          <circle cx={rightWristX + 8} cy="205" r="3" fill="#a3e635" />
          <circle cx={rightWristX + 12} cy="235" r="2.5" fill="#facc15" />

          {/* Groot Palm Trunk Node */}
          <path
            d={`M ${rightWristX},200 Q ${rightWristX - 35},195 ${rightWristX - 60},205 Q ${rightWristX - 75},220 ${rightWristX - 60},235 Q ${rightWristX - 35},245 ${rightWristX},240 Z`}
            fill="#623616"
            stroke="#a16207"
            strokeWidth="2"
          />

          {/* Heartwood Bio-Core */}
          <circle
            cx={rightWristX - 35}
            cy="220"
            r={5 + p * 3}
            fill="#22c55e"
            filter="url(#superGlow)"
          />
          <circle cx={rightWristX - 35} cy="220" r="2.5" fill="#fef08a" />

          {/* 5 Articulated Living Wood Fingers */}
          {/* Groot Finger 1 (Thumb) */}
          <path
            d={`M ${rightWristX - 25},202 Q ${rightWristX - 45},170 ${rightWristX - 60 - rightReach * 0.7},${185 + (1 - p) * 10}`}
            fill="none"
            stroke="#a16207"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={rightWristX - 60 - rightReach * 0.7} cy={185 + (1 - p) * 10} r="2.5" fill="#84cc16" />

          {/* Groot Finger 2 (Index - Meeting point) */}
          <path
            d={`M ${rightWristX - 55},208 Q ${rightWristX - 90},208 ${rightWristX - 65 - rightReach * 1.05},${210 + (1 - p) * 6}`}
            fill="none"
            stroke="#854d0e"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle cx={rightWristX - 65 - rightReach * 1.05} cy={210 + (1 - p) * 6} r="3.5" fill="#22c55e" />

          {/* Groot Finger 3 (Middle) */}
          <path
            d={`M ${rightWristX - 60},218 Q ${rightWristX - 95},218 ${rightWristX - 68 - rightReach * 1.08},220`}
            fill="none"
            stroke="#713f12"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle cx={rightWristX - 68 - rightReach * 1.08} cy="220" r="3.5" fill="#84cc16" />

          {/* Groot Finger 4 (Ring) */}
          <path
            d={`M ${rightWristX - 58},228 Q ${rightWristX - 90},228 ${rightWristX - 63 - rightReach * 0.95},${228 - (1 - p) * 4}`}
            fill="none"
            stroke="#854d0e"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={rightWristX - 63 - rightReach * 0.95} cy={228 - (1 - p) * 4} r="2.5" fill="#10b981" />

          {/* Groot Finger 5 (Pinky) */}
          <path
            d={`M ${rightWristX - 45},238 Q ${rightWristX - 75},245 ${rightWristX - 50 - rightReach * 0.8},${242 - (1 - p) * 8}`}
            fill="none"
            stroke="#713f12"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={rightWristX - 50 - rightReach * 0.8} cy={242 - (1 - p) * 8} r="2" fill="#22c55e" />

          {/* Sprouting Young Leaf on Index Finger when touching */}
          {p > 0.6 && (
            <ellipse
              cx={rightWristX - 60 - rightReach * 0.7}
              cy={180 + (1 - p) * 10}
              rx={4 + p * 4}
              ry={2.5 + p * 2}
              fill="#4ade80"
              transform={`rotate(-40 ${rightWristX - 60 - rightReach * 0.7} ${180 + (1 - p) * 10})`}
            />
          )}
        </g>

        {/* ======================================================== */}
        {/* CENTER: BIO-DIGITAL CONVERGENCE ENERGY TOUCH             */}
        {/* ======================================================== */}
        {p > 0.75 && (
          <g id="convergence-energy" filter="url(#superGlow)">
            {/* Contact Shockwave Circle */}
            <circle
              cx={contactX}
              cy={contactY}
              r={(p - 0.75) * 120}
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              opacity={Math.sin((p - 0.75) * 4 * Math.PI * 0.5)}
            />

            {/* Glowing Core Orb at Fingertips */}
            <circle
              cx={contactX}
              cy={contactY}
              r={4 + (p - 0.75) * 24}
              fill="url(#energyBurstGrad)"
              opacity={p}
            />

            {/* Micro Energy Arcs */}
            <line
              x1={contactX - 15}
              y1={contactY - 10}
              x2={contactX + 15}
              y2={contactY + 10}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <line
              x1={contactX - 12}
              y1={contactY + 12}
              x2={contactX + 12}
              y2={contactY - 12}
              stroke="#67e8f9"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>

      {/* Clean Bottom Overlay Label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="glass-panel px-4 py-1.5 rounded-full border border-emerald-500/20 text-xs font-mono-code text-slate-300 flex items-center gap-2 shadow-lg backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full ${p >= 0.9 ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
          <span>
            {p >= 0.95
              ? '✨ BIO-DIGITAL HARMONY ACHIEVED (100%)'
              : `SCROLL OR DRAG TO CONVERGE (${Math.round(p * 100)}%)`}
          </span>
        </div>
      </div>
    </div>
  );
};
