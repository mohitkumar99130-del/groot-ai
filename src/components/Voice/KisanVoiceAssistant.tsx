import React, { useState } from 'react';
import { FusionResult, FieldZone, AppLanguage, SensorTelemetry, LeafSample } from '../../types/groot';
import { Volume2, HeartPulse, FlaskConical, Bug, Radio } from 'lucide-react';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';


interface KisanVoiceAssistantProps {
  fusion: FusionResult;
  zone: FieldZone;
  telemetry: SensorTelemetry;
  leaf: LeafSample;
  language: AppLanguage;
}

export const KisanVoiceAssistant: React.FC<KisanVoiceAssistantProps> = ({
  fusion,
  zone,
  telemetry,
  leaf,
  language,
}) => {
  const [currentNarrating, setCurrentNarrating] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>(
    fusion.hindiVoiceSummary ||
    'नमस्कार किसान भाई! GROOT AI में आपका स्वागत है। नीचे दिए गए किसी भी बटन को दबाकर शुद्ध हिंदी में आवाज़ सलाह सुनें।'
  );

  const speakCustom = async (id: string, text: string) => {
    audio.playClick();
    if (currentNarrating === id) {
      realVoiceService.stop();
      setCurrentNarrating(null);
      return;
    }

    setCurrentNarrating(id);
    setTranscript(text);
    await realVoiceService.speak(text, language === 'hi' ? 'hi' : 'en');
    setCurrentNarrating(null);
  };

  const isHighRisk = fusion.riskPercentage > 60;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="agri-card-elevated p-6 rounded-3xl border border-amber-500/30 text-center max-w-4xl mx-auto space-y-4 shadow-2xl">
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto text-slate-950 shadow-xl ring-4 ring-amber-400/20">
          <Volume2 className={`w-8 h-8 ${currentNarrating ? 'animate-bounce' : ''}`} />
          {currentNarrating && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
          )}
        </div>

        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white">
            {language === 'hi' ? '🎙️ किसान आवाज़ सलाहकार (Kisan Sahayak AI Voice Narrator)' : '🎙️ Kisan Sahayak AI Voice Assistant'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1 max-w-2xl mx-auto">
            {language === 'hi'
              ? 'बिना पढ़े-लिखे किसान भाइयों के लिए सरल, शुद्ध हिंदी आवाज़ में खेत की पूरी सेहत, खाद और दवाई की जानकारी।'
              : 'Hands-free voice assistant designed for field workers, narrating localized agronomic prescriptions.'}
          </p>
        </div>

        {/* Live Narration Equalizer & Transcript Box */}
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2 text-amber-300 font-bold">
              <Radio className={`w-4 h-4 ${currentNarrating ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              {currentNarrating ? 'AUDIO NARRATION PLAYING...' : 'VOICE TRANSCRIPT READY'}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              ZONE {zone.id}
            </span>
          </div>

          <p className="text-sm text-slate-100 font-sans leading-relaxed min-h-[50px] flex items-center">
            "{transcript}"
          </p>

          {currentNarrating && (
            <div className="flex items-center gap-1 pt-2">
              <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-pulse" />
              <span className="w-1.5 h-6 bg-amber-400 rounded-full animate-pulse delay-75" />
              <span className="w-1.5 h-3 bg-amber-400 rounded-full animate-pulse delay-150" />
              <span className="w-1.5 h-7 bg-amber-400 rounded-full animate-pulse delay-100" />
              <span className="w-1.5 h-5 bg-amber-400 rounded-full animate-pulse delay-200" />
              <span className="text-[11px] font-mono text-amber-300 ml-2">Natural Agronomy Speech Synthesizer</span>
            </div>
          )}
        </div>

        {/* 4 Big Tactile Voice Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          
          {/* Card 1: Health Summary */}
          <button
            onClick={() =>
              speakCustom(
                'health',
                `नमस्कार किसान भाई! आपकी ${zone.id} खेत की फसल की सेहत ${fusion.healthScore} प्रतिशत है। मिट्टी में नमी ${telemetry.soilMoisture.toFixed(0)} प्रतिशत है। ${isHighRisk ? 'खेत में फंगल बीमारी का खतरा 88 प्रतिशत है, तुरंत ध्यान दें।' : 'फसल बिल्कुल स्वस्थ है।'}`
              )
            }
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 shadow-md ${
              currentNarrating === 'health'
                ? 'bg-emerald-500/25 border-emerald-400 ring-2 ring-emerald-400/50'
                : 'agri-card-subtle border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400">1. फसल की सेहत सुनें</div>
              <div className="text-sm font-bold text-white mt-0.5">Crop Health & Vitality</div>
              <div className="text-[11px] text-slate-400 mt-1">Score: {fusion.healthScore}/100 • Moisture: {telemetry.soilMoisture.toFixed(0)}%</div>
            </div>
          </button>

          {/* Card 2: Fertilizer Dosage */}
          <button
            onClick={() =>
              speakCustom(
                'fertilizer',
                `खाद सलाह: 45 किलोग्राम प्रति एकड़ नीम कोटेड यूरिया डालें। डीएपी खाद 30 किलोग्राम प्रति एकड़ मिलाएं और सिंचाई के बाद सुबह के समय छिड़काव करें।`
              )
            }
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 shadow-md ${
              currentNarrating === 'fertilizer'
                ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/50'
                : 'agri-card-subtle border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-400">2. खाद की मात्रा सुनें</div>
              <div className="text-sm font-bold text-white mt-0.5">Fertilizer Prescription</div>
              <div className="text-[11px] text-slate-400 mt-1">Urea 45kg + DAP 30kg / Acre dosage</div>
            </div>
          </button>

          {/* Card 3: Disease & Pest Medicine */}
          <button
            onClick={() =>
              speakCustom(
                'pest',
                `दवाई सलाह: पत्ती में ${leaf.name} के लक्षण हैं। ट्राइसाइक्लाज़ोल 0.6 ग्राम प्रति लीटर पानी में मिलाकर सुबह 8 बजे छिड़काव करें।`
              )
            }
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 shadow-md ${
              currentNarrating === 'pest'
                ? 'bg-cyan-500/25 border-cyan-400 ring-2 ring-cyan-400/50'
                : 'agri-card-subtle border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400">3. बीमारी की दवा सुनें</div>
              <div className="text-sm font-bold text-white mt-0.5">Antifungal & Pest Remedy</div>
              <div className="text-[11px] text-slate-400 mt-1">Tricyclazole 75% WP @ 0.6 g/L</div>
            </div>
          </button>

          {/* Card 4: Complete Audio Audit */}
          <button
            onClick={() =>
              speakCustom(
                'full',
                fusion.hindiVoiceSummary ||
                `नमस्कार किसान भाई! GROOT AI द्वारा आपके खेत की संपूर्ण जांच पूरी हो गई है। फसल स्वास्थ्य ${fusion.healthScore} प्रतिशत है। नीम कोटेड यूरिया 45 किलोग्राम तथा कीटनाशक का छिड़काव करें। धन्यवाद!`
              )
            }
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 shadow-md ${
              currentNarrating === 'full'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black'
                : 'btn-agri-voice text-slate-950 font-extrabold'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950/30 text-slate-950 shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-black text-slate-900">4. संपूर्ण रिपोर्ट सुनें</div>
              <div className="text-sm font-black text-slate-950 mt-0.5">Full Spoken Field Audit</div>
              <div className="text-[11px] text-slate-900/80 mt-1">360° Multimodal AI Summary</div>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
