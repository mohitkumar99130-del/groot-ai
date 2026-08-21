import React, { useState } from 'react';
import { 
  Globe, 
  Volume2, 
  Sliders, 
  User, 
  Check, 
  CheckCircle2
} from 'lucide-react';
import { AppLanguage, UserUIMode, FarmerProfile } from '../../types/groot';
import { SUPPORTED_LANGUAGES } from '../../services/languageService';
import { audio } from '../../services/audioService';

interface SettingsPageProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  uiMode?: UserUIMode;
  onUiModeChange?: (mode: UserUIMode) => void;
  farmerProfile: FarmerProfile;
  onUpdateFarmerProfile: (profile: FarmerProfile) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  language,
  onLanguageChange,
  farmerProfile,
  onUpdateFarmerProfile,
}) => {
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [areaUnit, setAreaUnit] = useState<'acre' | 'hectare' | 'bigha'>('acre');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'quintal'>('kg');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isHi = language === 'hi';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playClick();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      
      {/* 1. Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>⚙️ {isHi ? 'सेटिंग्स व प्राथमिकताएं (Settings & Preferences)' : 'Settings & Preferences'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          {isHi ? 'भाषा, आवाज़, सूचनाएं और खाता सेटिंग्स को अनुकूलित करें' : 'Configure regional language, speech assistant, notification alerts, and farm profile'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{isHi ? 'सेटिंग्स सफलतापूर्वक सहेज ली गई हैं!' : 'Settings updated successfully!'}</span>
        </div>
      )}

      {/* 2. Language Selector (All 13 Indian Regional Languages) */}
      <div className="p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>1. {isHi ? 'भाषा चयन (App & Voice Language)' : 'App & Voice Language'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  audio.playClick();
                  onLanguageChange(lang.code);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold ring-2 ring-emerald-400/40 shadow-lg'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{lang.flagEmoji}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-black text-white">{lang.nativeName}</div>
                  <div className="text-[10px] text-slate-400">{lang.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Voice Assistant Settings */}
      <div className="p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Volume2 className="w-4 h-4" />
          <span>2. {isHi ? 'आवाज़ सहायक सेटिंग्स (Voice Assistant)' : 'Voice Assistant Settings'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white block">
              {isHi ? 'आवाज़ की गति (Speech Rate):' : 'Spoken Voice Speed:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0.85, label: isHi ? 'धीमी (Slow)' : 'Slow (0.85x)' },
                { val: 1.0, label: isHi ? 'सामान्य (Normal)' : 'Normal (1.0x)' },
                { val: 1.15, label: isHi ? 'तेज़ (Fast)' : 'Fast (1.15x)' },
              ].map((rate) => (
                <button
                  key={rate.val}
                  onClick={() => {
                    audio.playClick();
                    setSpeechRate(rate.val);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    speechRate === rate.val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">
                {isHi ? 'ऑटो ऑडियो प्ले (Auto-play Spoken Advice)' : 'Auto-Play Spoken Audio'}
              </div>
              <div className="text-[10px] text-slate-400">
                {isHi ? 'कार्ड दबाने पर तुरंत आवाज़ सलाह शुरू हो' : 'Play voice immediately on tapping cards'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoPlayAudio}
              onChange={(e) => setAutoPlayAudio(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Measurement Units */}
      <div className="p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>3. {isHi ? 'इकाइयां व माप (Measurement Units)' : 'Units & Measurements'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white block">
              {isHi ? 'जमीन माप इकाई (Land Area Unit):' : 'Land Area Unit:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['acre', 'hectare', 'bigha'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => {
                    audio.playClick();
                    setAreaUnit(unit);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    areaUnit === unit
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white block">
              {isHi ? 'वजन इकाई (Weight Unit):' : 'Weight Unit:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['kg', 'quintal'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => {
                    audio.playClick();
                    setWeightUnit(unit);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                    weightUnit === unit
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {unit === 'kg' ? 'Kilogram (Kg)' : 'Quintal (100 Kg)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Farmer Profile & Account */}
      <div className="p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>4. {isHi ? 'किसान खाता व विवरण (Farmer Profile)' : 'Farmer Profile & Farm Account'}</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                {isHi ? 'किसान का नाम:' : 'Farmer Full Name:'}
              </label>
              <input
                type="text"
                value={farmerProfile.name}
                onChange={(e) => onUpdateFarmerProfile({ ...farmerProfile, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                {isHi ? 'मोबाइल नंबर:' : 'Mobile Phone Number:'}
              </label>
              <input
                type="text"
                value={farmerProfile.phone}
                onChange={(e) => onUpdateFarmerProfile({ ...farmerProfile, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                {isHi ? 'गाँव / क्षेत्र:' : 'Village / Location:'}
              </label>
              <input
                type="text"
                value={farmerProfile.village}
                onChange={(e) => onUpdateFarmerProfile({ ...farmerProfile, village: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                {isHi ? 'जिला व राज्य:' : 'District & State:'}
              </label>
              <input
                type="text"
                value={`${farmerProfile.district}, ${farmerProfile.state}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  onUpdateFarmerProfile({
                    ...farmerProfile,
                    district: parts[0]?.trim() || farmerProfile.district,
                    state: parts[1]?.trim() || farmerProfile.state,
                  });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 text-xs"
            >
              {isHi ? 'सहेजें (Save Changes)' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
