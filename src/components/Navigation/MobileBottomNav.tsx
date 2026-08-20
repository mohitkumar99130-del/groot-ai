import React from 'react';
import { 
  Satellite, 
  Camera, 
  FlaskConical, 
  Volume2, 
  Menu
} from 'lucide-react';
import { AppNavigationTab, AppLanguage } from '../../types/groot';
import { audio } from '../../services/audioService';

interface MobileBottomNavProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  onOpenMenu: () => void;
  language: AppLanguage;
  hotspotCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenMenu,
  language,
  hotspotCount,
}) => {
  const isHi = language === 'hi';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-agri-950/95 backdrop-blur-xl border-t border-emerald-500/20 px-2 py-1.5 shadow-[0_-8px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        
        {/* 1. Map */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('dashboard');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'dashboard'
              ? 'text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Satellite className="w-5 h-5" />
            {hotspotCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-mono">
            {isHi ? 'नक्शा' : 'Field Map'}
          </span>
          {activeTab === 'dashboard' && (
            <span className="w-4 h-0.5 bg-emerald-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* 2. Leaf Doctor */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('camera_doctor');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'camera_doctor'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono">
            {isHi ? 'पत्ती जांच' : 'Scanner'}
          </span>
          {activeTab === 'camera_doctor' && (
            <span className="w-4 h-0.5 bg-cyan-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* 3. Fertilizer Rx */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('fertilizer_doctor');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'fertilizer_doctor'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FlaskConical className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono">
            {isHi ? 'खाद Rx' : 'Fertilizer'}
          </span>
          {activeTab === 'fertilizer_doctor' && (
            <span className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* 4. Voice Assistant */}
        <button
          onClick={() => {
            audio.playClick();
            onTabChange('voice_assistant');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'voice_assistant'
              ? 'text-amber-300 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono">
            {isHi ? 'आवाज़' : 'Voice'}
          </span>
          {activeTab === 'voice_assistant' && (
            <span className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* 5. More / Side Menu */}
        <button
          onClick={() => {
            audio.playClick();
            onOpenMenu();
          }}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-emerald-400 transition-all"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono">
            {isHi ? 'मेनू' : 'More'}
          </span>
        </button>

      </div>
    </nav>
  );
};
