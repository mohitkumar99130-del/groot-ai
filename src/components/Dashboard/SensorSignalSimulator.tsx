import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Activity, 
  Zap, 
  Droplets, 
  Thermometer, 
  Wind, 
  FlaskConical, 
  Check, 
  Sparkles,
  Flame,
  CloudRain,
  SunMedium
} from 'lucide-react';
import { SensorTelemetry } from '../../types/groot';
import { audio } from '../../services/audioService';

interface SensorSignalSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: SensorTelemetry;
  onUpdateTelemetry: (newTelemetry: SensorTelemetry) => void;
  zoneId: string;
}

export const SensorSignalSimulator: React.FC<SensorSignalSimulatorProps> = ({
  isOpen,
  onClose,
  telemetry,
  onUpdateTelemetry,
  zoneId,
}) => {
  const [localTelemetry, setLocalTelemetry] = useState<SensorTelemetry>(telemetry);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSliderChange = (field: keyof SensorTelemetry | 'nitrogen' | 'phosphorus' | 'potassium', value: number) => {
    let updated: SensorTelemetry;
    if (field === 'nitrogen' || field === 'phosphorus' || field === 'potassium') {
      updated = {
        ...localTelemetry,
        npk: {
          ...localTelemetry.npk,
          [field]: value,
        },
        lastUpdated: `Live signal tuned by Judge: ${new Date().toLocaleTimeString()}`,
      };
    } else {
      updated = {
        ...localTelemetry,
        [field]: value,
        lastUpdated: `Live signal tuned by Judge: ${new Date().toLocaleTimeString()}`,
      };
    }
    setLocalTelemetry(updated);
    onUpdateTelemetry(updated);
  };

  const applyJudgePreset = (presetName: string, data: Partial<SensorTelemetry> & { npk?: { nitrogen: number; phosphorus: number; potassium: number } }) => {
    audio.playPulse();
    setActivePreset(presetName);
    const updated: SensorTelemetry = {
      ...localTelemetry,
      ...data,
      npk: data.npk ? { ...localTelemetry.npk, ...data.npk } : localTelemetry.npk,
      lastUpdated: `Preset loaded [${presetName}] at ${new Date().toLocaleTimeString()}`,
    };
    setLocalTelemetry(updated);
    onUpdateTelemetry(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
      <div className="relative w-full max-w-2xl glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/40 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Sliders className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                IoT Sensor Signal Generator
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  JUDGE DEMO MODE
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Simulating wireless sensor mesh telemetry for Sector <strong className="text-white">{zoneId}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full glass-panel text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Signal Waveform Banner */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono-code text-slate-300">
              PACKET GENERATOR: ESP32-LORA 868MHz • 20 Bytes Payload
            </span>
          </div>

          {/* Animated Signal Frequency Waveform */}
          <div className="flex items-center gap-1 h-6">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-emerald-400 rounded-full animate-pulse"
                style={{
                  height: `${Math.floor(Math.sin(i + Date.now() * 0.005) * 10 + 12)}px`,
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* One-Touch Judge Scenario Presets */}
        <div>
          <span className="text-xs font-mono-code text-slate-300 block mb-2 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Select Quick Demo Scenario for Judges:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            
            <button
              onClick={() => applyJudgePreset('Nitrogen Deficiency', {
                soilMoisture: 42,
                ambientTemp: 29.5,
                humidity: 55,
                soilPh: 6.5,
                electricalConductivity: 1.1,
                npk: { nitrogen: 12.0, phosphorus: 35.0, potassium: 65.0 }
              })}
              className={`p-3 rounded-xl text-left border transition-all ${
                activePreset === 'Nitrogen Deficiency'
                  ? 'bg-amber-950/80 border-amber-400 ring-1 ring-amber-400 text-amber-200'
                  : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Zap className="w-3.5 h-3.5" /> Nitrogen Depleted
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Triggers Urea Fertilizer recommendation</p>
            </button>

            <button
              onClick={() => applyJudgePreset('Severe Drought', {
                soilMoisture: 16.5,
                ambientTemp: 38.2,
                humidity: 28,
                soilPh: 7.1,
                electricalConductivity: 1.8,
                npk: { nitrogen: 18.0, phosphorus: 14.0, potassium: 32.0 }
              })}
              className={`p-3 rounded-xl text-left border transition-all ${
                activePreset === 'Severe Drought'
                  ? 'bg-red-950/80 border-red-400 ring-1 ring-red-400 text-red-200'
                  : 'bg-slate-900/70 border-slate-800 hover:border-red-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                <Flame className="w-3.5 h-3.5" /> Critical Drought
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Triggers 25mm surge flood alert</p>
            </button>

            <button
              onClick={() => applyJudgePreset('Pest Risk High', {
                soilMoisture: 82.0,
                ambientTemp: 34.5,
                humidity: 91.0,
                soilPh: 6.8,
                electricalConductivity: 1.4,
                npk: { nitrogen: 28.0, phosphorus: 18.0, potassium: 25.0 }
              })}
              className={`p-3 rounded-xl text-left border transition-all ${
                activePreset === 'Pest Risk High'
                  ? 'bg-teal-950/80 border-teal-400 ring-1 ring-teal-400 text-teal-200'
                  : 'bg-slate-900/70 border-slate-800 hover:border-teal-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
                <CloudRain className="w-3.5 h-3.5" /> High Fungal Risk
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Triggers Tricyclazole spray advice</p>
            </button>

            <button
              onClick={() => applyJudgePreset('Optimal Paddy', {
                soilMoisture: 72.0,
                ambientTemp: 26.5,
                humidity: 65.0,
                soilPh: 6.5,
                electricalConductivity: 1.2,
                npk: { nitrogen: 85.0, phosphorus: 45.0, potassium: 120.0 }
              })}
              className={`p-3 rounded-xl text-left border transition-all ${
                activePreset === 'Optimal Paddy'
                  ? 'bg-emerald-950/80 border-emerald-400 ring-1 ring-emerald-400 text-emerald-200'
                  : 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <SunMedium className="w-3.5 h-3.5" /> Optimal Paddy
              </div>
              <p className="text-[10px] text-slate-400 mt-1">High crop productivity benchmark</p>
            </button>

            <button
              onClick={() => applyJudgePreset('Saline & Potash Deficit', {
                soilMoisture: 58.0,
                ambientTemp: 31.0,
                humidity: 50.0,
                soilPh: 8.2,
                electricalConductivity: 3.4,
                npk: { nitrogen: 45.0, phosphorus: 30.0, potassium: 18.0 }
              })}
              className={`p-3 rounded-xl text-left border transition-all col-span-2 sm:col-span-1 ${
                activePreset === 'Saline & Potash Deficit'
                  ? 'bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400 text-cyan-200'
                  : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <FlaskConical className="w-3.5 h-3.5" /> High EC / Low K
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Triggers MOP + Gypsum treatment</p>
            </button>

          </div>
        </div>

        {/* Live Manual Sliders Controls */}
        <div className="space-y-4 pt-2">
          <span className="text-xs font-mono-code text-slate-300 block font-bold">
            Fine-Tune Signal Sliders Live:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Soil Moisture Slider */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-cyan-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" /> Soil Moisture
                </span>
                <span className="font-bold text-white">{localTelemetry.soilMoisture.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="0.5"
                value={localTelemetry.soilMoisture}
                onChange={(e) => handleSliderChange('soilMoisture', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Ambient Air Temp Slider */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-amber-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" /> Air Temperature
                </span>
                <span className="font-bold text-white">{localTelemetry.ambientTemp.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                step="0.5"
                value={localTelemetry.ambientTemp}
                onChange={(e) => handleSliderChange('ambientTemp', parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Humidity Slider */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-teal-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5" /> Relative Humidity
                </span>
                <span className="font-bold text-white">{localTelemetry.humidity.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="98"
                step="1"
                value={localTelemetry.humidity}
                onChange={(e) => handleSliderChange('humidity', parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Nitrogen N Slider */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-amber-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Nitrogen N
                </span>
                <span className="font-bold text-white">{localTelemetry.npk.nitrogen} mg/kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="1"
                value={localTelemetry.npk.nitrogen}
                onChange={(e) => handleSliderChange('nitrogen', parseInt(e.target.value))}
                className="w-full accent-amber-300 cursor-pointer"
              />
            </div>

            {/* Phosphorus P Slider */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-slate-300 flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-indigo-400" /> Phosphorus P
                </span>
                <span className="font-bold text-white">{localTelemetry.npk.phosphorus} mg/kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={localTelemetry.npk.phosphorus}
                onChange={(e) => handleSliderChange('phosphorus', parseInt(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>

            {/* Potassium K Slider */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-emerald-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Potassium K
                </span>
                <span className="font-bold text-white">{localTelemetry.npk.potassium} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                step="1"
                value={localTelemetry.npk.potassium}
                onChange={(e) => handleSliderChange('potassium', parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Footer Done button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold font-mono-code bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-lg"
          >
            <Check className="w-4 h-4" /> APPLY SIGNAL TO DASHBOARD
          </button>
        </div>

      </div>
    </div>
  );
};
