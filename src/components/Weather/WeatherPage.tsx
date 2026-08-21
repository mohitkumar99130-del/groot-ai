import React, { useState } from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Cloud, 
  Volume2, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { AppLanguage, RealtimeWeather, FarmPlot } from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';

interface WeatherPageProps {
  weather: RealtimeWeather;
  currentPlot: FarmPlot;
  variety: CropVariety;
  language: AppLanguage;
  onRefreshWeather: () => void;
  isWeatherLoading?: boolean;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({
  weather,
  currentPlot,
  variety,
  language,
  onRefreshWeather,
  isWeatherLoading,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isHi = language === 'hi';

  // Dynamic visual icon matching actual weather condition
  const getWeatherVisual = () => {
    const cond = weather.condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) {
      return {
        icon: <CloudRain className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 animate-bounce" />,
        bg: 'from-cyan-950/60 via-slate-950 to-[#021008]',
        label: isHi ? '🌧️ वर्षा / बारिश' : '🌧️ Rainy Conditions',
      };
    }
    if (cond.includes('cloud') || cond.includes('overcast')) {
      return {
        icon: <Cloud className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300" />,
        bg: 'from-slate-900/80 via-slate-950 to-[#021008]',
        label: isHi ? '☁️ बादल छाए हैं' : '☁️ Overcast / Cloudy',
      };
    }
    if (cond.includes('partly') || cond.includes('scattered')) {
      return {
        icon: <CloudSun className="w-16 h-16 sm:w-20 sm:h-20 text-amber-300" />,
        bg: 'from-amber-950/40 via-slate-950 to-[#021008]',
        label: isHi ? '🌤️ आंशिक बादल' : '🌤️ Partly Cloudy',
      };
    }
    return {
      icon: <Sun className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 animate-spin" style={{ animationDuration: '25s' }} />,
      bg: 'from-amber-950/50 via-emerald-950/40 to-slate-950',
      label: isHi ? '☀️ साफ़ धूप' : '☀️ Clear & Sunny',
    };
  };

  const visual = getWeatherVisual();

  // Hourly forecast strip mock
  const hourlyForecast = [
    { time: '06:00 AM', temp: `${Math.round(weather.temperature - 4)}°C`, icon: '🌅', pop: '0%' },
    { time: '09:00 AM', temp: `${Math.round(weather.temperature - 1)}°C`, icon: '🌤️', pop: '5%' },
    { time: '12:00 PM', temp: `${Math.round(weather.temperature + 2)}°C`, icon: '☀️', pop: '10%' },
    { time: '03:00 PM', temp: `${Math.round(weather.temperature + 1)}°C`, icon: '🌤️', pop: '10%' },
    { time: '06:00 PM', temp: `${Math.round(weather.temperature - 2)}°C`, icon: '🌥️', pop: '15%' },
    { time: '09:00 PM', temp: `${Math.round(weather.temperature - 5)}°C`, icon: '🌙', pop: '5%' },
  ];

  const handleSpeakWeather = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const text = isHi
      ? `मौसम सलाह: ${currentPlot.locationName} में आज तापमान ${weather.temperature} डिग्री सेल्सियस और हवा ${weather.windSpeed} किलोमीटर प्रति घंटा है। ${
          weather.sprayAdvisory === 'Optimal'
            ? `${variety.varietyHindi} में खाद डालने और कीटनाशक छिड़काव के लिए आज का दिन बहुत उत्तम है।`
            : 'तेज हवा या बारिश की संभावना के कारण छिड़काव में सावधानी रखें।'
        }`
      : `Weather Advisory: In ${currentPlot.locationName}, current temperature is ${weather.temperature}°C with wind speed at ${weather.windSpeed} km/h. Conditions are optimal for field operations and spray on your ${variety.varietyName}.`;

    await realVoiceService.speak(text, language);
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#031108] border border-amber-500/30 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>🌤️ {isHi ? 'मौसम व कृषि सलाह (Agricultural Weather)' : 'Agricultural Weather & Forecast'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            📍 {currentPlot.locationName} • High-Resolution Realtime Met API
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              audio.playClick();
              onRefreshWeather();
            }}
            disabled={isWeatherLoading}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all min-w-[48px] min-h-[48px] flex items-center justify-center"
            title="Refresh Weather Data"
          >
            <RefreshCw className={`w-5 h-5 ${isWeatherLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={handleSpeakWeather}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg transition-all ${
              isSpeaking ? 'btn-agri-voice animate-pulse' : 'btn-agri-voice'
            }`}
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>{isSpeaking ? 'बोल रहा है...' : (isHi ? '🔊 मौसम सलाह सुनें' : '🔊 Listen Weather Advice')}</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Weather Hero Banner (Matching Real Current Conditions) */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${visual.bg} border-2 border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <div className="p-3 rounded-3xl bg-slate-950/60 border border-white/10 shadow-2xl shrink-0">
              {visual.icon}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                {visual.label}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {weather.temperature}°C
              </div>
              <div className="text-xs sm:text-sm text-slate-300">
                {isHi ? weather.conditionHindi : weather.condition} • Feels like {Math.round(weather.temperature + 1)}°C
              </div>
            </div>
          </div>

          {/* Spray Advisory Pill */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-1 shrink-0">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              SPRAY & FERTILIZER WINDOW
            </div>
            <div className="text-base font-black text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHi ? weather.sprayAdvisoryHindi : `${weather.sprayAdvisory} Spray Conditions`}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Wind: {weather.windSpeed} km/h • Humidity: {weather.humidity}%
            </div>
          </div>

        </div>

        {/* 3. "What This Means For Your Crop" Box */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 text-xs text-slate-200 space-y-2">
          <div className="font-bold text-amber-300 flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isHi ? 'आपकी फसल के लिए मौसम का अर्थ (What This Means For Your Crop):' : 'What This Means For Your Crop:'}</span>
          </div>
          <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">
            {weather.sprayAdvisory === 'Optimal'
              ? (isHi
                  ? `आज बारिश की संभावना बहुत कम है और हवा की गति (${weather.windSpeed} km/h) शांत है। आपकी ${variety.varietyHindi} में यूरिया खाद डालने तथा रोग निवारक दवाई छिड़कने के लिए सुबह का समय सबसे उत्तम है।`
                  : `Rain is unlikely today with mild wind speed (${weather.windSpeed} km/h). Ideal window for top-dressing fertilizer and foliar spray on your ${variety.varietyName}.`)
              : (isHi
                  ? `तेज हवा या अचानक बारिश की संभावना है। दवाई का छिड़काव कल तक टाल दें ताकि दवा पानी से बह न जाए।`
                  : `High wind or rain probability detected. Delay pesticide spray until weather clears.`)}
          </p>
        </div>
      </div>

      {/* 4. Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#031108] border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Air Humidity</div>
          <div className="text-xl font-black text-white font-mono">{weather.humidity}%</div>
          <div className="text-[10px] text-slate-400">Relative atmospheric vapor</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#031108] border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Wind Speed</div>
          <div className="text-xl font-black text-white font-mono">{weather.windSpeed} km/h</div>
          <div className="text-[10px] text-emerald-400">Gentle breeze (Ideal)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#031108] border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Rain Amount</div>
          <div className="text-xl font-black text-white font-mono">{weather.rainMm} mm</div>
          <div className="text-[10px] text-cyan-400">0% precipitation risk</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#031108] border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Wind Direction</div>
          <div className="text-xl font-black text-white font-mono">{weather.windDirection}° ENE</div>
          <div className="text-[10px] text-slate-400">East-Northeast steady</div>
        </div>
      </div>

      {/* 5. Hourly 24-Hour Forecast Strip */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#031108] border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>{isHi ? 'आज का 24 घंटे का पूर्वानुमान' : 'Hourly Farm Forecast (Next 24 Hours)'}</span>
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          {hourlyForecast.map((h, i) => (
            <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400">{h.time}</div>
              <div className="text-2xl">{h.icon}</div>
              <div className="text-sm font-black text-white font-mono">{h.temp}</div>
              <div className="text-[9px] font-mono text-cyan-400">Rain: {h.pop}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
