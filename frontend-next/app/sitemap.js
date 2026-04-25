import { client } from '@/lib/sanityClient';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://matar.studio';

export const dynamic = 'force-static';

export default async function sitemap() {
  const staticRoutes = [
    { url: `${SITE}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  let posts = [];
  try {
    const data = await client.fetch(`*[_type == "post"]{ "slug": slug.current, publishedAt, _updatedAt }`);
    posts = (data || []).map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p._updatedAt || p.publishedAt || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (e) {
    // Sanity non raggiungibile in build → solo routes statiche
  }

  return [...staticRoutes, ...posts];
}
