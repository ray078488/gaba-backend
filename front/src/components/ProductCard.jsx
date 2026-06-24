import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first available size and color
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'S';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Black';
    addToCart(product, 1, defaultSize, defaultColor);
    
    // Play subtle audio or visual notification
    const btn = document.getElementById(`quick-add-${product._id}`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'ADDED';
      btn.style.background = 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 1000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={13} fill="var(--color-accent)" stroke="var(--color-accent)" />);
      } else {
        stars.push(<Star key={i} size={13} stroke="var(--color-text-muted)" />);
      }
    }
    return stars;
  };

  return (
    <RouterLink to={`/product/${product._id}`} className="glass-panel product-card-link animate-fade" style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '4px',
      overflow: 'hidden',
      textDecoration: 'none',
      color: 'var(--color-text-light)',
      transition: 'var(--transition-smooth)',
      position: 'relative',
      height: '100%',
    }}>
      {/* Product Image Panel */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '125%', // 4:5 aspect ratio
        overflow: 'hidden',
        background: '#04070d',
      }}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card-img"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Stock Alert Overlay */}
        {product.stock <= 0 ? (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            padding: '0.3rem 0.6rem',
            borderRadius: '2px',
            letterSpacing: '1px',
          }}>
            OUT OF STOCK
          </div>
        ) : product.stock <= 5 ? (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(212, 175, 55, 0.9)',
            color: '#03060c',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            padding: '0.3rem 0.6rem',
            borderRadius: '2px',
            letterSpacing: '1px',
          }}>
            LIMITED PIECES
          </div>
        ) : null}

        {/* Floating Quick Add Trigger */}
        {product.stock > 0 && (
          <button
            id={`quick-add-${product._id}`}
            onClick={handleQuickAdd}
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              background: 'rgba(3, 6, 12, 0.85)',
              border: '1px solid var(--color-accent)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              zIndex: 10,
            }}
            className="quick-add-btn"
          >
            <ShoppingCart size={18} />
          </button>
        )}
      </div>

      {/* Product Details Panel */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span style={{
          fontSize: '0.7rem',
          fontFamily: 'var(--font-display)',
          color: 'var(--color-accent)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '0.3rem',
        }}>
          {product.category}
        </span>
        <h4 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          fontWeight: 600,
          lineHeight: '1.4',
          marginBottom: '0.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.7rem',
        }} className="product-title">
          {product.name}
        </h4>

        {/* Rating and Price Row */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {renderStars(product.rating)}
          </div>
          <span style={{
            fontSize: '1.1rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--color-text-light)',
          }}>
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Styled custom CSS inlining */}
      <style>{`
        .product-card-link:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
        }
        .product-card-link:hover .product-card-img {
          transform: scale(1.08);
        }
        .quick-add-btn:hover {
          background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%) !important;
          color: #03060c !important;
          transform: scale(1.1);
        }
        .product-card-link:hover .product-title {
          color: var(--color-accent);
        }
      `}</style>
    </RouterLink>
  );
};

export default ProductCard;
