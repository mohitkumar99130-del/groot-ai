import React from 'react';
import { 
  Satellite, 
  Camera, 
  FlaskConical, 
  TrendingUp, 
  Sliders, 
  Volume2
} from 'lucide-react';
import { AppNavigationTab, AppLanguage } from '../../types/groot';
import { audio } from '../../services/audioService';

interface TabNavigationProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  language: AppLanguage;
  hotspotCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  language,
  hotspotCount,
}) => {
  const tabs: { id: AppNavigationTab; labelHi: string; labelEn: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      labelHi: '🛰️ भू-स्थानिक सैटेलाइट नक्शा',
      labelEn: '🛰️ Geospatial Sentinel-2',
      icon: <Satellite className="w-4 h-4" />,
      badge: hotspotCount > 0 ? `${hotspotCount} Alert` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      id: 'camera_doctor',
      labelHi: '📸 पत्ती रोग जांच लैब',
      labelEn: '📸 Crop Diagnostic Lab',
      icon: <Camera className="w-4 h-4" />,
      badge: 'Edge AI',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'fertilizer_doctor',
      labelHi: '🧪 खाद व कीटनाशक गणना',
      labelEn: '🧪 Fertilizer & Pest Rx',
      icon: <FlaskConical className="w-4 h-4" />,
      badge: 'NPK Rx',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'temporal_analytics',
      labelHi: '📈 14-दिवसीय पूर्वानुमान',
      labelEn: '📈 Temporal Trajectory',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: 'Forecast',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'sensor_simulator',
      labelHi: '🎛️ IoT मिट्टी सेंसर मेश',
      labelEn: '🎛️ IoT Sensor Mesh',
      icon: <Sliders className="w-4 h-4" />,
      badge: 'ESP32',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      id: 'voice_assistant',
      labelHi: '🎙️ किसान आवाज़ डॉक्टर',
      labelEn: '🎙️ Kisan Voice Assistant',
      icon: <Volume2 className="w-4 h-4" />,
      badge: 'Audio',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
  ];

  return (
    <nav className="w-full bg-agri-950/80 border-b border-emerald-500/15 py-1.5 px-3 sm:px-6">
      <div className="max-w-[1720px] mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                audio.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'btn-agri-primary shadow-lg text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
              }`}
            >
              {tab.icon}
              <span>{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
              {tab.badge && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  isActive ? 'bg-slate-950 text-emerald-300 border-emerald-400/40' : tab.badgeColor
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
