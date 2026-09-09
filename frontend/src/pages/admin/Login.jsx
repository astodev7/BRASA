import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setError('');
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname || '/admin/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Não foi possível entrar. Verifique suas credenciais.');
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 style={{ fontSize: '1.6rem' }}>BRASA · Área administrativa</h1>
        <p style={{ marginTop: 8, color: 'var(--color-ink-soft)' }}>Entre com suas credenciais de administrador.</p>

        <form className="form" style={{ marginTop: 32 }} onSubmit={handleSubmit} noValidate>
          {error && <div className="status-banner error" role="alert">{error}</div>}

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email" type="email" required autoComplete="username"
              value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password" type="password" required autoComplete="current-password"
              value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
