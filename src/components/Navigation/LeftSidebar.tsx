import React from 'react';
import { 
  Home, 
  Sprout, 
  Map, 
  HeartPulse, 
  Bug, 
  Droplets, 
  CloudSun, 
  TrendingUp, 
  FileText, 
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { AppNavigationTab, AppLanguage, FarmPlot } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';

interface LeftSidebarProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  selectedVariety: CropVariety;
  onOpenCropSelector: () => void;
  currentPlot: FarmPlot;
  language: AppLanguage;
  hotspotCount: number;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onTabChange,
  selectedVariety,
  onOpenCropSelector,
  currentPlot,
  language,
  hotspotCount,
}) => {
  const [isMuted, setIsMuted] = React.useState(audio.getMuted());
  const isHi = language === 'hi';

  const handleMuteToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  const navItems: { id: AppNavigationTab; labelHi: string; labelEn: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      labelHi: '🏠 मुख्य पृष्ठ (Home)',
      labelEn: '🏠 Home',
      icon: <Home className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'my_crops',
      labelHi: '🌾 मेरी फसलें (My Crops)',
      labelEn: '🌾 My Crops',
      icon: <Sprout className="w-5 h-5 text-lime-400" />,
    },
    {
      id: 'my_farm',
      labelHi: '🗺️ मेरा खेत (My Farm)',
      labelEn: '🗺️ My Farm',
      icon: <Map className="w-5 h-5 text-cyan-400" />,
      badge: 'Satellite',
    },
    {
      id: 'crop_health',
      labelHi: '❤️ फसल सेहत (Crop Health)',
      labelEn: '❤️ Crop Health',
      icon: <HeartPulse className="w-5 h-5 text-emerald-400" />,
      badge: hotspotCount > 0 ? `${hotspotCount} Alert` : undefined,
    },
    {
      id: 'pest_disease',
      labelHi: '🐛 कीट व रोग (Pest & Disease)',
      labelEn: '🐛 Pest & Disease',
      icon: <Bug className="w-5 h-5 text-amber-400" />,
      badge: 'AI Scan',
    },
    {
      id: 'water_irrigation',
      labelHi: '💧 पानी व सिंचाई (Water & Irrigation)',
      labelEn: '💧 Water & Irrigation',
      icon: <Droplets className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: 'weather',
      labelHi: '🌤️ मौसम (Weather)',
      labelEn: '🌤️ Weather',
      icon: <CloudSun className="w-5 h-5 text-amber-300" />,
    },
    {
      id: 'growth_yield',
      labelHi: '📈 पैदावार व खाद (Growth & Yield)',
      labelEn: '📈 Growth & Yield',
      icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
    },
    {
      id: 'reports',
      labelHi: '📋 रिपोर्ट (Reports)',
      labelEn: '📋 Reports',
      icon: <FileText className="w-5 h-5 text-slate-300" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-72 xl:w-80 h-screen sticky top-0 bg-[#041009]/95 backdrop-blur-2xl border-r border-emerald-500/15 p-4 z-40 overflow-y-auto no-scrollbar">
      
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
              <div className="text-[10px] font-mono text-emerald-300/70">
                Farmer-First Precision Suite
              </div>
            </div>
          </div>

          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            title="Toggle Sound Effects"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* 2. Active Crop Badge in Sidebar */}
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-[#021a0e] border border-emerald-500/30 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
            <span>ACTIVE CROP • सक्रिय फसल</span>
            <button
              onClick={() => {
                audio.playClick();
                onOpenCropSelector();
              }}
              className="text-amber-300 hover:text-amber-200 underline text-[10px]"
            >
              {isHi ? 'बदलें' : 'Change'}
            </button>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onTabChange('my_crops');
            }}
            className="w-full text-left flex items-center gap-2.5 group"
          >
            <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
              {selectedVariety.iconEmoji || '🌾'}
            </span>
            <div className="truncate">
              <div className="font-bold text-white text-xs truncate group-hover:text-emerald-300 transition-colors">
                {isHi ? selectedVariety.varietyHindi : selectedVariety.varietyName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentPlot.name} • {currentPlot.locationName}
              </div>
            </div>
          </button>
        </div>

        {/* 3. Primary Navigation Menu List (9 clean items) */}
        <nav className="space-y-1 pt-1 font-sans">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-2 font-mono px-1">
            {isHi ? 'मुख्य मेनू (Primary Navigation)' : 'Primary Modules'}
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
                className={`w-full p-2.5 rounded-2xl text-left transition-all flex items-center justify-between border group min-h-[48px] ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/80 shadow-md ring-1 ring-emerald-400/30 font-bold'
                    : 'bg-slate-900/40 text-slate-300 border-slate-800/80 hover:border-emerald-500/40 hover:bg-emerald-950/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-emerald-500/30' : 'bg-slate-900/80'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-slate-100 group-hover:text-white">
                    {isHi ? item.labelHi : item.labelEn}
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-slate-950 text-emerald-300 border-emerald-400/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. Bottom of Sidebar: SETTINGS ONLY */}
      <div className="pt-3 border-t border-emerald-500/15 space-y-2">
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('settings');
          }}
          className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between border min-h-[48px] ${
            activeTab === 'settings'
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400 ring-1 ring-emerald-400/30 font-bold'
              : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {isHi ? '⚙️ सेटिंग्स (Settings)' : '⚙️ Settings'}
              </div>
              <div className="text-[10px] text-slate-400">
                Language • Voice • Units • Account
              </div>
            </div>
          </div>
        </button>

        <div className="text-[10px] font-mono text-center text-slate-500 pt-1">
          GROOT v2.5 • Simple First, Details Second
        </div>
      </div>

    </aside>
  );
};
