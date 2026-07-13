import { mountWidget } from './chat/widget.js';

export function boot() {
  const host = document.getElementById('cognityl-chat');
  if (!host) return null;
  window.cognitylChat = mountWidget(host);
  return window.cognitylChat;
}

// Guarded so this module can be imported by the build check and by tests,
// where there is no DOM.
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
