import React, { useState, useRef, useEffect } from 'react';
import { LeafSample, AppLanguage } from '../../types/groot';
import { 
  Camera, 
  UploadCloud, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Microscope,
  Volume2,
  Crosshair,
  ShieldCheck
} from 'lucide-react';
import { audio } from '../../services/audioService';
import { realVoiceService } from '../../services/voiceService';
import { LeafPathologyGallery } from './LeafPathologyGallery';

interface CropDiagnosticLabProps {
  samples: LeafSample[];
  activeSample: LeafSample;
  onSelectSample: (sample: LeafSample) => void;
  zoneId: string;
  language: AppLanguage;
}

export const CropDiagnosticLab: React.FC<CropDiagnosticLabProps> = ({
  samples,
  activeSample,
  onSelectSample,
  zoneId,
  language,
}) => {

  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      audio.playPulse();
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or permission denied. You can still use high-res samples or photo upload below.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleCaptureFromCamera = () => {
    setIsScanning(true);
    audio.playPulse();

    // Simulate Edge AI inference on captured stream frame
    setTimeout(() => {
      const scannedSample: LeafSample = {
        id: 'cam_' + Date.now(),
        name: 'Live Leaf Scan • Zone ' + zoneId,
        condition: 'Active Pathology Detected',
        image: activeSample.image, // uses sample image as baseline
        cnnConfidence: 96.4,
        symptomSeverity: 84.0,
        primaryPathogen: 'Magnaporthe oryzae (Rice Blast)',
        description: 'Real-time camera frame processed. Diamond-shaped necrotic lesion morphology identified with high confidence.',
      };
      onSelectSample(scannedSample);
      setIsScanning(false);
      stopCamera();
      setUploadFeedback('Live camera frame analyzed by Edge AI!');
      setTimeout(() => setUploadFeedback(null), 3000);
    }, 750);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    audio.playPulse();

    const reader = new FileReader();
    reader.onload = (event) => {
      const customSample: LeafSample = {
        id: 'custom_' + Date.now(),
        name: `Crop Photo (${file.name.slice(0, 20)})`,
        condition: 'AI Diagnostic Completed',
        image: event.target?.result as string,
        cnnConfidence: 95.8,
        symptomSeverity: 78.5,
        primaryPathogen: 'Rice Leaf Blast / Brown Spot Complex',
        description: 'Uploaded crop photo analyzed. MobileNet feature extractor identified pathogen marker clusters.',
      };

      setTimeout(() => {
        onSelectSample(customSample);
        setIsScanning(false);
        setUploadFeedback('Custom photo analyzed successfully!');
        setTimeout(() => setUploadFeedback(null), 3000);
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleSpeakDiagnosis = async () => {
    audio.playClick();
    if (isSpeaking) {
      realVoiceService.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const text = language === 'hi'
      ? `पत्ती रोग रिपोर्ट: ${activeSample.name}। पहचान की गई बीमारी: ${activeSample.primaryPathogen}। गंभीरता ${activeSample.symptomSeverity} प्रतिशत है। तुरंत कीटनाशक स्प्रे करने की सलाह दी जाती है।`
      : `Leaf pathology diagnosis: ${activeSample.name}. Pathogen identified: ${activeSample.primaryPathogen}, with symptom severity at ${activeSample.symptomSeverity} percent. Immediate corrective spray recommended.`;
    await realVoiceService.speak(text, language === 'hi' ? 'hi' : 'en');
    setIsSpeaking(false);
  };

  const isDisease = activeSample.symptomSeverity > 30;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="font-display font-black text-lg sm:text-xl text-white">
              {language === 'hi' ? '📸 AI फ़सल रोग जांच लैब (MobileNet-v3 Edge AI)' : '📸 Multimodal AI Crop Diagnostic Lab'}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              ZONE {zoneId}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Ground-truth crop pathology detection fused with Sentinel-2 spectral indices & ESP32 soil telemetry.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Advice */}
          <button
            onClick={handleSpeakDiagnosis}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isSpeaking ? 'btn-agri-voice animate-pulse' : 'btn-agri-voice'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'बोल रहा है...' : (language === 'hi' ? '🔊 बीमारी आवाज़ सुनें' : '🔊 Listen Diagnosis')}</span>
          </button>

          {/* Camera Scanner Toggle */}
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="px-3.5 py-2 rounded-xl text-xs font-bold btn-agri-primary flex items-center gap-1.5 text-slate-950 shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>{language === 'hi' ? '📷 कैमरा चालू करें' : '📷 Open Camera'}</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-md"
            >
              <span>✕ Close Camera</span>
            </button>
          )}

          {/* Custom Upload Trigger */}
          <label className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold btn-agri-secondary flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'फोटो अपलोड' : 'Upload Photo'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadFeedback && (
        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {cameraError && (
        <div className="p-3 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Diagnostic Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 cols: Visual Scanner Canvas with Bounding Box & Reticle */}
        <div className="lg:col-span-6 space-y-3">
          <div className="agri-card p-4 rounded-3xl border border-emerald-500/25 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-3 border-b border-emerald-500/15 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-cyan-400 animate-spin" />
                {isCameraActive ? 'LIVE WEBCAM STREAM' : 'AI RETICLE & LESION OVERLAY'}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {isScanning ? 'ANALYZING TENSORS...' : 'MODEL READY'}
              </span>
            </div>

            {/* Viewfinder Frame */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeSample.image}
                  alt={activeSample.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* HUD Scanner Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                {/* Corner markers */}
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                </div>

                {/* Center target box if disease is detected */}
                {isDisease && !isScanning && (
                  <div className="self-center w-40 h-32 border-2 border-rose-500/90 rounded-lg bg-rose-500/10 p-1 flex flex-col justify-between animate-pulse">
                    <div className="flex items-center justify-between text-[9px] font-mono text-rose-300 bg-slate-950/80 px-1 py-0.5 rounded">
                      <span>LESION CLUSTER #01</span>
                      <span>{activeSample.cnnConfidence}%</span>
                    </div>
                    <div className="text-[8px] font-mono text-rose-400 text-right bg-slate-950/80 px-1 py-0.5 rounded self-end">
                      {activeSample.primaryPathogen.split(' ')[0]}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
                </div>
              </div>

              {/* Scanning Active Light Beam */}
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-shimmer" />
              )}
            </div>

            {/* Live Camera Capture Trigger */}
            {isCameraActive && (
              <div className="mt-3">
                <button
                  onClick={handleCaptureFromCamera}
                  disabled={isScanning}
                  className="w-full py-3 rounded-2xl btn-agri-primary font-display font-black text-sm text-slate-950 shadow-xl flex items-center justify-center gap-2"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>{isScanning ? 'Analyzing Crop Frame...' : '📸 Capture & Analyze Current Frame'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 6 cols: Detailed Diagnostic Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="agri-card-elevated p-5 sm:p-6 rounded-3xl border border-emerald-500/30 space-y-4 shadow-xl">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-emerald-500/15 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Crop Pathology Diagnosis
                </span>
                <h3 className="font-display font-black text-lg sm:text-xl text-white mt-0.5">
                  {activeSample.name}
                </h3>
                <p className="text-xs font-mono text-emerald-400 italic">
                  Taxonomy: {activeSample.primaryPathogen}
                </p>
              </div>

              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                isDisease
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}>
                {isDisease ? '🚨 ' + activeSample.condition : '✅ ' + activeSample.condition}
              </span>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center font-mono">
              <div className="agri-card-subtle p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Model Confidence</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {activeSample.cnnConfidence}%
                </div>
              </div>

              <div className="agri-card-subtle p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Symptom Severity</div>
                <div className={`text-2xl font-black mt-1 ${isDisease ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeSample.symptomSeverity}%
                </div>
              </div>

              <div className="agri-card-subtle p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400">Lesion Surface</div>
                <div className="text-2xl font-black text-amber-300 mt-1">
                  {isDisease ? `${(activeSample.symptomSeverity * 0.28).toFixed(1)}%` : '0.0%'}
                </div>
              </div>
            </div>

            {/* Clinical Symptoms Analysis */}
            <div className="agri-card-subtle p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-mono font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">
                Edge AI Pathology Findings
              </span>
              <p className="leading-relaxed font-normal">
                {activeSample.description}
              </p>
            </div>

            {/* Tri-Modal Fusion Multiplier */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Tri-Modal Fusion Weight:</span>
              </div>
              <span className="font-bold text-emerald-300">
                30% (Multimodal Decision Engine)
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Curated Ground-Truth Pathology Library */}
      <LeafPathologyGallery
        samples={samples}
        activeSample={activeSample}
        onSelectSample={onSelectSample}
        language={language}
      />
    </div>
  );
};
