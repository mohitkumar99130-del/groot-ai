import React, { useState } from 'react';
import { 
  Volume2, 
  Radio
} from 'lucide-react';
import { AppLanguage, SensorTelemetry, FieldZone, RealtimeWeather } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';

interface WaterIrrigationPageProps {
  telemetry: SensorTelemetry;
  onUpdateTelemetry: (telemetry: SensorTelemetry) => void;
  zone: FieldZone;
  weather: RealtimeWeather;
  variety: CropVariety;
  language: AppLanguage;
  onNavigateTab?: (tab: any) => void;
}

export const WaterIrrigationPage: React.FC<WaterIrrigationPageProps> = ({
  telemetry,
  onUpdateTelemetry,
  zone,
  weather,
  variety,
  language,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isHi = language === 'hi';

  const moisture = telemetry.soilMoisture;
  const isStress = moisture < 30;
  const isModerate = moisture >= 30 && moisture < 50;

  const handleSpeakWater = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const text = isHi
      ? `पानी व सिंचाई सलाह: खेत में मिट्टी की नमी ${moisture.toFixed(0)} प्रतिशत है। ${
          isStress
            ? 'नमी बहुत कम है। कल सुबह हल्की सिंचाई तुरंत करें।'
            : isModerate
            ? 'नमी सामान्य से थोड़ी कम है। 2 दिन के भीतर सिंचाई की आवश्यकता हो सकती है।'
            : 'खेत में पर्याप्त पानी है। अभी सिंचाई करने की आवश्यकता नहीं है।'
        }`
      : `Water and Irrigation Guide: Soil moisture is at ${moisture.toFixed(0)} percent. ${
          isStress
            ? 'Moisture is critically low. Schedule light irrigation tomorrow morning.'
            : isModerate
            ? 'Moisture is slightly below baseline. Plan irrigation within 2 days.'
            : 'Soil moisture is optimal. No irrigation required today.'
        }`;

    await realVoiceService.speak(text, language);
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#031108] border border-cyan-500/30 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>💧 {isHi ? 'पानी व सिंचाई स्थिति (Water & Irrigation)' : 'Water & Irrigation Dashboard'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {variety.iconEmoji} {variety.varietyName} • Target Sector {zone.id}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSpeakWater}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg transition-all ${
              isSpeaking ? 'btn-agri-voice animate-pulse' : 'btn-agri-voice'
            }`}
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>{isSpeaking ? 'बोल रहा है...' : (isHi ? '🔊 आवाज़ में समझें' : '🔊 Explain Water Status')}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Water Status Card (Simple First) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#03140d] to-slate-950 border-2 border-cyan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {isStress ? '🔴' : isModerate ? '🟡' : '🟢'}
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-white">
                {isStress
                  ? (isHi ? 'खेत में पानी की कमी (Water Stress Detected)' : 'Water Stress Detected in Soil')
                  : isModerate
                  ? (isHi ? '2 दिन में पानी की आवश्यकता (Water May Be Needed)' : 'Water May Be Needed Soon')
                  : (isHi ? 'पर्याप्त नमी उपलब्ध है (Enough Water in Soil)' : 'Adequate Soil Moisture')}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Current Soil Moisture: <span className="font-bold text-cyan-300">{moisture.toFixed(0)}%</span> (Ideal for {variety.cropName}: 50-70%)
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shrink-0">
            <div className="text-[10px] font-mono text-slate-400">Volumetric Water Content</div>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">{moisture.toFixed(1)}%</div>
          </div>
        </div>

        {/* Recommended Farmer Action */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs text-slate-200 space-y-1">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
            <span>💡 {isHi ? 'अनुशंसित कदम (Recommended Action):' : 'Recommended Action:'}</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            {isStress
              ? (isHi 
                  ? 'कल सुबह 6:00 से 9:00 बजे के बीच 2 इंच हल्की सिंचाई करें। दोपहर की कड़ी धूप में पानी न लगाएं।'
                  : 'Apply 2-inch light irrigation tomorrow between 6:00 AM and 9:00 AM. Avoid watering under midday heat.')
              : isModerate
              ? (isHi
                  ? 'खेत की सतह के नीचे 2 इंच खुदाई करके देखें। यदि मिट्टी भुरभुरी है तो परसों सिंचाई की योजना बनाएं।'
                  : 'Check root zone moisture 2 inches below surface. Plan irrigation in 48 hours if soil is crumbly.')
              : (isHi
                  ? 'खेत में पानी पर्याप्त है। बारिश के पूर्वानुमान पर नज़र रखें।'
                  : 'Moisture levels are optimal. Continue monitoring forecast before any further watering.')}
          </p>
        </div>
      </div>

      {/* 3. Soil Moisture & IoT Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-3xl bg-[#031108] border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">Soil Temperature</div>
          <div className="text-2xl font-black text-white font-mono">{telemetry.soilTemp}°C</div>
          <div className="text-[11px] text-emerald-400">Optimal root metabolic rate</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#031108] border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">Soil pH Level</div>
          <div className="text-2xl font-black text-white font-mono">{telemetry.soilPh} pH</div>
          <div className="text-[11px] text-cyan-400">Neutral nutrient absorption stage</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#031108] border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">Rain Forecast</div>
          <div className="text-2xl font-black text-white font-mono">{weather.rainMm} mm</div>
          <div className="text-[11px] text-amber-300">Little chance of sudden rain</div>
        </div>

      </div>

      {/* 4. IoT Soil Mesh Simulator Slider */}
      <div className="p-6 rounded-3xl bg-[#031108] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              {isHi ? '🎛️ मिट्टी में नमी सिमुलेटर (Test Moisture Level)' : '🎛️ Live IoT Soil Moisture Simulator'}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {telemetry.soilMoisture.toFixed(0)}%
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="90"
          value={telemetry.soilMoisture}
          onChange={(e) => {
            onUpdateTelemetry({
              ...telemetry,
              soilMoisture: parseFloat(e.target.value),
              lastUpdated: 'Just now (Simulated)',
            });
          }}
          className="w-full accent-emerald-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>10% (Severe Drought)</span>
          <span>40% (Mild Deficit)</span>
          <span>65% (Optimal)</span>
          <span>90% (Waterlogged)</span>
        </div>
      </div>

    </div>
  );
};
