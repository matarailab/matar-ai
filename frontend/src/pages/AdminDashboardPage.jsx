import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, LogOut, Eye, CheckCircle, X, Mail, Building2, MessageSquare, Clock, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';

const API = process.env.REACT_APP_BACKEND_URL;
const LOGO = "https://customer-assets.emergentagent.com/job_immersive-automation/artifacts/gj82ew18_Matar-AI-Transparency.png";
const CATEGORIES = ['AI per Aziende', 'Automazioni', 'Formazione AI', 'Trend AI'];

const slugify = (s) => s.toLowerCase()
  .replace(/[àáâã]/g, 'a').replace(/[èéê]/g, 'e').replace(/[ìí]/g, 'i')
  .replace(/[òó]/g, 'o').replace(/[ùú]/g, 'u')
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

const EMPTY = { title: '', title_en: '', slug: '', content: '', content_en: '', excerpt: '', excerpt_en: '', category: CATEGORIES[0], published: false, cover_image: '', seo_title: '', seo_description: '', tags: '' };

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'contacts'
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [expandedContact, setExpandedContact] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/blog`, { withCredentials: true });
      setPosts(data);
    } catch { showToast('Errore nel caricamento', 'error'); }
    finally { setLoading(false); }
  };

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admin/contacts`, { withCredentials: true });
      setContacts(data);
    } catch { showToast('Errore nel caricamento contatti', 'error'); }
    finally { setContactsLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);
  useEffect(() => { if (activeTab === 'contacts') fetchContacts(); }, [activeTab]);

  const openNew = () => {
    setEditPost(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (post) => {
    setEditPost(post);
    setForm({ ...post, tags: (post.tags || []).join(', ') });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditPost(null); setForm(EMPTY); };

  const handleChange = (field, value) => {
    setForm(f => {
      const upd = { ...f, [field]: value };
      if (field === 'title') upd.slug = slugify(value);
      return upd;
    });
  };

  const save = async () => {
    if (!form.title || !form.slug || !form.content || !form.category) {
      showToast('Compila i campi obbligatori', 'error'); return;
    }
    setSaving(true);
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [] };
    try {
      if (editPost) {
        await axios.put(`${API}/api/admin/blog/${editPost.id}`, payload, { withCredentials: true });
        showToast('Articolo aggiornato');
      } else {
        await axios.post(`${API}/api/admin/blog`, payload, { withCredentials: true });
        showToast('Articolo creato');
      }
      closeForm();
      fetchPosts();
    } catch (e) {
      const detail = e.response?.data?.detail;
      showToast(typeof detail === 'string' ? detail : 'Errore nel salvataggio', 'error');
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API}/api/admin/blog/${deleteTarget.id}`, { withCredentials: true });
      showToast('Articolo eliminato');
      setDeleteTarget(null);
      fetchPosts();
    } catch { showToast('Errore', 'error'); }
  };

  const handleLogout = async () => { await logout(); nav('/admin/login'); };

  const stats = { total: posts.length, pub: posts.filter(p => p.published).length, draft: posts.filter(p => !p.published).length };
  const contactStats = { total: contacts.length, new: contacts.filter(c => !c.status || c.status === 'new').length };

  const fmtDate = (s) => { try { return new Date(s).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return '–'; } };

  const statusColor = (s) => {
    if (!s || s === 'new') return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
    if (s === 'contacted') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
  };
  const statusLabel = (s) => ({ new: 'Nuovo', contacted: 'Contattato', closed: 'Chiuso' }[s] || 'Nuovo');

  return (
    <div className="min-h-screen" style={{ background: '#050B1A', fontFamily: "'Manrope', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3.5 rounded-xl text-sm font-medium shadow-xl flex items-center gap-3 transition-all ${toast.type === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-300' : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'}`}>
          {toast.type === 'error' ? <X size={14} /> : <CheckCircle size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-[#050B1A]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Matar.AI" className="h-7 object-contain" />
            <span className="text-xs text-slate-500 border-l border-white/10 pl-3">CMS Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{user?.email}</span>
            <button data-testid="admin-logout" onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <button data-testid="tab-posts" onClick={() => setActiveTab('posts')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'posts' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            Articoli ({stats.total})
          </button>
          <button data-testid="tab-contacts" onClick={() => setActiveTab('contacts')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'contacts' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            Richieste
            {contactStats.new > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{contactStats.new}</span>
            )}
          </button>
        </div>

        {activeTab === 'posts' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[['Totale', stats.total, '#3B82F6'], ['Pubblicati', stats.pub, '#10b981'], ['Bozze', stats.draft, '#f59e0b']].map(([label, val, color]) => (
                <div key={label} className="glass-card rounded-xl p-5">
                  <div className="text-2xl font-semibold text-white mb-1" style={{ color }}>{val}</div>
                  <div className="text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>

            {/* Actions bar */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold text-white">Articoli</h1>
              <button data-testid="admin-new-post" onClick={openNew}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200">
                <Plus size={15} /> Nuovo Articolo
              </button>
            </div>

            {/* Posts table */}
            {loading ? (
              <div className="text-center py-16 text-slate-500">Caricamento...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-slate-500">Nessun articolo. Creane uno!</div>
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="admin-posts-table">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Titolo', 'Categoria', 'Stato', 'Data', 'Azioni'].map(h => (
                          <th key={h} className="text-left text-xs text-slate-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post, i) => (
                        <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-white font-medium leading-snug truncate max-w-[260px]">{post.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">/blog/{post.slug}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-slate-400">{post.category}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.published ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                              {post.published ? 'Pubblicato' : 'Bozza'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{fmtDate(post.created_at)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button data-testid={`edit-post-${i}`} onClick={() => openEdit(post)}
                                className="p-1.5 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-blue-400 border border-white/10 hover:border-blue-500/20 rounded-lg transition-colors">
                                <Eye size={13} />
                              </a>
                              <button data-testid={`delete-post-${i}`} onClick={() => setDeleteTarget(post)}
                                className="p-1.5 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-lg transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ── CONTACTS TAB ── */
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[['Totale Richieste', contactStats.total, '#3B82F6'], ['Nuove', contactStats.new, '#EF4444']].map(([label, val, color]) => (
                <div key={label} className="glass-card rounded-xl p-5">
                  <div className="text-2xl font-semibold mb-1" style={{ color }}>{val}</div>
                  <div className="text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold text-white">Richieste di Contatto</h1>
              <button onClick={fetchContacts} className="text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors">
                Aggiorna
              </button>
            </div>

            {contactsLoading ? (
              <div className="text-center py-16 text-slate-500">Caricamento...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-2xl">
                <Mail size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">Nessuna richiesta ancora. Le richieste dal form di contatto appariranno qui.</p>
              </div>
            ) : (
              <div className="space-y-3" data-testid="contacts-list">
                {contacts.map((c, i) => (
                  <div key={c.id || i} data-testid={`contact-item-${i}`}
                    className="glass-card rounded-xl overflow-hidden transition-all duration-200 hover:border-white/12">
                    <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
                      onClick={() => setExpandedContact(expandedContact === i ? null : i)}>
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 text-white"
                          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                          {(c.name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{c.name || '—'}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10} />{c.email}</span>
                            {c.company && <span className="text-xs text-slate-600 flex items-center gap-1"><Building2 size={10} />{c.company}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {c.service && <span className="hidden sm:block text-xs px-2 py-1 rounded-full border border-white/10 text-slate-500">{c.service}</span>}
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColor(c.status)}`}>{statusLabel(c.status)}</span>
                        <span className="text-xs text-slate-600 whitespace-nowrap hidden sm:block"><Clock size={10} className="inline mr-1" />{fmtDate(c.created_at)}</span>
                        <ChevronDown size={14} className={`text-slate-500 transition-transform ${expandedContact === i ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {expandedContact === i && (
                      <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="pt-4 space-y-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-300 leading-relaxed">{c.message || '—'}</p>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <span className="text-xs text-slate-500">Cambia stato:</span>
                            {['new', 'contacted', 'closed'].map(s => (
                              <span key={s} className={`text-xs px-2.5 py-1 rounded-full border cursor-default ${statusColor(s)}`}>
                                {statusLabel(s)}
                              </span>
                            ))}
                            <a href={`mailto:${c.email}`} target="_blank" rel="noopener noreferrer"
                              className="ml-auto flex items-center gap-1.5 text-xs bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-lg transition-colors">
                              <Mail size={11} /> Rispondi
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative w-full max-w-2xl h-screen overflow-y-auto bg-[#070D1C] border-l border-white/10 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-white">{editPost ? 'Modifica Articolo' : 'Nuovo Articolo'}</h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Titolo (IT) *</label>
                  <input data-testid="post-title-input" value={form.title} onChange={e => handleChange('title', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Titolo (EN)</label>
                  <input value={form.title_en} onChange={e => handleChange('title_en', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Slug URL *</label>
                  <input data-testid="post-slug-input" value={form.slug} onChange={e => handleChange('slug', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Categoria *</label>
                  <select data-testid="post-category-select" value={form.category} onChange={e => handleChange('category', e.target.value)}
                    className="w-full bg-[#050B1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">URL Immagine Copertina</label>
                <input value={form.cover_image} onChange={e => handleChange('cover_image', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Estratto (IT)</label>
                <textarea rows={2} value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none" />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Contenuto HTML (IT) *</label>
                <RichTextEditor
                  value={form.content}
                  onChange={(html) => handleChange('content', html)}
                  placeholder="Scrivi il contenuto dell'articolo..."
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Contenuto (EN)</label>
                <RichTextEditor
                  value={form.content_en}
                  onChange={(html) => handleChange('content_en', html)}
                  placeholder="Write the English content (optional)..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">SEO Title</label>
                  <input value={form.seo_title} onChange={e => handleChange('seo_title', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Tags (separati da virgola)</label>
                  <input value={form.tags} onChange={e => handleChange('tags', e.target.value)}
                    placeholder="AI, Automazione, ..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">SEO Description</label>
                  <textarea rows={2} value={form.seo_description} onChange={e => handleChange('seo_description', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button data-testid="post-published-toggle"
                  onClick={() => handleChange('published', !form.published)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-emerald-500' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.published ? 'left-6' : 'left-1'}`} />
                </button>
                <label className="text-sm text-slate-300">
                  {form.published ? 'Pubblicato' : 'Bozza'}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
              <button onClick={closeForm} className="flex-1 border border-white/15 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm transition-colors">
                Annulla
              </button>
              <button data-testid="post-save-btn" onClick={save} disabled={saving}
                className="flex-1 bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl text-sm transition-all">
                {saving ? 'Salvataggio...' : (editPost ? 'Aggiorna' : 'Crea Articolo')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative glass-card rounded-2xl p-8 max-w-md w-full border border-red-500/20">
            <h3 className="text-lg font-semibold text-white mb-3">Conferma eliminazione</h3>
            <p className="text-slate-400 text-sm mb-6">
              Vuoi eliminare <strong className="text-white">"{deleteTarget.title}"</strong>? L'azione è irreversibile.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 border border-white/15 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm transition-colors">
                Annulla
              </button>
              <button data-testid="confirm-delete-btn" onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
