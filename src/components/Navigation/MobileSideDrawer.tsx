import React from 'react';
import { 
  X, 
  Home, 
  Sprout, 
  Map, 
  HeartPulse, 
  Bug, 
  Droplets, 
  CloudSun, 
  TrendingUp, 
  FileText, 
  Settings
} from 'lucide-react';
import { AppNavigationTab, AppLanguage, FarmPlot } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';

interface MobileSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  selectedVariety: CropVariety;
  onOpenCropSelector: () => void;
  currentPlot: FarmPlot;
  language: AppLanguage;
  hotspotCount: number;
}

export const MobileSideDrawer: React.FC<MobileSideDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  selectedVariety,
  onOpenCropSelector,
  currentPlot,
  language,
  hotspotCount,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';

  const navItems: { id: AppNavigationTab; labelHi: string; labelEn: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      labelHi: '🏠 मुख्य पृष्ठ (Home)',
      labelEn: '🏠 Home Dashboard',
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
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-[320px] sm:max-w-[360px] w-full bg-[#030d07] border-r border-emerald-500/25 shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-left duration-250 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 border-b border-emerald-500/15 flex items-center justify-between bg-slate-900/60">
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
                Farmer-First Suite
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-slate-900 text-slate-400 hover:text-white transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Active Crop Pill in Mobile Drawer */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">
              <span>Active Crop</span>
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenCropSelector();
                  onClose();
                }}
                className="text-amber-300 underline"
              >
                Change
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedVariety.iconEmoji || '🌾'}</span>
              <div className="truncate">
                <div className="font-bold text-white text-xs truncate">{isHi ? selectedVariety.varietyHindi : selectedVariety.varietyName}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentPlot.name}</div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1.5 font-sans">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-2 font-mono px-1">
              {isHi ? 'मुख्य नेविगेशन' : 'Navigation'}
            </span>

            {navItems.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    audio.playClick();
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between border min-h-[48px] ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400 shadow-lg ring-1 ring-emerald-400/30 font-bold'
                      : 'bg-slate-900/40 text-slate-300 border-slate-800 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-emerald-500/30' : 'bg-slate-900'}`}>
                      {tab.icon}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {isHi ? tab.labelHi : tab.labelEn}
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

        </div>

        {/* Bottom Settings Link */}
        <div className="p-4 border-t border-emerald-500/15 bg-slate-900/60">
          <button
            onClick={() => {
              audio.playClick();
              onTabChange('settings');
              onClose();
            }}
            className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between border min-h-[48px] ${
              activeTab === 'settings'
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400 ring-1 ring-emerald-400/30 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-950 text-amber-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {isHi ? '⚙️ सेटिंग्स (Settings)' : '⚙️ Settings'}
                </div>
                <div className="text-[10px] text-slate-400">
                  Language • Voice • Account
                </div>
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
