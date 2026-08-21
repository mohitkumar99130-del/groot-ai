import React from 'react';
import { Home, Sprout, Map, HeartPulse, Mic } from 'lucide-react';
import { AppNavigationTab, AppLanguage } from '../../types/groot';
import { audio } from '../../services/audioService';

interface MobileBottomNavProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  onOpenVoice: () => void;
  onOpenCamera?: () => void;
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030d07]/95 backdrop-blur-2xl border-t border-emerald-500/20 px-2 py-2 safe-area-bottom shadow-2xl">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        
        {/* 1. Home */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('home');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[56px] min-h-[50px] transition-all ${
            activeTab === 'home'
              ? 'text-emerald-300 bg-emerald-500/20 font-bold border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans">{isHi ? 'होम' : 'Home'}</span>
        </button>

        {/* 2. My Crops */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('my_crops');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[56px] min-h-[50px] transition-all ${
            activeTab === 'my_crops'
              ? 'text-emerald-300 bg-emerald-500/20 font-bold border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans">{isHi ? 'फसलें' : 'Crops'}</span>
        </button>

        {/* 3. CENTER PRIMARY ACTION: Voice / Ask GROOT */}
        <button
          onClick={() => {
            audio.playClick();
            onOpenVoice();
          }}
          className="relative -top-3 flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/30 border-2 border-amber-300 hover:scale-105 active:scale-95 transition-all"
          title="Ask GROOT by Voice"
        >
          <Mic className="w-7 h-7 text-slate-950" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
        </button>

        {/* 4. My Farm */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('my_farm');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[56px] min-h-[50px] transition-all ${
            activeTab === 'my_farm'
              ? 'text-emerald-300 bg-emerald-500/20 font-bold border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans">{isHi ? 'खेत' : 'Farm'}</span>
        </button>

        {/* 5. Crop Health / Diagnostics */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('crop_health');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[56px] min-h-[50px] transition-all relative ${
            activeTab === 'crop_health'
              ? 'text-emerald-300 bg-emerald-500/20 font-bold border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HeartPulse className="w-5 h-5 mb-0.5" />
          {hotspotCount > 0 && (
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full" />
          )}
          <span className="text-[10px] font-sans">{isHi ? 'सेहत' : 'Health'}</span>
        </button>

      </div>
    </div>
  );
};
