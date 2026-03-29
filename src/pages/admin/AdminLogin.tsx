import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import './AdminPages.css';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/login', { email, password });
      localStorage.setItem('admin_token', data.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h1>Tarweeda Admin</h1>
        <p>Sign in to manage your site.</p>
        {error && <div className="admin-error">{error}</div>}
        <label className="bk-lbl">Email</label>
        <input className="bk-inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tarweeda.com" required />
        <label className="bk-lbl">Password</label>
        <input className="bk-inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        <button className="bk-next" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
    </div>
  );
}
