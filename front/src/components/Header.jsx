import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Shield, Search, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ProductContext } from '../context/ProductContext';

import logo from '../logo.jpg';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const { filters, setFilter, fetchProducts } = useContext(ProductContext);
  
  const [searchInput, setSearchInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter('keyword', searchInput);
    navigate('/shop');
    setTimeout(() => {
      fetchProducts({ ...filters, keyword: searchInput });
    }, 50);
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderRadius: '0 0 4px 4px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src={logo} 
            alt="GABA Logo" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '2px solid var(--color-accent)'
            }} 
          />
          <span style={{
            fontSize: '1.8rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            letterSpacing: '3px',
          }} className="gold-gradient-text">
            GABA
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'none',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '2px',
          padding: '0.4rem 0.8rem',
          width: '300px',
        }} className="desktop-search-form">
          <input
            type="text"
            placeholder="Search collections..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-light)',
              width: '100%',
              outline: 'none',
              fontSize: '0.9rem',
            }}
          />
          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-accent)' }}>
            <Search size={16} />
          </button>
        </form>

        {/* Navigation Links */}
        <nav style={{ display: 'none', gap: '2rem', fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '1px', fontWeight: 500 }} className="desktop-nav">
          <Link to="/" style={{ hover: 'color: var(--color-accent)' }}>HOME</Link>
          <Link to="/shop">COLLECTIONS</Link>
          {user && user.isAdmin && (
            <Link to="/admin" style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Shield size={14} /> ADMIN
            </Link>
          )}
        </nav>

        {/* Right Side Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Cart Icon */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingBag size={22} style={{ color: 'var(--color-text-light)' }} />
            {cartItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                color: '#03060c',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="user-logged-in">
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <User size={18} style={{ color: 'var(--color-accent)' }} />
                <span style={{ display: 'none' }} className="desktop-username">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>
              <User size={18} />
              <span>SIGN IN</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-light)',
              display: 'block',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          borderLeft: 'none',
          borderRight: 'none',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'fadeIn 0.3s ease-out forwards',
        }}>
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '2px',
            padding: '0.4rem 0.8rem',
            width: '100%',
          }}>
            <input
              type="text"
              placeholder="Search collections..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-light)',
                width: '100%',
                outline: 'none',
              }}
            />
            <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-accent)' }}>
              <Search size={16} />
            </button>
          </form>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-display)', padding: '0.5rem 0' }}>HOME</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-display)', padding: '0.5rem 0' }}>COLLECTIONS</Link>
          {user && user.isAdmin && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)', padding: '0.5rem 0' }}>
              ADMIN PORTAL
            </Link>
          )}
        </div>
      )}

      {/* Custom Styles Injection for Responsive Navbar */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-search-form { display: flex !important; }
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .desktop-username { display: inline !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
