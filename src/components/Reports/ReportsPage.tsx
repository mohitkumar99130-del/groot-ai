import React from 'react';
import { 
  Download, 
  MessageCircle
} from 'lucide-react';
import { AppLanguage, FusionResult, SensorTelemetry, FarmPlot } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';

interface ReportsPageProps {
  fusion: FusionResult;
  telemetry: SensorTelemetry;
  currentPlot: FarmPlot;
  variety: CropVariety;
  language: AppLanguage;
  onOpenExportModal: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  fusion,
  telemetry,
  currentPlot,
  variety,
  language,
  onOpenExportModal,
}) => {
  const isHi = language === 'hi';

  const auditHistory = [
    {
      id: 'audit_01',
      date: 'Today • 21 Feb 2026',
      parcel: 'Sector C4',
      crop: `${variety.varietyName}`,
      health: fusion.healthScore,
      status: 'Attention Required',
      findings: 'Low soil moisture (21%) + Early foliar blast symptoms',
    },
    {
      id: 'audit_02',
      date: '14 Feb 2026',
      parcel: 'Sector A1-A5',
      crop: `${variety.varietyName}`,
      health: 91,
      status: 'Optimal Health',
      findings: 'Balanced vegetative density & adequate root aeration',
    },
    {
      id: 'audit_03',
      date: '07 Feb 2026',
      parcel: 'Sector B2-B4',
      crop: `${variety.varietyName}`,
      health: 84,
      status: 'Good Health',
      findings: 'Post-irrigation nitrogen absorption completed',
    },
  ];

  const handleShareWhatsApp = () => {
    audio.playClick();
    const shareText = encodeURIComponent(
      `🌾 GROOT Farm Audit Report\n📍 Location: ${currentPlot.locationName} (${currentPlot.name})\n🌱 Crop: ${variety.varietyName}\n❤️ Field Vitality: ${fusion.healthScore}/100\n💧 Soil Moisture: ${telemetry.soilMoisture.toFixed(0)}%\n🧪 Recommended Input: 45 kg Neem Coated Urea + Tricyclazole Spray\n\nGenerated via GROOT Precision Agriculture Suite.`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Bar with PDF Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>📋 {isHi ? 'खेत ऑडिट रिपोर्ट (Farm Inspection Reports)' : 'Field Audit & Diagnostic Reports'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {isHi ? 'खेत की पिछली जांचों का रिकॉर्ड देखें और PDF डाउनलोड करें' : 'Download official agronomy dossiers and share WhatsApp summaries'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? 'व्हाट्सएप पर भेजें' : 'Share WhatsApp'}</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onOpenExportModal();
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>{isHi ? '📄 PDF रिपोर्ट डाउनलोड करें' : '📄 Export PDF Dossier'}</span>
          </button>
        </div>
      </div>

      {/* 2. Audit History Records List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono px-1">
          {isHi ? 'पिछली जांचों का इतिहास (Historical Audits)' : 'Historical Farm Inspections'}
        </h3>

        <div className="space-y-3">
          {auditHistory.map((record) => (
            <div
              key={record.id}
              className="p-5 rounded-3xl bg-[#03140a] border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 text-2xl shrink-0">
                  📄
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">{record.date}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-800">
                      {record.parcel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Crop: <span className="text-white font-medium">{record.crop}</span> • {record.findings}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    Score {record.health}/100
                  </div>
                  <div className="text-[10px] text-slate-400">{record.status}</div>
                </div>

                <button
                  onClick={() => {
                    audio.playClick();
                    onOpenExportModal();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-750 text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
