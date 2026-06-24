import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, ShieldAlert, Award, FileText, CheckCircle2, Truck, Clock } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, error, setError } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders/myorders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
      setOrdersLoading(false);
    } catch (err) {
      console.error(err);
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    if (password && password !== confirmPassword) {
      setProfileError('Passwords do not match');
      return;
    }

    const success = await updateProfile({
      name,
      email,
      ...(password && { password }),
    });

    if (success) {
      setProfileSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setProfileSuccess(false), 3000);
    } else {
      setProfileError(error || 'Failed to update profile settings.');
    }
  };

  const getStatusStep = (status) => {
    if (status === 'Processing') return 1;
    if (status === 'Shipped') return 2;
    if (status === 'Delivered') return 3;
    return 1;
  };

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 2rem' }} className="animate-fade">
      
      {/* Header Banner */}
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '4px' }}>MEMBER PORTAL</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>MY GABA DASHBOARD</h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '3rem',
      }} className="profile-grid">
        
        {/* 1. Left Form Panel: Profile updates */}
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '4px', height: 'fit-content' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '2rem',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <User size={18} /> PROFILE DETAILS
          </h2>

          <form onSubmit={handleSubmitProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {profileSuccess && (
              <div style={{ background: 'rgba(76,175,80,0.15)', color: '#4caf50', padding: '0.6rem', borderRadius: '2px', fontSize: '0.85rem' }}>
                Profile settings saved successfully!
              </div>
            )}
            {profileError && (
              <div style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '0.6rem', borderRadius: '2px', fontSize: '0.85rem' }}>
                {profileError}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  padding: '0.6rem 0.8rem',
                  width: '100%',
                  color: 'var(--color-text-light)',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  padding: '0.6rem 0.8rem',
                  width: '100%',
                  color: 'var(--color-text-light)',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>NEW PASSWORD (OPTIONAL)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  padding: '0.6rem 0.8rem',
                  width: '100%',
                  color: 'var(--color-text-light)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  padding: '0.6rem 0.8rem',
                  width: '100%',
                  color: 'var(--color-text-light)',
                  outline: 'none',
                }}
              />
            </div>

            <button type="submit" className="gold-btn" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              SAVE SETTINGS
            </button>
          </form>
        </div>

        {/* 2. Right Panel: Order History Logs */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '1rem',
          }}>
            <FileText size={18} /> GUEST ORDER HISTORY
          </h2>

          {ordersLoading ? (
            <div style={{ padding: '2rem', color: 'var(--color-accent)' }}>LOADING ORDERS RECORD...</div>
          ) : orders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '4px' }}>
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                You have not placed any orders under this GABA account yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {orders.map((ord) => {
                const activeStep = getStatusStep(ord.orderStatus);

                return (
                  <div key={ord._id} className="glass-panel animate-scale" style={{ padding: '2rem', borderRadius: '4px' }}>
                    
                    {/* Order Meta details bar */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      paddingBottom: '1.2rem',
                      marginBottom: '2rem',
                      fontSize: '0.85rem',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>INVOICE ID</span>
                        <strong style={{ fontFamily: 'monospace', color: 'var(--color-accent)' }}>{ord._id}</strong>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginX: '1rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>TRANSACTION DATE</span>
                        <strong>{new Date(ord.createdAt).toLocaleDateString()}</strong>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>TOTAL VALUE</span>
                        <strong className="gold-gradient-text" style={{ fontSize: '1rem' }}>${ord.totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        SHIPPING TIMELINE
                      </h4>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        position: 'relative',
                        width: '100%',
                        maxWidth: '500px',
                        margin: '0 auto',
                      }} className="timeline-container">
                        {/* Horizontal connecting background line */}
                        <div style={{
                          position: 'absolute',
                          top: '18px',
                          left: '10%',
                          right: '10%',
                          height: '2px',
                          background: 'rgba(255,255,255,0.08)',
                          zIndex: 1,
                        }}></div>

                        {/* Horizontal active connecting line */}
                        <div style={{
                          position: 'absolute',
                          top: '18px',
                          left: '10%',
                          width: activeStep === 1 ? '0%' : activeStep === 2 ? '40%' : '80%',
                          height: '2px',
                          background: 'var(--color-accent)',
                          zIndex: 2,
                          transition: 'var(--transition-smooth)',
                        }}></div>

                        {/* Step 1: Processing */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, position: 'relative' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: activeStep >= 1 ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : 'rgba(255,255,255,0.03)',
                            color: activeStep >= 1 ? '#03060c' : 'var(--color-text-muted)',
                            border: `2px solid ${activeStep >= 1 ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-smooth)',
                          }}>
                            <Clock size={16} />
                          </div>
                          <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: activeStep >= 1 ? 600 : 400, color: activeStep >= 1 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>Ordered</span>
                        </div>

                        {/* Step 2: Shipped */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, position: 'relative' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: activeStep >= 2 ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : '#060a13',
                            color: activeStep >= 2 ? '#03060c' : 'var(--color-text-muted)',
                            border: `2px solid ${activeStep >= 2 ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-smooth)',
                          }}>
                            <Truck size={16} />
                          </div>
                          <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: activeStep >= 2 ? 600 : 400, color: activeStep >= 2 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>Packed</span>
                        </div>

                        {/* Step 3: Delivered */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, position: 'relative' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: activeStep >= 3 ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' : '#060a13',
                            color: activeStep >= 3 ? '#fff' : 'var(--color-text-muted)',
                            border: `2px solid ${activeStep >= 3 ? '#4caf50' : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-smooth)',
                          }}>
                            <CheckCircle2 size={16} />
                          </div>
                          <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: activeStep >= 3 ? 600 : 400, color: activeStep >= 3 ? '#4caf50' : 'var(--color-text-muted)' }}>Delivered</span>
                        </div>

                      </div>
                    </div>

                    {/* Collapsible Order items list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {ord.orderItems.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          borderRadius: '2px',
                          padding: '0.8rem',
                        }}>
                          <img src={item.image} alt={item.name} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '2px' }} />
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Size: {item.size} / Color: {item.color}</div>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Qty: {item.qty}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '1rem' }}>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Responsive grids custom CSS inline injection */}
      <style>{`
        @media (min-width: 992px) {
          .profile-grid {
            grid-template-columns: 350px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
