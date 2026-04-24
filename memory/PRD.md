# PRD — Matar.AI Personal Brand Website

## Problema Originale
Costruire un sito web professionale, moderno e orientato alla conversione per il personal brand di **Matar Gueye** nel settore AI, automazioni e tecnologie immersive (3D, AR, VR). Il sito deve essere un sistema di acquisizione clienti high-ticket, NON un portfolio.

## Target
Aziende e professionisti pronti a investire in soluzioni AI e tecnologie immersive.

## Requisiti Core
- **Sezioni**: Hero (CTA forte), Per Chi È, Servizi (AI/Automazioni, Formazione, 3D/AR/VR), Metodo/Processo, Case Study, About (Matar Gueye), Blog/Insights, Contatti
- **Design**: Premium, look da startup SaaS AI — dark theme con gradiente blu/viola/teal
- **Lingua**: Italiano (default) + switch Inglese
- **Calendly**: `https://calendly.com/g-mat1993/30min` (popup o nuova tab)
- **CMS Blog**: TipTap rich text editor, categorie, multilingua, SEO
- **Copy**: Prima persona (personal brand Matar Gueye)

## Architecture
```
/app/
├── backend/
│   ├── .env (MONGO_URL, DB_NAME, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, FRONTEND_URL)
│   ├── requirements.txt
│   └── server.py (FastAPI + MongoDB)
├── frontend/
│   ├── .env (REACT_APP_BACKEND_URL)
│   ├── package.json
│   ├── public/index.html (Calendly preloaded, SEO meta)
│   ├── src/
│   │   ├── App.js (Router, LanguageContext, AuthContext)
│   │   ├── index.css (Tailwind + Design System CSS Variables)
│   │   ├── App.css (animations, gradient-text, btn-primary, glass-card)
│   │   ├── translations.js (IT/EN complete)
│   │   ├── components/
│   │   │   ├── Navbar.jsx (fixed, scroll, mobile, language toggle, CalendlyButton)
│   │   │   ├── Footer.jsx
│   │   │   ├── CalendlyButton.jsx (popup via window.Calendly + fallback)
│   │   │   ├── RichTextEditor.jsx (TipTap)
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui/ (shadcn components)
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx (JWT)
│   │   │   └── LanguageContext.jsx (IT/EN)
│   │   └── pages/
│   │       ├── HomePage.jsx (Hero, ForWhom, Services, Method, CaseStudies, Testimonials, ChiSono, About, BlogPreview, Contact, FinalCTA)
│   │       ├── BlogPage.jsx
│   │       ├── BlogPostPage.jsx
│   │       ├── AdminLoginPage.jsx
│   │       └── AdminDashboardPage.jsx
└── memory/
    ├── PRD.md (questo file)
    ├── test_credentials.md
    └── ROADMAP.md
```

## Design System (Implementato)
- **Colori**: `--color-primary-500: #2563EB`, `--color-secondary-500: #7C3AED`, `--color-accent-500: #06B6D4`
- **Background**: `--color-bg-main: #0B0F19`
- **Gradiente brand**: `--gradient-primary: linear-gradient(135deg, #2563EB, #7C3AED, #06B6D4)`
- **Font**: Outfit (headings), Manrope (body), JetBrains Mono (code)
- **Classi utility**: `.btn-primary`, `.gradient-text`, `.glass-card`, `.glow-primary`, `.animate-fade-up`, `.animate-fade-in`

## DB Schema
- `users`: `{email, password_hash, role, name, created_at}`
- `blog_posts`: `{title, title_en, slug, content, content_en, excerpt, excerpt_en, category, seo_title, seo_description, published, cover_image, tags, created_at, updated_at}`
- `contacts`: `{name, email, company, message, service, created_at, status}`

## API Endpoints
- `POST /api/auth/login` — Admin login (JWT cookie)
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/blog` — Post pubblici (paginati)
- `GET /api/blog/:slug` — Post singolo pubblico
- `GET /api/admin/blog` — Tutti i post (auth)
- `POST /api/admin/blog` — Crea post (auth)
- `PUT /api/admin/blog/:id` — Aggiorna post (auth)
- `DELETE /api/admin/blog/:id` — Elimina post (auth)
- `POST /api/contact` — Salva richiesta di contatto
- `GET /api/admin/contacts` — Lista contatti (auth)

## Completato ✅
- [2025] MVP: Homepage, Blog, Admin Dashboard, CMS TipTap
- [2025] Multilingual IT/EN, SEO (react-helmet-async)
- [2025] Calendly integration (popup + fallback)
- [2026-04] Premium redesign: design system CSS variables applicato
- [2026-04] CSS bug fix (AboutSection fontFamily)
- [2026-04] CalendlyButton semplificato (preloaded in index.html)
- [2026-04] .btn-primary gradient, .gradient-text aggiornato
- [2026-04] Foto professionale Matar Gueye integrata nella sezione Chi Sono
- [2026-04] Logo più grande (h-14) con glow effect in navbar, animazioni scroll-reveal globali (IntersectionObserver), stagger su card, reveal-left/right su sezioni split
- [2026-04] Admin dashboard: aggiunta sezione Richieste di Contatto con tab switcher, badge nuove richieste, espansione dettagli, link mailto risposta rapida
- [2026-04] Testing completo: 100% pass (15/15 backend, 9/9 frontend)

## P1 — Backlog Prioritario
- [ ] Aggiunta foto professionale Matar Gueye nella sezione Chi Sono
- [ ] Google Analytics GA4 (utente deve fornire ID)
- [ ] Ottimizzazione SEO avanzata (sitemap.xml, structured data)
- [ ] Admin: gestione contatti (visualizzazione e stato richieste)

## P2 — Future
- [ ] Brute-force protection sul login admin
- [ ] Cookie secure=True per produzione (HTTPS)
- [ ] Email notification su nuova richiesta di contatto (es. Resend)
- [ ] Case study dettagliate (pagine dedicate)
- [ ] Sitemap automatica
