import React from 'react';
import { Volume2, VolumeX, Sparkles, Play, Pause, ChevronDown } from 'lucide-react';
import { audio } from '../../services/audioService';

interface ConvergenceSliderProps {
  progress: number;
  onChange: (val: number) => void;
  isPlayingDemo: boolean;
  onToggleDemo: () => void;
  onScrollToDashboard: () => void;
}

export const ConvergenceSlider: React.FC<ConvergenceSliderProps> = ({
  progress,
  onChange,
  isPlayingDemo,
  onToggleDemo,
  onScrollToDashboard,
}) => {
  const [isMuted, setIsMuted] = React.useState(audio.getMuted());

  const handleMuteToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  const handleQuickConnect = () => {
    audio.playPulse();
    onChange(1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Slider bar */}
          <div className="w-full sm:w-3/5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-300">
              <span className="text-cyan-300">AI Hand</span>
              <span className="font-semibold text-emerald-400">
                Convergence: {Math.round(progress * 100)}%
              </span>
              <span className="text-emerald-300">Groot Hand</span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={progress}
              onChange={(e) => {
                onChange(parseFloat(e.target.value));
                audio.playClick();
              }}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDemo}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                isPlayingDemo
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'glass-panel text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {isPlayingDemo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlayingDemo ? 'Pause' : 'Auto'}
            </button>

            <button
              onClick={handleQuickConnect}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Connect
            </button>

            <button
              onClick={handleMuteToggle}
              className="p-1.5 rounded-lg glass-panel text-slate-400 hover:text-emerald-400 border border-slate-800"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={onScrollToDashboard}
              className="px-3 py-1.5 rounded-lg text-xs font-medium glass-panel text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10 flex items-center gap-1"
            >
              Dashboard
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
