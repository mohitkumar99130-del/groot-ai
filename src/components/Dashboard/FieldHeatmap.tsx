import React, { useState } from 'react';
import { FieldZone, LayerMode } from '../../types/groot';
import { Satellite, Layers, AlertTriangle, Eye, MapPin, Sliders } from 'lucide-react';
import { audio } from '../../services/audioService';

interface FieldHeatmapProps {
  zones: FieldZone[];
  selectedZone: FieldZone;
  onSelectZone: (zone: FieldZone) => void;
  layerMode: LayerMode;
  onLayerModeChange: (mode: LayerMode) => void;
}

export const FieldHeatmap: React.FC<FieldHeatmapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  layerMode,
  onLayerModeChange,
}) => {
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(35); // Default transparent heat map

  // Helper to color code zones with translucent high-clarity heat map styles
  const getZoneColor = (zone: FieldZone) => {
    switch (layerMode) {
      case 'rgb':
        // Transparent RGB satellite vegetation tones
        return zone.cropCondition === 'Healthy'
          ? 'bg-emerald-600/30 hover:bg-emerald-500/45 border-emerald-400/40 text-emerald-100'
          : zone.cropCondition === 'Moderate Anomaly'
          ? 'bg-amber-600/35 hover:bg-amber-500/50 border-amber-400/50 text-amber-100'
          : 'bg-red-600/40 hover:bg-red-500/55 border-red-400/60 text-red-100';

      case 'ndvi':
        // Translucent NDVI green spectrum
        if (zone.ndvi > 0.8) return 'bg-emerald-500/30 hover:bg-emerald-400/45 text-emerald-200 border-emerald-400/50';
        if (zone.ndvi > 0.65) return 'bg-lime-500/30 hover:bg-lime-400/45 text-lime-200 border-lime-400/50';
        if (zone.ndvi > 0.45) return 'bg-amber-500/35 hover:bg-amber-400/50 text-amber-200 border-amber-400/50';
        return 'bg-red-600/40 hover:bg-red-500/55 text-white border-red-400/60';

      case 'ndmi':
        // Moisture index (translucent cyan to brown)
        if (zone.ndmi > 0.35) return 'bg-cyan-500/30 hover:bg-cyan-400/45 text-cyan-200 border-cyan-400/50';
        if (zone.ndmi > 0.15) return 'bg-teal-500/30 hover:bg-teal-400/45 text-teal-200 border-teal-400/50';
        if (zone.ndmi > 0.0) return 'bg-amber-500/35 hover:bg-amber-400/50 text-amber-200 border-amber-400/50';
        return 'bg-rose-600/40 hover:bg-rose-500/55 text-white border-rose-400/60';

      case 'thermal':
        // Thermal IR surface temperature
        if (zone.surfaceTemp < 25) return 'bg-blue-500/30 hover:bg-blue-400/45 text-blue-200 border-blue-400/50';
        if (zone.surfaceTemp < 28) return 'bg-yellow-500/30 hover:bg-yellow-400/45 text-yellow-200 border-yellow-400/50';
        return 'bg-red-600/40 hover:bg-red-500/55 text-white border-red-400/60';

      case 'hazard':
      default:
        // Translucent Integrated Hazard Risk
        if (zone.isHotspot) return 'bg-red-600/45 hover:bg-red-500/60 text-white border-red-400 shadow-lg shadow-red-500/30 animate-pulse';
        if (zone.cropCondition === 'Healthy') return 'bg-emerald-500/25 hover:bg-emerald-400/40 text-emerald-100 border-emerald-400/40';
        if (zone.cropCondition === 'Moderate Anomaly') return 'bg-amber-500/30 hover:bg-amber-400/45 text-amber-100 border-amber-400/50';
        return 'bg-red-600/35 hover:bg-red-500/50 text-white border-red-400/50';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col justify-between shadow-2xl relative overflow-hidden">
      {/* Header with Title, Transparency Slider, and Layer Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="font-display font-bold text-base text-white">
              Geospatial Multispectral Heatmap
            </h3>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              5×5 AOI GRID (25 HECTARES)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Plot: <span className="text-slate-200 font-semibold">Paddy Field #04 (Kharif Season)</span> • High-Res Aerial Survey
          </p>
        </div>

        {/* Controls: Heatmap Transparency Slider & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Transparency Slider Control */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono-code text-slate-300 whitespace-nowrap">
              Opacity: <strong className="text-cyan-300">{heatmapOpacity}%</strong>
            </span>
            <input
              type="range"
              min="10"
              max="90"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
              className="w-20 accent-emerald-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
              title="Adjust Heatmap Transparency"
            />
          </div>

          {/* Layer Mode Switcher Buttons */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => {
                onLayerModeChange('hazard');
                audio.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                layerMode === 'hazard'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Hazard
            </button>
            <button
              onClick={() => {
                onLayerModeChange('ndvi');
                audio.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                layerMode === 'ndvi'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              NDVI
            </button>
            <button
              onClick={() => {
                onLayerModeChange('ndmi');
                audio.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                layerMode === 'ndmi'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              NDMI
            </button>
            <button
              onClick={() => {
                onLayerModeChange('rgb');
                audio.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                layerMode === 'rgb'
                  ? 'bg-slate-700/50 text-slate-200 border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" />
              Satellite RGB
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View Container */}
      <div className="relative w-full aspect-[4/3] max-h-[400px] rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl bg-black">
        {/* User Aerial Field Map Background */}
        <img
          src="/assets/satellite_field.jpg"
          alt="Aerial Crop Field Grid Map"
          className="absolute inset-0 w-full h-full object-cover opacity-95 transition-opacity duration-300"
        />

        {/* Subtle Cyber Grid Coordinates */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* 5x5 Zone Heatmap Grid Container with Dynamic Opacity */}
        <div 
          className="absolute inset-0 p-3 grid grid-cols-5 grid-rows-5 gap-1.5 z-10 transition-opacity duration-150"
          style={{ opacity: heatmapOpacity / 100 }}
        >
          {zones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            const colorClasses = getZoneColor(zone);

            return (
              <button
                key={zone.id}
                onClick={() => {
                  onSelectZone(zone);
                  audio.playPulse();
                }}
                className={`relative rounded-xl p-2 flex flex-col justify-between items-start transition-all duration-200 text-left backdrop-blur-[1px] border ${colorClasses} ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black scale-[1.03] z-20 shadow-2xl neon-border-cyan'
                    : 'hover:scale-[1.02] hover:z-10'
                }`}
              >
                {/* Zone Label & Hotspot Indicator */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-[11px] font-extrabold font-mono-code tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {zone.id.replace('Zone ', '')}
                  </span>
                  {zone.isHotspot && (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </div>

                {/* Layer Metric Value */}
                <div className="w-full text-right mt-auto">
                  <span className="text-[11px] font-extrabold font-mono-code leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    {layerMode === 'ndvi' && zone.ndvi.toFixed(2)}
                    {layerMode === 'ndmi' && zone.ndmi.toFixed(2)}
                    {layerMode === 'thermal' && `${zone.surfaceTemp.toFixed(1)}°`}
                    {(layerMode === 'hazard' || layerMode === 'rgb') && (
                      zone.isHotspot ? 'ALERT' : `${Math.round(zone.ndvi * 100)}%`
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Target Reticle Indicator on Selected Zone */}
        <div className="absolute bottom-2 left-2 z-20 glass-panel px-3 py-1 rounded-lg text-[10px] font-mono-code text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-md">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>INSPECTING: <strong className="text-white">{selectedZone.id}</strong> ({selectedZone.cropCondition})</span>
        </div>
      </div>

      {/* Interactive Legend & Quick Metrics */}
      <div className="mt-4 pt-3 border-t border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        {/* Dynamic Legend */}
        <div className="flex items-center gap-3 font-mono-code text-[11px]">
          <span className="text-slate-400">Scale:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-500/60 border border-emerald-400 inline-block" />
            <span className="text-slate-300">Healthy (0.8+)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-500/60 border border-amber-400 inline-block" />
            <span className="text-slate-300">Stress (0.5–0.7)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-600/70 border border-red-400 inline-block" />
            <span className="text-slate-300">Risk (&lt;0.4)</span>
          </div>
        </div>

        {/* Selected Zone Quick Stats */}
        <div className="text-[11px] font-mono-code text-slate-300 flex items-center gap-3">
          <span>NDVI: <strong className="text-cyan-300">{selectedZone.ndvi}</strong></span>
          <span>NDMI: <strong className="text-teal-300">{selectedZone.ndmi}</strong></span>
          <span>Temp: <strong className="text-amber-300">{selectedZone.surfaceTemp}°C</strong></span>
        </div>
      </div>
    </div>
  );
};
