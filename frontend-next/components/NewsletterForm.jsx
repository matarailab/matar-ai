'use client';

import { useState } from 'react';
import { Mail, Check, Loader2, ArrowRight, ExternalLink } from 'lucide-react';

// If NEXT_PUBLIC_BEEHIIV_URL is set (e.g. https://matarai.beehiiv.com/subscribe),
// the form redirects there with ?email=... instead of calling the API.
const BEEHIIV_URL = process.env.NEXT_PUBLIC_BEEHIIV_URL || '';

export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;

    // Redirect mode — no API key needed
    if (BEEHIIV_URL) {
      const url = `${BEEHIIV_URL}?email=${encodeURIComponent(email)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setStatus('success');
      setEmail('');
      return;
    }

    // API mode
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referrer: typeof window !== 'undefined' ? window.location.href : '' }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Errore generico');
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Riprova tra un attimo.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 ${compact ? 'text-sm' : ''}`}>
        <div className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <Check size={16} className="text-green-400" />
        </div>
        <p className="text-white text-sm">
          {BEEHIIV_URL ? 'Si apre la pagina di iscrizione. Completa lì!' : 'Iscritto. Controlla la tua casella per confermare.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`flex ${compact ? 'flex-row' : 'flex-col sm:flex-row'} gap-2 w-full`}>
      <div className="flex-1 relative">
        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="email"
          required
          placeholder="La tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-3 py-3 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary text-white font-medium px-5 py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading'
          ? <><Loader2 size={14} className="animate-spin" /> Invio…</>
          : BEEHIIV_URL
            ? <>Iscriviti <ExternalLink size={14} /></>
            : <>Iscriviti <ArrowRight size={14} /></>}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
      )}
    </form>
  );
}
