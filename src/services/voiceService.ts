import { audio } from './audioService';

class VoiceService {
  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Speak clean, realistic natural Hindi / English voice audio
   */
  public speakText(text: string, lang: 'hi' | 'en' = 'hi', onEnd?: () => void, onError?: () => void): void {
    this.stop();
    audio.playHarmonicConvergence();

    // 1. Try Natural HD Audio Stream via Backend API / Google TTS
    const encodedText = encodeURIComponent(text.slice(0, 300));
    const ttsApiUrl = `/api/tts?text=${encodedText}&lang=${lang}`;

    const audioObj = new Audio(ttsApiUrl);
    this.currentAudio = audioObj;

    audioObj.play()
      .then(() => {
        console.log('🔊 Playing clean natural HD TTS voice stream');
        audioObj.onended = () => {
          this.currentAudio = null;
          if (onEnd) onEnd();
        };
      })
      .catch((err) => {
        console.warn('⚠️ HD Voice Stream unavailable, switching to browser neural voice:', err);
        this.speakBrowserUtterance(text, lang, onEnd, onError);
      });
  }

  public speak(text: string, lang: 'hi' | 'en' = 'hi', onEnd?: () => void, onError?: () => void): Promise<void> {
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
   * Fallback using Web Speech API with hi-IN Hindi locale
   */
  private speakBrowserUtterance(text: string, lang: 'hi' | 'en', onEnd?: () => void, onError?: () => void): void {
    if (!('speechSynthesis' in window)) {
      if (onError) onError();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('India'));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onError) onError();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const realVoiceService = new VoiceService();
