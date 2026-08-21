import React from 'react';
import { 
  Mic, 
  Camera, 
  ArrowRight, 
  MapPin, 
  Sprout, 
  Sparkles, 
  ChevronRight
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

interface HomeDashboardProps {
  currentPlot: FarmPlot;
  variety: CropVariety;
  fusion: FusionResult;
  zone?: FieldZone;
  telemetry: SensorTelemetry;
  leaf?: LeafSample;
  weather: RealtimeWeather;
  language: AppLanguage;
  farmerProfile?: FarmerProfile;
  onOpenVoice: () => void;
  onOpenCamera: () => void;
  onOpenCropSelector: () => void;
  onNavigateTab: (tab: AppNavigationTab) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentPlot,
  variety,
  fusion,
  telemetry,
  weather,
  language,
  farmerProfile,
  onOpenVoice,
  onOpenCamera,
  onOpenCropSelector,
  onNavigateTab,
}) => {
  const isHi = language === 'hi';
  const isHighRisk = fusion.riskPercentage > 50;

  // Simple, non-technical moisture status
  const getMoistureStatus = () => {
    if (telemetry.soilMoisture < 30) {
      return { text: isHi ? 'कम है (सिंचाई करें)' : 'Low (Needs Water)', color: 'text-[#B94742]', badge: '🔴' };
    }
    if (telemetry.soilMoisture < 50) {
      return { text: isHi ? 'थोड़ा कम' : 'Slightly Low', color: 'text-[#C57A10]', badge: '🟡' };
    }
    return { text: isHi ? 'पर्याप्त है' : 'Adequate', color: 'text-[#2F7D4A]', badge: '🟢' };
  };

  const moistureStatus = getMoistureStatus();

  // Simple GROOT conversational advice
  const getGrootAdvice = () => {
    if (telemetry.soilMoisture < 30) {
      return isHi 
        ? 'मिट्टी सूखी लग रही है। कल सुबह 6 से 9 बजे के बीच खेत में हल्की सिंचाई कर लेना अच्छा रहेगा।'
        : 'Soil moisture is low. Scheduling light irrigation tomorrow morning is recommended.';
    }
    if (isHighRisk) {
      return isHi
        ? 'फसल कुल मिलाकर ठीक है, लेकिन एक हिस्से में हल्के पीले धब्बे दिख रहे हैं। एक बार खेत में जाकर पत्ते देख लें।'
        : 'Crop is generally good, but some early yellowing is observed. Inspect field leaves today.';
    }
    return isHi
      ? 'आपकी फसल बहुत अच्छी चल रही है। मौसम साफ़ है, नियमित देखभाल बनाए रखें।'
      : 'Your crop is healthy and growing well. Weather is clear for routine field operations.';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-[1400px] mx-auto">
      
      {/* ========================================================================= */}
      {/* 1. GREETING SECTION (CLEAN, NO GIANT HERO BANNER)                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2520] tracking-tight">
            {isHi ? `नमस्ते ${farmerProfile?.name ? farmerProfile.name.split(' ')[0] : ''} 👋` : `Namaste ${farmerProfile?.name ? farmerProfile.name.split(' ')[0] : ''} 👋`}
          </h1>
          <p className="text-sm sm:text-base text-[#66756D] font-medium mt-0.5">
            {isHi ? 'आज आपकी फसल का हाल देखते हैं' : 'Here is your farm and crop update for today'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#1F6B45] bg-[#EDF4EC] px-3.5 py-2 rounded-xl border border-[#DDE6DD] w-fit">
          <MapPin className="w-4 h-4 text-[#1F6B45]" />
          <span>{currentPlot.locationName}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ACTIVE CROP CARD (LARGE, BEAUTIFUL, SIMPLE)                            */}
      {/* ========================================================================= */}
      <div className="groot-card p-5 sm:p-6 bg-white overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Left: Visual Crop Photo + Crop Details */}
          <div className="flex items-start sm:items-center gap-4">
            
            {/* 16:9 / 4:3 Crop Photo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#EDF4EC] shrink-0 border border-[#DDE6DD] shadow-sm">
              <img
                src={
                  variety.cropFamilyId === 'wheat' 
                    ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80'
                    : variety.cropFamilyId === 'rice'
                    ? 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80'
                }
                alt={variety.cropName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 text-xl drop-shadow-md">
                {variety.iconEmoji || '🌾'}
              </span>
            </div>

            {/* Crop Info */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#66756D] uppercase tracking-wider">
                {isHi ? 'आपकी फसल • YOUR CROP' : 'YOUR ACTIVE CROP'}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1B2520] tracking-tight">
                {variety.cropName} <span className="text-[#1F6B45] font-semibold text-lg sm:text-xl">/ {variety.cropHindi}</span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="text-xs font-bold text-[#1B2520] px-2.5 py-1 rounded-lg bg-[#EDF4EC] border border-[#DDE6DD]">
                  {variety.varietyHindi || variety.varietyName || 'General Variety'}
                </span>

                <span className={`text-xs font-bold px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                  isHighRisk 
                    ? 'bg-[#C57A10]/15 text-[#C57A10] border-[#C57A10]/30'
                    : 'bg-[#2F7D4A]/15 text-[#2F7D4A] border-[#2F7D4A]/30'
                }`}>
                  <span>{isHighRisk ? '🟡' : '🟢'}</span>
                  <span>{isHighRisk ? (isHi ? 'ध्यान देने की जरूरत' : 'Needs Attention') : (isHi ? 'फसल ठीक है' : 'Crop is Healthy')}</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right: Change Crop Action Button */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenCropSelector();
            }}
            className="groot-btn-secondary px-5 py-3 text-sm font-bold w-full md:w-auto"
          >
            <Sprout className="w-4 h-4 text-[#1F6B45] mr-2" />
            <span>{isHi ? 'फसल बदलें (Change Crop)' : 'Change Crop'}</span>
            <ArrowRight className="w-4 h-4 ml-1 text-[#66756D]" />
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TWO LARGE PRIMARY ACTIONS (50 / 50 DESKTOP, 1-COL MOBILE)               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Action 1: 🎙️ Ask GROOT */}
        <button
          onClick={() => {
            audio.playClick();
            onOpenVoice();
          }}
          className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-[#1F6B45]/30 hover:border-[#1F6B45] shadow-[0_4px_16px_rgba(31,107,69,0.08)] hover:shadow-[0_8px_24px_rgba(31,107,69,0.14)] text-left transition-all group flex items-center gap-5 min-h-[110px]"
        >
          <div className="flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#1F6B45] text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
            <Mic className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-[#1B2520] group-hover:text-[#1F6B45] transition-colors flex items-center gap-2">
              <span>🎙️ {isHi ? 'GROOT से बोलकर पूछें' : 'Ask GROOT'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#66756D] font-medium leading-relaxed">
              {isHi ? 'बोलकर अपनी फसल के बारे में पूछें' : 'Ask questions naturally by speaking'}
            </p>
          </div>
        </button>

        {/* Action 2: 📷 Check Crop by Photo */}
        <button
          onClick={() => {
            audio.playClick();
            onOpenCamera();
          }}
          className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-[#DDE6DD] hover:border-[#1F6B45] shadow-[0_4px_16px_rgba(24,55,38,0.06)] hover:shadow-[0_8px_24px_rgba(31,107,69,0.12)] text-left transition-all group flex items-center gap-5 min-h-[110px]"
        >
          <div className="flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#EDF4EC] text-[#1F6B45] border border-[#DDE6DD] group-hover:scale-105 transition-transform shrink-0">
            <Camera className="w-8 h-8 text-[#1F6B45]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-[#1B2520] group-hover:text-[#1F6B45] transition-colors flex items-center gap-2">
              <span>📷 {isHi ? 'फसल जांचें' : 'Check Crop'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#66756D] font-medium leading-relaxed">
              {isHi ? 'फसल की फोटो लेकर जांच करें' : 'Take a photo of leaf to diagnose disease'}
            </p>
          </div>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 4. TODAY CARD (ONE SIMPLE COMBINED CARD WITH GROOT ADVICE)                */}
      {/* ========================================================================= */}
      <div className="groot-card p-5 sm:p-6 bg-white space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-[#DDE6DD]">
          <h3 className="text-base sm:text-lg font-black text-[#1B2520] flex items-center gap-2">
            <span>📊 {isHi ? 'आज का हाल (Today\'s Status)' : 'Today\'s Farm Status'}</span>
          </h3>
          <span className="text-xs font-semibold text-[#66756D]">
            Live Met & Sensors
          </span>
        </div>

        {/* 3 Status Points in One Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Status 1: Crop */}
          <div className="p-4 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] space-y-1">
            <div className="text-xs font-bold text-[#66756D] flex items-center gap-1.5">
              <span>❤️ {isHi ? 'फसल सेहत' : 'Crop Vitality'}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-[#1B2520]">
              {isHighRisk ? (isHi ? '🟡 ध्यान दें' : '🟡 Needs Attention') : (isHi ? '🟢 अच्छी है' : '🟢 Healthy')}
            </div>
          </div>

          {/* Status 2: Water */}
          <div className="p-4 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] space-y-1">
            <div className="text-xs font-bold text-[#66756D] flex items-center gap-1.5">
              <span>💧 {isHi ? 'पानी / नमी' : 'Soil Moisture'}</span>
            </div>
            <div className={`text-base sm:text-lg font-black ${moistureStatus.color}`}>
              {moistureStatus.badge} {moistureStatus.text}
            </div>
          </div>

          {/* Status 3: Weather */}
          <div className="p-4 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] space-y-1">
            <div className="text-xs font-bold text-[#66756D] flex items-center gap-1.5">
              <span>🌤️ {isHi ? 'आज का मौसम' : 'Weather'}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-[#1B2520]">
              {weather.temperature}°C • {isHi ? weather.conditionHindi : weather.condition}
            </div>
          </div>

        </div>

        {/* GROOT ki salah (in Soft Green Surface) */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#EDF4EC] border border-[#DDE6DD] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F6B45] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#1F6B45]" />
              <span>{isHi ? 'GROOT की सलाह' : 'GROOT ADVICE'}</span>
            </div>

            <button
              onClick={() => {
                audio.playClick();
                onNavigateTab('crop_health');
              }}
              className="text-xs font-bold text-[#1F6B45] hover:text-[#174F35] flex items-center gap-1 underline"
            >
              <span>{isHi ? 'और देखें' : 'View More'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-[#1B2520] font-medium leading-relaxed">
            "{getGrootAdvice()}"
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. MERA KHET (SATELLITE FARM MAP DIRECTLY ON DASHBOARD)                   */}
      {/* ========================================================================= */}
      <div className="groot-card p-5 sm:p-6 bg-white space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#1B2520] flex items-center gap-2">
              <span>🗺️ {isHi ? 'मेरा खेत (Mera Khet - Satellite View)' : 'My Farm Satellite Map'}</span>
            </h3>
            <p className="text-xs text-[#66756D]">
              📍 {currentPlot.locationName} • {currentPlot.areaHa ? `${Math.round(currentPlot.areaHa * 2.47)} Acres` : '2.3 Acres'}
            </p>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onNavigateTab('my_farm');
            }}
            className="groot-btn-primary px-4 py-2.5 text-xs font-bold w-fit"
          >
            <span>{isHi ? 'खेत खोलें (Open Farm)' : 'Open Farm'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {/* Real Satellite Map View Canvas */}
        <div 
          onClick={() => {
            audio.playClick();
            onNavigateTab('my_farm');
          }}
          className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#DDE6DD] cursor-pointer group shadow-sm"
        >
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80"
            alt="Farm Satellite View"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />

          {/* Polygon Field Boundary Overlay Box */}
          <div className="absolute inset-8 sm:inset-14 border-2 border-dashed border-[#F2B84B] bg-[#1F6B45]/15 rounded-2xl flex items-center justify-center">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/95 text-[#1B2520] text-xs font-bold border border-[#DDE6DD] shadow-md flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F6B45] animate-ping" />
              <span>{currentPlot.name} • {variety.varietyName || variety.cropName}</span>
            </div>
          </div>

          {/* Bottom Card Inside Satellite Preview */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#DDE6DD] flex items-center justify-between text-xs shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">{variety.iconEmoji || '🌾'}</span>
              <div>
                <div className="font-bold text-[#1B2520]">{currentPlot.name}</div>
                <div className="text-[11px] text-[#66756D]">{variety.cropName} • {variety.varietyName || 'General'} • 2.3 acres</div>
              </div>
            </div>
            <span className="text-[#1F6B45] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              {isHi ? 'खेत नक्शा देखें' : 'Open Map'} <ChevronRight className="w-4 h-4" />
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
