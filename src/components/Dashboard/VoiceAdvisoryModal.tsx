import React, { useState, useEffect } from 'react';
import { FieldZone, FusionResult } from '../../types/groot';
import { X, Mic, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { realVoiceService } from '../../services/voiceService';

interface VoiceAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: FieldZone;
  fusion: FusionResult;
  language: string;
}

export const VoiceAdvisoryModal: React.FC<VoiceAdvisoryModalProps> = ({
  isOpen,
  onClose,
  zone,
  fusion,
  language: initialLanguage,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeLang, setActiveLang] = useState<'hi' | 'en' | 'hinglish'>('hi');

  useEffect(() => {
    if (initialLanguage === 'hi') setActiveLang('hi');
    else if (initialLanguage === 'en') setActiveLang('en');
  }, [initialLanguage]);

  if (!isOpen) return null;

  // Custom Voice Scripts
  const getHindiScript = () => {
    return fusion.hindiVoiceSummary;
  };

  const getHinglishScript = () => {
    return `Namaskar Kisan Bhai! GROOT AI system dwara Zone ${zone.id} ki jaanch poori ho gayi hai. Crop health score ${fusion.healthScore}% hai. Severe moisture deficit aur nitrogen ki kami payee gayi hai. Kripya 45 kg Neem Coated Urea per acre daalein aur 24 ghante me sinchai karein. Rice blast fungal disease ke liye Tricyclazole spray karein. Dhanyawad!`;
  };

  const getEnglishScript = () => {
    return `Hello Farmer! GROOT AI has analyzed Sector ${zone.id}. Field Health Score is ${fusion.healthScore}%. Critical soil moisture deficit of ${zone.ndmi.toFixed(2)} NDMI and nitrogen depletion detected. Recommended action: Apply 45 kg Neem Coated Urea per acre and execute 25mm surge irrigation within 24 hours. Spray Tricyclazole 75% WP for leaf blast control. Thank you!`;
  };

  const getCurrentText = () => {
    if (activeLang === 'hi') return getHindiScript();
    if (activeLang === 'hinglish') return getHinglishScript();
    return getEnglishScript();
  };

  const handlePlayVoice = () => {
    setIsPlayingAudio(true);
    const textToSpeak = getCurrentText();
    const langCode = activeLang === 'hi' ? 'hi' : 'en';

    realVoiceService.speakText(
      textToSpeak,
      langCode,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const handleStopVoice = () => {
    realVoiceService.stop();
    setIsPlayingAudio(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
      <div className="relative w-full max-w-lg glass-panel p-6 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            handleStopVoice();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full glass-panel text-slate-400 hover:text-white border border-slate-700"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 text-cyan-300 shadow-md">
            <Mic className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              किसान मित्र (Hindi Voice Bot)
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                VOICE AI
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Spoken Agronomic Summary for Sector <strong className="text-white">{zone.id}</strong>
            </p>
          </div>
        </div>

        {/* Language Selection Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveLang('hi')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono-code transition-all ${
              activeLang === 'hi'
                ? 'bg-cyan-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 हिन्दी (Hindi)
          </button>
          <button
            onClick={() => setActiveLang('hinglish')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono-code transition-all ${
              activeLang === 'hinglish'
                ? 'bg-cyan-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🗣️ Hinglish
          </button>
          <button
            onClick={() => setActiveLang('en')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono-code transition-all ${
              activeLang === 'en'
                ? 'bg-cyan-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 English
          </button>
        </div>

        {/* Voice Waveform Animation Display */}
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-center gap-1.5 h-20 overflow-hidden relative">
          <div className="absolute top-2 left-3 text-[10px] font-mono-code text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {isPlayingAudio ? 'SPEECH SYNTHESIZER ACTIVE (बोल रहा है)' : 'AUDIO READY TO SYNTHESIZE'}
          </div>

          {[...Array(28)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlayingAudio ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse' : 'bg-slate-800 h-2'
              }`}
              style={{
                height: isPlayingAudio ? `${Math.max(8, Math.sin(i + Date.now() * 0.015) * 36 + 22)}px` : '8px',
                animationDelay: `${i * 35}ms`,
              }}
            />
          ))}
        </div>

        {/* Text Transcript */}
        <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-sm">
          <span className="text-[11px] font-mono-code text-slate-400 block uppercase font-bold">
            Spoken Text Summary (किसान के लिए सारांश):
          </span>
          <p className="text-slate-100 font-medium leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            {getCurrentText()}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300">
              <strong>खाद सिफारिश:</strong> Neem Coated Urea @ 45kg/Acre
            </div>
            <div className="p-2 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300">
              <strong>कीट रोकथाम:</strong> Tricyclazole 75% WP @ 0.6g/L
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={isPlayingAudio ? handleStopVoice : handlePlayVoice}
            className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-extrabold font-mono-code flex items-center justify-center gap-2 transition-all shadow-lg ${
              isPlayingAudio
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
                : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-black shadow-cyan-500/25 hover:opacity-95'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{isPlayingAudio ? 'STOP VOICE AUDIO' : 'SPEAK SUMMARY IN HINDI (बोल कर सुनाएं)'}</span>
          </button>

          <button
            onClick={() => {
              handleStopVoice();
              onClose();
            }}
            className="px-4 py-3.5 rounded-xl text-xs font-semibold glass-panel text-slate-300 border border-slate-700 hover:text-white"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
