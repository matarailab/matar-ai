import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

/* Global scroll-reveal observer — watches ALL .reveal* elements */
const useRevealObserver = () => {
  const location = useLocation();
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );
    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const timer = setTimeout(() => {
      document.querySelectorAll(selectors).forEach(el => { el.classList.remove('in-view'); obs.observe(el); });
    }, 80);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [location.pathname]);
};

const ScrollReveal = () => { useRevealObserver(); return null; };

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
    <CookieBanner />
  </>
);

function App() {
  return (
    <HelmetProvider>
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollReveal />
          <Routes>
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
            <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
