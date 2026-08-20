import React from 'react';
import { ProductivityStep, AppLanguage } from '../../types/groot';
import { TrendingUp, CheckCircle2 } from 'lucide-react';


interface YieldMaximizerStepsProps {
  steps: ProductivityStep[];
  language: AppLanguage;
}

export const YieldMaximizerSteps: React.FC<YieldMaximizerStepsProps> = ({ steps, language }) => {
  return (
    <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/25 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-base sm:text-lg text-white">
              {language === 'hi' ? '🌾 पैदावार वृद्धि रोडमैप (+18% Yield Plan)' : '🌾 Agronomic Yield Maximization Roadmap'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Actionable agronomic interventions for higher grain weight and tiller survival.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-500/40">
          Target: +18% Yield
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {steps.map((step) => (
          <div key={step.stepNumber} className="agri-card p-4 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">STEP 0{step.stepNumber}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {step.impactScore}
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-white">
                {language === 'hi' ? step.hindiTitle : step.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {language === 'hi' ? step.hindiDetails : step.details}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Recommended by GROOT Multimodal AI</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
