import React, { useState, useEffect } from 'react';
import { SensorTelemetry, AppLanguage } from '../../types/groot';
import { 
  Droplets, 
  Thermometer, 
  Zap, 
  Battery, 
  Sliders, 
  Flame, 
  CloudRain, 
  SunMedium, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { audio } from '../../services/audioService';
import { SensorPacketLog } from './SensorPacketLog';


interface IoTSoilMeshDashboardProps {
  telemetry: SensorTelemetry;
  onUpdateTelemetry: (newTelemetry: SensorTelemetry) => void;
  zoneId: string;
  language: AppLanguage;
}

export const IoTSoilMeshDashboard: React.FC<IoTSoilMeshDashboardProps> = ({
  telemetry,
  onUpdateTelemetry,
  zoneId,
  language,
}) => {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Live streaming heartbeat simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      onUpdateTelemetry({
        ...telemetry,
        soilMoisture: Math.max(5, Math.min(95, telemetry.soilMoisture + (Math.random() - 0.49) * 0.4)),
        ambientTemp: Math.max(15, Math.min(45, telemetry.ambientTemp + (Math.random() - 0.5) * 0.15)),
        humidity: Math.max(20, Math.min(99, telemetry.humidity + (Math.random() - 0.5) * 0.25)),
        lastUpdated: `Live Mesh Sync: ${new Date().toLocaleTimeString()}`,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, telemetry, onUpdateTelemetry]);

  // Stress Ingestion Triggers
  const handleTriggerDrought = () => {
    audio.playPulse();
    setActivePreset('drought');
    onUpdateTelemetry({
      ...telemetry,
      soilMoisture: 18.2,
      ambientTemp: 37.4,
      humidity: 34.0,
      npk: { ...telemetry.npk, nitrogen: 14.0 },
      lastUpdated: 'Injected Drought Event at ' + new Date().toLocaleTimeString(),
    });
  };

  const handleTriggerRain = () => {
    audio.playPulse();
    setActivePreset('rain');
    onUpdateTelemetry({
      ...telemetry,
      soilMoisture: 86.5,
      ambientTemp: 24.1,
      humidity: 89.0,
      lastUpdated: 'Injected Rain Surge at ' + new Date().toLocaleTimeString(),
    });
  };

  const handleTriggerHeatwave = () => {
    audio.playPulse();
    setActivePreset('heatwave');
    onUpdateTelemetry({
      ...telemetry,
      soilMoisture: 22.0,
      ambientTemp: 39.8,
      humidity: 29.5,
      lastUpdated: 'Injected Heatwave at ' + new Date().toLocaleTimeString(),
    });
  };

  const handleResetOptimal = () => {
    audio.playClick();
    setActivePreset('optimal');
    onUpdateTelemetry({
      ...telemetry,
      soilMoisture: 68.0,
      ambientTemp: 26.5,
      humidity: 65.0,
      soilPh: 6.5,
      npk: { nitrogen: 38.0, phosphorus: 24.0, potassium: 36.0 },
      lastUpdated: 'Restored Optimal Baseline at ' + new Date().toLocaleTimeString(),
    });
  };

  const handleSliderChange = (field: keyof SensorTelemetry | 'nitrogen' | 'phosphorus' | 'potassium', value: number) => {
    setActivePreset(null);
    if (field === 'nitrogen' || field === 'phosphorus' || field === 'potassium') {
      onUpdateTelemetry({
        ...telemetry,
        npk: {
          ...telemetry.npk,
          [field]: value,
        },
        lastUpdated: `Tuned by Agronomist: ${new Date().toLocaleTimeString()}`,
      });
    } else {
      onUpdateTelemetry({
        ...telemetry,
        [field]: value,
        lastUpdated: `Tuned by Agronomist: ${new Date().toLocaleTimeString()}`,
      });
    }
  };

  const getMoistureStatus = (val: number) => {
    if (val < 30) return { label: 'CRITICAL DROUGHT', color: 'text-rose-400 border-rose-500/50 bg-rose-950/60' };
    if (val < 50) return { label: 'MODERATE DEFICIT', color: 'text-amber-400 border-amber-500/50 bg-amber-950/60' };
    if (val <= 80) return { label: 'OPTIMAL PADDY', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/60' };
    return { label: 'WATERLOGGED', color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/60' };
  };

  const statusBadge = getMoistureStatus(telemetry.soilMoisture);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-purple-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400 animate-pulse" />
            <h2 className="font-display font-black text-lg sm:text-xl text-white">
              {language === 'hi' ? '🎛️ ऑन-फील्ड IoT सेंसर मेश टेलीमेट्री (ESP32 Nodes)' : '🎛️ On-Field IoT Soil Sensor Mesh & Hardware Telemetry'}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
              NODE #04 • ZONE {zoneId}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Real-time subsurface volumetric water content, soil temperature, pH, and electro-chemical NPK telemetry.
          </p>
        </div>

        {/* Live Stream Heartbeat Indicator & Pause Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
              isLiveStreaming
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isLiveStreaming ? 'LIVE STREAM ACTIVE' : 'STREAM PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Main Sensor Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Soil Moisture Gauge */}
        <div className="agri-card p-4 rounded-2xl border border-cyan-500/30 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Soil Moisture (VWC)
            </span>
            <span className="text-[10px]">Root Depth: 20cm</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black font-mono text-cyan-300">
              {telemetry.soilMoisture.toFixed(1)}<span className="text-sm text-slate-400 font-normal">%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${Math.min(100, telemetry.soilMoisture)}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
            <span className={`px-2 py-0.5 rounded border font-bold ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
            <span className="text-slate-400">Target: 65-80%</span>
          </div>
        </div>

        {/* Ambient & Soil Temperature */}
        <div className="agri-card p-4 rounded-2xl border border-amber-500/30 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Thermometer className="w-4 h-4 text-amber-400" />
              Soil & Ambient Temp
            </span>
            <span className="text-[10px]">DS18B20 Probe</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black font-mono text-amber-300">
              {telemetry.ambientTemp.toFixed(1)}<span className="text-sm text-slate-400 font-normal">°C</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300">
              Subsoil: <strong className="text-white">{telemetry.soilTemp}°C</strong> • Canopy: <strong className="text-white">{telemetry.ambientTemp.toFixed(1)}°C</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-emerald-400">Normal Range (22-32°C)</span>
            <span>Humidity: {telemetry.humidity.toFixed(0)}%</span>
          </div>
        </div>

        {/* Soil pH & EC */}
        <div className="agri-card p-4 rounded-2xl border border-emerald-500/30 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <Zap className="w-4 h-4 text-emerald-400" />
              Soil pH & Conductivity
            </span>
            <span className="text-[10px]">Ion Sensitive</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black font-mono text-emerald-400">
              {telemetry.soilPh.toFixed(1)} <span className="text-sm text-slate-400 font-normal">pH</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300">
              EC: <strong className="text-white">{telemetry.electricalConductivity} dS/m</strong> (Salinity Index)
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-emerald-300">Slightly Acidic (Optimal Paddy)</span>
            <span>TDS: 620 ppm</span>
          </div>
        </div>

        {/* Node Hardware Health */}
        <div className="agri-card p-4 rounded-2xl border border-purple-500/30 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-purple-300 font-bold">
              <Battery className="w-4 h-4 text-purple-400" />
              ESP32 Node Health
            </span>
            <span className="text-[10px]">LoRa 868MHz</span>
          </div>

          <div className="space-y-1 font-mono">
            <div className="text-3xl font-black text-purple-300">
              {telemetry.batteryVoltage} <span className="text-sm text-slate-400 font-normal">Volts</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Mesh Signal (RSSI): <strong className="text-emerald-400">{telemetry.rssi} dBm</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-emerald-400">Solar Charging (100%)</span>
            <span>Mesh Active</span>
          </div>
        </div>

      </div>

      {/* NPK Macronutrient Concentration Panel */}
      <div className="agri-card p-5 rounded-3xl border border-emerald-500/25 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Subsoil N-P-K Concentration Meters (mg/kg dry soil)
          </h4>
          <span className="text-[10px] font-mono text-slate-400">Optical Multi-Spectrophotometer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nitrogen */}
          <div className="agri-card-subtle p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">Nitrogen (N)</span>
              <span className={`font-black ${telemetry.npk.nitrogen < 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {telemetry.npk.nitrogen.toFixed(1)} mg/kg
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, telemetry.npk.nitrogen * 2)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{telemetry.npk.nitrogen < 25 ? '⚠️ Deficit' : '✅ Balanced'}</span>
              <span>Ideal: 35-50 mg/kg</span>
            </div>
          </div>

          {/* Phosphorus */}
          <div className="agri-card-subtle p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">Phosphorus (P)</span>
              <span className={`font-black ${telemetry.npk.phosphorus < 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {telemetry.npk.phosphorus.toFixed(1)} mg/kg
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, telemetry.npk.phosphorus * 3)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{telemetry.npk.phosphorus < 15 ? '⚠️ Marginal' : '✅ Optimal'}</span>
              <span>Ideal: 20-30 mg/kg</span>
            </div>
          </div>

          {/* Potassium */}
          <div className="agri-card-subtle p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400">Potassium (K)</span>
              <span className="font-black text-cyan-300">
                {telemetry.npk.potassium.toFixed(1)} mg/kg
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, telemetry.npk.potassium * 2)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>✅ Healthy Reserve</span>
              <span>Ideal: 30-45 mg/kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stress Injector (Interactive Demo Testing Bar) */}
      <div className="agri-card-elevated p-5 rounded-3xl border border-amber-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
          <div>
            <h4 className="font-display font-black text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {language === 'hi' ? 'हैकथॉन जज लाइव स्ट्रेस सिम्युलेटर (Demo Stress Injector)' : 'Hackathon Judge Live Stress Simulation Panel'}
            </h4>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Inject real-time anomalies to observe multimodal AI fusion recalculation.
            </p>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 self-start sm:self-auto">
            LIVE MULTIMODAL INGESTION
          </span>
        </div>

        {/* 4 Quick Preset Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={handleTriggerDrought}
            className={`p-3 rounded-2xl font-mono text-xs font-bold transition-all border flex flex-col items-center gap-1.5 shadow-md ${
              activePreset === 'drought'
                ? 'bg-rose-500/25 text-rose-200 border-rose-500 ring-2 ring-rose-400/50'
                : 'agri-card-subtle text-slate-300 hover:text-white border-slate-800 hover:border-rose-500/40'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>1. Flash Drought</span>
            <span className="text-[9px] text-rose-400 font-normal">Moisture 18.2%</span>
          </button>

          <button
            onClick={handleTriggerRain}
            className={`p-3 rounded-2xl font-mono text-xs font-bold transition-all border flex flex-col items-center gap-1.5 shadow-md ${
              activePreset === 'rain'
                ? 'bg-cyan-500/25 text-cyan-200 border-cyan-500 ring-2 ring-cyan-400/50'
                : 'agri-card-subtle text-slate-300 hover:text-white border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <span>2. Monsoon Surge</span>
            <span className="text-[9px] text-cyan-400 font-normal">Moisture 86.5%</span>
          </button>

          <button
            onClick={handleTriggerHeatwave}
            className={`p-3 rounded-2xl font-mono text-xs font-bold transition-all border flex flex-col items-center gap-1.5 shadow-md ${
              activePreset === 'heatwave'
                ? 'bg-amber-500/25 text-amber-200 border-amber-500 ring-2 ring-amber-400/50'
                : 'agri-card-subtle text-slate-300 hover:text-white border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <SunMedium className="w-4 h-4 text-amber-400" />
            <span>3. Heatwave Alert</span>
            <span className="text-[9px] text-amber-400 font-normal">Temp 39.8°C</span>
          </button>

          <button
            onClick={handleResetOptimal}
            className={`p-3 rounded-2xl font-mono text-xs font-bold transition-all border flex flex-col items-center gap-1.5 shadow-md ${
              activePreset === 'optimal'
                ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500 ring-2 ring-emerald-400/50'
                : 'agri-card-subtle text-slate-300 hover:text-white border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>4. Restore Optimal</span>
            <span className="text-[9px] text-emerald-400 font-normal">Moisture 68.0%</span>
          </button>
        </div>

        {/* Granular Sliders for Judge Interaction */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Tune Soil Moisture:</span>
              <strong className="text-cyan-300">{telemetry.soilMoisture.toFixed(1)}%</strong>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              step="1"
              value={telemetry.soilMoisture}
              onChange={(e) => handleSliderChange('soilMoisture', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-900 rounded"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Tune Ambient Temp:</span>
              <strong className="text-amber-300">{telemetry.ambientTemp.toFixed(1)}°C</strong>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="0.5"
              value={telemetry.ambientTemp}
              onChange={(e) => handleSliderChange('ambientTemp', Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-900 rounded"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Tune Soil Nitrogen:</span>
              <strong className="text-emerald-300">{telemetry.npk.nitrogen.toFixed(1)} mg/kg</strong>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={telemetry.npk.nitrogen}
              onChange={(e) => handleSliderChange('nitrogen', Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-900 rounded"
            />
          </div>
        </div>
      </div>

      {/* Live MQTT Packet Feed Stream */}
      <SensorPacketLog telemetry={telemetry} zoneId={zoneId} />
    </div>
  );
};
