import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogIn, Lock, Mail } from 'lucide-react';

const RegisterPage = () => {
  const { register, user, error, setError } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  useEffect(() => {
    if (user) {
      navigate(redirect ? `/${redirect}` : '/');
    }
    setError(null);
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const success = await register(name, email, password);
    if (!success) {
      setLocalError(error || 'Registration failed. Try using another email address.');
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '5rem auto',
      padding: '0 2rem',
    }} className="animate-scale">
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '4px' }}>GABA COUTURE</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem' }}>JOIN THE HOUSE</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {localError && (
            <div style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '0.6rem', borderRadius: '2px', fontSize: '0.85rem' }}>
              {localError}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>FULL NAME</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px',
              padding: '0.5rem 0.8rem',
            }}>
              <User size={16} style={{ color: 'var(--color-accent)', marginRight: '0.6rem' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Duke Sterling"
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
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>EMAIL ADDRESS</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px',
              padding: '0.5rem 0.8rem',
            }}>
              <Mail size={16} style={{ color: 'var(--color-accent)', marginRight: '0.6rem' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. concierge@gaba.com"
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
              padding: '0.5rem 0.8rem',
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

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CONFIRM PASSWORD</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px',
              padding: '0.5rem 0.8rem',
            }}>
              <Lock size={16} style={{ color: 'var(--color-accent)', marginRight: '0.6rem' }} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            REGISTER ACCOUNT <LogIn size={16} />
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
          Already have a membership key?{' '}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
