import React from 'react';
import { 
  X, 
  Printer, 
  Satellite, 
  Cpu, 
  Microscope, 
  ShieldCheck, 
  FileText
} from 'lucide-react';
import { FusionResult, FieldZone, SensorTelemetry, LeafSample } from '../../types/groot';
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

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl agri-card-elevated rounded-3xl border border-emerald-500/30 shadow-2xl p-5 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white">
                Agronomic Field Health Audit Dossier
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Official Report • GROOT Precision Agriculture Multimodal Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold btn-agri-primary text-slate-950 flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="p-2 rounded-xl agri-card-subtle text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Audit Report Body */}
        <div id="printable-dossier" className="space-y-6 text-slate-200 font-sans text-xs bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
          
          {/* Header Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono border-b border-slate-800 pb-4">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Target Parcel:</span>
              <strong className="text-white text-sm">{zone.id} (Paddy #04)</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Audit Date:</span>
              <strong className="text-white text-sm">{currentDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">GPS Coordinate:</span>
              <strong className="text-emerald-400 text-xs">20.8942° N, 85.8315° E</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Health Index:</span>
              <strong className="text-emerald-400 text-sm">{fusion.healthScore} / 100 ({fusion.status})</strong>
            </div>
          </div>

          {/* Tri-Modal Source Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 1. Sentinel-2 Spectral */}
            <div className="agri-card-subtle p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-[11px]">
                <Satellite className="w-3.5 h-3.5" />
                <span>1. Sentinel-2 Spectral (35%)</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div>NDVI: <strong>{zone.ndvi.toFixed(2)}</strong></div>
                <div>NDMI: <strong>{zone.ndmi.toFixed(2)}</strong></div>
                <div>Thermal IR: <strong>{zone.surfaceTemp}°C</strong></div>
                <div>Condition: <strong className="text-amber-300">{zone.cropCondition}</strong></div>
              </div>
            </div>

            {/* 2. ESP32 Sensor Telemetry */}
            <div className="agri-card-subtle p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[11px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>2. IoT Soil Mesh (35%)</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div>Soil Moisture: <strong>{telemetry.soilMoisture.toFixed(1)}%</strong></div>
                <div>Ambient Temp: <strong>{telemetry.ambientTemp.toFixed(1)}°C</strong></div>
                <div>Soil pH: <strong>{telemetry.soilPh}</strong></div>
                <div>NPK: <strong>[{telemetry.npk.nitrogen}, {telemetry.npk.phosphorus}, {telemetry.npk.potassium}]</strong></div>
              </div>
            </div>

            {/* 3. Edge AI Leaf Diagnostic */}
            <div className="agri-card-subtle p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-mono font-bold text-[11px]">
                <Microscope className="w-3.5 h-3.5" />
                <span>3. Edge AI Vision (30%)</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div>Sample: <strong>{leaf.name}</strong></div>
                <div>AI Confidence: <strong>{leaf.cnnConfidence}%</strong></div>
                <div>Severity: <strong>{leaf.symptomSeverity}%</strong></div>
                <div>Pathogen: <strong className="text-rose-400">{leaf.primaryPathogen}</strong></div>
              </div>
            </div>

          </div>

          {/* Action Prescription Summary */}
          <div className="agri-card p-4 rounded-xl border border-emerald-500/25 space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Certified Agronomic Action Plan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">Fertilizer Application:</span>
                <div className="text-emerald-300 font-bold">Neem Coated Urea (45 kg/acre) + DAP (30 kg/acre)</div>
                <p className="text-slate-400 text-[10px]">Apply post-irrigation during early morning hours.</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">Pathogen Control Spray:</span>
                <div className="text-rose-300 font-bold">Tricyclazole 75% WP @ 0.6 g/L Water</div>
                <p className="text-slate-400 text-[10px]">Follow up with bio-fungicide Pseudomonas fluorescens in 10 days.</p>
              </div>
            </div>
          </div>

          {/* Sign-off Block */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-[11px] font-mono text-slate-400">
            <div>
              Generated by: <strong>GROOT Automated Agronomy Core</strong>
            </div>
            <div>
              Verification Stamp: <span className="text-emerald-400 font-bold">SIH25099 CERTIFIED</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
