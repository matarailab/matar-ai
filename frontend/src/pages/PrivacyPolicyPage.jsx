import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
    <div className="text-slate-400 leading-relaxed space-y-3 text-sm">{children}</div>
  </div>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6" style={{ background: '#050B1A' }}>
      <Helmet>
        <title>Privacy Policy & Cookie Policy | Matar.AI</title>
        <meta name="description" content="Informativa sulla privacy e sui cookie di Matar.AI, ai sensi del GDPR (Reg. UE 2016/679)." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={14} /> Torna alla home
        </Link>

        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">Documenti legali</p>
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Ultimo aggiornamento: aprile 2025</p>
        </div>

        <Section title="1. Titolare del trattamento">
          <p>
            Il titolare del trattamento dei dati personali è <strong className="text-white">Matar Gueye</strong>, operante con il marchio <strong className="text-white">Matar.AI</strong>.
          </p>
          <p>
            Email di contatto: <a href="mailto:matar.ailab@gmail.com" className="text-blue-400 hover:text-blue-300">matar.ailab@gmail.com</a>
          </p>
        </Section>

        <Section title="2. Dati raccolti e finalità">
          <p>Raccogliamo e trattiamo i seguenti dati personali:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong className="text-white">Dati di contatto</strong> (nome, email, azienda): forniti volontariamente tramite il modulo di contatto. Finalità: rispondere alle richieste e fornire i servizi richiesti.</li>
            <li><strong className="text-white">Dati di navigazione</strong> (indirizzo IP, pagine visitate, durata sessione): raccolti automaticamente tramite strumenti di analisi. Finalità: migliorare il sito e comprendere il comportamento degli utenti.</li>
            <li><strong className="text-white">Dati di prenotazione</strong>: se prenoti una consulenza tramite Cal.com, i dati sono trattati da Cal.com secondo la propria Privacy Policy.</li>
          </ul>
        </Section>

        <Section title="3. Base giuridica del trattamento">
          <ul className="list-disc list-inside space-y-2">
            <li>Esecuzione di misure precontrattuali o contrattuali (Art. 6.1.b GDPR)</li>
            <li>Legittimo interesse del titolare (Art. 6.1.f GDPR) per l'analisi del traffico</li>
            <li>Consenso dell'interessato (Art. 6.1.a GDPR) per i cookie non essenziali</li>
          </ul>
        </Section>

        <Section title="4. Conservazione dei dati">
          <p>I dati di contatto sono conservati per il tempo necessario a gestire la richiesta e, successivamente, per un massimo di 24 mesi per finalità di legittimo interesse commerciale.</p>
          <p>I dati di navigazione sono conservati secondo le politiche degli strumenti di analisi utilizzati (PostHog: max 12 mesi).</p>
        </Section>

        <Section title="5. Comunicazione e trasferimento dei dati">
          <p>I dati non vengono venduti a terzi. Possono essere comunicati a:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong className="text-white">Web3Forms</strong> (invio email del modulo di contatto) — US, Standard Contractual Clauses</li>
            <li><strong className="text-white">PostHog</strong> (analisi del traffico) — US, Standard Contractual Clauses</li>
            <li><strong className="text-white">Cal.com</strong> (prenotazione consulenze) — US, Standard Contractual Clauses</li>
            <li><strong className="text-white">Sanity</strong> (gestione contenuti blog) — US, Standard Contractual Clauses</li>
          </ul>
        </Section>

        <Section title="6. Diritti dell'interessato">
          <p>Ai sensi del GDPR (artt. 15-22) hai il diritto di:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Accedere ai tuoi dati personali</li>
            <li>Rettificarli o aggiornarli</li>
            <li>Richiederne la cancellazione ("diritto all'oblio")</li>
            <li>Limitare o opporti al trattamento</li>
            <li>Richiedere la portabilità dei dati</li>
            <li>Revocare il consenso in qualsiasi momento</li>
          </ul>
          <p className="mt-3">Per esercitare i tuoi diritti, scrivi a: <a href="mailto:matar.ailab@gmail.com" className="text-blue-400 hover:text-blue-300">matar.ailab@gmail.com</a></p>
          <p>Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">garanteprivacy.it</a>).</p>
        </Section>

        {/* COOKIE POLICY */}
        <div className="border-t border-white/10 pt-12 mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Cookie Policy</h1>
          <p className="text-slate-500 text-sm">Ultimo aggiornamento: aprile 2025</p>
        </div>

        <Section title="Cosa sono i cookie">
          <p>I cookie sono piccoli file di testo che i siti web salvano nel tuo browser. Permettono al sito di ricordare le tue preferenze e di raccogliere informazioni statistiche sulla navigazione.</p>
        </Section>

        <Section title="Cookie utilizzati da questo sito">
          <div className="space-y-6">
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white font-medium mb-1">Cookie tecnici (necessari)</p>
              <p>Indispensabili per il funzionamento del sito. Non richiedono consenso.</p>
              <p className="mt-2"><strong className="text-slate-300">Esempio:</strong> preferenze di lingua, sessione utente.</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white font-medium mb-1">Cookie analitici — PostHog</p>
              <p>Raccolgono dati anonimi sul comportamento degli utenti (pagine visitate, durata sessione). Richiedono il tuo consenso.</p>
              <p className="mt-2"><strong className="text-slate-300">Provider:</strong> PostHog Inc. — <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Privacy Policy</a></p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white font-medium mb-1">Cookie di terze parti — Calendly</p>
              <p>Utilizzati quando prenoti una consulenza tramite il widget Calendly integrato nel sito.</p>
              <p className="mt-2"><strong className="text-slate-300">Provider:</strong> Cal.com Inc. — <a href="https://cal.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Privacy Policy</a></p>
            </div>
          </div>
        </Section>

        <Section title="Come gestire i cookie">
          <p>Puoi gestire o disabilitare i cookie nelle impostazioni del tuo browser:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Safari</a></li>
          </ul>
          <p className="mt-3">Disabilitare i cookie potrebbe influire sul corretto funzionamento di alcune parti del sito.</p>
        </Section>

        <div className="text-center mt-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft size={14} /> Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
