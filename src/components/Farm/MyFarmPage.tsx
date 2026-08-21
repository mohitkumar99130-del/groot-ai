import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  Search, 
  Navigation, 
  MapPin
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
  layerMode?: LayerMode;
  onLayerModeChange?: (mode: LayerMode) => void;
  variety?: CropVariety;
  language: AppLanguage;
}

export const MyFarmPage: React.FC<MyFarmPageProps> = ({
  currentPlot,
  zones,
  selectedZone,
  onSelectZone,
  language,
}) => {
  const [mapType, setMapType] = useState<'satellite' | 'hybrid'>('satellite');
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isDrawingField, setIsDrawingField] = useState(false);
  const [activeFieldId, setActiveFieldId] = useState<string>(currentPlot.fields?.[0]?.id || 'field_north_wheat');

  const isHi = language === 'hi';

  const handleUseCurrentLocation = () => {
    audio.playClick();
    setIsLocating(true);
    setLocationStatus('GPS से आपका स्थान खोजा जा रहा है...');

    if (!navigator.geolocation) {
      setLocationStatus('आपके ब्राउज़र में GPS उपलब्ध नहीं है। कृपया नीचे अपना गाँव खोजें।');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setLocationStatus(`स्थान मिल गया: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
        audio.playPulse();
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setLocationStatus('स्थान अनुमति नहीं मिली। कोई बात नहीं! आप नीचे अपने गाँव का नाम खोज सकते हैं।');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocationQuery.trim()) return;
    audio.playClick();
    setLocationStatus(`नक्शा "${searchLocationQuery.trim()}" पर केंद्रित किया गया।`);
    setSearchLocationQuery('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-[1400px] mx-auto">
      
      {/* 1. Header & Location Search (Visual First, No Coordinates Form) */}
      <div className="groot-card p-5 sm:p-6 bg-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#1B2520] flex items-center gap-2">
              <span>🗺️ {isHi ? 'आपका खेत कहाँ है?' : 'Where is your farm?'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#66756D]">
              📍 {currentPlot.name} • {currentPlot.locationName}
            </p>
          </div>

          {/* Quick Actions: Use My Location & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="groot-btn-primary px-4 py-2.5 text-xs font-bold"
            >
              <Navigation className={`w-4 h-4 mr-2 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : (isHi ? '📍 वर्तमान स्थान लें' : '📍 Use My Location')}</span>
            </button>

            <form onSubmit={handleSearchLocation} className="flex items-center">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#66756D] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder={isHi ? 'गाँव, शहर या जगह खोजें...' : 'Search village, city or place...'}
                  value={searchLocationQuery}
                  onChange={(e) => setSearchLocationQuery(e.target.value)}
                  className="bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1B2520] placeholder-[#66756D] focus:outline-none focus:border-[#1F6B45] min-w-[200px] sm:min-w-[260px] min-h-[44px]"
                />
              </div>
            </form>
          </div>

        </div>

        {locationStatus && (
          <div className="p-3 rounded-xl bg-[#EDF4EC] border border-[#DDE6DD] text-xs text-[#1F6B45] font-medium flex items-center justify-between">
            <span>ℹ️ {locationStatus}</span>
            <button onClick={() => setLocationStatus(null)} className="text-[#66756D] font-bold">×</button>
          </div>
        )}
      </div>

      {/* 2. Interactive Satellite Map Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Large Satellite Map */}
        <div className="lg:col-span-8 space-y-4">
          <div className="groot-card p-4 sm:p-5 bg-white space-y-4 relative overflow-hidden">
            
            {/* Map Mode Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#DDE6DD]">
              
              <div className="flex items-center gap-1.5 p-1 bg-[#F6F8F2] rounded-xl border border-[#DDE6DD]">
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mapType === 'satellite' ? 'bg-[#1F6B45] text-white shadow-sm' : 'text-[#66756D] hover:text-[#1B2520]'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  <span>Satellite</span>
                </button>
                <button
                  onClick={() => setMapType('hybrid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mapType === 'hybrid' ? 'bg-[#1F6B45] text-white shadow-sm' : 'text-[#66756D] hover:text-[#1B2520]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Hybrid</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audio.playClick();
                    setIsDrawingField(!isDrawingField);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    isDrawingField
                      ? 'bg-[#F2B84B] text-[#1B2520] border-[#F2B84B]'
                      : 'bg-[#EDF4EC] text-[#1F6B45] border-[#DDE6DD]'
                  }`}
                >
                  {isDrawingField ? '✏️ Drawing Active' : '✏️ Mark My Field'}
                </button>
              </div>

            </div>

            {/* Instruction Banner */}
            <div className="p-3 rounded-xl bg-[#EDF4EC] text-xs text-[#1F6B45] font-semibold flex items-center justify-between">
              <span>👉 {isHi ? 'मैप को मूव करके अपने खेत पर पिन रखें।' : 'Move the map to place the pin on your field.'}</span>
              <button
                onClick={() => {
                  audio.playClick();
                  setLocationStatus('✅ आपका खेत सफलतापूर्वक सहेज लिया गया है!');
                }}
                className="groot-btn-primary px-3 py-1.5 text-xs font-bold"
              >
                📍 {isHi ? 'यह मेरा खेत है' : 'This Is My Farm'}
              </button>
            </div>

            {/* Satellite Map Frame */}
            <div className="relative h-96 sm:h-[460px] w-full rounded-xl overflow-hidden border border-[#DDE6DD] shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80"
                alt="Farm Satellite View"
                className="w-full h-full object-cover"
              />

              {/* 5x5 Agricultural Grid Boundary Overlay */}
              <div className="absolute inset-6 sm:inset-10 grid grid-cols-5 grid-rows-5 gap-1.5 p-2 bg-black/20 backdrop-blur-[1px] rounded-2xl border-2 border-[#F2B84B]">
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
                      className={`relative rounded-lg p-1 transition-all flex flex-col items-center justify-center ${
                        isHot
                          ? 'bg-[#B94742]/40 border-2 border-[#B94742]'
                          : zone.cropCondition === 'Healthy'
                          ? 'bg-[#1F6B45]/25 border border-[#1F6B45]/50 hover:bg-[#1F6B45]/40'
                          : 'bg-[#C57A10]/30 border border-[#C57A10]/50'
                      } ${isSelected ? 'ring-4 ring-[#F2B84B] scale-105 z-10 shadow-lg' : ''}`}
                    >
                      <span className="text-[10px] font-bold text-white drop-shadow">
                        {zone.id.replace('Zone ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Pin Center Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                <MapPin className="w-8 h-8 text-[#B94742] drop-shadow-lg animate-bounce" />
              </div>

            </div>

          </div>
        </div>

        {/* Right 4 Cols: Selected Field Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="groot-card p-5 bg-white space-y-4">
            <h3 className="text-base font-bold text-[#1B2520] pb-2 border-b border-[#DDE6DD]">
              {isHi ? 'खेत के भाग व विवरण' : 'Farm Fields & Details'}
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
                    className={`w-full p-3.5 rounded-xl text-left border transition-all space-y-1 ${
                      isActive
                        ? 'bg-[#EDF4EC] border-[#1F6B45] shadow-sm'
                        : 'bg-[#F6F8F2] border-[#DDE6DD] hover:border-[#66756D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1B2520]">{field.name}</span>
                      <span className="text-xs font-bold text-[#1F6B45]">
                        {field.areaAcres} Acres
                      </span>
                    </div>
                    <div className="text-xs text-[#66756D]">
                      {field.cropName} • {field.varietyName}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] text-xs text-[#66756D] space-y-1">
              <div className="font-bold text-[#1B2520]">📍 Farm Location:</div>
              <div>{currentPlot.locationName}</div>
              <div>Total Land: {currentPlot.areaHa ? `${Math.round(currentPlot.areaHa * 2.47)} Acres` : '2.3 Acres'}</div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
