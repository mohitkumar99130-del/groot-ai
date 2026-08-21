import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { AppLanguage, FarmPlot } from '../../types/groot';
import { CropVariety, CropCategory } from '../../types/crops';
import { GLOBAL_CROP_FAMILIES, ALL_CROP_VARIETIES } from '../../services/cropDatabase';
import { audio } from '../../services/audioService';

interface MyCropsPageProps {
  currentPlot: FarmPlot;
  selectedVariety: CropVariety;
  onSelectVariety: (variety: CropVariety) => void;
  language: AppLanguage;
  onOpenCropSelector: () => void;
}

export const MyCropsPage: React.FC<MyCropsPageProps> = ({
  selectedVariety,
  onSelectVariety,
  language,
  onOpenCropSelector,
}) => {
  const [activeCategory, setActiveCategory] = useState<CropCategory | 'all'>('all');
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [customCropName, setCustomCropName] = useState('');
  const [customVarietyName, setCustomVarietyName] = useState('');
  const [customSowingDate, setCustomSowingDate] = useState('2025-11-15');
  const [customField, setCustomField] = useState('North Terrace Plot #02');

  const isHi = language === 'hi';

  const categories: { id: CropCategory | 'all'; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelHi: 'सभी फसलें', labelEn: 'All Crops', icon: '🌍' },
    { id: 'cereal', labelHi: 'अनाज (धान, गेहूं, मक्का)', labelEn: 'Cereals & Grains', icon: '🌾' },
    { id: 'pulse', labelHi: 'दालें (चना, अरहर, मूंग)', labelEn: 'Pulses & Legumes', icon: '🫘' },
    { id: 'oilseed', labelHi: 'तिलहन (सरसों, सोयाबीन)', labelEn: 'Oilseeds', icon: '🌼' },
    { id: 'vegetable', labelHi: 'सब्जियां (आलू, टमाटर, प्याज़)', labelEn: 'Vegetables', icon: '🥔' },
    { id: 'fruit', labelHi: 'फल व बागवानी (आम, केला)', labelEn: 'Fruits', icon: '🥭' },
    { id: 'cash_crop', labelHi: 'व्यावसायिक (कपास, गन्ना)', labelEn: 'Cash Crops', icon: '🎋' },
  ];

  // Registered crops across user's farm parcels
  const registeredCrops = [
    {
      id: 'reg_1',
      variety: ALL_CROP_VARIETIES.find(v => v.id === 'wheat_hd2967') || ALL_CROP_VARIETIES[0],
      fieldName: 'North Wheat Field (Plot #04)',
      sowingDate: '12 Nov 2025 (42 days ago)',
      health: 'good',
      healthScore: 88,
      moisture: 58,
    },
    {
      id: 'reg_2',
      variety: ALL_CROP_VARIETIES.find(v => v.id === 'rice_basmati_1121') || ALL_CROP_VARIETIES[1],
      fieldName: 'East Basmati Field (Plot #08)',
      sowingDate: '28 Oct 2025 (55 days ago)',
      health: 'attention',
      healthScore: 72,
      moisture: 44,
    },
    {
      id: 'reg_3',
      variety: ALL_CROP_VARIETIES.find(v => v.id === 'mustard_pusa_bold') || ALL_CROP_VARIETIES[7] || ALL_CROP_VARIETIES[0],
      fieldName: 'South Mustard Plot (Plot #03)',
      sowingDate: '20 Nov 2025 (32 days ago)',
      health: 'good',
      healthScore: 91,
      moisture: 62,
    },
  ];

  const handleAddCustomVariety = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVarietyName.trim()) return;

    const newVariety: CropVariety = {
      id: `custom_${Date.now()}`,
      cropFamilyId: 'custom',
      cropName: customCropName || 'My Custom Crop',
      cropHindi: customCropName || 'मेरी फसल',
      varietyName: customVarietyName,
      varietyHindi: customVarietyName,
      category: 'cereal',
      iconEmoji: '🌱',
      grainType: 'Custom Hybrid',
      grainTypeHindi: 'हाइब्रिड किस्म',
      durationDays: 120,
      waterRequirement: 'Medium',
      waterRequirementHindi: 'मध्यम सिंचाई',
      targetYieldQuintalPerAcre: 24,
      expectedYieldPerAcre: '22-26 Quintal',
      optimalNpkPerAcre: { nitrogenKg: 45, phosphorusKg: 25, potassiumKg: 20 },
      commonPests: ['Aphids', 'Fungal Rust'],
      commonPestsHindi: ['चेपा / माहू', 'रतुआ / गेरुआ रोग'],
      recommendedFertilizerSummary: 'Apply 45kg N, 25kg P, 20kg K per acre',
      recommendedFertilizerSummaryHindi: 'प्रति एकड़ 45 किग्रा नाइट्रोजन, 25 किग्रा फास्फोरस दें',
      simpleAudioHi: `आपकी नई किस्म ${customVarietyName} सक्रिय कर दी गई है।`,
      simpleAudioEn: `Your new variety ${customVarietyName} is now active.`,
    };

    onSelectVariety(newVariety);
    setIsAddCustomOpen(false);
    audio.playClick();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header with Add Crop Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>🌾 {isHi ? 'मेरी फसलें और किस्में (My Crops & Varieties)' : 'My Crops & Varieties'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {isHi 
              ? 'अपने खेत की फसलें चुनें, बदलें और नई किस्में जोड़ें।' 
              : 'Manage registered farm crops, select active variety, and add new crops.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              audio.playClick();
              setIsAddCustomOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{isHi ? '+ नई फसल / किस्म जोड़ें' : '+ Add Crop / Variety'}</span>
          </button>
        </div>
      </div>

      {/* 2. Registered Farm Crops List (Active Context Switcher) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono px-1">
          {isHi ? 'खेत में बोई गई फसलें (Registered Crops)' : 'Registered Crops on Your Farm'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {registeredCrops.map((item) => {
            const isActive = selectedVariety.id === item.variety.id;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-br from-emerald-950/80 to-[#021f10] border-2 border-emerald-400 shadow-xl ring-2 ring-emerald-400/30'
                    : 'bg-[#03140a] border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase shadow-md">
                    ACTIVE • सक्रिय
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-800">
                      {item.variety.iconEmoji || '🌾'}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {isHi ? item.variety.cropHindi : item.variety.cropName}
                      </h4>
                      <div className="text-xs text-emerald-400 font-semibold">
                        {isHi ? item.variety.varietyHindi : item.variety.varietyName}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Field:</span>
                      <span className="font-medium text-white">{item.fieldName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Sowing:</span>
                      <span className="text-amber-300">{item.sowingDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Health:</span>
                      <span className="font-bold text-emerald-400">Score {item.healthScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-800/80">
                  {isActive ? (
                    <div className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-center text-xs border border-emerald-500/40 flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>{isHi ? 'यह फसल सक्रिय है' : 'Currently Analyzing'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        audio.playClick();
                        onSelectVariety(item.variety);
                      }}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold text-center text-xs border border-slate-800 hover:border-emerald-400 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{isHi ? 'इस फसल को सक्रिय करें' : 'Switch Active Crop'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Global Crop Catalog (Category Cards & Search) */}
      <div className="p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>🌍 {isHi ? 'समस्त भारतीय व वैश्विक फसलें (Crop Catalog)' : 'All Agricultural Crops & Varieties'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isHi ? '35+ प्रमाणित फसलें और किस्में वैज्ञानिक मानकों सहित' : 'Explore 35+ verified varieties with calibrated NPK & water thresholds'}
            </p>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onOpenCropSelector();
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-2"
          >
            <span>{isHi ? 'पूरा वैरायटी सिलेक्टर खोलें' : 'Open Full Variety Modal'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                audio.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{isHi ? cat.labelHi : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GLOBAL_CROP_FAMILIES
            .filter(f => activeCategory === 'all' || f.category === activeCategory)
            .map((family) => (
              <div
                key={family.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{family.iconEmoji}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {isHi ? family.nameHindi : family.name}
                      </h4>
                      <div className="text-[10px] text-slate-400">
                        {family.varieties.length} varieties available
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800">
                  {family.varieties.slice(0, 3).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        audio.playClick();
                        onSelectVariety(v);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        selectedVariety.id === v.id
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{isHi ? v.varietyHindi : v.varietyName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{v.durationDays}d</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>

      </div>

      {/* 4. Modal: + Add Custom Crop/Variety */}
      {isAddCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#031108] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>🌱 {isHi ? 'नई फसल या किस्म जोड़ें' : '+ Add Custom Crop / Variety'}</span>
            </h3>
            
            <form onSubmit={handleAddCustomVariety} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isHi ? 'फसल का नाम (Crop Name):' : 'Crop Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheat / धान / Mustard"
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {isHi ? 'किस्म / वैरायटी (Variety Name):' : 'Variety / Sub-component:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HD-3086 / Pusa 1509 / Local Desi"
                  value={customVarietyName}
                  onChange={(e) => setCustomVarietyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {isHi ? 'बुवाई की तारीख:' : 'Sowing Date:'}
                  </label>
                  <input
                    type="date"
                    value={customSowingDate}
                    onChange={(e) => setCustomSowingDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    {isHi ? 'खेत का नाम:' : 'Field / Parcel:'}
                  </label>
                  <input
                    type="text"
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCustomOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg"
                >
                  {isHi ? 'सहेजें व सक्रिय करें' : 'Save & Make Active'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
