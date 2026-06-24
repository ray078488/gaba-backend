import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import logo from '../logo.jpg';

const Footer = () => {
  return (
    <footer className="glass-panel" style={{
      marginTop: '5rem',
      borderRadius: '4px 4px 0 0',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '4rem 2rem 2rem 2rem',
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem',
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <img 
              src={logo} 
              alt="GABA Logo" 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '1.5px solid var(--color-accent)'
              }} 
            />
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '2px',
              margin: 0,
            }} className="gold-gradient-text">
              GABA
            </h3>
          </div>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
            lineHeight: '1.7',
            marginBottom: '1.5rem',
          }}>
            Establishing a legacy of luxury. GABA provides handcrafted, ultra-premium menswear and womenswear designed to reflect absolute elegance and sophistication.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: 'var(--color-text-muted)', hover: 'color: var(--color-accent)' }}>
              <Instagram size={20} />
            </a>
            <a href="#" style={{ color: 'var(--color-text-muted)' }}>
              <Facebook size={20} />
            </a>
            <a href="#" style={{ color: 'var(--color-text-muted)' }}>
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '1px',
            marginBottom: '1.2rem',
            color: 'var(--color-accent)',
          }}>
            COLLECTIONS
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
            <li><Link to="/shop?category=Suits%20%26%20Blazers" style={{ color: 'var(--color-text-muted)' }}>Suits & Blazers</Link></li>
            <li><Link to="/shop?category=Shirts" style={{ color: 'var(--color-text-muted)' }}>Premium Shirts</Link></li>
            <li><Link to="/shop?category=Dresses" style={{ color: 'var(--color-text-muted)' }}>Evening Gowns</Link></li>
            <li><Link to="/shop?category=Accessories" style={{ color: 'var(--color-text-muted)' }}>Luxury Accessories</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '1px',
            marginBottom: '1.2rem',
            color: 'var(--color-accent)',
          }}>
            ASSISTANCE
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Book a VIP Fitting</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Shipping & Customs</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Returns & Exchanges</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Garment Care Guide</a></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '1px',
            marginBottom: '1.2rem',
            color: 'var(--color-accent)',
          }}>
            BOUTIQUE ATELIER
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--color-accent)' }} />
              <span>742 Imperial Way, London, UK</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} style={{ color: 'var(--color-accent)' }} />
              <span>+44 20 7946 0958</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} style={{ color: 'var(--color-accent)' }} />
              <span>concierge@gaba.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
      }}>
        <p>© 2026 GABA Couture. Crafted with Absolute Prestige.</p>
        <div style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto' }} className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
