'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );
    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const timer = setTimeout(() => {
      document.querySelectorAll(selectors).forEach((el) => {
        el.classList.remove('in-view');
        obs.observe(el);
      });
    }, 80);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [pathname]);
  return null;
}
