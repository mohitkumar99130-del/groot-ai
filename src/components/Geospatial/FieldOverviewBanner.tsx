import React, { useState } from 'react';
import { FusionResult, FieldZone, AppLanguage, FarmPlot } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { ALL_CROP_VARIETIES } from '../../services/cropDatabase';
import { 
  HeartPulse, 
  ShieldAlert, 
  ShieldCheck, 
  Brain, 
  Volume2, 
  HelpCircle
} from 'lucide-react';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';

interface FieldOverviewBannerProps {
  fusion: FusionResult;
  zone: FieldZone;
  currentPlot: FarmPlot;
  variety?: CropVariety;
  language: AppLanguage;
  onScrollToExplanation: () => void;
  onNavigateToDiagnostics?: () => void;
}

export const FieldOverviewBanner: React.FC<FieldOverviewBannerProps> = ({
  fusion,
  zone,
  variety = ALL_CROP_VARIETIES[0],
  language,
  onScrollToExplanation,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isHighRisk = fusion.riskPercentage > 50;

  const handleSpeakSummary = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const summaryText = language === 'hi' ? fusion.hindiVoiceSummary : fusion.englishVoiceSummary;
    await realVoiceService.speak(summaryText, language);
    setIsSpeaking(false);
  };

  return (
    <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/25 shadow-2xl space-y-4">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        
        {/* Left: Plot & Zone Identification */}
        <div className="space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className="text-xs text-slate-400">Target Field Parcel:</span>
            <span className="text-sm font-bold text-amber-300 bg-slate-950 px-3 py-1 rounded-xl border border-amber-500/40 shadow-inner flex items-center gap-1.5">
              <span>{variety.iconEmoji}</span>
              <span>{zone.id} • {language === 'hi' ? variety.varietyHindi : variety.varietyName}</span>
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              isHighRisk
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            }`}>
              {isHighRisk ? '🚨 ' + (language === 'hi' ? 'तनाव / रोग खतरा' : zone.cropCondition) : '✅ ' + (language === 'hi' ? 'स्वस्थ फसल' : zone.cropCondition)}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-sans font-medium leading-relaxed">
            {language === 'hi'
              ? (isHighRisk
                  ? 'मल्टी-सिग्नल फ़्यूज़न चेतावनी: उपग्रह डेटा व ऑन-फील्ड सेंसर में मिट्टी की नमी की कमी के साथ पत्ती में फंगल ब्लास्ट संक्रमण पाया गया है।'
                  : 'सभी सिग्नल उत्तम हैं। खेत की मिट्टी में नमी व नाइट्रोजन का स्तर फसल के अनुकूल है।')
              : (isHighRisk
                  ? 'Tri-Modal Fusion Warning: Satellite spectral deficit combined with root moisture stress and verified leaf fungal pathology.'
                  : 'All signals nominal. Soil volumetric water content and nitrogen levels are well-balanced for vegetative tillering.')}
          </p>
        </div>

        {/* Center & Right: Metric Gauges + High-Impact Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
          
          {/* Health Score */}
          <div className="text-center bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-emerald-500/30 shadow-inner font-mono min-w-[90px]">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> Health
            </span>
            <div className="text-2xl font-black text-emerald-400">
              {fusion.healthScore}<span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
          </div>

          {/* Risk Level */}
          <div className="text-center bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-inner font-mono min-w-[90px]">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              {isHighRisk ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />} Risk
            </span>
            <div className={`text-2xl font-black ${isHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
              {fusion.riskPercentage}%
            </div>
          </div>

          {/* AI Confidence */}
          <div className="text-center bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-inner font-mono min-w-[90px]">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Brain className="w-3.5 h-3.5 text-cyan-400" /> AI Conf.
            </span>
            <div className="text-2xl font-black text-cyan-400">
              {fusion.confidenceScore}%
            </div>
          </div>

          {/* Direct Spoken Audio Narrator Button */}
          <button
            onClick={handleSpeakSummary}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl ${
              isSpeaking ? 'btn-agri-voice animate-pulse ring-2 ring-amber-400' : 'btn-agri-voice'
            }`}
          >
            <Volume2 className={`w-4 h-4 text-slate-950 ${isSpeaking ? 'animate-bounce' : ''}`} />
            <span>{isSpeaking ? 'बोल रहा है...' : (language === 'hi' ? '🔊 पूरी रिपोर्ट सुनें' : '🔊 Listen AI Audit')}</span>
          </button>

          {/* Why Button */}
          <button
            onClick={() => {
              audio.playClick();
              onScrollToExplanation();
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-mono font-bold btn-agri-secondary flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'कारण (Why?)' : 'Explain (Why?)'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
