import { AppLanguage, FusionResult, FieldZone, SensorTelemetry, LeafSample, RealtimeWeather } from '../types/groot';
import { CropVariety } from '../types/crops';

export interface LanguageMeta {
  code: AppLanguage;
  name: string;
  nativeName: string;
  region: string;
  flagEmoji: string;
  speechCode: string; // e.g. hi-IN, pa-IN, ta-IN
  ttsCode: string;    // e.g. hi, pa, ta
  welcomePhrase: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'North & Central India',
    flagEmoji: '🇮🇳',
    speechCode: 'hi-IN',
    ttsCode: 'hi',
    welcomePhrase: 'नमस्ते किसान भाई!',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'Punjab & Haryana',
    flagEmoji: '🌾',
    speechCode: 'pa-IN',
    ttsCode: 'pa',
    welcomePhrase: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ!',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal & Tripura',
    flagEmoji: '🌾',
    speechCode: 'bn-IN',
    ttsCode: 'bn',
    welcomePhrase: 'নমস্কার কৃষক বন্ধু!',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Andhra Pradesh & Telangana',
    flagEmoji: '🌾',
    speechCode: 'te-IN',
    ttsCode: 'te',
    welcomePhrase: 'నమస్కారం రైతు సోదరులారా!',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu & Puducherry',
    flagEmoji: '🌾',
    speechCode: 'ta-IN',
    ttsCode: 'ta',
    welcomePhrase: 'வணக்கம் உழவர் பெருமக்களே!',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra & Goa',
    flagEmoji: '🌾',
    speechCode: 'mr-IN',
    ttsCode: 'mr',
    welcomePhrase: 'नमस्कार शेतकरी मित्रांनो!',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'Gujarat',
    flagEmoji: '🌾',
    speechCode: 'gu-IN',
    ttsCode: 'gu',
    welcomePhrase: 'નમસ્તે ખેડૂત મિત્રો!',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka',
    flagEmoji: '🌾',
    speechCode: 'kn-IN',
    ttsCode: 'kn',
    welcomePhrase: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ!',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala',
    flagEmoji: '🌾',
    speechCode: 'ml-IN',
    ttsCode: 'ml',
    welcomePhrase: 'നമസ്കാരം കർഷക സുഹൃത്തുക്കളെ!',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    region: 'Odisha',
    flagEmoji: '🌾',
    speechCode: 'or-IN',
    ttsCode: 'or',
    welcomePhrase: 'ନମସ୍କାର କୃଷକ ଭାଇ!',
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'Assam & North East',
    flagEmoji: '🌾',
    speechCode: 'as-IN',
    ttsCode: 'as',
    welcomePhrase: 'নমস্কাৰ কৃষক ভাইসকল!',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (India)',
    region: 'Pan-India & Global',
    flagEmoji: '🌐',
    speechCode: 'en-IN',
    ttsCode: 'en',
    welcomePhrase: 'Hello Farmer Friend!',
  },
  {
    code: 'hinglish',
    name: 'Hinglish',
    nativeName: 'किसान Hinglish',
    region: 'Daily Rural Dialect',
    flagEmoji: '🗣️',
    speechCode: 'hi-IN',
    ttsCode: 'hi',
    welcomePhrase: 'Namaste Kisan Bhai!',
  },
];

export const getLanguageMeta = (lang: AppLanguage): LanguageMeta => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
};

/**
 * Generate fully translated voice advice scripts across all 13 Indian regional languages
 */
export const getMultilingualVoiceScripts = (
  lang: AppLanguage,
  fusion: FusionResult,
  zone: FieldZone,
  telemetry: SensorTelemetry,
  leaf: LeafSample,
  variety: CropVariety,
  weather: RealtimeWeather
) => {
  const isHighRisk = fusion.riskPercentage > 50;
  const cropName = variety.varietyHindi || variety.varietyName;
  const cropNameEn = variety.varietyName;

  switch (lang) {
    case 'pa': // Punjabi
      return {
        welcome: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! GROOT AI ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ${variety.varietyName} ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ ਦਬਾ ਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਆਵਾਜ਼ ਸਲਾਹ ਸੁਣੋ।`,
        health: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਤੁਹਾਡੇ ${variety.varietyName} (ਖੇਤ ਜ਼ੋਨ ${zone.id}) ਦੀ ਸਿਹਤ ${fusion.healthScore} ਪ੍ਰਤੀਸ਼ਤ ਹੈ। ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ ${telemetry.soilMoisture.toFixed(0)} ਪ੍ਰਤੀਸ਼ਤ ਹੈ। ${
          isHighRisk ? 'ਖੇਤ ਵਿੱਚ ਬਿਮਾਰੀ ਦੇ ਲੱਛਣ ਹਨ, ਤੁਰੰਤ ਧਿਆਨ ਦਿਓ।' : 'ਫ਼ਸਲ ਬਿਲਕੁਲ ਹਰੀ-ਭਰੀ ਅਤੇ ਤੰਦਰੁਸਤ ਹੈ।'
        }`,
        fertilizer: `ਖਾਦ ਸਲਾਹ: ${variety.varietyName} ਲਈ 45 ਕਿੱਲੋ ਨਿੰਮ ਕੋਟੇਡ ਯੂਰੀਆ ਅਤੇ 30 ਕਿੱਲੋ ਡੀ.ਏ.ਪੀ. ਪ੍ਰਤੀ ਏਕੜ ਪਾਓ। ਸਵੇਰੇ ਸਿੰਚਾਈ ਤੋਂ ਬਾਅਦ ਖਾਦ ਦਿਓ।`,
        disease: `ਦਵਾਈ ਸਲਾਹ: ਪੱਤੇ ਵਿੱਚ ${leaf.name} ਦੇ ਲੱਛਣ ਹਨ। ਟ੍ਰਾਈਸਾਈਕਲਾਜ਼ੋਲ 0.6 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਸਵੇਰੇ 8 ਵਜੇ ਤੋਂ ਪਹਿਲਾਂ ਛਿੜਕਾਅ ਕਰੋ।`,
        weather: `ਮੌਸਮ ਤੇ ਪਾਣੀ ਸਲਾਹ: ਅੱਜ ਦਾ ਤਾਪਮਾਨ ${weather.temperature} ਡਿਗਰੀ ਹੈ ਅਤੇ ਹਵਾ ਵਿੱਚ ਨਮੀ ${weather.humidity} ਪ੍ਰਤੀਸ਼ਤ ਹੈ। ਦਵਾਈ ਛਿੜਕਾਅ ਲਈ ਮੌਸਮ ਅਨੁਕੂਲ ਹੈ।`,
        fullAudit: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! GROOT AI ਦੁਆਰਾ ${variety.varietyName} ਖੇਤ ਦੀ ਪੂਰੀ ਜਾਂਚ ਹੋ ਗਈ ਹੈ। ਫ਼ਸਲ ਸਿਹਤ ${fusion.healthScore} ਪ੍ਰਤੀਸ਼ਤ ਹੈ। ਨਿੰਮ ਕੋਟੇਡ ਯੂਰੀਆ ਅਤੇ ਕੀਟਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਸਮੇਂ ਸਿਰ ਕਰੋ। ਧੰਨਵਾਦ!`,
      };

    case 'bn': // Bengali
      return {
        welcome: `নমস্কার কৃষক বন্ধু! GROOT AI-তে আপনাকে স্বাগতম। ${variety.varietyName}-এর জন্য নিচের বোতাম টিপে বাংলায় ভয়েস পরামর্শ শুনুন।`,
        health: `নমস্কার কৃষক বন্ধু! আপনার ${variety.varietyName} (জোন ${zone.id}) ফসলের স্বাস্থ্য ${fusion.healthScore} শতাংশ। মাটিতে আর্দ্রতা ${telemetry.soilMoisture.toFixed(0)} শতাংশ। ${
          isHighRisk ? 'জমিতে ছত্রাক রোগের লক্ষণ দেখা গেছে, দ্রুত ব্যবস্থা নিন।' : 'ফসল সম্পূর্ণ সুস্থ ও সবুজ রয়েছে।'
        }`,
        fertilizer: `সার পরামর্শ: ${variety.varietyName}-এর জন্য প্রতি একরে ৪৫ কেজি নিম কোটেড ইউরিয়া এবং ৩০ কেজি ডিএপি প্রয়োগ করুন। সকালের দিকে সেচের পর সার দিন।`,
        disease: `ওষুধ পরামর্শ: পাতায় ${leaf.name}-এর লক্ষণ পাওয়া গেছে। ট্রাইসাইক্লাজোল ০.৬ গ্রাম প্রতি লিটার জলে মিশিয়ে সকাল ৮টার আগে স্প্রে করুন।`,
        weather: `আবহাওয়া ও জল পরামর্শ: আজকের তাপমাত্রা ${weather.temperature} ডিগ্রি এবং বাতাসে আর্দ্রতা ${weather.humidity} শতাংশ। সার ও ওষুধ স্প্রে করার জন্য আবহাওয়া উপযুক্ত।`,
        fullAudit: `নমস্কার কৃষক বন্ধু! GROOT AI দ্বারা আপনার ${variety.varietyName} জমির পূর্ণাঙ্গ পরীক্ষা সম্পন্ন হয়েছে। ফসলের স্বাস্থ্য ${fusion.healthScore} শতাংশ। ইউরিয়া ও নির্দেশিত ওষুধ প্রয়োগ করুন। ধন্যবাদ!`,
      };

    case 'te': // Telugu
      return {
        welcome: `నమస్కారం రైతు సోదరులారా! GROOT AI కి స్వాగతం. ${variety.varietyName} కోసం క్రింది బటన్లను నొక్కి తెలుగులో ఆడియో సలహాలు వినండి.`,
        health: `నమస్కారం రైతు సోదరులారా! మీ ${variety.varietyName} (జోన్ ${zone.id}) పంట ఆరోగ్యం ${fusion.healthScore} శాతంగా ఉంది. నేలలో తేమ ${telemetry.soilMoisture.toFixed(0)} శాతంగా ఉంది. ${
          isHighRisk ? 'పంటలో తెగులు లక్షణాలు గమనించబడ్డాయి, వెంటనే చర్యలు తీసుకోండి.' : 'పంట పచ్చగా, ఎంతో ఆరోగ్యంగా ఉంది.'
        }`,
        fertilizer: `ఎరువుల సలహా: ${variety.varietyName} కోసం ఎకరాకు 45 కిలోల వేప పూత యూరియా మరియు 30 కిలోల డీఏపీ వేయండి. ఉదయం పూట తడి అందించిన తర్వాత ఎరువులు వాడండి.`,
        disease: `పురుగుమందు సలహా: ఆకులలో ${leaf.name} తెగులు గుర్తించబడింది. ట్రైసైక్లాజోల్ 0.6 గ్రాములు లీటరు నీటిలో కలిపి ఉదయం 8 గంటల లోపు పిచికారీ చేయండి.`,
        weather: `వాతావరణం & నీటి సలహా: ప్రస్తుత ఉష్ణోగ్రత ${weather.temperature} డిగ్రీలు, గాలిలో తేమ ${weather.humidity} శాతం. మందుల పిచికారీకి వాతావరణం అనుకూలంగా ఉంది.`,
        fullAudit: `నమస్కారం రైతు మిత్రులారా! GROOT AI ద్వారా మీ ${variety.varietyName} పొలం సమగ్ర పరిశీలన పూర్తయింది. పంట ఆరోగ్యం ${fusion.healthScore} శాతం. సూచించిన ఎరువులు మరియు మందులు పిచికారీ చేయండి. ధన్యవాదాలు!`,
      };

    case 'ta': // Tamil
      return {
        welcome: `வணக்கம் உழவர் பெருமக்களே! GROOT AI-க்கு உங்களை வரவேற்கிறோம். ${variety.varietyName} பயிருக்கான குரல் வழி ஆலோசனைகளை தமிழில் கேட்க கீழே உள்ள பொத்தானை அழுத்தவும்.`,
        health: `வணக்கம் விவசாயி நண்பரே! உங்கள் ${variety.varietyName} (மண்டலம் ${zone.id}) பயிரின் ஆரோக்கியம் ${fusion.healthScore} சதவீதம். மண்ணின் ஈரப்பதம் ${telemetry.soilMoisture.toFixed(0)} சதவீதம். ${
          isHighRisk ? 'பயிரில் பூஞ்சை நோய் தாக்குதல் அறிகுறிகள் உள்ளன, உடனே கவனிக்கவும்.' : 'பயிர் மிகவும் பசுமையாகவும் ஆரோக்கியமாகவும் உள்ளது.'
        }`,
        fertilizer: `உர பரிந்துரை: ${variety.varietyName} பயிருக்கு ஏக்கருக்கு 45 கிலோ வேப்ப எண்ணெய் பூசிய யூரியா மற்றும் 30 கிலோ டிஏபி இடவும். பாசனம் செய்த பின் காலையில் உரம் இடவும்.`,
        disease: `மருந்து தெளிப்பு: இலையில் ${leaf.name} நோய் காணப்படுகிறது. டிரைசைக்ளசோல் 0.6 கிராம் ஒரு லிட்டர் தண்ணீரில் கலந்து காலை 8 மணிக்குள் தெளிக்கவும்.`,
        weather: `வானிலை & பாசன தகவல்: இன்றைய வெப்பநிலை ${weather.temperature} டிகிரி, ஈரப்பதம் ${weather.humidity} சதவீதம். மருந்து தெளிக்க உகந்த நேரம்.`,
        fullAudit: `வணக்கம் விவசாய பெருமக்களே! GROOT AI மூலம் உங்கள் ${variety.varietyName} வயல் ஆய்வு நிறைவடைந்தது. பயிர் நலம் ${fusion.healthScore} சதவீதம். பரிந்துரைக்கப்பட்ட உரம் மற்றும் பூச்சிக்கொல்லியை தெளிக்கவும். நன்றி!`,
      };

    case 'mr': // Marathi
      return {
        welcome: `नमस्कार शेतकरी मित्रांनो! GROOT AI मध्ये आपले स्वागत आहे. ${variety.varietyHindi || variety.varietyName} साठी खालील बटण दाबून मराठीत आवाजी सल्ला ऐका.`,
        health: `नमस्कार शेतकरी मित्रांनो! तुमच्या ${variety.varietyHindi || variety.varietyName} (झोन ${zone.id}) पिकाचे आरोग्य ${fusion.healthScore} टक्के आहे. जमिनीत ओलावा ${telemetry.soilMoisture.toFixed(0)} टक्के आहे. ${
          isHighRisk ? 'पिकावर बुरशीजन्य रोगाची लक्षणे दिसत आहेत, त्वरित लक्ष द्या.' : 'पीक अगदी निरोगी व हिरवेगार आहे.'
        }`,
        fertilizer: `खत व्यवस्थापन: ${variety.varietyHindi || variety.varietyName} साठी प्रति एकर ४५ किलो नीम कोटेड युरिया आणि ३० किलो डीएपी टाका. सकाळी पाण्याच्या पाळीनंतर खत द्या.`,
        disease: `औषध फवारणी: पानावरील ${leaf.name} च्या नियंत्रणासाठी ट्रायसाइक्लॅझोल ०.६ ग्रॅम प्रति लिटर पाण्यात मिसळून सकाळी ८ पूर्वी फवारणी करा.`,
        weather: `हवामान व पाणी सल्ला: आजचे तापमान ${weather.temperature} अंश सेल्सिअस असून हवेतील ओलावा ${weather.humidity} टक्के आहे. फवारणीसाठी हवामान अनुकूल आहे.`,
        fullAudit: `नमस्कार शेतकरी मित्रांनो! GROOT AI द्वारे ${variety.varietyHindi || variety.varietyName} शेताची तपासणी पूर्ण झाली आहे. पिकाचे आरोग्य ${fusion.healthScore} टक्के आहे. वेळेवर खत व औषध फवारणी करा. धन्यवाद!`,
      };

    case 'gu': // Gujarati
      return {
        welcome: `નમસ્તે ખેડૂત મિત્રો! GROOT AI માં આપનું સ્વાગત છે. ${variety.varietyHindi || variety.varietyName} માટે નીચેના બટન દબાવી ગુજરાતીમાં ઑડિયો સલાહ સાંભળો.`,
        health: `નમસ્તે ખેડૂત મિત્રો! તમારા ${variety.varietyHindi || variety.varietyName} (ઝોન ${zone.id}) પાકનું આરોગ્ય ${fusion.healthScore} ટકા છે. જમીનમાં ભેજ ${telemetry.soilMoisture.toFixed(0)} ટકા છે. ${
          isHighRisk ? 'પાકમાં ફૂગના રોગના લક્ષણો જણાયા છે, તાત્કાલિક પગલાં લો.' : 'પાક એકદમ સ્વસ્થ અને લીલોછમ છે.'
        }`,
        fertilizer: `ખાતર સલાહ: ${variety.varietyHindi || variety.varietyName} માટે વીઘા/એકર દીઠ 45 કિલો લીમડા યુક્ત યુરિયા અને 30 કિલો ડીએપી આપો. સવારે પિયત પછી ખાતર આપવું.`,
        disease: `દવા છંટકાવ: પાંદડામાં ${leaf.name} ના લક્ષણો છે. ટ્રાઈસાયક્લાઝોલ 0.6 ગ્રામ પ્રતિ લિટર પાણીમાં મેળવી સવારે 8 વાગ્યા પહેલાં છંટકાવ કરો.`,
        weather: `હવામાન અને સિંચાઈ: આજનું તાપમાન ${weather.temperature} ડિગ્રી અને હવામાં ભેજ ${weather.humidity} ટકા છે. દવા છાંટવા માટે ઉત્તમ સમય છે.`,
        fullAudit: `નમસ્તે ખેડૂત ભાઈઓ! GROOT AI દ્વારા ${variety.varietyHindi || variety.varietyName} ખેતરની સંપૂર્ણ તપાસ પૂર્ણ થઈ છે. પાકનું આરોગ્ય ${fusion.healthScore} ટકા છે. સમયસર ખાતર અને દવા આપો. આભાર!`,
      };

    case 'kn': // Kannada
      return {
        welcome: `ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! GROOT AI ಗೆ ಸುಸ್ವಾಗತ. ${variety.varietyName} ಬೆಳೆಗಾಗಿ ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಧ್ವನಿ ಸಲಹೆಗಳನ್ನು ಕೇಳಿ.`,
        health: `ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಿಮ್ಮ ${variety.varietyName} (ವಲಯ ${zone.id}) ಬೆಳೆಯ ಆರೋಗ್ಯ ${fusion.healthScore} ಪ್ರತಿಶತ ಇದೆ. ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶ ${telemetry.soilMoisture.toFixed(0)} ಪ್ರತಿಶತ ಇದೆ. ${
          isHighRisk ? 'ಬೆಳೆಯಲ್ಲಿ ಶಿಲೀಂಧ್ರ ರೋಗದ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿವೆ, ತಕ್ಷಣ ಗಮನಹರಿಸಿ.' : 'ಬೆಳೆ ಸಂಪೂರ್ಣವಾಗಿ ಹಸಿರಾಗಿದ್ದು ಉತ್ತಮವಾಗಿದೆ.'
        }`,
        fertilizer: `ಗೊಬ್ಬರ ಸಲಹೆ: ${variety.varietyName} ಬೆಳೆಗೆ ಎಕರೆಗೆ 45 ಕೆಜಿ ಬೇವಿನ ಲೇಪಿತ ಯೂರಿಯಾ ಮತ್ತು 30 ಕೆಜಿ ಡಿಎಪಿ ಹಾಕಿ. ನೀರಾವರಿ ನಂತರ ಮುಂಜಾನೆ ಗೊಬ್ಬರ ನೀಡಿ.`,
        disease: `ಔಷಧ ಸಿಂಪಡಣೆ: ಎಲೆಗಳಲ್ಲಿ ${leaf.name} ರೋಗದ ಲಕ್ಷಣಗಳಿವೆ. ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 0.6 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಬೆಳಗ್ಗೆ 8 ಗಂಟೆಯ ಒಳಗೆ ಸಿಂಪಡಿಸಿ.`,
        weather: `ಹವಾಮಾನ ಮತ್ತು ನೀರು: ಇಂದಿನ ತಾಪಮಾನ ${weather.temperature} ಡಿಗ್ರಿ, ಆರ್ದ್ರತೆ ${weather.humidity} ಪ್ರತಿಶತ. ಔಷಧಿ ಸಿಂಪಡಣೆಗೆ ಹವಾಮಾನ ಸೂಕ್ತವಾಗಿದೆ.`,
        fullAudit: `ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! GROOT AI ಮೂಲಕ ನಿಮ್ಮ ${variety.varietyName} ಜಮೀನಿನ ಸಮಗ್ರ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಬೆಳೆ ಆರೋಗ್ಯ ${fusion.healthScore} ಪ್ರತಿಶತ. ಶಿಫಾರಸು ಮಾಡಿದ ಗೊಬ್ಬರ ಮತ್ತು ಔಷಧಿ ಸಿಂಪಡಿಸಿ. ಧನ್ಯವಾದಗಳು!`,
      };

    case 'ml': // Malayalam
      return {
        welcome: `നമസ്കാരം കർഷക സുഹൃത്തുക്കളെ! GROOT AI-ലേക്ക് സ്വാഗതം. ${variety.varietyName} വിളയ്ക്കായി താഴെയുള്ള ബട്ടൺ അമർത്തി മലയാളത്തിൽ ശബ്ദ ഉപദേശം കേൾക്കൂ.`,
        health: `നമസ്കാരം കർഷക സുഹൃത്തേ! നിങ്ങളുടെ ${variety.varietyName} (സോൺ ${zone.id}) വിളയുടെ ആരോഗ്യം ${fusion.healthScore} ശതമാനമാണ്. മണ്ണിലെ ഈർപ്പം ${telemetry.soilMoisture.toFixed(0)} ശതമാനമാണ്. ${
          isHighRisk ? 'വിളയിൽ കുമിൾ രോഗ ലക്ഷണങ്ങൾ കാണുന്നു, ഉടൻ ശ്രദ്ധിക്കുക.' : 'വിള തികച്ചും ആരോഗ്യകരവും പച്ചപ്പുള്ളതുമാണ്.'
        }`,
        fertilizer: `വളപ്രയോഗം: ${variety.varietyName} വിളയ്ക്ക് ഏക്കറിന് 45 കിലോ വേപ്പെണ്ണ പൂശിയ യൂറിയയും 30 കിലോ ഡിഎപിയും നൽകുക. നനച്ച ശേഷം രാവിലെ വളം ചേർക്കുക.`,
        disease: `കീടനാശിനി തളിക്കൽ: ഇലകളിൽ ${leaf.name} രോഗലക്ഷണങ്ങളുണ്ട്. ട്രൈസൈക്ലസോൾ 0.6 ഗ്രാം ഒരു ലിറ്റർ വെള്ളത്തിൽ കലക്കി രാവിലെ 8 മണിക്ക് മുൻപ് തളിക്കുക.`,
        weather: `കാലാവസ്ഥയും ജലസേചനവും: ഇന്നത്തെ താപനില ${weather.temperature} ഡിഗ്രിയും അന്തരീക്ഷ ഈർപ്പം ${weather.humidity} ശതമാനവുമാണ്. മരുന്ന് തളിക്കാൻ അനുയോജ്യമായ സമയം.`,
        fullAudit: `നമസ്കാരം കർഷക സുഹൃത്തുക്കളെ! GROOT AI വഴി നിങ്ങളുടെ ${variety.varietyName} കൃഷിയിട പരിശോധന പൂർത്തിയായി. വിള ആരോഗ്യം ${fusion.healthScore} ശതമാനം. കൃത്യമായി വളവും മരുന്നും നൽകുക. നന്ദി!`,
      };

    case 'or': // Odia
      return {
        welcome: `ନମସ୍କାର କୃଷକ ଭାଇ! GROOT AI କୁ ସ୍ୱାଗତ। ${variety.varietyHindi || variety.varietyName} ପାଇଁ ତଳେ ଥିବା ବଟନ୍ ଦବାଇ ଓଡ଼ିଆରେ ପରାମର୍ଶ ଶୁଣନ୍ତୁ।`,
        health: `ନମସ୍କାର କୃଷକ ଭାଇ! ଆପଣଙ୍କ ${variety.varietyHindi || variety.varietyName} (ଜୋନ୍ ${zone.id}) ଫସଲର ସ୍ୱାସ୍ଥ୍ୟ ${fusion.healthScore} ପ୍ରତିଶତ ଅଛି। ମାଟିରେ ଆର୍ଦ୍ରତା ${telemetry.soilMoisture.toFixed(0)} ପ୍ରତିଶତ। ${
          isHighRisk ? 'ଫସଲରେ ରୋଗ ଲକ୍ଷଣ ଦେଖାଦେଇଛି, ତୁରନ୍ତ ଧ୍ୟାନ ଦିଅନ୍ତୁ।' : 'ଫସଲ ସମ୍ପୂର୍ଣ୍ଣ ସବୁଜ ଏବଂ ସୁସ୍ଥ ଅଛି।'
        }`,
        fertilizer: `ଖତ ପରାମର୍ଶ: ${variety.varietyHindi || variety.varietyName} ପାଇଁ ଏକର ପିଛା ୪୫ କେଜି ନିମ୍ କୋଟେଡ୍ ୟୁରିଆ ଏବଂ ୩୦ କେଜି ଡିଏପି ପ୍ରୟୋଗ କରନ୍ତୁ। ସକାଳେ ଜଳସେଚନ ପରେ ଖତ ଦିଅନ୍ତୁ।`,
        disease: `ଔଷଧ ସ୍ପ୍ରେ: ପତ୍ରରେ ${leaf.name} ର ଲକ୍ଷଣ ଅଛି। ଟ୍ରାଇସାଇକ୍ଲାଜୋଲ ୦.୬ ଗ୍ରାମ ପ୍ରତି ଲିଟର ପାଣିରେ ମିଶାଇ ସକାଳ ୮ଟା ପୂର୍ବରୁ ସ୍ପ୍ରେ କରନ୍ତୁ।`,
        weather: `ପାଣିପାଗ ସୂଚନା: ଆଜିର ତାପମାତ୍ରା ${weather.temperature} ଡିଗ୍ରୀ ଏବଂ ବାୟୁମଣ୍ଡଳ ଆର୍ଦ୍ରତା ${weather.humidity} ପ୍ରତିଶତ। ଔଷଧ ସ୍ପ୍ରେ ପାଇଁ ପାଣିପାଗ ଉପଯୁକ୍ତ।`,
        fullAudit: `ନମସ୍କାର କୃଷକ ଭାଇ! GROOT AI ଦ୍ୱାରା ଆପଣଙ୍କ ${variety.varietyHindi || variety.varietyName} କ୍ଷେତର ପରୀକ୍ଷା ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି। ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ${fusion.healthScore} ପ୍ରତିଶତ। ୟୁରିଆ ଓ କୀଟନାଶକ ପ୍ରୟୋଗ କରନ୍ତୁ। ଧନ୍ୟବାଦ!`,
      };

    case 'as': // Assamese
      return {
        welcome: `নমস্কাৰ কৃষক ভাইসকল! GROOT AI লৈ স্বাগতম। ${variety.varietyName} ৰ বাবে তলৰ বুটাম টিপি অসমীয়াত ভইচ পৰামৰ্শ শুনক।`,
        health: `নমস্কাৰ কৃষক বন্ধু! আপোনাৰ ${variety.varietyName} (জোন ${zone.id}) শস্যৰ স্বাস্থ্য ${fusion.healthScore} শতাংশ। মাটিত সেমেকা ভাব ${telemetry.soilMoisture.toFixed(0)} শতাংশ। ${
          isHighRisk ? 'শস্যত ভেঁকুৰ ৰোগৰ লক্ষণ দেখা গৈছে, তৎক্ষণাৎ ব্যৱস্থা লওক।' : 'শস্য সম্পূৰ্ণৰূপে সেউজীয়া আৰু সুস্থ হৈ আছে।'
        }`,
        fertilizer: `সাৰ পৰামৰ্শ: ${variety.varietyName} ৰ বাবে প্ৰতি বিঘা/একৰত ৪৫ কেজি নিম ক’টেড ইউৰিয়া আৰু ৩০ কেজি ডিএপি প্ৰয়োগ কৰক। ৰাতিপুৱা পানী দিয়াৰ পিছত সাৰ দিয়ক।`,
        disease: `ঔষধ স্প্ৰে’: পাতত ${leaf.name} ৰ লক্ষণ দেখা গৈছে। ট্ৰাইচাইক্লাজোল ০.৬ গ্ৰাম প্ৰতি লিটাৰ পানীত মিহলাই ৰাতিপুৱা ৮ বজাৰ আগতে স্প্ৰে’ কৰক।`,
        weather: `বতৰ আৰু পানী: আজিৰ তাপমাত্ৰা ${weather.temperature} ডিগ্ৰী আৰু আৰ্দ্ৰতা ${weather.humidity} শতাংশ। ঔষধ স্প্ৰে’ কৰাৰ বাবে বতৰ অনুকূল।`,
        fullAudit: `নমস্কাৰ কৃষক ভাইসকল! GROOT AI দ্বাৰা আপোনাৰ ${variety.varietyName} পথাৰৰ পৰীক্ষা সম্পূৰ্ণ হ’ল। শস্যৰ স্বাস্থ্য ${fusion.healthScore} শতাংশ। সাৰ আৰু ঔষধ সময়মতে প্ৰয়োগ কৰক। ধন্যবাদ!`,
      };

    case 'hinglish':
      return {
        welcome: `Namaste Kisan Bhai! GROOT AI me aapka swagat hai. ${variety.varietyHindi || variety.varietyName} ke liye neeche diye gaye buttons dabakar spoken voice advice sunein.`,
        health: `Namaste Kisan Bhai! Aapki ${variety.varietyHindi || variety.varietyName} (Zone ${zone.id}) ki health ${fusion.healthScore} percent hai. Mitti me nami ${telemetry.soilMoisture.toFixed(0)} percent hai. ${
          isHighRisk ? 'Khet me fungal bimari ke lakshan hain, turant dhyaan dein.' : 'Fasal bilkul hari-bhari aur healthy hai.'
        }`,
        fertilizer: `Khad Salah: ${variety.varietyHindi || variety.varietyName} ke liye 45 kg Neem Coated Urea aur 30 kg DAP prati acre dalein. Subah sinchai ke baad khad dein.`,
        disease: `Dawai Salah: Patti me ${leaf.name} ke lakshan hain. Tricyclazole 0.6 gram per liter paani me milakar subah 8 baje se pehle spray karein.`,
        weather: `Mausam aur Paani: Aaj ka taapman ${weather.temperature} degree hai aur nami ${weather.humidity} percent hai. Dawai spray ke liye mausam best hai.`,
        fullAudit: `Namaste Kisan Bhai! GROOT AI dwara ${variety.varietyHindi || variety.varietyName} khet ki report complete ho gayi hai. Fasal health ${fusion.healthScore} percent hai. Urea aur dawai time par dalein. Dhanyawaad!`,
      };

    case 'en':
      return {
        welcome: `Welcome to GROOT AI Voice Assistant! Click any of the cards below to listen to complete spoken agronomic advisories for ${cropNameEn} in English.`,
        health: `Hello farmer! Vitality score for your ${cropNameEn} in Sector ${zone.id} is ${fusion.healthScore} percent. Soil moisture is at ${telemetry.soilMoisture.toFixed(0)} percent. ${
          isHighRisk ? 'Hazard detected due to foliar disease and moisture deficit.' : 'Crop is healthy and thriving.'
        }`,
        fertilizer: `Fertilizer Prescription: For ${cropNameEn}, apply 45 kg Neem Coated Urea and 30 kg DAP per acre following field irrigation.`,
        disease: `Pest Remedy: Leaf scan indicates ${leaf.name}. Spray Tricyclazole 75% WP at 0.6 grams per liter water before 8 AM.`,
        weather: `Weather & Water: Temperature is ${weather.temperature}°C with ${weather.humidity}% humidity. Spray conditions are optimal.`,
        fullAudit: `Hello farmer! Full field audit for ${cropNameEn} in Sector ${zone.id} is complete. Vitality is ${fusion.healthScore} percent. Apply the prescribed inputs. Thank you!`,
      };

    case 'hi':
    default:
      return {
        welcome: `नमस्ते किसान भाई! GROOT AI में आपका स्वागत है। ${cropName} के लिए नीचे दिए गए बटन दबाकर सरल हिंदी में आवाज़ सलाह सुनें।`,
        health: `नमस्ते किसान भाई! आपकी ${cropName} (ज़ोन ${zone.id}) की सेहत ${fusion.healthScore} प्रतिशत है। मिट्टी में नमी ${telemetry.soilMoisture.toFixed(0)} प्रतिशत है। ${
          isHighRisk ? 'खेत में फंगल बीमारी के लक्षण हैं, तुरंत ध्यान दें।' : 'फसल हरी-भरी और स्वस्थ है।'
        }`,
        fertilizer: `खाद सलाह: ${cropName} के लिए 45 किलोग्राम नीम कोटेड यूरिया और 30 किलोग्राम डीएपी प्रति एकड़ डालें। सुबह के समय सिंचाई के बाद खाद दें।`,
        disease: `दवाई सलाह: पत्ती में ${leaf.name} के लक्षण हैं। ट्राइसाइक्लाज़ोल 0.6 ग्राम प्रति लीटर पानी में मिलाकर सुबह 8 बजे से पहले छिड़काव करें।`,
        weather: `मौसम व पानी सलाह: आज का तापमान ${weather.temperature} डिग्री और हवा में नमी ${weather.humidity} प्रतिशत है। दवाई छिड़काव के लिए अनुकूल समय है।`,
        fullAudit: `नमस्ते किसान भाई! GROOT AI द्वारा ${cropName} खेत की जांच पूरी हो गई है। फसल स्वास्थ्य ${fusion.healthScore} प्रतिशत है। नीम कोटेड यूरिया और कीटनाशक का छिड़काव करें। धन्यवाद!`,
      };
  }
};
