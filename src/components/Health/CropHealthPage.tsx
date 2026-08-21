import React, { useState } from 'react';
import { 
  HeartPulse, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Activity
} from 'lucide-react';
import { AppLanguage, FusionResult, FieldZone, SensorTelemetry, LeafSample } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';
import { getMultilingualVoiceScripts } from '../../services/languageService';

interface CropHealthPageProps {
  fusion: FusionResult;
  zone: FieldZone;
  telemetry: SensorTelemetry;
  leaf: LeafSample;
  variety: CropVariety;
  language: AppLanguage;
  onNavigateTab?: (tab: any) => void;
}

export const CropHealthPage: React.FC<CropHealthPageProps> = ({
  fusion,
  zone,
  telemetry,
  leaf,
  variety,
  language,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isHi = language === 'hi';
  const isHighRisk = fusion.riskPercentage > 50;

  // Mock weather for speech scripts
  const mockWeather = {
    temperature: 28.4,
    humidity: 64,
    windSpeed: 8.8,
    windDirection: 60,
    weatherCode: 1,
    condition: 'Sunny',
    conditionHindi: 'साफ़ धूप',
    isDay: true,
    rainMm: 0,
    sprayAdvisory: 'Optimal' as const,
    sprayAdvisoryHindi: 'सर्वोत्तम समय',
    lastUpdated: 'Live',
    source: 'Open-Meteo',
  };

  const scripts = getMultilingualVoiceScripts(language, fusion, zone, telemetry, leaf, variety, mockWeather);

  const handleSpeakHealth = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    await realVoiceService.speak(scripts.health, language);
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Overall Crop Health Banner (Simple First) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#021f10] via-[#04190e] to-slate-950 border-2 border-emerald-500/40 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isHi ? 'फसल स्वास्थ्य स्थिति (Overall Crop Health)' : 'Overall Crop Health Status'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {variety.iconEmoji} {variety.varietyName} • Target Sector {zone.id}
            </p>
          </div>

          {/* Large Spoken Audio Voice Button */}
          <button
            onClick={handleSpeakHealth}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl transition-all ${
              isSpeaking
                ? 'btn-agri-voice animate-pulse ring-2 ring-amber-400'
                : 'btn-agri-voice'
            }`}
          >
            <Volume2 className={`w-4 h-4 text-slate-950 ${isSpeaking ? 'animate-bounce' : ''}`} />
            <span>{isSpeaking ? 'बोल रहा है...' : (isHi ? '🔊 आवाज़ में समझें (Listen Advice)' : '🔊 Explain in Voice')}</span>
          </button>
        </div>

        {/* Big Health Rating Indicator */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              {isHighRisk ? '🟡' : '🟢'}
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-white">
                {isHighRisk
                  ? (isHi ? 'ध्यान देने की आवश्यकता (Attention Required)' : 'Attention Required in Sector C4')
                  : (isHi ? 'फसल स्वस्थ व हरी-भरी है (Healthy Crop)' : 'Your Crop is Healthy & Thriving')}
              </div>
              <div className="text-xs text-slate-400">
                Overall Vitality Score: {fusion.healthScore} out of 100 • Risk Index: {fusion.riskPercentage}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Health</div>
              <div className="text-base font-bold text-emerald-400">{fusion.healthScore}%</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Moisture</div>
              <div className="text-base font-bold text-cyan-400">{telemetry.soilMoisture.toFixed(0)}%</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">AI Conf.</div>
              <div className="text-base font-bold text-amber-300">{fusion.confidenceScore}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three-Step Farmer Explanation: What Happened -> What It Means -> What You Should Do */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Step 1: What happened */}
        <div className="p-5 rounded-3xl bg-[#03140a] border border-emerald-500/30 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>1. WHAT WE DETECTED</span>
          </div>
          <h3 className="text-base font-black text-white">
            {isHi ? 'खेत में क्या पाया गया?' : 'What GROOT Detected'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHighRisk
              ? (isHi 
                  ? 'उपग्रह डेटा व सेंसर में सेक्टर C4 में मिट्टी की नमी सामान्य से कम पाई गई है तथा पत्तियों में हल्के फंगल लक्षण हैं।'
                  : 'Satellite spectral sensors and soil probe detected moisture deficit with early fungal spots in Sector C4.')
              : (isHi
                  ? 'खेत में फसल का घनत्व, हरियाली और मिट्टी की नमी संतुलित है।'
                  : 'Vegetative density, canopy reflectance and moisture are optimal across all parcels.')}
          </p>
        </div>

        {/* Step 2: What it means */}
        <div className="p-5 rounded-3xl bg-[#03140a] border border-emerald-500/30 space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>2. WHAT IT MEANS</span>
          </div>
          <h3 className="text-base font-black text-white">
            {isHi ? 'इसका क्या मतलब है?' : 'What This Means For Your Crop'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHighRisk
              ? (isHi
                  ? 'फसल पर कोई बड़ा नुकसान अभी नहीं हुआ है, लेकिन समय रहते ध्यान न देने पर पैदावार पर 10-15% असर पड़ सकता है।'
                  : 'No irreversible damage yet, but proactive management is needed to prevent yield reduction.')
              : (isHi
                  ? 'फसल की बढ़वार बहुत अच्छी चल रही है। पैदावार लक्ष्य के अनुरूप रहेगी।'
                  : 'Crop tillering and vegetative growth are on track for maximum yield targets.')}
          </p>
        </div>

        {/* Step 3: What to do */}
        <div className="p-5 rounded-3xl bg-[#03140a] border border-emerald-500/30 space-y-2">
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>3. WHAT YOU SHOULD DO</span>
          </div>
          <h3 className="text-base font-black text-white">
            {isHi ? 'आपको अब क्या करना चाहिए?' : 'Recommended Next Steps'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHighRisk
              ? (isHi
                  ? '1. सुबह हल्की सिंचाई करें। 2. नीम कोटेड यूरिया डालें। 3. ट्राइसाइक्लाजोल दवा का छिड़काव सुबह 8 बजे से पहले करें।'
                  : '1. Light morning irrigation. 2. Top-dress Urea. 3. Apply Tricyclazole fungicide before 8 AM.')
              : (isHi
                  ? 'नियमित देखभाल रखें। 10 दिन बाद अगली खाद की खुराक की जांच करें।'
                  : 'Maintain routine irrigation. Re-check nutrient status in 10 days.')}
          </p>
        </div>

      </div>

      {/* 3. Expandable Technical Details (NDVI, Radiometric Index, Sensor Values) */}
      <div className="p-5 rounded-3xl bg-[#031108] border border-slate-800 shadow-xl space-y-4">
        <button
          onClick={() => {
            audio.playClick();
            setShowTechnicalDetails(!showTechnicalDetails);
          }}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                {isHi ? '🔬 वैज्ञानिक व तकनीकी विवरण (View Technical Details)' : '🔬 View Technical & Multispectral Details'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Sentinel-2 MSI bands, NDVI matrix, chlorophyll absorption, and telemetry graphs
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 text-slate-400 group-hover:text-white transition-colors">
            {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showTechnicalDetails && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">NDVI (Vegetation)</div>
                <div className="text-lg font-black text-emerald-400 mt-1">{zone.ndvi}</div>
                <div className="text-[9px] text-slate-500">NIR vs Red ratio</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">NDMI (Moisture)</div>
                <div className="text-lg font-black text-cyan-400 mt-1">{zone.ndmi}</div>
                <div className="text-[9px] text-slate-500">SWIR canopy water</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Surface Temp</div>
                <div className="text-lg font-black text-amber-300 mt-1">{zone.surfaceTemp}°C</div>
                <div className="text-[9px] text-slate-500">Thermal IR Band 11</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Chlorophyll Index</div>
                <div className="text-lg font-black text-teal-400 mt-1">{zone.chlorophyllIndex}</div>
                <div className="text-[9px] text-slate-500">RedEdge Band 5/7</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-white">Tri-Modal Attribution Weights:</div>
              <div className="flex flex-wrap gap-3 text-[11px] font-mono text-slate-400 pt-1">
                <span>🛰️ Sentinel-2 MSI: 40%</span>
                <span>•</span>
                <span>🎛️ ESP32 Soil Mesh: 30%</span>
                <span>•</span>
                <span>📸 MobileNet-v3 Foliar: 30%</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
