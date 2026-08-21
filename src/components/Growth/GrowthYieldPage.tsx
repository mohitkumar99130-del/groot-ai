import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Activity
} from 'lucide-react';
import { AppLanguage, FusionResult, FieldZone, SensorTelemetry } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { TEMPORAL_TREND_DATA } from '../../services/mockData';
import { audio } from '../../services/audioService';
import { FertilizerCalculator } from '../Agronomy/FertilizerCalculator';
import { YieldMaximizerSteps } from '../Agronomy/YieldMaximizerSteps';
import { TemporalForecastChart } from '../Analytics/TemporalForecastChart';
import { XaiAttributionMatrix } from '../Analytics/XaiAttributionMatrix';

interface GrowthYieldPageProps {
  fusion: FusionResult;
  zone: FieldZone;
  telemetry: SensorTelemetry;
  variety: CropVariety;
  language: AppLanguage;
  onNavigateTab?: (tab: any) => void;
}

export const GrowthYieldPage: React.FC<GrowthYieldPageProps> = ({
  fusion,
  zone,
  telemetry,
  variety,
  language,
}) => {
  const [showXai, setShowXai] = useState(false);
  const isHi = language === 'hi';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#031108] border border-teal-500/30 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>📈 {isHi ? 'पैदावार वृद्धि व खाद प्रबंधन (Growth & Yield Maximizer)' : 'Growth & Yield Maximizer'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {variety.iconEmoji} {variety.varietyName} • Target Expected Yield: {variety.expectedYieldPerAcre || `${variety.targetYieldQuintalPerAcre} Q/Acre`}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-2xl border border-emerald-500/30">
          <span>+18% Projected Recovery</span>
        </div>
      </div>

      {/* 2. 14-Day Trajectory Forecast Curve */}
      <TemporalForecastChart
        data={TEMPORAL_TREND_DATA}
        zoneId={zone.id}
        language={language}
      />

      {/* 3. Fertilizer Prescription & Action Steps */}
      <div className="space-y-6">
        <FertilizerCalculator
          fusion={fusion}
          zone={zone}
          telemetry={telemetry}
          variety={variety}
          language={language}
        />

        <YieldMaximizerSteps
          steps={fusion.productivitySteps}
          language={language}
        />
      </div>

      {/* 4. Expandable XAI Technical Attribution */}
      <div className="p-5 rounded-3xl bg-[#031108] border border-slate-800 shadow-xl space-y-4">
        <button
          onClick={() => {
            audio.playClick();
            setShowXai(!showXai);
          }}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                {isHi ? '🔬 AI कारण विश्लेषण (Explainable AI Attribution Matrix)' : '🔬 Explainable AI (XAI) Attribution Breakdown'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Multi-sensor feature weights, SHAP-style attribution, and neural confidence scores
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 text-slate-400 group-hover:text-white transition-colors">
            {showXai ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showXai && (
          <div className="pt-4 border-t border-slate-800 animate-in fade-in duration-150">
            <XaiAttributionMatrix
              fusion={fusion}
              zone={zone}
              language={language}
            />
          </div>
        )}
      </div>

    </div>
  );
};
