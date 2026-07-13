import { config } from '../config.js';
import { t, otherLanguage } from '../i18n.js';
import { classify, answerFor } from '../intent.js';
import { createLeadFlow, advance, submitLead } from '../booking.js';
import { cleanInput } from '../sanitize.js';
import { createRecogniser, supportsRecognition } from '../speech/recognition.js';
import { createSpeaker } from '../speech/synthesis.js';
import { createLocalAI } from '../local-ai.js';

export function mountWidget(root) {
  let lang = config.languages.default;
  let open = false;
  let lead = null;
  let listening = false;
  let localAI = null;
  let localAIChecked = false;
  let thinking = false;

  const speaker = createSpeaker();
  const voiceEnabled = config.voice.enabled;
  const canListen = voiceEnabled && supportsRecognition();
  let recogniser = null;

  // ── DOM ────────────────────────────────────────────────────────────
  // Built with createElement rather than innerHTML: nothing in this widget
  // ever parses a string as markup, which removes the whole XSS surface.
  const make = (tag, className, props = {}) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    Object.assign(node, props);
    return node;
  };

  const el = make('div', 'cog-chat');

  const fab = make('button', 'cog-fab', { type: 'button' });
  fab.setAttribute('aria-expanded', 'false');

  const panel = make('section', 'cog-panel', { hidden: true });
  panel.setAttribute('role', 'dialog');

  const head = make('header', 'cog-head');
  const title = make('h2', 'cog-title');
  const headActions = make('div', 'cog-head-actions');
  const langBtn = make('button', 'cog-lang', { type: 'button' });
  const speakBtn = make('button', 'cog-speak', { type: 'button' });
  speakBtn.setAttribute('aria-pressed', 'true');
  const closeBtn = make('button', 'cog-close', { type: 'button', textContent: '\u00d7' });
  closeBtn.setAttribute('aria-label', 'close');
  headActions.appendChild(langBtn);
  headActions.appendChild(speakBtn);
  headActions.appendChild(closeBtn);
  head.appendChild(title);
  head.appendChild(headActions);

  const log = make('div', 'cog-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');

  const chips = make('div', 'cog-chips');
  const note = make('div', 'cog-note', { hidden: true });

  const form = make('form', 'cog-form');
  const input = make('input', 'cog-input', { type: 'text', autocomplete: 'off' });
  const micBtn = make('button', 'cog-mic', { type: 'button', hidden: true });
  const sendBtn = make('button', 'cog-send', { type: 'submit' });
  form.appendChild(input);
  form.appendChild(micBtn);
  form.appendChild(sendBtn);

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(chips);
  panel.appendChild(note);
  panel.appendChild(form);

  el.appendChild(fab);
  el.appendChild(panel);
  root.appendChild(el);

  // ── Rendering ──────────────────────────────────────────────────────
  // textContent everywhere: user and speech input is never parsed as HTML.
  function addMessage(who, text) {
    const bubble = document.createElement('div');
    bubble.className = `cog-msg cog-msg--${who}`;
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function setThinking(active) {
    thinking = active;
    input.disabled = active;
    sendBtn.disabled = active;
    if (active) showNote(t(lang, 'aiThinking'));
    else if (note.textContent === t(lang, 'aiThinking')) showNote('');
    applyLanguage();
  }

  async function getLocalAI() {
    if (localAIChecked) return localAI;
    localAIChecked = true;
    localAI = await createLocalAI();
    return localAI;
  }

  function say(text, buttons) {
    addMessage('bot', text);
    renderChips(buttons || (lead ? [] : t(lang, 'suggestions')));
    if (voiceEnabled) speaker.speak(text, lang);
  }

  function renderChips(items) {
    chips.textContent = '';
    (items || []).forEach((label) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'cog-chip';
      chip.textContent = label;
      chip.addEventListener('click', () => handleInput(label));
      chips.appendChild(chip);
    });
  }

  function showNote(text) {
    if (!text) {
      note.hidden = true;
      note.textContent = '';
      return;
    }
    note.hidden = false;
    note.textContent = text;
  }

  // ── Conversation ───────────────────────────────────────────────────
  async function handleInput(raw) {
    const text = cleanInput(raw);
    if (!text || thinking) return;

    speaker.cancel(); // a new question interrupts the previous answer
    addMessage('user', text);
    input.value = '';

    if (lead && lead.active) {
      const result = advance(lead, text);
      lead = result.state;
      say(result.reply, result.buttons);

      if (result.submit) {
        const { ok } = await submitLead(lead.data, lang);
        say(ok ? t(lang, 'leadSent') : t(lang, 'leadFailed', { email: config.contact.email }));
        lead = null;
        renderChips(t(lang, 'suggestions'));
      }
      return;
    }

    const intent = classify(text, lang);

    if (intent.type === 'booking') {
      lead = createLeadFlow(lang);
      say(t(lang, 'leadStart'), []);
      return;
    }
    if (intent.type === 'answer') {
      say(answerFor(intent.id, lang) || t(lang, 'fallback'));
      return;
    }
    if (intent.type === 'greeting') {
      say(t(lang, 'greeting'));
      return;
    }

    setThinking(true);
    const ai = await getLocalAI();
    const aiAnswer = ai ? await ai.answer(text, lang) : null;
    setThinking(false);
    say(aiAnswer || t(lang, 'fallback'));
  }

  // ── Voice ──────────────────────────────────────────────────────────
  function stopListening() {
    listening = false;
    micBtn.textContent = t(lang, 'micStart');
    micBtn.classList.remove('is-live');
    recogniser?.cancel();
  }

  function startListening() {
    if (!canListen) {
      showNote(t(lang, 'voiceUnsupported'));
      return;
    }
    speaker.cancel(); // don't record our own voice

    recogniser = createRecogniser({
      lang,
      onStart: () => {
        listening = true;
        micBtn.textContent = t(lang, 'micStop');
        micBtn.classList.add('is-live');
        showNote(t(lang, 'listening'));
      },
      onResult: (transcript) => {
        showNote('');
        handleInput(transcript);
      },
      onError: (kind) => {
        showNote(kind === 'denied' ? t(lang, 'micDenied') : t(lang, 'micError'));
        stopListening();
      },
      onEnd: () => {
        if (listening) stopListening();
        if (note.textContent === t(lang, 'listening')) showNote('');
      },
    });

    recogniser.start();
  }

  // ── Chrome ─────────────────────────────────────────────────────────
  function applyLanguage() {
    fab.setAttribute('aria-label', t(lang, 'openLabel'));
    title.textContent = t(lang, 'widgetTitle');
    input.placeholder = t(lang, 'inputPlaceholder');
    sendBtn.textContent = thinking ? t(lang, 'aiThinkingShort') : t(lang, 'send');
    langBtn.textContent = t(lang, 'langToggle');
    micBtn.textContent = listening ? t(lang, 'micStop') : t(lang, 'micStart');
    speakBtn.textContent = speaker.isEnabled() ? t(lang, 'speakOff') : t(lang, 'speakOn');
    micBtn.hidden = !canListen;
    speakBtn.hidden = !voiceEnabled;
  }

  function setLanguage(next) {
    lang = next;
    stopListening();
    speaker.cancel();
    applyLanguage();
    lead = null; // a half-finished lead in the other language would be incoherent
    say(t(lang, 'greeting'));
    warnIfNoVoice();
  }

  async function warnIfNoVoice() {
    if (!voiceEnabled || !speaker.isEnabled()) return;
    await speaker.init();
    if (!speaker.hasVoiceFor(lang)) showNote(t(lang, 'noLatvianVoice'));
  }

  function toggleOpen(next) {
    open = next;
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', String(open));
    fab.setAttribute('aria-label', open ? t(lang, 'closeLabel') : t(lang, 'openLabel'));
    if (open) {
      if (!log.children.length) {
        say(t(lang, 'greeting'));
        warnIfNoVoice();
      }
      input.focus();
    } else {
      stopListening();
      speaker.cancel();
    }
  }

  // ── Events ─────────────────────────────────────────────────────────
  fab.addEventListener('click', () => toggleOpen(!open));
  closeBtn.addEventListener('click', () => toggleOpen(false));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleInput(input.value);
  });

  micBtn.addEventListener('click', () => (listening ? stopListening() : startListening()));

  speakBtn.addEventListener('click', () => {
    const next = !speaker.isEnabled();
    speaker.setEnabled(next);
    speakBtn.setAttribute('aria-pressed', String(next));
    applyLanguage();
    if (next) warnIfNoVoice();
    else showNote('');
  });

  langBtn.addEventListener('click', () => setLanguage(otherLanguage(lang)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) toggleOpen(false);
  });

  applyLanguage();

  return {
    open: () => toggleOpen(true),
    close: () => toggleOpen(false),
    setLanguage,
    destroy: () => {
      stopListening();
      speaker.cancel();
      el.remove();
    },
  };
}
