/**
 * Deliberately permissive: the cost of rejecting a real lead is far higher
 * than the cost of accepting a slightly odd one. We reject only what is
 * clearly not an address.
 */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (v.length < 6 || v.length > 254) return false;
  if (v.includes('..')) return false;
  return EMAIL.test(v);
}

export function isValidName(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  return v.length >= 2 && v.length <= 100;
}

export function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Speech recognition renders "@" as the spoken word; repair before validating. */
export function repairSpokenEmail(value) {
  if (typeof value !== 'string') return '';
  return value
    .toLowerCase()
    .replace(/\s+at\s+|\s+et\s+/g, '@')
    .replace(/\s*(punkts|dot)\s*/g, '.')
    .replace(/\s+/g, '')
    .trim();
}
