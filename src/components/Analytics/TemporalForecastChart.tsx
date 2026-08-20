import React, { useState } from 'react';
import { TemporalDataPoint, AppLanguage } from '../../types/groot';
import { TrendingUp, Calendar } from 'lucide-react';
import { audio } from '../../services/audioService';


interface TemporalForecastChartProps {
  data: TemporalDataPoint[];
  zoneId: string;
  language: AppLanguage;
}

export const TemporalForecastChart: React.FC<TemporalForecastChartProps> = ({
  data,
  zoneId,
  language,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(7); // Default to 'Today' (index 7)
  const activePoint = data[selectedIndex] || data[7];

  return (
    <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/25 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-base sm:text-lg text-white flex items-center gap-2">
              {language === 'hi' ? '📈 14-दिवसीय फसल स्वास्थ्य व पूर्वानुमान' : '📈 Temporal Trajectory & 14-Day Yield Forecast'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                ZONE {zoneId}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Comparative Analysis: Untreated Pathological Loss vs Early AI Intervention Recovery.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm" /> Untreated Loss
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm" /> Treated Recovery
          </span>
        </div>
      </div>

      {/* SVG Interactive Multi-Line Curve Graph */}
      <div className="relative w-full h-[240px] bg-slate-950/80 rounded-2xl p-4 border border-slate-800 overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 radar-grid opacity-25 pointer-events-none" />

        {/* SVG Chart Elements */}
        <svg className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="riskGradientUntreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Draw Untreated Curve (Day 0 to Day +7) */}
          {(() => {
            const points = data.map((_, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - data[i].projectedUntreated;
              return `${x}%,${y}%`;
            });
            const pathStr = `M ${points.join(' L ')}`;

            return (
              <path
                d={pathStr}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray={selectedIndex > 7 ? '5 4' : 'none'}
              />
            );
          })()}

          {/* Draw Treated Recovery Curve (Forecast for Future Days: index 7 to end) */}
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
                  r={isSelected ? 7 : 4}
                  className="cursor-pointer transition-all duration-150"
                  fill={i > 7 ? '#10b981' : d.riskScore > 60 ? '#ef4444' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2.5 : 1}
                  onClick={() => {
                    setSelectedIndex(i);
                    audio.playClick();
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Selected Needle Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 shadow-[0_0_12px_#06b6d4] pointer-events-none transition-all duration-150"
          style={{
            left: `calc(${(selectedIndex / (data.length - 1)) * 100}% + 16px - ${(selectedIndex / (data.length - 1)) * 32}px)`,
          }}
        />
      </div>

      {/* Scrubber Day Pills Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-11 gap-1.5 text-center">
        {data.map((d, i) => {
          const isSelected = selectedIndex === i;
          return (
            <button
              key={i}
              onClick={() => {
                setSelectedIndex(i);
                audio.playClick();
              }}
              className={`py-1.5 px-1 rounded-xl text-[10px] font-mono transition-all border ${
                isSelected
                  ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 font-bold shadow-lg ring-1 ring-cyan-400'
                  : 'agri-card-subtle text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <div className="font-bold">{d.day}</div>
              <div className="text-[9px] opacity-75">{d.date}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Scrubber Insight Strip */}
      <div className="agri-card p-4 rounded-2xl border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">
            Selected Timeline: <strong className="text-white">{activePoint.day} ({activePoint.date})</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div>NDVI: <strong className="text-emerald-300">{activePoint.ndvi.toFixed(2)}</strong></div>
          <div>Soil Moisture: <strong className="text-cyan-300">{activePoint.soilMoisture}%</strong></div>
          <div>
            {selectedIndex > 7 ? 'Treated Target Risk: ' : 'Measured Risk: '}
            <strong className={activePoint.riskScore > 60 ? 'text-rose-400' : 'text-emerald-400'}>
              {selectedIndex > 7 ? `${activePoint.projectedTreated}%` : `${activePoint.riskScore}%`}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
