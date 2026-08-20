import React from 'react';
import { 
  Camera, 
  Sliders, 
  Volume2, 
  Satellite, 
  Cpu, 
  Sparkles
} from 'lucide-react';
import { audio } from '../../services/audioService';

interface AgriHeroProps {
  onOpenCamScanner: () => void;
  onOpenSensorSim: () => void;
  onOpenVoiceModal: () => void;
  onScrollToDashboard: () => void;
}

export const AgriHero: React.FC<AgriHeroProps> = ({
  onOpenCamScanner,
  onOpenSensorSim,
  onOpenVoiceModal,
}) => {
  return (
    <section className="relative py-8 lg:py-12 overflow-hidden bg-slate-950/40 backdrop-blur-md border-b border-amber-500/25">
      {/* Soft Sunlit Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-gradient-to-r from-amber-500/20 via-emerald-500/25 to-teal-500/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Sleek Header Title & Description */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 glass-panel-sunlit px-4 py-1.5 rounded-full text-amber-300 text-xs font-mono-code shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-extrabold tracking-wide">GROOT • HARA BHARA PLANET PRECISION AGRI-AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-400 to-teal-300 text-glow-gold">
              GROOT AI
            </span>
            <span className="text-slate-100 font-light ml-2">Agronomy Platform</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
            Satellite remote sensing, IoT soil mesh telemetry, and Edge Gemini AI crop diagnostics fused into a simple, voice-guided experience for every farmer.
          </p>

          {/* Quick Technology Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono-code text-slate-100">
            <span className="px-3 py-1 rounded-full glass-panel border border-slate-700/80 flex items-center gap-1.5 shadow-sm">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" /> Sentinel-2
            </span>
            <span className="px-3 py-1 rounded-full glass-panel border border-slate-700/80 flex items-center gap-1.5 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-amber-400" /> ESP32 Mesh
            </span>
            <span className="px-3 py-1 rounded-full glass-panel border border-slate-700/80 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Gemini Vision AI
            </span>
          </div>

        </div>

        {/* High-Impact Action Bar (3 Tactile Custom Buttons Optimized for Mobile) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto pt-2">
          <button
            onClick={() => {
              audio.playClick();
              onOpenCamScanner();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold btn-groot-primary flex items-center justify-center gap-2 shadow-xl"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span>📸 Crop Camera Scan</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onOpenVoiceModal();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold btn-groot-voice flex items-center justify-center gap-2 shadow-xl"
          >
            <Volume2 className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>📢 Hindi Voice Advice</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onOpenSensorSim();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold btn-groot-secondary flex items-center justify-center gap-2 shadow-xl"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>🎛️ Sensor Simulator</span>
          </button>
        </div>

      </div>
    </section>
  );
};
