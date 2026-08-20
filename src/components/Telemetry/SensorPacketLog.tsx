import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { SensorTelemetry } from '../../types/groot';


interface SensorPacketLogProps {
  telemetry: SensorTelemetry;
  zoneId: string;
}

export const SensorPacketLog: React.FC<SensorPacketLogProps> = ({ telemetry, zoneId }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    const newEntry = `[${timestamp}] MQTT INGEST node=ESP32_04 zone=${zoneId} moisture=${telemetry.soilMoisture.toFixed(1)}% temp=${telemetry.ambientTemp.toFixed(1)}C pH=${telemetry.soilPh} NPK=[${telemetry.npk.nitrogen},${telemetry.npk.phosphorus},${telemetry.npk.potassium}] rssi=${telemetry.rssi}dBm`;
    
    setLogs((prev) => [newEntry, ...prev.slice(0, 15)]);
  }, [telemetry, zoneId]);

  return (
    <div className="agri-card p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
      <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-bold">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live MQTT Sensor Ingest Feed (ESP32 Mesh)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>PORT 8883 SSL ACTIVE</span>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl p-3 h-32 overflow-y-auto space-y-1 text-[11px] text-slate-300 font-mono select-text">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-2 hover:bg-slate-900/60 p-0.5 rounded">
            <span className="text-emerald-400 shrink-0">&gt;</span>
            <span className={i === 0 ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
              {log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
