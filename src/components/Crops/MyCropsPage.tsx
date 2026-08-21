import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { AppLanguage, FarmPlot } from '../../types/groot';
import { CropVariety, CropCategory } from '../../types/crops';
import { GLOBAL_CROP_FAMILIES, ALL_CROP_VARIETIES } from '../../services/cropDatabase';
import { audio } from '../../services/audioService';

interface MyCropsPageProps {
  currentPlot?: FarmPlot;
  selectedVariety: CropVariety;
  onSelectVariety: (variety: CropVariety) => void;
  language: AppLanguage;
  onOpenCropSelector?: () => void;
}

export const MyCropsPage: React.FC<MyCropsPageProps> = ({
  selectedVariety,
  onSelectVariety,
  language,
}) => {
  const [activeCategory, setActiveCategory] = useState<CropCategory | 'all'>('all');
  const [selectedCropFamily, setSelectedCropFamily] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isHi = language === 'hi';

  const categories: { id: CropCategory | 'all'; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelHi: 'सभी फसलें', labelEn: 'All Crops', icon: '🌍' },
    { id: 'cereal', labelHi: 'अनाज (Grains)', labelEn: 'Grains', icon: '🌾' },
    { id: 'pulse', labelHi: 'दालें (Pulses)', labelEn: 'Pulses', icon: '🫘' },
    { id: 'oilseed', labelHi: 'तिलहन (Oilseeds)', labelEn: 'Oilseeds', icon: '🌻' },
    { id: 'vegetable', labelHi: 'सब्जियां (Vegetables)', labelEn: 'Vegetables', icon: '🥦' },
    { id: 'fruit', labelHi: 'फल (Fruits)', labelEn: 'Fruits', icon: '🍎' },
    { id: 'cash_crop', labelHi: 'अन्य फसलें (Other Crops)', labelEn: 'Other Crops', icon: '🌱' },
  ];

  // Registered crops across user's parcels
  const registeredCrops = [
    {
      id: 'reg_1',
      variety: ALL_CROP_VARIETIES.find(v => v.id === 'wheat_hd2967') || ALL_CROP_VARIETIES[0],
      fieldName: 'North Field (Plot #04)',
      sowingDate: '12 Nov 2025 (42 days ago)',
      health: '🟢 Healthy',
    },
    {
      id: 'reg_2',
      variety: ALL_CROP_VARIETIES.find(v => v.id === 'rice_basmati_1121') || ALL_CROP_VARIETIES[1],
      fieldName: 'East Basmati Field (Plot #08)',
      sowingDate: '28 Oct 2025 (55 days ago)',
      health: '🟡 Attention',
    },
    {
      id: 'reg_3',
      variety: ALL_CROP_VARIETIES.find(v => v.id === 'mustard_pusa_bold') || ALL_CROP_VARIETIES[7] || ALL_CROP_VARIETIES[0],
      fieldName: 'South Mustard Plot (Plot #03)',
      sowingDate: '20 Nov 2025 (32 days ago)',
      health: '🟢 Healthy',
    },
  ];

  const handleSelectCropAndDefaultVariety = (family: any, specificVariety?: CropVariety) => {
    audio.playClick();
    if (specificVariety) {
      onSelectVariety(specificVariety);
      setSelectedCropFamily(null);
    } else if (family.varieties && family.varieties.length > 0) {
      setSelectedCropFamily(family);
    }
  };

  const handleSelectUnknownVariety = (family: any) => {
    audio.playClick();
    const fallbackVariety: CropVariety = family.varieties[0] || {
      id: `${family.id}_general`,
      cropFamilyId: family.id,
      cropName: family.name,
      cropHindi: family.nameHindi,
      varietyName: 'General / Local',
      varietyHindi: 'सामान्य / देसी',
      category: family.category,
      durationDays: 120,
      waterRequirement: 'Medium',
      waterRequirementHindi: 'मध्यम',
      targetYieldQuintalPerAcre: 20,
      optimalNpkPerAcre: { nitrogenKg: 40, phosphorusKg: 20, potassiumKg: 20 },
      commonPests: ['General pests'],
      commonPestsHindi: ['सामान्य कीट'],
      recommendedFertilizerSummary: 'Balanced NPK',
      recommendedFertilizerSummaryHindi: 'संतुलित खाद',
      simpleAudioHi: `आपकी ${family.nameHindi} फसल चुन ली गई है।`,
      simpleAudioEn: `Your ${family.name} crop is selected.`,
      iconEmoji: family.iconEmoji || '🌱',
    };

    onSelectVariety(fallbackVariety);
    setSelectedCropFamily(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-[1400px] mx-auto">
      
      {/* 1. Header with Add Crop Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#1B2520] flex items-center gap-2">
            <span>🌾 {isHi ? 'मेरी फसलें (My Crops)' : 'My Crops & Varieties'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#66756D]">
            {isHi ? 'अपनी फसल और किस्म चुनें।' : 'Select active crop and variety with 1 tap.'}
          </p>
        </div>

        <button
          onClick={() => {
            audio.playClick();
            setIsAddModalOpen(true);
          }}
          className="groot-btn-primary px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>{isHi ? '+ फसल जोड़ें' : '+ Add Crop'}</span>
        </button>
      </div>

      {/* 2. Registered Farm Crops List (Active Switcher) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#66756D] uppercase tracking-wider px-1">
          {isHi ? 'खेत में बोई गई फसलें (Registered Crops)' : 'Your Farm Crops'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {registeredCrops.map((item) => {
            const isActive = selectedVariety.id === item.variety.id;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#EDF4EC] border-2 border-[#1F6B45] shadow-sm'
                    : 'bg-white border-[#DDE6DD] hover:border-[#66756D]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 rounded-xl bg-white border border-[#DDE6DD]">
                        {item.variety.iconEmoji || '🌾'}
                      </span>
                      <div>
                        <h4 className="font-bold text-[#1B2520] text-base">
                          {isHi ? item.variety.cropHindi : item.variety.cropName}
                        </h4>
                        <div className="text-xs font-semibold text-[#1F6B45]">
                          {item.variety.varietyHindi || item.variety.varietyName}
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <span className="px-2.5 py-1 rounded-full bg-[#1F6B45] text-white text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-[#66756D] pt-2 border-t border-[#DDE6DD]">
                    <div className="flex justify-between">
                      <span>Field:</span>
                      <span className="font-medium text-[#1B2520]">{item.fieldName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sowing:</span>
                      <span className="text-[#1B2520]">{item.sowingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health:</span>
                      <span className="font-bold">{item.health}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-[#DDE6DD]">
                  {isActive ? (
                    <div className="w-full py-2 rounded-xl bg-[#1F6B45]/15 text-[#1F6B45] font-bold text-center text-xs flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>{isHi ? 'यह फसल सक्रिय है' : 'Currently Active'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        audio.playClick();
                        onSelectVariety(item.variety);
                      }}
                      className="groot-btn-secondary w-full py-2 text-xs font-bold"
                    >
                      <span>{isHi ? 'यह फसल चुनें' : 'Select Crop'}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Visual Crop Catalog by Categories */}
      <div className="groot-card p-5 sm:p-6 bg-white space-y-4">
        
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#1B2520]">
            {isHi ? '🌾 फसल चुनें (All Agricultural Crops)' : 'Choose a Crop to Analyze'}
          </h3>
          <p className="text-xs text-[#66756D]">
            {isHi ? 'फसल पर टैप करके किस्म चुनें।' : 'Tap any crop below to view or choose its variety.'}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                audio.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#1F6B45] text-white shadow-sm'
                  : 'bg-[#F6F8F2] text-[#1B2520] border border-[#DDE6DD] hover:bg-[#EDF4EC]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{isHi ? cat.labelHi : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {GLOBAL_CROP_FAMILIES
            .filter(f => activeCategory === 'all' || f.category === activeCategory)
            .map((family) => (
              <button
                key={family.id}
                onClick={() => handleSelectCropAndDefaultVariety(family)}
                className="p-4 rounded-2xl bg-[#F6F8F2] border border-[#DDE6DD] hover:border-[#1F6B45] hover:bg-[#EDF4EC] transition-all text-center space-y-2 group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {family.iconEmoji || '🌱'}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1B2520]">
                    {isHi ? family.nameHindi : family.name}
                  </div>
                  <div className="text-[11px] text-[#66756D]">
                    {family.varieties.length} varieties
                  </div>
                </div>
              </button>
            ))}
        </div>

      </div>

      {/* 4. Variety Selection Modal (When a Crop is Tapped) */}
      {selectedCropFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-[#DDE6DD] rounded-2xl p-6 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE6DD]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCropFamily.iconEmoji || '🌾'}</span>
                <div>
                  <h3 className="text-lg font-black text-[#1B2520]">
                    {isHi ? `${selectedCropFamily.nameHindi} की कौन सी किस्म (Variety)?` : `Which ${selectedCropFamily.name} variety?`}
                  </h3>
                  <p className="text-xs text-[#66756D]">
                    {isHi ? 'किस्म चुनें या "पता नहीं" दबाएं।' : 'Select variety or tap "I don\'t know".'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCropFamily(null)}
                className="text-[#66756D] hover:text-[#1B2520] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Variety Options */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {selectedCropFamily.varieties.map((v: CropVariety) => (
                <button
                  key={v.id}
                  onClick={() => handleSelectCropAndDefaultVariety(selectedCropFamily, v)}
                  className="w-full p-3.5 rounded-xl bg-[#F6F8F2] hover:bg-[#EDF4EC] border border-[#DDE6DD] hover:border-[#1F6B45] text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-[#1B2520]">
                      {isHi ? v.varietyHindi : v.varietyName}
                    </div>
                    <div className="text-xs text-[#66756D]">
                      Duration: {v.durationDays} days • Yield: ~{v.targetYieldQuintalPerAcre} Q/Acre
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#1F6B45]" />
                </button>
              ))}

              {/* "Pata nahi" / I don't know Button (CRITICAL REQUIREMENT) */}
              <button
                onClick={() => handleSelectUnknownVariety(selectedCropFamily)}
                className="w-full p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-[#F2B84B] text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#C57A10]" />
                  <div>
                    <div className="font-bold text-sm text-[#1B2520]">
                      {isHi ? '❓ पता नहीं (General / Local)' : '❓ I Don\'t Know (Continue Anyway)'}
                    </div>
                    <div className="text-xs text-[#66756D]">
                      {isHi ? 'सामान्य मानकों के साथ आगे बढ़ें' : 'Use default standard thresholds'}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C57A10]" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Simple Add Crop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#DDE6DD] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-[#1B2520]">
              {isHi ? '🌾 नई फसल जोड़ें (Add Crop)' : '🌾 Add Crop'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              setIsAddModalOpen(false);
              audio.playClick();
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#1B2520] font-bold block mb-1">
                  {isHi ? 'फसल चुनें *' : 'Crop Name *'}
                </label>
                <select className="w-full bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl p-2.5 text-sm text-[#1B2520] focus:outline-none focus:border-[#1F6B45]">
                  <option value="wheat">Wheat / गेहूँ</option>
                  <option value="rice">Rice / धान</option>
                  <option value="mustard">Mustard / सरसों</option>
                  <option value="cotton">Cotton / कपास</option>
                </select>
              </div>

              <div>
                <label className="text-[#1B2520] font-bold block mb-1">
                  {isHi ? 'किस्म (Variety) — वैकल्पिक' : 'Variety — Optional'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. HD-2967 / Desi (Optional)"
                  className="w-full bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl p-2.5 text-sm text-[#1B2520] focus:outline-none focus:border-[#1F6B45]"
                />
              </div>

              <div>
                <label className="text-[#1B2520] font-bold block mb-1">
                  {isHi ? 'खेत का नाम — वैकल्पिक' : 'Field Name — Optional'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. North Plot #01"
                  className="w-full bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl p-2.5 text-sm text-[#1B2520] focus:outline-none focus:border-[#1F6B45]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DDE6DD]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="groot-btn-secondary px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="groot-btn-primary px-5 py-2 text-xs font-bold"
                >
                  {isHi ? 'फसल जोड़ें' : 'Add Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
