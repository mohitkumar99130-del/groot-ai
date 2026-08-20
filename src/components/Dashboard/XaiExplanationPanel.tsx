import React from 'react';
import { FusionResult, FieldZone } from '../../types/groot';
import { 
  HelpCircle, 
  Clock, 
  Sparkles, 
  Pill, 
  ChevronRight
} from 'lucide-react';

interface XaiExplanationPanelProps {
  fusion: FusionResult;
  zone: FieldZone;
}

export const XaiExplanationPanel: React.FC<XaiExplanationPanelProps> = ({
  fusion,
  zone,
}) => {
  return (
    <div id="xai-explanation-section" className="glass-panel p-6 rounded-2xl border border-emerald-500/25 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-emerald-500/15">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              Explainable AI (XAI) "Why?" Breakdown
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                FACTOR ATTRIBUTION
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deconstructing model decisions for agronomists and farmers on <strong className="text-slate-200">{zone.id}</strong>
            </p>
          </div>
        </div>

        <div className="glass-panel px-3 py-1 rounded-lg text-xs font-mono-code text-slate-300 self-start sm:self-auto border border-slate-800">
          Formula: <span className="text-cyan-300">0.35·Spectral</span> + <span className="text-amber-300">0.35·IoT</span> + <span className="text-red-300">0.30·RGB</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Factor Contribution Percentages */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-mono-code text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Relative Factor Contribution to Risk Score
          </h4>

          <div className="space-y-3.5">
            {fusion.contributingFactors.map((factor, idx) => (
              <div key={idx} className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="font-semibold text-slate-200">{factor.name}</span>
                  <span className="font-bold text-white" style={{ color: factor.color }}>
                    {factor.percentage}% Impact
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${factor.percentage}%`,
                      backgroundColor: factor.color,
                      boxShadow: `0 0 10px ${factor.color}66`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Finding: <em className="text-slate-300">{factor.impact}</em></span>
                  <span>Model weight: {factor.weight}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Action Plan Prescription */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-mono-code text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-emerald-400" />
            Prescribed Field Action Plan & Countermeasures
          </h4>

          <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 space-y-4 bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono-code font-bold px-2.5 py-1 rounded-md border ${
                fusion.actionPlan.priority === 'Immediate'
                  ? 'bg-red-950 text-red-300 border-red-500'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-500'
              }`}>
                URGENCY: {fusion.actionPlan.priority.toUpperCase()}
              </span>

              <span className="text-xs font-mono-code text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Response Window: <strong>{fusion.actionPlan.windowHours}h</strong>
              </span>
            </div>

            <div>
              <h5 className="text-base font-bold text-white font-display">
                {fusion.actionPlan.title}
              </h5>
              <p className="text-xs font-mono-code text-cyan-300 mt-1">
                Target Formulation: {fusion.actionPlan.dosage}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-emerald-500/20">
              <span className="text-xs font-mono-code text-slate-400 block">
                Recommended Action Protocol:
              </span>
              <ul className="space-y-2 text-xs text-slate-200">
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
