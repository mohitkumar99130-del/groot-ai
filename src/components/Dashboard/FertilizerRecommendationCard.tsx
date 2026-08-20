import React, { useState } from 'react';
import { 
  FusionResult, 
  FieldZone 
} from '../../types/groot';
import { 
  Sprout, 
  Zap, 
  Bug, 
  TrendingUp, 
  CheckCircle2, 
  Languages,
  Clock,
  FlaskConical,
  Volume2
} from 'lucide-react';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';

interface FertilizerRecommendationCardProps {
  fusion: FusionResult;
  zone: FieldZone;
}

export const FertilizerRecommendationCard: React.FC<FertilizerRecommendationCardProps> = ({
  fusion,
  zone,
}) => {
  const [showHindi, setShowHindi] = useState(true);
  const [activeTab, setActiveTab] = useState<'fertilizer' | 'productivity' | 'pests'>('fertilizer');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeakPrescription = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    let speechText = '';
    if (activeTab === 'fertilizer') {
      speechText = `खाद सलाह: ${fusion.fertilizers.map(f => `${f.hindiName}, ${f.dosage}, ${f.hindiTiming}`).join('. ')}`;
    } else if (activeTab === 'pests') {
      speechText = `कीटनाशक सलाह: ${fusion.pestControl.map(p => `${p.hindiPestName}. ${p.hindiRemedy}`).join('. ')}`;
    } else {
      speechText = `पैदावार बढ़ाने के कदम: ${fusion.productivitySteps.map(s => `${s.hindiTitle}. ${s.hindiDetails}`).join('. ')}`;
    }
    await realVoiceService.speak(speechText, 'hi');
    setIsSpeaking(false);
  };

  return (
    <div id="recommendation-section" className="glass-panel-sunlit p-5 sm:p-6 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
            <Sprout className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg sm:text-xl text-white flex items-center gap-2">
              Farmer AI Recommendation Engine
              <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded-md bg-slate-950 text-amber-300 border border-amber-400/40">
                ZONE {zone.id}
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Prescriptive Fertilizer Dosage, Yield Maximization Steps & Pest Remedies
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Advice Button */}
          <button
            onClick={handleSpeakPrescription}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl ${
              isSpeaking ? 'btn-groot-voice animate-bounce' : 'btn-groot-voice'
            }`}
          >
            <Volume2 className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>{isSpeaking ? 'बोल रहा है...' : '🔊 सुनो: क्या करें?'}</span>
          </button>

          {/* Hindi Toggle Switch */}
          <button
            onClick={() => {
              audio.playClick();
              setShowHindi(!showHindi);
            }}
            className="px-3.5 py-2.5 rounded-2xl text-xs font-mono-code font-bold btn-groot-secondary flex items-center gap-2 shadow-md"
          >
            <Languages className="w-4 h-4 text-emerald-400" />
            <span>{showHindi ? 'भाषा: हिन्दी' : 'Language: English'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('fertilizer')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold font-mono-code transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'fertilizer'
              ? 'btn-groot-primary shadow-lg'
              : 'btn-groot-secondary opacity-70'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>1. FERTILIZER & DOSAGE ({fusion.fertilizers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('productivity')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold font-mono-code transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'productivity'
              ? 'btn-groot-primary shadow-lg'
              : 'btn-groot-secondary opacity-70'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>2. YIELD STEPS ({fusion.productivitySteps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pests')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold font-mono-code transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pests'
              ? 'btn-groot-voice shadow-lg'
              : 'btn-groot-secondary opacity-70'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>3. PEST CONTROL ({fusion.pestControl.length})</span>
        </button>
      </div>

      {/* TAB 1: FERTILIZERS & DOSAGE */}
      {activeTab === 'fertilizer' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fusion.fertilizers.map((fert, idx) => (
              <div
                key={idx}
                className="bg-slate-950/85 p-5 rounded-2xl border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    PRESCRIPTION #{idx + 1}
                  </span>
                  <span className="text-xs font-mono-code text-amber-400 flex items-center gap-1 font-bold">
                    <FlaskConical className="w-3.5 h-3.5" /> High Precision
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white font-display">
                    {fert.name}
                  </h4>
                  {showHindi && (
                    <p className="text-sm font-bold text-emerald-300 mt-0.5">
                      {fert.hindiName}
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-mono-code text-slate-300 block uppercase font-bold">
                    Recommended Dosage / मात्रा:
                  </span>
                  <p className="text-base font-black font-mono-code text-emerald-300">
                    {fert.dosage}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Timing:</strong> {fert.applicationTiming}
                      {showHindi && <p className="text-cyan-300 font-medium">{fert.hindiTiming}</p>}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Reasoning:</strong> {fert.reasoning}
                    {showHindi && <p className="text-slate-300 font-medium mt-1">{fert.hindiReasoning}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTIVITY STEPS */}
      {activeTab === 'productivity' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fusion.productivitySteps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-slate-950/85 p-5 rounded-2xl border border-cyan-500/30 space-y-3 relative shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-cyan-500 text-slate-950 font-black font-mono-code text-sm flex items-center justify-center shadow-md">
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-mono-code font-bold text-emerald-300 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800">
                    {step.impactScore}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-display">
                  {step.title}
                </h4>
                {showHindi && (
                  <p className="text-sm font-bold text-cyan-300">
                    {step.hindiTitle}
                  </p>
                )}

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-medium">
                  {step.details}
                  {showHindi && (
                    <span className="block text-slate-300 font-medium mt-1 border-t border-slate-800 pt-1">
                      {step.hindiDetails}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PEST & DISEASE CONTROL */}
      {activeTab === 'pests' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fusion.pestControl.map((pest, idx) => (
              <div
                key={idx}
                className="bg-slate-950/85 p-5 rounded-2xl border border-amber-500/30 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold uppercase">
                    URGENCY: {pest.urgency}
                  </span>
                  <Bug className="w-4 h-4 text-amber-400" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white font-display">
                    {pest.pestName}
                  </h4>
                  {showHindi && (
                    <p className="text-sm font-bold text-amber-300">
                      {pest.hindiPestName}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200">
                    <strong className="block text-[11px] text-amber-400 uppercase font-mono-code mb-0.5">
                      Chemical Remedy (रासायनिक उपचार):
                    </strong>
                    {pest.chemicalRemedy}
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                    <strong className="block text-[11px] text-emerald-400 uppercase font-mono-code mb-0.5">
                      Bio-Organic Remedy (जैविक कीटनाशक):
                    </strong>
                    {pest.bioRemedy}
                  </div>

                  {showHindi && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 font-medium">
                      <strong className="text-amber-300">किसान भाई के लिए सलाह:</strong> {pest.hindiRemedy}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Banner */}
      <div className="pt-3 border-t border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono-code text-slate-300 gap-2">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <CheckCircle2 className="w-4 h-4" /> MULTIMODAL AGRONOMIC DECISION ENGINE
        </span>
        <span className="text-slate-400">ICAR / PAU AGRONOMY COMPLIANT</span>
      </div>

    </div>
  );
};
