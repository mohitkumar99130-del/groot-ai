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
    <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl mx-auto">
      
      {/* 1. Header Bar */}
      <div className="groot-card p-5 sm:p-6 bg-white space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-[#1B2520] flex items-center gap-2">
          <span>⚙️ {isHi ? 'सेटिंग्स व प्राथमिकताएं' : 'Settings & Preferences'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#66756D]">
          {isHi ? 'भाषा, आवाज़, इकाइयां और किसान प्रोफाइल को बदलें' : 'Configure regional language, voice speech speed, and farm profile'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-[#EDF4EC] border border-[#DDE6DD] text-[#1F6B45] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#1F6B45]" />
          <span>{isHi ? 'सेटिंग्स सफलतापूर्वक सहेज ली गई हैं!' : 'Settings updated successfully!'}</span>
        </div>
      )}

      {/* 2. Language Selector (All 13 Indian Regional Languages) */}
      <div className="groot-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2 text-[#1F6B45] font-bold text-xs uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>1. {isHi ? 'भाषा चयन (Language)' : 'App & Voice Language'}</span>
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
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EDF4EC] border-2 border-[#1F6B45] text-[#1B2520] font-bold shadow-sm'
                    : 'bg-[#F6F8F2] text-[#1B2520] border-[#DDE6DD] hover:bg-[#EDF4EC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{lang.flagEmoji}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#1F6B45]" />}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-black text-[#1B2520]">{lang.nativeName}</div>
                  <div className="text-[11px] text-[#66756D]">{lang.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Voice Assistant Settings */}
      <div className="groot-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2 text-[#1F6B45] font-bold text-xs uppercase tracking-wider">
          <Volume2 className="w-4 h-4" />
          <span>2. {isHi ? 'आवाज़ सहायक सेटिंग्स' : 'Voice Assistant Speed'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] space-y-2">
            <label className="text-xs font-bold text-[#1B2520] block">
              {isHi ? 'आवाज़ की गति (Speech Speed):' : 'Speech Speed:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0.85, label: isHi ? 'धीमी' : 'Slow (0.85x)' },
                { val: 1.0, label: isHi ? 'सामान्य' : 'Normal (1.0x)' },
                { val: 1.15, label: isHi ? 'तेज़' : 'Fast (1.15x)' },
              ].map((rate) => (
                <button
                  key={rate.val}
                  onClick={() => {
                    audio.playClick();
                    setSpeechRate(rate.val);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    speechRate === rate.val
                      ? 'bg-[#1F6B45] text-white border-[#1F6B45]'
                      : 'bg-white text-[#1B2520] border-[#DDE6DD]'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] space-y-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#1B2520]">
                {isHi ? 'ऑटो ऑडियो प्ले (Auto-play Audio)' : 'Auto-Play Spoken Audio'}
              </div>
              <div className="text-[11px] text-[#66756D]">
                {isHi ? 'कार्ड दबाने पर तुरंत आवाज़ सलाह शुरू हो' : 'Play spoken audio when viewing advice'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoPlayAudio}
              onChange={(e) => setAutoPlayAudio(e.target.checked)}
              className="w-5 h-5 accent-[#1F6B45] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Measurement Units */}
      <div className="groot-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2 text-[#1F6B45] font-bold text-xs uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>3. {isHi ? 'इकाइयां व माप (Measurement Units)' : 'Units & Measurements'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] space-y-2">
            <label className="text-xs font-bold text-[#1B2520] block">
              {isHi ? 'जमीन माप इकाई:' : 'Land Area Unit:'}
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
                      ? 'bg-[#1F6B45] text-white border-[#1F6B45]'
                      : 'bg-white text-[#1B2520] border-[#DDE6DD]'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] space-y-2">
            <label className="text-xs font-bold text-[#1B2520] block">
              {isHi ? 'वजन इकाई:' : 'Weight Unit:'}
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
                      ? 'bg-[#1F6B45] text-white border-[#1F6B45]'
                      : 'bg-white text-[#1B2520] border-[#DDE6DD]'
                  }`}
                >
                  {unit === 'kg' ? 'Kg' : 'Quintal (100 Kg)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Farmer Profile */}
      <div className="groot-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2 text-[#1F6B45] font-bold text-xs uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>4. {isHi ? 'किसान खाता व विवरण' : 'Farmer Profile'}</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[#1B2520] font-bold block mb-1">
                {isHi ? 'किसान का नाम:' : 'Farmer Full Name:'}
              </label>
              <input
                type="text"
                value={farmerProfile.name}
                onChange={(e) => onUpdateFarmerProfile({ ...farmerProfile, name: e.target.value })}
                className="w-full bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl p-2.5 text-sm text-[#1B2520] focus:outline-none focus:border-[#1F6B45]"
              />
            </div>

            <div>
              <label className="text-[#1B2520] font-bold block mb-1">
                {isHi ? 'मोबाइल नंबर:' : 'Mobile Phone:'}
              </label>
              <input
                type="text"
                value={farmerProfile.phone}
                onChange={(e) => onUpdateFarmerProfile({ ...farmerProfile, phone: e.target.value })}
                className="w-full bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl p-2.5 text-sm text-[#1B2520] focus:outline-none focus:border-[#1F6B45]"
              />
            </div>

            <div>
              <label className="text-[#1B2520] font-bold block mb-1">
                {isHi ? 'गाँव / क्षेत्र:' : 'Village / Area:'}
              </label>
              <input
                type="text"
                value={farmerProfile.village}
                onChange={(e) => onUpdateFarmerProfile({ ...farmerProfile, village: e.target.value })}
                className="w-full bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl p-2.5 text-sm text-[#1B2520] focus:outline-none focus:border-[#1F6B45]"
              />
            </div>

            <div>
              <label className="text-[#1B2520] font-bold block mb-1">
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
                className="w-full bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl p-2.5 text-sm text-[#1B2520] focus:outline-none focus:border-[#1F6B45]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="groot-btn-primary px-6 py-2.5 text-xs font-bold shadow-sm"
            >
              {isHi ? 'सहेजें (Save Changes)' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
