/**
 * Capability detection. Everything degrades to text — voice is never required
 * to complete any task in the widget.
 */

export function getRecognitionCtor() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function supportsRecognition() {
  return getRecognitionCtor() !== null;
}

export function supportsSynthesis() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Is there a voice installed for this language?
 *
 * This matters more than it looks. Latvian TTS voices ship on almost no
 * platform — not Windows by default, not macOS, not iOS, and Google's Android
 * TTS has no Latvian. So for lv this will usually be false, and the widget
 * must fall back to text replies rather than reading Latvian aloud in an
 * English voice, which sounds absurd and destroys credibility.
 */
export function findVoice(langTag) {
  if (!supportsSynthesis()) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;

  const base = langTag.split('-')[0].toLowerCase();
  return (
    voices.find((v) => v.lang && v.lang.toLowerCase() === langTag.toLowerCase()) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(base)) ||
    null
  );
}

export function hasVoiceFor(langTag) {
  return findVoice(langTag) !== null;
}

/** Voices load asynchronously in Chrome; resolve once they are available. */
export function voicesReady(timeoutMs = 1500) {
  return new Promise((resolve) => {
    if (!supportsSynthesis()) return resolve([]);
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length) return resolve(existing);

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve(window.speechSynthesis.getVoices() || []);
    };
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, timeoutMs);
  });
}
