import React from 'react';
import { 
  X, 
  Satellite, 
  Camera, 
  FlaskConical, 
  TrendingUp, 
  Sliders, 
  Volume2, 
  Globe, 
  Download, 
  RotateCcw, 
  Sprout, 
  CloudSun, 
  Droplets, 
  UserCheck
} from 'lucide-react';
import { AppNavigationTab, UserUIMode, AppLanguage, FarmPlot, RealtimeWeather } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { DEMO_PLOTS } from './TopNavbar';
import { audio } from '../../services/audioService';

interface MobileSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  selectedVariety?: CropVariety;
  onOpenCropSelector?: () => void;
  uiMode: UserUIMode;
  onUiModeChange: (mode: UserUIMode) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  currentPlot: FarmPlot;
  onPlotChange: (plot: FarmPlot) => void;
  isSpeaking: boolean;
  onToggleVoice: () => void;
  onOpenExportModal: () => void;
  onResetDemo: () => void;
  hotspotCount: number;
  weather: RealtimeWeather;
}

export const MobileSideDrawer: React.FC<MobileSideDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  selectedVariety,
  onOpenCropSelector,
  uiMode,
  onUiModeChange,
  language,
  onLanguageChange,
  currentPlot,
  onPlotChange,
  isSpeaking,
  onToggleVoice,
  onOpenExportModal,
  onResetDemo,
  hotspotCount,
  weather,
}) => {

  if (!isOpen) return null;

  const isFarmerMode = uiMode === 'farmer_easy';

  const menuTabs: { id: AppNavigationTab; labelHi: string; labelEn: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      labelHi: '🛰️ भू-स्थानिक सैटेलाइट नक्शा',
      labelEn: '🛰️ Geospatial Sentinel-2',
      desc: '5×5 Parcel Grid & NDVI Heatmap',
      icon: <Satellite className="w-5 h-5 text-cyan-400" />,
      badge: hotspotCount > 0 ? `${hotspotCount} Alert` : undefined,
    },
    {
      id: 'camera_doctor',
      labelHi: '📸 पत्ती रोग जांच लैब',
      labelEn: '📸 Crop Diagnostic Lab',
      desc: 'MobileNet AI Leaf Camera Scanner',
      icon: <Camera className="w-5 h-5 text-emerald-400" />,
      badge: 'Edge AI',
    },
    {
      id: 'fertilizer_doctor',
      labelHi: '🧪 खाद व कीटनाशक गणना',
      labelEn: '🧪 Fertilizer & Pest Rx',
      desc: 'NPK Dosage & Application Calendar',
      icon: <FlaskConical className="w-5 h-5 text-amber-400" />,
      badge: 'NPK Rx',
    },
    {
      id: 'temporal_analytics',
      labelHi: '📈 14-दिवसीय पूर्वानुमान',
      labelEn: '📈 Temporal Trajectory',
      desc: 'Untreated vs Treated Recovery Curve',
      icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
      badge: '14-Day',
    },
    {
      id: 'sensor_simulator',
      labelHi: '🎛️ IoT मिट्टी सेंसर मेश',
      labelEn: '🎛️ IoT Sensor Mesh',
      desc: 'ESP32 Live Telemetry & Stress Demo',
      icon: <Sliders className="w-5 h-5 text-purple-400" />,
      badge: 'ESP32',
    },
    {
      id: 'voice_assistant',
      labelHi: '🎙️ किसान आवाज़ डॉक्टर',
      labelEn: '🎙️ Kisan Voice Assistant',
      desc: 'Hands-Free Spoken Advisory Audio',
      icon: <Volume2 className="w-5 h-5 text-amber-300" />,
      badge: 'Audio',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-[320px] sm:max-w-[360px] w-full bg-agri-950 border-r border-emerald-500/25 shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-left duration-250 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 border-b border-emerald-500/15 flex items-center justify-between bg-agri-900/60">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-slate-950 font-display font-black text-lg shadow-md">
              G
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="font-display font-black text-base text-white tracking-wide flex items-center gap-1.5">
                GROOT <span className="text-emerald-400 text-xs px-1.5 py-0.2 rounded bg-emerald-500/20 font-mono">AI</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Hara Bhara Planet Menu
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-2 rounded-xl agri-card-subtle text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Spoken Advisory Quick Broadcast Button inside Drawer */}
          <button
            onClick={() => {
              audio.playClick();
              onToggleVoice();
            }}
            className={`w-full p-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isSpeaking
                ? 'btn-agri-voice animate-pulse ring-2 ring-amber-400'
                : 'btn-agri-voice'
            }`}
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>{isSpeaking ? 'बोल रहा है... (Audio On)' : (language === 'hi' ? '🔊 किसान आवाज़ सलाह सुनें' : '🔊 Listen Spoken Advisory')}</span>
          </button>

          {/* Active Field Plot Selector */}
          <div className="space-y-2 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Active Field Parcel
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {DEMO_PLOTS.map((plot) => (
                <button
                  key={plot.id}
                  onClick={() => {
                    onPlotChange(plot);
                    audio.playClick();
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                    plot.id === currentPlot.id
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 shadow-md font-bold'
                      : 'agri-card-subtle text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-xs">{plot.name}</div>
                      <div className="text-[10px] text-slate-400">{plot.locationName}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 font-bold border border-emerald-500/30">
                    {plot.healthAverage}%
                  </span>
                </button>
              ))}
            </div>

            {/* Active Crop & Variety Picker Button (Mobile) */}
            {selectedVariety && onOpenCropSelector && (
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenCropSelector();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition-all flex items-center justify-between text-xs font-bold text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{selectedVariety.iconEmoji}</span>
                  <div className="truncate">
                    <div className="truncate text-white">{language === 'hi' ? selectedVariety.varietyHindi : selectedVariety.varietyName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{language === 'hi' ? selectedVariety.grainTypeHindi : selectedVariety.grainType}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-mono shrink-0">
                  {language === 'hi' ? 'बदलें' : 'Change'}
                </span>
              </button>
            )}
          </div>

          {/* Core Navigation Items */}
          <div className="space-y-1.5 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-2">
              Navigation Modules
            </span>

            {menuTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    audio.playClick();
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400 shadow-lg ring-1 ring-emerald-400/40 font-bold'
                      : 'agri-card-subtle text-slate-300 border-slate-800 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-emerald-500/30' : 'bg-slate-900'} shrink-0`}>
                      {tab.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {language === 'hi' ? tab.labelHi : tab.labelEn}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">{tab.desc}</div>
                    </div>
                  </div>

                  {tab.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-emerald-300 border border-emerald-500/40">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Preferences & Quick Actions */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Preferences & Mode
            </span>

            {/* Mode Switcher */}
            <button
              onClick={() => {
                audio.playClick();
                onUiModeChange(isFarmerMode ? 'pro_agronomy' : 'farmer_easy');
              }}
              className="w-full p-2.5 rounded-xl agri-card-subtle border border-slate-800 flex items-center justify-between text-xs text-slate-200 hover:border-emerald-500/40"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>UI Mode:</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                isFarmerMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isFarmerMode ? '🌾 किसान सरल' : '🔬 Pro Agronomist'}
              </span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center justify-between p-2.5 rounded-xl agri-card-subtle border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Language:</span>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  onLanguageChange(e.target.value as AppLanguage);
                  audio.playClick();
                }}
                className="bg-slate-950 text-emerald-300 font-bold border border-emerald-500/40 rounded-lg px-2 py-1 text-xs focus:outline-none"
              >
                <option value="hi">🇮🇳 हिन्दी</option>
                <option value="en">🇬🇧 English</option>
                <option value="hinglish">🗣️ Hinglish</option>
              </select>
            </div>

            {/* Export & Reset Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenExportModal();
                  onClose();
                }}
                className="p-2.5 rounded-xl btn-agri-secondary flex items-center justify-center gap-1.5 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Dossier</span>
              </button>

              <button
                onClick={() => {
                  audio.playClick();
                  onResetDemo();
                  onClose();
                }}
                className="p-2.5 rounded-xl agri-card-subtle text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-1.5 text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Status Capsule */}
        <div className="p-3.5 border-t border-emerald-500/15 bg-agri-900/60 font-mono text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between text-amber-300">
            <span className="flex items-center gap-1 font-bold">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              {weather.temperature}°C {language === 'hi' ? weather.conditionHindi : weather.condition}
            </span>
            <span className="flex items-center gap-1 text-cyan-300">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              {weather.humidity}% RH
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Wind: {weather.windSpeed} km/h</span>
            <span className="text-emerald-400 font-bold">
              {language === 'hi' ? weather.sprayAdvisoryHindi : `Spray: ${weather.sprayAdvisory}`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

