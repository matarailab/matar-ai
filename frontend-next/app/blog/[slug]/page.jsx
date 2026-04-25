import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { client, getPostBySlugQuery, urlFor } from '@/lib/sanityClient';
import { ArrowLeft } from 'lucide-react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://matar.studio';

const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={urlFor(value).width(800).url()}
        alt={value.alt || ''}
        className="w-full my-8 rounded-lg"
      />
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold text-slate-200 mt-6 mb-3">{children}</h3>,
    normal: ({ children }) => <p className="text-slate-400 leading-relaxed mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside text-slate-400 mb-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside text-slate-400 mb-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

// Pre-render every blog post at build time
export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`);
    return (slugs || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const post = await client.fetch(getPostBySlugQuery(slug));
    if (!post) return { title: 'Articolo non trovato' };
    const title = post.seo_title || post.title;
    const description = post.seo_description || post.excerpt || '';
    const image = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : `${SITE}/og-image.jpg`;
    return {
      title: `${title} | Matar.AI`,
      description,
      openGraph: { title, description, type: 'article', images: [image] },
      twitter: { card: 'summary_large_image', title, description, images: [image] },
    };
  } catch {
    return { title: 'Blog | Matar.AI' };
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  let post = null;
  try {
    post = await client.fetch(getPostBySlugQuery(slug));
  } catch {
    notFound();
  }
  if (!post) notFound();

  const { title, content, mainImage, publishedAt, category, author } = post;

  return (
    <article className="pt-20 pb-20 px-6 bg-[#050B1A] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors">
          <ArrowLeft size={16} /> Torna al blog
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            {category && (
              <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-400/10">
                {category.title}
              </span>
            )}
            {publishedAt && (
              <span className="text-sm text-slate-500">
                {new Date(publishedAt).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {title}
          </h1>

          {author && (
            <p className="text-slate-400">
              di <strong className="text-slate-300">{author}</strong>
            </p>
          )}
        </div>

        {mainImage && (
          <div className="mb-12 rounded-2xl overflow-hidden">
            <img src={urlFor(mainImage).width(800).url()} alt={title} className="w-full object-cover" />
          </div>
        )}

        <div className="blog-content mb-12">
          {content && <PortableText value={content} components={portableTextComponents} />}
        </div>

        <div className="border-t border-white/10 pt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft size={16} /> Leggi altri articoli
          </Link>
        </div>
      </div>
    </article>
  );
}
