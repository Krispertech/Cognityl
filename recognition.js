.cog-chat {
  --cog-ink: #0b1f17;
  --cog-brand: #059669;
  --cog-brand-dark: #047857;
  --cog-line: #e2e8e4;
  --cog-muted: #5c6f66;
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 900;
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
}

/* Sits above the sticky mobile call bar rather than under it. */
@media (max-width: 767px) {
  .cog-chat { right: 14px; bottom: 88px; }
}

.cog-fab {
  width: 56px; height: 56px; border-radius: 50%; border: 0;
  background: var(--cog-ink); color: #fff; cursor: pointer;
  box-shadow: 0 8px 24px rgba(11, 31, 23, .28);
  display: grid; place-items: center;
  transition: transform .15s ease, background .15s ease;
}
.cog-fab::before { content: '💬'; font-size: 22px; line-height: 1; }
.cog-fab:hover { background: var(--cog-brand-dark); transform: translateY(-2px); }
.cog-fab:focus-visible,
.cog-chat button:focus-visible,
.cog-chat input:focus-visible {
  outline: 3px solid var(--cog-brand); outline-offset: 2px;
}

.cog-panel {
  position: absolute; right: 0; bottom: 68px;
  width: min(370px, calc(100vw - 28px));
  max-height: min(560px, calc(100vh - 140px));
  display: flex; flex-direction: column;
  background: #fff; border: 1px solid var(--cog-line); border-radius: 16px;
  box-shadow: 0 24px 60px rgba(11, 31, 23, .22);
  overflow: hidden;
}
.cog-panel[hidden] { display: none; }

.cog-head {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 12px 14px; background: var(--cog-ink); color: #fff;
}
.cog-title { margin: 0; font-size: 15px; font-weight: 600; }
.cog-head-actions { display: flex; align-items: center; gap: 6px; }
.cog-head-actions button {
  background: rgba(255,255,255,.12); color: #fff; border: 0; cursor: pointer;
  font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 6px;
}
.cog-head-actions button:hover { background: rgba(255,255,255,.24); }
.cog-close { font-size: 17px !important; line-height: 1; padding: 3px 8px !important; }

.cog-log {
  flex: 1; min-height: 200px; overflow-y: auto;
  padding: 14px; background: #f7faf8;
  display: flex; flex-direction: column; gap: 8px;
}

.cog-msg {
  max-width: 86%; padding: 9px 12px; font-size: 14px; line-height: 1.45;
  border-radius: 12px; white-space: pre-wrap; word-break: break-word;
}
.cog-msg--bot { align-self: flex-start; background: #fff; border: 1px solid var(--cog-line); }
.cog-msg--user { align-self: flex-end; background: var(--cog-brand); color: #fff; }

.cog-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px; }
.cog-chips:empty { display: none; }
.cog-chip {
  background: #fff; border: 1px solid var(--cog-line); border-radius: 999px;
  padding: 6px 11px; font-size: 12px; color: var(--cog-muted); cursor: pointer;
}
.cog-chip:hover { border-color: var(--cog-brand); color: var(--cog-ink); }

.cog-note {
  margin: 8px 14px 0; padding: 7px 10px; border-radius: 8px;
  background: #fff8e6; border: 1px solid #f0dfb0;
  font-size: 12px; color: #7a5c14;
}
.cog-note[hidden] { display: none; }

.cog-form {
  display: flex; gap: 6px; padding: 12px 14px;
  border-top: 1px solid var(--cog-line); background: #fff;
}
.cog-input {
  flex: 1; min-width: 0; border: 1px solid var(--cog-line); border-radius: 8px;
  padding: 9px 11px; font: inherit; font-size: 14px; color: var(--cog-ink);
}
.cog-input:focus { border-color: var(--cog-brand); outline: none; }

.cog-mic, .cog-send {
  border: 0; border-radius: 8px; cursor: pointer;
  font-size: 13px; font-weight: 600; padding: 9px 12px;
}
.cog-mic { background: #fff; border: 1px solid var(--cog-line); color: var(--cog-muted); }
.cog-mic:hover { border-color: var(--cog-brand); color: var(--cog-ink); }
.cog-mic.is-live { background: #fee2e2; border-color: #dc2626; color: #b91c1c; }
.cog-mic[hidden] { display: none; }
.cog-send { background: var(--cog-brand); color: #fff; }
.cog-send:hover { background: var(--cog-brand-dark); }

@media (prefers-reduced-motion: reduce) {
  .cog-chat *, .cog-chat *::before { transition: none !important; animation: none !important; }
}

.cog-input:disabled,
.cog-send:disabled {
  opacity: .6;
  cursor: wait;
}
