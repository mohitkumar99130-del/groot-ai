import React from 'react';
import { PestControlRecommendation, AppLanguage } from '../../types/groot';
import { Bug, Sparkles, Droplet } from 'lucide-react';


interface PestRxCardProps {
  pestControl: PestControlRecommendation[];
  language: AppLanguage;
}

export const PestRxCard: React.FC<PestRxCardProps> = ({ pestControl, language }) => {
  return (
    <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/25 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-base sm:text-lg text-white">
              {language === 'hi' ? 'कीटनाशक व जैविक उपचार (Pest & Disease Rx)' : 'Chemical & Bio-Remedy Prescription'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Targeted pathology eradication protocol with precise dilution rates.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-rose-950 text-rose-300 border border-rose-500/50">
          IMMEDIATE ACTION
        </span>
      </div>

      <div className="space-y-4">
        {pestControl.map((item, idx) => (
          <div key={idx} className="agri-card p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-display font-bold text-sm text-white">
                  {language === 'hi' ? item.hindiPestName : item.pestName}
                </h4>
                <p className="text-[11px] font-mono text-emerald-400">
                  Target Pathogen Identification: <span className="italic">{item.pestName}</span>
                </p>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Priority: {item.urgency}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              {/* Chemical Remedy */}
              <div className="agri-card-subtle p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-rose-400" />
                  1. Chemical Fungicide Spray
                </span>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {item.chemicalRemedy}
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1">
                  Spray Schedule: <strong>Early Morning (7:00 AM)</strong> or Post-Sunset.
                </div>
              </div>

              {/* Bio Remedy */}
              <div className="agri-card-subtle p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  2. Organic & Bio-Control Spray
                </span>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {item.bioRemedy}
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1">
                  Safety: 100% Eco-friendly, safe for pollinators & beneficial fauna.
                </div>
              </div>
            </div>

            {/* Hindi instructions if enabled */}
            {language === 'hi' && (
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/25 text-xs text-amber-200 font-medium">
                💡 <strong>किसान निर्देश:</strong> {item.hindiRemedy}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
