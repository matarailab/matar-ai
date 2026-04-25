'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const translations = {
  it: {
    footer: {
      description: "Integrazione AI per aziende. Agenti AI, automazioni e esperienze immersive.",
      powered_by: "Powered by",
      services_title: "Servizi",
      company_title: "Azienda",
      copyright: "2025 Matar.AI. Tutti i diritti riservati.",
      s_links: [
        ["Agenti AI", "/#services"],
        ["Automazioni Aziendali", "/#services"],
        ["Formazione AI", "/#method"],
        ["Esperienze 3D/AR/VR", "/#services"],
      ],
      c_links: [
        ["Chi sono", "/#chi-sono"],
        ["Insights", "/blog"],
        ["Privacy & Cookie", "/privacy"],
        ["Contatti", "/#contact"],
      ],
    },
  },
  en: {
    footer: {
      description: "AI integration for enterprises. AI agents, automations and immersive experiences.",
      powered_by: "Powered by",
      services_title: "Services",
      company_title: "Company",
      copyright: "2025 Matar.AI. All rights reserved.",
      s_links: [
        ["AI Agents", "/#services"],
        ["Business Automations", "/#services"],
        ["AI Training", "/#method"],
        ["3D/AR/VR Experiences", "/#services"],
      ],
      c_links: [
        ["About", "/#chi-sono"],
        ["Insights", "/blog"],
        ["Privacy & Cookies", "/privacy"],
        ["Contact", "/#contact"],
      ],
    },
  },
};

export default function Footer() {
  const { lang } = useLanguage();
  const t = (translations[lang] || translations.it).footer;

  return (
    <footer className="bg-[#030810] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-14">
          <div className="md:col-span-2">
            <img
              src="/logo.png"
              alt="Matar.AI"
              className="w-64 h-auto object-contain mb-5"
              style={{ filter: 'brightness(8) drop-shadow(0 0 8px rgba(99,102,241,0.4))' }}
            />
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{t.description}</p>
            <p className="text-xs text-slate-600 mt-4">
              {t.powered_by} <span className="text-purple-400 font-medium">EvolverAI</span>
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t.services_title}</h4>
            <ul className="space-y-2.5">
              {t.s_links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t.company_title}</h4>
            <ul className="space-y-2.5">
              {t.c_links.map(([label, href]) => (
                <li key={label}>
                  {href.startsWith('/') ? (
                    <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</Link>
                  ) : (
                    <a href={href} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">&copy; {t.copyright}</p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/matar.ai_/" target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://www.linkedin.com/in/matar-gueye-2b41a4269" target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="#contact" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Prenota →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
