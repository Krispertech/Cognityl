import { config } from './config.js';
import { t } from './i18n.js';
import { isValidEmail, isValidName, isNonEmpty, repairSpokenEmail } from './validate.js';
import { cleanInput } from './sanitize.js';

export const STEPS = ['name', 'email', 'company', 'message', 'confirm', 'done'];

export function createLeadFlow(lang = 'lv') {
  return { active: true, step: 'name', lang, data: {} };
}

/**
 * Advances the flow by one user answer.
 * Pure: returns the next state plus what the widget should say. No I/O here,
 * so the whole conversation is testable without a browser.
 *
 * @returns {{state:object, reply:string, submit:boolean, buttons?:string[]}}
 */
export function advance(state, rawInput) {
  const lang = state.lang;
  const input = cleanInput(rawInput);

  switch (state.step) {
    case 'name': {
      if (!isValidName(input)) {
        return { state, reply: t(lang, 'invalidName'), submit: false };
      }
      const next = { ...state, step: 'email', data: { ...state.data, name: input } };
      return { state: next, reply: t(lang, 'leadAskEmail', { name: input }), submit: false };
    }

    case 'email': {
      const candidate = isValidEmail(input) ? input.trim() : repairSpokenEmail(input);
      if (!isValidEmail(candidate)) {
        return { state, reply: t(lang, 'invalidEmail'), submit: false };
      }
      const next = { ...state, step: 'company', data: { ...state.data, email: candidate } };
      return { state: next, reply: t(lang, 'leadAskCompany'), submit: false };
    }

    case 'company': {
      if (!isNonEmpty(input)) {
        return { state, reply: t(lang, 'emptyField'), submit: false };
      }
      const next = { ...state, step: 'message', data: { ...state.data, company: input } };
      return { state: next, reply: t(lang, 'leadAskMessage'), submit: false };
    }

    case 'message': {
      if (!isNonEmpty(input)) {
        return { state, reply: t(lang, 'emptyField'), submit: false };
      }
      const data = { ...state.data, message: input };
      const next = { ...state, step: 'confirm', data };
      return {
        state: next,
        reply: t(lang, 'leadConfirm', data),
        submit: false,
        buttons: [t(lang, 'leadConfirmYes'), t(lang, 'leadConfirmNo')],
      };
    }

    case 'confirm': {
      // Nothing is ever sent without an explicit yes.
      const yes = cleanInput(t(lang, 'leadConfirmYes')).toLowerCase();
      if (input.toLowerCase() === yes) {
        return { state: { ...state, step: 'done' }, reply: t(lang, 'leadSending'), submit: true };
      }
      return {
        state: { active: false, step: 'name', lang, data: {} },
        reply: t(lang, 'leadCancelled'),
        submit: false,
      };
    }

    default:
      return { state, reply: t(lang, 'fallback'), submit: false };
  }
}

/**
 * Sends the lead. Resolves {ok:boolean}. Never throws.
 * Which destination is used is decided entirely by config.booking.mode.
 */
export async function submitLead(data, lang = 'lv') {
  const { booking } = config;
  const payload = {
    name: data.name,
    email: data.email,
    company: data.company,
    message: data.message,
    source: 'website-chatbot',
    language: lang,
    _subject: booking.subject,
  };

  try {
    switch (booking.mode) {
      case 'none':
        return { ok: true, skipped: true };

      case 'mailto': {
        const body = Object.entries(payload)
          .filter(([k]) => !k.startsWith('_'))
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n');
        const href =
          `mailto:${booking.email}` +
          `?subject=${encodeURIComponent(booking.subject)}` +
          `&body=${encodeURIComponent(body)}`;
        if (typeof window !== 'undefined') window.location.href = href;
        return { ok: true };
      }

      case 'custom': {
        if (typeof booking.customSubmit !== 'function') return { ok: false };
        await booking.customSubmit(payload);
        return { ok: true };
      }

      case 'formspree':
      default: {
        const res = await fetch(booking.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        return { ok: res.ok };
      }
    }
  } catch {
    return { ok: false };
  }
}
