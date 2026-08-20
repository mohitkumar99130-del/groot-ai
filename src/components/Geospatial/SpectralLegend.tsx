import React from 'react';
import { LayerMode } from '../../types/groot';
import { Layers, Info } from 'lucide-react';

interface SpectralLegendProps {
  layerMode: LayerMode;
}

export const SpectralLegend: React.FC<SpectralLegendProps> = ({ layerMode }) => {
  return (
    <div className="agri-card-subtle p-3 rounded-xl border border-emerald-500/20 text-xs font-mono">
      <div className="flex items-center justify-between gap-2 mb-2 text-slate-300">
        <div className="flex items-center gap-1.5 font-bold">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {layerMode === 'hazard' && 'AI Multimodal Hazard Scale'}
            {layerMode === 'ndvi' && 'NDVI Canopy Vigor Scale'}
            {layerMode === 'ndmi' && 'NDMI Moisture Index Scale'}
            {layerMode === 'thermal' && 'Thermal Surface Temp (°C)'}
            {layerMode === 'rgb' && 'Sentinel-2 True Color RGB'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {layerMode === 'hazard' && 'Risk Score (0 - 100%)'}
          {layerMode === 'ndvi' && 'Range: 0.0 → 1.0'}
          {layerMode === 'ndmi' && 'Range: -0.2 → +0.6'}
          {layerMode === 'thermal' && 'Range: 20°C → 38°C'}
          {layerMode === 'rgb' && 'Optical 10m Bands 4-3-2'}
        </span>
      </div>

      {/* Color Ramp Bar */}
      {layerMode === 'hazard' && (
        <div className="space-y-1">
          <div className="h-2 rounded-full w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-600" />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="text-emerald-400">0% (Healthy)</span>
            <span className="text-amber-400">50% (Moderate Risk)</span>
            <span className="text-rose-400">100% (Critical Outbreak)</span>
          </div>
        </div>
      )}

      {layerMode === 'ndvi' && (
        <div className="space-y-1">
          <div className="h-2 rounded-full w-full bg-gradient-to-r from-amber-700 via-yellow-400 via-lime-400 to-emerald-600" />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="text-amber-400">&lt; 0.35 (Bare/Sparse)</span>
            <span className="text-lime-300">0.60 (Medium Canopy)</span>
            <span className="text-emerald-400">&gt; 0.80 (Vigorous Paddy)</span>
          </div>
        </div>
      )}

      {layerMode === 'ndmi' && (
        <div className="space-y-1">
          <div className="h-2 rounded-full w-full bg-gradient-to-r from-rose-700 via-amber-400 via-teal-400 to-cyan-500" />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="text-rose-400">-0.2 (Severe Drought)</span>
            <span className="text-teal-300">+0.2 (Adequate Moisture)</span>
            <span className="text-cyan-400">+0.5 (Waterlogged)</span>
          </div>
        </div>
      )}

      {layerMode === 'thermal' && (
        <div className="space-y-1">
          <div className="h-2 rounded-full w-full bg-gradient-to-r from-blue-500 via-yellow-400 to-rose-600" />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="text-blue-400">22°C (Cooled/Transpiring)</span>
            <span className="text-yellow-400">28°C (Normal)</span>
            <span className="text-rose-400">36°C (Thermal Stress)</span>
          </div>
        </div>
      )}

      {layerMode === 'rgb' && (
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>True Color RGB composite from Sentinel-2 MSI instrument (10-meter spatial resolution).</span>
        </div>
      )}
    </div>
  );
};
