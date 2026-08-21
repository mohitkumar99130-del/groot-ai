import React, { useState } from 'react';
import { 
  FusionResult, 
  FieldZone, 
  SensorTelemetry, 
  LeafSample, 
  AppLanguage, 
  RealtimeWeather,
  AppNavigationTab
} from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { 
  Volume2, 
  VolumeX, 
  HeartPulse, 
  FlaskConical, 
  Bug, 
  CloudSun, 
  Droplets, 
  Sprout, 
  CheckCircle2, 
  Radio, 
  Camera, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';

interface FarmerMainHubProps {
  fusion: FusionResult;
  zone: FieldZone;
  telemetry: SensorTelemetry;
  leaf: LeafSample;
  variety: CropVariety;
  language: AppLanguage;
  weather: RealtimeWeather;
  onOpenCropSelector: () => void;
  onNavigateTab: (tab: AppNavigationTab) => void;
  onRefreshWeather: () => void;
  isWeatherLoading?: boolean;
}

export const FarmerMainHub: React.FC<FarmerMainHubProps> = ({
  fusion,
  zone,
  telemetry,
  leaf,
  variety,
  language,
  weather,
  onOpenCropSelector,
  onNavigateTab,
  onRefreshWeather,
  isWeatherLoading,
}) => {
  const [currentNarrating, setCurrentNarrating] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // 1.0 = Normal, 0.85 = Slow
  const isHi = language === 'hi';
  const isHighRisk = fusion.riskPercentage > 50;

  // Simple, Jargon-Free Spoken Scripts for Farmers
  const getHealthSpokenText = () => {
    if (isHi) {
      return `नमस्ते किसान भाई! आपकी ${variety.varietyHindi} फसल (ज़ोन ${zone.id}) की सेहत 100 में से ${fusion.healthScore} है। ${
        isHighRisk
          ? 'खेत में पत्ती का रोग और नमी की कमी है, तुरंत ध्यान दें।'
          : 'फसल हरी-भरी और स्वस्थ है।'
      }`;
    }
    return `Hello farmer! Health score for your ${variety.varietyName} in Zone ${zone.id} is ${fusion.healthScore} out of 100. ${
      isHighRisk
        ? 'Leaf symptoms and moisture deficit detected. Treatment recommended.'
        : 'The crop is green, healthy, and thriving.'
    }`;
  };

  const getFertilizerSpokenText = () => {
    const targetN = variety.optimalNpkPerAcre.nitrogenKg;
    const ureaBags = (Math.round(targetN * 1.1) / 45).toFixed(1);
    if (isHi) {
      return `खाद सलाह: ${variety.varietyHindi} के लिए प्रति एकड़ लगभग ${Math.round(targetN * 1.1)} किलो नीम कोटेड यूरिया (लगभग ${ureaBags} बोरी) और 30 किलो डीएपी डालें। सिंचाई के बाद सुबह के समय खाद दें।`;
    }
    return `Fertilizer Guide: For ${variety.varietyName}, apply ${Math.round(targetN * 1.1)} kg Neem Coated Urea (approx ${ureaBags} bags) and 30 kg DAP per acre post-irrigation in early morning.`;
  };

  const getPestSpokenText = () => {
    if (isHi) {
      if (leaf.id === 'blast' || leaf.symptomSeverity > 40) {
        return `दवाई सलाह: पत्ती में झुलसा व फंगल रोग के लक्षण हैं। ट्राइसाइक्लाजोल दवा 0.6 ग्राम प्रति लीटर पानी में मिलाकर सुबह 8 बजे से पहले छिड़काव करें।`;
      }
      return `दवाई सलाह: फसल में अभी किसी खतरनाक कीड़े का प्रकोप नहीं है। सुरक्षा के लिए 20 दिन में नीम का तेल छिड़कें।`;
    }
    if (leaf.id === 'blast' || leaf.symptomSeverity > 40) {
      return `Pest & Remedy Guide: Leaf scan indicates fungal infection. Spray Tricyclazole fungicide at 0.6 grams per liter of water early morning before 8 AM.`;
    }
    return `Pest & Remedy Guide: No severe pest attack currently detected. Apply preventive neem oil spray every 20 days.`;
  };

  const getWeatherSpokenText = () => {
    if (isHi) {
      return `मौसम सलाह: आज तापमान ${weather.temperature} डिग्री सेल्सियस है और हवा ${weather.windSpeed} किलोमीटर प्रति घंटा है। ${
        weather.sprayAdvisory === 'Optimal'
          ? 'छिड़काव और खाद देने के लिए आज का समय बहुत उत्तम है।'
          : 'तेज हवा या बारिश के कारण छिड़काव में सावधानी रखें।'
      }`;
    }
    return `Weather Guide: Current temperature is ${weather.temperature} degrees Celsius with wind speed at ${weather.windSpeed} km/h. ${
      weather.sprayAdvisory === 'Optimal'
        ? 'Conditions are optimal for field spraying and top dressing.'
        : 'Exercise caution during high wind or sudden rain.'
    }`;
  };

  const getFullSpokenText = () => {
    if (isHi) {
      return fusion.hindiVoiceSummary;
    }
    return fusion.englishVoiceSummary;
  };

  const getDefaultTranscript = () => {
    if (isHi) {
      return `नमस्ते किसान भाई! नीचे दिए गए बड़े बटनों को दबाएं और अपनी ${variety.varietyHindi} फसल की सेहत, खाद, दवाई और मौसम की पूरी जानकारी शुद्ध हिंदी में सुनें।`;
    }
    return `Welcome farmer! Tap any of the large action buttons below to hear complete spoken advisories for your ${variety.varietyName} crop in simple English.`;
  };

  const [activeTranscript, setActiveTranscript] = useState<string>(getDefaultTranscript());

  const speakSegment = async (id: string, text: string) => {
    audio.playClick();
    if (currentNarrating === id) {
      realVoiceService.stop();
      setCurrentNarrating(null);
      return;
    }

    setCurrentNarrating(id);
    setActiveTranscript(text);
    await realVoiceService.speak(text, isHi ? 'hi' : 'en');
    setCurrentNarrating(null);
  };

  const handleStopAudio = () => {
    audio.playClick();
    realVoiceService.stop();
    setCurrentNarrating(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP CROP & VARIETY HERO SELECTOR BAR */}
      <div className="agri-card-elevated p-4 sm:p-6 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-agri-950">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          {/* Left: Active Crop & Sub-Variety Identification */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                {isHi ? 'सक्रिय फसल व किस्म' : 'Active Crop & Sub-Variety'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {zone.id} • 1.0 Ha
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl">{variety.iconEmoji}</span>
              <h1 className="font-display font-black text-xl sm:text-3xl text-white tracking-tight">
                {isHi ? variety.varietyHindi : variety.varietyName}
              </h1>
              <span className="text-xs sm:text-sm font-mono text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-amber-500/30 font-bold">
                {isHi ? variety.grainTypeHindi : variety.grainType}
              </span>
            </div>

            {/* Trait badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1">
                ⏱️ {variety.durationDays} {isHi ? 'दिन की फसल' : 'Days Duration'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1">
                💧 {isHi ? 'पानी की आवश्यकता:' : 'Water:'} <strong className="text-cyan-300">{variety.waterRequirement}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1">
                🌾 {isHi ? 'अनुमानित उपज:' : 'Target Yield:'} <strong className="text-emerald-300">~{variety.targetYieldQuintalPerAcre} Q/Ac</strong>
              </span>
            </div>
          </div>

          {/* Right: Change Crop Button + Quick Variety Spoken Overview */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => {
                audio.playClick();
                onOpenCropSelector();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all group"
            >
              <span>🌾 {isHi ? 'फसल / किस्म बदलें' : 'Change Crop / Sub-Variety'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => speakSegment('variety_intro', isHi ? variety.simpleAudioHi : variety.simpleAudioEn)}
              className={`w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all border ${
                currentNarrating === 'variety_intro'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-slate-900/90 text-amber-300 hover:bg-slate-800 border-amber-500/30'
              }`}
              title={isHi ? 'इस किस्म की खास बातें सुनें' : 'Listen to variety audio overview'}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isHi ? 'किस्म की आवाज़' : 'Variety Audio'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. FRONT & CENTER KISAN SAHAYAK VOICE STATION */}
      <div className="agri-card-elevated p-5 sm:p-7 rounded-3xl border-2 border-amber-500/40 shadow-2xl space-y-5 bg-slate-950/90">
        
        {/* Voice Station Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg ring-4 ring-amber-400/20 shrink-0">
              <Volume2 className={`w-6 h-6 ${currentNarrating ? 'animate-bounce' : ''}`} />
              {currentNarrating && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-2xl text-white flex items-center gap-2">
                <span>{isHi ? '🎙️ किसान आवाज़ केंद्र (Kisan Sahayak Voice)' : '🎙️ Kisan Sahayak Voice Station'}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  1-Tap Audio
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                {isHi
                  ? 'बिना पढ़े-लिखे किसान भाइयों के लिए सरल आवाज़ सलाह। किसी भी बटन को दबाएं और सीधे सुनें।'
                  : 'Zero-reading spoken agronomy interface. Tap any big button below for crystal clear spoken guidance.'}
              </p>
            </div>
          </div>

          {/* Voice Controls: Stop & Speed Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {currentNarrating && (
              <button
                onClick={handleStopAudio}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>{isHi ? 'आवाज़ रोकें' : 'Stop Audio'}</span>
              </button>
            )}

            <button
              onClick={() => {
                audio.playClick();
                setSpeechRate((prev) => (prev === 1.0 ? 0.85 : 1.0));
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold"
              title="Speech Speed"
            >
              ⚡ {speechRate === 1.0 ? (isHi ? 'गति: सामान्य' : 'Speed: 1.0x') : (isHi ? 'गति: धीमी (Slow)' : 'Speed: 0.85x')}
            </button>
          </div>
        </div>

        {/* 5 Big Tactile Voice Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Button 1: Health */}
          <button
            onClick={() => speakSegment('health', getHealthSpokenText())}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between shadow-md relative group ${
              currentNarrating === 'health'
                ? 'bg-emerald-500/30 border-emerald-400 ring-2 ring-emerald-400/50'
                : 'agri-card-subtle border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-950/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400">
                {fusion.healthScore}/100
              </span>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-mono text-emerald-400 font-bold">1. {isHi ? 'फसल की सेहत' : 'Crop Health'}</div>
              <div className="text-sm font-bold text-white mt-0.5">{isHi ? 'सेहत रिपोर्ट सुनें' : 'Listen Vitality'}</div>
              <div className="text-[10px] text-slate-400 mt-1">{isHi ? 'हरापन व विकास' : 'Canopy & Vigor'}</div>
            </div>
          </button>

          {/* Button 2: Fertilizer */}
          <button
            onClick={() => speakSegment('fertilizer', getFertilizerSpokenText())}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between shadow-md relative group ${
              currentNarrating === 'fertilizer'
                ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400/50'
                : 'agri-card-subtle border-slate-800 hover:border-amber-500/40 hover:bg-amber-950/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-amber-400">
                NPK Rx
              </span>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-mono text-amber-400 font-bold">2. {isHi ? 'खाद की मात्रा' : 'Fertilizer Dosage'}</div>
              <div className="text-sm font-bold text-white mt-0.5">{isHi ? 'खाद खुराक सुनें' : 'Listen Dosage'}</div>
              <div className="text-[10px] text-slate-400 mt-1">{isHi ? 'यूरिया + डीएपी बोरी' : 'Urea & DAP Bags'}</div>
            </div>
          </button>

          {/* Button 3: Pest & Disease */}
          <button
            onClick={() => speakSegment('pest', getPestSpokenText())}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between shadow-md relative group ${
              currentNarrating === 'pest'
                ? 'bg-rose-500/30 border-rose-400 ring-2 ring-rose-400/50'
                : 'agri-card-subtle border-slate-800 hover:border-rose-500/40 hover:bg-rose-950/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 group-hover:scale-110 transition-transform">
                <Bug className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-rose-400">
                {isHighRisk ? 'Alert' : 'Safe'}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-mono text-rose-400 font-bold">3. {isHi ? 'दवाई व स्प्रे' : 'Disease & Spray'}</div>
              <div className="text-sm font-bold text-white mt-0.5">{isHi ? 'दवाई सलाह सुनें' : 'Listen Remedy'}</div>
              <div className="text-[10px] text-slate-400 mt-1">{isHi ? 'फफूंद व कीट सुरक्षा' : 'Fungicide Guide'}</div>
            </div>
          </button>

          {/* Button 4: Weather & Irrigation */}
          <button
            onClick={() => speakSegment('weather', getWeatherSpokenText())}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between shadow-md relative group ${
              currentNarrating === 'weather'
                ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400/50'
                : 'agri-card-subtle border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-950/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400">
                {weather.temperature}°C
              </span>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-mono text-cyan-400 font-bold">4. {isHi ? 'मौसम व सिंचाई' : 'Weather & Water'}</div>
              <div className="text-sm font-bold text-white mt-0.5">{isHi ? 'मौसम रिपोर्ट सुनें' : 'Listen Weather'}</div>
              <div className="text-[10px] text-slate-400 mt-1">{isHi ? 'स्प्रे का सही समय' : 'Spray Timing'}</div>
            </div>
          </button>

          {/* Button 5: Full 360° Field Spoken Audit (Golden Master Button) */}
          <button
            onClick={() => speakSegment('full', getFullSpokenText())}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between shadow-xl relative sm:col-span-2 lg:col-span-1 ${
              currentNarrating === 'full'
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 text-slate-950 font-black ring-2 ring-amber-300'
                : 'bg-gradient-to-br from-amber-500/90 to-amber-600/90 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold border-amber-300/40 shadow-amber-500/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-950/30 text-slate-950">
                <Volume2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-950 text-amber-300">
                360° ALL
              </span>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-mono font-black text-slate-900">5. {isHi ? 'पूरी बात एक साथ' : 'Complete Audit'}</div>
              <div className="text-sm font-black text-slate-950 mt-0.5">{isHi ? '🔊 पूरी रिपोर्ट सुनें' : '🔊 Full Advisory'}</div>
              <div className="text-[10px] text-slate-900/80 mt-1">{isHi ? 'सेहत + खाद + दवा + मौसम' : 'All-in-One Voice'}</div>
            </div>
          </button>

        </div>

        {/* Live Audio Narration Transcript & Equalizer Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2 text-amber-300 font-bold">
              <Radio className={`w-4 h-4 ${currentNarrating ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              {currentNarrating ? (isHi ? 'आवाज़ चल रही है...' : 'AUDIO NARRATING...') : (isHi ? 'आवाज़ तैयार है' : 'VOICE ASSISTANT READY')}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              {variety.varietyName} • ZONE {zone.id}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed min-h-[48px] flex items-center">
            "{activeTranscript}"
          </p>

          {currentNarrating && (
            <div className="flex items-center gap-1.5 pt-1.5">
              <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-pulse" />
              <span className="w-1.5 h-6 bg-amber-400 rounded-full animate-pulse delay-75" />
              <span className="w-1.5 h-3 bg-amber-400 rounded-full animate-pulse delay-150" />
              <span className="w-1.5 h-7 bg-amber-400 rounded-full animate-pulse delay-100" />
              <span className="w-1.5 h-5 bg-amber-400 rounded-full animate-pulse delay-200" />
              <span className="text-xs font-mono text-amber-300 ml-2">
                {isHi ? 'स्पष्ट व सरल किसान आवाज़' : 'Clear Spoken Agronomy Engine'}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* 3. SIMPLE 4-BOX VISUAL STATUS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Crop Health */}
        <div className="agri-card-elevated p-5 rounded-2xl border border-emerald-500/30 space-y-2 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              {isHi ? 'फसल सेहत (Health)' : 'Crop Health'}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              fusion.healthScore > 70 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {fusion.healthScore > 70 ? (isHi ? '✅ बहुत अच्छी' : 'Optimal') : (isHi ? '⚠️ ध्यान दें' : 'Needs Care')}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{fusion.healthScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>

          <p className="text-xs text-slate-300 leading-normal">
            {isHi ? 'पत्तियों का हरापन और वानस्पतिक फैलाव अच्छा है।' : 'Vegetative foliage and chlorophyll reflection are stable.'}
          </p>
        </div>

        {/* Card 2: Soil Moisture */}
        <div className="agri-card-elevated p-5 rounded-2xl border border-cyan-500/30 space-y-2 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              {isHi ? 'मिट्टी में नमी (Moisture)' : 'Soil Moisture'}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              telemetry.soilMoisture < 35 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}>
              {telemetry.soilMoisture < 35 ? (isHi ? '💧 पानी दें' : 'Dry') : (isHi ? '✅ पर्याप्त' : 'Adequate')}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400">{telemetry.soilMoisture.toFixed(0)}%</span>
            <span className="text-xs text-slate-400">{isHi ? 'नमी' : 'VWC'}</span>
          </div>

          <p className="text-xs text-slate-300 leading-normal">
            {telemetry.soilMoisture < 35 
              ? (isHi ? 'जड़ों में सूखापन है, आज शाम हल्की सिंचाई करें।' : 'Root moisture is low. Irrigate field lightly this evening.')
              : (isHi ? 'नमी फसल के लिए अनुकूल है।' : 'Moisture is in the optimal range.')}
          </p>
        </div>

        {/* Card 3: Fertilizer Dosage */}
        <div className="agri-card-elevated p-5 rounded-2xl border border-amber-500/30 space-y-2 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-amber-400" />
              {isHi ? 'खाद की जरूरत (Fertilizer)' : 'Fertilizer Rx'}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {isHi ? 'खुराक तैयार' : 'Calculated'}
            </span>
          </div>

          <div className="space-y-0.5 font-mono">
            <div className="text-sm font-bold text-white">
              🌾 {isHi ? 'यूरिया:' : 'Urea:'} <span className="text-amber-400 font-black">45 kg/Ac</span>
            </div>
            <div className="text-xs text-slate-300">
              🌱 {isHi ? 'डीएपी खाद:' : 'DAP:'} <span className="text-emerald-400 font-bold">30 kg/Ac</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-normal">
            {isHi ? 'सिंचाई के तुरंत बाद सुबह के समय खाद छिड़कें।' : 'Apply in split doses early morning post-irrigation.'}
          </p>
        </div>

        {/* Card 4: Pest & Remedy */}
        <div className="agri-card-elevated p-5 rounded-2xl border border-rose-500/30 space-y-2 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-rose-400" />
              {isHi ? 'रोग व कीड़ा (Pest Status)' : 'Pest Status'}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              isHighRisk 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isHighRisk ? (isHi ? '🚨 रोग चेतावनी' : 'Alert') : (isHi ? '✅ सुरक्षित' : 'Safe')}
            </span>
          </div>

          <div className="text-sm font-bold text-white truncate">
            {isHi ? (isHighRisk ? 'फंगल ब्लास्ट लक्षण' : 'कोई गंभीर रोग नहीं') : (isHighRisk ? 'Fungal Blast Symptoms' : 'Zero Active Outbreak')}
          </div>

          <p className="text-xs text-slate-300 leading-normal">
            {isHighRisk 
              ? (isHi ? 'ट्राइसाइक्लाजोल दवा 0.6g/L पानी में मिलाकर छिड़कें।' : 'Spray Tricyclazole 75% WP @ 0.6 g/L before 8 AM.')
              : (isHi ? 'नीम तेल का हल्का छिड़काव जारी रखें।' : 'Continue routine organic neem oil prevention.')}
          </p>
        </div>

      </div>

      {/* 4. "आज किसान क्या करें?" (TODAY'S 3-STEP ACTION PLAN) */}
      <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-white">
                {isHi ? '🌾 आज किसान भाई क्या करें? (Today’s Action Steps)' : '🌾 Today’s 3-Step Farmer Action Plan'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {isHi ? `${variety.varietyHindi} के लिए आज के 3 मुख्य कार्य` : `Key prioritized agronomic actions for ${variety.varietyName}`}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {isHi ? 'आज का लक्ष्य' : 'Priority Checklist'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Step 1 */}
          <div className="agri-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-black">STEP 01 • {isHi ? 'सुबह' : 'Morning'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-500/30 font-bold">
                7:00 - 9:00 AM
              </span>
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              {isHi ? 'दवाई / फफूंदनाशक का छिड़काव' : 'Antifungal Foliar Spray'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHi 
                ? 'ओस सूखने के तुरंत बाद सुबह 8 बजे से पहले स्प्रे करें ताकि दवाई पत्ती पर पूरी तरह असर करे।'
                : 'Spray prescribed antifungal solution early morning to maximize foliar absorption before midday heat.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="agri-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-black">STEP 02 • {isHi ? 'दोपहर' : 'Afternoon'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-500/30 font-bold">
                {isHi ? 'सिंचाई' : 'Water'}
              </span>
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              {isHi ? 'हल्की सिंचाई और जल स्तर जांच' : 'Controlled Irrigation'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHi 
                ? 'खेत में 3 से 4 सेंटीमीटर पानी बनाए रखें। पानी को 2 दिन बाद निकलने दें ताकि जड़ों को हवा मिले।'
                : 'Maintain 3-4 cm water depth across the basin to relieve root moisture stress.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="agri-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-black">STEP 03 • {isHi ? 'शाम' : 'Evening'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-emerald-300 border border-emerald-500/30 font-bold">
                {isHi ? 'खाद' : 'NPK Top Dress'}
              </span>
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              {isHi ? 'यूरिया और पोटाश खाद देना' : 'Urea & Potash Top-Dressing'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHi 
                ? 'सिंचाई के बाद शाम को प्रति एकड़ 45 किलो नीम कोटेड यूरिया डालें। इससे नए कल्ले तेजी से फूटेंगे।'
                : 'Broadcast 45 kg Neem Coated Urea after irrigation to fuel rapid vegetative tiller growth.'}
            </p>
          </div>

        </div>
      </div>

      {/* 5. DIRECT SHORTCUT TILES TO SPECIALIZED MODULES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Leaf Doctor Camera Shortcut */}
        <button
          onClick={() => {
            audio.playClick();
            onNavigateTab('camera_doctor');
          }}
          className="agri-card p-4 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 transition-all text-left flex items-center justify-between group shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-400 font-bold">
                {isHi ? 'फोटो खींचकर रोग जांचें' : 'AI Camera Doctor'}
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {isHi ? 'पत्ती रोग स्कैनर' : 'Leaf Pathology Scanner'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </button>

        {/* Fertilizer Rx Shortcut */}
        <button
          onClick={() => {
            audio.playClick();
            onNavigateTab('fertilizer_doctor');
          }}
          className="agri-card p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition-all text-left flex items-center justify-between group shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400 font-bold">
                {isHi ? 'खेत का एकड़ नापें' : 'Acreage Calculator'}
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {isHi ? 'खाद व बोरी कैलकुलेटर' : 'Fertilizer & Bags Calculator'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </button>

        {/* Live Weather Shortcut with Refresh */}
        <div className="agri-card p-4 rounded-2xl border border-cyan-500/30 text-left flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                <span>{weather.temperature}°C {isHi ? weather.conditionHindi : weather.condition}</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {isHi ? 'छिड़काव सलाह:' : 'Spray Advisory:'} <strong className="text-emerald-400">{isHi ? weather.sprayAdvisoryHindi : weather.sprayAdvisory}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playPulse();
              onRefreshWeather();
            }}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-cyan-400 transition-all"
            title="Refresh Weather"
          >
            <RefreshCw className={`w-4 h-4 ${isWeatherLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

      </div>

    </div>
  );
};
