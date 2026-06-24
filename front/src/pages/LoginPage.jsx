import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogIn, Lock } from 'lucide-react';

const LoginPage = () => {
  const { login, user, error, setError } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  useEffect(() => {
    if (user) {
      navigate(redirect ? `/${redirect}` : '/');
    }
    // Clean context errors on mount
    setError(null);
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    const success = await login(email, password);
    if (!success) {
      setLocalError('Authentication failed. Check your email or credentials.');
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '6rem auto',
      padding: '0 2rem',
    }} className="animate-scale">
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '4px' }}>GABA COUTURE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem' }}>MEMBERS SIGN IN</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {localError && (
            <div style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '0.6rem', borderRadius: '2px', fontSize: '0.85rem' }}>
              {localError}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>EMAIL ADDRESS</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px',
              padding: '0.6rem 0.8rem',
            }}>
              <User size={16} style={{ color: 'var(--color-accent)', marginRight: '0.6rem' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@gaba.com"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-light)',
                  outline: 'none',
                  width: '100%',
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>PASSWORD</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px',
              padding: '0.6rem 0.8rem',
            }}>
              <Lock size={16} style={{ color: 'var(--color-accent)', marginRight: '0.6rem' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-light)',
                  outline: 'none',
                  width: '100%',
                }}
                required
              />
            </div>
          </div>

          <button type="submit" className="gold-btn" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            SIGN IN <LogIn size={16} />
          </button>
        </form>

        <div style={{
          marginTop: '2.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
        }}>
          New to GABA?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
