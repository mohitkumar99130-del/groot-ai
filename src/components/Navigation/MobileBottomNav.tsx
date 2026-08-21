import React from 'react';
import { Home, Map, Sprout, HeartPulse, Mic } from 'lucide-react';
import { AppNavigationTab, AppLanguage } from '../../types/groot';
import { audio } from '../../services/audioService';

interface MobileBottomNavProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  onOpenVoice: () => void;
  language: AppLanguage;
  hotspotCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenVoice,
  language,
  hotspotCount,
}) => {
  const isHi = language === 'hi';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDE6DD] px-3 py-2 shadow-[0_-4px_20px_rgba(24,55,38,0.08)]">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto relative">
        
        {/* 1. Home */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('home');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all min-h-[48px] ${
            activeTab === 'home'
              ? 'text-[#1F6B45] font-bold'
              : 'text-[#66756D] hover:text-[#1B2520]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{isHi ? 'होम' : 'Home'}</span>
        </button>

        {/* 2. My Farm */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('my_farm');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all min-h-[48px] ${
            activeTab === 'my_farm'
              ? 'text-[#1F6B45] font-bold'
              : 'text-[#66756D] hover:text-[#1B2520]'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{isHi ? 'खेत' : 'Farm'}</span>
        </button>

        {/* 3. Central Prominent 🎙️ GROOT Voice Assistant Trigger */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-6">
          <button
            onClick={() => {
              audio.playClick();
              onOpenVoice();
            }}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1F6B45] text-white shadow-[0_6px_20px_rgba(31,107,69,0.35)] border-4 border-white hover:bg-[#174F35] active:scale-95 transition-all"
            aria-label="Ask GROOT"
          >
            <Mic className="w-6 h-6 text-white animate-pulse" />
          </button>
          <span className="text-[11px] font-bold text-[#1F6B45] mt-1">GROOT</span>
        </div>

        {/* 4. My Crops */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('my_crops');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all min-h-[48px] ${
            activeTab === 'my_crops'
              ? 'text-[#1F6B45] font-bold'
              : 'text-[#66756D] hover:text-[#1B2520]'
          }`}
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{isHi ? 'फसलें' : 'Crops'}</span>
        </button>

        {/* 5. Crop Health */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('crop_health');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all relative min-h-[48px] ${
            activeTab === 'crop_health'
              ? 'text-[#1F6B45] font-bold'
              : 'text-[#66756D] hover:text-[#1B2520]'
          }`}
        >
          <div className="relative">
            <HeartPulse className="w-5 h-5 mb-0.5" />
            {hotspotCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#C57A10] text-white text-[9px] font-bold flex items-center justify-center">
                {hotspotCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-tight">{isHi ? 'सेहत' : 'Health'}</span>
        </button>

      </div>
    </div>
  );
};
