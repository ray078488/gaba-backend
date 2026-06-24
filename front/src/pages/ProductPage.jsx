import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star, ShieldAlert, Check, ChevronLeft, ArrowRight, MessageSquare } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const { fetchProductById, submitReview } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  
  // Review inputs
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const loadProduct = async () => {
    setLoading(true);
    const data = await fetchProductById(id);
    if (data) {
      setProduct(data);
      setSelectedImage(data.images[0]);
      setSelectedSize(data.sizes && data.sizes.length > 0 ? data.sizes[0] : 'S');
      setSelectedColor(data.colors && data.colors.length > 0 ? data.colors[0] : 'Black');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize, selectedColor);

    const btn = document.getElementById('add-to-cart-action-btn');
    if (btn) {
      btn.innerHTML = 'ADDED TO BAG';
      btn.style.background = 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)';
      setTimeout(() => {
        btn.innerHTML = `ADD TO BAG — $${(product.price * qty).toFixed(2)}`;
        btn.style.background = '';
      }, 1500);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setReviewError('');
    const success = await submitReview(product._id, ratingInput, commentInput, user.token);
    
    if (success) {
      setReviewSuccess(true);
      setCommentInput('');
      loadProduct(); // Reload reviews list
      setTimeout(() => setReviewSuccess(false), 3000);
    } else {
      setReviewError('You may have already submitted a review for this item.');
    }
  };

  const renderStars = (rating, size = 14) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={size} fill="var(--color-accent)" stroke="var(--color-accent)" />);
      } else {
        stars.push(<Star key={i} size={size} stroke="var(--color-text-muted)" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-accent)',
      }}>
        LOADING PRODUCT PROFILE...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Product Not Found</h2>
        <Link to="/shop" className="gold-btn">BACK TO ATELIER</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '2rem' }} className="animate-fade">
      {/* Return Link */}
      <Link to="/shop" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
        marginBottom: '2rem',
        hover: 'color: var(--color-accent)',
      }}>
        <ChevronLeft size={16} /> BACK TO COLLECTIONS
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '4rem',
        marginBottom: '5rem',
      }} className="product-layout-grid">
        
        {/* 1. Left Column: Image Galleries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Large Image Container */}
          <div className="glass-panel" style={{
            position: 'relative',
            width: '100%',
            paddingTop: '120%', // 5:6 aspect ratio
            borderRadius: '4px',
            overflow: 'hidden',
            background: '#04070d',
          }}>
            <img
              src={selectedImage}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Miniature Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className="glass-panel"
                  style={{
                    width: '80px',
                    height: '96px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: `1px solid ${selectedImage === img ? 'var(--color-accent)' : 'transparent'}`,
                    padding: 0,
                    cursor: 'pointer',
                    background: '#04070d',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Right Column: Descriptive Details & Configs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '2.5px' }}>
              {product.category}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.2rem',
              fontWeight: 800,
              lineHeight: '1.2',
              margin: '0.5rem 0 1rem 0',
            }}>
              {product.name}
            </h1>
            
            {/* Rating summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {renderStars(product.rating, 16)}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                ({product.numReviews} guest reviews)
              </span>
            </div>
          </div>

          {/* Pricing Panel */}
          <div style={{
            borderY: '1px solid rgba(255,255,255,0.05)',
            padding: '1.2rem 0',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <span style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: 'var(--color-accent)',
            }}>
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <span style={{ color: '#4caf50', fontSize: '0.85rem', fontWeight: 600, marginLeft: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={14} /> IN STOCK (READY TO SHIP)
              </span>
            ) : (
              <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginLeft: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldAlert size={14} /> OUT OF STOCK
              </span>
            )}
          </div>

          {/* Product Description */}
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
            {product.description}
          </p>

          {/* Configuration Variant Pickers */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Sizing blocks */}
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.8rem', letterSpacing: '1px' }}>SELECT SIZE</h4>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        background: selectedSize === sz ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                        color: selectedSize === sz ? '#03060c' : 'var(--color-text-light)',
                        border: `1px solid ${selectedSize === sz ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: '2px',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color swatches */}
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.8rem', letterSpacing: '1px' }}>SELECT COLOR</h4>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  {product.colors.map((cl) => (
                    <button
                      key={cl}
                      onClick={() => setSelectedColor(cl)}
                      style={{
                        background: selectedColor === cl ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                        color: selectedColor === cl ? '#03060c' : 'var(--color-text-light)',
                        border: `1px solid ${selectedColor === cl ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderRadius: '2px',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      {cl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity input selector and Add to Cart Button */}
              <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                }}>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.6rem 1rem', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.6rem 1rem', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>

                <button
                  id="add-to-cart-action-btn"
                  onClick={handleAddToCart}
                  className="gold-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  ADD TO BAG — ${(product.price * qty).toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Panel: Reviews & Ratings */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}>
          <MessageSquare size={22} style={{ color: 'var(--color-accent)' }} /> GUEST JOURNAL & REVIEWS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4rem',
        }} className="reviews-layout">
          
          {/* Submit a Review Form */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '4px', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>WRITE A REVIEW</h3>
            
            {user ? (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {reviewSuccess && (
                  <div style={{ background: 'rgba(76,175,80,0.15)', color: '#4caf50', padding: '0.6rem', borderRadius: '2px', fontSize: '0.85rem' }}>
                    Review submitted successfully! Thank you.
                  </div>
                )}
                {reviewError && (
                  <div style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '0.6rem', borderRadius: '2px', fontSize: '0.85rem' }}>
                    {reviewError}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>RATING SCORE</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    style={{
                      background: 'var(--color-primary)',
                      color: 'var(--color-text-light)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      padding: '0.5rem',
                      width: '100%',
                      outline: 'none',
                    }}
                  >
                    <option value="5">5 Stars — Excellent</option>
                    <option value="4">4 Stars — Good</option>
                    <option value="3">3 Stars — Average</option>
                    <option value="2">2 Stars — Poor</option>
                    <option value="1">1 Star — Disappointed</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>COMMENTARY</label>
                  <textarea
                    rows="4"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Describe your assessment of quality, fabric feel, or tailoring precision..."
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      color: 'var(--color-text-light)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      padding: '0.6rem',
                      width: '100%',
                      outline: 'none',
                      resize: 'none',
                    }}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="gold-btn" style={{ justifyContent: 'center' }}>
                  SUBMIT REVIEW
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Please <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>Sign In</Link> to write a review.
              </div>
            )}
          </div>

          {/* List of Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {product.reviews.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                No reviews have been written for this product yet. Be the first to provide feedback!
              </p>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev._id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{rev.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '0.8rem' }}>
                    {renderStars(rev.rating, 12)}
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Custom Styles Injection */}
      <style>{`
        @media (min-width: 768px) {
          .product-layout-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .reviews-layout {
            grid-template-columns: 350px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductPage;
