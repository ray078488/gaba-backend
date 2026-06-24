import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Gem, Compass, Sparkles } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const { products, fetchProducts, loading } = useContext(ProductContext);

  useEffect(() => {
    // Fetch products to show in featured row
    fetchProducts();
  }, []);

  // Limit featured products to 4 items
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="animate-fade">
      {/* 1. Cinematic Hero Banner */}
      <section style={{
        position: 'relative',
        height: '85vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'linear-gradient(rgba(3,6,12,0.6), rgba(3,6,12,0.85)), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative glow overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'rgba(212, 175, 55, 0.08)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}></div>

        <div style={{ maxWidth: '800px', padding: '0 2rem', zIndex: 10 }}>
          <span style={{
            fontSize: '0.85rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-accent)',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}>
            <Sparkles size={14} /> ESTABLISHED IN EXCLUSIVITY
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: '1.2',
            letterSpacing: '2px',
            marginBottom: '1.5rem',
          }}>
            Defining the Art of <br />
            <span className="gold-gradient-text" style={{ fontWeight: 900 }}>GABA ELEGANCE</span>
          </h1>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem auto',
          }}>
            Indulge in our exquisite collection of premium fabrics, impeccable tailorings, and timeless silhouettes crafted for those who demand absolute distinction.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/shop" className="gold-btn">
              DISCOVER SHOP <ArrowRight size={16} />
            </Link>
            <a href="#about" className="outline-btn" style={{ scrollBehavior: 'smooth' }}>
              OUR MANIFESTO
            </a>
          </div>
        </div>
      </section>

      {/* 2. Brand Value Pillars */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '5rem 2rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '2.5rem 2rem', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-accent)', marginBottom: '1.2rem', display: 'inline-block' }}>
              <Gem size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '0.8rem', fontWeight: 600 }}>Mulberry Silk & Cashmere</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              We source only the finest elements worldwide. From pure Mulberry silks to high-grade Mongolian cashmere.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '2.5rem 2rem', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-accent)', marginBottom: '1.2rem', display: 'inline-block' }}>
              <Compass size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '0.8rem', fontWeight: 600 }}>Artisanal Tailoring</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Every structural cut, hand-sewn lapel, and finished seam is completed by seasoned custom tailors with lifetime training.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '2.5rem 2rem', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-accent)', marginBottom: '1.2rem', display: 'inline-block' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '0.8rem', fontWeight: 600 }}>Lifetime Authenticity</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Each limited garment includes a unique registered security seal, certifying its entry in the GABA catalog archives.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Row */}
      <section style={{
        background: 'rgba(13,21,39,0.2)',
        padding: '5rem 0',
        borderY: '1px solid rgba(212,175,55,0.05)',
      }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '3px' }}>CURATED DESIGN PIECES</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginTop: '0.3rem' }}>FEAUTRED WORK EDIT</h2>
            </div>
            <Link to="/shop" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}>
              VIEW CATALOGUE <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-accent)' }}>LOADING NEW RELEASES...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
            }}>
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Luxury Manifesto (About Section) */}
      <section id="about" style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '8rem 2rem 5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '4rem',
        alignItems: 'center',
      }}>
        {/* Left Side: Images Grid */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '450px',
        }} className="manifesto-media">
          <div className="glass-panel" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '75%',
            height: '75%',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600&auto=format&fit=crop"
              alt="Tailoring details"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="glass-panel" style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '60%',
            height: '60%',
            borderRadius: '4px',
            overflow: 'hidden',
            borderWidth: '2px', // Make gold border highlight
          }}>
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop"
              alt="Velvet blazer"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Right Side: Text Manifesto */}
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '3px' }}>OUR LEGACY</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: '1.3',
            margin: '0.5rem 0 1.5rem 0',
          }}>
            Crafting the Apparel of <br />Sovereign Prestige
          </h2>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '1rem',
            lineHeight: '1.8',
            marginBottom: '1.5rem',
          }}>
            At GABA, we believe clothing is more than just material—it is a visual declaration of one’s identity, values, and standards. We refuse standard mass-production. Every piece in our atelier is a limited series, hand-checked at three separate quality intervals before being boxed in our signature velvet drawers.
          </p>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '1rem',
            lineHeight: '1.8',
            marginBottom: '2.5rem',
          }}>
            When you purchase GABA, you acquire an authentic garment cataloged with historic luxury. Step into our world and experience absolute comfort paired with striking elegance.
          </p>
          <Link to="/shop" className="gold-btn">
            EXPLORE THE ATELIER
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
