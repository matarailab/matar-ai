'use client';

import { useEffect, useState } from 'react';
import { X, Download, Check, Loader2 } from 'lucide-react';

export default function LeadMagnetModal({ open, onClose, magnet = '5-Processi-Operativi-AI.pdf', title = 'Scarica la checklist', subtitle = '5 processi concreti per integrare l\'AI nel tuo flusso operativo.' }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setStatus('idle');
      setErrorMsg('');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const triggerDownload = () => {
    const a = document.createElement('a');
    a.href = `/${magnet}`;
    a.download = magnet;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, magnet }),
      });

      // Se la risposta non è JSON (es. in locale senza Cloudflare) scarica direttamente
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        triggerDownload();
        setStatus('success');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Errore generico');
      triggerDownload();
      setStatus('success');
    } catch (err) {
      // SyntaxError = risposta HTML anziché JSON (locale) → scarica comunque
      if (err instanceof SyntaxError) {
        triggerDownload();
        setStatus('success');
        return;
      }
      setStatus('error');
      setErrorMsg(err.message || 'Qualcosa è andato storto. Riprova tra un attimo.');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,9,19,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-8 animate-fade-up"
        style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(11,15,25,0.98))',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(124,58,237,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Chiudi"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
          style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(124,58,237,0.3)' }}>
          <Download size={24} className="text-violet-300" />
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {title}
        </h3>
        <p className="text-sm text-slate-400 text-center mb-6 leading-relaxed">
          {subtitle}
        </p>

        {status !== 'success' && (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="text"
              placeholder="Il tuo nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <input
              type="email"
              required
              placeholder="La tua email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn-primary text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {status === 'loading'
                ? <><Loader2 size={16} className="animate-spin" /> Invio…</>
                : <>Scarica gratis <Download size={16} /></>}
            </button>
            {status === 'error' && (
              <p className="text-xs text-red-400 text-center">{errorMsg}</p>
            )}
            <p className="text-[11px] text-slate-500 text-center leading-relaxed pt-1">
              Niente spam. Lascia la mail solo se davvero ti serve.
            </p>
          </form>
        )}

        {status === 'success' && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <Check size={22} className="text-green-400" />
            </div>
            <p className="text-white font-medium mb-2">Tutto fatto!</p>
            <p className="text-sm text-slate-400 mb-4">Il download dovrebbe partire in automatico. Se non parte:</p>
            <a
              href={`/${magnet}`}
              download={magnet}
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 underline"
            >
              <Download size={14} /> Scarica manualmente
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
