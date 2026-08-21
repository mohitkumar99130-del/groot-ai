import { CropVariety } from '../types/crops';
import { FarmPlot, FusionResult, RealtimeWeather, SensorTelemetry, FieldZone, LeafSample } from '../types/groot';
import { GLOBAL_CROP_FAMILIES } from '../services/cropDatabase';

export interface AssistantAppContext {
  activePlot?: FarmPlot;
  activeCrop?: CropVariety;
  fusionResult?: FusionResult;
  weather?: RealtimeWeather;
  telemetry?: SensorTelemetry;
  selectedZone?: FieldZone;
  activeLeaf?: LeafSample;
  language?: string;
}

export interface AssistantResponseOutput {
  text: string;
  speechText: string;
  suggestedAction?: {
    type: 'OPEN_FARM_MAP' | 'OPEN_CROP_HEALTH' | 'OPEN_CAMERA' | 'OPEN_CROP_SELECTOR' | 'OPEN_ADD_CROP';
    label: string;
  };
  followupSuggestions: string[];
}

export function generateTemplateResponse(intent: string, context: AssistantAppContext): AssistantResponseOutput {
  const crop = context.activeCrop;
  const plot = context.activePlot;
  const fusion = context.fusionResult;
  const weather = context.weather;
  const telemetry = context.telemetry;

  const cropNameHi = crop?.cropHindi || crop?.cropName || 'फसल';
  const cropNameEn = crop?.cropName || 'Crop';
  const varietyName = crop?.varietyHindi || crop?.varietyName || '';
  const plotName = plot?.name || 'North Field';
  const locationName = plot?.locationName || 'खेत';
  const plotArea = plot?.areaHa ? (plot.areaHa * 2.47).toFixed(1) : '2.3';
  const isAttention = (fusion?.riskPercentage ?? 0) > 40;

  switch (intent) {
    case 'GREETING': {
      return {
        text: `नमस्ते! मैं GROOT हूँ। आज आपकी ${cropNameHi} और खेत का क्या हाल जानना चाहते हैं?`,
        speechText: `नमस्ते! मैं ग्रूट हूँ। आज आपकी ${cropNameHi} की फसल और खेत के बारे में क्या जानना चाहते हैं?`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना चाहिए?', 'आज मौसम कैसा है?']
      };
    }

    case 'ACTIVE_CROP': {
      if (!crop) {
        return {
          text: 'अभी आपने कोई फसल नहीं चुनी है। फसल सूची खोलकर अपनी फसल चुनें।',
          speechText: 'अभी आपने कोई फसल नहीं चुनी है। कृपया फसल चुनें।',
          suggestedAction: { type: 'OPEN_CROP_SELECTOR', label: '🌾 फसल चुनें' },
          followupSuggestions: ['नई फसल कैसे जोड़ूं?', 'GROOT कैसे इस्तेमाल करें?']
        };
      }
      return {
        text: `अभी आपने ${cropNameHi} (${cropNameEn}) चुनी हुई है। ${varietyName ? `इसकी किस्म ${varietyName} है।` : ''} यह ${plotName} पर बोई गई है।`,
        speechText: `अभी आपने ${cropNameHi} की फसल चुनी हुई है। ${varietyName ? `इसकी किस्म ${varietyName} है।` : ''}`,
        suggestedAction: { type: 'OPEN_CROP_SELECTOR', label: '🌾 फसल बदलें' },
        followupSuggestions: ['मेरी फसल कैसी है?', 'मेरी variety क्या है?', 'आज पानी देना चाहिए?']
      };
    }

    case 'LAST_ADDED_CROP': {
      return {
        text: `आपने हाल ही में ${cropNameHi} (${varietyName || 'General'}) फसल जोड़ी है जो ${plotName} में 2.3 एकड़ में है।`,
        speechText: `आपने हाल ही में ${cropNameHi} की फसल जोड़ी है।`,
        suggestedAction: { type: 'OPEN_CROP_SELECTOR', label: '🌾 फसलें देखें' },
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना चाहिए?']
      };
    }

    case 'CROP_VARIETY': {
      if (!crop || !varietyName) {
        return {
          text: `आपकी फसल ${cropNameHi} है, लेकिन अभी कोई विशेष किस्म (variety) दर्ज नहीं है। आप My Crops में जाकर किस्म चुन सकते हैं।`,
          speechText: `आपकी फसल ${cropNameHi} है, किस्म अभी दर्ज नहीं है।`,
          suggestedAction: { type: 'OPEN_CROP_SELECTOR', label: '🌾 किस्म चुनें' },
          followupSuggestions: ['मेरी फसल कैसी है?', 'फसल बदलें']
        };
      }
      return {
        text: `आपकी ${cropNameHi} की किस्म ${varietyName} है। इसकी अनुमानित अवधि ${crop.durationDays} दिन है।`,
        speechText: `आपकी ${cropNameHi} की किस्म ${varietyName} है।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'खाद कितनी डालूं?']
      };
    }

    case 'CROP_CATEGORY': {
      const cat = crop?.category === 'cereal' ? 'अनाज (रबी फसल)' : crop?.category === 'pulse' ? 'दलहन फसल' : 'मुख्य कृषि फसल';
      return {
        text: `${cropNameHi} एक प्रमुख ${cat} है। इसे उचित नमी और संतुलित खाद की आवश्यकता होती है।`,
        speechText: `${cropNameHi} एक प्रमुख ${cat} है।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज मौसम कैसा है?']
      };
    }

    case 'AVAILABLE_CROPS':
    case 'MAJOR_CROPS': {
      const names = GLOBAL_CROP_FAMILIES.slice(0, 5).map(f => f.nameHindi).join(', ');
      return {
        text: `GROOT में सभी मुख्य फसलें उपलब्ध हैं: ${names} और कई अन्य। आप सीधे My Crops में जाकर कोई भी फसल चुन सकते हैं।`,
        speechText: `ग्रूट में गेहूँ, धान, मक्का, सरसों, चना समेत सभी मुख्य फसलें उपलब्ध हैं।`,
        suggestedAction: { type: 'OPEN_CROP_SELECTOR', label: '🌾 फसल सूची देखें' },
        followupSuggestions: ['मेरी फसल कौन सी है?', 'नई फसल कैसे जोड़ूं?']
      };
    }

    case 'CROP_HEALTH': {
      if (isAttention) {
        return {
          text: `आपकी ${cropNameHi} की फसल कुल मिलाकर ठीक है, लेकिन एक हिस्से पर ध्यान देने की जरूरत है। आप चाहें तो मैं वह हिस्सा मैप पर दिखा सकता हूँ।`,
          speechText: `आपकी ${cropNameHi} की फसल कुल मिलाकर ठीक है, लेकिन एक हिस्से पर ध्यान देने की जरूरत है।`,
          suggestedAction: { type: 'OPEN_CROP_HEALTH', label: '❤️ फसल सेहत देखें' },
          followupSuggestions: ['फसल खराब क्यों हो रही है?', 'आज पानी देना चाहिए?', 'मेरा खेत दिखाओ']
        };
      }

      return {
        text: `आपकी ${cropNameHi} की फसल अभी अच्छी लग रही है। फिलहाल कोई बड़ी समस्या नहीं दिख रही।`,
        speechText: `आपकी ${cropNameHi} की फसल अभी अच्छी लग रही है। फिलहाल कोई बड़ी समस्या नहीं दिख रही।`,
        suggestedAction: { type: 'OPEN_CROP_HEALTH', label: '❤️ फसल सेहत देखें' },
        followupSuggestions: ['आज पानी देना चाहिए?', 'आज मौसम कैसा है?', 'आज मुझे क्या करना चाहिए?']
      };
    }

    case 'HEALTH_REASON': {
      return {
        text: `खेत के उत्तरी भाग में मिट्टी की नमी थोड़ी कम है। समय पर हल्की सिंचाई करने से फसल पूरी स्वस्थ हो जाएगी।`,
        speechText: `खेत के एक हिस्से में नमी कम है। समय पर सिंचाई करने से फसल स्वस्थ हो जाएगी।`,
        suggestedAction: { type: 'OPEN_CROP_HEALTH', label: '❤️ हेल्थ रिपोर्ट देखें' },
        followupSuggestions: ['आज पानी देना चाहिए?', 'आज मौसम कैसा है?']
      };
    }

    case 'WATER_STATUS':
    case 'IRRIGATION_HELP': {
      const moisture = telemetry?.soilMoisture ?? 55;
      if (moisture < 35) {
        return {
          text: `मिट्टी की नमी अभी थोड़ी कम (${moisture.toFixed(0)}%) है। कल सुबह 6 से 9 बजे के बीच खेत में हल्की सिंचाई कर लेना अच्छा रहेगा।`,
          speechText: `मिट्टी की नमी थोड़ी कम है। कल सुबह हल्की सिंचाई कर लेना अच्छा रहेगा।`,
          suggestedAction: { type: 'OPEN_CROP_HEALTH', label: '💧 पानी स्थिति देखें' },
          followupSuggestions: ['आज मौसम कैसा है?', 'मेरी फसल कैसी है?']
        };
      }
      return {
        text: `मिट्टी में अभी नमी ${moisture.toFixed(0)}% है जो पर्याप्त है। आज तुरंत पानी देने की जरूरत नहीं है।`,
        speechText: `मिट्टी में अभी नमी ठीक है, आज पानी देने की जरूरत नहीं है।`,
        followupSuggestions: ['आज मौसम कैसा है?', 'मेरी फसल कैसी है?']
      };
    }

    case 'WEATHER':
    case 'TEMPERATURE': {
      const temp = weather?.temperature ?? 28;
      const cond = weather?.conditionHindi ?? 'साफ़ धूप';
      return {
        text: `${locationName} में आज तापमान ${temp}°C है और मौसम ${cond} बना हुआ है।`,
        speechText: `${locationName} में आज तापमान ${temp} डिग्री सेल्सियस है और मौसम ${cond} है।`,
        followupSuggestions: ['बारिश होगी?', 'आज पानी देना चाहिए?', 'मेरी फसल कैसी है?']
      };
    }

    case 'RAIN_CHANCE': {
      const rain = weather?.rainMm ?? 0;
      if (rain > 1) {
        return {
          text: `आज बारिश की संभावना है (${rain} mm बारिश का अनुमान)। इसलिए आज सिंचाई और छिड़काव रोक दें।`,
          speechText: `आज बारिश की संभावना है। इसलिए सिंचाई और छिड़काव रोक दें।`,
          followupSuggestions: ['आज तापमान कितना है?', 'मेरी फसल कैसी है?']
        };
      }
      return {
        text: `आज बारिश की संभावना नहीं है, मौसम साफ़ रहेगा। खेत में काम करने के लिए दिन अनुकूल है।`,
        speechText: `आज बारिश की संभावना नहीं है, मौसम साफ़ रहेगा।`,
        followupSuggestions: ['आज तापमान कितना है?', 'आज पानी देना चाहिए?']
      };
    }

    case 'FARM_LOCATION':
    case 'OPEN_FARM': {
      return {
        text: `आपका खेत ${locationName} में स्थित है। यह रहा आपके खेत का सैटेलाइट नक्शा।`,
        speechText: `आपका खेत ${locationName} में स्थित है। सैटेलाइट नक्शा खोला जा रहा है।`,
        suggestedAction: { type: 'OPEN_FARM_MAP', label: '🗺️ खेत का नक्शा खोलें' },
        followupSuggestions: ['मेरा खेत कितना बड़ा है?', 'मेरी फसल कैसी है?']
      };
    }

    case 'FARM_AREA': {
      return {
        text: `आपके खेत का कुल क्षेत्रफल लगभग ${plotArea} एकड़ (${plot?.areaHa ?? 0.9} हेक्टेयर) है।`,
        speechText: `आपके खेत का क्षेत्रफल लगभग ${plotArea} एकड़ है।`,
        suggestedAction: { type: 'OPEN_FARM_MAP', label: '🗺️ खेत देखें' },
        followupSuggestions: ['मेरा खेत कहाँ है?', 'मेरी फसल कौन सी है?']
      };
    }

    case 'ADD_CROP':
    case 'HOW_TO_ADD_CROP': {
      return {
        text: `नई फसल जोड़ने के लिए My Crops पेज पर "+ फसल जोड़ें" बटन दबाएं और अपनी फसल चुनें।`,
        speechText: `फसल सूची खोली जा रही है जहाँ से आप नई फसल जोड़ सकते हैं।`,
        suggestedAction: { type: 'OPEN_ADD_CROP', label: '🌾 नई फसल जोड़ें' },
        followupSuggestions: ['मेरी फसल कौन सी है?', 'GROOT कैसे इस्तेमाल करें?']
      };
    }

    case 'CHANGE_CROP': {
      return {
        text: `फसल बदलने के लिए नीचे दिया गया बटन दबाएं और अपनी पसंदीदा फसल चुनें।`,
        speechText: `फसल बदलने के लिए स्क्रीन खोली जा रही है।`,
        suggestedAction: { type: 'OPEN_CROP_SELECTOR', label: '🌾 फसल बदलें' },
        followupSuggestions: ['मेरी फसल कौन सी है?', 'मेरी variety क्या है?']
      };
    }

    case 'TAKE_PHOTO':
    case 'DISEASE_STATUS': {
      return {
        text: `पत्ती की साफ़ फोटो लेकर बीमारी जांचने के लिए कैमरा खोलें। GROOT 5 सेकंड में बीमारी पहचान लेगा।`,
        speechText: `पत्ती की फोटो लेने के लिए कैमरा खोला जा रहा है।`,
        suggestedAction: { type: 'OPEN_CAMERA', label: '📷 कैमरा / फोटो जांच' },
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना चाहिए?']
      };
    }

    case 'TODAY_ACTIONS': {
      return {
        text: `आज के मुख्य काम:\n1. खेत में नमी की स्थिति जांचें।\n2. मौसम साफ़ है, सामान्य देखभाल जारी रखें।\n3. पत्तों पर धब्बे दिखें तो फोटो से जांच करें।`,
        speechText: `आज के मुख्य काम: पहला, खेत में नमी जांचें। दूसरा, मौसम साफ़ है, सामान्य देखभाल रखें। तीसरा, पत्तों पर धब्बे दिखें तो फोटो लें।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना चाहिए?', 'आज मौसम कैसा है?']
      };
    }

    case 'LATEST_ALERT': {
      return {
        text: `अभी कोई गंभीर खतरा नहीं है। मिट्टी की नमी और सामान्य मौसम पर ध्यान बनाए रखें।`,
        speechText: `अभी कोई गंभीर खतरा नहीं है। सब सामान्य है।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज मौसम कैसा है?']
      };
    }

    case 'GROWTH_STATUS': {
      return {
        text: `आपकी फसल सामान्य गति से बढ़ रही है। उचित समय पर खाद और पानी देने से 22-25 क्विंटल प्रति एकड़ पैदावार की उम्मीद है।`,
        speechText: `आपकी फसल सामान्य गति से बढ़ रही है। पैदावार अच्छी होने की उम्मीद है।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना चाहिए?']
      };
    }

    case 'HOW_TO_USE_GROOT':
    case 'HELP': {
      return {
        text: `GROOT इस्तेमाल करना बहुत सरल है:\n1. 📍 अपना खेत चुनें\n2. 🌾 फसल और किस्म चुनें\n3. 🎙️ कोई भी सवाल बोलकर पूछें\nGROOT आपको आसान भाषा में सब बता देगा!`,
        speechText: `ग्रूट इस्तेमाल करना बहुत सरल है। खेत चुनें, फसल चुनें, और कोई भी सवाल मुझसे बोलकर पूछें।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'मेरा खेत दिखाओ', 'आज मौसम कैसा है?']
      };
    }

    case 'HOW_TO_SELECT_FARM': {
      return {
        text: `खेत या लोकेशन बदलने के लिए My Farm पेज पर जाकर "📍 वर्तमान स्थान लें" या गाँव का नाम खोजें।`,
        speechText: `लोकेशन बदलने के लिए खेत का नक्शा खोला जा रहा है।`,
        suggestedAction: { type: 'OPEN_FARM_MAP', label: '🗺️ खेत नक्शा खोलें' },
        followupSuggestions: ['मेरा खेत कहाँ है?', 'मेरा खेत कितना बड़ा है?']
      };
    }

    case 'THANK_YOU': {
      return {
        text: 'आपका बहुत धन्यवाद! अच्छी फसल और खुशहाल खेती के लिए GROOT हमेशा आपके साथ है। 🙏',
        speechText: 'आपका धन्यवाद! खुशहाल खेती के लिए ग्रूट हमेशा आपके साथ है।',
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना चाहिए?']
      };
    }

    case 'UNKNOWN':
    default: {
      return {
        text: `माफ कीजिए, मैं यह सवाल ठीक से समझ नहीं पाया। आप अपनी फसल, खेत, पानी, मौसम या crop health के बारे में पूछ सकते हैं।`,
        speechText: `माफ कीजिए, मैं यह सवाल ठीक से समझ नहीं पाया। आप अपनी फसल, खेत, पानी या मौसम के बारे में पूछ सकते हैं।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'मेरा खेत दिखाओ', 'आज मौसम कैसा है?']
      };
    }
  }
}
