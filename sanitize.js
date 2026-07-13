import { config } from '../config.js';
import { supportsSynthesis, findVoice, voicesReady } from './support.js';

/**
 * Speaks replies using the browser's own voices. Free, no key.
 *
 * If no voice exists for the language, speak() resolves 'no-voice' and says
 * nothing. Reading Latvian text with an English voice is worse than silence.
 */
export function createSpeaker() {
  let enabled = config.voice.autoSpeakReplies;
  let ready = false;

  async function init() {
    if (!supportsSynthesis()) return;
    await voicesReady();
    ready = true;
  }

  function cancel() {
    if (!supportsSynthesis()) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* nothing queued */
    }
  }

  /** @returns {Promise<'spoken'|'no-voice'|'unsupported'|'disabled'|'error'>} */
  async function speak(text, lang = 'lv') {
    if (!enabled) return 'disabled';
    if (!supportsSynthesis()) return 'unsupported';
    if (!text || !text.trim()) return 'disabled';
    if (!ready) await init();

    const tag = config.languages.speechTags[lang] || 'lv-LV';
    const voice = findVoice(tag);
    if (!voice) return 'no-voice';

    cancel(); // never let two replies overlap

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang || tag;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => resolve('spoken');
      utterance.onerror = () => resolve('error');
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        resolve('error');
      }
    });
  }

  return {
    init,
    speak,
    cancel,
    isEnabled: () => enabled,
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) cancel();
    },
    hasVoiceFor(lang) {
      const tag = config.languages.speechTags[lang] || 'lv-LV';
      return findVoice(tag) !== null;
    },
  };
}
