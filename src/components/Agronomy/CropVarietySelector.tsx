import React, { useState, useMemo } from 'react';
import { CropVariety, CropCategory } from '../../types/crops';
import { GLOBAL_CROP_FAMILIES, ALL_CROP_VARIETIES } from '../../services/cropDatabase';
import { AppLanguage } from '../../types/groot';
import { 
  X, 
  Search, 
  Check, 
  Volume2, 
  Sprout, 
  Droplets, 
  Calendar, 
  TrendingUp, 
  Layers
} from 'lucide-react';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';

interface CropVarietySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVariety: CropVariety;
  onSelectVariety: (variety: CropVariety) => void;
  language: AppLanguage;
}

export const CropVarietySelector: React.FC<CropVarietySelectorProps> = ({
  isOpen,
  onClose,
  selectedVariety,
  onSelectVariety,
  language,
}) => {
  const [activeCategory, setActiveCategory] = useState<CropCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVarietyId, setPlayingVarietyId] = useState<string | null>(null);

  const isHi = language === 'hi';

  const categories: { id: CropCategory | 'all'; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelHi: 'सभी फसलें', labelEn: 'All Crops', icon: '🌍' },
    { id: 'cereal', labelHi: 'अनाज (धान, गेहूं, मक्का)', labelEn: 'Cereals', icon: '🌾' },
    { id: 'pulse', labelHi: 'दालें (चना, अरहर, मूंग)', labelEn: 'Pulses', icon: '🫘' },
    { id: 'millet', labelHi: 'मिलेट्स (बाजरा, रागी, ज्वार)', labelEn: 'Millets', icon: '🌾' },
    { id: 'cash_crop', labelHi: 'व्यावसायिक (कपास, गन्ना)', labelEn: 'Cash Crops', icon: '🎋' },
    { id: 'oilseed', labelHi: 'तिलहन (सरसों, सोयाबीन)', labelEn: 'Oilseeds', icon: '🌼' },
    { id: 'vegetable', labelHi: 'सब्जियां (आलू, टमाटर, प्याज़)', labelEn: 'Vegetables', icon: '🥔' },
    { id: 'spice', labelHi: 'मसाले (मिर्च, हल्दी)', labelEn: 'Spices', icon: '🌶️' },
    { id: 'fruit', labelHi: 'फल व बागवानी (आम, केला)', labelEn: 'Fruits', icon: '🥭' },
  ];

  // Filtered varieties based on category and search
  const filteredFamilies = useMemo(() => {
    return GLOBAL_CROP_FAMILIES.map((family) => {
      // Category match
      if (activeCategory !== 'all' && family.category !== activeCategory) {
        return null;
      }

      // Filter varieties inside family
      const matchingVarieties = family.varieties.filter((v) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          v.varietyName.toLowerCase().includes(q) ||
          v.varietyHindi.toLowerCase().includes(q) ||
          v.cropName.toLowerCase().includes(q) ||
          v.cropHindi.toLowerCase().includes(q) ||
          v.grainType.toLowerCase().includes(q) ||
          v.grainTypeHindi.toLowerCase().includes(q)
        );
      });

      if (matchingVarieties.length === 0) return null;

      return {
        ...family,
        varieties: matchingVarieties,
      };
    }).filter(Boolean);
  }, [activeCategory, searchQuery]);

  const handlePlayVarietyAudio = (e: React.MouseEvent, variety: CropVariety) => {
    e.stopPropagation();
    audio.playClick();

    if (playingVarietyId === variety.id) {
      realVoiceService.stop();
      setPlayingVarietyId(null);
      return;
    }

    setPlayingVarietyId(variety.id);
    const audioText = isHi ? variety.simpleAudioHi : variety.simpleAudioEn;
    realVoiceService.speak(audioText, isHi ? 'hi' : 'en', () => {
      setPlayingVarietyId(null);
    });
  };

  const handleSelect = (variety: CropVariety) => {
    audio.playClick();
    onSelectVariety(variety);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-agri-950 border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-emerald-500/20 bg-gradient-to-r from-agri-900/90 via-emerald-950/70 to-agri-950 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-2xl text-white flex items-center gap-2">
                <span>{isHi ? '🌾 फसल व किस्म चुनें' : '🌾 Select Crop & Sub-Variety'}</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {ALL_CROP_VARIETIES.length} Varieties
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                {isHi
                  ? 'विश्व व भारत की सभी प्रमुख फसलें और उनकी किस्में (बासमती, छोटा दाना, कनी चावल, शरबती गेहूं, मक्का आदि)'
                  : 'Comprehensive database of global crops and sub-varieties for calibrated agronomic advisory.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Active Variety Quick Pill */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-agri-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'फसल या किस्म खोजें (उदा. बासमती, गेहूं, कनी, मक्का)...' : 'Search crop or variety (e.g. Basmati, Sona, Wheat, Corn)...'}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 text-white placeholder:text-slate-500 border border-emerald-500/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Current Selection Reminder */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 text-xs font-mono">
            <span className="text-slate-400">{isHi ? 'वर्तमान चयन:' : 'Active:'}</span>
            <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5">
              <span>{selectedVariety.iconEmoji}</span>
              <span>{isHi ? selectedVariety.varietyHindi : selectedVariety.varietyName}</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-800/80 bg-slate-950/60 overflow-x-auto no-scrollbar flex items-center gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  audio.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                    : 'agri-card-subtle text-slate-300 border-slate-800 hover:border-emerald-500/30 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isHi ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Varieties Grid List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
          {filteredFamilies.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">🌾</div>
              <h3 className="text-base font-bold text-slate-300">
                {isHi ? 'कोई किस्म नहीं मिली' : 'No matching crop varieties found'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? 'कृपया अलग नाम खोजें या श्रेणी बदलें।' : 'Try adjusting your search keywords or category filters.'}
              </p>
            </div>
          ) : (
            filteredFamilies.map((family: any) => (
              <div key={family.id} className="space-y-3">
                
                {/* Crop Family Group Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{family.iconEmoji}</span>
                    <div>
                      <h3 className="font-display font-black text-base sm:text-lg text-white">
                        {isHi ? family.nameHindi : family.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-sans">
                        {isHi ? family.descriptionHindi : family.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                    {family.varieties.length} {isHi ? 'किस्में' : 'Varieties'}
                  </span>
                </div>

                {/* Sub-Variety Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {family.varieties.map((variety: CropVariety) => {
                    const isSelected = selectedVariety.id === variety.id;
                    const isPlaying = playingVarietyId === variety.id;

                    return (
                      <div
                        key={variety.id}
                        onClick={() => handleSelect(variety)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-agri-950 border-emerald-400 shadow-xl ring-2 ring-emerald-400/40'
                            : 'agri-card hover:border-emerald-500/50 hover:bg-emerald-950/20'
                        }`}
                      >
                        {/* Top: Variety Name & Grain Badge */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <h4 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                                {isHi ? variety.varietyHindi : variety.varietyName}
                              </h4>
                              <div className="text-[11px] font-mono text-emerald-400 font-medium">
                                {isHi ? variety.grainTypeHindi : variety.grainType}
                              </div>
                            </div>

                            {isSelected && (
                              <span className="p-1 rounded-full bg-emerald-500 text-slate-950 shrink-0">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </span>
                            )}
                          </div>

                          {/* Quick Agronomic Attribute Tags */}
                          <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono">
                            {/* Duration */}
                            <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-center">
                              <span className="text-slate-400 flex items-center justify-center gap-0.5">
                                <Calendar className="w-2.5 h-2.5 text-amber-400" />
                                {isHi ? 'अवधि' : 'Days'}
                              </span>
                              <strong className="text-white block mt-0.5">
                                {variety.durationDays}d
                              </strong>
                            </div>

                            {/* Water Requirement */}
                            <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-center">
                              <span className="text-slate-400 flex items-center justify-center gap-0.5">
                                <Droplets className="w-2.5 h-2.5 text-cyan-400" />
                                {isHi ? 'पानी' : 'Water'}
                              </span>
                              <strong className="text-cyan-300 block mt-0.5 truncate">
                                {variety.waterRequirement}
                              </strong>
                            </div>

                            {/* Target Yield */}
                            <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-center">
                              <span className="text-slate-400 flex items-center justify-center gap-0.5">
                                <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                                {isHi ? 'पैदावार' : 'Yield'}
                              </span>
                              <strong className="text-emerald-300 block mt-0.5">
                                ~{variety.targetYieldQuintalPerAcre} Q/Ac
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Action Buttons */}
                        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          {/* Listen Variety Audio Button */}
                          <button
                            onClick={(e) => handlePlayVarietyAudio(e, variety)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                              isPlaying
                                ? 'bg-amber-400 text-slate-950 animate-pulse'
                                : 'bg-slate-900 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                            }`}
                            title={isHi ? 'इस किस्म की जानकारी सुनें' : 'Listen to variety audio overview'}
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
                            <span>{isPlaying ? (isHi ? 'बोल रहा है...' : 'Playing...') : (isHi ? 'आवाज़ सुनें' : 'Listen')}</span>
                          </button>

                          {/* Select Button */}
                          <button
                            onClick={() => handleSelect(variety)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 font-black'
                                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40'
                            }`}
                          >
                            {isSelected ? (isHi ? 'सक्रिय है' : 'Selected') : (isHi ? 'यह चुनें' : 'Select')}
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Bottom Footer Help Bar */}
        <div className="p-3 sm:p-4 border-t border-emerald-500/20 bg-agri-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>
              {isHi
                ? 'किस्म चुनने से खाद की गणना और आवाज़ सलाह स्वतः बदल जाती है।'
                : 'Selecting a variety dynamically recalibrates fertilizer NPK dosages and spoken audio.'}
            </span>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-700 transition-colors"
          >
            {isHi ? 'बंद करें (Close)' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
