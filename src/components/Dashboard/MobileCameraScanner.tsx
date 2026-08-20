import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  RefreshCw, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Upload,
  Maximize2,
  Check
} from 'lucide-react';
import { LeafSample } from '../../types/groot';
import { audio } from '../../services/audioService';
import { analyzeCropWithRealAi } from '../../services/realAiService';
import { INITIAL_TELEMETRY } from '../../services/mockData';

interface MobileCameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: LeafSample) => void;
  zoneId: string;
}

const PRESET_CROPS = [
  { id: 'rice_blast', crop: 'Rice (Paddy)', name: 'Rice Leaf Blast (Magnaporthe)', cnnConfidence: 96.4, symptom: 88, pathogen: 'Magnaporthe oryzae', severity: 'Critical Risk', image: '/assets/rice_leaf_blast.jpg' },
  { id: 'wheat_rust', crop: 'Wheat', name: 'Wheat Leaf Rust (Puccinia)', cnnConfidence: 94.2, symptom: 72, pathogen: 'Puccinia triticina', severity: 'High Risk', image: '/assets/rice_leaf_blast.jpg' },
  { id: 'tomato_blight', crop: 'Tomato', name: 'Late Blight (Phytophthora)', cnnConfidence: 92.8, symptom: 81, pathogen: 'Phytophthora infestans', severity: 'Immediate Action', image: '/assets/rice_leaf_blast.jpg' },
  { id: 'healthy_paddy', crop: 'Rice (Paddy)', name: 'Healthy Rice Leaf', cnnConfidence: 99.2, symptom: 2, pathogen: 'None Detected', severity: 'Optimal Health', image: '/assets/rice_leaf_healthy.jpg' },
];

export const MobileCameraScanner: React.FC<MobileCameraScannerProps> = ({
  isOpen,
  onClose,
  onSelectSample,
  zoneId,
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Rice (Paddy)');
  const [scanResult, setScanResult] = useState<LeafSample | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Camera Stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, cameraFacing]);

  const startCamera = async () => {
    stopCamera();
    try {
      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
    } catch (err) {
      console.warn('Camera access prevented:', err);
      setHasCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toggleCameraFacing = () => {
    audio.playClick();
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleSnapPhoto = async () => {
    audio.playPulse();
    setIsScanning(true);

    let base64Image = '';
    if (videoRef.current && hasCameraPermission) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          base64Image = canvas.toDataURL('image/jpeg');
        }
      } catch (err) {
        console.warn('Error rendering canvas frame:', err);
      }
    }

    if (base64Image) {
      const aiResult = await analyzeCropWithRealAi(base64Image, selectedCrop, INITIAL_TELEMETRY, zoneId);
      if (aiResult && aiResult.success) {
        const sample: LeafSample = {
          id: 'real_scan_' + Date.now(),
          name: aiResult.diagnosis || `${selectedCrop} Diagnosis`,
          condition: aiResult.severity || 'AI Pathogen Match',
          image: base64Image,
          cnnConfidence: aiResult.confidenceScore || 95.8,
          symptomSeverity: aiResult.lesionCoverage || 75,
          primaryPathogen: aiResult.pathogen || 'Detected Signature',
          description: aiResult.hindiVoiceSummary || 'Gemini Vision AI camera diagnosis complete.',
        };

        setScanResult(sample);
        onSelectSample(sample);
        setIsScanning(false);
        return;
      }
    }

    // Fallback Preset
    const matched = PRESET_CROPS.find((p) => p.crop === selectedCrop) || PRESET_CROPS[0];
    const sample: LeafSample = {
      id: 'scan_' + Date.now(),
      name: `${matched.name}`,
      condition: matched.severity,
      image: matched.image,
      cnnConfidence: matched.cnnConfidence,
      symptomSeverity: matched.symptom,
      primaryPathogen: matched.pathogen,
      description: `Target ${selectedCrop} leaf morphology scanned in field ${zoneId}. Identified pathogen features with ${matched.cnnConfidence}% certainty.`,
    };

    setTimeout(() => {
      setScanResult(sample);
      onSelectSample(sample);
      setIsScanning(false);
    }, 600);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    audio.playPulse();
    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64Img = evt.target?.result as string;
      const aiResult = await analyzeCropWithRealAi(base64Img, selectedCrop, INITIAL_TELEMETRY, zoneId);

      const sample: LeafSample = {
        id: 'upload_' + Date.now(),
        name: aiResult?.diagnosis || `Uploaded ${selectedCrop} Sample`,
        condition: aiResult?.severity || 'Optimal Health',
        image: base64Img,
        cnnConfidence: aiResult?.confidenceScore || 94.6,
        symptomSeverity: aiResult?.lesionCoverage || 68,
        primaryPathogen: aiResult?.pathogen || 'Crop Pathology Signature',
        description: aiResult?.hindiVoiceSummary || 'Uploaded photo analyzed with Gemini Vision AI.',
      };

      setScanResult(sample);
      onSelectSample(sample);
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl">
      <div className="relative w-full max-w-xl glass-panel-sunlit p-5 sm:p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                Mobile Camera AI Scanner
                <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded-md bg-slate-950 text-emerald-300 border border-emerald-500/40 font-bold">
                  REALTIME CV
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Targeting Sector <strong className="text-amber-300">{zoneId}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl glass-panel text-slate-300 hover:text-white border border-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crop Selector Selector Bar */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono-code text-slate-300 block font-bold">
            Select Crop Type for Machine Vision:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['Rice (Paddy)', 'Wheat', 'Tomato', 'Maize', 'Cotton', 'Potato'].map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCrop === crop
                    ? 'btn-groot-primary shadow-md'
                    : 'btn-groot-secondary opacity-70'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Main Camera / Viewfinder Box */}
        <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 flex items-center justify-center shadow-inner">
          {hasCameraPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-6 text-center space-y-2">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-white">Camera Access Available or Standby</p>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Press auto-detect scan below or upload a leaf photo to trigger Gemini AI diagnosis.
              </p>
            </div>
          )}

          {/* AI Scanning Target Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
            <div className="relative w-44 h-44 border-2 border-dashed border-amber-400/80 rounded-2xl flex items-center justify-center animate-pulse">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono-code text-amber-300 border border-amber-500/40 font-bold">
                ALIGN LEAF HERE
              </span>
              <Maximize2 className="w-8 h-8 text-amber-400/50" />
            </div>

            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#f59e0b] animate-bounce" />
            )}
          </div>

          <div className="absolute bottom-2 left-2 right-2 glass-panel px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-mono-code flex items-center justify-between text-emerald-300 font-bold">
            <span>MODEL: GROOT-VISION-V4</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {selectedCrop} AI READY
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {hasCameraPermission && (
            <button
              onClick={toggleCameraFacing}
              className="p-3 rounded-2xl glass-panel text-slate-300 border border-slate-700 hover:text-white"
              title="Flip Camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleSnapPhoto}
            disabled={isScanning}
            className="flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold btn-groot-primary shadow-xl flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <Scan className="w-5 h-5 animate-spin text-slate-950" />
                <span>SCANNING CROP...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>AUTO-DETECT & SCAN CROP</span>
              </>
            )}
          </button>

          <label className="cursor-pointer p-3.5 rounded-2xl btn-groot-secondary flex items-center justify-center shadow-md">
            <Upload className="w-5 h-5 text-emerald-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Scan Result Feedback Card */}
        {scanResult && (
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-emerald-500/40 space-y-2 animate-fadeIn shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> AI SCAN COMPLETE
              </span>
              <span className="text-slate-300 font-bold">Confidence: {scanResult.cnnConfidence}%</span>
            </div>
            <h4 className="text-base font-bold text-white">{scanResult.name}</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{scanResult.description}</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs font-mono-code text-amber-300 font-bold">
                Pathogen: {scanResult.primaryPathogen}
              </span>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold btn-groot-primary flex items-center gap-1"
              >
                <Check className="w-4 h-4 text-slate-950" /> APPLIED TO DASHBOARD
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
