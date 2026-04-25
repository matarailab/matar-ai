'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CalendlyButton from './CalendlyButton';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t: translations } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const t = translations.nav;

  const navLink = (label, href, testid, mobile = false) => {
    const cls = `text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium ${mobile ? 'block py-2' : ''}`;
    if (href.startsWith('#')) {
      return isHome ? (
        <a key={testid} href={href} className={cls} data-testid={testid} onClick={() => setOpen(false)}>
          {label}
        </a>
      ) : (
        <Link key={testid} href={`/#${href.slice(1)}`} className={cls} data-testid={testid} onClick={() => setOpen(false)}>
          {label}
        </Link>
      );
    }
    return (
      <Link key={testid} href={href} className={cls} data-testid={testid} onClick={() => setOpen(false)}>
        {label}
      </Link>
    );
  };

  const links = [
    [t.services, '#services', 'nav-services'],
    [t.method, '#method', 'nav-method'],
    [t.results, '#results', 'nav-results'],
    [t.about, '#chi-sono', 'nav-about'],
    [t.blog, '/blog', 'nav-blog'],
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl border-b' : 'bg-transparent'
      }`}
      style={scrolled ? { background: 'rgba(11,15,25,0.85)', borderColor: 'rgba(255,255,255,0.08)' } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" data-testid="nav-logo" className="flex items-center">
          <img
            src="/logo.png"
            alt="Matar.AI"
            className="w-44 h-auto object-contain"
            style={{ filter: 'brightness(8) drop-shadow(0 0 6px rgba(99,102,241,0.5))' }}
          />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {links.map(([label, href, testid]) => navLink(label, href, testid))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            data-testid="lang-toggle"
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 border border-white/10 rounded-md hover:border-white/30"
          >
            <Globe size={13} />
            <span>{lang === 'it' ? 'EN' : 'IT'}</span>
          </button>
          <CalendlyButton
            testId="nav-cta"
            className="btn-primary text-white text-sm font-medium px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {t.cta}
          </CalendlyButton>
        </div>

        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-btn"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-6 py-5 border-b backdrop-blur-xl flex flex-col gap-1"
          style={{ background: 'rgba(11,15,25,0.95)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {links.map(([label, href, testid]) => navLink(label, href, testid, true))}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => { setLang(lang === 'it' ? 'en' : 'it'); setOpen(false); }}
              className="text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <Globe size={13} /> {lang === 'it' ? 'EN' : 'IT'}
            </button>
            <CalendlyButton
              testId="mobile-nav-cta"
              className="btn-primary text-white text-sm font-medium px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              {t.cta}
            </CalendlyButton>
          </div>
        </div>
      )}
    </nav>
  );
}
