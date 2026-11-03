import { useEffect, useRef, useState } from 'react';
import { useActiveLocale } from '../../lib/i18n';
import { createInterfaceAudio } from '../../lib/interfaceAudio';

const hoverControls = '.hero-actions .button-light, .nav-contact, a.button-primary, a.archive-btn-primary';
const pressControls = `${hoverControls}, .hero-actions .button-ghost, .work-preview, .service-row > a, .contact-link`;
const preferredSound = () => {
  try { return localStorage.getItem('portfolio-ui-sound') !== 'off'; } catch { return true; }
};

export default function InterfaceSound() {
  const id = useActiveLocale() === 'id';
  const [enabled, setEnabled] = useState(preferredSound);
  const engine = useRef(null);

  useEffect(() => {
    const audio = createInterfaceAudio();
    engine.current = audio;
    let keyboardFocus = false;
    const targetControl = (event, selector) => {
      const element = event.target instanceof Element ? event.target.closest(selector) : null;
      if (!element || element.closest('.utility-page main') || element.getAttribute('aria-disabled') === 'true') return null;
      return element;
    };
    const unlock = event => {
      keyboardFocus = event.type === 'keydown';
      if (event.isTrusted) audio.unlock();
    };
    const hover = event => {
      if (event.type === 'focusin' && !keyboardFocus) return;
      const element = targetControl(event, hoverControls);
      if (!element || event.pointerType === 'touch' || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
      audio.play('hover');
    };
    const press = event => { if (targetControl(event, pressControls)) audio.play('press'); };
    document.addEventListener('pointerdown', unlock, true);
    document.addEventListener('keydown', unlock, true);
    document.addEventListener('pointerover', hover);
    document.addEventListener('focusin', hover);
    document.addEventListener('click', press, true);
    return () => {
      document.removeEventListener('pointerdown', unlock, true);
      document.removeEventListener('keydown', unlock, true);
      document.removeEventListener('pointerover', hover);
      document.removeEventListener('focusin', hover);
      document.removeEventListener('click', press, true);
      audio.dispose();
      engine.current = null;
    };
  }, []);

  useEffect(() => {
    engine.current?.setEnabled(enabled);
    try { localStorage.setItem('portfolio-ui-sound', enabled ? 'on' : 'off'); } catch { /* Storage can be disabled by the visitor. */ }
  }, [enabled]);

  const label = id ? (enabled ? 'Suara aktif, matikan suara' : 'Suara mati, aktifkan suara') : (enabled ? 'Sound on, mute sound' : 'Sound off, enable sound');
  return <button className="sound-toggle" type="button" aria-label={label} title={label} aria-pressed={enabled} onClick={() => setEnabled(value => !value)}>
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{enabled ? <><path d="M15 8a6 6 0 0 1 0 8"/><path d="M18 5a10 10 0 0 1 0 14"/></> : <path d="m16 9 5 6m0-6-5 6"/>}</svg>
  </button>;
}
