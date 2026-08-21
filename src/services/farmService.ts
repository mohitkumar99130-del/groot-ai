import { FarmPlot, FarmerProfile } from '../types/groot';


export const DEFAULT_FARMER_PROFILE: FarmerProfile = {
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  village: 'Nilokheri',
  district: 'Karnal',
  state: 'Haryana',
  country: 'India',
  totalLandAcres: 18.5,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
};

export const INITIAL_FARMS: FarmPlot[] = [
  {
    id: 'farm_karnal_08',
    name: 'Karnal Green Horizon Farm',
    crop: 'Wheat (HD-2967)',
    varietyId: 'wheat_hd2967',
    areaHa: 7.5,
    season: 'Rabi 2026',
    plantingDate: '12 Nov 2025',
    healthAverage: 86,
    latitude: 29.6857,
    longitude: 76.9905,
    locationName: 'Nilokheri, Karnal, Haryana',
    fields: [
      {
        id: 'field_north_wheat',
        name: 'North Wheat Field',
        cropName: 'Wheat / गेहूँ',
        varietyName: 'HD-2967 (Pusa Yashasvi)',
        areaAcres: 8.5,
        sowingDate: '12 Nov 2025',
        sowingDaysAgo: 42,
        healthStatus: 'good',
        healthScore: 88,
        soilMoisture: 58,
        coordinates: [
          { lat: 29.6872, lng: 76.9890 },
          { lat: 29.6885, lng: 76.9920 },
          { lat: 29.6865, lng: 76.9935 },
          { lat: 29.6850, lng: 76.9905 },
        ],
        center: { lat: 29.6868, lng: 76.9912 },
      },
      {
        id: 'field_east_basmati',
        name: 'East Basmati Field',
        cropName: 'Paddy / धान',
        varietyName: 'Basmati 1121 (Pusa Basmati)',
        areaAcres: 6.2,
        sowingDate: '28 Oct 2025',
        sowingDaysAgo: 55,
        healthStatus: 'attention',
        healthScore: 72,
        soilMoisture: 44,
        coordinates: [
          { lat: 29.6845, lng: 76.9915 },
          { lat: 29.6860, lng: 76.9945 },
          { lat: 29.6835, lng: 76.9960 },
          { lat: 29.6820, lng: 76.9930 },
        ],
        center: { lat: 29.6840, lng: 76.9938 },
      },
      {
        id: 'field_south_mustard',
        name: 'South Mustard Plot',
        cropName: 'Mustard / सरसों',
        varietyName: 'Pusa Bold (Black Mustard)',
        areaAcres: 3.8,
        sowingDate: '20 Nov 2025',
        sowingDaysAgo: 32,
        healthStatus: 'good',
        healthScore: 91,
        soilMoisture: 62,
        coordinates: [
          { lat: 29.6815, lng: 76.9880 },
          { lat: 29.6830, lng: 76.9910 },
          { lat: 29.6805, lng: 76.9925 },
          { lat: 29.6790, lng: 76.9895 },
        ],
        center: { lat: 29.6810, lng: 76.9902 },
      },
    ],
  },
  {
    id: 'farm_cuttack_04',
    name: 'Mahanadi River Basin Parcel',
    crop: 'Paddy / Rice (Kani Chawal PR-126)',
    varietyId: 'rice_pr126',
    areaHa: 10.0,
    season: 'Kharif 2026',
    plantingDate: '15 July 2026',
    healthAverage: 74,
    latitude: 20.4625,
    longitude: 85.8828,
    locationName: 'Banki, Cuttack, Odisha',
    fields: [
      {
        id: 'field_kani_basin',
        name: 'Kani Chawal River Block',
        cropName: 'Paddy / धान',
        varietyName: 'Kani Chawal (PR-126 High Yield)',
        areaAcres: 12.0,
        sowingDate: '15 July 2026',
        sowingDaysAgo: 60,
        healthStatus: 'attention',
        healthScore: 71,
        soilMoisture: 48,
        coordinates: [
          { lat: 20.4640, lng: 85.8810 },
          { lat: 20.4655, lng: 85.8845 },
          { lat: 20.4630, lng: 85.8860 },
          { lat: 20.4615, lng: 85.8825 },
        ],
        center: { lat: 20.4635, lng: 85.8835 },
      },
      {
        id: 'field_ir64_terrace',
        name: 'IR-64 Medium Grain Field',
        cropName: 'Paddy / धान',
        varietyName: 'IR-64 Short Duration',
        areaAcres: 13.0,
        sowingDate: '20 July 2026',
        sowingDaysAgo: 45,
        healthStatus: 'good',
        healthScore: 84,
        soilMoisture: 72,
        coordinates: [
          { lat: 20.4600, lng: 85.8830 },
          { lat: 20.4615, lng: 85.8865 },
          { lat: 20.4590, lng: 85.8880 },
          { lat: 20.4575, lng: 85.8845 },
        ],
        center: { lat: 20.4595, lng: 85.8855 },
      },
    ],
  },
  {
    id: 'farm_sehore_12',
    name: 'Malwa Canal Agro Farm',
    crop: 'Wheat (Sharbati MP Premium)',
    varietyId: 'wheat_sharbati',
    areaHa: 13.0,
    season: 'Rabi 2026',
    plantingDate: '18 Oct 2026',
    healthAverage: 92,
    latitude: 23.2032,
    longitude: 77.0844,
    locationName: 'Ashta, Sehore, Madhya Pradesh',
    fields: [
      {
        id: 'field_sharbati_top',
        name: 'Sharbati Gold Wheat Field',
        cropName: 'Wheat / गेहूँ',
        varietyName: 'Sharbati MP Gold',
        areaAcres: 18.0,
        sowingDate: '18 Oct 2026',
        sowingDaysAgo: 38,
        healthStatus: 'good',
        healthScore: 94,
        soilMoisture: 66,
        coordinates: [
          { lat: 23.2045, lng: 77.0825 },
          { lat: 23.2060, lng: 77.0860 },
          { lat: 23.2035, lng: 77.0875 },
          { lat: 23.2020, lng: 77.0840 },
        ],
        center: { lat: 23.2040, lng: 77.0850 },
      },
      {
        id: 'field_desi_chana',
        name: 'Desi Chana Pulses Block',
        cropName: 'Chickpea / चना',
        varietyName: 'Desi Chana (JG-11)',
        areaAcres: 14.0,
        sowingDate: '25 Oct 2026',
        sowingDaysAgo: 28,
        healthStatus: 'good',
        healthScore: 89,
        soilMoisture: 54,
        coordinates: [
          { lat: 23.2005, lng: 77.0845 },
          { lat: 23.2020, lng: 77.0880 },
          { lat: 23.1995, lng: 77.0895 },
          { lat: 23.1980, lng: 77.0860 },
        ],
        center: { lat: 23.2000, lng: 77.0870 },
      },
    ],
  },
];

export interface DashboardAlert {
  id: string;
  severity: 'urgent' | 'attention' | 'info';
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  time: string;
  targetTab: 'crop_health' | 'water_irrigation' | 'pest_disease' | 'weather' | 'my_farm';
}

export const INITIAL_ALERTS: DashboardAlert[] = [
  {
    id: 'alert_water_1',
    severity: 'attention',
    titleHi: 'मिट्टी में नमी कम है (Water Needed)',
    titleEn: 'Low soil moisture in East Field',
    descHi: 'पूर्वी खेत में नमी 44% रह गई है। 2 दिन में हल्की सिंचाई करें।',
    descEn: 'Moisture in East field dropped to 44%. Consider light irrigation within 2 days.',
    time: '20 min ago',
    targetTab: 'water_irrigation',
  },
  {
    id: 'alert_weather_2',
    severity: 'info',
    titleHi: 'कल साफ़ धूप का अनुमान (Optimal Weather)',
    titleEn: 'Clear sunny sky tomorrow',
    descHi: 'कल सुबह यूरिया व कीटनाशक छिड़काव के लिए बहुत उत्तम समय रहेगा।',
    descEn: 'Tomorrow morning is optimal for fertilizer top-dressing and spray.',
    time: '1 hour ago',
    targetTab: 'weather',
  },
  {
    id: 'alert_health_3',
    severity: 'urgent',
    titleHi: 'पत्ती में फंगल लक्षण (Pest Check Required)',
    titleEn: 'Foliar anomaly detected in Sector C4',
    descHi: 'धान की पत्ती में हल्के झुलसा रोग के धब्बे दिखे हैं। तुरंत फोटो जांच करें।',
    descEn: 'Leaf blast spot patterns detected in Sector C4. Take a leaf photo to diagnose.',
    time: '3 hours ago',
    targetTab: 'pest_disease',
  },
];

export interface DailyActionItem {
  id: string;
  icon: string;
  titleHi: string;
  titleEn: string;
  actionHi: string;
  actionEn: string;
  targetTab: 'crop_health' | 'water_irrigation' | 'pest_disease' | 'weather' | 'growth_yield';
  isCompleted?: boolean;
}

export const INITIAL_DAILY_ACTIONS: DailyActionItem[] = [
  {
    id: 'action_1',
    icon: '💧',
    titleHi: 'पूर्वी खेत में नमी की जांच करें',
    titleEn: 'Check moisture in East Basmati Field',
    actionHi: 'जमीन की सतह से 2 इंच नीचे नमी परखें',
    actionEn: 'Inspect soil moisture 2 inches below ground',
    targetTab: 'water_irrigation',
  },
  {
    id: 'action_2',
    icon: '🌾',
    titleHi: 'गेहूँ में पहली यूरिया खाद का समय',
    titleEn: 'Time for first Urea dose in North Wheat',
    actionHi: '45 किलो प्रति एकड़ नीम कोटेड यूरिया सुबह डालें',
    actionEn: 'Apply 45 kg/acre Neem Coated Urea in early morning',
    targetTab: 'growth_yield',
  },
  {
    id: 'action_3',
    icon: '📷',
    titleHi: 'पीली पत्तियों की फोटो लेकर जांचें',
    titleEn: 'Take a photo of suspicious leaf spots',
    actionHi: 'कैमरा स्कैनर से 5 सेकंड में बीमारी पहचानें',
    actionEn: 'Identify leaf pathogen in 5 seconds with AI camera',
    targetTab: 'pest_disease',
  },
];
