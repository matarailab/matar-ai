import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import ScrollReveal from "@/components/ScrollReveal";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { LanguageProvider } from "@/contexts/LanguageContext";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://matar.studio";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Matar.AI — Integrazione AI per Aziende | Automazioni & Esperienze 3D/AR/VR",
  description: "Porta l'AI nel cuore della tua azienda. Agenti AI personalizzati, automazioni aziendali, formazione team ed esperienze 3D/AR/VR. Partner strategico per aziende italiane ed europee. Prenota una consulenza gratuita.",
  keywords: "AI per aziende, automazioni aziendali, agenti AI, formazione AI, esperienze AR VR, integrazione intelligenza artificiale, digital transformation Italia, Matar.AI, EvolverAI",
  robots: "index, follow",
  author: "Matar.AI",
  language: "Italian",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "Matar.AI",
    title: "Matar.AI — Integrazione AI per Aziende",
    description: "Porta l'AI nel cuore della tua azienda. Automazioni, formazione team e esperienze immersive. Risultati misurabili, non promesse.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Matar.AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matar.AI — Integrazione AI per Aziende",
    description: "Agenti AI personalizzati, automazioni aziendali ed esperienze 3D/AR/VR per il tuo business.",
    images: ["/og-image.jpg"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="h-full antialiased" style={{ background: "#050B1A" }}>
      <body className="min-h-full flex flex-col bg-[#050B1A] text-white font-sans">
        <LanguageProvider>
          <ScrollReveal />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <ExitIntentPopup />
        </LanguageProvider>
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
