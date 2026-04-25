const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://matar.studio';

export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/privacy', '/api/'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
