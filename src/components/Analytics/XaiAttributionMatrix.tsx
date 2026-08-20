import React from 'react';
import { FusionResult, FieldZone, AppLanguage } from '../../types/groot';
import { HelpCircle, Sparkles, Pill, Clock, ChevronRight } from 'lucide-react';


interface XaiAttributionMatrixProps {
  fusion: FusionResult;
  zone: FieldZone;
  language: AppLanguage;
}

export const XaiAttributionMatrix: React.FC<XaiAttributionMatrixProps> = ({
  fusion,
  zone,
  language,
}) => {
  return (
    <div id="xai-explanation-section" className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/25 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-base sm:text-lg text-white flex items-center gap-2">
              {language === 'hi' ? '🧠 AI निर्णय स्पष्टीकरण (XAI "Why?" Breakdown)' : 'Explainable AI (XAI) "Why?" Decision Matrix'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                FACTOR ATTRIBUTION
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Transparent multi-modal signal deconstruction for agronomists & field scouts on <strong className="text-slate-200">{zone.id}</strong>.
            </p>
          </div>
        </div>

        <div className="agri-card-subtle px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 border border-slate-800">
          Fusion: <span className="text-cyan-300 font-bold">0.35·Spectral</span> + <span className="text-amber-300 font-bold">0.35·IoT</span> + <span className="text-rose-300 font-bold">0.30·RGB</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 cols: Factor Contribution Percentages */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Relative Factor Contribution to Risk Score
          </h4>

          <div className="space-y-3">
            {fusion.contributingFactors.map((factor, idx) => (
              <div key={idx} className="agri-card p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200">{factor.name}</span>
                  <span className="font-black" style={{ color: factor.color }}>
                    {factor.percentage}% Impact
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${factor.percentage}%`,
                      backgroundColor: factor.color,
                      boxShadow: `0 0 12px ${factor.color}88`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Finding: <em className="text-slate-200 not-italic">{factor.impact}</em></span>
                  <span>Model weight: {factor.weight}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Prescribed Field Action Plan */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-emerald-400" />
            Field Action Plan & Immediate Countermeasures
          </h4>

          <div className="agri-card p-5 rounded-2xl border border-emerald-500/30 space-y-4 bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${
                fusion.actionPlan.priority === 'Immediate'
                  ? 'bg-rose-950 text-rose-300 border-rose-500'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-500'
              }`}>
                URGENCY: {fusion.actionPlan.priority.toUpperCase()}
              </span>

              <span className="text-xs font-mono text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Response Window: <strong className="text-amber-300">{fusion.actionPlan.windowHours}h</strong>
              </span>
            </div>

            <div>
              <h5 className="text-base font-bold text-white font-display">
                {fusion.actionPlan.title}
              </h5>
              <p className="text-xs font-mono text-cyan-300 mt-1">
                Recommended Dosage: {fusion.actionPlan.dosage}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-emerald-500/20">
              <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
                Action Protocol Checklist:
              </span>
              <ul className="space-y-2 text-xs text-slate-200 font-sans">
                {fusion.actionPlan.instructions.map((inst, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
