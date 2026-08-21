import React from 'react';
import { 
  Mic, 
  Camera, 
  HeartPulse, 
  Droplets, 
  CloudSun, 
  ArrowRight, 
  Calendar, 
  ChevronRight, 
  Sprout, 
  MapPin
} from 'lucide-react';
import { 
  AppLanguage, 
  FarmPlot, 
  FusionResult, 
  FieldZone, 
  SensorTelemetry, 
  LeafSample, 
  RealtimeWeather,
  AppNavigationTab,
  FarmerProfile 
} from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';
import { INITIAL_DAILY_ACTIONS } from '../../services/farmService';

interface HomeDashboardProps {
  currentPlot: FarmPlot;
  variety: CropVariety;
  fusion: FusionResult;
  zone: FieldZone;
  telemetry: SensorTelemetry;
  leaf: LeafSample;
  weather: RealtimeWeather;
  language: AppLanguage;
  farmerProfile?: FarmerProfile;
  onOpenVoice: () => void;
  onOpenCamera: () => void;
  onOpenCropSelector: () => void;
  onNavigateTab: (tab: AppNavigationTab) => void;
  onRefreshWeather?: () => void;
  isWeatherLoading?: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentPlot,
  variety,
  fusion,
  telemetry,
  weather,
  language,
  onOpenVoice,
  onOpenCamera,
  onOpenCropSelector,
  onNavigateTab,
}) => {
  const isHi = language === 'hi';
  const isHighRisk = fusion.riskPercentage > 50;

  // Subtitle translations for Voice & Camera actions
  const getVoiceSubtitle = () => {
    switch (language) {
      case 'hi': return 'बोलकर पूछें / Ask by speaking';
      case 'pa': return 'ਬੋਲ ਕੇ ਪੁੱਛੋ / Ask by speaking';
      case 'bn': return 'কথা বলে জানুন / Ask by speaking';
      case 'te': return 'మాట్లాడి అడగండి / Ask by speaking';
      case 'ta': return 'பேசி கேளுங்கள் / Ask by speaking';
      case 'mr': return 'बोलून विचारा / Ask by speaking';
      case 'gu': return 'બોલીને પૂછો / Ask by speaking';
      case 'kn': return 'ಮಾತನಾಡಿ ಕೇಳಿ / Ask by speaking';
      case 'ml': return 'സംസാരിച്ചു ചോദിക്കൂ / Ask by speaking';
      case 'or': return 'କହି ପଚାରନ୍ତୁ / Ask by speaking';
      case 'as': return 'কথা কৈ সোধক / Ask by speaking';
      case 'hinglish': return 'Bolkar poochhein / Ask naturally';
      case 'en':
      default: return 'Ask questions naturally by speaking';
    }
  };

  const getCameraSubtitle = () => {
    switch (language) {
      case 'hi': return 'फसल की फोटो लेकर जांच करें';
      case 'pa': return 'ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਖਿੱਚ ਕੇ ਜਾਂਚ ਕਰੋ';
      case 'bn': return 'ফসলের ছবি তুলে পরীক্ষা করুন';
      case 'te': return 'పంట ఫోటో తీసి పరిశీలించండి';
      case 'ta': return 'பயிரின் படம் எடுத்து சோதிக்கவும்';
      case 'mr': return 'पिकाचा फोटो काढून तपासणी करा';
      case 'gu': return 'પાકનો ફોટો લઈને તપાસો';
      case 'kn': return 'ಬೆಳೆಯ ಫೋಟೋ ತೆಗೆದು ಪರೀಕ್ಷಿಸಿ';
      case 'ml': return 'വിളയുടെ ഫോട്ടോ എടുത്ത് പരിശോധിക്കൂ';
      case 'or': return 'ଫସଲର ଫଟୋ ନେଇ ପରୀକ୍ଷା କରନ୍ତୁ';
      case 'as': return 'শস্যৰ ফটো তুলি পৰীক্ষা কৰক';
      case 'hinglish': return 'Fasal ki photo lekar jaanch karein';
      case 'en':
      default: return 'Take or upload leaf photo to diagnose disease';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* SECTION 1: YOUR ACTIVE CROP (LARGE HIGHLY VISIBLE CARD)                   */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#021f10] via-[#04190e] to-slate-950 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          {/* Left: Crop Photo/Icon + Crop Name + Variety + Field Name */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-emerald-400/20 via-emerald-500/20 to-teal-500/10 border border-emerald-400/40 text-4xl sm:text-5xl shadow-inner shrink-0">
              {variety.iconEmoji || '🌾'}
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase font-mono shadow-md">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  {isHi ? 'आपकी सक्रिय फसल' : 'YOUR ACTIVE CROP'}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  isHighRisk 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {isHighRisk ? '🔴 Action Needed' : '🟢 Good Health'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{isHi ? variety.cropHindi : variety.cropName}</span>
                <span className="text-emerald-400 font-medium text-base sm:text-lg">
                  ({isHi ? variety.varietyHindi : variety.varietyName})
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-sans pt-0.5">
                <span className="flex items-center gap-1 font-semibold text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {currentPlot.name}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {isHi ? 'बुवाई: 42 दिन पहले (Tillering)' : 'Sown: 42 days ago (Tillering Stage)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Change Crop + View Crop Health) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <button
              onClick={() => {
                audio.playClick();
                onOpenCropSelector();
              }}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-emerald-500/30 hover:border-emerald-400 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'फसल बदलें (Change Crop)' : 'Change Crop'}</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onNavigateTab('crop_health');
              }}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>{isHi ? 'फसल सेहत देखें' : 'View Crop Health'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>


      {/* ========================================================================= */}
      {/* SECTION 2: TWO LARGE PRIMARY ACTIONS (VOICE + CAMERA)                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Action 1: 🎙️ Ask GROOT */}
        <button
          onClick={() => {
            audio.playClick();
            onOpenVoice();
          }}
          className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-600/10 to-slate-950 border-2 border-amber-400/50 hover:border-amber-400 shadow-xl shadow-amber-500/10 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-5 min-h-[110px]"
        >
          <div className="relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform shrink-0 ring-4 ring-amber-400/20">
            <Mic className="w-8 h-8 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
                1-TAP VOICE • बोलकर पूछें
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
              🎙️ {isHi ? 'GROOT से बोलकर पूछें' : 'Ask GROOT by Voice'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              "{getVoiceSubtitle()}"
            </p>
          </div>
        </button>

        {/* Action 2: 📷 Check Crop by Photo */}
        <button
          onClick={() => {
            audio.playClick();
            onOpenCamera();
          }}
          className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-600/10 to-slate-950 border-2 border-emerald-400/50 hover:border-emerald-400 shadow-xl shadow-emerald-500/10 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-5 min-h-[110px]"
        >
          <div className="relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform shrink-0 ring-4 ring-emerald-400/20">
            <Camera className="w-8 h-8 text-slate-950" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 uppercase">
                AI SCANNER • फोटो जांच
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              📷 {isHi ? 'पत्ती की फोटो से जांचें' : 'Check Crop by Photo'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              "{getCameraSubtitle()}"
            </p>
          </div>
        </button>

      </div>


      {/* ========================================================================= */}
      {/* SECTION 3: TODAY'S STATUS SUMMARY (3 SIMPLE STATUS CARDS)                 */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between pb-3 px-1">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>📊 {isHi ? 'आज का संक्षिप्त हाल (Today\'s Status)' : 'Today\'s Status Overview'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Status 1: Crop Health */}
          <button
            onClick={() => {
              audio.playClick();
              onNavigateTab('crop_health');
            }}
            className="p-5 rounded-3xl bg-[#03140a] border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                {isHi ? 'फसल सेहत' : 'Crop Health'}
              </span>
              <HeartPulse className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {fusion.healthScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
            <div className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1">
              {isHighRisk ? '🟠 Attention Needed in Sector C4' : '🟢 Crop is Healthy & Vigorous'}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>{isHi ? 'विस्तार देखें' : 'View Full Details'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </button>

          {/* Status 2: Water in Soil */}
          <button
            onClick={() => {
              audio.playClick();
              onNavigateTab('water_irrigation');
            }}
            className="p-5 rounded-3xl bg-[#03140a] border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                {isHi ? 'मिट्टी में नमी' : 'Water in Soil'}
              </span>
              <Droplets className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {telemetry.soilMoisture.toFixed(0)}<span className="text-xs text-slate-400 font-normal">%</span>
            </div>
            <div className="text-xs font-bold text-cyan-300 mt-1">
              {telemetry.soilMoisture < 30 ? '🔴 Water Stress Detected' : '🟢 Moisture is Balanced'}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>{isHi ? 'सिंचाई सलाह' : 'Irrigation Advice'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </button>

          {/* Status 3: Today's Weather */}
          <button
            onClick={() => {
              audio.playClick();
              onNavigateTab('weather');
            }}
            className="p-5 rounded-3xl bg-[#03140a] border border-amber-500/30 hover:border-amber-400 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                {isHi ? 'आज का मौसम' : 'Today\'s Weather'}
              </span>
              <CloudSun className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {weather.temperature}°C
            </div>
            <div className="text-xs font-bold text-amber-300 mt-1">
              {isHi ? weather.conditionHindi : weather.condition} • {weather.sprayAdvisory}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>{isHi ? 'मौसम पूर्वानुमान' : '7-Day Forecast'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </button>

        </div>
      </div>


      {/* ========================================================================= */}
      {/* SECTION 4: WHAT TO DO TODAY (MAX 3 INTELLIGENT ACTIONS)                    */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <h3 className="text-base sm:text-lg font-black text-white">
              {isHi ? 'आज क्या करें? (What To Do Today)' : 'What To Do Today'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
            3 Priority Actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INITIAL_DAILY_ACTIONS.map((action, idx) => (
            <button
              key={action.id}
              onClick={() => {
                audio.playClick();
                onNavigateTab(action.targetTab);
              }}
              className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition-all flex items-start gap-3 group"
            >
              <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <div className="min-w-0 space-y-1">
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {idx + 1}. {isHi ? action.titleHi : action.titleEn}
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {isHi ? action.actionHi : action.actionEn}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>


      {/* ========================================================================= */}
      {/* SECTION 5: MY FARM PREVIEW (LARGE CLEAN SATELLITE VIEW)                   */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>🗺️ {isHi ? 'मेरा खेत नक्शा (My Farm Satellite Preview)' : 'My Farm Satellite View'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              📍 {currentPlot.locationName} • {currentPlot.areaHa} Ha • {variety.varietyName}
            </p>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onNavigateTab('my_farm');
            }}
            className="px-4 py-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-2 w-fit"
          >
            <span>{isHi ? 'पूरा खेत नक्शा खोलें' : 'Open Full Farm Map'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Satellite Map Preview Frame */}
        <div 
          onClick={() => {
            audio.playClick();
            onNavigateTab('my_farm');
          }}
          className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-emerald-500/30 cursor-pointer group shadow-2xl"
        >
          {/* Satellite Base Imagery */}
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80"
            alt="Farm Satellite View"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay Gradient & Field Grid Indicator */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020e06]/90 via-transparent to-black/30" />

          {/* Polygon Field Box Simulator */}
          <div className="absolute inset-8 sm:inset-16 border-2 border-dashed border-emerald-400 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-400 text-emerald-300 text-xs font-bold font-mono shadow-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{currentPlot.name} • {variety.varietyName}</span>
            </div>
          </div>

          {/* Bottom Card Inside Map Preview */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">{variety.iconEmoji || '🌾'}</span>
              <div>
                <div className="font-bold text-white">{currentPlot.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono">Field Health: {fusion.healthScore}% • Good</div>
              </div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              {isHi ? 'नक्शा देखें' : 'View Map'} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
