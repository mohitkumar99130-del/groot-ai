import React from 'react';
import { 
  Home, 
  Map, 
  Sprout, 
  HeartPulse, 
  Mic, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { AppNavigationTab, AppLanguage, FarmPlot } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';

interface LeftSidebarProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  selectedVariety: CropVariety;
  onOpenCropSelector: () => void;
  currentPlot?: FarmPlot;
  language: AppLanguage;
  hotspotCount: number;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onTabChange,
  selectedVariety,
  onOpenCropSelector,
  language,
  hotspotCount,
}) => {
  const isHi = language === 'hi';

  const navItems: { id: AppNavigationTab; labelHi: string; labelEn: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      labelHi: '🏠 मुख्य पृष्ठ (Home)',
      labelEn: '🏠 Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'my_farm',
      labelHi: '🗺️ मेरा खेत (My Farm)',
      labelEn: '🗺️ My Farm',
      icon: <Map className="w-5 h-5" />,
    },
    {
      id: 'my_crops',
      labelHi: '🌾 मेरी फसलें (My Crops)',
      labelEn: '🌾 My Crops',
      icon: <Sprout className="w-5 h-5" />,
    },
    {
      id: 'crop_health',
      labelHi: '❤️ फसल सेहत (Crop Health)',
      labelEn: '❤️ Crop Health',
      icon: <HeartPulse className="w-5 h-5" />,
      badge: hotspotCount > 0 ? `${hotspotCount}` : undefined,
    },
    {
      id: 'voice_assistant',
      labelHi: '🎙️ बोलकर पूछें (Ask GROOT)',
      labelEn: '🎙️ Ask GROOT',
      icon: <Mic className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 bg-white border-r border-[#DDE6DD] p-5 shrink-0 min-h-screen sticky top-0 shadow-[0_2px_10px_rgba(24,55,38,0.04)]">
      
      {/* Top Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#1F6B45] text-white font-black text-xl shadow-md">
            🌱
          </div>
          <div>
            <div className="font-black text-xl text-[#1B2520] tracking-tight flex items-center gap-1.5">
              GROOT
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EDF4EC] text-[#1F6B45] border border-[#DDE6DD]">
                V2
              </span>
            </div>
            <p className="text-xs text-[#66756D] font-medium">
              Smart Farming Assistant
            </p>
          </div>
        </div>

        {/* Active Crop Quick Summary Pill */}
        <button
          onClick={() => {
            audio.playClick();
            onOpenCropSelector();
          }}
          className="w-full p-3.5 rounded-2xl bg-[#EDF4EC] border border-[#DDE6DD] hover:border-[#1F6B45] transition-all text-left group"
        >
          <div className="flex items-center justify-between text-[11px] text-[#66756D] font-bold uppercase tracking-wider mb-1">
            <span>{isHi ? 'सक्रिय फसल' : 'ACTIVE CROP'}</span>
            <span className="text-[#1F6B45] underline group-hover:text-[#174F35]">
              {isHi ? 'बदलें' : 'Change'}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{selectedVariety.iconEmoji || '🌾'}</span>
            <div className="truncate">
              <div className="font-bold text-[#1B2520] text-sm truncate">
                {isHi ? selectedVariety.cropHindi : selectedVariety.cropName}
              </div>
              <div className="text-xs text-[#66756D] truncate">
                {selectedVariety.varietyHindi || selectedVariety.varietyName || 'General'}
              </div>
            </div>
          </div>
        </button>

        {/* Navigation List (Exactly 5 Primary Items) */}
        <nav className="space-y-1.5">
          <span className="text-[11px] text-[#66756D] uppercase tracking-wider block font-bold px-2 mb-2">
            {isHi ? 'मुख्य मेनू' : 'MENU'}
          </span>

          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'voice_assistant' && activeTab === 'voice_assistant');
            return (
              <button
                key={item.id}
                onClick={() => {
                  audio.playClick();
                  onTabChange(item.id);
                }}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between min-h-[48px] ${
                  isActive
                    ? 'bg-[#1F6B45] text-white font-bold shadow-sm'
                    : 'text-[#1B2520] hover:bg-[#EDF4EC] font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={isActive ? 'text-white' : 'text-[#1F6B45]'}>
                    {item.icon}
                  </div>
                  <span className="text-sm">
                    {isHi ? item.labelHi : item.labelEn}
                  </span>
                </div>

                {item.badge && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-[#1F6B45]' : 'bg-[#F2B84B] text-[#1B2520]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Link Only */}
      <div className="pt-4 border-t border-[#DDE6DD]">
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('settings');
          }}
          className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between min-h-[48px] ${
            activeTab === 'settings'
              ? 'bg-[#1F6B45] text-white font-bold'
              : 'text-[#66756D] hover:text-[#1B2520] hover:bg-[#EDF4EC]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-semibold">
              {isHi ? '⚙️ सेटिंग्स (Settings)' : '⚙️ Settings'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-60" />
        </button>
      </div>

    </aside>
  );
};
