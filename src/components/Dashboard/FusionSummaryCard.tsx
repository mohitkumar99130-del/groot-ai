import React, { useState } from 'react';
import { FusionResult, FieldZone } from '../../types/groot';
import { ShieldAlert, ShieldCheck, HeartPulse, Brain, ArrowDown, Volume2 } from 'lucide-react';
import { realVoiceService } from '../../services/voiceService';
import { audio } from '../../services/audioService';

interface FusionSummaryCardProps {
  fusion: FusionResult;
  zone: FieldZone;
  onScrollToExplanation: () => void;
}

export const FusionSummaryCard: React.FC<FusionSummaryCardProps> = ({
  fusion,
  zone,
  onScrollToExplanation,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isHighRisk = fusion.riskPercentage > 60;

  const handleSpeakSummary = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    await realVoiceService.speak(fusion.hindiVoiceSummary, 'hi');
    setIsSpeaking(false);
  };

  return (
    <div className="glass-panel-sunlit p-5 sm:p-6 rounded-3xl border border-amber-500/30 shadow-2xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        
        {/* Left: Target & Status */}
        <div className="space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono-code text-slate-300">खेत क्षेत्र (Field Zone):</span>
            <span className="text-sm font-bold text-amber-300 font-mono-code bg-slate-950 px-3 py-1 rounded-xl border border-amber-500/40 shadow-inner">
              {zone.id} (धान खेत)
            </span>
            <span className={`text-xs font-mono-code font-bold px-3 py-1 rounded-full border ${
              isHighRisk
                ? 'bg-red-950/80 text-red-300 border-red-500/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
            }`}>
              {isHighRisk ? '🚨 ध्यान दें: बीमारी का खतरा' : '✅ फसल स्वास्थ्य: उत्तम'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow">
            {isHighRisk
              ? 'मल्टी-सिग्नल जांच: मिट्टी में नमी की कमी के साथ पत्ती में फंगल ब्लास्ट संक्रमण का खतरा पाया गया है।'
              : 'सभी सिग्नल उत्तम हैं। खेत की मिट्टी में नमी व नाइट्रोजन का स्तर संतुलित है।'}
          </p>
        </div>

        {/* Center & Right: Clean Metric Gauges + Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          
          {/* Health Score */}
          <div className="text-center bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-emerald-500/30 shadow-inner">
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center justify-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> सेहत (Health)
            </span>
            <div className="text-2xl font-black font-mono-code text-emerald-400">
              {fusion.healthScore}<span className="text-xs text-slate-500">/100</span>
            </div>
          </div>

          {/* Risk Level */}
          <div className="text-center bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-inner">
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center justify-center gap-1">
              {isHighRisk ? <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />} जोखिम (Risk)
            </span>
            <div className={`text-2xl font-black font-mono-code ${isHighRisk ? 'text-red-400' : 'text-emerald-400'}`}>
              {fusion.riskPercentage}%
            </div>
          </div>

          {/* AI Confidence */}
          <div className="text-center bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-inner">
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center justify-center gap-1">
              <Brain className="w-3.5 h-3.5 text-cyan-400" /> AI शुद्धता
            </span>
            <div className="text-2xl font-black font-mono-code text-cyan-400">
              {fusion.confidenceScore}%
            </div>
          </div>

          {/* Direct Spoken Audio Button for Illiterate Farmers */}
          <button
            onClick={handleSpeakSummary}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl ${
              isSpeaking ? 'btn-groot-voice animate-bounce' : 'btn-groot-voice'
            }`}
          >
            <Volume2 className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>{isSpeaking ? 'बोल रहा है...' : '🔊 हिंदी रिपोर्ट सुनें'}</span>
          </button>

          {/* Why button */}
          <button
            onClick={onScrollToExplanation}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-mono-code font-bold btn-groot-secondary flex items-center justify-center gap-1.5"
          >
            <span>कारण (Why?)</span>
            <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
          </button>

        </div>

      </div>
    </div>
  );
};
