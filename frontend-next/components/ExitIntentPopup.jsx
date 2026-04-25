'use client';

import { useEffect, useState } from 'react';
import LeadMagnetModal from './LeadMagnetModal';

const SHOWN_KEY = 'matar_exit_intent_shown';

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SHOWN_KEY)) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem(SHOWN_KEY, '1');
      setOpen(true);
    };

    // Desktop: cursor leaving viewport from top
    const onMouseLeave = (e) => {
      if (e.clientY <= 0) trigger();
    };

    // Mobile fallback: trigger after 30s if no exit intent (mouse events don't fire on touch)
    const isTouch = 'ontouchstart' in window;
    let timer;
    if (isTouch) {
      timer = setTimeout(trigger, 30000);
    } else {
      document.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <LeadMagnetModal
      open={open}
      onClose={() => setOpen(false)}
      title="Aspetta — un regalo prima di andare"
      subtitle="Scarica la checklist con 5 processi concreti per integrare l'AI nel tuo flusso operativo. Niente fuffa."
    />
  );
}
