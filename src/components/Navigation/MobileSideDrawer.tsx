import React from 'react';
import { 
  X, 
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
  language,
  hotspotCount,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-150">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-[300px] w-full bg-white border-r border-[#DDE6DD] shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-left duration-200">
        
        {/* Top Header */}
        <div className="p-4 border-b border-[#DDE6DD] flex items-center justify-between bg-[#F6F8F2]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1F6B45] text-white font-bold text-lg">
              🌱
            </div>
            <div>
              <div className="font-black text-base text-[#1B2520] tracking-tight">
                GROOT
              </div>
              <div className="text-xs text-[#66756D]">
                Smart Farming Assistant
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-[#66756D] hover:text-[#1B2520] hover:bg-[#DDE6DD]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Active Crop Pill */}
          <div className="p-3.5 rounded-xl bg-[#EDF4EC] border border-[#DDE6DD]">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#66756D] uppercase mb-1">
              <span>{isHi ? 'सक्रिय फसल' : 'Active Crop'}</span>
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenCropSelector();
                  onClose();
                }}
                className="text-[#1F6B45] underline font-bold"
              >
                Change
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedVariety.iconEmoji || '🌾'}</span>
              <div className="truncate">
                <div className="font-bold text-[#1B2520] text-xs truncate">
                  {isHi ? selectedVariety.cropHindi : selectedVariety.cropName}
                </div>
                <div className="text-[11px] text-[#66756D] truncate">
                  {selectedVariety.varietyHindi || selectedVariety.varietyName || 'General'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <span className="text-[11px] text-[#66756D] uppercase tracking-wider block font-bold px-2 mb-2">
              {isHi ? 'मेन्यू' : 'NAVIGATION'}
            </span>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    audio.playClick();
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between min-h-[48px] ${
                    isActive
                      ? 'bg-[#1F6B45] text-white font-bold'
                      : 'text-[#1B2520] hover:bg-[#EDF4EC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={isActive ? 'text-white' : 'text-[#1F6B45]'}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold">
                      {isHi ? item.labelHi : item.labelEn}
                    </span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-[#1F6B45]' : 'bg-[#F2B84B] text-[#1B2520]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Bottom Settings Link */}
        <div className="p-4 border-t border-[#DDE6DD] bg-[#F6F8F2]">
          <button
            onClick={() => {
              audio.playClick();
              onTabChange('settings');
              onClose();
            }}
            className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
              activeTab === 'settings'
                ? 'bg-[#1F6B45] text-white font-bold'
                : 'text-[#66756D] hover:text-[#1B2520]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[#1F6B45]" />
              <span className="text-xs font-bold">
                {isHi ? '⚙️ सेटिंग्स (Settings)' : '⚙️ Settings'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>
        </div>

      </div>
    </div>
  );
};
