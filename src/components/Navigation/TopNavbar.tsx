import React, { useState } from 'react';
import { 
  Bell, 
  MapPin, 
  Menu, 
  ChevronDown, 
  ArrowRight
} from 'lucide-react';
import { AppLanguage, FarmPlot, AppNavigationTab, FarmerProfile } from '../../types/groot';
import { audio } from '../../services/audioService';
import { INITIAL_ALERTS, DashboardAlert } from '../../services/farmService';

interface TopNavbarProps {
  currentPlot: FarmPlot;
  allPlots: FarmPlot[];
  onPlotChange: (plot: FarmPlot) => void;
  farmerProfile: FarmerProfile;
  language: AppLanguage;
  onOpenMobileMenu: () => void;
  onNavigateTab: (tab: AppNavigationTab) => void;
  onOpenLocationModal?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentPlot,
  allPlots,
  onPlotChange,
  farmerProfile,
  language,
  onOpenMobileMenu,
  onNavigateTab,
  onOpenLocationModal,
}) => {
  const [isPlotDropdownOpen, setIsPlotDropdownOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const alerts = INITIAL_ALERTS;

  const isHi = language === 'hi';

  const getGreeting = () => {
    switch (language) {
      case 'hi':
        return `नमस्ते, ${farmerProfile.name} जी 👋`;
      case 'pa':
        return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ${farmerProfile.name} ਜੀ 👋`;
      case 'bn':
        return `নমস্কার, ${farmerProfile.name} বাবু 👋`;
      case 'te':
        return `నమస్కారం, ${farmerProfile.name} గారు 👋`;
      case 'ta':
        return `வணக்கம், ${farmerProfile.name} அவர்களே 👋`;
      case 'mr':
        return `नमस्कार, ${farmerProfile.name} भाऊ 👋`;
      case 'gu':
        return `નમસ્તે, ${farmerProfile.name} ભાઈ 👋`;
      case 'kn':
        return `ನಮಸ್ಕಾರ, ${farmerProfile.name} ಅವರೇ 👋`;
      case 'ml':
        return `നമസ്കാരം, ${farmerProfile.name} സുഹൃത്തേ 👋`;
      case 'or':
        return `ନମସ୍କାର, ${farmerProfile.name} ଭାଇ 👋`;
      case 'as':
        return `নমস্কাৰ, ${farmerProfile.name} ডাঙৰীয়া 👋`;
      case 'hinglish':
        return `Namaste, ${farmerProfile.name} Bhai 👋`;
      case 'en':
      default:
        return `Namaste, ${farmerProfile.name} 👋`;
    }
  };

  const handleAlertClick = (alert: DashboardAlert) => {
    audio.playClick();
    setIsAlertsOpen(false);
    onNavigateTab(alert.targetTab);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#030d07]/95 backdrop-blur-xl border-b border-emerald-500/15">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Mobile Hamburger + Localized Greeting & Location */}
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenMobileMenu();
              }}
              className="lg:hidden p-2.5 rounded-2xl bg-slate-900/90 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors shadow-sm min-w-[48px] min-h-[48px] flex items-center justify-center"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Farmer Greeting & Location */}
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>{getGreeting()}</span>
              </h1>
              
              {/* Location Picker Pill */}
              <div className="flex items-center gap-1.5 pt-0.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-emerald-300/90 truncate max-w-[200px] sm:max-w-xs">
                  {currentPlot.locationName}
                </span>
                <button
                  onClick={() => {
                    audio.playClick();
                    if (onOpenLocationModal) {
                      onOpenLocationModal();
                    } else {
                      onNavigateTab('my_farm');
                    }
                  }}
                  className="text-[11px] text-amber-300 hover:text-amber-200 underline font-mono ml-1 shrink-0"
                >
                  {isHi ? 'स्थान बदलें' : 'Change Location'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Farm Parcel Switcher + Notification Bell + Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Farm Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  audio.playClick();
                  setIsPlotDropdownOpen(!isPlotDropdownOpen);
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 text-xs font-mono text-slate-200 transition-all min-h-[44px]"
                title="Select Farm Plot"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white truncate max-w-[140px] md:max-w-[180px]">
                  {currentPlot.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {isPlotDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-slate-950 border border-emerald-500/40 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    {isHi ? 'खेत का चयन करें' : 'Select Farm Field'}
                  </div>
                  {allPlots.map((plot) => (
                    <button
                      key={plot.id}
                      onClick={() => {
                        onPlotChange(plot);
                        setIsPlotDropdownOpen(false);
                        audio.playClick();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        plot.id === currentPlot.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{plot.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{plot.locationName}</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/30 shrink-0">
                        {plot.healthAverage}%
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell with interactive alert drawer */}
            <div className="relative">
              <button
                onClick={() => {
                  audio.playClick();
                  setIsAlertsOpen(!isAlertsOpen);
                }}
                className="relative p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                title="Notifications & Alerts"
                aria-label="Notifications & Alerts"
              >
                <Bell className="w-5 h-5 text-amber-300" />
                {alerts.length > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-ping" />
                )}
                {alerts.length > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950" />
                )}
              </button>

              {isAlertsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-slate-950 border border-amber-500/40 rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      🔔 {isHi ? 'महत्वपूर्ण सूचनाएं' : 'Farm Alerts & Updates'}
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/40">
                      {alerts.length} Active
                    </span>
                  </div>

                  <div className="space-y-2 py-2 max-h-80 overflow-y-auto">
                    {alerts.map((alert) => (
                      <button
                        key={alert.id}
                        onClick={() => handleAlertClick(alert)}
                        className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-start gap-2.5 group ${
                          alert.severity === 'urgent'
                            ? 'bg-rose-950/30 border-rose-500/40 hover:bg-rose-950/50'
                            : alert.severity === 'attention'
                            ? 'bg-amber-950/30 border-amber-500/40 hover:bg-amber-950/50'
                            : 'bg-emerald-950/30 border-emerald-500/40 hover:bg-emerald-950/50'
                        }`}
                      >
                        <span className="text-base mt-0.5">
                          {alert.severity === 'urgent' ? '🔴' : alert.severity === 'attention' ? '🟠' : '🟢'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {isHi ? alert.titleHi : alert.titleEn}
                          </div>
                          <div className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                            {isHi ? alert.descHi : alert.descEn}
                          </div>
                          <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                            <span>{alert.time}</span>
                            <span className="text-emerald-400 group-hover:underline flex items-center gap-0.5">
                              Open <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      audio.playClick();
                      setIsAlertsOpen(false);
                      onNavigateTab('crop_health');
                    }}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-center text-xs font-bold text-emerald-400 border border-slate-800 transition-colors"
                  >
                    {isHi ? 'सभी सूचनाएं देखें' : 'View All Alerts in Crop Health'}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar / Farm Info */}
            <button
              onClick={() => {
                audio.playClick();
                onNavigateTab('settings');
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition-all min-h-[48px]"
              title="Farmer Profile & Settings"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                {farmerProfile.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left pr-1">
                <div className="text-xs font-bold text-white leading-tight">{farmerProfile.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{farmerProfile.village}</div>
              </div>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
