import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';

const CartPage = () => {
  const { cartItems, updateCartQty, removeFromCart, cartSubtotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckoutRedirect = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '5rem auto', padding: '0 2rem', textAlign: 'center' }} className="animate-fade">
        <div className="glass-panel" style={{ padding: '4rem 2rem', borderRadius: '4px' }}>
          <ShoppingBag size={48} style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>YOUR SHOPPING BAG IS EMPTY</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Browse our curated collections of premium shirts, tailor-made suits, evening gowns, and high-end accessories.
          </p>
          <Link to="/shop" className="gold-btn">EXPLORE SHOP</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 2rem' }} className="animate-fade">
      {/* Header */}
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '4px' }}>YOUR SELECTIONS</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>SHOPPING BAG</h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '3rem',
      }} className="cart-grid">
        
        {/* Left Side: Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cartItems.map((item, i) => (
            <div
              key={`${item.product}-${item.size}-${item.color}`}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: '4px',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Product Thumbnail */}
              <div style={{
                width: '90px',
                height: '110px',
                borderRadius: '2px',
                overflow: 'hidden',
                background: '#04070d',
                flexShrink: 0,
              }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Product Info details */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Link to={`/product/${item.product}`} style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--color-text-light)',
                  hover: 'color: var(--color-accent)',
                }}>
                  {item.name}
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span>SIZE: <strong style={{ color: 'var(--color-text-light)' }}>{item.size}</strong></span>
                  <span>COLOR: <strong style={{ color: 'var(--color-text-light)' }}>{item.color}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Quantity:</span>
                  <select
                    value={item.qty}
                    onChange={(e) => updateCartQty(item.product, item.size, item.color, Number(e.target.value))}
                    style={{
                      background: 'var(--color-primary)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      padding: '0.2rem 0.5rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {[...Array(item.stock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price and Delete Panel */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '110px',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                }}>
                  ${(item.price * item.qty).toFixed(2)}
                </span>
                
                <button
                  onClick={() => removeFromCart(item.product, item.size, item.color)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    hover: 'color: #ef4444',
                    padding: '0.3rem',
                  }}
                  className="cart-delete-btn"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <Link to="/shop" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
            marginTop: '1rem',
          }}>
            <ChevronLeft size={16} /> CONTINUE SHOPPING
          </Link>
        </div>

        {/* Right Side: Order Summary Panel */}
        <aside className="glass-panel cart-sidebar" style={{
          padding: '2rem',
          borderRadius: '4px',
          height: 'fit-content',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: 'var(--color-accent)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '1rem',
          }}>
            BAG SUMMARY
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Bag Subtotal</span>
              <span style={{ fontWeight: 600 }}>${cartSubtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>VIP Concierge Courier</span>
              <span style={{ color: '#4caf50', fontWeight: 600 }}>COMPLIMENTARY</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.2rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '1rem',
              marginTop: '0.5rem',
            }}>
              <span>ESTIMATED TOTAL</span>
              <span className="gold-gradient-text">${cartSubtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckoutRedirect}
            className="gold-btn"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            PROCEED TO CHECKOUT <ArrowRight size={16} />
          </button>
        </aside>
      </div>

      {/* Responsive layout styles injection */}
      <style>{`
        @media (min-width: 992px) {
          .cart-grid {
            grid-template-columns: 1fr 380px !important;
          }
        }
        .cart-delete-btn:hover {
          color: #ef4444 !important;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default CartPage;
