import { useState } from 'react';
import { FusionResult, FieldZone, AppLanguage, SensorTelemetry } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { ALL_CROP_VARIETIES } from '../../services/cropDatabase';
import { 
  FlaskConical, 
  Calendar, 
  Volume2, 
  Scale,
  DollarSign,
  Sprout
} from 'lucide-react';

import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';

interface FertilizerCalculatorProps {
  fusion: FusionResult;
  zone: FieldZone;
  telemetry: SensorTelemetry;
  variety?: CropVariety;
  language: AppLanguage;
}

export const FertilizerCalculator: React.FC<FertilizerCalculatorProps> = ({
  zone,
  telemetry,
  variety = ALL_CROP_VARIETIES[0],
  language,
}) => {

  const [fieldSizeAcre, setFieldSizeAcre] = useState<number>(2.5); // Default 2.5 acres
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dynamic calculations per acre based on selected variety's target NPK
  const targetN = variety.optimalNpkPerAcre.nitrogenKg;
  const targetP = variety.optimalNpkPerAcre.phosphorusKg;
  const targetK = variety.optimalNpkPerAcre.potassiumKg;

  const nDeficit = Math.max(0, targetN - telemetry.npk.nitrogen);
  const pDeficit = Math.max(0, targetP - telemetry.npk.phosphorus);
  const kDeficit = Math.max(0, targetK - telemetry.npk.potassium);

  // Urea (46% N) = (N deficit * 2.17) kg/acre
  const ureaPerAcre = Math.round(nDeficit > 0 ? (nDeficit * 2.17 + (targetN * 0.4)) : targetN);
  const totalUrea = Math.round(ureaPerAcre * fieldSizeAcre);
  const ureaBags = (totalUrea / 45).toFixed(1); // 45kg bag

  // DAP (18% N, 46% P2O5) = (P deficit * 2.17) kg/acre
  const dapPerAcre = Math.round(pDeficit > 0 ? (pDeficit * 2.17 + (targetP * 0.3)) : targetP);
  const totalDap = Math.round(dapPerAcre * fieldSizeAcre);
  const dapBags = (totalDap / 50).toFixed(1); // 50kg bag

  // MOP (60% K2O) = (K deficit * 1.66) kg/acre
  const mopPerAcre = Math.round(kDeficit > 0 ? (kDeficit * 1.66 + (targetK * 0.3)) : targetK);
  const totalMop = Math.round(mopPerAcre * fieldSizeAcre);
  const mopBags = (totalMop / 50).toFixed(1);

  // Estimated Cost calculation (INR)
  const estimatedCost = Math.round(
    (totalUrea * 6.5) + (totalDap * 27.0) + (totalMop * 34.0) + (fieldSizeAcre * 450)
  );

  const handleSpeakFertilizer = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const text = language === 'hi'
      ? `आपके ${fieldSizeAcre} एकड़ ${variety.varietyHindi} खेत के लिए खाद की गणना: नीम कोटेड यूरिया कुल ${totalUrea} किलोग्राम (लगभग ${ureaBags} बोरी), डीएपी खाद ${totalDap} किलोग्राम, तथा पोटाश ${totalMop} किलोग्राम डालें। पहली खुराक सिंचाई के तुरंत बाद सुबह दें।`
      : `Fertilizer dosage prescription for ${fieldSizeAcre} acres of ${variety.varietyName}: Neem Coated Urea total ${totalUrea} kg (approx ${ureaBags} bags), DAP total ${totalDap} kg, and MOP total ${totalMop} kg. Apply initial split post-irrigation in early morning.`;
    await realVoiceService.speak(text, language === 'hi' ? 'hi' : 'en');
    setIsSpeaking(false);
  };

  return (
    <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/30 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg sm:text-xl text-white flex flex-wrap items-center gap-2">
              <span>{language === 'hi' ? 'सटीक खाद व पोषक तत्व कैलकुलेटर' : 'Precision N-P-K Fertilizer Rx Engine'}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                <Sprout className="w-3 h-3 text-emerald-400" />
                {language === 'hi' ? variety.varietyHindi : variety.varietyName}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-500/40 font-bold">
                ZONE {zone.id}
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Automated Agronomic Calculations Calibrated to Real-Time ESP32 Soil Sensor Telemetry & {variety.varietyName} targets.
            </p>
          </div>
        </div>

        <button
          onClick={handleSpeakFertilizer}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl ${
            isSpeaking ? 'btn-agri-voice animate-pulse' : 'btn-agri-voice'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isSpeaking ? 'बोल रहा है...' : (language === 'hi' ? '🔊 खाद गणना सुनें' : '🔊 Listen Dosage Audio')}</span>
        </button>
      </div>

      {/* Interactive Acreage Slider */}
      <div className="agri-card p-4 sm:p-5 rounded-2xl border border-emerald-500/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'खेत का क्षेत्रफल चुनें (Field Size):' : 'Adjust Target Field Area:'}</span>
          </div>
          <div className="text-sm font-mono font-black text-emerald-300 bg-slate-950 px-3 py-1 rounded-xl border border-emerald-500/40">
            {fieldSizeAcre} {language === 'hi' ? 'एकड़ (Acres)' : 'Acres'} • {(fieldSizeAcre * 0.4047).toFixed(2)} Ha
          </div>
        </div>

        <input
          type="range"
          min="0.5"
          max="25.0"
          step="0.5"
          value={fieldSizeAcre}
          onChange={(e) => {
            setFieldSizeAcre(Number(e.target.value));
            audio.playClick();
          }}
          className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>0.5 Acre (Smallholder)</span>
          <span>10.0 Acres</span>
          <span>25.0 Acres (Estate Plot)</span>
        </div>
      </div>

      {/* Commercial Fertilizer Dosage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Urea Card */}
        <div className="agri-card p-4 rounded-2xl border border-emerald-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white">1. Neem Coated Urea</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                46% N
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              {language === 'hi' ? 'नीम लेपित यूरिया (क्लोरोफिल व वानस्पतिक वृद्धि)' : 'Nitrogen booster for vegetative tillers'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Total Quantity:</span>
              <span className="text-xl font-black text-emerald-400">{totalUrea} kg</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-1">
              <span>Standard 45kg Bags:</span>
              <strong className="text-slate-200">{ureaBags} Bags</strong>
            </div>
            <div className="text-[10px] text-emerald-400/90">
              Rate: {ureaPerAcre} kg / Acre (Split into 2 applications)
            </div>
          </div>
        </div>

        {/* DAP Card */}
        <div className="agri-card p-4 rounded-2xl border border-amber-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white">2. Di-Ammonium Phosphate (DAP)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                18-46-0
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              {language === 'hi' ? 'डीएपी / सुपर फास्फेट (जड़ों का फैलाव)' : 'Root proliferation & early seedling vigor'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Total Quantity:</span>
              <span className="text-xl font-black text-amber-400">{totalDap} kg</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-1">
              <span>Standard 50kg Bags:</span>
              <strong className="text-slate-200">{dapBags} Bags</strong>
            </div>
            <div className="text-[10px] text-amber-400/90">
              Rate: {dapPerAcre} kg / Acre (Basal Root Application)
            </div>
          </div>
        </div>

        {/* MOP (Potash) Card */}
        <div className="agri-card p-4 rounded-2xl border border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white">3. Muriate of Potash (MOP)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                60% K₂O
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              {language === 'hi' ? 'पोटाश खाद (रोग प्रतिरोधक क्षमता व दाना भराव)' : 'Disease resistance & grain weight maximization'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Total Quantity:</span>
              <span className="text-xl font-black text-cyan-400">{totalMop} kg</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-1">
              <span>Standard 50kg Bags:</span>
              <strong className="text-slate-200">{mopBags} Bags</strong>
            </div>
            <div className="text-[10px] text-cyan-400/90">
              Rate: {mopPerAcre} kg / Acre (Panicle Initiation Stage)
            </div>
          </div>
        </div>

      </div>

      {/* Split-Dose Application Calendar */}
      <div className="agri-card p-4 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-400" />
          {language === 'hi' ? 'खाद डालने का वैज्ञानिक समय चक्र (Application Calendar)' : 'Split-Dose Application Timing'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="agri-card-subtle p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold block">1. BASAL STAGE (Transplanting)</span>
            <div className="font-bold text-white">Full DAP ({totalDap} kg) + 50% MOP</div>
            <p className="text-[11px] text-slate-400">Mix thoroughly into wet soil before transplanting.</p>
          </div>

          <div className="agri-card-subtle p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">2. TILLERING STAGE (Day 21-25)</span>
            <div className="font-bold text-white">50% Urea ({Math.round(totalUrea * 0.5)} kg) + Zinc</div>
            <p className="text-[11px] text-slate-400">Top dress after draining excess water; irrigate next day.</p>
          </div>

          <div className="agri-card-subtle p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold block">3. PANICLE STAGE (Day 45-50)</span>
            <div className="font-bold text-white">50% Urea ({Math.round(totalUrea * 0.5)} kg) + 50% MOP</div>
            <p className="text-[11px] text-slate-400">Apply during early morning for complete grain filling.</p>
          </div>
        </div>
      </div>

      {/* Estimated Economics Summary */}
      <div className="agri-card-subtle p-4 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">Estimated Direct Input Cost (Government Subsidized Rates):</span>
        </div>
        <div className="text-base font-black text-amber-300">
          ₹{estimatedCost.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">INR Total</span>
        </div>
      </div>
    </div>
  );
};
