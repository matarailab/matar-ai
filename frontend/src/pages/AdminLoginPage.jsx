import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LOGO = "https://customer-assets.emergentagent.com/job_immersive-automation/artifacts/scuwnsqc_Matar-AI.png";

const AdminLoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const a = t.admin;
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      nav('/admin');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : a.login_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#050B1A' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src={LOGO} alt="Matar.AI" className="h-12 object-contain mx-auto mb-6" />
          <h1 className="text-2xl font-medium text-white mb-2">{a.login_title}</h1>
          <p className="text-sm text-slate-400">{a.login_sub}</p>
        </div>

        <form onSubmit={submit} className="glass-card rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-xs text-slate-400 mb-2">{a.login_email}</label>
            <input
              data-testid="admin-login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@matarai.com"
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2">{a.login_password}</label>
            <div className="relative">
              <input
                data-testid="admin-login-password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <p data-testid="admin-login-error" className="text-red-400 text-sm">{error}</p>}

          <button data-testid="admin-login-submit" type="submit" disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            {loading ? '...' : a.login_cta}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
