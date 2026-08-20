import React from 'react';
import { 
  Satellite, 
  Camera, 
  FlaskConical, 
  TrendingUp, 
  Sliders, 
  Volume2, 
  VolumeX,
  Globe, 
  Download, 
  RotateCcw, 
  Sprout, 
  CloudSun, 
  Droplets, 
  Wind,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { AppNavigationTab, UserUIMode, AppLanguage, FarmPlot, RealtimeWeather } from '../../types/groot';
import { DEMO_PLOTS } from './TopNavbar';
import { audio } from '../../services/audioService';

interface LeftSidebarProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
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
  onRefreshWeather: () => void;
  isWeatherLoading?: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onTabChange,
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
  onRefreshWeather,
  isWeatherLoading,
}) => {
  const [isMuted, setIsMuted] = React.useState(audio.getMuted());
  const isFarmerMode = uiMode === 'farmer_easy';
  const isHi = language === 'hi';

  const handleMuteToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  const navItems: { id: AppNavigationTab; labelHi: string; labelEn: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      labelHi: '🛰️ भू-स्थानिक सैटेलाइट',
      labelEn: '🛰️ Sentinel-2 Field Map',
      desc: '5×5 Parcels & NDVI Heatmap',
      icon: <Satellite className="w-5 h-5 text-cyan-400" />,
      badge: hotspotCount > 0 ? `${hotspotCount} Alert` : undefined,
    },
    {
      id: 'camera_doctor',
      labelHi: '📸 पत्ती रोग जांच लैब',
      labelEn: '📸 Crop Diagnostic Lab',
      desc: 'MobileNet AI Leaf Camera',
      icon: <Camera className="w-5 h-5 text-emerald-400" />,
      badge: 'AI Scan',
    },
    {
      id: 'fertilizer_doctor',
      labelHi: '🧪 खाद व कीटनाशक Rx',
      labelEn: '🧪 Fertilizer & Pest Rx',
      desc: 'NPK Calculator & Schedule',
      icon: <FlaskConical className="w-5 h-5 text-amber-400" />,
      badge: 'NPK Calc',
    },
    {
      id: 'temporal_analytics',
      labelHi: '📈 14-दिवसीय पूर्वानुमान',
      labelEn: '📈 Temporal Analytics',
      desc: '14-Day Recovery Forecast',
      icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
      badge: 'Forecast',
    },
    {
      id: 'sensor_simulator',
      labelHi: '🎛️ IoT मिट्टी सेंसर मेश',
      labelEn: '🎛️ IoT Soil Mesh',
      desc: 'ESP32 Live Mesh Telemetry',
      icon: <Sliders className="w-5 h-5 text-purple-400" />,
      badge: 'ESP32',
    },
    {
      id: 'voice_assistant',
      labelHi: '🎙️ किसान आवाज़ डॉक्टर',
      labelEn: '🎙️ Kisan Voice Assistant',
      desc: 'Tactile Spoken Hindi/Eng',
      icon: <Volume2 className="w-5 h-5 text-amber-300" />,
      badge: 'Voice',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-72 xl:w-80 h-screen sticky top-0 bg-agri-950/95 backdrop-blur-2xl border-r border-emerald-500/15 p-4 z-40 overflow-y-auto no-scrollbar">
      
      {/* 1. Header & Brand Monogram */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-slate-950 font-display font-black text-xl shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-300/40">
              G
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="font-display font-black text-lg text-white tracking-wide flex items-center gap-1.5">
                GROOT <span className="text-emerald-400 text-xs px-1.5 py-0.2 rounded bg-emerald-500/20 font-mono">AI</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Hara Bhara Planet Suite
              </div>
            </div>
          </div>

          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-xl agri-card-subtle text-slate-400 hover:text-amber-400 transition-colors"
            title="Toggle Sound Effects"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* 2. Active Plot Picker */}
        <div className="space-y-1.5 font-mono">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            {isHi ? 'खेत का चयन' : 'Active Farm Parcel'}
          </label>
          <div className="relative">
            <select
              value={currentPlot.id}
              onChange={(e) => {
                const found = DEMO_PLOTS.find((p) => p.id === e.target.value);
                if (found) {
                  onPlotChange(found);
                  audio.playClick();
                }
              }}
              className="w-full bg-agri-900/90 text-white font-bold text-xs rounded-xl p-2.5 border border-emerald-500/30 hover:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all cursor-pointer"
            >
              {DEMO_PLOTS.map((plot) => (
                <option key={plot.id} value={plot.id} className="bg-slate-950 text-white">
                  {plot.name} ({plot.crop})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sprout className="w-3 h-3" />
              {currentPlot.locationName}
            </span>
            <span className="font-bold text-slate-300">
              {currentPlot.areaHa} Ha • Health {currentPlot.healthAverage}%
            </span>
          </div>
        </div>

        {/* 3. Spoken Audio Quick CTA */}
        <button
          onClick={() => {
            audio.playClick();
            onToggleVoice();
          }}
          className={`w-full p-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${
            isSpeaking
              ? 'btn-agri-voice animate-pulse ring-2 ring-amber-400'
              : 'btn-agri-voice'
          }`}
        >
          <Volume2 className="w-4 h-4 text-slate-950" />
          <span>{isSpeaking ? 'बोल रहा है... (Narrating)' : (isHi ? '🔊 किसान आवाज़ सलाह सुनें' : '🔊 Listen Spoken Advisory')}</span>
        </button>

        {/* 4. Navigation Menu List */}
        <nav className="space-y-1 pt-1 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-2">
            {isHi ? 'पेज नेविगेशन' : 'Platform Modules'}
          </span>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  audio.playClick();
                }}
                className={`w-full p-2.5 rounded-2xl text-left transition-all flex items-center justify-between border group ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400 shadow-md ring-1 ring-emerald-400/40 font-bold'
                    : 'agri-card-subtle text-slate-300 border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-950/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-emerald-500/30' : 'bg-slate-900'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {isHi ? item.labelHi : item.labelEn}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-slate-950 text-emerald-300 border-emerald-400/50'
                      : 'bg-slate-950 text-slate-400 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 5. Footer Preferences & Realtime Weather Capsule */}
      <div className="space-y-3 pt-3 border-t border-emerald-500/15 font-mono">
        
        {/* Mode & Language Bar */}
        <div className="grid grid-cols-2 gap-2">
          {/* Mode Switcher */}
          <button
            onClick={() => {
              audio.playClick();
              onUiModeChange(isFarmerMode ? 'pro_agronomy' : 'farmer_easy');
            }}
            className="p-2 rounded-xl agri-card-subtle border border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-200 hover:border-emerald-500/40"
            title="Switch UI Mode"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">
              {isFarmerMode ? '🌾 Kisan' : '🔬 Pro'}
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-emerald-400 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => {
                onLanguageChange(e.target.value as AppLanguage);
                audio.playClick();
              }}
              className="w-full bg-agri-900 pl-6 pr-2 py-2 text-[11px] font-bold rounded-xl text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिन्दी</option>
              <option value="hinglish">🗣️ Hinglish</option>
            </select>
          </div>
        </div>

        {/* Action Buttons: Export & Reset */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              audio.playClick();
              onOpenExportModal();
            }}
            className="p-2 rounded-xl btn-agri-secondary flex items-center justify-center gap-1.5 text-[11px] font-bold"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF Dossier</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onResetDemo();
            }}
            className="p-2 rounded-xl agri-card-subtle text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-1.5 text-[11px] font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Live Weather Capsule with Refresh */}
        <div className="p-3 rounded-2xl bg-agri-900/80 border border-emerald-500/20 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-amber-300 font-bold">
            <span className="flex items-center gap-1">
              <CloudSun className="w-4 h-4 text-amber-400" />
              {weather.temperature}°C {isHi ? weather.conditionHindi : weather.condition}
            </span>
            <button
              onClick={() => {
                audio.playPulse();
                onRefreshWeather();
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-all"
              title="Refresh Realtime Weather"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1 text-cyan-300">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              {weather.humidity}% RH
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              {weather.windSpeed} km/h
            </span>
          </div>

          <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Spray Advisory:</span>
            <span className={`font-bold px-1.5 py-0.2 rounded ${
              weather.sprayAdvisory === 'Optimal'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-amber-400 bg-amber-500/10'
            }`}>
              {isHi ? weather.sprayAdvisoryHindi : weather.sprayAdvisory}
            </span>
          </div>
        </div>

      </div>

    </aside>
  );
};
