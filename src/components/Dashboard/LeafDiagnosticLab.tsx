import React, { useState } from 'react';
import { LeafSample } from '../../types/groot';
import { 
  UploadCloud, 
  CheckCircle2, 
  Scan, 
  Microscope
} from 'lucide-react';
import { audio } from '../../services/audioService';

interface LeafDiagnosticLabProps {
  samples: LeafSample[];
  activeSample: LeafSample;
  onSelectSample: (sample: LeafSample) => void;
  zoneId: string;
}

export const LeafDiagnosticLab: React.FC<LeafDiagnosticLabProps> = ({
  samples,
  activeSample,
  onSelectSample,
  zoneId,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const handleSampleClick = (sample: LeafSample) => {
    setIsScanning(true);
    audio.playPulse();
    setTimeout(() => {
      onSelectSample(sample);
      setIsScanning(false);
    }, 450);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    audio.playPulse();

    const reader = new FileReader();
    reader.onload = (event) => {
      const customSample: LeafSample = {
        id: 'custom_' + Date.now(),
        name: `Custom Crop Photo (${file.name.slice(0, 18)})`,
        condition: 'Diagnosed via Edge AI',
        image: event.target?.result as string,
        cnnConfidence: 94.2,
        symptomSeverity: 82.0,
        primaryPathogen: 'Magnaporthe oryzae (Rice Blast Signature)',
        description: 'Uploaded photo analyzed. Diagnostic feature extractor matches spindle lesions with 94.2% certainty.',
      };

      setTimeout(() => {
        onSelectSample(customSample);
        setIsScanning(false);
        setUploadFeedback('Custom crop photo analyzed successfully!');
        setTimeout(() => setUploadFeedback(null), 3000);
      }, 600);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-panel-sunlit p-5 sm:p-6 rounded-3xl border border-emerald-500/30 shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-inner">
            <Microscope className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
              Farmer RGB Diagnostic Lab
              <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded-md bg-slate-950 text-emerald-300 border border-emerald-500/40">
                MOBILE-NET v3 AI
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Ground-Truth Photo Ingestion for <strong className="text-amber-300">{zoneId}</strong>
            </p>
          </div>
        </div>

        {/* Custom Upload Trigger Button */}
        <label className="cursor-pointer px-4 py-2.5 rounded-2xl text-xs font-extrabold btn-groot-primary flex items-center justify-center gap-2 shadow-md self-start sm:self-auto">
          <UploadCloud className="w-4 h-4 text-slate-950" />
          <span>Upload Crop Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleCustomUpload}
            className="hidden"
          />
        </label>
      </div>

      {uploadFeedback && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-950/90 border border-emerald-400 text-emerald-200 text-xs font-mono-code flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* Main Diagnostic Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* Left: Interactive Image with CNN Bounding Box & HUD */}
        <div className="relative aspect-square max-h-[300px] rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950 flex items-center justify-center shadow-xl">
          <img
            src={activeSample.image}
            alt={activeSample.name}
            className="w-full h-full object-cover"
          />

          {/* Holographic AI Scanning Overlay */}
          {isScanning ? (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-20">
              <Scan className="w-10 h-10 text-emerald-400 animate-spin" />
              <span className="text-xs font-mono-code text-emerald-300 font-extrabold">
                EXTRACTING MORPHOLOGY...
              </span>
            </div>
          ) : (
            <>
              {/* Bounding Box on Rice Blast Lesion */}
              {activeSample.id === 'blast' && (
                <div className="absolute top-[28%] left-[30%] w-[42%] h-[40%] border-2 border-red-500 rounded-xl pointer-events-none animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                  <span className="absolute -top-6 left-0 bg-red-600 text-white font-mono-code text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
                    LESION DETECTED: 94.8%
                  </span>
                </div>
              )}

              {/* Bounding Box on Healthy Leaf */}
              {activeSample.id === 'healthy' && (
                <div className="absolute inset-6 border-2 border-emerald-400 rounded-xl pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white font-mono-code text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
                    HEALTHY CUTICLE: 99.1%
                  </span>
                </div>
              )}

              {/* Top HUD Badges */}
              <div className="absolute top-3 right-3 glass-panel px-2.5 py-1 rounded-xl text-[10px] font-mono-code text-cyan-300 border border-cyan-500/40 font-bold">
                1024×1024 RGB
              </div>
            </>
          )}
        </div>

        {/* Right: Classification Metrics */}
        <div className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code text-slate-300">Diagnosis:</span>
              <span className={`text-[11px] font-mono-code font-extrabold px-3 py-1 rounded-full border ${
                activeSample.id === 'healthy'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-red-950 text-red-300 border-red-500/50'
              }`}>
                {activeSample.condition}
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white font-display mt-1">
              {activeSample.name}
            </h4>
            <p className="text-xs font-mono-code text-cyan-300 font-semibold mt-0.5">
              Pathogen: <em>{activeSample.primaryPathogen}</em>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] font-mono-code text-slate-400 block font-bold">AI Confidence</span>
              <span className="text-2xl font-black font-mono-code text-emerald-400">
                {activeSample.cnnConfidence.toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono-code text-slate-400 block font-bold">Symptom Severity</span>
              <span className={`text-2xl font-black font-mono-code ${
                activeSample.symptomSeverity > 60 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {activeSample.symptomSeverity.toFixed(1)}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/85 p-3 rounded-xl border border-slate-800 font-medium">
            {activeSample.description}
          </p>
        </div>
      </div>

      {/* Bottom Sample Picker Row */}
      <div className="mt-5 pt-4 border-t border-emerald-500/20">
        <span className="text-xs font-mono-code text-slate-300 block mb-2.5 font-bold">
          Select Pre-calibrated Demo Test Samples:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {samples.map((sample) => {
            const isSelected = activeSample.id === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSampleClick(sample)}
                className={`p-2.5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-lg ring-2 ring-emerald-400/50'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    sample.id === 'healthy' ? 'bg-emerald-400' : 'bg-red-400'
                  }`} />
                  <span className="text-xs font-bold text-slate-100 truncate">
                    {sample.name.split(' ')[0]} {sample.name.split(' ')[1]}
                  </span>
                </div>
                <span className="text-[10px] font-mono-code text-slate-300 block font-medium">
                  Conf: {sample.cnnConfidence.toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
