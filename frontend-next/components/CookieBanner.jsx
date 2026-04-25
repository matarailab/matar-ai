'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const COOKIE_KEY = 'matar_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    if (consent === 'declined') {
      disablePosthog();
    }
  }, []);

  const disablePosthog = () => {
    if (window.posthog) {
      window.posthog.opt_out_capturing();
    }
  };

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    disablePosthog();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      style={{ background: 'linear-gradient(to top, rgba(5,11,26,0.98) 60%, transparent)' }}
    >
      <div
        className="max-w-3xl mx-auto rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          background: 'rgba(15,23,42,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-300 leading-relaxed">
            Usiamo cookie analitici per migliorare il sito. Leggi la nostra{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline" onClick={() => setVisible(false)}>
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Rifiuta
          </button>
          <button
            onClick={accept}
            className="text-xs font-medium text-white px-4 py-2 rounded-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
          >
            Accetta tutti
          </button>
          <button
            onClick={decline}
            className="text-slate-500 hover:text-white transition-colors p-1"
            aria-label="Chiudi"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
