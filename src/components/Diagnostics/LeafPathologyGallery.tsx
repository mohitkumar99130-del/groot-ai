import React from 'react';
import { LeafSample, AppLanguage } from '../../types/groot';
import { Microscope } from 'lucide-react';
import { audio } from '../../services/audioService';


interface LeafPathologyGalleryProps {
  samples: LeafSample[];
  activeSample: LeafSample;
  onSelectSample: (sample: LeafSample) => void;
  language: AppLanguage;
}

export const LeafPathologyGallery: React.FC<LeafPathologyGalleryProps> = ({
  samples,
  activeSample,
  onSelectSample,
  language,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Microscope className="w-3.5 h-3.5 text-emerald-400" />
          {language === 'hi' ? 'मान्यता प्राप्त रोग लाइब्रेरी (Curated Samples)' : 'Ground-Truth Pathology Library'}
        </h4>
        <span className="text-[10px] font-mono text-slate-400">
          Click to fuse sample into risk model
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {samples.map((sample) => {
          const isSelected = activeSample.id === sample.id;
          const isDisease = sample.symptomSeverity > 30;

          return (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                audio.playClick();
              }}
              className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 border agri-card-hover flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-400 shadow-xl ring-2 ring-emerald-400/40'
                  : 'agri-card-subtle border-slate-800'
              }`}
            >
              <div className="space-y-2">
                {/* Thumbnail Image with Condition Badge */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src={sample.image}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                      isDisease
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/60'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                    }`}>
                      {isDisease ? '⚠️ Infected' : '✅ Optimal'}
                    </span>
                  </div>
                </div>

                {/* Title & Pathogen */}
                <div>
                  <h5 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1">
                    {sample.name}
                  </h5>
                  <p className="text-[11px] font-mono text-emerald-400/90 italic line-clamp-1">
                    {sample.primaryPathogen}
                  </p>
                </div>
              </div>

              {/* Confidence & Severity Metrics */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                <span>AI Conf: <strong className="text-cyan-300">{sample.cnnConfidence}%</strong></span>
                <span>Severity: <strong className={isDisease ? 'text-rose-400' : 'text-emerald-400'}>{sample.symptomSeverity}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
