import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { useLanguage } from '../contexts/LanguageContext';
import CalendlyButton from '../components/CalendlyButton';
import { client, getPostBySlugQuery, urlFor } from '../lib/sanityClient';

// Componenti per il rendering del rich text di Sanity
const ptComponents = {
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <img
          src={urlFor(value).width(800).url()}
          alt={value.alt || ''}
          className="w-full rounded-xl"
        />
        {value.caption && (
          <figcaption className="text-center text-sm text-slate-500 mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
  block: {
    normal: ({ children }) => <p className="mb-5 leading-relaxed text-slate-300">{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold text-white mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-8 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cyan-400 pl-5 my-6 text-slate-300 italic">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>
    ),
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
        {children}
      </a>
    ),
  },
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const b = t.blog;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    client.fetch(getPostBySlugQuery(slug))
      .then((data) => {
        if (data) {
          setPost(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#050B1A' }}>
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
    </div>
  );

  if (notFound || !post) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6" style={{ background: '#050B1A' }}>
      <h1 className="text-3xl font-medium text-white mb-4">Articolo non trovato</h1>
      <Link to="/blog" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
        <ArrowLeft size={16} /> {b.back}
      </Link>
    </div>
  );

  const title = lang === 'en' && post.title_en ? post.title_en : post.title;
  const content = lang === 'en' && post.content_en ? post.content_en : post.content;
  const excerpt = lang === 'en' && post.excerpt_en ? post.excerpt_en : post.excerpt;

  const fmtDate = (s) => {
    if (!s) return '';
    try {
      return new Date(s).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch { return ''; }
  };

  return (
    <div className="min-h-screen" style={{ background: '#050B1A' }}>
      <Helmet>
        <title>{`${post.seo_title || title} | Matar.AI`}</title>
        <meta name="description" content={post.seo_description || excerpt || ''} />
        <meta property="og:title" content={post.seo_title || title || ''} />
        <meta property="og:description" content={post.seo_description || excerpt || ''} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Cover */}
      {post.cover_image && (
        <div className="relative h-[50vh] overflow-hidden">
          <img src={post.cover_image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,11,26,0.3) 0%, rgba(5,11,26,0.95) 100%)' }} />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* Back */}
        <Link to="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={14} /> {b.back}
        </Link>

        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10">
            {post.category}
          </span>
          {(post.published_at || post._createdAt) && (
            <span className="text-xs text-slate-500">{fmtDate(post.published_at || post._createdAt)}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight leading-tight mb-6">
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-lg text-slate-400 leading-relaxed mb-8 border-l-4 border-blue-500/40 pl-5">
            {excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="blog-content">
          {content && <PortableText value={content} components={ptComponents} />}
        </div>

        {/* CTA Section */}
        <div className="mt-16 glass-card rounded-2xl p-8 border border-blue-500/20 text-center">
          <h3 className="text-xl font-semibold text-white mb-3">{b.cta_title}</h3>
          <p className="text-slate-400 mb-6 text-sm">{b.cta_body}</p>
          <CalendlyButton
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-medium px-7 py-3 rounded-xl transition-all duration-200">
            {b.cta_btn} <ArrowRight size={16} />
          </CalendlyButton>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
