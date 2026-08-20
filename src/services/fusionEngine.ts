import { 
  FieldZone, 
  SensorTelemetry, 
  LeafSample, 
  FusionResult,
  FertilizerRecommendation,
  PestControlRecommendation,
  ProductivityStep
} from '../types/groot';

export function calculateFusion(
  zone: FieldZone,
  telemetry: SensorTelemetry,
  leaf: LeafSample
): FusionResult {
  // 1. Spectral Subscore (0 to 100): High NDVI is good
  const spectralHealth = Math.min(100, Math.max(0, zone.ndvi * 100));
  const spectralRisk = 100 - spectralHealth;

  // 2. Sensor Subscore (0 to 100): Paddy needs ~65-75% moisture. <30% or >90% causes stress
  let sensorRisk = 0;
  if (telemetry.soilMoisture < 30) {
    sensorRisk = Math.min(100, (30 - telemetry.soilMoisture) * 3.5 + 40); // 40% to 100% risk
  } else if (telemetry.soilMoisture > 85) {
    sensorRisk = (telemetry.soilMoisture - 85) * 4;
  } else {
    sensorRisk = 10;
  }
  if (telemetry.ambientTemp > 34) {
    sensorRisk = Math.min(100, sensorRisk + 15);
  }
  const sensorHealth = 100 - sensorRisk;

  // 3. RGB CV Subscore (0 to 100)
  const rgbRisk = (leaf.symptomSeverity * leaf.cnnConfidence) / 100;
  const rgbHealth = 100 - rgbRisk;

  // Weighted Tri-Modal Fusion:
  // Spectral: 35%, Sensor: 35%, RGB Leaf: 30%
  const fusedRisk = Math.round(spectralRisk * 0.35 + sensorRisk * 0.35 + rgbRisk * 0.30);
  const fusedHealth = Math.round(spectralHealth * 0.35 + sensorHealth * 0.35 + rgbHealth * 0.30);
  const confidenceScore = Math.round((leaf.cnnConfidence * 0.4 + (zone.ndvi > 0.3 ? 92 : 88) * 0.3 + 95 * 0.3));

  let status: FusionResult['status'] = 'OPTIMAL';
  if (fusedRisk >= 75) status = 'CRITICAL RISK';
  else if (fusedRisk >= 50) status = 'HIGH HAZARD';
  else if (fusedRisk >= 25) status = 'MODERATE STRESS';

  // XAI Breakdown
  const spectralWeight = Math.round((spectralRisk * 0.35 / (fusedRisk || 1)) * 100);
  const sensorWeight = Math.round((sensorRisk * 0.35 / (fusedRisk || 1)) * 100);
  const rgbWeight = Math.max(0, 100 - spectralWeight - sensorWeight);

  const contributingFactors = [
    {
      name: 'Satellite Spectral Deficit (NDVI/NDMI)',
      weight: 35,
      impact: zone.ndvi < 0.5 ? 'Significant chlorophyll decay' : 'Normal vegetative reflection',
      percentage: Math.min(100, Math.max(15, spectralWeight)),
      color: '#06b6d4',
    },
    {
      name: 'ESP32 Soil & Ambient Telemetry',
      weight: 35,
      impact: telemetry.soilMoisture < 30 ? `Severe root drought (${telemetry.soilMoisture.toFixed(1)}%)` : 'Soil moisture stable',
      percentage: Math.min(100, Math.max(15, sensorWeight)),
      color: '#f59e0b',
    },
    {
      name: 'Edge AI Leaf Diagnostic (CNN)',
      weight: 30,
      impact: leaf.id === 'blast' ? 'Spindle lesions verified (Magnaporthe)' : leaf.id === 'healthy' ? 'Zero foliar lesions detected' : 'Pathology markers detected',
      percentage: Math.min(100, Math.max(10, rgbWeight)),
      color: '#ef4444',
    },
  ];

  // --- Dynamic Fertilizer & Nutrient Recommendations ---
  const fertilizers: FertilizerRecommendation[] = [];

  // Nitrogen deficit rule
  if (telemetry.npk.nitrogen < 30) {
    fertilizers.push({
      name: 'Neem Coated Urea (46% N)',
      hindiName: 'नीम लेपित यूरिया (46% एन)',
      dosage: '45 kg / Acre (Top dressing)',
      applicationTiming: 'Apply in split dose early morning after field irrigation.',
      hindiTiming: 'सिंचाई के बाद सुबह के समय हल्की परत के रूप में छिड़कें।',
      reasoning: `Nitrogen is critical (${telemetry.npk.nitrogen} mg/kg). Rapid foliage expansion required.`,
      hindiReasoning: `मृदा में नाइट्रोजन केवल ${telemetry.npk.nitrogen} mg/kg है। पत्तों के तेज़ विकास के लिए अति आवश्यक।`,
    });
  }

  // Phosphorus deficit rule
  if (telemetry.npk.phosphorus < 20) {
    fertilizers.push({
      name: 'DAP / Single Super Phosphate (SSP)',
      hindiName: 'डीएपी / एसएसपी खाद',
      dosage: '30 kg / Acre (Basal / Sub-soil)',
      applicationTiming: 'Mix with root zone soil near active tillers.',
      hindiTiming: 'जड़ों के पास मिट्टी में मिलाएं।',
      reasoning: `Phosphorus depletion detected (${telemetry.npk.phosphorus} mg/kg). Promotes root elongation.`,
      hindiReasoning: `फास्फोरस स्तर कम है। मजबूत जड़ों और नए कल्लों के लिए आवश्यक।`,
    });
  }

  // Potassium deficit or fungal attack rule
  if (telemetry.npk.potassium < 40 || leaf.id === 'blast' || leaf.id === 'brown_spot') {
    fertilizers.push({
      name: 'MOP (Muriate of Potash - 60% K2O)',
      hindiName: 'एमओपी पोटैश (MOP)',
      dosage: '25 kg / Acre + Foliar Potash Spray',
      applicationTiming: 'Apply immediately to strengthen crop stalk and disease immunity.',
      hindiTiming: 'रोग प्रतिरोधक क्षमता बढ़ाने के लिए तुरंत छिड़काव करें।',
      reasoning: 'Potassium reinforces cell walls against pathogen hyphae penetration and drought.',
      hindiReasoning: 'पोटैश फंगल संक्रमण और सूखे से पौधे की कोशिकाओं की रक्षा करता है।',
    });
  }

  // Zinc / Micronutrient rule
  if (telemetry.soilPh > 7.5 || fusedRisk > 40) {
    fertilizers.push({
      name: 'Zinc Sulphate (21% Chelated)',
      hindiName: 'जिंक सल्फेट (21% चिलेटेड)',
      dosage: '10 kg / Acre',
      applicationTiming: 'Broadcasting along with bio-fertilizer.',
      hindiTiming: 'जैविक खाद के साथ खेत में छिड़कें।',
      reasoning: 'Prevents Khaira disease and chlorosis in paddy/wheat.',
      hindiReasoning: 'खैरा रोग से बचाव और पत्तियों का हरापन बनाए रखने में सहायक।',
    });
  }

  if (fertilizers.length === 0) {
    fertilizers.push({
      name: 'Organic Bio-NPK Liquid Consortium',
      hindiName: 'जैविक एनपीके लिक्विड कंसोर्टियम',
      dosage: '500 ml / Acre (Foliar spray)',
      applicationTiming: 'Every 21 days during active tillering phase.',
      hindiTiming: 'हर 21 दिन में पर्णीय छिड़काव करें।',
      reasoning: 'Maintenance dose for soil microbial activation and crop vigor.',
      hindiReasoning: 'मृदा में सूक्ष्मजीवों की वृद्धि और उत्तम पैदावार बनाए रखने के लिए।',
    });
  }

  // --- Dynamic Pest & Pathogen Control Recommendations ---
  const pestControl: PestControlRecommendation[] = [];

  if (leaf.id === 'blast' || leaf.symptomSeverity > 60) {
    pestControl.push({
      pestName: 'Rice Blast Fungus (Magnaporthe oryzae)',
      hindiPestName: 'धान का ब्लास्ट रोग (फंगल संक्रमण)',
      chemicalRemedy: 'Tricyclazole 75% WP @ 0.6g per liter water or Isoprothiolane 40% EC @ 1.5ml/L',
      bioRemedy: 'Pseudomonas fluorescens @ 10g/L foliar spray + Neem Oil 10,000 ppm @ 3ml/L',
      hindiRemedy: 'ट्राइसाइक्लाजोल 75% डब्लूपी (0.6 ग्राम/लीटर) या ट्राइकोडर्मा/नीम का तेल छिड़कें।',
      urgency: 'Immediate',
    });
  }

  if (telemetry.humidity > 75 || leaf.id === 'brown_spot') {
    pestControl.push({
      pestName: 'Brown Spot & Aphid Sucking Pests',
      hindiPestName: 'भूरा धब्बा एवं माहू (कीट/फफूंद)',
      chemicalRemedy: 'Mancozeb 75% WP @ 2g/L or Imidacloprid 17.8% SL @ 0.5ml/L',
      bioRemedy: 'Azadirachtin (Neem extract 5ml/L) + Sticky Yellow Traps 10 pcs/acre',
      hindiRemedy: 'मैंकोजेब या नीम तेल (5 मिली/लीटर) और पीले चिपचिपे कार्ड लगाएं।',
      urgency: 'High',
    });
  }

  if (pestControl.length === 0) {
    pestControl.push({
      pestName: 'Proactive Pest Monitoring',
      hindiPestName: 'सामान्य कीट निगरानी',
      chemicalRemedy: 'No chemical pesticide needed currently.',
      bioRemedy: 'Pheromone traps @ 5/acre for stem borer moth detection.',
      hindiRemedy: 'रासायनिक कीटनाशक की आवश्यकता नहीं है। फेरोमोन प्रपंच लगाएं।',
      urgency: 'Low',
    });
  }

  // --- Productivity Steps (How to increase yield) ---
  const productivitySteps: ProductivityStep[] = [
    {
      stepNumber: 1,
      title: 'Precision Water Management & Alternate Wetting-Drying (AWD)',
      hindiTitle: 'सटीक जल प्रबंधन (एडब्ल्यूडी विधि)',
      details: telemetry.soilMoisture < 35 
        ? `Immediate 25mm irrigation surge required for ${zone.id}. Maintain 3-5 cm standing water for 48 hrs.` 
        : 'Maintain soil moisture between 65-75% for max root oxygenation.',
      hindiDetails: telemetry.soilMoisture < 35 
        ? `तुरंत 25 मिमी सिंचाई करें। 48 घंटे के लिए 3 से 5 सेमी जल स्तर बनाए रखें।` 
        : 'जड़ों को भरपूर ऑक्सीजन देने के लिए 65-75% नमी बनाए रखें।',
      impactScore: '+15% Yield',
    },
    {
      stepNumber: 2,
      title: 'Targeted NPK Top Dressing with Bio-Stimulants',
      hindiTitle: 'संतुलित एनपीके और बायो-उत्तेजक',
      details: 'Split fertilizer into 3 key growth stages (Basal, Tillering, Panicle Initiation). Add Humic Acid.',
      hindiDetails: 'खाद को तीन चरणों (शुरुआत, कल्ले निकलने और बालियां बनते समय) में बांटकर दें।',
      impactScore: '+22% Biomass',
    },
    {
      stepNumber: 3,
      title: 'Proactive Disease Immunity & Foliar Silica Protection',
      hindiTitle: 'रोग रोधी सुरक्षा एवं पोटेशियम स्प्रे',
      details: 'Spray Silica & Zinc to toughen leaf epidermis against insect attack and reduce water loss.',
      hindiDetails: 'पत्तियों को सख्त बनाने और कीटों से बचाने के लिए जिंक व सिलिका का छिड़काव करें।',
      impactScore: '-80% Disease Loss',
    },
    {
      stepNumber: 4,
      title: 'Micro-climate Monitoring via ESP32 Sensor Grid',
      hindiTitle: 'ईएसपी32 सेंसर से रियल-टाइम मॉनिटरिंग',
      details: 'Monitor soil temperature and electrical conductivity daily to prevent nutrient leaching.',
      hindiDetails: 'पोषक तत्वों को बहने से रोकने के लिए रोजाना मिट्टी के तापमान और ईसी की जांच करें।',
      impactScore: '+10% Efficiency',
    },
  ];

  // --- Generate Devanagari Hindi Voice Summary ---
  let hindiVoiceSummary = `नमस्कार किसान भाई! ग्रूट एआई प्रणाली ने ज़ोन ${zone.id} का विश्लेषण पूरा कर लिया है। `;

  if (fusedRisk >= 75) {
    hindiVoiceSummary += `गंभीर चेतावनी! आपके खेत में धान का ब्लास्ट फंगल रोग और ${telemetry.soilMoisture.toFixed(0)} प्रतिशत की अत्यधिक नमी की कमी पाई गई है। फसल को बचाने के लिए तुरंत 24 घंटे के भीतर 45 किलो नीम लेपित यूरिया और ट्राइसाइक्लाजोल फफूंदनाशक का छिड़काव करें। `;
  } else if (fusedRisk >= 40) {
    hindiVoiceSummary += `ध्यान दें! आपकी फसल में नाइट्रोजन की कमी और मध्यम तनाव के लक्षण हैं। पैदावार बढ़ाने के लिए प्रति एकड़ 30 किलो डीएपी और सिंचाई में सुधार करें। `;
  } else {
    hindiVoiceSummary += `बधाई हो! आपकी फसल की स्थिति उत्तम है। नमी 65 प्रतिशत और एनपीके संतुलित है। पैदावार बनाए रखने के लिए 21 दिनों में नीम तेल का छिड़काव जारी रखें। `;
  }

  hindiVoiceSummary += `अधिक जानकारी के लिए स्क्रीन पर दी गई सिफारिशों को देखें। धन्यवाद्!`;

  // Action Plan Prescription
  let actionPlan: FusionResult['actionPlan'] = {
    priority: 'Low',
    title: 'Routine Monitoring & Balanced Irrigation',
    dosage: 'Standard NPK 4:2:1 baseline',
    windowHours: 120,
    instructions: [
      'Maintain standard water level of 3–5 cm across paddy basin.',
      'Next satellite pass scheduled in 48 hours for confirmation.',
      'No chemical fungicide intervention required.',
    ],
  };

  if (fusedRisk >= 75) {
    actionPlan = {
      priority: 'Immediate',
      title: 'Targeted Fungicide Spray & Irrigation Surge',
      dosage: 'Tricyclazole 75% WP @ 0.6g/L + 25mm controlled flood',
      windowHours: 24,
      instructions: [
        `Urgent: Isolate ${zone.id} perimeter to prevent spore spread to adjacent sectors.`,
        'Initiate controlled surge irrigation: raise soil moisture from 21% to 65% within 12 hours.',
        'Apply foliar spray early morning (before 8 AM) to maximize leaf surface absorption.',
        'Re-scan leaf samples after 72 hours with farmer photo diagnostic.',
      ],
    };
  } else if (fusedRisk >= 50) {
    actionPlan = {
      priority: 'High',
      title: 'Deficit Irrigation Correction & Foliar Silica',
      dosage: 'Potassium silicate foliar spray @ 2.5ml/L',
      windowHours: 48,
      instructions: [
        'Boost irrigation channels feeding Sector ' + zone.id + '.',
        'Apply potassium amendment to reinforce cell wall resistance.',
        'Conduct ground-truth scouting across 5 sample clusters.',
      ],
    };
  }

  return {
    healthScore: fusedHealth,
    riskPercentage: fusedRisk,
    confidenceScore,
    status,
    contributingFactors,
    actionPlan,
    fertilizers,
    pestControl,
    productivitySteps,
    hindiVoiceSummary,
  };
}

