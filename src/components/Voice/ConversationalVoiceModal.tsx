import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  RotateCcw, 
  Keyboard, 
  Send, 
  Sparkles, 
  ArrowRight,
  Square
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
import { getLanguageMeta } from '../../services/languageService';
import { processAssistantQuery } from '../../services/localAssistantEngine';
import { AssistantResponseOutput } from '../../knowledge/responseTemplates';

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
  onOpenCamera?: () => void;
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
  const [currentResponse, setCurrentResponse] = useState<AssistantResponseOutput | null>(null);
  const [userQueryText, setUserQueryText] = useState<string>('');
  const [typedInput, setTypedInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const langMeta = getLanguageMeta(language);
  const isHi = language === 'hi';

  const appContext = {
    activePlot: currentPlot,
    activeCrop: variety,
    fusionResult: fusion,
    weather,
    telemetry,
    selectedZone: zone,
    activeLeaf: leaf,
    language,
  };

  // On initial open, introduce GROOT in conversational voice
  useEffect(() => {
    if (isOpen && !currentResponse) {
      const initialResponse = processAssistantQuery('नमस्ते', appContext);
      setCurrentResponse(initialResponse);
      setVoiceState('speaking');
      realVoiceService.speak(initialResponse.speechText, language, () => {
        setVoiceState('idle');
      });
    }
  }, [isOpen]);

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

  const handleReplay = () => {
    if (currentResponse) {
      audio.playClick();
      setVoiceState('speaking');
      realVoiceService.speak(currentResponse.speechText, language, () => {
        setVoiceState('idle');
      });
    }
  };

  // Start speech recognition
  const startListening = () => {
    audio.playPulse();
    setSpeechError(null);
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
          handleExecuteQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. You can type your question.');
        } else {
          setSpeechError('Could not hear clearly. Please try again.');
        }
        setVoiceState('idle');
      };

      recognition.onend = () => {
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      };

      recognition.start();
    } catch (e) {
      setSpeechError('Microphone error. Please type below.');
      setVoiceState('idle');
      setShowTextInput(true);
    }
  };

  // Execute Rule-Based Local Assistant Query
  const handleExecuteQuery = (query: string) => {
    setUserQueryText(query);
    setVoiceState('processing');

    setTimeout(() => {
      const res = processAssistantQuery(query, appContext);
      setCurrentResponse(res);
      setVoiceState('speaking');

      realVoiceService.speak(res.speechText, language, () => {
        setVoiceState('idle');
      });
    }, 300);
  };

  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    const text = typedInput.trim();
    setTypedInput('');
    handleExecuteQuery(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      
      {/* Modal Window */}
      <div className="relative w-full max-w-xl bg-white border border-[#DDE6DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#DDE6DD] flex items-center justify-between bg-[#F6F8F2]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1F6B45] text-white font-bold text-lg shadow-sm">
              🌱
            </div>
            <div>
              <h2 className="font-bold text-base text-[#1B2520] flex items-center gap-2">
                <span>{isHi ? 'GROOT से पूछें' : 'Ask GROOT Assistant'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF4EC] text-[#1F6B45] border border-[#DDE6DD]">
                  {langMeta.nativeName}
                </span>
              </h2>
              <p className="text-xs text-[#66756D]">
                {variety.cropName} • {currentPlot.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              realVoiceService.stop();
              onClose();
            }}
            className="p-2 rounded-xl text-[#66756D] hover:text-[#1B2520] hover:bg-[#DDE6DD]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Display Stage */}
        <div className="p-5 sm:p-6 space-y-5 text-center">
          
          {/* User Question (if asked) */}
          {userQueryText && (
            <div className="px-4 py-2 rounded-xl bg-[#F6F8F2] text-xs font-semibold text-[#1B2520] w-fit mx-auto border border-[#DDE6DD]">
              🗣️ "{userQueryText}"
            </div>
          )}

          {/* GROOT Response Card */}
          {currentResponse && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#EDF4EC] border border-[#DDE6DD] text-left space-y-3 shadow-sm">
              <div className="text-xs font-bold text-[#1F6B45] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1F6B45]" />
                <span>GROOT:</span>
              </div>
              <p className="text-sm sm:text-base text-[#1B2520] font-medium leading-relaxed whitespace-pre-line">
                {currentResponse.text}
              </p>

              {/* Action Button Link (e.g. Open Farm, Open Health) */}
              {currentResponse.suggestedAction && (
                <button
                  onClick={() => {
                    realVoiceService.stop();
                    onClose();
                    const action = currentResponse.suggestedAction!.type;
                    if (action === 'OPEN_FARM') onNavigateTab('my_farm');
                    else if (action === 'OPEN_HEALTH') onNavigateTab('crop_health');
                    else if (action === 'OPEN_CROPS') onNavigateTab('my_crops');
                    else if (action === 'OPEN_CAMERA') onNavigateTab('crop_health');
                  }}
                  className="groot-btn-primary px-4 py-2 text-xs font-bold w-fit shadow-sm"
                >
                  <span>{currentResponse.suggestedAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              )}
            </div>
          )}

          {/* Big Central Tactile Microphone Button */}
          <div className="py-2 flex items-center justify-center gap-4">
            
            {/* Replay Button */}
            <button
              onClick={handleReplay}
              className="p-3 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] text-[#66756D] hover:text-[#1B2520] min-w-[48px] min-h-[48px] flex items-center justify-center"
              title="Replay Voice"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Giant Central Trigger */}
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
              className={`flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all shadow-lg ${
                voiceState === 'listening'
                  ? 'bg-[#B94742] text-white animate-pulse ring-4 ring-[#B94742]/30'
                  : voiceState === 'speaking'
                  ? 'bg-[#F2B84B] text-[#1B2520] ring-4 ring-[#F2B84B]/40 animate-pulse'
                  : 'bg-[#1F6B45] text-white hover:bg-[#174F35] ring-4 ring-[#1F6B45]/20 active:scale-95'
              }`}
            >
              {voiceState === 'speaking' ? (
                <Square className="w-8 h-8 fill-current text-[#1B2520]" />
              ) : voiceState === 'listening' ? (
                <MicOff className="w-8 h-8 text-white animate-bounce" />
              ) : (
                <Mic className="w-9 h-9 text-white" />
              )}
            </button>

            {/* Stop Speech Button */}
            <button
              onClick={handleStopSpeaking}
              className="p-3 rounded-xl bg-[#F6F8F2] border border-[#DDE6DD] text-[#66756D] hover:text-[#B94742] min-w-[48px] min-h-[48px] flex items-center justify-center"
              title="Stop Speech"
            >
              <Square className="w-5 h-5" />
            </button>

          </div>

          {/* Voice State Label */}
          <div>
            <div className="font-bold text-sm sm:text-base text-[#1B2520]">
              {voiceState === 'listening'
                ? (isHi ? '🎙️ सुन रहा हूँ... बोलिए' : '🎙️ Listening... speak now')
                : voiceState === 'processing'
                ? (isHi ? '✨ समझ रहा हूँ...' : '✨ Understanding...')
                : voiceState === 'speaking'
                ? (isHi ? '🔊 GROOT बोल रहा है (रोकने के लिए दबाएं)' : '🔊 GROOT is speaking (tap to stop)')
                : (isHi ? 'बोलकर सवाल पूछें' : 'Tap mic and ask your question')}
            </div>
            <p className="text-xs text-[#66756D] mt-0.5">
              {isHi ? 'माइक दबाकर सवाल पूछें या नीचे से चुनें' : 'Tap microphone or choose a suggested question below'}
            </p>
          </div>

          {speechError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-[#B94742]">
              ⚠️ {speechError}
            </div>
          )}

          {/* Quick Question Chips (Exactly 4 Simple Questions) */}
          <div className="pt-2 border-t border-[#DDE6DD] space-y-2">
            <div className="text-[11px] font-bold text-[#66756D] uppercase tracking-wider">
              {isHi ? 'ये भी पूछ सकते हैं:' : 'Quick Questions:'}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleExecuteQuery(isHi ? 'मेरी फसल कैसी है?' : 'How is my crop health?')}
                className="px-3 py-1.5 rounded-xl bg-[#F6F8F2] hover:bg-[#EDF4EC] border border-[#DDE6DD] text-xs font-bold text-[#1B2520] transition-colors"
              >
                🌾 {isHi ? 'मेरी फसल कैसी है?' : 'How is my crop?'}
              </button>
              <button
                onClick={() => handleExecuteQuery(isHi ? 'आज पानी देना है?' : 'Should I irrigate today?')}
                className="px-3 py-1.5 rounded-xl bg-[#F6F8F2] hover:bg-[#EDF4EC] border border-[#DDE6DD] text-xs font-bold text-[#1B2520] transition-colors"
              >
                💧 {isHi ? 'आज पानी देना है?' : 'Should I irrigate?'}
              </button>
              <button
                onClick={() => handleExecuteQuery(isHi ? 'आज मौसम कैसा है?' : 'How is today\'s weather?')}
                className="px-3 py-1.5 rounded-xl bg-[#F6F8F2] hover:bg-[#EDF4EC] border border-[#DDE6DD] text-xs font-bold text-[#1B2520] transition-colors"
              >
                🌤️ {isHi ? 'आज मौसम कैसा है?' : 'Today\'s weather?'}
              </button>
              <button
                onClick={() => handleExecuteQuery(isHi ? 'आज मुझे क्या करना चाहिए?' : 'What should I do today?')}
                className="px-3 py-1.5 rounded-xl bg-[#F6F8F2] hover:bg-[#EDF4EC] border border-[#DDE6DD] text-xs font-bold text-[#1B2520] transition-colors"
              >
                ✅ {isHi ? 'आज क्या करना चाहिए?' : 'What to do today?'}
              </button>
            </div>
          </div>

          {/* Optional Type Instead Toggle */}
          {showTextInput ? (
            <form onSubmit={handleSendTyped} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder={isHi ? 'यहाँ अपना सवाल लिखें...' : 'Type your question here...'}
                className="flex-1 bg-[#F6F8F2] border border-[#DDE6DD] rounded-xl px-3.5 py-2.5 text-xs text-[#1B2520] focus:outline-none focus:border-[#1F6B45]"
              />
              <button
                type="submit"
                className="groot-btn-primary px-3.5 py-2.5 text-xs font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowTextInput(true)}
              className="text-xs text-[#1F6B45] hover:text-[#174F35] font-semibold underline flex items-center justify-center gap-1 mx-auto pt-1"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{isHi ? '⌨️ लिखकर पूछें' : '⌨️ Type instead'}</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
