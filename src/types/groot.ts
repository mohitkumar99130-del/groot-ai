export type LayerMode = 'rgb' | 'ndvi' | 'ndmi' | 'thermal' | 'hazard';

export type AppNavigationTab = 
  | 'dashboard' 
  | 'camera_doctor' 
  | 'fertilizer_doctor' 
  | 'temporal_analytics'
  | 'sensor_simulator'
  | 'voice_assistant';

export type UserUIMode = 'farmer_easy' | 'pro_agronomy';

export type AppLanguage = 'hi' | 'en' | 'hinglish';

export interface FarmPlot {
  id: string;
  name: string;
  crop: string;
  areaHa: number;
  season: string;
  plantingDate: string;
  healthAverage: number;
  latitude: number;
  longitude: number;
  locationName: string;
}

export interface RealtimeWeather {
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: number; // degrees
  weatherCode: number;
  condition: string;
  conditionHindi: string;
  isDay: boolean;
  rainMm: number;
  sprayAdvisory: 'Optimal' | 'Caution' | 'Unfavorable';
  sprayAdvisoryHindi: string;
  lastUpdated: string;
  source: string;
}



export interface FieldZone {
  id: string; // e.g. "Zone C4"
  row: number;
  col: number;
  ndvi: number; // 0.0 - 1.0 (e.g. 0.38 for stressed, 0.85 for healthy)
  ndmi: number; // -0.2 to +0.6
  surfaceTemp: number; // in °C
  chlorophyllIndex: number;
  cropCondition: 'Healthy' | 'Moderate Anomaly' | 'Elevated Pest/Disease Risk' | 'Severe Water Stress';
  isHotspot?: boolean;
  notes: string;
}

export interface SensorTelemetry {
  soilMoisture: number; // 0 - 100% (capacitive)
  soilTemp: number; // °C
  ambientTemp: number; // °C
  humidity: number; // %
  soilPh: number; // e.g., 6.5
  electricalConductivity: number; // dS/m
  npk: {
    nitrogen: number; // mg/kg
    phosphorus: number; // mg/kg
    potassium: number; // mg/kg
  };
  batteryVoltage: number; // V (e.g. 3.92V)
  rssi: number; // dBm (e.g. -68 dBm)
  lastUpdated: string;
}

export interface LeafSample {
  id: string;
  name: string;
  condition: string;
  image: string;
  cnnConfidence: number; // 0 - 100%
  symptomSeverity: number; // 0 - 100%
  primaryPathogen: string;
  description: string;
  cropType?: string; // e.g. "Rice", "Wheat", "Tomato", "Maize"
}

export interface FertilizerRecommendation {
  name: string; // e.g. "Neem Coated Urea"
  hindiName: string; // e.g. "नीम लेपित यूरिया"
  dosage: string; // e.g. "45 kg / Acre (90 kg/ha)"
  applicationTiming: string; // e.g. "Early morning, 2 days post-irrigation"
  hindiTiming: string;
  reasoning: string;
  hindiReasoning: string;
}

export interface PestControlRecommendation {
  pestName: string; // e.g. "Rice Blast Fungus (Magnaporthe oryzae)"
  hindiPestName: string; // e.g. "धान का झुलसा रोग (ब्लास्ट)"
  chemicalRemedy: string;
  bioRemedy: string;
  hindiRemedy: string;
  urgency: 'Low' | 'Moderate' | 'High' | 'Immediate';
}

export interface ProductivityStep {
  stepNumber: number;
  title: string;
  hindiTitle: string;
  details: string;
  hindiDetails: string;
  impactScore: string; // e.g. "+18% Yield"
}

export interface FusionResult {
  healthScore: number; // 0 - 100 (Overall field vitality)
  riskPercentage: number; // 0 - 100 (Risk of crop loss)
  confidenceScore: number; // 0 - 100 (Tri-modal model confidence)
  status: 'OPTIMAL' | 'MODERATE STRESS' | 'HIGH HAZARD' | 'CRITICAL RISK';
  contributingFactors: {
    name: string;
    weight: number;
    impact: string;
    percentage: number;
    color: string;
  }[];
  actionPlan: {
    priority: 'Low' | 'Medium' | 'High' | 'Immediate';
    title: string;
    dosage: string;
    windowHours: number;
    instructions: string[];
  };
  fertilizers: FertilizerRecommendation[];
  pestControl: PestControlRecommendation[];
  productivitySteps: ProductivityStep[];
  hindiVoiceSummary: string;
}

export interface TemporalDataPoint {
  day: string;
  date: string;
  ndvi: number;
  soilMoisture: number;
  riskScore: number;
  projectedUntreated: number;
  projectedTreated: number;
}
