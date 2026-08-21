import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Square, 
  RotateCcw, 
  Keyboard, 
  Send, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  AppLanguage, 
  FarmPlot, 
  FusionResult, 
  FieldZone, 
  SensorTelemetry, 
  LeafSample, 
  RealtimeWeather,
  AppNavigationTab 
} from '../../types/groot';
import { CropVariety } from '../../types/crops';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';
import { getLanguageMeta, getMultilingualVoiceScripts } from '../../services/languageService';

interface ConversationalVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlot: FarmPlot;
  variety: CropVariety;
  fusion: FusionResult;
  zone: FieldZone;
  telemetry: SensorTelemetry;
  leaf: LeafSample;
  weather: RealtimeWeather;
  language: AppLanguage;
  onNavigateTab: (tab: AppNavigationTab) => void;
  onOpenCamera: () => void;
}

interface MessageBubble {
  id: string;
  sender: 'user' | 'groot';
  text: string;
  time: string;
  actionButton?: {
    label: string;
    tab: AppNavigationTab;
  };
}

export const ConversationalVoiceModal: React.FC<ConversationalVoiceModalProps> = ({
  isOpen,
  onClose,
  currentPlot,
  variety,
  fusion,
  zone,
  telemetry,
  leaf,
  weather,
  language,
  onNavigateTab,
}) => {
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [typedInput, setTypedInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const langMeta = getLanguageMeta(language);
  const isHi = language === 'hi';

  const scripts = getMultilingualVoiceScripts(language, fusion, zone, telemetry, leaf, variety, weather);

  // Initialize initial greeting message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg: MessageBubble = {
        id: 'msg_welcome',
        sender: 'groot',
        text: scripts.welcome,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMsg]);
      // Speak welcome greeting
      realVoiceService.speak(scripts.welcome, language, () => {
        setVoiceState('idle');
      });
      setVoiceState('speaking');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      realVoiceService.stop();
    };
  }, []);

  const handleStopSpeaking = () => {
    audio.playClick();
    realVoiceService.stop();
    setVoiceState('idle');
  };

  const handleReplayLast = () => {
    const lastGrootMsg = [...messages].reverse().find(m => m.sender === 'groot');
    if (lastGrootMsg) {
      audio.playClick();
      setVoiceState('speaking');
      realVoiceService.speak(lastGrootMsg.text, language, () => {
        setVoiceState('idle');
      });
    }
  };

  // Start Speech Recognition
  const startListening = () => {
    audio.playPulse();
    setSpeechError(null);

    // If currently speaking, stop it (interruption)
    realVoiceService.stop();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please type below.');
      setShowTextInput(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = langMeta.speechCode;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setVoiceState('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          processUserQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone or type your question.');
        } else {
          setSpeechError('Could not understand audio clearly. Please try again or type.');
        }
        setVoiceState('idle');
      };

      recognition.onend = () => {
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      };

      recognition.start();
    } catch (e: any) {
      console.error('Failed to start speech recognition:', e);
      setSpeechError('Microphone error. You can type your question.');
      setVoiceState('idle');
      setShowTextInput(true);
    }
  };

  // Context-aware AI Reasoning & Intent Handler
  const processUserQuery = (query: string) => {
    setVoiceState('processing');
    const userMsg: MessageBubble = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);

    const q = query.toLowerCase();
    let responseText = '';
    let actionBtn: { label: string; tab: AppNavigationTab } | undefined = undefined;

    // 1. Health Intent
    if (q.includes('health') || q.includes('sehat') || q.includes('kaisi hai') || q.includes('bimari') || q.includes('ਸਿਹਤ') || q.includes('ஆரோக்கியம்') || q.includes('ఆరోగ్యం')) {
      responseText = scripts.health;
      actionBtn = { label: isHi ? 'फसल सेहत पेज खोलें' : 'Open Crop Health Page', tab: 'crop_health' };
    }
    // 2. Water / Irrigation Intent
    else if (q.includes('water') || q.includes('paani') || q.includes('irrigation') || q.includes('sinchai') || q.includes('pani') || q.includes('తడి') || q.includes('பாசனம்')) {
      responseText = `${scripts.weather} ${scripts.health}`;
      actionBtn = { label: isHi ? 'सिंचाई पेज देखें' : 'View Water & Irrigation', tab: 'water_irrigation' };
    }
    // 3. Fertilizer Intent
    else if (q.includes('khad') || q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('यूरिया') || q.includes('ఎరువులు') || q.includes('உரம்')) {
      responseText = scripts.fertilizer;
      actionBtn = { label: isHi ? 'खाद खुराक कैलकुलेटर' : 'Open Fertilizer Rx', tab: 'growth_yield' };
    }
    // 4. Map / Field Intent
    else if (q.includes('khet') || q.includes('farm') || q.includes('map') || q.includes('naksha') || q.includes('field')) {
      responseText = isHi
        ? `आपका ${currentPlot.name} (${currentPlot.locationName}) में स्थित है। कुल क्षेत्रफल ${currentPlot.areaHa} हेक्टेयर है। आइए नक्शा देखते हैं।`
        : `Your field ${currentPlot.name} is located in ${currentPlot.locationName}. Opening satellite farm map now.`;
      actionBtn = { label: isHi ? 'मेरा खेत नक्शा खोलें' : 'Open My Farm Map', tab: 'my_farm' };
    }
    // 5. Photo / Disease check
    else if (q.includes('photo') || q.includes('camera') || q.includes('patti') || q.includes('leaf')) {
      responseText = isHi
        ? `बिल्कुल! पत्ती की फोटो लें। GROOT AI कैमरा 5 सेकंड में बीमारी पहचान लेगा।`
        : `Sure! Capture a clear leaf photo with your camera to diagnose crop disease.`;
      actionBtn = { label: isHi ? 'फोटो स्कैनर चालू करें' : 'Open Photo Scanner', tab: 'pest_disease' };
    }
    // Default 360 Full Field Audit
    else {
      responseText = scripts.fullAudit;
      actionBtn = { label: isHi ? 'विस्तृत रिपोर्ट देखें' : 'View Full Report', tab: 'crop_health' };
    }

    setTimeout(() => {
      const grootMsg: MessageBubble = {
        id: `groot_${Date.now()}`,
        sender: 'groot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: actionBtn,
      };

      setMessages(prev => [...prev, grootMsg]);
      setVoiceState('speaking');

      realVoiceService.speak(responseText, language, () => {
        setVoiceState('idle');
      });
    }, 600);
  };

  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    const text = typedInput.trim();
    setTypedInput('');
    processUserQuery(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => {
          realVoiceService.stop();
          onClose();
        }}
      />

      {/* Main Conversational Modal Window */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#030e07] border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/20 bg-gradient-to-r from-slate-950 via-emerald-950/70 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20">
              <Mic className="w-5 h-5 text-slate-950" />
              {voiceState === 'speaking' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="font-display font-black text-base sm:text-lg text-white flex items-center gap-2">
                <span>🎙️ Ask GROOT Assistant</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {langMeta.flagEmoji} {langMeta.nativeName}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{variety.iconEmoji} {variety.varietyName}</span>
                <span>•</span>
                <span>{currentPlot.name}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              realVoiceService.stop();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Conversation Bubbles */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[420px] bg-[#020b06]/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[82%] p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-900/90 text-slate-100 border border-emerald-500/30 rounded-bl-none'
                }`}
              >
                <div className="font-sans font-medium whitespace-pre-wrap">{msg.text}</div>
                
                {/* Embedded Action Button in GROOT response */}
                {msg.actionButton && (
                  <button
                    onClick={() => {
                      audio.playClick();
                      realVoiceService.stop();
                      onClose();
                      onNavigateTab(msg.actionButton!.tab);
                    }}
                    className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>{msg.actionButton.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}

          {/* Processing Indicator */}
          {voiceState === 'processing' && (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30 w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>{isHi ? 'GROOT समझ रहा है...' : 'GROOT is analyzing your crop context...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error notice if any */}
        {speechError && (
          <div className="px-4 py-2 bg-rose-950/60 border-t border-rose-500/30 text-[11px] text-rose-300 flex items-center justify-between">
            <span>⚠️ {speechError}</span>
            <button
              onClick={() => setSpeechError(null)}
              className="text-rose-400 underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="p-2 sm:px-4 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0 pl-1">
            {isHi ? 'पूछें:' : 'Ask:'}
          </span>
          <button
            onClick={() => processUserQuery(isHi ? 'मेरी फसल की सेहत कैसी है?' : 'How is my crop health?')}
            className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 shrink-0 transition-all"
          >
            🌾 {isHi ? 'फसल सेहत' : 'Crop Health'}
          </button>
          <button
            onClick={() => processUserQuery(isHi ? 'आज खेत में पानी देना चाहिए?' : 'Should I irrigate today?')}
            className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 shrink-0 transition-all"
          >
            💧 {isHi ? 'पानी व सिंचाई' : 'Irrigation Check'}
          </button>
          <button
            onClick={() => processUserQuery(isHi ? 'खाद की कितनी मात्रा डालूँ?' : 'What fertilizer dosage to apply?')}
            className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] text-amber-300 border border-amber-500/30 hover:border-amber-400 shrink-0 transition-all"
          >
            🧪 {isHi ? 'खाद खुराक' : 'Fertilizer Guide'}
          </button>
          <button
            onClick={() => processUserQuery(isHi ? 'मेरा खेत का नक्शा दिखाओ' : 'Show my farm map')}
            className="px-2.5 py-1 rounded-full bg-slate-900 text-[11px] text-slate-300 border border-slate-700 hover:border-slate-500 shrink-0 transition-all"
          >
            🗺️ {isHi ? 'खेत नक्शा' : 'Farm Map'}
          </button>
        </div>

        {/* Main Central Tactile Action Stage */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-slate-950 to-[#020b06] border-t border-emerald-500/20 text-center space-y-4">
          
          {/* Central Pulsing Microphone Button */}
          <div className="flex items-center justify-center gap-4">
            
            {/* Replay audio button */}
            <button
              onClick={handleReplayLast}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
              title="Replay Spoken Advisory"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Giant Central Microphone Trigger */}
            <button
              onClick={() => {
                if (voiceState === 'speaking') {
                  handleStopSpeaking();
                } else if (voiceState === 'listening') {
                  if (recognitionRef.current) {
                    try { recognitionRef.current.stop(); } catch (e) {}
                  }
                  setVoiceState('idle');
                } else {
                  startListening();
                }
              }}
              className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl transition-all shadow-2xl ${
                voiceState === 'listening'
                  ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-400/50 scale-105'
                  : voiceState === 'speaking'
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 ring-4 ring-amber-400/40 animate-pulse'
                  : 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-slate-950 hover:scale-105 active:scale-95 ring-4 ring-emerald-300/30'
              }`}
            >
              {voiceState === 'speaking' ? (
                <Square className="w-8 h-8 fill-current text-slate-950" />
              ) : voiceState === 'listening' ? (
                <MicOff className="w-9 h-9 animate-bounce text-white" />
              ) : (
                <Mic className="w-10 h-10 text-slate-950" />
              )}
            </button>

            {/* Stop audio button */}
            <button
              onClick={handleStopSpeaking}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
              title="Stop Speech"
            >
              <Square className="w-5 h-5" />
            </button>
          </div>

          {/* Voice State Label */}
          <div>
            <div className="font-display font-black text-sm sm:text-base text-white">
              {voiceState === 'listening'
                ? (isHi ? '🎙️ बोलिए, मैं सुन रहा हूँ...' : '🎙️ Listening... speak naturally')
                : voiceState === 'processing'
                ? (isHi ? '✨ समझ रहा हूँ...' : '✨ Understanding your request...')
                : voiceState === 'speaking'
                ? (isHi ? '🔊 GROOT बोल रहा है... (रोकने के लिए दबाएं)' : '🔊 GROOT is speaking... (tap to stop)')
                : (isHi ? 'बटन दबाकर बोलें / Tap mic to speak' : 'Tap microphone & ask your question')}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isHi ? 'हिन्दी, पंजाबी, बंगाली सहित 13 भाषाओं में बातचीत करें' : 'Talk naturally in 13 Indian regional languages'}
            </p>
          </div>

          {/* Optional Text Input Toggle */}
          {showTextInput ? (
            <form onSubmit={handleSendTyped} className="flex items-center gap-2 max-w-lg mx-auto pt-1">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder={isHi ? 'यहाँ अपना सवाल लिखें...' : 'Type your farming question here...'}
                className="flex-1 bg-slate-900 border border-emerald-500/40 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                className="p-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowTextInput(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono underline flex items-center justify-center gap-1 mx-auto"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{isHi ? '⌨️ बोलकर नहीं, लिखकर पूछें (Type instead)' : '⌨️ Type your question instead'}</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
