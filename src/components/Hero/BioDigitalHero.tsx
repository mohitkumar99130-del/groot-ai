import React from 'react';
import { NanoSporeParticles } from './NanoSporeParticles';
import { HandCanvas } from './HandCanvas';
import { ConvergenceSlider } from './ConvergenceSlider';
import { Satellite, Cpu, Sprout, ShieldCheck } from 'lucide-react';

interface BioDigitalHeroProps {
  progress: number;
  onProgressChange: (val: number) => void;
  isPlayingDemo: boolean;
  onToggleDemo: () => void;
  onScrollToDashboard: () => void;
}

export const BioDigitalHero: React.FC<BioDigitalHeroProps> = ({
  progress,
  onProgressChange,
  isPlayingDemo,
  onToggleDemo,
  onScrollToDashboard,
}) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-12 pb-8 overflow-hidden bg-[#020b06]">
      {/* Background Soft Nano Spores */}
      <NanoSporeParticles intensity={0.8} />

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Hero Brand & Title */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center space-y-3">
        <div className="inline-flex items-center gap-2 glass-panel px-3.5 py-1 rounded-full border border-emerald-400/25 text-emerald-300 text-xs font-mono-code shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>HARA BHARA PLANET • SIH PRECISION AGRI</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white">
          <span className="text-emerald-400">GROOT</span>
          <span className="text-slate-300 font-light ml-3">AI</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-300 font-normal leading-relaxed">
          Geospatial Remote-sensing & On-field Observation Technology.
          Fusing satellite multispectral telemetry with live soil IoT sensors for proactive crop health defense.
        </p>

        {/* Minimal Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="glass-panel px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-800 flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" /> Sentinel-2 Spectral
          </span>
          <span className="glass-panel px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-800 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" /> ESP32 Soil Mesh
          </span>
          <span className="glass-panel px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-800 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" /> CNN Leaf Diagnostics
          </span>
          <span className="glass-panel px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" /> Tri-Modal Fusion
          </span>
        </div>
      </div>

      {/* Center Articulated Hand Kinematics */}
      <div className="relative z-20 my-3 px-4">
        <HandCanvas progress={progress} onConnected={() => {}} />
      </div>

      {/* Bottom Minimal Slider Controls */}
      <div className="relative z-20">
        <ConvergenceSlider
          progress={progress}
          onChange={onProgressChange}
          isPlayingDemo={isPlayingDemo}
          onToggleDemo={onToggleDemo}
          onScrollToDashboard={onScrollToDashboard}
        />
      </div>
    </section>
  );
};
