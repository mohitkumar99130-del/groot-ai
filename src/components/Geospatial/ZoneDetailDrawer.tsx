import React from 'react';
import { FieldZone, FusionResult, AppLanguage } from '../../types/groot';
import { 
  MapPin, 
  HeartPulse, 
  ShieldAlert, 
  ShieldCheck, 
  Thermometer, 
  Sparkles, 
  Volume2, 
  Camera, 
  FlaskConical, 
  AlertTriangle
} from 'lucide-react';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';


interface ZoneDetailDrawerProps {
  zone: FieldZone;
  fusion: FusionResult;
  language: AppLanguage;
  onNavigateToDiagnostics: () => void;
  onNavigateToFertilizer: () => void;
}

export const ZoneDetailDrawer: React.FC<ZoneDetailDrawerProps> = ({
  zone,
  fusion,
  language,
  onNavigateToDiagnostics,
  onNavigateToFertilizer,
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const isHighRisk = fusion.riskPercentage > 60;

  const handleSpeakZone = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const text = language === 'hi'
      ? `खेत क्षेत्र ${zone.id} की रिपोर्ट। स्वास्थ्य स्कोर ${fusion.healthScore} प्रतिशत है। जोखिम स्तर ${fusion.riskPercentage} प्रतिशत है। ${isHighRisk ? 'चेतावनी: तुरंत फंगल ब्लास्ट की दवाई छिड़कें और पानी दें।' : 'फसल सामान्य स्थिति में है।'}`
      : `Report for Field ${zone.id}. Health score is ${fusion.healthScore} percent, with risk level at ${fusion.riskPercentage} percent. ${isHighRisk ? 'Warning: Urgent antifungal spray and irrigation required.' : 'Crop condition is optimal.'}`;
    await realVoiceService.speak(text, language === 'hi' ? 'hi' : 'en');
    setIsSpeaking(false);
  };

  return (
    <div className="agri-card-elevated p-4 sm:p-5 rounded-2xl border border-emerald-500/25 space-y-4 shadow-xl">
      {/* Header with Zone ID & Status Badge */}
      <div className="flex items-start justify-between gap-3 border-b border-emerald-500/15 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-black text-lg text-white">
              {zone.id}
            </h3>
            {zone.isHotspot && (
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> HOTSPOT
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            GPS: 20.89{40 + zone.row * 2}° N, 85.83{10 + zone.col * 3}° E • Parcel 1.0 Ha
          </p>
        </div>

        {/* Condition Badge */}
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
          isHighRisk
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          {isHighRisk ? '🚨 ' + zone.cropCondition : '✅ ' + zone.cropCondition}
        </span>
      </div>

      {/* Tri-Modal Score Matrix */}
      <div className="grid grid-cols-3 gap-2 text-center font-mono">
        <div className="agri-card-subtle p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <HeartPulse className="w-3 h-3 text-emerald-400" /> Health
          </div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">
            {fusion.healthScore}<span className="text-[10px] text-slate-500 font-normal">/100</span>
          </div>
        </div>

        <div className="agri-card-subtle p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            {isHighRisk ? <ShieldAlert className="w-3 h-3 text-rose-400" /> : <ShieldCheck className="w-3 h-3 text-emerald-400" />} Risk
          </div>
          <div className={`text-xl font-black mt-0.5 ${isHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
            {fusion.riskPercentage}%
          </div>
        </div>

        <div className="agri-card-subtle p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> AI Conf.
          </div>
          <div className="text-xl font-black text-cyan-400 mt-0.5">
            {fusion.confidenceScore}%
          </div>
        </div>
      </div>

      {/* Spectral Radiometric Indices */}
      <div className="space-y-2 text-xs font-mono">
        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
          Sentinel-2 Radiometric Indices
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="agri-card-subtle p-2 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">NDVI (Canopy):</span>
            <span className={`font-bold ${zone.ndvi < 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {zone.ndvi.toFixed(2)}
            </span>
          </div>

          <div className="agri-card-subtle p-2 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">NDMI (Moisture):</span>
            <span className={`font-bold ${zone.ndmi < 0.1 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {zone.ndmi.toFixed(2)}
            </span>
          </div>

          <div className="agri-card-subtle p-2 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Surface Temp:</span>
            <span className="font-bold text-amber-300 flex items-center gap-0.5">
              <Thermometer className="w-3 h-3" />
              {zone.surfaceTemp}°C
            </span>
          </div>

          <div className="agri-card-subtle p-2 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Chlorophyll:</span>
            <span className="font-bold text-emerald-300">
              {zone.chlorophyllIndex.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Agronomist Notes & Description */}
      <div className="agri-card-subtle p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold mb-1">
          Field Scout Observation
        </span>
        {zone.notes}
      </div>

      {/* Action Buttons: Audio Voice + Direct Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        <button
          onClick={handleSpeakZone}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md ${
            isSpeaking ? 'btn-agri-voice animate-pulse' : 'btn-agri-voice'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? 'बोल रहा है...' : (language === 'hi' ? 'आवाज़ सुनें' : 'Listen')}</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigateToDiagnostics();
          }}
          className="py-2 px-3 rounded-xl text-xs font-semibold btn-agri-secondary flex items-center justify-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'hi' ? 'रोग जांच' : 'Diagnose'}</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onNavigateToFertilizer();
          }}
          className="py-2 px-3 rounded-xl text-xs font-semibold btn-agri-primary flex items-center justify-center gap-1.5 text-slate-950"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'खाद Rx' : 'Prescribe'}</span>
        </button>
      </div>
    </div>
  );
};
