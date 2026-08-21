import { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_ZONES, 
  INITIAL_TELEMETRY, 
  LEAF_SAMPLES 
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
  RealtimeWeather,
  FarmerProfile
} from './types/groot';
import { CropVariety } from './types/crops';
import { ALL_CROP_VARIETIES } from './services/cropDatabase';
import { INITIAL_FARMS, DEFAULT_FARMER_PROFILE } from './services/farmService';
import { LeftSidebar } from './components/Navigation/LeftSidebar';
import { TopNavbar } from './components/Navigation/TopNavbar';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { MobileSideDrawer } from './components/Navigation/MobileSideDrawer';

// Dedicated Farmer-First Pages
import { HomeDashboard } from './components/Home/HomeDashboard';
import { MyCropsPage } from './components/Crops/MyCropsPage';
import { MyFarmPage } from './components/Farm/MyFarmPage';
import { CropHealthPage } from './components/Health/CropHealthPage';
import { PestDiseasePage } from './components/PestDisease/PestDiseasePage';
import { WaterIrrigationPage } from './components/Water/WaterIrrigationPage';
import { WeatherPage } from './components/Weather/WeatherPage';
import { GrowthYieldPage } from './components/Growth/GrowthYieldPage';
import { ReportsPage } from './components/Reports/ReportsPage';
import { SettingsPage } from './components/Settings/SettingsPage';

// Modals & Audio Assistant
import { ConversationalVoiceModal } from './components/Voice/ConversationalVoiceModal';
import { CropVarietySelector } from './components/Agronomy/CropVarietySelector';
import { ExportDossierModal } from './components/Modals/ExportDossierModal';
import { audio } from './services/audioService';

export function App() {
  // 1. Primary Navigation & Farmer Context State
  const [activeTab, setActiveTab] = useState<AppNavigationTab>('home');
  const [uiMode, setUiMode] = useState<UserUIMode>('farmer_easy');
  const [language, setLanguage] = useState<AppLanguage>('hi');
  const [allPlots] = useState<FarmPlot[]>(INITIAL_FARMS);
  const [currentPlot, setCurrentPlot] = useState<FarmPlot>(INITIAL_FARMS[0]);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(DEFAULT_FARMER_PROFILE);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Live Real-Time Weather State (Open-Meteo API)
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

  // 3. Agronomy & Remote Sensing Data State
  const [zones] = useState<FieldZone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<FieldZone>(
    INITIAL_ZONES.find((z) => z.id === 'Zone C4') || INITIAL_ZONES[13]
  );
  const [layerMode, setLayerMode] = useState<LayerMode>('hazard');
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(INITIAL_TELEMETRY);
  const [activeLeaf, setActiveLeaf] = useState<LeafSample>(LEAF_SAMPLES[0]);

  // 4. Crop & Variety Selection State
  const [selectedVariety, setSelectedVariety] = useState<CropVariety>(ALL_CROP_VARIETIES[0]);
  const [isCropSelectorOpen, setIsCropSelectorOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Compute live multi-modal fusion score (variety-calibrated)
  const fusionResult = calculateFusion(selectedZone, telemetry, activeLeaf, selectedVariety);
  const hotspotCount = zones.filter((z) => z.isHotspot).length;

  const handlePlotChange = (plot: FarmPlot) => {
    setCurrentPlot(plot);
    // Find matching variety if linked
    if (plot.varietyId) {
      const match = ALL_CROP_VARIETIES.find(v => v.id === plot.varietyId);
      if (match) setSelectedVariety(match);
    }
  };

  return (
    <div className="min-h-screen bg-[#020b06] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black flex">
      
      {/* 1. Desktop Left Sidebar Navigation (9 Simplified Primary Items + Settings at bottom only) */}
      <LeftSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedVariety={selectedVariety}
        onOpenCropSelector={() => setIsCropSelectorOpen(true)}
        currentPlot={currentPlot}
        language={language}
        hotspotCount={hotspotCount}
      />

      {/* 2. Main Application View Wrapper */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Navbar Header (Farmer Greeting + Location + Alerts + Profile) */}
        <TopNavbar
          currentPlot={currentPlot}
          allPlots={allPlots}
          onPlotChange={handlePlotChange}
          farmerProfile={farmerProfile}
          language={language}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateTab={setActiveTab}
          onOpenLocationModal={() => setActiveTab('my_farm')}
        />

        {/* 3. Dedicated Main Content View Container */}
        <main className="flex-1 max-w-[1500px] w-full mx-auto px-3 sm:px-6 py-5 pb-28 lg:pb-8 space-y-6">
          
          {/* PAGE 1: 🏠 HOME DASHBOARD */}
          {activeTab === 'home' && (
            <HomeDashboard
              currentPlot={currentPlot}
              variety={selectedVariety}
              fusion={fusionResult}
              zone={selectedZone}
              telemetry={telemetry}
              leaf={activeLeaf}
              weather={weather}
              language={language}
              farmerProfile={farmerProfile}
              onOpenVoice={() => setIsVoiceModalOpen(true)}
              onOpenCamera={() => setActiveTab('pest_disease')}
              onOpenCropSelector={() => setIsCropSelectorOpen(true)}
              onNavigateTab={setActiveTab}
              onRefreshWeather={() => loadWeather(currentPlot)}
              isWeatherLoading={isWeatherLoading}
            />
          )}

          {/* PAGE 2: 🌾 MY CROPS */}
          {activeTab === 'my_crops' && (
            <MyCropsPage
              currentPlot={currentPlot}
              selectedVariety={selectedVariety}
              onSelectVariety={(v) => {
                setSelectedVariety(v);
                audio.playClick();
              }}
              language={language}
              onOpenCropSelector={() => setIsCropSelectorOpen(true)}
            />
          )}

          {/* PAGE 3: 🗺️ MY FARM */}
          {activeTab === 'my_farm' && (
            <MyFarmPage
              currentPlot={currentPlot}
              allPlots={allPlots}
              onPlotChange={handlePlotChange}
              zones={zones}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              layerMode={layerMode}
              onLayerModeChange={setLayerMode}
              variety={selectedVariety}
              language={language}
            />
          )}

          {/* PAGE 4: ❤️ CROP HEALTH */}
          {activeTab === 'crop_health' && (
            <CropHealthPage
              fusion={fusionResult}
              zone={selectedZone}
              telemetry={telemetry}
              leaf={activeLeaf}
              variety={selectedVariety}
              language={language}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* PAGE 5: 🐛 PEST & DISEASE */}
          {activeTab === 'pest_disease' && (
            <PestDiseasePage
              activeSample={activeLeaf}
              onSelectSample={setActiveLeaf}
              language={language}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* PAGE 6: 💧 WATER & IRRIGATION */}
          {activeTab === 'water_irrigation' && (
            <WaterIrrigationPage
              telemetry={telemetry}
              onUpdateTelemetry={setTelemetry}
              zone={selectedZone}
              weather={weather}
              variety={selectedVariety}
              language={language}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* PAGE 7: 🌤️ WEATHER */}
          {activeTab === 'weather' && (
            <WeatherPage
              weather={weather}
              currentPlot={currentPlot}
              variety={selectedVariety}
              language={language}
              onRefreshWeather={() => loadWeather(currentPlot)}
              isWeatherLoading={isWeatherLoading}
            />
          )}

          {/* PAGE 8: 📈 GROWTH & YIELD */}
          {activeTab === 'growth_yield' && (
            <GrowthYieldPage
              fusion={fusionResult}
              zone={selectedZone}
              telemetry={telemetry}
              variety={selectedVariety}
              language={language}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* PAGE 9: 📋 REPORTS */}
          {activeTab === 'reports' && (
            <ReportsPage
              fusion={fusionResult}
              telemetry={telemetry}
              currentPlot={currentPlot}
              variety={selectedVariety}
              language={language}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {/* PAGE 10: ⚙️ SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsPage
              language={language}
              onLanguageChange={setLanguage}
              uiMode={uiMode}
              onUiModeChange={setUiMode}
              farmerProfile={farmerProfile}
              onUpdateFarmerProfile={setFarmerProfile}
            />
          )}

        </main>

        {/* 4. Professional Agronomy Footer */}
        <footer className="border-t border-emerald-500/15 py-5 px-4 text-center text-xs font-mono text-slate-400 bg-[#020b06] pb-24 lg:pb-5">
          <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">GROOT • HARA BHARA PLANET</span>
              <span className="text-slate-600">|</span>
              <span>Geospatial Remote-sensing & On-field Observation Technology</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Sentinel-2 MSI • ESP32 Soil Mesh • MobileNet-v3 AI • 13 Regional Languages
            </p>
          </div>
        </footer>

      </div>

      {/* 5. Mobile Bottom Thumb Dock Navigation (Mobile Only) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenCamera={() => setActiveTab('pest_disease')}
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
        currentPlot={currentPlot}
        language={language}
        hotspotCount={hotspotCount}
      />

      {/* 7. Interactive Conversational Voice Assistant Modal */}
      <ConversationalVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentPlot={currentPlot}
        variety={selectedVariety}
        fusion={fusionResult}
        zone={selectedZone}
        telemetry={telemetry}
        leaf={activeLeaf}
        weather={weather}
        language={language}
        onNavigateTab={setActiveTab}
        onOpenCamera={() => {
          setIsVoiceModalOpen(false);
          setActiveTab('pest_disease');
        }}
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

      {/* 9. Export Field Audit PDF Dossier Modal */}
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
