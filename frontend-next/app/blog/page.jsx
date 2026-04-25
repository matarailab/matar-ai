import Link from 'next/link';
import { client, getPostsQuery, urlFor } from '@/lib/sanityClient';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Insights | Matar.AI',
  description: 'Articoli su AI, automazioni aziendali, immersive tech e trasformazione digitale.',
};

export default async function BlogPage() {
  let posts = [];
  try {
    posts = (await client.fetch(getPostsQuery(50, 0))) || [];
  } catch {
    posts = [];
  }

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen bg-[#050B1A]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">AI Business Lab</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Insights
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Articoli su AI, automazioni aziendali e trasformazione digitale.
          </p>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Nessun articolo disponibile al momento.</p>
          </div>
        )}

        {posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`} className="block group">
                <article className="glass-card rounded-2xl overflow-hidden h-full hover:-translate-y-2 transition-all duration-300">
                  <div className="overflow-hidden h-44 relative" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))' }}>
                    {post.mainImage ? (
                      <img
                        src={urlFor(post.mainImage).width(600).height(352).url()}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-30" aria-hidden>✶</span>
                      </div>
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(15,23,42,0.6) 100%)' }} />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3 min-h-[22px]">
                      {post.category?.title && (
                        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 px-2 py-1 rounded bg-cyan-400/10">
                          {post.category.title}
                        </span>
                      )}
                      {post.publishedAt && (
                        <span className="text-xs text-slate-500">
                          {new Date(post.publishedAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{post.excerpt}</p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-blue-400 group-hover:gap-3 transition-all">
                      Leggi <ArrowRight size={14} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
