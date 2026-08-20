import React, { useEffect, useState } from 'react';
import { SensorTelemetry } from '../../types/groot';
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  Zap, 
  Activity, 
  Wifi, 
  Battery, 
  Sliders, 
  Flame, 
  CloudRain, 
  SunMedium, 
  CheckCircle2 
} from 'lucide-react';
import { audio } from '../../services/audioService';

interface TelemetryStreamProps {
  telemetry: SensorTelemetry;
  onUpdateTelemetry: (newTelemetry: SensorTelemetry) => void;
  zoneId: string;
}

export const TelemetryStream: React.FC<TelemetryStreamProps> = ({
  telemetry,
  onUpdateTelemetry,
  zoneId,
}) => {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Live streaming heartbeat simulation: slight jitter every 2.5s
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      onUpdateTelemetry({
        ...telemetry,
        soilMoisture: Math.max(5, Math.min(95, telemetry.soilMoisture + (Math.random() - 0.49) * 0.4)),
        ambientTemp: Math.max(15, Math.min(45, telemetry.ambientTemp + (Math.random() - 0.5) * 0.2)),
        humidity: Math.max(20, Math.min(99, telemetry.humidity + (Math.random() - 0.5) * 0.3)),
        lastUpdated: `Live stream: ${new Date().toLocaleTimeString()}`,
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming, telemetry, onUpdateTelemetry]);

  // Stress Ingestion Triggers
  const handleTriggerDrought = () => {
    audio.playPulse();
    onUpdateTelemetry({
      ...telemetry,
      soilMoisture: 18.2,
      ambientTemp: 37.4,
      humidity: 34.0,
      lastUpdated: 'Injected Drought Event at ' + new Date().toLocaleTimeString(),
    });
  };

  const handleTriggerRain = () => {
    audio.playPulse();
    onUpdateTelemetry({
      ...telemetry,
      soilMoisture: 84.5,
      ambientTemp: 24.1,
      humidity: 88.0,
      lastUpdated: 'Injected Rain Surge at ' + new Date().toLocaleTimeString(),
    });
  };

  const handleTriggerHeatwave = () => {
    audio.playPulse();
    onUpdateTelemetry({
      ...telemetry,
      soilMoisture: 23.0,
      ambientTemp: 39.8,
      humidity: 29.5,
      lastUpdated: 'Injected Heatwave at ' + new Date().toLocaleTimeString(),
    });
  };

  const handleResetOptimal = () => {
    audio.playClick();
    onUpdateTelemetry({
      ...telemetry,
      soilMoisture: 68.0,
      ambientTemp: 26.5,
      humidity: 65.0,
      lastUpdated: 'Restored Optimal Agronomy at ' + new Date().toLocaleTimeString(),
    });
  };

  // Determine soil moisture status badge
  const getMoistureStatus = (val: number) => {
    if (val < 30) return { label: 'CRITICAL DROUGHT', color: 'text-red-400 border-red-500/50 bg-red-950/60' };
    if (val < 50) return { label: 'MODERATE DEFICIT', color: 'text-amber-400 border-amber-500/50 bg-amber-950/60' };
    if (val <= 80) return { label: 'OPTIMAL (PADDY)', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/60' };
    return { label: 'WATERLOGGED RISK', color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/60' };
  };

  const moistureInfo = getMoistureStatus(telemetry.soilMoisture);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 shadow-2xl flex flex-col justify-between">
      {/* Header with ESP32 info and live switch */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-500/15">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              ESP32 On-Field Telemetry
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                NODE #{zoneId.replace('Zone ', '')}
              </span>
            </h3>
            <p className="text-[11px] font-mono-code text-slate-400">
              {telemetry.lastUpdated}
            </p>
          </div>
        </div>

        {/* Hardware Health Pills */}
        <div className="flex items-center gap-2 text-[11px] font-mono-code">
          <span className="flex items-center gap-1 text-emerald-400 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
            <Battery className="w-3 h-3" />
            {telemetry.batteryVoltage.toFixed(2)}V
          </span>
          <span className="flex items-center gap-1 text-cyan-400 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
            <Wifi className="w-3 h-3" />
            {telemetry.rssi} dBm
          </span>
        </div>
      </div>

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
        {/* Soil Moisture Primary Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <Droplets className="w-3.5 h-3.5" /> Soil Moisture
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl lg:text-3xl font-extrabold font-mono-code text-white">
              {telemetry.soilMoisture.toFixed(1)}
              <span className="text-sm text-slate-400 font-normal">%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  telemetry.soilMoisture < 30
                    ? 'bg-red-500'
                    : telemetry.soilMoisture <= 80
                    ? 'bg-emerald-500'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, telemetry.soilMoisture)}%` }}
              />
            </div>
          </div>
          <span className={`text-[10px] font-mono-code font-semibold px-1.5 py-0.5 rounded border text-center ${moistureInfo.color}`}>
            {moistureInfo.label}
          </span>
        </div>

        {/* Ambient Temperature Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Thermometer className="w-3.5 h-3.5" /> Air Temp
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl lg:text-3xl font-extrabold font-mono-code text-white">
              {telemetry.ambientTemp.toFixed(1)}
              <span className="text-sm text-slate-400 font-normal">°C</span>
            </div>
            <p className="text-[10px] font-mono-code text-slate-400 mt-1">
              Soil Temp: <strong className="text-slate-200">{telemetry.soilTemp.toFixed(1)}°C</strong>
            </p>
          </div>
          <span className="text-[10px] font-mono-code text-slate-400">
            {telemetry.ambientTemp > 35 ? '⚠️ Extreme Heat' : 'Standard Season'}
          </span>
        </div>

        {/* Relative Humidity Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
            <span className="flex items-center gap-1 text-teal-400">
              <Wind className="w-3.5 h-3.5" /> Humidity
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl lg:text-3xl font-extrabold font-mono-code text-white">
              {telemetry.humidity.toFixed(1)}
              <span className="text-sm text-slate-400 font-normal">%</span>
            </div>
            <p className="text-[10px] font-mono-code text-slate-400 mt-1">
              Dew Pt: <strong className="text-slate-200">22.4°C</strong>
            </p>
          </div>
          <span className="text-[10px] font-mono-code text-slate-400">
            Microclimate RH
          </span>
        </div>

        {/* NPK Chemistry Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="w-3.5 h-3.5" /> Soil NPK
            </span>
          </div>
          <div className="space-y-1 my-1 text-[11px] font-mono-code">
            <div className="flex justify-between">
              <span className="text-slate-400">N (Nitrogen):</span>
              <span className="font-bold text-amber-300">{telemetry.npk.nitrogen} mg/kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">P (Phosphorus):</span>
              <span className="font-bold text-slate-200">{telemetry.npk.phosphorus} mg/kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">K (Potassium):</span>
              <span className="font-bold text-emerald-300">{telemetry.npk.potassium} mg/kg</span>
            </div>
          </div>
          <span className="text-[10px] font-mono-code text-amber-400">
            N Deficit Alert
          </span>
        </div>
      </div>

      {/* Stress Ingestion Simulation Controls */}
      <div className="mt-4 pt-3 border-t border-emerald-500/15">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono-code text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Simulate Environmental Stresses (Hardware Ingestion Demo):
          </span>
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className="text-[10px] font-mono-code text-emerald-400 hover:underline"
          >
            {isLiveStreaming ? '● Live Stream Active' : '○ Stream Paused'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={handleTriggerDrought}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/40 text-red-300 border border-red-800/60 hover:bg-red-900/60 hover:border-red-500 transition-all flex items-center justify-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            Inject Drought
          </button>

          <button
            onClick={handleTriggerRain}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-950/40 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/60 hover:border-cyan-500 transition-all flex items-center justify-center gap-1.5"
          >
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            Monsoon Surge
          </button>

          <button
            onClick={handleTriggerHeatwave}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5"
          >
            <SunMedium className="w-3.5 h-3.5 text-amber-400" />
            Heatwave Spurt
          </button>

          <button
            onClick={handleResetOptimal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-500 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Reset Optimal
          </button>
        </div>
      </div>
    </div>
  );
};
