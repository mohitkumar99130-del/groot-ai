import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';
import { AppLanguage, LeafSample } from '../../types/groot';
import { LEAF_SAMPLES } from '../../services/mockData';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';

interface PestDiseasePageProps {
  activeSample: LeafSample;
  onSelectSample: (sample: LeafSample) => void;
  language: AppLanguage;
  onNavigateTab?: (tab: any) => void;
}

export const PestDiseasePage: React.FC<PestDiseasePageProps> = ({
  activeSample,
  onSelectSample,
  language,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHi = language === 'hi';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audio.playClick();
      setIsAnalyzing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setTimeout(() => {
          setIsAnalyzing(false);
          audio.playPulse();
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const startLiveCamera = async () => {
    audio.playClick();
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Camera access denied or unavailable. Please use file upload.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    audio.playClick();
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUploadedImage(dataUrl);
      }
      // Stop camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
      
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        audio.playPulse();
      }, 1000);
    }
  };

  const handleSpeakRemedy = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const remedyText = isHi
      ? `दवाई सलाह: पत्ती में ${activeSample.name} के संभावित लक्षण हैं। ट्राइसाइक्लाजोल दवा 0.6 ग्राम प्रति लीटर पानी में मिलाकर सुबह 8 बजे से पहले छिड़काव करें। जैविक उपाय के लिए 10 दिन में नीम का तेल डालें।`
      : `Pest remedy: Foliar scan indicates possible ${activeSample.name}. Spray Tricyclazole fungicide at 0.6 grams per liter of water before 8 AM. For organic remedy, apply 10,000 ppm neem oil.`;

    await realVoiceService.speak(remedyText, language);
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>🐛 {isHi ? 'कीट व पत्ती रोग जांच (Pest & Crop Disease Lab)' : 'Pest & Crop Disease Lab'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {isHi ? 'पत्ती की फोटो खींचकर 5 सेकंड में बीमारी व दवाई की जांच करें' : 'MobileNet-v3 AI Foliar Diagnostic Scanner & Prescription'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSpeakRemedy}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg transition-all ${
              isSpeaking ? 'btn-agri-voice animate-pulse' : 'btn-agri-voice'
            }`}
          >
            <Volume2 className="w-4 h-4 text-slate-950" />
            <span>{isSpeaking ? 'बोल रहा है...' : (isHi ? '🔊 आवाज़ में दवाई सुनें' : '🔊 Explain Remedy')}</span>
          </button>
        </div>
      </div>

      {/* 2. Photo Capture / Upload & Diagnostic Result Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Camera / Image Stage */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#031108] border border-emerald-500/30 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
              <span>📷 {isHi ? 'पत्ती की फोटो (Leaf Photo)' : 'Leaf Photo Scan'}</span>
              <span className="text-xs font-normal text-emerald-400">MobileNet-v3 Edge AI</span>
            </h3>

            {/* Live Camera View or Preview Image */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/30 flex items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs shadow-2xl border-2 border-white animate-pulse"
                  >
                    📸 Capture Photo
                  </button>
                </div>
              ) : isAnalyzing ? (
                <div className="flex flex-col items-center gap-3 text-amber-300">
                  <Sparkles className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-mono font-bold">Analyzing Pathogen Signatures...</span>
                </div>
              ) : (
                <img
                  src={uploadedImage || activeSample.image}
                  alt={activeSample.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Capture / Upload Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={startLiveCamera}
                className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md min-h-[48px]"
              >
                <Camera className="w-4 h-4" />
                <span>{isHi ? 'कैमरा खोलें' : 'Open Camera'}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-750 font-bold text-xs transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'गैलरी से चुनें' : 'Upload Photo'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Preset Samples Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                {isHi ? 'या डेमो नमूना चुनें:' : 'Or Select Sample Disease:'}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {LEAF_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      audio.playClick();
                      setUploadedImage(null);
                      onSelectSample(sample);
                    }}
                    className={`p-2 rounded-xl text-left text-[11px] transition-all border ${
                      activeSample.id === sample.id && !uploadedImage
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="truncate">{sample.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-500 truncate">{sample.condition}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right: AI Diagnosis & Recommended Action */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Diagnosis Box */}
          <div className="p-6 rounded-3xl bg-[#031108] border-2 border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                AI DIAGNOSTIC RESULT
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Confidence: {activeSample.cnnConfidence}%
              </span>
            </div>

            {/* Possible Problem Name */}
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {isHi ? 'संभावित बीमारी (Possible Issue Detected):' : 'Possible Issue Detected:'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {activeSample.name}
              </h3>
              <div className="text-xs font-mono text-emerald-400 mt-1">
                Pathogen: {activeSample.primaryPathogen}
              </div>
            </div>

            {/* Signs We Found */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{isHi ? 'पत्ती में क्या लक्षण पाए गए?' : 'What Signs We Found:'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {activeSample.description}
              </p>
            </div>

            {/* Manual Inspection Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {isHi ? 'किसान खुद क्या जांचे? (Manual Verification Checklist)' : 'What You Should Check in Field:'}
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>पत्ती के बीच में धुरी (spindle-shaped) जैसे भूरे धब्बे देखें।</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>खेत में नमी कम होने पर रोग तेजी से फैलता है, नमी बनाए रखें।</span>
                </div>
              </div>
            </div>

            {/* Recommended Remedies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                <div className="text-xs font-bold text-emerald-400">🧪 Chemical Prescription:</div>
                <div className="text-xs text-white font-medium">Tricyclazole 75% WP @ 0.6 g/L water</div>
                <div className="text-[10px] text-slate-400">Apply early morning before 8 AM</div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/40 space-y-1">
                <div className="text-xs font-bold text-teal-400">🌱 Organic / Bio Remedy:</div>
                <div className="text-xs text-white font-medium">Neem Oil (10,000 ppm) @ 3 ml/L water</div>
                <div className="text-[10px] text-slate-400">Spray every 12-15 days for prevention</div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
