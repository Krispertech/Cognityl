import { config } from './config.js';

export const translations = {
  lv: {
    widgetTitle: 'Cognityl asistents',
    openLabel: 'Atvērt čatu',
    closeLabel: 'Aizvērt čatu',
    inputPlaceholder: 'Rakstiet jautājumu…',
    send: 'Sūtīt',
    micStart: 'Runāt',
    micStop: 'Apturēt',
    speakOn: 'Ieslēgt balsi',
    speakOff: 'Izslēgt balsi',
    langToggle: 'EN',

    greeting:
      'Labdien! Esmu Cognityl asistents. Varu pastāstīt par cenām, valodām un to, kā AI pieraksta klientus. Ko vēlaties uzzināt?',
    fallback:
      'To gan nezinu. Varu pastāstīt par cenām, kalendāra integrāciju, valodām vai pieteikt konsultāciju — kas jūs interesē?',

    suggestions: ['Cik tas maksā?', 'Kā tas strādā?', 'Kādās valodās runā?', 'Gribu konsultāciju'],

    // Lead flow
    leadStart: 'Labprāt. Kā jūs sauc?',
    leadAskEmail: 'Paldies, {name}. Kāds ir jūsu e-pasts?',
    leadAskCompany: 'Kāds ir jūsu uzņēmums?',
    leadAskMessage: 'Īsi — kas jums šobrīd aizņem visvairāk laika ar zvaniem?',
    leadConfirm:
      'Pārbaudiet, lūdzu:\n\nVārds: {name}\nE-pasts: {email}\nUzņēmums: {company}\nZiņa: {message}\n\nSūtīt?',
    leadConfirmYes: 'Jā, sūtīt',
    leadConfirmNo: 'Sākt no jauna',
    leadSending: 'Sūtu…',
    leadSent: 'Paldies! Pieteikums saņemts. Atbildēsim vienas darba dienas laikā.',
    leadFailed:
      'Neizdevās nosūtīt. Rakstiet, lūdzu, tieši: {email}',
    leadCancelled: 'Labi, sākam no sākuma. Ko vēlaties uzzināt?',

    invalidEmail: 'Šķiet, ka e-pasts nav pareizs. Mēģiniet vēlreiz.',
    invalidName: 'Lūdzu, ievadiet vārdu.',
    emptyField: 'Lūdzu, ievadiet atbildi.',

    // Voice / capability
    voiceUnsupported:
      'Jūsu pārlūks neatbalsta balss ievadi. Rakstiet, lūdzu, tekstā — viss darbojas tāpat.',
    micDenied:
      'Mikrofona piekļuve liegta. Varat turpināt rakstot tekstā.',
    micError: 'Neizdevās uztvert runu. Mēģiniet vēlreiz vai rakstiet tekstā.',
    listening: 'Klausos…',
    noLatvianVoice:
      'Šajā ierīcē nav latviešu balss, tāpēc atbildes tikai tekstā.',
    aiThinking: 'Pārbaudu lokālo AI jūsu pārlūkā…',
    aiThinkingShort: 'Domā…',
  },

  en: {
    widgetTitle: 'Cognityl assistant',
    openLabel: 'Open chat',
    closeLabel: 'Close chat',
    inputPlaceholder: 'Type your question…',
    send: 'Send',
    micStart: 'Speak',
    micStop: 'Stop',
    speakOn: 'Turn voice on',
    speakOff: 'Turn voice off',
    langToggle: 'LV',

    greeting:
      "Hello! I'm the Cognityl assistant. I can explain pricing, languages, and how the AI books appointments. What would you like to know?",
    fallback:
      "I don't know that one. I can cover pricing, calendar integration, languages, or book you a consultation — which would help?",

    suggestions: ['What does it cost?', 'How does it work?', 'Which languages?', 'Book a consultation'],

    leadStart: "Happy to. What's your name?",
    leadAskEmail: 'Thanks, {name}. What email should we use?',
    leadAskCompany: "What's your company?",
    leadAskMessage: 'Briefly — what takes most of your time on calls right now?',
    leadConfirm:
      'Please check:\n\nName: {name}\nEmail: {email}\nCompany: {company}\nMessage: {message}\n\nSend this?',
    leadConfirmYes: 'Yes, send',
    leadConfirmNo: 'Start over',
    leadSending: 'Sending…',
    leadSent: "Thank you! We'll reply within one business day.",
    leadFailed: 'That failed to send. Please email us directly: {email}',
    leadCancelled: "No problem, let's start again. What would you like to know?",

    invalidEmail: "That email doesn't look right. Try again.",
    invalidName: 'Please enter a name.',
    emptyField: 'Please enter an answer.',

    voiceUnsupported:
      'Your browser does not support voice input. Please type instead — everything still works.',
    micDenied: 'Microphone access was denied. You can carry on by typing.',
    micError: "Couldn't catch that. Try again, or type instead.",
    listening: 'Listening…',
    noLatvianVoice: 'No Latvian voice on this device, so replies are text only.',
    aiThinking: 'Checking the local AI available in your browser…',
    aiThinkingShort: 'Thinking…',
  },
};

/**
 * Replaces {placeholders}. Missing keys return the key itself, so gaps are
 * visible rather than silent. Non-string entries (e.g. the `suggestions`
 * array) are returned untouched.
 */
export function t(lang, key, vars = {}) {
  const dict = translations[lang] || translations[config.languages.default];
  const raw = dict[key];
  if (raw === undefined) return key;
  if (typeof raw !== 'string') return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] !== undefined ? String(vars[name]) : `{${name}}`,
  );
}

export function isSupported(lang) {
  return config.languages.supported.includes(lang);
}

export function otherLanguage(lang) {
  return lang === 'lv' ? 'en' : 'lv';
}
