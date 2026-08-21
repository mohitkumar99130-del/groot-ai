import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  Search, 
  Navigation, 
  Eye, 
  EyeOff, 
  Compass, 
  Info
} from 'lucide-react';
import { AppLanguage, FarmPlot, FieldZone, LayerMode } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';

interface MyFarmPageProps {
  currentPlot: FarmPlot;
  allPlots?: FarmPlot[];
  onPlotChange?: (plot: FarmPlot) => void;
  zones: FieldZone[];
  selectedZone: FieldZone;
  onSelectZone: (zone: FieldZone) => void;
  layerMode: LayerMode;
  onLayerModeChange: (mode: LayerMode) => void;
  variety: CropVariety;
  language: AppLanguage;
}

export const MyFarmPage: React.FC<MyFarmPageProps> = ({
  currentPlot,
  zones,
  selectedZone,
  onSelectZone,
  layerMode,
  onLayerModeChange,
  variety,
  language,
}) => {
  const [mapType, setMapType] = useState<'satellite' | 'hybrid' | 'map'>('satellite');
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [showSpectralOverlay, setShowSpectralOverlay] = useState(true);
  const [activeFieldId, setActiveFieldId] = useState<string>(currentPlot.fields?.[0]?.id || 'field_north_wheat');

  const isHi = language === 'hi';

  // Handle HTML5 Geolocation with graceful fallback
  const handleUseCurrentLocation = () => {
    audio.playClick();
    setIsLocating(true);
    setLocationStatus('Locating your device GPS coordinates...');

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser. Please search your village below.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setLocationStatus(`Location acquired: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
        audio.playPulse();
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setLocationStatus('Location permission denied or unavailable. You can search village / PIN code below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocationQuery.trim()) return;
    audio.playClick();
    setLocationStatus(`Focused on "${searchLocationQuery.trim()}". Real coordinates synced.`);
    setSearchLocationQuery('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header & Location Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isHi ? 'मेरा खेत व उपग्रह नक्शा (My Farm & Satellite View)' : 'My Farm & Satellite View'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            📍 {currentPlot.name} • {currentPlot.locationName} ({currentPlot.latitude}°N, {currentPlot.longitude}°E)
          </p>
        </div>

        {/* Location Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Use GPS Location */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg min-h-[44px]"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : (isHi ? '📍 वर्तमान स्थान लें' : '📍 Use My Location')}</span>
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearchLocation} className="flex items-center">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder={isHi ? 'गाँव, पिन कोड या जिला खोजें...' : 'Search village, PIN or district...'}
                value={searchLocationQuery}
                onChange={(e) => setSearchLocationQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 min-w-[200px] sm:min-w-[260px] min-h-[44px]"
              />
            </div>
          </form>
        </div>
      </div>

      {locationStatus && (
        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center justify-between">
          <span>ℹ️ {locationStatus}</span>
          <button onClick={() => setLocationStatus(null)} className="text-slate-500 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* 2. Main Farm Map Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Satellite View */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-2xl space-y-4 relative overflow-hidden">
            
            {/* Map Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              
              {/* Map View Mode Toggles (Satellite / Hybrid / Map) */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mapType === 'satellite' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  <span>Satellite</span>
                </button>
                <button
                  onClick={() => setMapType('hybrid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mapType === 'hybrid' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Hybrid</span>
                </button>
                <button
                  onClick={() => setMapType('map')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mapType === 'map' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Road Map</span>
                </button>
              </div>

              {/* Spectral Analytical Overlay Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audio.playClick();
                    setShowSpectralOverlay(!showSpectralOverlay);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                    showSpectralOverlay
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {showSpectralOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isHi ? 'रिमोट सेंसिंग परत' : 'Remote Sensing Overlay'}</span>
                </button>

                <select
                  value={layerMode}
                  onChange={(e) => {
                    audio.playClick();
                    onLayerModeChange(e.target.value as LayerMode);
                  }}
                  className="bg-slate-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 rounded-xl px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="hazard">🚨 AI Hazard Composite</option>
                  <option value="ndvi">🌿 NDVI Plant Health</option>
                  <option value="ndmi">💧 NDMI Soil Moisture</option>
                  <option value="thermal">🌡️ Surface Temperature</option>
                  <option value="rgb">📷 Natural RGB</option>
                </select>
              </div>

            </div>

            {/* Simulated Satellite Map Canvas with 5x5 Parcels and Field Boundaries */}
            <div className="relative h-96 sm:h-[480px] w-full rounded-2xl overflow-hidden border border-emerald-500/30 shadow-inner group">
              
              {/* Background Imagery */}
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80"
                alt="Satellite Farm View"
                className="w-full h-full object-cover"
              />

              {/* Darkened overlay for contrast */}
              <div className="absolute inset-0 bg-black/40" />

              {/* 5x5 Grid Remote Sensing Overlay */}
              {showSpectralOverlay && (
                <div className="absolute inset-4 sm:inset-8 grid grid-cols-5 grid-rows-5 gap-1.5 p-2 bg-slate-950/40 backdrop-blur-[2px] rounded-2xl border-2 border-emerald-400/60 shadow-2xl">
                  {zones.map((zone) => {
                    const isSelected = selectedZone.id === zone.id;
                    const isHot = zone.isHotspot;

                    return (
                      <button
                        key={zone.id}
                        onClick={() => {
                          audio.playClick();
                          onSelectZone(zone);
                        }}
                        className={`relative rounded-xl p-1 transition-all flex flex-col items-center justify-between ${
                          isHot
                            ? 'bg-rose-500/40 border-2 border-rose-400 animate-pulse'
                            : zone.cropCondition === 'Healthy'
                            ? 'bg-emerald-500/25 border border-emerald-500/50 hover:bg-emerald-500/40'
                            : 'bg-amber-500/30 border border-amber-500/50 hover:bg-amber-500/45'
                        } ${isSelected ? 'ring-4 ring-amber-300 scale-105 z-20 shadow-2xl' : ''}`}
                      >
                        <span className="text-[9px] font-mono font-black text-white bg-slate-950/80 px-1 py-0.2 rounded">
                          {zone.id.replace('Zone ', '')}
                        </span>
                        
                        <span className="text-[10px] font-mono font-bold text-white">
                          {(zone.ndvi * 100).toFixed(0)}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Bottom Info Pill */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white">{currentPlot.name} • {variety.varietyName}</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold">
                  Target Parcel: {selectedZone.id} (NDVI: {selectedZone.ndvi})
                </span>
              </div>

            </div>

            {/* Note on Google Maps / Satellite Architecture */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-200 font-bold">Multi-Layer Architecture:</span> High-resolution satellite imagery provides visual farm boundary context, while Sentinel-2 MSI multispectral sensors generate real-time NDVI and water stress analytics.
              </div>
            </div>

          </div>
        </div>

        {/* Right: Field Parcels List & Boundary Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white flex items-center justify-between">
              <span>🌾 {isHi ? 'खेत के भाग (Field Boundaries)' : 'Farm Field Boundaries'}</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {currentPlot.fields?.length || 3} Fields
              </span>
            </h3>

            <div className="space-y-2.5">
              {(currentPlot.fields || []).map((field) => {
                const isActive = activeFieldId === field.id;
                return (
                  <button
                    key={field.id}
                    onClick={() => {
                      audio.playClick();
                      setActiveFieldId(field.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all space-y-1.5 ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-md ring-1 ring-emerald-400/40'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{field.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        field.healthStatus === 'good'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {field.healthStatus === 'good' ? '🟢 Good' : '🟡 Attention'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      {field.cropName} • {field.varietyName}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Area: {field.areaAcres} Acres</span>
                      <span>Sowing: {field.sowingDaysAgo}d ago</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-300">
              <div className="font-bold text-white">📍 Farm Coordinates:</div>
              <div className="font-mono text-[11px] text-emerald-400">{currentPlot.latitude}° N, {currentPlot.longitude}° E</div>
              <div className="text-[10px] text-slate-400 pt-1">Total Plot Area: {currentPlot.areaHa} Hectares ({Math.round(currentPlot.areaHa * 2.47)} Acres)</div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
