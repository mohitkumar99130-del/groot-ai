export interface AssistantIntent {
  intent: string;
  category: 'crop' | 'health' | 'water' | 'weather' | 'farm' | 'navigation' | 'help' | 'general';
  action?: 'OPEN_FARM' | 'OPEN_HEALTH' | 'OPEN_CAMERA' | 'CHANGE_CROP' | 'OPEN_SETTINGS' | 'OPEN_CROPS';
  examples: string[];
  keywords: string[];
}

export const GROOT_INTENTS: AssistantIntent[] = [
  {
    intent: 'GREETING',
    category: 'general',
    examples: [
      'नमस्ते',
      'हेलो',
      'hi',
      'hello',
      'namaste',
      'sat sri akal',
      'radhe radhe',
      'ram ram',
      'pranam'
    ],
    keywords: ['namaste', 'hello', 'hi', 'pranam', 'ram ram', 'radhe', 'sat sri akal', 'kaisa', 'kem cho']
  },
  {
    intent: 'ACTIVE_CROP',
    category: 'crop',
    examples: [
      'मेरी फसल कौन सी है',
      'मैं कौन सी फसल उगा रहा हूं',
      'mera crop kya hai',
      'kaunsi fasal hai',
      'current crop',
      'crop name batao',
      'meri fasal ka naam'
    ],
    keywords: ['kaunsi fasal', 'mera crop', 'active crop', 'current crop', 'fasal ka naam', 'crop name']
  },
  {
    intent: 'CROP_VARIETY',
    category: 'crop',
    examples: [
      'मेरी variety क्या है',
      'गेहूं की कौन सी variety है',
      'variety batao',
      'meri kisam kya hai',
      'किस्म बताओ',
      'kisam kaunsi hai',
      'variety name'
    ],
    keywords: ['variety', 'kisam', 'kism', 'seed variety', 'kaunsi variety']
  },
  {
    intent: 'CROP_HEALTH',
    category: 'health',
    action: 'OPEN_HEALTH',
    examples: [
      'मेरी फसल कैसी है',
      'फसल ठीक है',
      'crop health',
      'fasal ka haal batao',
      'mera crop healthy hai',
      'खेती कैसी चल रही है',
      'meri fasal thik hai',
      'gehu theek hai',
      'health report',
      'fasal ki sehat'
    ],
    keywords: ['health', 'sehat', 'kaisi hai', 'thik hai', 'haal batao', 'bimari', 'vitality', 'swasthya']
  },
  {
    intent: 'HEALTH_REASON',
    category: 'health',
    examples: [
      'फसल खराब क्यों हो रही है',
      'health kam kyu hai',
      'kya bimari hai',
      'yellow leaves kyu hai',
      'patte pile kyu hai',
      'problem kya hai'
    ],
    keywords: ['kyu', 'reason', 'problem', 'pila', 'kamzor', 'kharab']
  },
  {
    intent: 'WATER_STATUS',
    category: 'water',
    examples: [
      'पानी देना है',
      'आज सिंचाई करनी है',
      'fasal ko pani chahiye',
      'water status',
      'mitti sukhi hai',
      'irrigation karu',
      'aaj paani lagau',
      'nami kitni hai'
    ],
    keywords: ['pani', 'water', 'sinchai', 'irrigation', 'nami', 'sukhi', 'moisture', 'paani']
  },
  {
    intent: 'IRRIGATION_HELP',
    category: 'water',
    examples: [
      'सिंचाई कब करनी चाहिए',
      'sinchai ka sahi samay',
      'how to irrigate',
      'pani kab du',
      'pani dene ka time'
    ],
    keywords: ['kab du', 'time', 'samay', 'how much water', 'kitna pani']
  },
  {
    intent: 'WEATHER',
    category: 'weather',
    examples: [
      'आज मौसम कैसा है',
      'aaj ka mausam',
      'weather batao',
      'aaj mausam kaisa rahega',
      'badal hai kya',
      'dhoop niklegi'
    ],
    keywords: ['mausam', 'weather', 'badal', 'dhoop', 'hawa', 'forecast']
  },
  {
    intent: 'RAIN_CHANCE',
    category: 'weather',
    examples: [
      'बारिश होगी क्या',
      'aaj barish hogi',
      'rain chance',
      'kya barish aane wali hai',
      'barsat hogi'
    ],
    keywords: ['barish', 'barsat', 'rain', 'precipitation', 'pani barsega']
  },
  {
    intent: 'TEMPERATURE',
    category: 'weather',
    examples: [
      'तापमान कितना है',
      'temperature kya hai',
      'aaj kitni garmi hai',
      'kitna temperature hai'
    ],
    keywords: ['temperature', 'tapman', 'garmi', 'sardi', 'degrees']
  },
  {
    intent: 'FARM_LOCATION',
    category: 'farm',
    action: 'OPEN_FARM',
    examples: [
      'मेरा खेत कहां है',
      'farm dikhao',
      'mera khet dikhao',
      'location batao',
      'map kholo',
      'satellite map dikhao',
      'khet ka naksha'
    ],
    keywords: ['khet', 'farm', 'map', 'naksha', 'location', 'satellite', 'plot', 'jagah']
  },
  {
    intent: 'OPEN_FARM',
    category: 'navigation',
    action: 'OPEN_FARM',
    examples: [
      'farm map kholo',
      'open farm',
      'mera khet page',
      'map par jao'
    ],
    keywords: ['open farm', 'khet kholo', 'map kholo']
  },
  {
    intent: 'OPEN_HEALTH',
    category: 'navigation',
    action: 'OPEN_HEALTH',
    examples: [
      'health dikhao',
      'crop health kholo',
      'analysis dikhao',
      'फसल की रिपोर्ट दिखाओ',
      'open health'
    ],
    keywords: ['open health', 'health kholo', 'report dikhao', 'sehat kholo']
  },
  {
    intent: 'CHANGE_CROP',
    category: 'navigation',
    action: 'OPEN_CROPS',
    examples: [
      'crop change karna hai',
      'फसल बदलनी है',
      'dusri fasal select karo',
      'change crop',
      'naye fasal chuno'
    ],
    keywords: ['change crop', 'fasal badlo', 'dusri fasal', 'crop badalna']
  },
  {
    intent: 'ADD_CROP',
    category: 'navigation',
    action: 'OPEN_CROPS',
    examples: [
      'nayee fasal jodein',
      'add crop',
      'khet me nayi fasal lagayi hai',
      'add new crop'
    ],
    keywords: ['add crop', 'nayi fasal', 'fasal jodo', 'new crop']
  },
  {
    intent: 'TAKE_PHOTO',
    category: 'navigation',
    action: 'OPEN_CAMERA',
    examples: [
      'photo se check karo',
      'camera kholo',
      'patti ki photo lo',
      'check crop photo',
      'take photo'
    ],
    keywords: ['photo', 'camera', 'patti', 'leaf scan', 'tasveer', 'scanner']
  },
  {
    intent: 'WHAT_TO_DO',
    category: 'general',
    examples: [
      'आज मुझे क्या करना चाहिए',
      'ab kya karu',
      'kya karna hai',
      'aaj ka kaam batao',
      'fasal ke liye kya karu',
      'today actions'
    ],
    keywords: ['kya karu', 'aaj kya karna', 'what to do', 'salah', 'advice', 'kaam batao']
  },
  {
    intent: 'LATEST_ALERT',
    category: 'health',
    examples: [
      'koi alert hai kya',
      'urgent notice',
      'kya khatra hai',
      'latest warnings'
    ],
    keywords: ['alert', 'warning', 'khatra', 'urgent', 'suchna']
  },
  {
    intent: 'DISEASE_STATUS',
    category: 'health',
    action: 'OPEN_CAMERA',
    examples: [
      'koi bimari to nahi hai',
      'keet lage hain',
      'pest attack',
      'fungus to nahi hai',
      'rust bimari'
    ],
    keywords: ['keet', 'pest', 'bimari', 'fungus', 'disease', 'kida', 'rog']
  },
  {
    intent: 'GROWTH_STATUS',
    category: 'crop',
    examples: [
      'fasal ki growth kaisi hai',
      'paidawar kitni hogi',
      'growth stage',
      'fasal kitne din ki hui'
    ],
    keywords: ['growth', 'paidawar', 'yield', 'badhwar', 'stage', 'din']
  },
  {
    intent: 'HOW_TO_USE_GROOT',
    category: 'help',
    examples: [
      'GROOT कैसे इस्तेमाल करूं',
      'groot kaise use karu',
      'how to use groot',
      'ye app kaise chalate hai',
      'mujhe samjhao'
    ],
    keywords: ['kaise use', 'how to use', 'kaise chalaye', 'app kya hai', 'guide']
  },
  {
    intent: 'HOW_TO_SELECT_FARM',
    category: 'help',
    examples: [
      'khet kaise select karu',
      'location kaise badlu',
      'map par khet kaise khoje'
    ],
    keywords: ['khet select', 'map search', 'location select']
  },
  {
    intent: 'HOW_TO_ADD_CROP',
    category: 'help',
    examples: [
      'fasal kaise jode',
      'crop add kaise kare'
    ],
    keywords: ['crop add', 'fasal jodna']
  },
  {
    intent: 'TECHNICAL_DETAILS',
    category: 'help',
    examples: [
      'NDVI kya hota hai',
      'satellite data kya hai',
      'technical details dikhao',
      'sensor data'
    ],
    keywords: ['ndvi', 'satellite', 'spectral', 'sensor', 'technical']
  },
  {
    intent: 'HELP',
    category: 'help',
    examples: [
      'help',
      'madad',
      'sahayata',
      'kya poochh sakta hoon'
    ],
    keywords: ['help', 'madad', 'sahayata', 'kya pooch']
  },
  {
    intent: 'THANK_YOU',
    category: 'general',
    examples: [
      'dhanyawad',
      'shukriya',
      'thank you',
      'thanks',
      'bahut accha'
    ],
    keywords: ['dhanyawad', 'shukriya', 'thanks', 'thank you', 'accha laga']
  }
];
