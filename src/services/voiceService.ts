import { audio } from './audioService';
import { AppLanguage } from '../types/groot';
import { getLanguageMeta } from './languageService';

class VoiceService {
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  /**
   * Speak clean, realistic natural voice audio across all Indian regional languages
   */
  public speakText(text: string, lang: AppLanguage = 'hi', onEnd?: () => void, onError?: () => void): void {
    this.stop();
    audio.playHarmonicConvergence();

    const langMeta = getLanguageMeta(lang);
    const ttsCode = langMeta.ttsCode;

    // 1. Try Natural HD Audio Stream via Backend API / Google TTS
    const encodedText = encodeURIComponent(text.slice(0, 200));
    const ttsApiUrl = `/api/tts?text=${encodedText}&lang=${ttsCode}`;

    let fallbackCalled = false;
    const triggerFallback = (err?: any) => {
      if (fallbackCalled) return;
      fallbackCalled = true;
      console.warn(`⚠️ HD Voice stream for ${langMeta.name} (${ttsCode}) unavailable, falling back to browser neural speech synthesis:`, err);
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      this.speakBrowserUtterance(text, lang, onEnd, onError);
    };

    try {
      const audioObj = new Audio(ttsApiUrl);
      this.currentAudio = audioObj;

      audioObj.onended = () => {
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audioObj.onerror = (e) => {
        triggerFallback(e);
      };

      const playPromise = audioObj.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`🔊 Playing clean natural HD TTS voice stream in ${langMeta.name} (${ttsCode})`);
          })
          .catch((err) => {
            triggerFallback(err);
          });
      }
    } catch (e) {
      triggerFallback(e);
    }
  }

  public speak(text: string, lang: AppLanguage = 'hi', onEnd?: () => void, onError?: () => void): Promise<void> {
    return new Promise((resolve) => {
      this.speakText(text, lang, () => {
        if (onEnd) onEnd();
        resolve();
      }, () => {
        if (onError) onError();
        resolve();
      });
    });
  }

  /**
   * Resilient fallback using Web Speech API with automatic multi-dialect Indian voice selection
   */
  private speakBrowserUtterance(text: string, lang: AppLanguage, onEnd?: () => void, onError?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this environment');
      if (onError) onError();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const langMeta = getLanguageMeta(lang);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = lang === 'en' ? 0.95 : 0.90;
      utterance.pitch = 1.0;
      utterance.lang = langMeta.speechCode;

      const voices = window.speechSynthesis.getVoices();
      
      // Match voice by language prefix, exact speech code, or language name
      const matchingVoice = 
        voices.find(v => v.lang === langMeta.speechCode) ||
        voices.find(v => v.lang.startsWith(langMeta.ttsCode)) ||
        voices.find(v => v.name.toLowerCase().includes(langMeta.name.toLowerCase())) ||
        voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('india')) ||
        voices[0];

      if (matchingVoice) {
        utterance.voice = matchingVoice;
        utterance.lang = matchingVoice.lang;
      }

      let hasFinished = false;
      const complete = () => {
        if (hasFinished) return;
        hasFinished = true;
        if (onEnd) onEnd();
      };

      utterance.onend = () => {
        complete();
      };

      utterance.onerror = (e) => {
        console.warn('Browser SpeechSynthesis encountered an issue:', e);
        complete();
        if (onError) onError();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Failed to trigger speech synthesis:', e);
      if (onError) onError();
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const realVoiceService = new VoiceService();
