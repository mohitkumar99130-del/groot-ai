import { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_ZONES, 
  INITIAL_TELEMETRY, 
  LEAF_SAMPLES, 
  TEMPORAL_TREND_DATA 
} from './services/mockData';
import { calculateFusion } from './services/fusionEngine';
import { fetchRealtimeWeather } from './services/weatherService';
import { 
  FieldZone, 
  LayerMode, 
  SensorTelemetry, 
  LeafSample, 
  AppNavigationTab, 
  UserUIMode, 
  AppLanguage,
  FarmPlot,
  RealtimeWeather
} from './types/groot';
import { CropVariety } from './types/crops';
import { ALL_CROP_VARIETIES } from './services/cropDatabase';
import { LeftSidebar } from './components/Navigation/LeftSidebar';
import { TopNavbar, DEMO_PLOTS } from './components/Navigation/TopNavbar';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { MobileSideDrawer } from './components/Navigation/MobileSideDrawer';
import { SatelliteFieldMap } from './components/Geospatial/SatelliteFieldMap';
import { ZoneDetailDrawer } from './components/Geospatial/ZoneDetailDrawer';
import { SpectralLegend } from './components/Geospatial/SpectralLegend';
import { FieldOverviewBanner } from './components/Geospatial/FieldOverviewBanner';
import { CropDiagnosticLab } from './components/Diagnostics/CropDiagnosticLab';
import { FertilizerCalculator } from './components/Agronomy/FertilizerCalculator';
import { PestRxCard } from './components/Agronomy/PestRxCard';
import { YieldMaximizerSteps } from './components/Agronomy/YieldMaximizerSteps';
import { TemporalForecastChart } from './components/Analytics/TemporalForecastChart';
import { XaiAttributionMatrix } from './components/Analytics/XaiAttributionMatrix';
import { IoTSoilMeshDashboard } from './components/Telemetry/IoTSoilMeshDashboard';
import { KisanVoiceAssistant } from './components/Voice/KisanVoiceAssistant';
import { FarmerMainHub } from './components/Farmer/FarmerMainHub';
import { CropVarietySelector } from './components/Agronomy/CropVarietySelector';
import { ExportDossierModal } from './components/Modals/ExportDossierModal';
import { audio } from './services/audioService';
import { realVoiceService } from './services/voiceService';
import { Volume2 } from 'lucide-react';

export function App() {
  // Navigation & UI Configuration State
  const [activeTab, setActiveTab] = useState<AppNavigationTab>('dashboard');
  const [uiMode, setUiMode] = useState<UserUIMode>('farmer_easy');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [currentPlot, setCurrentPlot] = useState<FarmPlot>(DEMO_PLOTS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live Real-Time Weather State (Open-Meteo API)
  const [weather, setWeather] = useState<RealtimeWeather>({
    temperature: 28.4,
    humidity: 64,
    windSpeed: 8.8,
    windDirection: 60,
    weatherCode: 1,
    condition: 'Sunny / Clear',
    conditionHindi: 'धूप / साफ़ मौसम',
    isDay: true,
    rainMm: 0,
    sprayAdvisory: 'Optimal',
    sprayAdvisoryHindi: 'छिड़काव के लिए सर्वोत्तम समय',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'Open-Meteo High-Res Realtime Met',
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const loadWeather = useCallback(async (plot: FarmPlot) => {
    setIsWeatherLoading(true);
    const data = await fetchRealtimeWeather(plot.latitude, plot.longitude);
    setWeather(data);
    setIsWeatherLoading(false);
  }, []);

  useEffect(() => {
    loadWeather(currentPlot);
  }, [currentPlot, loadWeather]);

  // Agronomy Data State
  const [zones] = useState<FieldZone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<FieldZone>(
    INITIAL_ZONES.find((z) => z.id === 'Zone C4') || INITIAL_ZONES[13]
  );
  const [layerMode, setLayerMode] = useState<LayerMode>('hazard');
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(INITIAL_TELEMETRY);
  const [activeLeaf, setActiveLeaf] = useState<LeafSample>(LEAF_SAMPLES[0]);

  // Crop & Variety State
  const [selectedVariety, setSelectedVariety] = useState<CropVariety>(ALL_CROP_VARIETIES[0]);
  const [isCropSelectorOpen, setIsCropSelectorOpen] = useState(false);

  // Modals & Audio State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGlobalSpeaking, setIsGlobalSpeaking] = useState(false);

  // Compute live multi-modal fusion score (variety-calibrated)
  const fusionResult = calculateFusion(selectedZone, telemetry, activeLeaf, selectedVariety);
  const hotspotCount = zones.filter((z) => z.isHotspot).length;

  const handleResetDemo = () => {
    audio.playClick();
    setSelectedZone(INITIAL_ZONES.find((z) => z.id === 'Zone C4') || INITIAL_ZONES[13]);
    setTelemetry(INITIAL_TELEMETRY);
    setActiveLeaf(LEAF_SAMPLES[0]);
    setLayerMode('hazard');
    setCurrentPlot(DEMO_PLOTS[0]);
  };

  const handleToggleGlobalVoice = async () => {
    if (isGlobalSpeaking) {
      realVoiceService.stop();
      setIsGlobalSpeaking(false);
      return;
    }
    setIsGlobalSpeaking(true);
    const summaryText = language === 'hi' ? fusionResult.hindiVoiceSummary : fusionResult.englishVoiceSummary;
    await realVoiceService.speak(summaryText, language);
    setIsGlobalSpeaking(false);
  };

  const handleScrollToExplanation = () => {
    setActiveTab('temporal_analytics');
    setTimeout(() => {
      document.getElementById('xai-explanation-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const isFarmerMode = uiMode === 'farmer_easy';

  return (
    <div className="min-h-screen bg-agri-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black flex">
      
      {/* 1. Desktop Left Sidebar Navigation */}
      <LeftSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedVariety={selectedVariety}
        onOpenCropSelector={() => setIsCropSelectorOpen(true)}
        uiMode={uiMode}
        onUiModeChange={setUiMode}
        language={language}
        onLanguageChange={setLanguage}
        currentPlot={currentPlot}
        onPlotChange={setCurrentPlot}
        isSpeaking={isGlobalSpeaking}
        onToggleVoice={handleToggleGlobalVoice}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetDemo={handleResetDemo}
        hotspotCount={hotspotCount}
        weather={weather}
        onRefreshWeather={() => loadWeather(currentPlot)}
        isWeatherLoading={isWeatherLoading}
      />

      {/* 2. Main Page Content Wrapper */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Navbar Header */}
        <TopNavbar
          activeTab={activeTab}
          currentPlot={currentPlot}
          onPlotChange={setCurrentPlot}
          selectedVariety={selectedVariety}
          onOpenCropSelector={() => setIsCropSelectorOpen(true)}
          uiMode={uiMode}
          onUiModeChange={setUiMode}
          language={language}
          onLanguageChange={setLanguage}
          isSpeaking={isGlobalSpeaking}
          onToggleVoice={handleToggleGlobalVoice}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onResetDemo={handleResetDemo}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          weather={weather}
          onRefreshWeather={() => loadWeather(currentPlot)}
          isWeatherLoading={isWeatherLoading}
        />

        {/* Farmer Easy Mode Notification Banner */}
        {isFarmerMode && (
          <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-agri-950 border-b border-emerald-500/20 px-3 sm:px-6 py-2">
            <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-[11px] flex items-center gap-1 font-mono">
                  🌾 Kisan Easy Mode
                </span>
                <p className="text-slate-300 text-xs">
                  {language === 'hi'
                    ? 'सरल मोड सक्रिय है। ऊपर दिए गए बटन दबाकर हिंदी में आवाज़ रिपोर्ट सुनें।'
                    : 'Clean tactile interface with one-tap spoken audio advisory.'}
                </p>
              </div>
              <button
                onClick={handleToggleGlobalVoice}
                className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold border border-amber-500/40 flex items-center gap-1.5 transition-all text-xs shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>{isGlobalSpeaking ? 'आवाज़ बंद करें' : '🔊 तुरंत आवाज़ सलाह'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Dedicated Multi-Page View Container */}
        <main className="flex-1 max-w-[1500px] w-full mx-auto px-3 sm:px-6 py-5 pb-24 lg:pb-8 space-y-6">
          
          {/* PAGE 1: 🛰️ GEOSPATIAL SENTINEL-2 SATELLITE DECK */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">

              {/* FARMER EASY MODE: FarmerMainHub is the primary view */}
              {isFarmerMode ? (
                <FarmerMainHub
                  fusion={fusionResult}
                  zone={selectedZone}
                  telemetry={telemetry}
                  leaf={activeLeaf}
                  variety={selectedVariety}
                  language={language}
                  weather={weather}
                  onOpenCropSelector={() => setIsCropSelectorOpen(true)}
                  onNavigateTab={setActiveTab}
                  onRefreshWeather={() => loadWeather(currentPlot)}
                  isWeatherLoading={isWeatherLoading}
                />
              ) : (
                <>
                  {/* PRO MODE: Full Satellite Dashboard */}
                  <FieldOverviewBanner
                    fusion={fusionResult}
                    zone={selectedZone}
                    currentPlot={currentPlot}
                    variety={selectedVariety}
                    language={language}
                    onScrollToExplanation={handleScrollToExplanation}
                  />

                  {/* Main Geospatial Section: Map + Zone Detail Drawer */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-4">
                      <SatelliteFieldMap
                        zones={zones}
                        selectedZone={selectedZone}
                        onSelectZone={setSelectedZone}
                        layerMode={layerMode}
                        onLayerModeChange={setLayerMode}
                        language={language}
                      />
                      <SpectralLegend layerMode={layerMode} />
                    </div>

                    <div className="lg:col-span-4">
                      <ZoneDetailDrawer
                        zone={selectedZone}
                        fusion={fusionResult}
                        language={language}
                        onNavigateToDiagnostics={() => setActiveTab('camera_doctor')}
                        onNavigateToFertilizer={() => setActiveTab('fertilizer_doctor')}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PAGE 2: 📸 CROP DIAGNOSTIC LAB & LEAF SCANNER */}
          {activeTab === 'camera_doctor' && (
            <div className="animate-in fade-in duration-200">
              <CropDiagnosticLab
                samples={LEAF_SAMPLES}
                activeSample={activeLeaf}
                onSelectSample={setActiveLeaf}
                zoneId={selectedZone.id}
                language={language}
              />
            </div>
          )}

          {/* PAGE 3: 🧪 FERTILIZER & PEST RX CALCULATOR */}
          {activeTab === 'fertilizer_doctor' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <FertilizerCalculator
                fusion={fusionResult}
                zone={selectedZone}
                telemetry={telemetry}
                variety={selectedVariety}
                language={language}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PestRxCard
                  pestControl={fusionResult.pestControl}
                  language={language}
                />
                <YieldMaximizerSteps
                  steps={fusionResult.productivitySteps}
                  language={language}
                />
              </div>
            </div>
          )}

          {/* PAGE 4: 📈 14-DAY TEMPORAL TRAJECTORY & RECOVERY FORECAST */}
          {activeTab === 'temporal_analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <TemporalForecastChart
                data={TEMPORAL_TREND_DATA}
                zoneId={selectedZone.id}
                language={language}
              />

              <div id="xai-explanation-section">
                <XaiAttributionMatrix
                  fusion={fusionResult}
                  zone={selectedZone}
                  language={language}
                />
              </div>
            </div>
          )}

          {/* PAGE 5: 🎛️ IOT SOIL SENSOR MESH & STRESS SIMULATOR */}
          {activeTab === 'sensor_simulator' && (
            <div className="animate-in fade-in duration-200">
              <IoTSoilMeshDashboard
                telemetry={telemetry}
                onUpdateTelemetry={setTelemetry}
                zoneId={selectedZone.id}
                language={language}
              />
            </div>
          )}

          {/* PAGE 6: 🎙️ KISAN SAHAYAK VOICE ASSISTANT */}
          {activeTab === 'voice_assistant' && (
            <div className="animate-in fade-in duration-200">
              <KisanVoiceAssistant
                fusion={fusionResult}
                zone={selectedZone}
                telemetry={telemetry}
                leaf={activeLeaf}
                variety={selectedVariety}
                language={language}
              />
            </div>
          )}


        </main>

        {/* 4. Professional Agronomy Footer */}
        <footer className="border-t border-emerald-500/15 py-5 px-4 text-center text-xs font-mono text-slate-400 bg-agri-950 pb-20 lg:pb-5">
          <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">GROOT • HARA BHARA PLANET</span>
              <span className="text-slate-600">|</span>
              <span>Multimodal Precision Agronomy Suite</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Sentinel-2 MSI 10m • ESP32 Mesh • Edge AI MobileNet-v3 • Open-Meteo Met
            </p>
          </div>
        </footer>

      </div>

      {/* 5. Mobile Bottom Thumb Dock Navigation (Mobile Only) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        language={language}
        hotspotCount={hotspotCount}
      />

      {/* 6. Mobile Slide-Over Left Navigation Drawer */}
      <MobileSideDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedVariety={selectedVariety}
        onOpenCropSelector={() => {
          setIsMobileMenuOpen(false);
          setIsCropSelectorOpen(true);
        }}
        uiMode={uiMode}
        onUiModeChange={setUiMode}
        language={language}
        onLanguageChange={setLanguage}
        currentPlot={currentPlot}
        onPlotChange={setCurrentPlot}
        isSpeaking={isGlobalSpeaking}
        onToggleVoice={handleToggleGlobalVoice}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetDemo={handleResetDemo}
        hotspotCount={hotspotCount}
        weather={weather}
      />

      {/* 8. Crop & Sub-Variety Selector Modal */}
      <CropVarietySelector
        isOpen={isCropSelectorOpen}
        onClose={() => setIsCropSelectorOpen(false)}
        selectedVariety={selectedVariety}
        onSelectVariety={(variety: CropVariety) => {
          setSelectedVariety(variety);
          setIsCropSelectorOpen(false);
          audio.playClick();
        }}
        language={language}
      />

      {/* 7. Export Field Audit PDF Dossier Modal */}
      <ExportDossierModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fusion={fusionResult}
        zone={selectedZone}
        telemetry={telemetry}
        leaf={activeLeaf}
      />

    </div>
  );
}

export default App;
