import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  FileDown, 
  Languages, 
  Mic, 
  RefreshCw,
  Home,
  Camera,
  Sparkles,
  Radio,
  UserCheck
} from 'lucide-react';
import { audio } from '../../services/audioService';
import { AppNavigationTab, UserUIMode, AppLanguage } from '../../types/groot';
import { realVoiceService } from '../../services/voiceService';

interface GrootHeaderProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  uiMode: UserUIMode;
  onUiModeChange: (mode: UserUIMode) => void;
  currentLanguage: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenVoiceModal: () => void;
  onOpenExportModal: () => void;
  onResetDemo: () => void;
  hindiVoiceSummary?: string;
  englishVoiceSummary?: string;
}

export const GrootHeader: React.FC<GrootHeaderProps> = ({
  activeTab,
  onTabChange,
  uiMode,
  onUiModeChange,
  currentLanguage,
  onLanguageChange,
  onOpenExportModal,
  onResetDemo,
  hindiVoiceSummary,
  englishVoiceSummary,
}) => {
  const [isMuted, setIsMuted] = React.useState(audio.getMuted());
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleMuteToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  const handleSpeakAdvice = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const isHi = currentLanguage === 'hi';
    const summaryText = isHi
      ? (hindiVoiceSummary || 'नमस्कार किसान भाई! GROOT AI में आपका स्वागत है। आपकी फ़सल की सेहत अच्छी है। खेत में नमी 38% है। सही समय पर यूरिया का छिड़काव करें। धन्यवाद!')
      : (englishVoiceSummary || 'Hello farmer! Welcome to GROOT AI. Your crop health is good with balanced soil moisture. Apply fertilizer at the recommended schedule. Thank you!');
    await realVoiceService.speak(summaryText, currentLanguage);
    setIsSpeaking(false);
  };

  const isFarmerMode = uiMode === 'farmer_easy';

  return (
    <>
      {/* Sticky Desktop & Tablet Header */}
      <header className="sticky top-0 z-40 w-full glass-panel-sunlit border-b border-amber-500/25 px-3 lg:px-6 py-2.5 backdrop-blur-2xl">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-2.5">
          
          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-3">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div 
                onClick={() => onTabChange('dashboard')}
                className="cursor-pointer relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-amber-400 shadow-lg shadow-emerald-500/30 text-slate-950 font-black font-display text-xl tracking-tighter hover:scale-105 transition-transform"
              >
                G
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-black text-xl text-white tracking-wide flex items-center gap-1.5 drop-shadow">
                    GROOT <span className="text-amber-400 font-extrabold text-sm">AI</span>
                  </h1>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">
                    {isFarmerMode ? '🌾 किसान मोड' : '🔬 PRO'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden md:block">
                  {isFarmerMode ? 'कृषि AI सलाहकार • आसान किसान उपयोग' : 'Multimodal Remote-sensing & On-field AI Diagnostics'}
                </p>
              </div>
            </div>

            {/* Center: High-Tactile Audio Advice Spoken Action Button */}
            <button
              onClick={handleSpeakAdvice}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xl ${
                isSpeaking
                  ? 'btn-groot-voice animate-bounce'
                  : 'btn-groot-primary'
              }`}
              title="AI से सुनें किसान सलाह"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-spin' : ''}`} />
              <span className="font-display tracking-wide font-extrabold text-xs sm:text-sm">
                {isSpeaking ? 'बोल रहा है...' : (isFarmerMode ? '📢 क्या करें? (AI आवाज़ सुनें)' : '📢 Listen AI Action Plan')}
              </span>
            </button>

            {/* Right Action Controls: Mode Switcher, Language Switcher, Export */}
            <div className="flex items-center gap-2">
              
              {/* Mode Switcher Button */}
              <button
                onClick={() => {
                  audio.playClick();
                  onUiModeChange(isFarmerMode ? 'pro_agronomy' : 'farmer_easy');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                  isFarmerMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 hover:bg-emerald-500/30'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{isFarmerMode ? '🌾 किसान' : '🔬 प्रो'}</span>
              </button>

              {/* Regional Language Selector */}
              <div className="relative flex items-center">
                <Languages className="w-3.5 h-3.5 text-amber-300 absolute left-2.5 pointer-events-none" />
                <select
                  value={currentLanguage}
                  onChange={(e) => {
                    onLanguageChange(e.target.value as AppLanguage);
                    audio.playClick();
                  }}
                  className="glass-panel pl-8 pr-2.5 py-1.5 text-xs font-bold rounded-xl text-emerald-300 border border-emerald-500/40 hover:border-amber-400 focus:outline-none appearance-none cursor-pointer bg-slate-950"
                >
                  <option value="hi">🇮🇳 हिंदी</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="hinglish">🗣️ हिंग्लिश</option>
                </select>
              </div>

              {/* Export Dossier */}
              <button
                onClick={() => {
                  audio.playClick();
                  onOpenExportModal();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold btn-groot-secondary hidden lg:flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isFarmerMode ? 'रिपोर्ट' : 'Export'}</span>
              </button>

              {/* Reset Demo */}
              <button
                onClick={() => {
                  audio.playClick();
                  onResetDemo();
                }}
                className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-700 transition-all"
                title="Reset Demo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Mute Toggle */}
              <button
                onClick={handleMuteToggle}
                className="p-2 rounded-xl glass-panel text-slate-300 hover:text-amber-300 border border-slate-700 transition-all"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              </button>

            </div>

          </div>

          {/* Desktop Navigation Tabs (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center justify-between bg-slate-950/85 p-1.5 rounded-2xl border border-emerald-500/30 gap-1.5">
            <button
              onClick={() => {
                onTabChange('dashboard');
                audio.playClick();
              }}
              className={`flex-1 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'btn-groot-primary shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{currentLanguage === 'hi' ? '🏠 मुख्य खेत नक्शा' : '🏠 Overview Map'}</span>
            </button>

            <button
              onClick={() => {
                onTabChange('camera_doctor');
                audio.playClick();
              }}
              className={`flex-1 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'camera_doctor'
                  ? 'btn-groot-primary shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Camera className="w-4 h-4 animate-pulse" />
              <span>{currentLanguage === 'hi' ? '📸 फ़सल बीमारी जांच' : '📸 Leaf Diagnostics'}</span>
            </button>

            <button
              onClick={() => {
                onTabChange('fertilizer_doctor');
                audio.playClick();
              }}
              className={`flex-1 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'fertilizer_doctor'
                  ? 'btn-groot-primary shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentLanguage === 'hi' ? '🧪 खाद व दवाई डॉक्टर' : '🧪 Fertilizer & Pest'}</span>
            </button>

            <button
              onClick={() => {
                onTabChange('voice_assistant');
                audio.playClick();
              }}
              className={`flex-1 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'voice_assistant'
                  ? 'btn-groot-voice shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{currentLanguage === 'hi' ? '📢 किसान आवाज़ डॉक्टर' : '📢 Voice Assistant'}</span>
            </button>

            <button
              onClick={() => {
                onTabChange('sensor_simulator');
                audio.playClick();
              }}
              className={`flex-1 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'sensor_simulator'
                  ? 'btn-groot-secondary shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{currentLanguage === 'hi' ? '🎛️ सेंसर सिग्नल' : '🎛️ Sensor Signals'}</span>
            </button>
          </nav>

        </div>
      </header>

      {/* FIXED MOBILE BOTTOM DOCK NAVIGATION (Strictly optimized for mobile phones) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-amber-500/30 backdrop-blur-xl px-2 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-around gap-1">
          <button
            onClick={() => {
              onTabChange('dashboard');
              audio.playClick();
            }}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">खेत नक्शा</span>
          </button>

          <button
            onClick={() => {
              onTabChange('camera_doctor');
              audio.playClick();
            }}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
              activeTab === 'camera_doctor'
                ? 'bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-bold">रोग जांच</span>
          </button>

          <button
            onClick={() => {
              onTabChange('fertilizer_doctor');
              audio.playClick();
            }}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
              activeTab === 'fertilizer_doctor'
                ? 'bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-bold">खाद डॉक्टर</span>
          </button>

          <button
            onClick={() => {
              onTabChange('voice_assistant');
              audio.playClick();
            }}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
              activeTab === 'voice_assistant'
                ? 'bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span className="text-[10px] font-bold">आवाज़ मदद</span>
          </button>

          <button
            onClick={() => {
              onTabChange('sensor_simulator');
              audio.playClick();
            }}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
              activeTab === 'sensor_simulator'
                ? 'bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[10px] font-bold">सेंसर मोड</span>
          </button>
        </div>
      </div>
    </>
  );
};
