'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, ChevronRight, ExternalLink, Star, ArrowUpRight, Plus, Minus, Download, Mail, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import CalendlyButton from '@/components/CalendlyButton';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { client, getLatestPostsQuery, urlFor } from '@/lib/sanityClient';
import LeadMagnetModal from '@/components/LeadMagnetModal';
import NewsletterForm from '@/components/NewsletterForm';

const PORTRAIT = "/portrait.jpg";

/* ── Reusable section header ─────────────────────────────── */
const SectionHeader = ({ overline, title, gradient, subtitle, center = true }) => {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={`reveal mb-16 ${center ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-3 mb-5 ${center ? 'justify-center' : ''}`}>
        <div className="h-px w-8 bg-cyan-500/60" />
        <span className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-400">{overline}</span>
        <div className="h-px w-8 bg-cyan-500/60" />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-4" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
        {title}{gradient && <> <span className="gradient-text">{gradient}</span></>}
      </h2>
      {subtitle && <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
};

/* ── HERO ─────────────────────────────────────────────────── */
const HeroSection = ({ t }) => {
  const h = t.hero;
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#0B0F19' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[180px] opacity-30 animate-orb" style={{ background: 'radial-gradient(circle, #2563EB, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20" style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)', animation: 'orb-float 10s ease-in-out infinite', animationDelay: '4s' }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] mb-8 animate-fade-in backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-xs font-mono text-slate-300 tracking-widest">{h.overline}</span>
            </div>
            <h1 className="animate-fade-up delay-100 font-bold text-white leading-[1.05] mb-6"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)', letterSpacing: '-0.04em' }}>
              {h.h1_part1}{' '}
              <em className="gradient-text not-italic">{h.h1_gradient}</em>
              <br />{h.h1_part3}
            </h1>
            <p className="animate-fade-up delay-200 text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">{h.subtitle}</p>
            <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-3 mb-14">
              <CalendlyButton testId="hero-cta-primary"
                className="btn-primary group inline-flex items-center justify-center gap-2.5 text-white font-semibold px-8 py-4 rounded-xl text-base">
                {h.cta_primary}
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-200" />
              </CalendlyButton>
              <a href="#method" data-testid="hero-cta-secondary"
                className="inline-flex items-center justify-center gap-2.5 border border-white/12 text-slate-300 font-medium px-8 py-4 rounded-xl hover:bg-white/[0.05] hover:border-white/25 hover:text-white transition-all duration-300 text-base">
                {h.cta_secondary} <ChevronRight size={15} />
              </a>
            </div>
            <div className="animate-fade-up delay-500 grid grid-cols-4 gap-0 rounded-2xl overflow-hidden max-w-sm"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
              {[[h.stat1_v, h.stat1_l, '#2563EB'], [h.stat2_v, h.stat2_l, '#06B6D4'], [h.stat3_v, h.stat3_l, '#7C3AED'], [h.stat4_v, h.stat4_l, '#10B981']].map(([val, label, color], i) => (
                <div key={i} className={`py-4 px-2 text-center ${i < 3 ? 'border-r' : ''}`} style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <div className="text-lg font-bold" style={{ color, fontFamily: "'Outfit', sans-serif" }}>{val}</div>
                  <div className="text-[9px] text-slate-600 tracking-wide mt-0.5 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade-up delay-200 flex justify-center lg:justify-end">
            <div className="relative w-72 md:w-80 lg:w-[360px]">
              <div className="absolute inset-0 rounded-3xl blur-[60px] scale-90 opacity-35" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} />
              <div className="relative rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 0 80px rgba(124,58,237,0.18)' }}>
                <img src="/portrait-standing.jpg" alt="Matar Gueye — AI Strategist" loading="eager" decoding="async" className="w-full object-cover object-top" style={{ aspectRatio: '3/4', imageRendering: 'auto' }} onError={(e) => { e.currentTarget.src = '/portrait.jpg'; }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,15,25,0.45) 0%, transparent 50%)' }} />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap backdrop-blur-xl"
                style={{ background: 'rgba(11,15,25,0.9)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Matar Gueye — AI Strategist
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0B0F19)' }} />
    </section>
  );
};

/* ── MARQUEE TICKER ──────────────────────────────────────── */
const MarqueeTicker = ({ t }) => {
  const base = t.ticker_items || [];
  const items = [...base, ...base];
  return (
    <div className="ticker-wrapper py-3.5 border-y" style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-8 text-[11px] font-mono uppercase tracking-widest whitespace-nowrap"
            style={{ color: i % 2 === 0 ? '#60a5fa' : '#6b7280' }}>
            <span className="w-1 h-1 rounded-full bg-current opacity-60" />{item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── PROBLEMS ─────────────────────────────────────────────── */
const ProblemSection = ({ t }) => {
  const p = t.problems;
  if (!p) return null;
  return (
    <section id="problems" className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #0D1424 100%)' }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader overline={p.overline} title={p.title} gradient={p.title_gradient} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {p.areas.map((area, i) => (
            <div key={i} className={`group glass-card rounded-2xl p-6 reveal stagger-${i + 1} transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-slate-600">{area.num}</span>
                <h3 className="font-semibold text-white text-sm">{area.label}</h3>
              </div>
              <ul className="space-y-2.5">
                {area.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <span className="text-blue-400 mt-0.5 shrink-0 font-mono text-xs">⟶</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <CalendlyButton testId="problems-cta"
            className="btn-primary inline-flex items-center gap-2.5 text-white font-semibold px-8 py-4 rounded-xl text-base">
            {p.cta} <ArrowRight size={16} />
          </CalendlyButton>
        </div>
      </div>
    </section>
  );
};

/* ── SERVICES ─────────────────────────────────────────────── */
const ServicesSection = ({ t }) => {
  const s = t.services;
  const palette = [
    { color: '#2563EB', glow: 'rgba(37,99,235,0.3)', bg: 'rgba(37,99,235,0.06)' },
    { color: '#06B6D4', glow: 'rgba(6,182,212,0.3)', bg: 'rgba(6,182,212,0.05)' },
    { color: '#7C3AED', glow: 'rgba(124,58,237,0.3)', bg: 'rgba(124,58,237,0.06)' },
  ];
  return (
    <section id="services" className="py-28 px-6" style={{ background: '#0B0F19' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader overline={s.overline} title={s.title} gradient={s.title_gradient} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {s.items.map((item, i) => {
            const p = palette[i];
            return (
              <div key={i} data-testid={`service-card-${i}`}
                className={`group relative rounded-2xl overflow-hidden reveal stagger-${i + 1} transition-all duration-500 hover:-translate-y-2`}
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="h-[2px] w-full transition-all duration-300"
                  style={{ background: `linear-gradient(90deg, transparent 0%, ${p.color} 50%, transparent 100%)` }} />
                <div className="overflow-hidden h-44 relative">
                  <img src={item.img} alt={item.overline}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-600" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, rgba(15,23,42,0.9) 100%)` }} />
                  <span className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ color: p.color, background: `${p.bg}`, border: `1px solid ${p.color}30` }}>
                    {item.overline}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="text-base font-semibold text-white mb-5 leading-snug">{item.title}</h3>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-[10px] font-mono uppercase text-slate-600 mb-1.5 tracking-widest">Problema</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.problem}</p>
                    </div>
                    <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-[10px] font-mono uppercase text-slate-600 mb-1.5 tracking-widest">Soluzione</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{item.solution}</p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t font-mono text-xs flex items-center gap-2"
                    style={{ borderColor: 'rgba(255,255,255,0.06)', color: p.color }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                    {item.result}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 0 1px ${p.color}30, 0 0 40px ${p.glow}` }} />
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <CalendlyButton testId="services-cta"
            className="group inline-flex items-center gap-2.5 border font-medium px-8 py-3.5 rounded-xl transition-all duration-300 hover:bg-white/[0.04] text-sm"
            style={{ borderColor: 'rgba(37,99,235,0.4)', color: '#60a5fa' }}>
            Inizia con una consulenza gratuita <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </CalendlyButton>
        </div>
      </div>
    </section>
  );
};

/* ── METHOD ───────────────────────────────────────────────── */
const MethodSection = ({ t }) => {
  const m = t.method;
  return (
    <section id="method" className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #0D1424 0%, #0B0F19 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader overline={m.overline} title={m.title} gradient={m.title_gradient} subtitle={m.subtitle} />
        <div className="space-y-3">
          {m.steps.map((step, i) => (
            <div key={i} className={`group flex items-start gap-6 p-6 rounded-2xl reveal stagger-${i + 1} transition-all duration-300 hover:bg-white/[0.03]`}
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs font-mono"
                style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.08))', border: '1px solid rgba(37,99,235,0.25)', color: '#60a5fa' }}>
                {step.number}
              </div>
              <div className="flex-1 py-1">
                <h3 className="font-semibold text-white mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
              <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ChevronRight size={16} className="text-blue-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CASE STUDIES ────────────────────────────────────────── */
const CaseStudiesSection = ({ t }) => {
  const c = t.case_studies;
  return (
    <section id="results" className="py-28 px-6" style={{ background: '#020913' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader overline={c.overline} title={c.title} gradient={c.title_gradient} />
        <div className="grid md:grid-cols-3 gap-5">
          {c.items.map((item, i) => (
            <div key={i} data-testid={`case-study-${i}`}
              className="rounded-2xl p-7 group hover:-translate-y-1 transition-all duration-300"
              style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full text-cyan-400 bg-cyan-400/10 border border-cyan-400/15">{item.industry}</span>
              <h3 className="text-base font-semibold text-white mt-4 mb-4">{item.title}</h3>
              <p className="text-sm text-slate-400 mb-2"><span className="text-[10px] uppercase tracking-wider text-slate-600">Challenge </span>{item.challenge}</p>
              <p className="text-sm text-slate-300 mb-6"><span className="text-[10px] uppercase tracking-wider text-slate-600">Soluzione </span>{item.solution}</p>
              <div className="grid grid-cols-3 gap-2 pt-5 border-t border-white/[0.07]">
                {item.metrics.map((m, j) => (
                  <div key={j} className="text-center">
                    <div className="text-xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{m.v}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── TESTIMONIALS ────────────────────────────────────────── */
const TestimonialsSection = ({ t }) => {
  const tr = t.testimonials;
  if (!tr) return null;
  const avatarColors = ['#2563EB', '#06B6D4', '#7C3AED', '#10b981'];
  return (
    <section id="testimonials" className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #111827 0%, #0B0F19 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader overline={tr.overline} title={tr.title} gradient={tr.title_gradient} subtitle={tr.subtitle} />
        <div className="grid md:grid-cols-2 gap-5">
          {tr.items.map((item, i) => (
            <div key={i} data-testid={`testimonial-${i}`}
              className={`rounded-2xl p-8 relative group hover:-translate-y-1 reveal stagger-${i + 1} transition-all duration-300`}
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex gap-1 mb-6">
                {Array.from({ length: item.stars }).map((_, j) => (
                  <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-slate-300 text-base leading-relaxed mb-7 relative">
                <span className="absolute -top-3 -left-1 text-5xl text-white/[0.06] font-serif leading-none select-none">"</span>
                <p className="pl-3">{item.quote}</p>
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${avatarColors[i]}, ${avatarColors[i]}70)` }}>
                  {item.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role} · {item.company}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border border-white/[0.08] text-slate-500 shrink-0">{item.sector}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CHI SONO ─────────────────────────────────────────────── */
const ChiSonoSection = ({ t }) => {
  const cs = t.chi_sono;
  const leftRef = useScrollAnimation();
  const rightRef = useScrollAnimation();
  if (!cs) return null;
  return (
    <section id="chi-sono" className="py-28 px-6 relative overflow-hidden" style={{ background: '#0D1424' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)' }} />
      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div ref={leftRef} className="reveal-left lg:col-span-2">
            <div className="relative mb-8">
              <div className="w-full max-w-sm mx-auto lg:mx-0 rounded-3xl overflow-hidden relative"
                style={{ aspectRatio: '4/5', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 0 60px rgba(124,58,237,0.18)' }}>
                <img src="/portrait-sitting.jpg"
                  alt="Matar Gueye — AI Strategist"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.currentTarget.src = '/portrait.jpg'; }} />
                <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(to top, rgba(11,15,25,0.4) 0%, transparent 50%)' }} />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.15))', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />{cs.founder_badge}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              {cs.stats.map((s, i) => (
                <div key={i} className="p-4 rounded-xl text-center transition-all duration-300 hover:bg-white/[0.04]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>{s.v}</div>
                  <div className="text-xs text-slate-500">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <CalendlyButton testId="chi-sono-cta"
                className="btn-primary w-full justify-center inline-flex items-center gap-2 text-white font-semibold px-6 py-3.5 rounded-xl">
                {cs.cta} <ArrowRight size={16} />
              </CalendlyButton>
            </div>
          </div>
          <div ref={rightRef} className="reveal-right lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-cyan-500/60" />
              <span className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-400">{cs.overline}</span>
            </div>
            <h2 className="font-bold text-white mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.04em', lineHeight: '1.05' }}>
              {cs.name}.
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-snug">
              {cs.title_line1}<br />{cs.title_line2}
            </p>
            <div className="space-y-4 mb-10">
              <p className="text-slate-300 leading-relaxed">{cs.bio_1}</p>
              <p className="text-slate-400 leading-relaxed">{cs.bio_2}</p>
              <p className="text-slate-400 leading-relaxed">{cs.bio_3}</p>
            </div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{cs.approach_title}</h4>
            <div className="grid gap-3">
              {cs.approach.map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-xl group hover:bg-white/[0.02] transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', fontFamily: "'Outfit', sans-serif" }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{item.title}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 rounded-xl flex items-center gap-4"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', fontFamily: "'Outfit', sans-serif" }}>
                E
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">{cs.evolver_label}</p>
                <p className="font-semibold text-white">EvolverAI</p>
              </div>
              <a href="https://evolver-ai.it" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Scopri <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── ABOUT ────────────────────────────────────────────────── */
const AboutSection = ({ t }) => {
  const a = t.about;
  const ref = useScrollAnimation();
  return (
    <section id="about" className="py-20 px-6" style={{ background: '#0B0F19' }}>
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className="reveal rounded-2xl p-10 relative overflow-hidden text-center"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.04))', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08), transparent 60%)' }} />
          <div className="relative">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 mb-5">{a.overline}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-5 leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
              {a.title}<br /><span className="gradient-text">{a.title_gradient}</span>
            </h2>
            <p className="text-slate-300 mb-3 max-w-2xl mx-auto">{a.body1}</p>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">{a.body2}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {a.badges.map((b, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-300 bg-white/[0.04]">{b}</span>
              ))}
            </div>
            <a href="https://evolver-ai.it" target="_blank" rel="noopener noreferrer" data-testid="about-evolver-link"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium">
              {a.cta} <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── BLOG PREVIEW ────────────────────────────────────────── */
const BlogPreviewSection = ({ t }) => {
  const b = t.blog_preview;
  const { lang } = useLanguage();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    client.fetch(getLatestPostsQuery()).then((data) => { if (data?.length) setPosts(data); }).catch(() => {});
  }, []);

  return (
    <section id="blog" className="py-28 px-6" style={{ background: '#0B0F19' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-cyan-500/60" />
              <span className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-400">{b.overline}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
              {b.title} <span className="gradient-text">{b.title_gradient}</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-lg leading-relaxed">{b.subtitle}</p>
          </div>
          <a href="/blog" data-testid="blog-view-all" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap transition-colors">
            {b.view_all} <ChevronRight size={15} />
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {(posts.length === 0 ? [1, 2, 3] : posts).map((post, i) => (
            posts.length === 0 ? (
              <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-44 rounded-xl bg-white/5 mb-5" />
                <div className="h-3 bg-white/5 rounded mb-3 w-1/3" /><div className="h-5 bg-white/5 rounded mb-2" /><div className="h-4 bg-white/5 rounded w-2/3" />
              </div>
            ) : (
              <a key={i} href={`/blog/${post.slug?.current || post.slug}`} data-testid={`blog-post-preview-${i}`}
                className="group block rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {post.mainImage && (
                  <div className="overflow-hidden h-44">
                    <img src={urlFor(post.mainImage).width(400).height(176).auto('format').url()} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <span className="text-xs font-mono text-cyan-400">{post.category}</span>
                  <h3 className="text-sm font-semibold text-white mt-2 mb-3 leading-snug group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-blue-400 mt-4 font-medium group-hover:gap-2 transition-all">
                    {b.read_more} <ChevronRight size={12} />
                  </div>
                </div>
              </a>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CONTACT ──────────────────────────────────────────────── */
const ContactSection = ({ t }) => {
  const c = t.contact;
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `Nuovo contatto da ${form.name} — ${form.service || 'Matar.AI'}`,
          from_name: form.name,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', company: '', service: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200";
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const inputFocusStyle = "focus:border-blue-500/50 focus:bg-white/[0.06]";

  return (
    <section id="contact" className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #0D1424 100%)' }}>
      <div className="max-w-3xl mx-auto">
        <SectionHeader overline={c.overline} title={c.title} gradient={c.title_gradient} subtitle={c.subtitle} />
        <div className="rounded-2xl p-8 mb-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.06))', border: '1px solid rgba(37,99,235,0.2)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.1), transparent 60%)' }} />
          <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3 relative">Opzione consigliata</p>
          <h3 className="text-xl font-semibold text-white mb-2 relative">Prenota una call di 30 minuti</h3>
          <p className="text-sm text-slate-400 mb-6 relative">Analizziamo insieme dove l'AI può fare la differenza nel tuo business.</p>
          <CalendlyButton testId="contact-calendly-btn"
            className="btn-primary inline-flex items-center justify-center gap-2.5 text-white font-semibold px-8 py-4 rounded-xl relative">
            Prenota Ora — È Gratuito <ArrowRight size={17} />
          </CalendlyButton>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <span className="text-xs text-slate-600 font-mono">oppure scrivi</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {status === 'success' ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle size={36} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{c.success_title}</h3>
            <p className="text-slate-400">{c.success_body}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-2xl p-8 space-y-5"
            style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">{c.name_label}</label>
                <input data-testid="contact-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder={c.name_ph} className={`${inputCls} ${inputFocusStyle}`} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">{c.email_label}</label>
                <input data-testid="contact-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder={c.email_ph} className={`${inputCls} ${inputFocusStyle}`} style={inputStyle} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">{c.company_label}</label>
                <input data-testid="contact-company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder={c.company_ph} className={`${inputCls} ${inputFocusStyle}`} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">{c.service_label}</label>
                <select data-testid="contact-service" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                  className={inputCls} style={{ ...inputStyle, background: '#0F172A' }}>
                  <option value="">{c.service_ph}</option>
                  {c.service_opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">{c.msg_label}</label>
              <textarea data-testid="contact-message" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required
                placeholder={c.msg_ph} className={`${inputCls} ${inputFocusStyle} resize-none`} style={inputStyle} />
            </div>
            {status === 'error' && <p className="text-red-400 text-sm">{c.error}</p>}
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-600">{c.privacy}</p>
              <button data-testid="contact-submit" type="submit" disabled={loading}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-xl">
                {loading ? '...' : c.cta} <ArrowRight size={15} />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

/* ── FAQ ──────────────────────────────────────────────────── */
const FAQSection = ({ t }) => {
  const f = t.faq;
  const [open, setOpen] = useState(null);
  if (!f) return null;
  return (
    <section id="faq" className="py-28 px-6" style={{ background: '#0B0F19' }}>
      <div className="max-w-2xl mx-auto">
        <SectionHeader overline={f.overline} title={f.title} gradient={f.title_gradient} />
        <div className="space-y-3">
          {f.items.map((item, i) => (
            <div key={i} data-testid={`faq-item-${i}`}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{ border: `1px solid ${open === i ? 'rgba(37,99,235,0.35)' : 'rgba(255,255,255,0.07)'}`, background: open === i ? 'rgba(37,99,235,0.04)' : 'rgba(255,255,255,0.02)' }}>
              <button className="w-full flex items-center justify-between text-left px-6 py-5 gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-sm font-medium text-white leading-snug">{item.q}</span>
                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{ background: open === i ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.05)', color: open === i ? '#60a5fa' : '#6b7280' }}>
                  {open === i ? <Minus size={12} /> : <Plus size={12} />}
                </span>
              </button>
              <div className={`faq-content ${open === i ? 'open' : ''}`}>
                <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── FINAL CTA ────────────────────────────────────────────── */
const FinalCTASection = ({ t }) => {
  const f = t.final_cta;
  return (
    <section className="py-32 px-6 relative overflow-hidden" style={{ background: '#0B0F19' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 65%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-bold text-white mb-5 leading-tight"
          style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.04em' }}>
          {f.title}<br /><span className="gradient-text">{f.title_gradient}</span>
        </h2>
        <p className="text-slate-400 mb-10 text-lg">{f.subtitle}</p>
        <CalendlyButton testId="final-cta-btn"
          className="btn-primary group inline-flex items-center justify-center gap-2.5 text-white font-semibold px-10 py-5 rounded-xl text-lg">
          {f.cta} <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </CalendlyButton>
      </div>
    </section>
  );
};

/* ── RESOURCES (lead magnet + newsletter) ────────────────── */
const ResourcesSection = ({ onOpenMagnet }) => {
  const ref = useScrollAnimation();
  return (
    <section id="resources" className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #0D1424 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="reveal text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">Risorse gratuite</p>
          <h2 className="font-bold text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}>
            Strumenti per <span className="gradient-text">iniziare oggi</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Lead magnet card */}
          <div className="reveal stagger-1 glass-card rounded-2xl p-8 flex flex-col">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))', border: '1px solid rgba(124,58,237,0.3)' }}>
              <FileText size={22} className="text-violet-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Checklist: 5 processi pronti per l'AI</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
              I 5 processi più comuni da automatizzare per primi nel tuo flusso operativo. Ogni voce con stack consigliato, ROI atteso e tempi di setup. PDF di 12 pagine, gratis.
            </p>
            <button
              onClick={onOpenMagnet}
              className="btn-primary text-white font-medium px-5 py-3 rounded-lg text-sm flex items-center justify-center gap-2 self-start"
            >
              <Download size={16} /> Scarica checklist
            </button>
          </div>

          {/* Newsletter card */}
          <div className="reveal stagger-2 glass-card rounded-2xl p-8 flex flex-col">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(37,99,235,0.2))', border: '1px solid rgba(6,182,212,0.3)' }}>
              <Mail size={22} className="text-cyan-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Matar Signals</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
              La newsletter su AI tool, casi reali e news per chi vuole restare competitivo. Niente teoria, solo ciò che funziona davvero.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── HOME PAGE ────────────────────────────────────────────── */
function HomeInner() {
  const { t } = useLanguage();
  const [magnetOpen, setMagnetOpen] = useState(false);
  return (
    <div style={{ background: '#0B0F19' }}>
      <HeroSection t={t} />
      <MarqueeTicker t={t} />
      <ProblemSection t={t} />
      <ServicesSection t={t} />
      <MethodSection t={t} />
      <CaseStudiesSection t={t} />
      <TestimonialsSection t={t} />
      <ChiSonoSection t={t} />
      <AboutSection t={t} />
      <FAQSection t={t} />
      <BlogPreviewSection t={t} />
      <ResourcesSection onOpenMagnet={() => setMagnetOpen(true)} />
      <ContactSection t={t} />
      <FinalCTASection t={t} />
      <LeadMagnetModal open={magnetOpen} onClose={() => setMagnetOpen(false)} />
    </div>
  );
}

export default function HomePage() {
  return <HomeInner />;
}
