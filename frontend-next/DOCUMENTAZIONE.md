# Documentazione Tecnica — Matar.AI

Sito web di Matar Gueye per **Matar.AI**, consulenza AI per aziende.
URL produzione: **https://matar.studio**

---

## Stack Tecnologico

| Layer | Tecnologia | Versione |
|-------|-----------|---------|
| Framework | Next.js | 16.2.4 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4 |
| Icone | Lucide React | latest |
| Animazioni | Framer Motion + CSS | — |
| CMS | Sanity | latest |
| Rich Text | @portabletext/react | — |
| Deploy | Cloudflare Pages | — |

---

## Architettura

### Modalità di rendering

Il sito usa `output: 'export'` in Next.js — genera un build **completamente statico** nella cartella `/out`. Non c'è nessun server Node.js in produzione. Le pagine vengono pre-renderizzate al momento del deploy.

```
Build locale (npm run build)
  → Genera /out (HTML + CSS + JS statici)
  → Push su GitHub
  → Cloudflare Pages rileva il push
  → Deploy automatico da /out
```

### Cloudflare Functions

Per le operazioni che richiedono chiavi API segrete (non esponibili nel browser), vengono usate le **Cloudflare Functions** — piccoli serverless worker che girano sull'edge di Cloudflare.

```
Browser → POST /api/lead-magnet  → functions/api/lead-magnet.js  → Brevo API
Browser → POST /api/newsletter   → functions/api/newsletter.js   → Beehiiv API
```

Queste funzioni leggono le variabili d'ambiente dal dashboard Cloudflare (non dal `.env.local`).

---

## Struttura Cartelle

```
frontend-next/
├── app/                        # Pagine (Next.js App Router)
│   ├── layout.js               # Layout root con provider globali
│   ├── page.jsx                # Homepage (~770 righe)
│   ├── globals.css             # CSS globale e design tokens
│   ├── blog/
│   │   ├── page.jsx            # Lista articoli (server component)
│   │   └── [slug]/page.jsx     # Articolo singolo (SSG dinamico)
│   ├── privacy/page.jsx        # Privacy Policy + Cookie Policy
│   ├── robots.js               # Genera robots.txt
│   └── sitemap.js              # Genera sitemap.xml
│
├── components/                 # Componenti riutilizzabili
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CalendlyButton.jsx
│   ├── CookieBanner.jsx
│   ├── ExitIntentPopup.jsx
│   ├── LeadMagnetModal.jsx
│   ├── NewsletterForm.jsx
│   ├── ScrollReveal.jsx
│   └── ThirdPartyScripts.jsx
│
├── contexts/
│   └── LanguageContext.jsx     # Stato lingua IT/EN + testi
│
├── hooks/
│   └── useScrollAnimation.js   # IntersectionObserver per reveal
│
├── lib/
│   ├── sanityClient.js         # Client Sanity + query GROQ
│   └── translations.js         # Tutti i testi IT/EN (~450 righe)
│
├── functions/api/              # Cloudflare Serverless Functions
│   ├── lead-magnet.js          # Email capture → Brevo
│   └── newsletter.js           # Newsletter → Beehiiv
│
├── public/                     # File statici serviti direttamente
│   ├── portrait-standing.jpg
│   ├── portrait-sitting.jpg
│   ├── logo.png / logo.svg
│   ├── og-image.jpg
│   └── 5-Processi-Operativi-AI.pdf   # Lead magnet
│
├── .env.local                  # Variabili locali (non committato)
├── next.config.mjs
├── postcss.config.mjs
└── jsconfig.json               # Path alias @/* → ./*
```

---

## Pagine

### Homepage (`/`)

Componente `'use client'` con 14 sezioni nell'ordine:

| # | Sezione | Descrizione |
|---|---------|-------------|
| 1 | HeroSection | H1 + CTA principale + foto + stats |
| 2 | MarqueeTicker | Scroller animato dei servizi |
| 3 | ProblemSection | 5 aree problematiche del target |
| 4 | ServicesSection | 3 servizi: AI & Automazioni, Formazione, 3D/AR/VR |
| 5 | MethodSection | 5 step del processo di lavoro |
| 6 | CaseStudiesSection | 3 case study con metriche |
| 7 | TestimonialsSection | 4 testimonial con stelle |
| 8 | ChiSonoSection | Bio Matar Gueye + EvolverAI |
| 9 | AboutSection | Brand positioning |
| 10 | FAQSection | 5 domande frequenti accordion |
| 11 | BlogPreviewSection | Ultimi 3 articoli da Sanity (client-side fetch) |
| 12 | ResourcesSection | Lead magnet PDF + form newsletter |
| 13 | ContactSection | Form contatti (Web3Forms) |
| 14 | FinalCTASection | CTA finale prenota call |

### Blog (`/blog`)

Server component — fetcha tutti gli articoli da Sanity al momento del build. Grid 3 colonne con immagine, categoria, data, titolo, excerpt.

### Articolo (`/blog/[slug]`)

- `generateStaticParams()` → genera una pagina statica per ogni articolo Sanity
- `generateMetadata()` → SEO dinamica (title, description, OG image) per ogni articolo
- Rendering del contenuto con `PortableText`

### Privacy (`/privacy`)

Pagina statica con Privacy Policy GDPR completa. Copre tutti i servizi terzi usati nel sito.

---

## Integrazioni Esterne

### Sanity CMS
**Scopo:** gestione articoli del blog  
**Project ID:** `7lp9d7cd` — Dataset: `production`  
**Come funziona:**
- Gli articoli vengono scritti su sanity.io/manage
- Il sito fetcha da Sanity via GROQ al momento del build (blog page) o client-side (homepage preview)
- Le immagini vengono servite da `cdn.sanity.io` con trasformazioni URL (`width`, `height`, `auto=format`)
- `.auto('format')` converte HEIF (iPhone) → WebP/JPEG automaticamente
- Le CORS origins su Sanity devono includere `https://matar.studio` per i fetch browser-side

**Schema articolo Sanity:**
```
_type: "post"
title, slug (slug.current), excerpt, content (PortableText)
cover_image (asset reference → urlFor)
published_at, author, category (stringa), tags, seo_title, seo_description
```

**Query principali in `lib/sanityClient.js`:**
- `getPostsQuery(limit, skip, category)` — lista articoli con paginazione
- `getPostBySlugQuery(slug)` — articolo singolo
- `getLatestPostsQuery(limit)` — ultimi N articoli per homepage

---

### Cal.com
**Scopo:** prenotazione call di consulenza  
**Link:** `matar-gueye-hy1zhd/discovery-call-matar-ai`  
**Come funziona:** il componente `CalendlyButton.jsx` carica lo script embed di Cal.com (tramite `ThirdPartyScripts.jsx`) e apre il modal di prenotazione al click. Se lo script non è ancora caricato, fallback a `window.open`.

---

### Web3Forms
**Scopo:** invio email dai form di contatto  
**Come funziona:** il form contatti nella homepage fa una POST a `https://api.web3forms.com/submit` con la chiave pubblica. Web3Forms invia l'email alla casella configurata senza necessità di un server. La chiave è pubblica (`NEXT_PUBLIC_`).

---

### Brevo
**Scopo:** raccolta lead dal download del PDF (lead magnet)  
**Come funziona:**
1. Utente inserisce nome + email nel `LeadMagnetModal`
2. Browser fa POST a `/api/lead-magnet` (Cloudflare Function)
3. La Function chiama Brevo REST API v3 `/contacts` → crea contatto + aggiunge alla lista #3
4. Il browser scarica il PDF da `/5-Processi-Operativi-AI.pdf`

**Variabili d'ambiente (solo server-side, Cloudflare dashboard):**
- `BREVO_API_KEY` — chiave REST API v3 (formato `xkeysib-...`)
- `BREVO_LIST_ID` — ID lista Brevo (attualmente: `3`)

**Attenzione:** la chiave Brevo inizia con `xkeysib-` (REST API). NON usare chiavi `xsmtpsib-` (SMTP).

---

### Beehiiv (Newsletter Matar Signals)
**Scopo:** iscrizione alla newsletter  
**Modalità attiva: redirect**  
**Come funziona:** il `NewsletterForm` apre in una nuova tab `https://signals.matar.studio/?email=<email>`. L'utente completa l'iscrizione direttamente su Beehiiv. Non viene usata la API di Beehiiv (richiede verifica documenti).

**Per passare alla modalità API in futuro:**
- Ottenere `BEEHIIV_API_KEY` e `BEEHIIV_PUBLICATION_ID` da Beehiiv
- Inserirli in `.env.local` e su Cloudflare
- La `functions/api/newsletter.js` è già pronta per entrambe le modalità

---

### PostHog
**Scopo:** analytics comportamentale  
**Come funziona:** `ThirdPartyScripts.jsx` carica il snippet PostHog solo se `NEXT_PUBLIC_POSTHOG_KEY` è configurato. Il `CookieBanner.jsx` integra il consenso: se l'utente rifiuta i cookie, PostHog viene disabilitato via `posthog.opt_out_capturing()`.

---

## Sistema Multilingua

Il sito supporta **Italiano** e **Inglese**.

**Come funziona:**
- `lib/translations.js` contiene un oggetto con tutte le stringhe del sito in `it` e `en`
- `contexts/LanguageContext.jsx` gestisce lo stato della lingua (default: `it`)
- Il componente `useLanguage()` hook restituisce `{ lang, setLang, t }` — dove `t` è l'oggetto con i testi nella lingua corrente
- Il toggle lingua è nella `Navbar`
- La lingua non persiste tra sessioni (reset a `it` al reload)

---

## Sistema Animazioni

**Scroll reveal:** ogni sezione usa `useScrollAnimation()` che attacca un `IntersectionObserver` al ref del DOM. Quando l'elemento entra nel viewport con soglia 0.12, aggiunge la classe `in-view`.

**Classi CSS disponibili:**
- `.reveal` — fade-up dal basso
- `.reveal-left` — slide da sinistra
- `.reveal-right` — slide da destra
- `.reveal-scale` — scala da piccolo a normale
- `.stagger-1` ... `.stagger-6` — delay progressivi per animazioni in sequenza

---

## Variabili d'Ambiente

### `.env.local` (sviluppo locale)

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=7lp9d7cd
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SANITY_USE_CDN=true

# Form contatti
NEXT_PUBLIC_WEB3FORMS_KEY=b2a492c3-1fe6-4607-a8d2-f19af7de4840

# Prenotazione call
NEXT_PUBLIC_CAL_LINK=matar-gueye-hy1zhd/discovery-call-matar-ai

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xAvL2...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# URL sito
NEXT_PUBLIC_SITE_URL=https://matar.studio

# Lead magnet (solo server — non usare NEXT_PUBLIC_)
BREVO_API_KEY=xkeysib-...
BREVO_LIST_ID=3

# Newsletter
NEXT_PUBLIC_BEEHIIV_URL=https://signals.matar.studio/
```

### Cloudflare Dashboard (produzione)

Le stesse variabili vanno inserite in **Workers & Pages → matar-ai → Settings → Environment Variables**. Le variabili senza `NEXT_PUBLIC_` (come `BREVO_API_KEY`) esistono SOLO qui, mai nel codice committato.

---

## Deploy

### Flusso completo

```
1. Modifica codice in locale
2. git add <file>
3. git commit -m "descrizione"
4. git push
5. Cloudflare rileva il push su GitHub
6. Build automatica: npm run build → genera /out
7. Deploy live su matar.studio
```

### Configurazione Cloudflare Pages

| Impostazione | Valore |
|-------------|--------|
| Repository | github.com/matarailab/matar-ai |
| Root directory | `frontend-next` |
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | 18+ |
| Framework preset | None |

### Dominio custom

`matar.studio` è collegato come Custom Domain in Cloudflare Pages. SSL gestito automaticamente da Cloudflare. Non usare la modalità SSL "Flexible" — usare "Full" o "Full (strict)".

---

## Design System

### Palette colori

| Nome | Hex | Uso |
|------|-----|-----|
| Background primario | `#0B0F19` | Sfondo principale |
| Background secondario | `#0D1424` | Sezioni alternate |
| Background card | `#111827` | Card, modali |
| Blue primario | `#2563EB` | CTA, accenti |
| Cyan accent | `#06B6D4` | Overline, badge |
| Purple accent | `#7C3AED` | Gradients, EvolverAI |
| Testo primario | `#FFFFFF` | Titoli |
| Testo secondario | `#CBD5E1` (slate-300) | Corpo testo |
| Testo muted | `#94A3B8` (slate-400) | Descrizioni |

### Font

- **Outfit** — titoli e heading (Google Fonts)
- **Manrope** — testo corpo (Google Fonts)
- **JetBrains Mono** — overline, badge, codice

### Classi utility custom

```css
.glass-card      /* card semitrasparente con blur */
.btn-primary     /* pulsante blu con gradient e glow */
.gradient-text   /* testo con gradiente blu→viola */
.ticker-wrapper  /* container per marquee infinito */
.faq-content     /* accordion con transizione smooth */
```

---

## Note Importanti

- **PDF lead magnet** è in `public/5-Processi-Operativi-AI.pdf` — per sostituirlo carica il nuovo file con lo stesso nome (o aggiorna il riferimento in `LeadMagnetModal.jsx`)
- **Le immagini Sanity in formato HEIF** (iPhone) vengono convertite automaticamente da `.auto('format')` nella URL — non serve caricarle convertite
- **In sviluppo locale** (`npm run dev`) le Cloudflare Functions non girano — il lead magnet modal fa il download diretto senza chiamare Brevo. Su produzione funziona correttamente
- **La newsletter Matar Signals** usa redirect mode: non salva le email su Brevo, porta l'utente su signals.matar.studio
- **Sanity CORS**: se si aggiunge un nuovo dominio di produzione, va aggiunto anche in sanity.io/manage → API → CORS Origins
