import { config } from '../config.js';
import { getRecognitionCtor, supportsRecognition } from './support.js';

/**
 * Wraps the Web Speech API. Free, browser-native, no key.
 *
 * Availability is narrow: Chrome and Edge (desktop and Android) and Safari 14.1+.
 * Firefox does not implement it at all. Callers must handle onUnsupported.
 */
export function createRecogniser({ lang = 'lv', onResult, onError, onStart, onEnd }) {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recogniser = new Ctor();
  recogniser.lang = config.languages.speechTags[lang] || 'lv-LV';
  recogniser.interimResults = false;
  recogniser.maxAlternatives = 1;
  recogniser.continuous = false;

  let silenceTimer = null;
  const clearSilence = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = null;
  };

  recogniser.onstart = () => {
    clearSilence();
    silenceTimer = setTimeout(() => {
      try {
        recogniser.stop();
      } catch {
        /* already stopped */
      }
    }, config.voice.silenceTimeoutMs);
    onStart?.();
  };

  recogniser.onresult = (event) => {
    clearSilence();
    const transcript = event?.results?.[0]?.[0]?.transcript || '';
    if (transcript.trim()) onResult?.(transcript.trim());
  };

  recogniser.onerror = (event) => {
    clearSilence();
    // 'aborted' fires on our own cancel() — not a real failure.
    if (event?.error === 'aborted') return;
    onError?.(event?.error === 'not-allowed' ? 'denied' : 'error');
  };

  recogniser.onend = () => {
    clearSilence();
    onEnd?.();
  };

  return {
    start() {
      try {
        recogniser.start();
      } catch {
        // start() throws if already running; harmless.
      }
    },
    stop() {
      try {
        recogniser.stop();
      } catch {
        /* not running */
      }
    },
    cancel() {
      clearSilence();
      try {
        recogniser.abort();
      } catch {
        /* not running */
      }
    },
    setLanguage(nextLang) {
      recogniser.lang = config.languages.speechTags[nextLang] || 'lv-LV';
    },
  };
}

export { supportsRecognition };
