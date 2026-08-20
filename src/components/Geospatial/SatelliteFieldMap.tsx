import React, { useState } from 'react';
import { FieldZone, LayerMode, AppLanguage } from '../../types/groot';
import { 
  Satellite, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Sliders, 
  Sparkles,
  MapPin,
  Crosshair,
  Droplets,
  SunMedium
} from 'lucide-react';
import { audio } from '../../services/audioService';


interface SatelliteFieldMapProps {
  zones: FieldZone[];
  selectedZone: FieldZone;
  onSelectZone: (zone: FieldZone) => void;
  layerMode: LayerMode;
  onLayerModeChange: (mode: LayerMode) => void;
  language: AppLanguage;
}

export const SatelliteFieldMap: React.FC<SatelliteFieldMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  layerMode,
  onLayerModeChange,
  language,
}) => {
  const [opacity, setOpacity] = useState<number>(90);
  const [showGridLabels, setShowGridLabels] = useState<boolean>(true);
  const [hoveredZone, setHoveredZone] = useState<FieldZone | null>(null);


  // Precise radiometric styling based on layer mode
  const getZoneFill = (zone: FieldZone) => {
    switch (layerMode) {
      case 'rgb':
        // Natural optical tones
        return zone.cropCondition === 'Healthy'
          ? 'rgba(16, 185, 129, 0.15)'
          : zone.cropCondition === 'Moderate Anomaly'
          ? 'rgba(245, 158, 11, 0.25)'
          : 'rgba(239, 68, 68, 0.35)';

      case 'ndvi':
        // Continuous NDVI green spectrum
        if (zone.ndvi > 0.82) return 'rgba(5, 150, 105, 0.65)';
        if (zone.ndvi > 0.70) return 'rgba(16, 185, 129, 0.55)';
        if (zone.ndvi > 0.55) return 'rgba(132, 204, 22, 0.50)';
        if (zone.ndvi > 0.40) return 'rgba(234, 179, 8, 0.55)';
        return 'rgba(220, 38, 38, 0.65)';

      case 'ndmi':
        // Moisture index
        if (zone.ndmi > 0.35) return 'rgba(6, 182, 212, 0.65)';
        if (zone.ndmi > 0.18) return 'rgba(20, 184, 166, 0.55)';
        if (zone.ndmi > 0.0) return 'rgba(245, 158, 11, 0.50)';
        return 'rgba(225, 29, 72, 0.65)';

      case 'thermal':
        // Surface temperature
        if (zone.surfaceTemp < 24.5) return 'rgba(59, 130, 246, 0.60)';
        if (zone.surfaceTemp < 27.0) return 'rgba(234, 179, 8, 0.55)';
        return 'rgba(239, 68, 68, 0.65)';

      case 'hazard':
      default:
        // Integrated AI Hazard Risk Composite
        if (zone.isHotspot) return 'rgba(220, 38, 38, 0.75)';
        if (zone.cropCondition === 'Healthy') return 'rgba(16, 185, 129, 0.30)';
        if (zone.cropCondition === 'Moderate Anomaly') return 'rgba(245, 158, 11, 0.45)';
        return 'rgba(239, 68, 68, 0.60)';
    }
  };

  const getBorderColor = (zone: FieldZone) => {
    if (selectedZone.id === zone.id) {
      return 'border-amber-300 ring-2 ring-amber-400 shadow-xl shadow-amber-500/30';
    }
    if (zone.isHotspot) {
      return 'border-rose-400/90 animate-pulse';
    }
    return 'border-emerald-500/25 hover:border-emerald-400';
  };

  const handleFocusHotspot = () => {
    audio.playPulse();
    const hotspot = zones.find((z) => z.isHotspot) || zones[13];
    onSelectZone(hotspot);
    onLayerModeChange('hazard');
  };

  return (
    <div className="agri-card p-4 sm:p-5 rounded-3xl border border-emerald-500/25 flex flex-col justify-between shadow-2xl relative overflow-hidden">
      
      {/* Map Control Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="font-display font-black text-base sm:text-lg text-white">
              {language === 'hi' ? 'भू-स्थानिक सैटेलाइट हीटमैप' : 'Sentinel-2 Multispectral Surface Map'}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              5×5 GRID • 25 HECTARES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Optical 10m Ground Resolution • Cloud Cover: 0.2% • L2A Bottom-of-Atmosphere
          </p>
        </div>

        {/* Action Controls: Hotspot Quick Focus + Opacity Slider + Grid Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Focus Hotspot Button */}
          <button
            onClick={handleFocusHotspot}
            className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Instantly jump to C4 critical pathogen hotspot"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span>{language === 'hi' ? 'हॉटस्पॉट C4 देखें' : 'Focus C4 Hotspot'}</span>
          </button>

          {/* Opacity Slider */}
          <div className="flex items-center gap-2 agri-card-subtle px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Opacity: <strong className="text-emerald-300">{opacity}%</strong></span>
            <input
              type="range"
              min="15"
              max="90"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-16 accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded"
            />
          </div>

          {/* Labels Toggle */}
          <button
            onClick={() => setShowGridLabels(!showGridLabels)}
            className="p-2 rounded-xl agri-card-subtle text-slate-300 hover:text-white transition-colors"
            title="Toggle Parcel ID Labels"
          >
            {showGridLabels ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Layer Mode Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 border-b border-emerald-500/15 mb-3 font-mono text-xs">
        <button
          onClick={() => {
            onLayerModeChange('hazard');
            audio.playClick();
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            layerMode === 'hazard'
              ? 'bg-rose-500/25 text-rose-200 border border-rose-500 shadow-md ring-1 ring-rose-400/40'
              : 'agri-card-subtle text-slate-300 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>AI Hazard Composite</span>
        </button>

        <button
          onClick={() => {
            onLayerModeChange('ndvi');
            audio.playClick();
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            layerMode === 'ndvi'
              ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500 shadow-md ring-1 ring-emerald-400/40'
              : 'agri-card-subtle text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>NDVI (Vegetation)</span>
        </button>

        <button
          onClick={() => {
            onLayerModeChange('ndmi');
            audio.playClick();
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            layerMode === 'ndmi'
              ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500 shadow-md ring-1 ring-cyan-400/40'
              : 'agri-card-subtle text-slate-300 hover:text-white'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span>NDMI (Moisture)</span>
        </button>

        <button
          onClick={() => {
            onLayerModeChange('thermal');
            audio.playClick();
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            layerMode === 'thermal'
              ? 'bg-amber-500/25 text-amber-200 border border-amber-500 shadow-md ring-1 ring-amber-400/40'
              : 'agri-card-subtle text-slate-300 hover:text-white'
          }`}
        >
          <SunMedium className="w-3.5 h-3.5 text-amber-400" />
          <span>Thermal IR</span>
        </button>

        <button
          onClick={() => {
            onLayerModeChange('rgb');
            audio.playClick();
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            layerMode === 'rgb'
              ? 'bg-teal-500/25 text-teal-200 border border-teal-500 shadow-md ring-1 ring-teal-400/40'
              : 'agri-card-subtle text-slate-300 hover:text-white'
          }`}
        >
          <Satellite className="w-3.5 h-3.5 text-teal-400" />
          <span>True Color RGB</span>
        </button>
      </div>

      {/* Interactive Map Viewport Canvas */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-inner select-none">
        {/* Real Aerial Satellite Field Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: "url('/assets/satellite_field.jpg'), url('/bg-farmer-field.jpg')",
            filter: 'brightness(0.85) contrast(1.1)',
          }}
        />

        {/* Topographic Radar Grid Overlay */}
        <div className="absolute inset-0 radar-grid opacity-35 pointer-events-none" />

        {/* 5x5 AOI Grid of Parcels */}
        <div className="absolute inset-0 p-3 sm:p-5 grid grid-cols-5 grid-rows-5 gap-1.5 sm:gap-2">
          {zones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            const isHotspot = zone.isHotspot;

            return (
              <div
                key={zone.id}
                onClick={() => {
                  onSelectZone(zone);
                  audio.playClick();
                }}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
                className={`relative rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-1 border ${getBorderColor(
                  zone
                )}`}
                style={{
                  backgroundColor: getZoneFill(zone),
                  opacity: opacity / 100 + (isSelected ? 0.3 : 0),
                  backdropFilter: 'blur(3px)',
                }}
              >
                {/* Hotspot Target Crosshair / Radar Pulse */}
                {isHotspot && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-6 h-6 rounded-full border-2 border-rose-400/80 animate-ping" />
                    <Crosshair className="w-4 h-4 text-white absolute" />
                  </div>
                )}

                {/* Selected Indicator Pin */}
                {isSelected && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] font-mono shadow-md z-10">
                    ACTIVE
                  </div>
                )}

                {/* Zone Label & Indices */}
                {showGridLabels && (
                  <div className="text-center font-mono z-10">
                    <span className={`text-[10px] sm:text-xs font-bold drop-shadow ${
                      isSelected ? 'text-white font-black' : isHotspot ? 'text-rose-200' : 'text-slate-100'
                    }`}>
                      {zone.id.replace('Zone ', '')}
                    </span>
                    <div className="text-[9px] text-slate-200/90 hidden sm:block">
                      {layerMode === 'ndvi' && zone.ndvi.toFixed(2)}
                      {layerMode === 'ndmi' && zone.ndmi.toFixed(2)}
                      {layerMode === 'thermal' && `${zone.surfaceTemp}°C`}
                      {layerMode === 'hazard' && (isHotspot ? 'RISK' : `${Math.round((1 - zone.ndvi) * 100)}%`)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Hover Tooltip Badge */}
        {hoveredZone && (
          <div className="absolute bottom-3 left-3 z-30 agri-card-elevated p-2.5 rounded-xl border border-emerald-400/40 text-xs font-mono shadow-2xl animate-in fade-in duration-150 pointer-events-none max-w-xs">
            <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-1 mb-1">
              <span className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {hoveredZone.id}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                hoveredZone.isHotspot ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {hoveredZone.cropCondition}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
              <div>NDVI: <strong className="text-emerald-300">{hoveredZone.ndvi.toFixed(2)}</strong></div>
              <div>NDMI: <strong className="text-cyan-300">{hoveredZone.ndmi.toFixed(2)}</strong></div>
              <div>Temp: <strong className="text-amber-300">{hoveredZone.surfaceTemp}°C</strong></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
