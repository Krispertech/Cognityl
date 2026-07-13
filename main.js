/**
 * All chat content is rendered via textContent, so this is defence in depth
 * for the one place we build markup (line breaks in confirmations).
 */

const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[&<>"']/g, (c) => ENTITIES[c]);
}

/** Collapses whitespace and caps length; speech recognition can return long runs. */
export function cleanInput(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  return input.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}
