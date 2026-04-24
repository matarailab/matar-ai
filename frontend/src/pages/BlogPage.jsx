import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { client, getPostsQuery } from '../lib/sanityClient';

const CATEGORIES = ['AI per Aziende', 'Automazioni', 'Formazione AI', 'Trend AI', '3D/AR/VR'];
const LIMIT = 9;

const BlogPage = () => {
  const { lang, t } = useLanguage();
  const b = t.blog;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    const cat = category !== 'all' ? category : null;
    client.fetch(getPostsQuery(LIMIT, page * LIMIT, cat))
      .then(({ posts: fetched, total: tot }) => {
        setPosts(fetched || []);
        setTotal(tot || 0);
        setHasMore((page + 1) * LIMIT < tot);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [category, page]);

  const fmtDate = (s) => {
    const d = s || '';
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch { return ''; }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-6" style={{ background: '#050B1A' }}>
      <Helmet>
        <title>AI Business Lab — Insights su AI, Automazioni e 3D/AR/VR | Matar.AI</title>
        <meta name="description" content="Articoli pratici su AI per aziende, automazioni, formazione AI e tecnologie immersive. Contenuti pensati per imprenditori e manager." />
      </Helmet>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 mb-4">AI Business Lab</p>
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-4">{b.title}</h1>
          <p className="text-slate-400 max-w-xl mx-auto">{b.subtitle}</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-12">
          <button
            onClick={() => setCategory('all')}
            className={`text-sm px-4 py-2 rounded-full border transition-all duration-200 font-medium ${category === 'all' ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/15 text-slate-400 hover:border-white/30 hover:text-white'}`}
          >
            {b.all}
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`text-sm px-4 py-2 rounded-full border transition-all duration-200 font-medium ${category === cat ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/15 text-slate-400 hover:border-white/30 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-44 rounded-xl bg-white/5 mb-5" />
                <div className="h-3 bg-white/5 rounded mb-3 w-1/3" />
                <div className="h-5 bg-white/8 rounded mb-2" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">{b.no_posts || 'Nessun articolo trovato.'}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Link key={post._id || i} to={`/blog/${post.slug}`}
                className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 block">
                {post.cover_image && (
                  <div className="overflow-hidden h-44">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-cyan-400">{post.category}</span>
                    {(post.published_at || post._createdAt) && (
                      <span className="text-xs text-slate-500">{fmtDate(post.published_at || post._createdAt)}</span>
                    )}
                  </div>
                  <h2 className="text-base font-semibold text-white mt-2 mb-3 leading-snug group-hover:text-blue-300 transition-colors">
                    {lang === 'en' && post.title_en ? post.title_en : post.title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {lang === 'en' && post.excerpt_en ? post.excerpt_en : post.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-blue-400 mt-4 font-medium group-hover:gap-2 transition-all">
                    {b.read_more} <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {(hasMore || page > 0) && (
          <div className="flex items-center justify-center gap-4 mt-12">
            {page > 0 && (
              <button onClick={() => setPage(p => p - 1)} className="px-5 py-2.5 text-sm border border-white/15 rounded-lg text-slate-300 hover:border-white/30 hover:text-white transition-colors">
                ← Precedente
              </button>
            )}
            <span className="text-xs text-slate-500">Pagina {page + 1} · {total} articoli</span>
            {hasMore && (
              <button onClick={() => setPage(p => p + 1)} className="px-5 py-2.5 text-sm border border-white/15 rounded-lg text-slate-300 hover:border-white/30 hover:text-white transition-colors">
                Successiva →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
