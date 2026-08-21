import { CropVariety } from '../types/crops';
import { FarmPlot, FusionResult, RealtimeWeather, SensorTelemetry, FieldZone, LeafSample } from '../types/groot';

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
    type: 'OPEN_FARM' | 'OPEN_HEALTH' | 'OPEN_CAMERA' | 'CHANGE_CROP' | 'OPEN_SETTINGS' | 'OPEN_CROPS';
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
  const varietyName = crop?.varietyHindi || crop?.varietyName || '';
  const plotName = plot?.name || 'आपका खेत';
  const locationName = plot?.locationName || 'खेत';

  switch (intent) {
    case 'GREETING': {
      return {
        text: `नमस्ते! मैं GROOT हूँ। आज आपकी ${cropNameHi} और खेत का क्या हाल जानना चाहते हैं?`,
        speechText: `नमस्ते! मैं ग्रूट हूँ। आज आपकी ${cropNameHi} की फसल और खेत के बारे में क्या जानना चाहते हैं?`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना है?', 'आज मौसम कैसा है?']
      };
    }

    case 'ACTIVE_CROP': {
      if (!crop) {
        return {
          text: 'अभी आपने कोई फसल नहीं चुनी है। "Choose Crop" बटन दबाकर फसल चुनें।',
          speechText: 'अभी आपने कोई फसल नहीं चुनी है। कृपया फसल चुनें।',
          suggestedAction: { type: 'OPEN_CROPS', label: '🌾 फसल चुनें' },
          followupSuggestions: ['फसल कैसे जोड़ें?', 'GROOT कैसे इस्तेमाल करें?']
        };
      }
      return {
        text: `अभी आपने ${cropNameHi} (${crop.cropName}) की फसल चुनी हुई है। ${varietyName ? `इसकी किस्म ${varietyName} है।` : 'किस्म अभी नहीं जोड़ी गई है।'} यह ${plotName} पर बोई गई है।`,
        speechText: `अभी आपने ${cropNameHi} की फसल चुनी हुई है। ${varietyName ? `इसकी किस्म ${varietyName} है।` : ''}`,
        suggestedAction: { type: 'CHANGE_CROP', label: '🌾 फसल बदलें' },
        followupSuggestions: ['मेरी फसल कैसी है?', 'किस्म बताओ', 'आज पानी देना है?']
      };
    }

    case 'CROP_VARIETY': {
      if (!crop || !varietyName) {
        return {
          text: `आपकी फसल ${cropNameHi} है, लेकिन अभी कोई विशेष किस्म (variety) दर्ज नहीं है। आप My Crops में जाकर किस्म चुन सकते हैं।`,
          speechText: `आपकी फसल ${cropNameHi} है, किस्म अभी दर्ज नहीं है।`,
          suggestedAction: { type: 'OPEN_CROPS', label: '🌾 किस्म चुनें' },
          followupSuggestions: ['मेरी फसल कैसी है?', 'फसल बदलें']
        };
      }
      return {
        text: `आपकी ${cropNameHi} की किस्म ${varietyName} है। इसकी अनुमानित अवधि ${crop.durationDays} दिन है।`,
        speechText: `आपकी ${cropNameHi} की किस्म ${varietyName} है।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'खाद कितनी डालूं?']
      };
    }

    case 'CROP_HEALTH': {
      if (!fusion) {
        return {
          text: `आपकी ${cropNameHi} की रिपोर्ट तैयार हो रही है। कृपया एक बार Crop Health पेज देखें।`,
          speechText: 'फसल की नई स्वास्थ्य रिपोर्ट तैयार हो रही है।',
          suggestedAction: { type: 'OPEN_HEALTH', label: '❤️ फसल सेहत देखें' },
          followupSuggestions: ['आज पानी देना है?', 'मौसम कैसा है?']
        };
      }

      if (fusion.riskPercentage > 50) {
        return {
          text: `फसल कुल मिलाकर ठीक है, लेकिन एक हिस्से में थोड़ा तनाव और नमी की कमी दिखाई दे रही है। उस हिस्से को खेत में एक बार जाकर देख लेना अच्छा रहेगा।`,
          speechText: `फसल कुल मिलाकर ठीक है, लेकिन एक हिस्से में थोड़ा तनाव दिखाई दे रहा है। उस हिस्से को खेत में एक बार जाकर देख लें।`,
          suggestedAction: { type: 'OPEN_HEALTH', label: '❤️ पूरी हेल्थ रिपोर्ट देखें' },
          followupSuggestions: ['आज पानी देना है?', 'पत्ती की फोटो जांचें', 'मेरा खेत दिखाओ']
        };
      }

      return {
        text: `आपकी ${cropNameHi} की फसल अभी बहुत अच्छी और हरी-भरी लग रही है (स्वास्थ्य स्कोर ${fusion.healthScore}/100)। फिलहाल कोई बड़ी बीमारी या तनाव नहीं दिख रहा।`,
        speechText: `आपकी ${cropNameHi} की फसल अभी बहुत अच्छी लग रही है। फिलहाल कोई बड़ी समस्या नहीं दिख रही।`,
        suggestedAction: { type: 'OPEN_HEALTH', label: '❤️ पूरी रिपोर्ट देखें' },
        followupSuggestions: ['आज पानी देना है?', 'आज मौसम कैसा है?', 'आज क्या काम करें?']
      };
    }

    case 'WATER_STATUS':
    case 'IRRIGATION_HELP': {
      const moisture = telemetry?.soilMoisture ?? 55;
      if (moisture < 30) {
        return {
          text: `मिट्टी में अभी नमी ${moisture.toFixed(0)}% है, जो कम है। कल सुबह 6 से 9 बजे के बीच खेत में हल्की सिंचाई कर लेना अच्छा रहेगा।`,
          speechText: `मिट्टी में अभी नमी कम है। कल सुबह हल्की सिंचाई कर लेना अच्छा रहेगा।`,
          suggestedAction: { type: 'OPEN_HEALTH', label: '💧 पानी स्थिति देखें' },
          followupSuggestions: ['आज मौसम कैसा है?', 'मेरी फसल कैसी है?']
        };
      }
      return {
        text: `मिट्टी में अभी नमी ${moisture.toFixed(0)}% है, जो संतुलित है। तुरंत पानी देने की जरूरत नहीं लग रही। मौसम भी ध्यान में रखें।`,
        speechText: `मिट्टी में अभी नमी ठीक है, तुरंत पानी देने की जरूरत नहीं लग रही।`,
        followupSuggestions: ['आज मौसम कैसा है?', 'मेरी फसल कैसी है?']
      };
    }

    case 'WEATHER':
    case 'RAIN_CHANCE':
    case 'TEMPERATURE': {
      const temp = weather?.temperature ?? 28;
      const cond = weather?.conditionHindi ?? 'साफ़ धूप';
      return {
        text: `${locationName} में आज तापमान ${temp}°C है और मौसम ${cond} बना हुआ है। बारिश की संभावना बहुत कम है, इसलिए खाद डालने व छिड़काव के लिए दिन अनुकूल है।`,
        speechText: `${locationName} में आज तापमान ${temp} डिग्री सेल्सियस है और मौसम ${cond} है। छिड़काव के लिए दिन अनुकूल है।`,
        followupSuggestions: ['आज पानी देना है?', 'मेरी फसल कैसी है?']
      };
    }

    case 'FARM_LOCATION':
    case 'OPEN_FARM': {
      return {
        text: `आपका खेत ${locationName} में स्थित है। कुल क्षेत्रफल ${plot?.areaHa ?? 2.3} हेक्टेयर है। आइए सैटेलाइट मैप पर आपका खेत देखते हैं।`,
        speechText: `आपका खेत ${locationName} में स्थित है। सैटेलाइट मैप खोला जा रहा है।`,
        suggestedAction: { type: 'OPEN_FARM', label: '🗺️ खेत का नक्शा खोलें' },
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना है?']
      };
    }

    case 'OPEN_HEALTH': {
      return {
        text: `Crop Health पेज खोला जा रहा है। यहाँ आप फसल की सेहत, पानी, कीट व सैटेलाइट डेटा देख सकते हैं।`,
        speechText: `क्रॉप हेल्थ पेज खोला जा रहा है।`,
        suggestedAction: { type: 'OPEN_HEALTH', label: '❤️ फसल सेहत खोलें' },
        followupSuggestions: ['मेरी फसल कैसी है?', 'पानी की स्थिति']
      };
    }

    case 'CHANGE_CROP':
    case 'ADD_CROP': {
      return {
        text: `आप My Crops पेज से आसानी से फसल बदल सकते हैं या नई किस्म जोड़ सकते हैं।`,
        speechText: `फसल सूची खोली जा रही है।`,
        suggestedAction: { type: 'OPEN_CROPS', label: '🌾 फसलें देखें' },
        followupSuggestions: ['मेरी फसल कौन सी है?', 'GROOT कैसे काम करता है?']
      };
    }

    case 'TAKE_PHOTO':
    case 'DISEASE_STATUS': {
      return {
        text: `यदि फसल की पत्ती पर पीले या भूरे धब्बे दिखाई दे रहे हैं, तो कैमरा खोलकर पत्ती की साफ़ फोटो लें। GROOT AI 5 सेकंड में बीमारी पहचान लेगा।`,
        speechText: `पत्ती की फोटो लेने के लिए कैमरा खोला जा रहा है।`,
        suggestedAction: { type: 'OPEN_CAMERA', label: '📷 कैमरा / फोटो जांच' },
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना है?']
      };
    }

    case 'WHAT_TO_DO': {
      return {
        text: `आज तीन मुख्य बातों का ध्यान रखें:\n1. खेत के उत्तरी हिस्से में नमी जांचें।\n2. मौसम साफ़ है, यूरिया या खाद की खुराक सुबह के समय दें।\n3. यदि किसी पौधे पर कीड़े दिखें तो GROOT कैमरे से फोटो लें।`,
        speechText: `आज तीन मुख्य बातों का ध्यान रखें। पहला, खेत में नमी जांचें। दूसरा, सुबह के समय खाद दें। तीसरा, किसी पत्ते पर धब्बे दिखें तो फोटो लें।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना है?', 'मौसम कैसा है?']
      };
    }

    case 'HOW_TO_USE_GROOT':
    case 'HELP': {
      return {
        text: `GROOT इस्तेमाल करना बहुत सरल है:\n1. पहले अपना खेत मैप पर चुनें।\n2. अपनी फसल और किस्म चुनें।\n3. Home स्क्रीन पर रोज़ का हाल देखें।\nकोई भी सवाल हो तो मुझसे बोलकर पूछें!`,
        speechText: `ग्रूट इस्तेमाल करना बहुत सरल है। पहले मैप पर खेत चुनें, फिर फसल चुनें। कोई भी सवाल हो तो बोलकर पूछें।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना है?', 'मेरा खेत दिखाओ']
      };
    }

    case 'THANK_YOU': {
      return {
        text: 'आपका बहुत-बहुत धन्यवाद! अच्छी फसल और खुशहाल खेती के लिए GROOT हमेशा आपके साथ है। 🙏',
        speechText: 'आपका धन्यवाद! खुशहाल खेती के लिए ग्रूट हमेशा आपके साथ है।',
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना है?']
      };
    }

    case 'UNKNOWN':
    default: {
      return {
        text: `माफ कीजिए, मैं यह सवाल अभी ठीक से समझ नहीं पाया। आप फसल की सेहत, पानी, मौसम, अपनी फसल या खेत के बारे में पूछ सकते हैं।`,
        speechText: `माफ कीजिए, मैं यह सवाल ठीक से समझ नहीं पाया। आप फसल की सेहत, पानी, मौसम या खेत के बारे में पूछ सकते हैं।`,
        followupSuggestions: ['मेरी फसल कैसी है?', 'आज पानी देना है?', 'मेरा खेत दिखाओ', 'आज क्या काम करें?']
      };
    }
  }
}
