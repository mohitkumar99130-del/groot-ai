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
  SensorTelemetry, 
  LeafSample, 
  AppNavigationTab, 
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

// Farmer-First Consolidated Pages
import { HomeDashboard } from './components/Home/HomeDashboard';
import { MyCropsPage } from './components/Crops/MyCropsPage';
import { MyFarmPage } from './components/Farm/MyFarmPage';
import { CropHealthPage } from './components/Health/CropHealthPage';
import { SettingsPage } from './components/Settings/SettingsPage';

// Voice Assistant & Modals
import { ConversationalVoiceModal } from './components/Voice/ConversationalVoiceModal';
import { CropVarietySelector } from './components/Agronomy/CropVarietySelector';

export function App() {
  // 1. Primary State: Active Tab, Language, Farm, Crop
  const [activeTab, setActiveTab] = useState<AppNavigationTab>('home');
  const [language, setLanguage] = useState<AppLanguage>('hi');
  const [allPlots] = useState<FarmPlot[]>(INITIAL_FARMS);
  const [currentPlot, setCurrentPlot] = useState<FarmPlot>(INITIAL_FARMS[0]);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(DEFAULT_FARMER_PROFILE);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Live Weather State (Open-Meteo API)
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
    source: 'Open-Meteo Realtime Met',
  });

  const loadWeather = useCallback(async (plot: FarmPlot) => {
    const data = await fetchRealtimeWeather(plot.latitude, plot.longitude);
    setWeather(data);
  }, []);

  useEffect(() => {
    loadWeather(currentPlot);
  }, [currentPlot, loadWeather]);

  // 3. Agronomy & Sensors State
  const [zones] = useState<FieldZone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<FieldZone>(
    INITIAL_ZONES.find((z) => z.id === 'Zone C4') || INITIAL_ZONES[13]
  );
  const [telemetry] = useState<SensorTelemetry>(INITIAL_TELEMETRY);
  const [activeLeaf] = useState<LeafSample>(LEAF_SAMPLES[0]);

  // 4. Crop & Variety State
  const [selectedVariety, setSelectedVariety] = useState<CropVariety>(ALL_CROP_VARIETIES[0]);
  const [isCropSelectorOpen, setIsCropSelectorOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Calculate variety-calibrated fusion score
  const fusionResult = calculateFusion(selectedZone, telemetry, activeLeaf, selectedVariety);
  const hotspotCount = zones.filter((z) => z.isHotspot).length;

  const handlePlotChange = (plot: FarmPlot) => {
    setCurrentPlot(plot);
    if (plot.varietyId) {
      const match = ALL_CROP_VARIETIES.find(v => v.id === plot.varietyId);
      if (match) setSelectedVariety(match);
    }
  };

  const handleTabChange = (tab: AppNavigationTab) => {
    if (tab === 'voice_assistant') {
      setIsVoiceModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F2] text-[#1B2520] font-sans flex">
      
      {/* 1. Desktop Left Sidebar (5 Items + Settings) */}
      <LeftSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedVariety={selectedVariety}
        onOpenCropSelector={() => setIsCropSelectorOpen(true)}
        currentPlot={currentPlot}
        language={language}
        hotspotCount={hotspotCount}
      />

      {/* 2. Main Application Container */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Navbar Header */}
        <TopNavbar
          currentPlot={currentPlot}
          allPlots={allPlots}
          onPlotChange={handlePlotChange}
          farmerProfile={farmerProfile}
          language={language}
          onLanguageChange={setLanguage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateTab={handleTabChange}
        />

        {/* 3. Main Content Views */}
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 pb-28 lg:pb-8 space-y-6">
          
          {/* TAB 1: 🏠 HOME */}
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
              onOpenCamera={() => setActiveTab('crop_health')}
              onOpenCropSelector={() => setIsCropSelectorOpen(true)}
              onNavigateTab={handleTabChange}
            />
          )}

          {/* TAB 2: 🗺️ MY FARM */}
          {activeTab === 'my_farm' && (
            <MyFarmPage
              currentPlot={currentPlot}
              zones={zones}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              variety={selectedVariety}
              language={language}
            />
          )}

          {/* TAB 3: 🌾 MY CROPS */}
          {activeTab === 'my_crops' && (
            <MyCropsPage
              currentPlot={currentPlot}
              selectedVariety={selectedVariety}
              onSelectVariety={(v) => setSelectedVariety(v)}
              language={language}
            />
          )}

          {/* TAB 4: ❤️ CROP HEALTH */}
          {activeTab === 'crop_health' && (
            <CropHealthPage
              fusion={fusionResult}
              zone={selectedZone}
              telemetry={telemetry}
              leaf={activeLeaf}
              variety={selectedVariety}
              weather={weather}
              language={language}
            />
          )}

          {/* TAB 5: ⚙️ SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsPage
              language={language}
              onLanguageChange={setLanguage}
              farmerProfile={farmerProfile}
              onUpdateFarmerProfile={setFarmerProfile}
            />
          )}

        </main>

        {/* 4. Clean Footer */}
        <footer className="border-t border-[#DDE6DD] py-4 px-6 text-center text-xs text-[#66756D] bg-white pb-24 lg:pb-4">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold text-[#1F6B45]">GROOT • Simple Precision Agriculture</span>
            <span>Khet chuno → Fasal chuno → GROOT sab simple language mein samjha de</span>
          </div>
        </footer>

      </div>

      {/* 5. Mobile Bottom Navigation (Home | Farm | GROOT | Crops | Health) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        language={language}
        hotspotCount={hotspotCount}
      />

      {/* 6. Mobile Side Drawer */}
      <MobileSideDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedVariety={selectedVariety}
        onOpenCropSelector={() => {
          setIsMobileMenuOpen(false);
          setIsCropSelectorOpen(true);
        }}
        currentPlot={currentPlot}
        language={language}
        hotspotCount={hotspotCount}
      />

      {/* 7. Conversational Voice Assistant Modal */}
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
        onNavigateTab={handleTabChange}
      />

      {/* 8. Crop & Variety Selector Modal */}
      <CropVarietySelector
        isOpen={isCropSelectorOpen}
        onClose={() => setIsCropSelectorOpen(false)}
        selectedVariety={selectedVariety}
        onSelectVariety={(v: CropVariety) => {
          setSelectedVariety(v);
          setIsCropSelectorOpen(false);
        }}
        language={language}
      />

    </div>
  );
}

export default App;
