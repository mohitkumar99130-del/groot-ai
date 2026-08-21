import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Download, 
  RotateCcw, 
  Globe, 
  CloudSun, 
  Droplets, 
  Wind, 
  Sprout, 
  ChevronDown, 
  Menu, 
  RefreshCw 
} from 'lucide-react';

import { AppLanguage, UserUIMode, FarmPlot, RealtimeWeather, AppNavigationTab } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';

interface TopNavbarProps {
  activeTab: AppNavigationTab;
  currentPlot: FarmPlot;
  onPlotChange: (plot: FarmPlot) => void;
  selectedVariety?: CropVariety;
  onOpenCropSelector?: () => void;
  uiMode: UserUIMode;
  onUiModeChange: (mode: UserUIMode) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  isSpeaking: boolean;
  onToggleVoice: () => void;
  onOpenExportModal: () => void;
  onResetDemo: () => void;
  onOpenMobileMenu: () => void;
  weather: RealtimeWeather;
  onRefreshWeather: () => void;
  isWeatherLoading?: boolean;
}

export const DEMO_PLOTS: FarmPlot[] = [
  {
    id: 'plot_04',
    name: 'Paddy Field #04 (Kharif)',
    crop: 'Paddy / Rice (IR-64)',
    areaHa: 25.0,
    season: 'Kharif 2026',
    plantingDate: '12 July 2026',
    healthAverage: 74,
    latitude: 20.8942,
    longitude: 85.8315,
    locationName: 'Cuttack, Odisha',
  },
  {
    id: 'plot_08',
    name: 'North Terrace #08 (Basmati)',
    crop: 'Basmati Rice (Pusa 1121)',
    areaHa: 18.5,
    season: 'Kharif 2026',
    plantingDate: '28 July 2026',
    healthAverage: 88,
    latitude: 30.7333,
    longitude: 76.7794,
    locationName: 'Karnal, Haryana',
  },
  {
    id: 'plot_12',
    name: 'Canal Basin #12 (Wheat Prep)',
    crop: 'Wheat / Sharbati',
    areaHa: 32.0,
    season: 'Rabi Pre-Season',
    plantingDate: '15 Oct 2026',
    healthAverage: 92,
    latitude: 23.2599,
    longitude: 77.4126,
    locationName: 'Sehore, MP',
  },
];

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  currentPlot,
  onPlotChange,
  selectedVariety,
  onOpenCropSelector,
  uiMode,
  onUiModeChange,
  language,
  onLanguageChange,
  isSpeaking,
  onToggleVoice,
  onOpenExportModal,
  onResetDemo,
  onOpenMobileMenu,
  weather,
  onRefreshWeather,
  isWeatherLoading,
}) => {
  const [isMuted, setIsMuted] = React.useState(audio.getMuted());
  const [isPlotDropdownOpen, setIsPlotDropdownOpen] = React.useState(false);

  const handleMuteToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  const isFarmerMode = uiMode === 'farmer_easy';
  const isHi = language === 'hi';

  const getPageTitle = (tab: AppNavigationTab) => {
    switch (tab) {
      case 'dashboard':
        return isHi ? '🛰️ सैटेलाइट नक्शा' : '🛰️ Sentinel-2 Map';
      case 'camera_doctor':
        return isHi ? '📸 पत्ती रोग लैब' : '📸 Leaf Doctor';
      case 'fertilizer_doctor':
        return isHi ? '🧪 खाद व कीटनाशक' : '🧪 Fertilizer Rx';
      case 'temporal_analytics':
        return isHi ? '📈 14-दिवसीय ट्रेंड' : '📈 14-Day Trajectory';
      case 'sensor_simulator':
        return isHi ? '🎛️ IoT मिट्टी मेश' : '🎛️ IoT Soil Mesh';
      case 'voice_assistant':
        return isHi ? '🎙️ किसान आवाज़' : '🎙️ Kisan Voice';
      default:
        return 'GROOT AI';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-agri-950/95 backdrop-blur-xl border-b border-emerald-500/15">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2.5">
          
          {/* Left: Mobile Hamburger + Brand Logo + Page Title Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenMobileMenu();
              }}
              className="lg:hidden p-2 rounded-xl agri-card-subtle text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-400 transition-colors shadow-sm"
              title="Open Left Side Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo Monogram */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-slate-950 font-display font-black text-lg shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300/40">
                G
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
              </div>
              <div className="hidden sm:block font-display font-black text-base text-white tracking-tight">
                GROOT <span className="text-emerald-400 text-xs px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 font-mono">AI</span>
              </div>
            </div>

            {/* Active Page Indicator Pill */}
            <div className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <span>{getPageTitle(activeTab)}</span>
            </div>
          </div>

          {/* Center: Live Real-Time Open-Meteo Weather Badge (Desktop) */}
          <div className="hidden 2xl:flex items-center gap-3 px-3 py-1 rounded-xl agri-card-subtle text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1 text-amber-300 font-bold">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>{weather.temperature}°C {isHi ? weather.conditionHindi : weather.condition}</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1 text-cyan-300">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>{weather.humidity}% RH</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>{weather.windSpeed} km/h</span>
            </div>
            <button
              onClick={() => {
                audio.playPulse();
                onRefreshWeather();
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-all"
              title="Refresh Weather"
            >
              <RefreshCw className={`w-3 h-3 ${isWeatherLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {/* Right: Farm Plot Switcher + Crop Variety Button + Voice CTA + Quick Controls */}
          <div className="flex items-center gap-2">
            
            {/* Active Crop & Variety Picker Trigger Button */}
            {selectedVariety && onOpenCropSelector && (
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenCropSelector();
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 text-xs font-mono font-bold transition-all"
                title="Change Crop & Sub-Variety"
              >
                <span>{selectedVariety.iconEmoji}</span>
                <span className="max-w-[130px] truncate">{isHi ? selectedVariety.varietyHindi : selectedVariety.varietyName}</span>
              </button>
            )}

            {/* Active Farm Plot Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPlotDropdownOpen(!isPlotDropdownOpen)}
                className="agri-card-subtle px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-mono text-slate-200 hover:border-emerald-500/40 transition-colors max-w-[150px] sm:max-w-[200px]"
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-100 truncate text-[11px] sm:text-xs">
                  {currentPlot.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {isPlotDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-64 agri-card-elevated rounded-xl p-1.5 shadow-2xl z-50 border border-emerald-500/30 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Select Active Field Parcel
                  </div>
                  {DEMO_PLOTS.map((plot) => (
                    <button
                      key={plot.id}
                      onClick={() => {
                        onPlotChange(plot);
                        setIsPlotDropdownOpen(false);
                        audio.playClick();
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        plot.id === currentPlot.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-emerald-950/40 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{plot.name}</div>
                        <div className="text-[10px] text-slate-400">{plot.locationName} • {plot.areaHa} Ha</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 border border-emerald-500/30">
                        {plot.healthAverage}%
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Spoken Voice Broadcast CTA Button */}
            <button
              onClick={() => {
                audio.playClick();
                onToggleVoice();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
                isSpeaking
                  ? 'btn-agri-voice animate-pulse ring-2 ring-amber-400'
                  : 'btn-agri-voice'
              }`}
              title="Listen to Live Spoken Advisory"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span className="font-display hidden sm:inline">
                {isSpeaking ? (isHi ? 'बोल रहा है...' : 'Narrating...') : (isHi ? 'आवाज़ सलाह' : 'Voice')}
              </span>
            </button>

            {/* Desktop Only Quick Settings */}
            <div className="hidden md:flex items-center gap-1.5">
              {/* UI Mode */}
              <button
                onClick={() => {
                  audio.playClick();
                  onUiModeChange(isFarmerMode ? 'pro_agronomy' : 'farmer_easy');
                }}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                  isFarmerMode
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                }`}
                title="Toggle Farmer vs Pro Mode"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[10px]">
                  {isFarmerMode ? '🌾 Kisan' : '🔬 Pro'}
                </span>
              </button>

              {/* Language */}
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-emerald-400 absolute left-2 pointer-events-none" />
                <select
                  value={language}
                  onChange={(e) => {
                    onLanguageChange(e.target.value as AppLanguage);
                    audio.playClick();
                  }}
                  className="agri-card-subtle pl-6 pr-2 py-1.5 text-[11px] font-mono font-bold rounded-xl text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 focus:outline-none appearance-none cursor-pointer bg-agri-950"
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                  <option value="hinglish">HG</option>
                </select>
              </div>

              {/* PDF Dossier */}
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenExportModal();
                }}
                className="p-1.5 rounded-xl btn-agri-secondary"
                title="Export PDF Dossier"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              {/* Reset */}
              <button
                onClick={() => {
                  audio.playClick();
                  onResetDemo();
                }}
                className="p-1.5 rounded-xl agri-card-subtle text-slate-400 hover:text-white"
                title="Reset Demo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Sound */}
              <button
                onClick={handleMuteToggle}
                className="p-1.5 rounded-xl agri-card-subtle text-slate-400 hover:text-amber-400"
                title="Toggle Audio Feedback"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
