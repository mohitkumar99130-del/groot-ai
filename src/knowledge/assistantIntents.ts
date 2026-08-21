export interface AssistantIntent {
  intent: string;
  category: 'crop' | 'health' | 'water' | 'weather' | 'farm' | 'navigation' | 'help' | 'general';
  action?: 'OPEN_FARM_MAP' | 'OPEN_CROP_HEALTH' | 'OPEN_CAMERA' | 'OPEN_CROP_SELECTOR' | 'OPEN_ADD_CROP';
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
      'pranam',
      'kem cho'
    ],
    keywords: ['namaste', 'hello', 'hi', 'pranam', 'ram ram', 'radhe', 'sat sri akal', 'kem cho']
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
      'meri fasal ka naam',
      'maine kaunsi crop select ki hai',
      'active crop'
    ],
    keywords: ['kaunsi fasal', 'mera crop', 'active crop', 'current crop', 'fasal ka naam', 'crop name', 'meri fasal']
  },
  {
    intent: 'LAST_ADDED_CROP',
    category: 'crop',
    examples: [
      'मैंने कौन सी crop add की है',
      'मेरी नई crop कौन सी है',
      'meri new crop konsi hai',
      'aakhiri fasal kaun si jodi',
      'last added crop'
    ],
    keywords: ['add ki hai', 'new crop', 'nayi fasal', 'last added', 'aakhiri fasal']
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
      'variety name',
      'kaunsi variety boi hai'
    ],
    keywords: ['variety', 'kisam', 'kism', 'seed variety', 'kaunsi variety', 'beej']
  },
  {
    intent: 'CROP_CATEGORY',
    category: 'crop',
    examples: [
      'गेहूँ किस तरह की फसल है',
      'crop category kya hai',
      'ye rabi fasal hai ya kharif',
      'fasal ka varg',
      'anaj hai ya daal'
    ],
    keywords: ['kis tarah ki', 'category', 'varg', 'rabi', 'kharif', 'anaj', 'dal']
  },
  {
    intent: 'AVAILABLE_CROPS',
    category: 'crop',
    examples: [
      'कौन-कौन सी फसल available है',
      'app me kaunsi fasle hain',
      'available crops',
      'sari faslo ki list',
      'all crops in groot'
    ],
    keywords: ['available', 'kaun kaun si', 'all crops', 'list', 'fasle available']
  },
  {
    intent: 'MAJOR_CROPS',
    category: 'crop',
    examples: [
      'major crops कौन सी हैं',
      'mukhya fasle kaun si hain',
      'pramukh fasal',
      'main crops',
      'top crops'
    ],
    keywords: ['major crops', 'mukhya fasal', 'main crop', 'pramukh', 'top crops']
  },
  {
    intent: 'CROP_HEALTH',
    category: 'health',
    action: 'OPEN_CROP_HEALTH',
    examples: [
      'मेरी फसल कैसी है',
      'फसल ठीक है',
      'crop health kya hai',
      'fasal ka haal batao',
      'mera crop healthy hai',
      'खेती कैसी चल रही है',
      'meri fasal thik hai',
      'गेहूँ ठीक है',
      'health report',
      'fasal ki sehat',
      'meri fasal me koi dikkat hai'
    ],
    keywords: ['health', 'sehat', 'kaisi hai', 'thik hai', 'haal batao', 'bimari', 'dikkat', 'swasthya', 'vitality']
  },
  {
    intent: 'HEALTH_REASON',
    category: 'health',
    examples: [
      'फसल खराब क्यों हो रही है',
      'health kam kyu hai',
      'kya dikkat hai',
      'yellow leaves kyu hai',
      'patte pile kyu hai',
      'problem kya hai',
      'sehat me kami ka karan'
    ],
    keywords: ['kyu', 'reason', 'problem', 'pila', 'kamzor', 'kharab', 'karan', 'dikkat']
  },
  {
    intent: 'WATER_STATUS',
    category: 'water',
    examples: [
      'पानी देना है',
      'आज पानी देना चाहिए',
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
      'बारिश होगी',
      'aaj barish hogi',
      'rain chance',
      'kya barish aane wali hai',
      'barsat hogi kya'
    ],
    keywords: ['barish', 'barsat', 'rain', 'precipitation', 'pani barsega']
  },
  {
    intent: 'TEMPERATURE',
    category: 'weather',
    examples: [
      'तापमान कितना है',
      'temperature kitna hai',
      'temperature kya hai',
      'aaj kitni garmi hai',
      'kitna temperature hai'
    ],
    keywords: ['temperature', 'tapman', 'garmi', 'sardi', 'degrees']
  },
  {
    intent: 'FARM_LOCATION',
    category: 'farm',
    action: 'OPEN_FARM_MAP',
    examples: [
      'मेरा खेत कहाँ है',
      'farm dikhao',
      'mera khet dikhao',
      'location batao',
      'satellite map kholo',
      'khet ka naksha',
      'map par mera khet'
    ],
    keywords: ['khet', 'farm', 'map', 'naksha', 'location', 'satellite', 'plot', 'jagah', 'kahan hai']
  },
  {
    intent: 'OPEN_FARM',
    category: 'navigation',
    action: 'OPEN_FARM_MAP',
    examples: [
      'farm map kholo',
      'open farm',
      'mera khet page',
      'map par jao',
      'satellite map खोलो'
    ],
    keywords: ['open farm', 'khet kholo', 'map kholo', 'satellite map']
  },
  {
    intent: 'FARM_AREA',
    category: 'farm',
    examples: [
      'मेरा खेत कितना बड़ा है',
      'khet ka area kitna hai',
      'total acres kitne hain',
      'khet ka size batao',
      'farm area'
    ],
    keywords: ['kitna bada', 'area', 'acres', 'hectare', 'size', 'bigha']
  },
  {
    intent: 'ADD_CROP',
    category: 'navigation',
    action: 'OPEN_ADD_CROP',
    examples: [
      'नई फसल कैसे जोड़ूं',
      'nayee fasal jodein',
      'add crop',
      'khet me nayi fasal lagayi hai',
      'add new crop'
    ],
    keywords: ['add crop', 'nayi fasal', 'fasal jodo', 'new crop', 'kaise jodu']
  },
  {
    intent: 'CHANGE_CROP',
    category: 'navigation',
    action: 'OPEN_CROP_SELECTOR',
    examples: [
      'crop बदलो',
      'crop change karna hai',
      'फसल बदलनी है',
      'dusri fasal select karo',
      'change crop'
    ],
    keywords: ['change crop', 'fasal badlo', 'dusri fasal', 'crop badalna', 'badlo']
  },
  {
    intent: 'TAKE_PHOTO',
    category: 'navigation',
    action: 'OPEN_CAMERA',
    examples: [
      'फोटो से फसल check करनी है',
      'camera kholo',
      'patti ki photo lo',
      'check crop photo',
      'take photo'
    ],
    keywords: ['photo', 'camera', 'patti', 'leaf scan', 'tasveer', 'scanner']
  },
  {
    intent: 'TODAY_ACTIONS',
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
      'कोई alert है क्या',
      'urgent notice',
      'kya khatra hai',
      'latest warnings',
      'khet me koi alert'
    ],
    keywords: ['alert', 'warning', 'khatra', 'urgent', 'suchna']
  },
  {
    intent: 'DISEASE_STATUS',
    category: 'health',
    action: 'OPEN_CAMERA',
    examples: [
      'कोई बीमारी तो नहीं है',
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
      'GROOT कैसे इस्तेमाल करें',
      'groot kaise use karu',
      'how to use groot',
      'ye app kaise chalate hai',
      'mujhe samjhao'
    ],
    keywords: ['kaise use', 'how to use', 'kaise chalaye', 'app kya hai', 'guide', 'kaise istemal']
  },
  {
    intent: 'HOW_TO_ADD_CROP',
    category: 'help',
    action: 'OPEN_ADD_CROP',
    examples: [
      'fasal kaise jode',
      'crop add kaise kare',
      'nayi fasal jodna batao'
    ],
    keywords: ['crop add kaise', 'fasal kaise jode']
  },
  {
    intent: 'HOW_TO_SELECT_FARM',
    category: 'help',
    action: 'OPEN_FARM_MAP',
    examples: [
      'location कैसे बदलूं',
      'khet kaise select karu',
      'location kaise badlu',
      'map par khet kaise khoje'
    ],
    keywords: ['location kaise', 'khet select', 'map search', 'location badlu']
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
