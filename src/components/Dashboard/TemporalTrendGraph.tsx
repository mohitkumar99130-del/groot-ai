import React, { useState } from 'react';
import { TemporalDataPoint } from '../../types/groot';
import { TrendingUp, Calendar } from 'lucide-react';
import { audio } from '../../services/audioService';

interface TemporalTrendGraphProps {
  data: TemporalDataPoint[];
  zoneId: string;
}

export const TemporalTrendGraph: React.FC<TemporalTrendGraphProps> = ({
  data,
  zoneId,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(7); // Default to 'Today'
  const activePoint = data[selectedIndex] || data[7];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/25 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-500/15">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              Temporal Trajectory & Trend Store
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                14-DAY HISTORICAL + FORECAST
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Tracking vegetation decline and forecasting recovery for <strong className="text-slate-200">{zoneId}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-code">
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Untreated Loss Curve
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Treated Recovery Curve
          </span>
        </div>
      </div>

      {/* SVG Interactive Multi-Line Curve Graph */}
      <div className="relative w-full h-[220px] bg-slate-950/70 rounded-xl p-4 border border-slate-800 overflow-hidden select-none">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none" />

        {/* SVG Chart */}
        <svg className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="riskGradientUntreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Draw Untreated Curve (Day 0 to Day +7) */}
          {(() => {
            const points = data.map((_, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - data[i].projectedUntreated; // svg coordinate
              return `${x}%,${y}%`;
            });
            const pathStr = `M ${points.join(' L ')}`;

            return (
              <path
                d={pathStr}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray={selectedIndex > 7 ? '4 3' : 'none'}
              />
            );
          })()}

          {/* Draw Treated Recovery Curve (Forecast for Future Days: index 7 to 10) */}
          {(() => {
            const points = data.slice(7).map((d, i) => {
              const globalIdx = 7 + i;
              const x = (globalIdx / (data.length - 1)) * 100;
              const y = 100 - d.projectedTreated;
              return `${x}%,${y}%`;
            });
            const pathStr = `M ${points.join(' L ')}`;

            return (
              <path
                d={pathStr}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="6 3"
              />
            );
          })()}

          {/* Data Points Interactive Nodes */}
          {data.map((d, i) => {
            const isSelected = selectedIndex === i;
            const xPercent = (i / (data.length - 1)) * 100;
            const yPercent = 100 - (i > 7 ? d.projectedTreated : d.riskScore);

            return (
              <g key={i}>
                <circle
                  cx={`${xPercent}%`}
                  cy={`${yPercent}%`}
                  r={isSelected ? 6 : 3.5}
                  className="cursor-pointer transition-all"
                  fill={i > 7 ? '#10b981' : d.riskScore > 60 ? '#ef4444' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2 : 1}
                  onClick={() => {
                    setSelectedIndex(i);
                    audio.playClick();
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Selected Scrubber Needle Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 shadow-[0_0_10px_#06b6d4] pointer-events-none transition-all duration-200"
          style={{
            left: `calc(${(selectedIndex / (data.length - 1)) * 100}% + 16px - ${(selectedIndex / (data.length - 1)) * 32}px)`,
          }}
        />
      </div>

      {/* Scrubber Day Pills Bar */}
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 text-center">
        {data.map((d, i) => {
          const isSelected = selectedIndex === i;
          return (
            <button
              key={i}
              onClick={() => {
                setSelectedIndex(i);
                audio.playClick();
              }}
              className={`py-1 px-1 rounded-lg text-[10px] font-mono-code transition-all border ${
                isSelected
                  ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 font-bold shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="font-bold">{d.day}</div>
              <div className="text-[9px] opacity-75">{d.date}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Scrubber Insight Strip */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">
            Timeline Point: <strong className="text-white">{activePoint.day} ({activePoint.date})</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <span>NDVI: <strong className="text-cyan-300">{activePoint.ndvi.toFixed(2)}</strong></span>
          <span>Moisture: <strong className="text-teal-300">{activePoint.soilMoisture}%</strong></span>
          <span>
            {selectedIndex > 7 ? 'Treated Target Risk: ' : 'Measured Risk: '}
            <strong className={activePoint.riskScore > 60 ? 'text-red-400' : 'text-emerald-400'}>
              {selectedIndex > 7 ? `${activePoint.projectedTreated}%` : `${activePoint.riskScore}%`}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
