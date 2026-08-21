import React, { useState } from 'react';
import { 
  Bell, 
  MapPin, 
  Menu, 
  ChevronDown, 
  Check,
  X
} from 'lucide-react';
import { AppLanguage, FarmPlot, AppNavigationTab, FarmerProfile } from '../../types/groot';
import { audio } from '../../services/audioService';
import { INITIAL_ALERTS, DashboardAlert } from '../../services/farmService';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '../../services/languageService';

interface TopNavbarProps {
  currentPlot: FarmPlot;
  allPlots?: FarmPlot[];
  onPlotChange?: (plot: FarmPlot) => void;
  farmerProfile: FarmerProfile;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenMobileMenu: () => void;
  onNavigateTab: (tab: AppNavigationTab) => void;
  onOpenLocationModal?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentPlot,
  farmerProfile,
  language,
  onLanguageChange,
  onOpenMobileMenu,
  onNavigateTab,
}) => {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const alerts: DashboardAlert[] = INITIAL_ALERTS;

  const langMeta = getLanguageMeta(language);
  const isHi = language === 'hi';

  const getGreeting = () => {
    switch (language) {
      case 'hi': return `नमस्ते, ${farmerProfile.name} जी 👋`;
      case 'pa': return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ${farmerProfile.name} ਜੀ 👋`;
      case 'bn': return `নমস্কার, ${farmerProfile.name} বাবু 👋`;
      case 'te': return `నమస్కారం, ${farmerProfile.name} గారు 👋`;
      case 'ta': return `வணக்கம், ${farmerProfile.name} அவர்களே 👋`;
      case 'mr': return `नमस्कार, ${farmerProfile.name} राव 👋`;
      case 'gu': return `નમસ્તે, ${farmerProfile.name} ભાઈ 👋`;
      case 'kn': return `ನಮಸ್ಕಾರ, ${farmerProfile.name} ಅವರೇ 👋`;
      case 'ml': return `നമസ്കാരം, ${farmerProfile.name} 👋`;
      case 'or': return `ନମସ୍କାର, ${farmerProfile.name} ବାବୁ 👋`;
      case 'as': return `নমস্কাৰ, ${farmerProfile.name} ডাঙৰীয়া 👋`;
      case 'hinglish': return `Namaste, ${farmerProfile.name} ji 👋`;
      case 'en':
      default: return `Welcome, ${farmerProfile.name} 👋`;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DDE6DD] px-4 sm:px-6 py-3.5 shadow-[0_2px_10px_rgba(24,55,38,0.03)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Trigger & Farmer Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playClick();
              onOpenMobileMenu();
            }}
            className="lg:hidden p-2 rounded-xl text-[#1B2520] hover:bg-[#EDF4EC] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#1B2520] leading-tight">
              {getGreeting()}
            </h1>
            <p className="text-xs text-[#66756D] font-medium flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#1F6B45]" />
              <span>{currentPlot.locationName}</span>
              <span className="text-[#DDE6DD]">•</span>
              <button
                onClick={() => {
                  audio.playClick();
                  onNavigateTab('my_farm');
                }}
                className="text-[#1F6B45] hover:text-[#174F35] font-semibold underline"
              >
                {isHi ? 'खेत बदलें' : 'Change Location'}
              </button>
            </p>
          </div>
        </div>

        {/* Right: Language Switcher, Alerts Bell & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 1. Fast Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                audio.playClick();
                setIsLangDropdownOpen(!isLangDropdownOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EDF4EC] hover:bg-[#DDE6DD]/60 border border-[#DDE6DD] text-xs font-bold text-[#1B2520] transition-all min-h-[40px]"
            >
              <span>{langMeta.flagEmoji}</span>
              <span className="hidden sm:inline">{langMeta.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#66756D]" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white border border-[#DDE6DD] rounded-2xl shadow-[0_8px_24px_rgba(24,55,38,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-bold text-[#66756D] px-2 py-1 uppercase tracking-wider">
                  Select Language / भाषा चुनें
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      audio.playClick();
                      onLanguageChange(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                      language === lang.code
                        ? 'bg-[#EDF4EC] text-[#1F6B45] font-bold'
                        : 'text-[#1B2520] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flagEmoji}</span>
                      <span>{lang.nativeName}</span>
                    </div>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-[#1F6B45]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                audio.playClick();
                setIsAlertsOpen(!isAlertsOpen);
              }}
              className="p-2 rounded-xl text-[#1B2520] hover:bg-[#EDF4EC] border border-[#DDE6DD] transition-colors relative min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Alerts"
            >
              <Bell className="w-4 h-4 text-[#1B2520]" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#C57A10] border-2 border-white" />
              )}
            </button>

            {/* Alerts Drawer */}
            {isAlertsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#DDE6DD] rounded-2xl shadow-[0_8px_24px_rgba(24,55,38,0.12)] p-4 z-50 space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-[#DDE6DD]">
                  <h4 className="font-bold text-sm text-[#1B2520]">
                    {isHi ? 'सूचनाएं व अलर्ट' : 'Farm Alerts'}
                  </h4>
                  <button onClick={() => setIsAlertsOpen(false)} className="text-[#66756D] hover:text-[#1B2520]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setIsAlertsOpen(false);
                        onNavigateTab(alert.targetTab);
                      }}
                      className="p-3 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] hover:border-[#1F6B45] transition-all cursor-pointer space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1B2520]">
                          {isHi ? alert.titleHi : alert.titleEn}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          alert.severity === 'urgent'
                            ? 'bg-[#B94742]/15 text-[#B94742]'
                            : alert.severity === 'attention'
                            ? 'bg-[#C57A10]/15 text-[#C57A10]'
                            : 'bg-[#2F7D4A]/15 text-[#2F7D4A]'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[#66756D] leading-relaxed">
                        {isHi ? alert.descHi : alert.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Farmer Profile Avatar */}
          <button
            onClick={() => {
              audio.playClick();
              onNavigateTab('settings');
            }}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#1F6B45]/40 transition-all"
            title="Profile & Settings"
          >
            <img
              src={farmerProfile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
              alt={farmerProfile.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#1F6B45]"
            />
          </button>

        </div>

      </div>
    </header>
  );
};
