import { 
  FieldZone, 
  SensorTelemetry, 
  LeafSample, 
  FusionResult,
  FertilizerRecommendation,
  PestControlRecommendation,
  ProductivityStep
} from '../types/groot';
import { CropVariety } from '../types/crops';
import { ALL_CROP_VARIETIES } from './cropDatabase';

export function calculateFusion(
  zone: FieldZone,
  telemetry: SensorTelemetry,
  leaf: LeafSample,
  variety: CropVariety = ALL_CROP_VARIETIES[0]
): FusionResult {
  // 1. Spectral Subscore (0 to 100): High NDVI is good
  const spectralHealth = Math.min(100, Math.max(0, zone.ndvi * 100));
  const spectralRisk = 100 - spectralHealth;

  // 2. Sensor Subscore (0 to 100) calibrated against crop moisture requirements
  let sensorRisk = 0;
  const isHighWaterCrop = variety.waterRequirement === 'High' || variety.waterRequirement === 'Standing Water / Flooded';
  const minMoistureTarget = isHighWaterCrop ? 45 : 30;
  const maxMoistureTarget = isHighWaterCrop ? 85 : 70;

  if (telemetry.soilMoisture < minMoistureTarget) {
    sensorRisk = Math.min(100, (minMoistureTarget - telemetry.soilMoisture) * 3.2 + 35);
  } else if (telemetry.soilMoisture > maxMoistureTarget) {
    sensorRisk = Math.min(80, (telemetry.soilMoisture - maxMoistureTarget) * 3.5);
  } else {
    sensorRisk = 8;
  }

  if (telemetry.ambientTemp > 35) {
    sensorRisk = Math.min(100, sensorRisk + 12);
  }
  const sensorHealth = 100 - sensorRisk;

  // 3. RGB Leaf Diagnostic Subscore (0 to 100)
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
      name: 'Satellite Field Scan (NDVI/NDMI)',
      weight: 35,
      impact: zone.ndvi < 0.5 ? 'Crop canopy thinning & stress' : 'Healthy green canopy reflectance',
      percentage: Math.min(100, Math.max(15, spectralWeight)),
      color: '#06b6d4',
    },
    {
      name: 'Soil Moisture & Sensor Mesh',
      weight: 35,
      impact: telemetry.soilMoisture < minMoistureTarget ? `Water deficit (${telemetry.soilMoisture.toFixed(0)}% vs optimal ${minMoistureTarget}%)` : 'Soil moisture well balanced',
      percentage: Math.min(100, Math.max(15, sensorWeight)),
      color: '#f59e0b',
    },
    {
      name: 'Leaf Photo AI Inspection',
      weight: 30,
      impact: leaf.id === 'blast' ? 'Foliar fungal pathogen detected' : leaf.id === 'healthy' ? 'Zero leaf symptoms found' : 'Pathology markers identified',
      percentage: Math.min(100, Math.max(10, rgbWeight)),
      color: '#ef4444',
    },
  ];

  // --- Dynamic Fertilizer & Nutrient Recommendations tailored to Crop Variety ---
  const fertilizers: FertilizerRecommendation[] = [];
  const targetN = variety.optimalNpkPerAcre.nitrogenKg;
  const targetP = variety.optimalNpkPerAcre.phosphorusKg;
  const targetK = variety.optimalNpkPerAcre.potassiumKg;

  // 1. Nitrogen Recommendation
  if (telemetry.npk.nitrogen < targetN * 0.8) {
    const ureaQty = Math.round(targetN * 1.1);
    fertilizers.push({
      name: `Neem Coated Urea (46% N) for ${variety.varietyName}`,
      hindiName: `नीम लेपित यूरिया (${variety.varietyHindi})`,
      dosage: `${ureaQty} kg / Acre (Split application)`,
      applicationTiming: 'Apply in 2 split doses: 1st after initial weeding, 2nd at active tillering.',
      hindiTiming: 'दो बार में दें: पहली निराई-गुड़ाई के बाद और दूसरी कल्ले फूटते समय सुबह।',
      reasoning: `Soil nitrogen (${telemetry.npk.nitrogen} mg/kg) is below target ${targetN} kg for ${variety.varietyName}.`,
      hindiReasoning: `मिट्टी में नाइट्रोजन कम है। ${variety.varietyHindi} के हरे पत्तों और बढ़वार के लिए जरूरी है।`,
    });
  }

  // 2. Phosphorus Recommendation
  if (telemetry.npk.phosphorus < targetP * 0.8) {
    const dapQty = Math.round(targetP * 1.25);
    fertilizers.push({
      name: 'DAP (Di-Ammonium Phosphate 18:46:0)',
      hindiName: 'डीएपी खाद (जड़ों के विकास हेतु)',
      dosage: `${dapQty} kg / Acre (Basal Root application)`,
      applicationTiming: 'Mix directly into root zone during field preparation or early seedling phase.',
      hindiTiming: 'बुवाई या रोपाई के समय जड़ों के पास मिट्टी में अच्छी तरह मिलाएं।',
      reasoning: `Promotes deep root proliferation and sturdy root anchorage for ${variety.varietyName}.`,
      hindiReasoning: `मजबूत जड़ों और अधिक कल्लों के लिए आवश्यक।`,
    });
  }

  // 3. Potassium Recommendation
  if (telemetry.npk.potassium < targetK * 0.8 || fusedRisk > 40) {
    const mopQty = Math.round(targetK * 1.1);
    fertilizers.push({
      name: 'MOP (Muriate of Potash - 60% K2O)',
      hindiName: 'एमओपी पोटाश खाद',
      dosage: `${mopQty} kg / Acre + Foliar Potash Spray`,
      applicationTiming: 'Apply during grain/pod filling stage or at first symptom of disease.',
      hindiTiming: 'बालियां या फलियां बनते समय डालें, ताकि दाना मोटा और चमकदार बने।',
      reasoning: 'Boosts natural crop disease immunity, prevents lodging, and improves grain test weight.',
      hindiReasoning: 'फसल को रोग और सूखे से लड़ने की ताकत देता है और दाने में वजन बढ़ाता है।',
    });
  }

  // 4. Zinc / Micronutrient Recommendation
  if (variety.optimalNpkPerAcre.zincKg || telemetry.soilPh > 7.4) {
    const zincQty = variety.optimalNpkPerAcre.zincKg || 10;
    fertilizers.push({
      name: 'Zinc Sulphate (21% Chelated)',
      hindiName: 'जिंक सल्फेट (21% सूक्ष्म पोषक तत्व)',
      dosage: `${zincQty} kg / Acre`,
      applicationTiming: 'Broadcast with compost during early vegetative growth.',
      hindiTiming: 'गोबर की खाद के साथ मिलाकर खेत में छिड़कें।',
      reasoning: `Prevents yellowing and micro-nutrient deficiency in ${variety.cropName}.`,
      hindiReasoning: `पत्तियों में पीलापन रोकता है और पौधों को हरा-भरा रखता है।`,
    });
  }

  if (fertilizers.length === 0) {
    fertilizers.push({
      name: 'Organic Bio-NPK Liquid Consortium',
      hindiName: 'जैविक एनपीके तरल खाद',
      dosage: '500 ml / Acre (Foliar spray)',
      applicationTiming: 'Every 21 days during active vegetative growth.',
      hindiTiming: 'हर 21 दिन में पानी में घोलकर छिड़कें।',
      reasoning: 'Maintenance dose to sustain beneficial soil microbes and yield quality.',
      hindiReasoning: 'मिट्टी की उर्वरता और अच्छी पैदावार बनाए रखने के लिए।',
    });
  }

  // --- Dynamic Pest & Disease Recommendations ---
  const pestControl: PestControlRecommendation[] = [];

  if (leaf.id === 'blast' || leaf.symptomSeverity > 50) {
    pestControl.push({
      pestName: `${variety.cropName} Fungal Blast & Leaf Spot`,
      hindiPestName: `${variety.cropHindi} का झुलसा/ब्लास्ट रोग`,
      chemicalRemedy: 'Tricyclazole 75% WP @ 0.6g per liter of water (Spray early morning before 8 AM)',
      bioRemedy: 'Pseudomonas fluorescens @ 10g/L + Neem Oil 10,000 ppm @ 3ml/L',
      hindiRemedy: 'ट्राइसाइक्लाजोल (0.6 ग्राम प्रति लीटर पानी) या नीम का तेल (3 मिली/लीटर) सुबह 8 बजे से पहले छिड़कें।',
      urgency: 'Immediate',
    });
  }

  if (telemetry.humidity > 70 || leaf.id === 'brown_spot') {
    pestControl.push({
      pestName: `${variety.cropName} Sucking Pests & Blight`,
      hindiPestName: `${variety.cropHindi} के रस चूसक कीट व धब्बा रोग`,
      chemicalRemedy: 'Mancozeb 75% WP @ 2g/L or Imidacloprid 17.8% SL @ 0.5ml/L',
      bioRemedy: 'Azadirachtin (Neem extract 5ml/L) + Yellow Sticky Traps @ 10 per acre',
      hindiRemedy: 'मैंकोजेब फफूंदनाशक या नीम तेल (5 मिली/लीटर) छिड़कें और पीले चिपचिपे कार्ड लगाएं।',
      urgency: 'High',
    });
  }

  if (pestControl.length === 0) {
    pestControl.push({
      pestName: `${variety.cropName} Pest Prevention Protocol`,
      hindiPestName: `${variety.cropHindi} सामान्य कीट सुरक्षा`,
      chemicalRemedy: 'No chemical spray needed right now. Keep field clean.',
      bioRemedy: 'Install Pheromone traps @ 5 per acre for pest monitoring.',
      hindiRemedy: 'अभी किसी रासायनिक दवा की जरूरत नहीं है। खेत की मेड़ें साफ रखें।',
      urgency: 'Low',
    });
  }

  // --- Productivity Steps (How to increase yield) ---
  const productivitySteps: ProductivityStep[] = [
    {
      stepNumber: 1,
      title: `Precision Irrigation for ${variety.varietyName}`,
      hindiTitle: `${variety.varietyHindi} के लिए सही सिंचाई`,
      details: telemetry.soilMoisture < minMoistureTarget 
        ? `Immediate irrigation required for ${zone.id}. Maintain optimal moisture of ${minMoistureTarget}% to support active tillering.` 
        : `Moisture is healthy at ${telemetry.soilMoisture.toFixed(0)}%. Avoid water stagnation.`,
      hindiDetails: telemetry.soilMoisture < minMoistureTarget 
        ? `तुरंत हल्की सिंचाई करें। खेत में नमी कम से कम ${minMoistureTarget} प्रतिशत बनाए रखें।` 
        : `खेत में नमी ${telemetry.soilMoisture.toFixed(0)} प्रतिशत बिल्कुल सही है। पानी भरने न दें।`,
      impactScore: '+15% Yield',
    },
    {
      stepNumber: 2,
      title: 'Timely N-P-K Split Application',
      hindiTitle: 'खाद को 2-3 किस्तों में बांटकर दें',
      details: `Apply basal DAP at planting, top-dress Urea at 25 days, and finish Potash at panicle/grain stage.`,
      hindiDetails: 'डीएपी बुवाई के समय, यूरिया 25 दिन पर और पोटाश बालियां या फलियां आते समय दें।',
      impactScore: '+20% Growth',
    },
    {
      stepNumber: 3,
      title: 'Foliar Micronutrient & Potash Boost',
      hindiTitle: 'पोटेशियम और सूक्ष्म पोषक तत्व स्प्रे',
      details: 'Spray Zinc and 1% Potash solution to strengthen stalks and increase grain filling.',
      hindiDetails: 'जिंक और पोटाश का हल्का छिड़काव करें ताकि दाना भरपूर और चमकदार बने।',
      impactScore: '-60% Loss',
    },
    {
      stepNumber: 4,
      title: 'Early Pest Scouting & Bio-Protection',
      hindiTitle: 'सुबह के समय रोग की निगरानी',
      details: 'Inspect leaf underside early morning. Use bio-fungicides proactively.',
      hindiDetails: 'सुबह के समय पत्तियों की जांच करें और समय पर जैविक दवा छिड़कें।',
      impactScore: '+10% Health',
    },
  ];

  // --- Generate SIMPLIFIED, JARGON-FREE Devanagari Hindi Voice Summary ---
  let hindiVoiceSummary = `नमस्ते किसान भाई! आपकी ${variety.varietyHindi} फसल (ज़ोन ${zone.id}) की जांच हो गई है। `;

  if (fusedRisk >= 75) {
    hindiVoiceSummary += `खेत में फंगल बीमारी के लक्षण हैं और नमी ${telemetry.soilMoisture.toFixed(0)} प्रतिशत कम है। तुरंत हल्की सिंचाई करें और सुबह 8 बजे से पहले फफूंदनाशक दवा का छिड़काव करें। प्रति एकड़ 45 किलो नीम कोटेड यूरिया डालें। `;
  } else if (fusedRisk >= 40) {
    hindiVoiceSummary += `फसल में हल्की पोषक तत्वों की कमी और नमी का उतार-चढ़ाव है। पैदावार बढ़ाने के लिए प्रति एकड़ 30 किलो डीएपी खाद डालें और हल्की सिंचाई करें। `;
  } else {
    hindiVoiceSummary += `बधाई हो! आपकी फसल बिल्कुल हरी-भरी और स्वस्थ है। नमी और खाद का स्तर बहुत अच्छा है। 20 दिनों में हल्का नीम तेल स्प्रे जारी रखें। `;
  }

  hindiVoiceSummary += `धन्यवाद!`;

  // --- Generate SIMPLIFIED, JARGON-FREE Natural English Voice Summary ---
  let englishVoiceSummary = `Hello farmer! Assessment for your ${variety.varietyName} crop in Zone ${zone.id} is ready. `;

  if (fusedRisk >= 75) {
    englishVoiceSummary += `Warning: Fungal leaf symptoms and moisture deficit at ${telemetry.soilMoisture.toFixed(0)} percent detected. Please irrigate lightly today and spray the recommended antifungal remedy early morning. Apply 45 kg Neem Coated Urea per acre. `;
  } else if (fusedRisk >= 40) {
    englishVoiceSummary += `Moderate stress noticed: Nitrogen level is low. Apply 30 kg DAP and maintain regular soil moisture for strong tillers. `;
  } else {
    englishVoiceSummary += `Great news! Your crop is healthy and growing well. Soil moisture and nutrients are well balanced. Continue routine bio-spray every 20 days. `;
  }

  englishVoiceSummary += `Thank you!`;

  // Action Plan Prescription
  let actionPlan: FusionResult['actionPlan'] = {
    priority: 'Low',
    title: `Routine Care for ${variety.varietyName}`,
    dosage: 'Standard NPK schedule',
    windowHours: 120,
    instructions: [
      `Maintain clean field borders and optimal soil moisture for ${variety.varietyName}.`,
      'Next automated scan scheduled in 48 hours.',
      'No chemical spray intervention required at this stage.',
    ],
  };

  if (fusedRisk >= 75) {
    actionPlan = {
      priority: 'Immediate',
      title: `Antifungal Spray & Irrigation for ${variety.varietyName}`,
      dosage: 'Tricyclazole 75% WP @ 0.6g/L + Light Irrigation',
      windowHours: 24,
      instructions: [
        `Urgent: Spray antifungal medicine before 8:00 AM for maximum absorption on ${variety.varietyName}.`,
        `Irrigate to raise soil moisture to at least ${minMoistureTarget}% within 24 hours.`,
        'Apply split top-dressing of 45 kg Neem Coated Urea after irrigation.',
        'Re-check leaves after 3 days to verify disease stop.',
      ],
    };
  } else if (fusedRisk >= 50) {
    actionPlan = {
      priority: 'High',
      title: `Nutrient Boost & Moisture Management for ${variety.varietyName}`,
      dosage: 'Potash 20 kg + Micronutrient foliar spray',
      windowHours: 48,
      instructions: [
        'Apply irrigation to relieve moisture stress.',
        'Apply balanced potassium to reinforce plant stalks.',
        'Scout 5 spots across the field for any pest activity.',
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
    englishVoiceSummary,
  };
}
