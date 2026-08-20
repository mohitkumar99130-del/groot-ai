import React from 'react';
import { FusionResult, FieldZone, SensorTelemetry, LeafSample } from '../../types/groot';
import { X, Printer } from 'lucide-react';
import { audio } from '../../services/audioService';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  fusion: FusionResult;
  zone: FieldZone;
  telemetry: SensorTelemetry;
  leaf: LeafSample;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  fusion,
  zone,
  telemetry,
  leaf,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    audio.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#031109] p-6 md:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 my-8 print:p-0 print:border-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-panel text-slate-400 hover:text-white border border-slate-700 print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dossier Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl text-emerald-400">
                GROOT
              </span>
              <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                OFFICIAL INSPECTION DOSSIER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Geospatial Remote-sensing & On-field Observation Technology • Hara Bhara Planet
            </p>
          </div>

          <div className="text-right text-xs font-mono-code text-slate-400">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Ref: #GRT-2026-C4</div>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-slate-400">TARGET LOCATION</span>
            <span className="text-sm font-bold text-white font-mono-code">{zone.id} (Paddy Plot #04)</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-slate-800">
            <div className="p-2 rounded-lg bg-slate-900/60">
              <span className="text-[10px] font-mono-code text-slate-400 block">Tri-Modal Risk</span>
              <span className="text-xl font-bold font-mono-code text-red-400">{fusion.riskPercentage}%</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60">
              <span className="text-[10px] font-mono-code text-slate-400 block">Vitality Score</span>
              <span className="text-xl font-bold font-mono-code text-emerald-400">{fusion.healthScore}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60">
              <span className="text-[10px] font-mono-code text-slate-400 block">AI Confidence</span>
              <span className="text-xl font-bold font-mono-code text-cyan-400">{fusion.confidenceScore}%</span>
            </div>
          </div>
        </div>

        {/* Multi-Signal Evidence Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono-code text-slate-300 uppercase tracking-wider">
            Multi-Signal Diagnostic Verification
          </h4>
          <table className="w-full text-xs font-mono-code border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-900/90 text-slate-300">
              <tr>
                <th className="p-2 text-left">Signal Source</th>
                <th className="p-2 text-left">Observed Metric</th>
                <th className="p-2 text-left">Diagnostic Conclusion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr>
                <td className="p-2 font-bold text-cyan-300">Sentinel-2 Orbit</td>
                <td className="p-2">NDVI: {zone.ndvi} | NDMI: {zone.ndmi}</td>
                <td className="p-2 text-amber-300">Severe canopy chlorophyll collapse</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-amber-300">ESP32 IoT Node</td>
                <td className="p-2">Moisture: {telemetry.soilMoisture.toFixed(1)}% | Temp: {telemetry.ambientTemp.toFixed(1)}°C</td>
                <td className="p-2 text-red-300">Acute root zone water deficit</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-emerald-300">Farmer RGB CV</td>
                <td className="p-2">{leaf.name} ({leaf.cnnConfidence.toFixed(0)}% conf)</td>
                <td className="p-2 text-red-300">Spindle lesion fungal outbreak</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Prescribed Countermeasure Directive */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-emerald-300">
            <span>DIRECTIVE: {fusion.actionPlan.title}</span>
            <span>WINDOW: {fusion.actionPlan.windowHours} HOURS</span>
          </div>
          <p className="text-slate-300">
            <strong>Dosage Formulation:</strong> {fusion.actionPlan.dosage}
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1 pt-1">
            {fusion.actionPlan.instructions.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-emerald-500/20 print:hidden">
          <span className="text-[11px] text-slate-400 font-mono-code">
            Signed by GROOT Autonomous Geospatial Intelligence Engine
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold glass-panel text-slate-300 border border-slate-700 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
