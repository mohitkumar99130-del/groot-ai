import { FieldZone, SensorTelemetry, LeafSample, TemporalDataPoint } from '../types/groot';

export const INITIAL_ZONES: FieldZone[] = [
  // Row A
  { id: 'Zone A1', row: 0, col: 0, ndvi: 0.88, ndmi: 0.42, surfaceTemp: 24.2, chlorophyllIndex: 0.91, cropCondition: 'Healthy', notes: 'Optimal vegetative density. Canopy closed.' },
  { id: 'Zone A2', row: 0, col: 1, ndvi: 0.84, ndmi: 0.39, surfaceTemp: 24.5, chlorophyllIndex: 0.86, cropCondition: 'Healthy', notes: 'Uniform growth; soil moisture balanced.' },
  { id: 'Zone A3', row: 0, col: 2, ndvi: 0.79, ndmi: 0.35, surfaceTemp: 25.1, chlorophyllIndex: 0.80, cropCondition: 'Healthy', notes: 'Slight nitrogen depletion detected.' },
  { id: 'Zone A4', row: 0, col: 3, ndvi: 0.72, ndmi: 0.28, surfaceTemp: 26.0, chlorophyllIndex: 0.74, cropCondition: 'Moderate Anomaly', notes: 'Mild canopy variance near drainage ditch.' },
  { id: 'Zone A5', row: 0, col: 4, ndvi: 0.81, ndmi: 0.38, surfaceTemp: 24.8, chlorophyllIndex: 0.83, cropCondition: 'Healthy', notes: 'Good chlorophyll absorption.' },

  // Row B
  { id: 'Zone B1', row: 1, col: 0, ndvi: 0.86, ndmi: 0.41, surfaceTemp: 24.3, chlorophyllIndex: 0.89, cropCondition: 'Healthy', notes: 'Vigorous tillering stage.' },
  { id: 'Zone B2', row: 1, col: 1, ndvi: 0.82, ndmi: 0.37, surfaceTemp: 24.9, chlorophyllIndex: 0.84, cropCondition: 'Healthy', notes: 'Consistent radiometric reflectance.' },
  { id: 'Zone B3', row: 1, col: 2, ndvi: 0.68, ndmi: 0.22, surfaceTemp: 27.2, chlorophyllIndex: 0.65, cropCondition: 'Moderate Anomaly', notes: 'Elevated thermal signature; borderline moisture.' },
  { id: 'Zone B4', row: 1, col: 3, ndvi: 0.58, ndmi: 0.15, surfaceTemp: 28.5, chlorophyllIndex: 0.56, cropCondition: 'Moderate Anomaly', notes: 'Spectral decline spreading towards C4.' },
  { id: 'Zone B5', row: 1, col: 4, ndvi: 0.76, ndmi: 0.32, surfaceTemp: 25.6, chlorophyllIndex: 0.77, cropCondition: 'Healthy', notes: 'Stable vegetative index.' },

  // Row C
  { id: 'Zone C1', row: 2, col: 0, ndvi: 0.85, ndmi: 0.40, surfaceTemp: 24.4, chlorophyllIndex: 0.87, cropCondition: 'Healthy', notes: 'Standard paddy baseline.' },
  { id: 'Zone C2', row: 2, col: 1, ndvi: 0.74, ndmi: 0.30, surfaceTemp: 26.2, chlorophyllIndex: 0.73, cropCondition: 'Moderate Anomaly', notes: 'Localized yellowing observed.' },
  { id: 'Zone C3', row: 2, col: 2, ndvi: 0.52, ndmi: 0.11, surfaceTemp: 29.1, chlorophyllIndex: 0.49, cropCondition: 'Moderate Anomaly', notes: 'Thermal stress zone. High evapotranspiration.' },
  { id: 'Zone C4', row: 2, col: 3, ndvi: 0.34, ndmi: -0.08, surfaceTemp: 32.4, chlorophyllIndex: 0.31, cropCondition: 'Elevated Pest/Disease Risk', isHotspot: true, notes: 'CRITICAL HOTSPOT: Spectral collapse, severe moisture deficit & rice blast signature.' },
  { id: 'Zone C5', row: 2, col: 4, ndvi: 0.71, ndmi: 0.29, surfaceTemp: 26.4, chlorophyllIndex: 0.70, cropCondition: 'Moderate Anomaly', notes: 'Buffer zone adjacent to C4 hotspot.' },

  // Row D
  { id: 'Zone D1', row: 3, col: 0, ndvi: 0.83, ndmi: 0.38, surfaceTemp: 24.7, chlorophyllIndex: 0.85, cropCondition: 'Healthy', notes: 'Adequate irrigation pond depth.' },
  { id: 'Zone D2', row: 3, col: 1, ndvi: 0.80, ndmi: 0.36, surfaceTemp: 25.0, chlorophyllIndex: 0.81, cropCondition: 'Healthy', notes: 'Good vegetative ground cover.' },
  { id: 'Zone D3', row: 3, col: 2, ndvi: 0.61, ndmi: 0.18, surfaceTemp: 28.0, chlorophyllIndex: 0.59, cropCondition: 'Moderate Anomaly', notes: 'Soil drying boundary.' },
  { id: 'Zone D4', row: 3, col: 3, ndvi: 0.48, ndmi: 0.05, surfaceTemp: 30.2, chlorophyllIndex: 0.45, cropCondition: 'Severe Water Stress', notes: 'Canopy thinning and leaf wilting risk.' },
  { id: 'Zone D5', row: 3, col: 4, ndvi: 0.78, ndmi: 0.34, surfaceTemp: 25.3, chlorophyllIndex: 0.79, cropCondition: 'Healthy', notes: 'Normal growth curve.' },

  // Row E
  { id: 'Zone E1', row: 4, col: 0, ndvi: 0.87, ndmi: 0.41, surfaceTemp: 24.1, chlorophyllIndex: 0.90, cropCondition: 'Healthy', notes: 'Optimal yield benchmark.' },
  { id: 'Zone E2', row: 4, col: 1, ndvi: 0.85, ndmi: 0.39, surfaceTemp: 24.4, chlorophyllIndex: 0.86, cropCondition: 'Healthy', notes: 'Strong root aeration.' },
  { id: 'Zone E3', row: 4, col: 2, ndvi: 0.77, ndmi: 0.33, surfaceTemp: 25.5, chlorophyllIndex: 0.78, cropCondition: 'Healthy', notes: 'Standard rice canopy.' },
  { id: 'Zone E4', row: 4, col: 3, ndvi: 0.69, ndmi: 0.24, surfaceTemp: 26.8, chlorophyllIndex: 0.68, cropCondition: 'Moderate Anomaly', notes: 'Minor nutrient variance.' },
  { id: 'Zone E5', row: 4, col: 4, ndvi: 0.82, ndmi: 0.37, surfaceTemp: 24.9, chlorophyllIndex: 0.83, cropCondition: 'Healthy', notes: 'Healthy edge perimeter.' },
];

export const INITIAL_TELEMETRY: SensorTelemetry = {
  soilMoisture: 21.4, // Critically low for paddy (ideal is 60-80%)
  soilTemp: 29.8,
  ambientTemp: 33.6,
  humidity: 48.2,
  soilPh: 6.4,
  electricalConductivity: 1.2,
  npk: {
    nitrogen: 18.2, // Low
    phosphorus: 12.5,
    potassium: 34.0,
  },
  batteryVoltage: 3.94,
  rssi: -64,
  lastUpdated: 'Just now (ESP32 Node #04)',
};

export const LEAF_SAMPLES: LeafSample[] = [
  {
    id: 'blast',
    name: 'Rice Blast (Fungal Pathogen)',
    condition: 'High Pathological Risk',
    image: '/assets/rice_leaf_blast.jpg',
    cnnConfidence: 94.8,
    symptomSeverity: 88.5,
    primaryPathogen: 'Magnaporthe oryzae',
    description: 'Distinctive spindle-shaped lesions with diamond necrotic centers and reddish-brown borders. High virulence under moisture stress.',
  },
  {
    id: 'healthy',
    name: 'Healthy Paddy Leaf',
    condition: 'Optimal Canopy',
    image: '/assets/rice_leaf_healthy.jpg',
    cnnConfidence: 99.1,
    symptomSeverity: 2.1,
    primaryPathogen: 'None Detected',
    description: 'Vibrant chlorophyll absorption, intact cuticle layer, zero lesion pathology or fungal hyphae present.',
  },
  {
    id: 'brown_spot',
    name: 'Brown Spot Disease',
    condition: 'Moderate Anomaly',
    image: '/assets/rice_leaf_blast.jpg', // Fallback to high-res leaf asset
    cnnConfidence: 86.4,
    symptomSeverity: 62.0,
    primaryPathogen: 'Bipolaris oryzae',
    description: 'Circular dark brown spots with yellow halos across the blade. Often correlates with potassium and silica deficiency.',
  },
  {
    id: 'water_stress',
    name: 'Severe Drought & Leaf Rolling',
    condition: 'Physiological Stress',
    image: '/assets/rice_leaf_blast.jpg', // Fallback
    cnnConfidence: 91.2,
    symptomSeverity: 79.4,
    primaryPathogen: 'Abiotic Drought Anomaly',
    description: 'Inward leaf rolling, loss of turgor pressure, stomatal closure, and elevated thermal emissivity.',
  },
];

export const TEMPORAL_TREND_DATA: TemporalDataPoint[] = [
  { day: 'Day -14', date: 'Aug 05', ndvi: 0.86, soilMoisture: 72, riskScore: 12, projectedUntreated: 12, projectedTreated: 12 },
  { day: 'Day -12', date: 'Aug 07', ndvi: 0.84, soilMoisture: 68, riskScore: 15, projectedUntreated: 15, projectedTreated: 15 },
  { day: 'Day -10', date: 'Aug 09', ndvi: 0.81, soilMoisture: 62, riskScore: 21, projectedUntreated: 21, projectedTreated: 21 },
  { day: 'Day -8', date: 'Aug 11', ndvi: 0.74, soilMoisture: 51, riskScore: 34, projectedUntreated: 34, projectedTreated: 34 },
  { day: 'Day -6', date: 'Aug 13', ndvi: 0.62, soilMoisture: 42, riskScore: 49, projectedUntreated: 49, projectedTreated: 49 },
  { day: 'Day -4', date: 'Aug 15', ndvi: 0.50, soilMoisture: 33, riskScore: 68, projectedUntreated: 68, projectedTreated: 68 },
  { day: 'Day -2', date: 'Aug 17', ndvi: 0.41, soilMoisture: 25, riskScore: 81, projectedUntreated: 81, projectedTreated: 81 },
  { day: 'Today', date: 'Aug 19', ndvi: 0.34, soilMoisture: 21, riskScore: 89, projectedUntreated: 89, projectedTreated: 89 },
  { day: 'Day +2', date: 'Aug 21', ndvi: 0.28, soilMoisture: 18, riskScore: 94, projectedUntreated: 95, projectedTreated: 65 },
  { day: 'Day +4', date: 'Aug 23', ndvi: 0.22, soilMoisture: 15, riskScore: 98, projectedUntreated: 98, projectedTreated: 42 },
  { day: 'Day +7', date: 'Aug 26', ndvi: 0.16, soilMoisture: 12, riskScore: 99, projectedUntreated: 99, projectedTreated: 20 },
];
