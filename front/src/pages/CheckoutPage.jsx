import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, ChevronRight, CreditCard, MapPin, ShoppingBag, Eye } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Steps: 1 = Shipping, 2 = Payment, 3 = Complete

  // Shipping details state
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Credit Card details state
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [cvvFocused, setCvvFocused] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Form input validation guards
  const isShippingValid =
    shippingAddress.address &&
    shippingAddress.city &&
    shippingAddress.postalCode &&
    shippingAddress.country;

  const isCardValid =
    cardDetails.number.replace(/\s?/g, '').length >= 16 &&
    cardDetails.name &&
    cardDetails.expiry.length === 5 &&
    cardDetails.cvv.length >= 3;

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'number') {
      // Auto-format card numbers: add spaces every 4 characters
      value = value
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    } else if (name === 'expiry') {
      // Auto-format expiry date: MM/YY
      value = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5);
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePlaceOrder = async () => {
    try {
      setPaymentLoading(true);
      
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        product: item.product,
      }));

      // 1. Submit Order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod: 'Credit Card',
          totalPrice: cartSubtotal,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to place order');
      }

      // 2. Mock payment verification
      const payResponse = await fetch(`/api/orders/${orderData._id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          id: 'MOCK_STRIPE_PAY_' + Math.random().toString(36).substring(7).toUpperCase(),
          status: 'COMPLETED',
          email_address: user.email,
        }),
      });

      const payData = await payResponse.json();

      if (!payResponse.ok) {
        throw new Error(payData.message || 'Failed to complete payment');
      }

      setPlacedOrder(payData);
      clearCart();
      setPaymentLoading(false);
      setStep(3); // Success Screen
    } catch (err) {
      console.error(err);
      alert(`Checkout failed: ${err.message}`);
      setPaymentLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 2rem' }} className="animate-fade">
      
      {/* Wizard Steps indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '4rem',
        fontFamily: 'var(--font-display)',
        fontSize: '0.85rem',
        letterSpacing: '1px',
      }}>
        <span style={{ color: step >= 1 ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600 }}>1. SHIPPING</span>
        <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
        <span style={{ color: step >= 2 ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600 }}>2. PAYMENT</span>
        <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
        <span style={{ color: step >= 3 ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600 }}>3. COMPLETE</span>
      </div>

      {/* STEP 1: SHIPPING DETAILS */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="checkout-layout-grid">
          {/* Left Form Panel */}
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '4px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '2rem',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <MapPin size={20} /> SHIPPING DESTINATION
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>STREET ADDRESS</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  placeholder="e.g. 742 Luxury Boulevard, Suite A"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    padding: '0.7rem 1rem',
                    width: '100%',
                    color: 'var(--color-text-light)',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CITY</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    placeholder="e.g. London"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      padding: '0.7rem 1rem',
                      width: '100%',
                      color: 'var(--color-text-light)',
                      outline: 'none',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>POSTAL CODE</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    placeholder="e.g. EC1A 1BB"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      padding: '0.7rem 1rem',
                      width: '100%',
                      color: 'var(--color-text-light)',
                      outline: 'none',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>COUNTRY</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  placeholder="e.g. United Kingdom"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    padding: '0.7rem 1rem',
                    width: '100%',
                    color: 'var(--color-text-light)',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!isShippingValid}
                className="gold-btn"
                style={{
                  marginTop: '1rem',
                  justifyContent: 'center',
                  opacity: isShippingValid ? 1 : 0.5,
                  cursor: isShippingValid ? 'pointer' : 'not-allowed',
                }}
              >
                PROCEED TO PAYMENT
              </button>
            </form>
          </div>

          {/* Right Summary Panel */}
          <aside className="glass-panel checkout-summary" style={{ padding: '2rem', borderRadius: '4px', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>ORDER ITEMS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}-${item.color}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.size} / {item.color} x {item.qty}</div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}>
                <span>TOTAL</span>
                <span className="gold-gradient-text">${cartSubtotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* STEP 2: CREDIT CARD PAYMENT & VIRTUAL CREDIT CARD */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }} className="checkout-layout-grid">
          
          {/* Left Panel: The Virtual Credit Card Graphic & Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* 3D-ish Interactive Credit Card Simulator Graphic */}
            <div className="card-simulator-container" style={{
              perspective: '1000px',
              width: '100%',
              maxWidth: '400px',
              height: '240px',
              margin: '0 auto',
            }}>
              <div className={`virtual-card glass-panel ${cvvFocused ? 'flipped' : ''}`} style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transformStyle: 'preserve-3d',
                cursor: 'pointer',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              }}>
                
                {/* CARD FRONT SIDE */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, rgba(20,25,35,0.85) 0%, rgba(10,12,18,0.95) 100%)',
                }}>
                  {/* Front Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '2px' }} className="gold-gradient-text">GABA</span>
                    <div style={{
                      width: '45px',
                      height: '35px',
                      background: 'rgba(212,175,55,0.15)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      borderRadius: '6px',
                      position: 'relative',
                    }} className="card-chip"></div>
                  </div>

                  {/* Card Number display */}
                  <div style={{
                    fontSize: '1.35rem',
                    fontFamily: 'Courier New, monospace',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    color: '#f5f5f7',
                    textAlign: 'center',
                    margin: '1.5rem 0 0.8rem 0',
                  }}>
                    {cardDetails.number || '•••• •••• •••• ••••'}
                  </div>

                  {/* Front Bottom row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>CARDHOLDER NAME</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        {cardDetails.name || 'YOUR EXCELLENCY'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>EXPIRES</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        {cardDetails.expiry || 'MM/YY'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD BACK SIDE */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, rgba(10,12,18,0.95) 0%, rgba(20,25,35,0.85) 100%)',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '2rem 0',
                }}>
                  {/* Black magnetic stripe */}
                  <div style={{ width: '100%', height: '45px', background: '#000', marginTop: '1rem' }}></div>

                  {/* CVV panel */}
                  <div style={{ padding: '0 2rem' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '1px', marginBottom: '0.3rem', textAlign: 'right' }}>CVV / CVC</div>
                    <div style={{
                      background: '#fff',
                      color: '#000',
                      fontFamily: 'Courier New, monospace',
                      fontWeight: 700,
                      fontSize: '1rem',
                      padding: '0.4rem 1rem',
                      borderRadius: '2px',
                      textAlign: 'right',
                      letterSpacing: '2px',
                    }}>
                      {cardDetails.cvv || '•••'}
                    </div>
                  </div>

                  <div style={{ padding: '0 2rem', fontSize: '0.6rem', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: '1.4' }}>
                    Authorized signature required. This card represents a direct key to GABA premium logistics vaults.
                  </div>
                </div>

              </div>
            </div>

            {/* Payment Inputs Form */}
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '4px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '2rem',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <CreditCard size={20} /> CARDMEMBERSHIP DETAILS
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CARD NUMBER</label>
                  <input
                    type="text"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardChange}
                    placeholder="4111 2222 3333 4444"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      padding: '0.7rem 1rem',
                      width: '100%',
                      color: 'var(--color-text-light)',
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CARDHOLDER NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                    placeholder="e.g. Duke Sterling"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      padding: '0.7rem 1rem',
                      width: '100%',
                      color: 'var(--color-text-light)',
                      outline: 'none',
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>EXPIRY DATE</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        padding: '0.7rem 1rem',
                        width: '100%',
                        color: 'var(--color-text-light)',
                        outline: 'none',
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CVV / CVC</label>
                    <input
                      type="password"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      onFocus={() => setCvvFocused(true)}
                      onBlur={() => setCvvFocused(false)}
                      placeholder="•••"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        padding: '0.7rem 1rem',
                        width: '100%',
                        color: 'var(--color-text-light)',
                        outline: 'none',
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => setStep(1)}
                    className="outline-btn"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    BACK
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!isCardValid || paymentLoading}
                    className="gold-btn"
                    style={{
                      flex: 2,
                      justifyContent: 'center',
                      opacity: isCardValid && !paymentLoading ? 1 : 0.5,
                      cursor: isCardValid && !paymentLoading ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {paymentLoading ? 'PROCESSING GABA PAYMENT...' : `PAY $${cartSubtotal.toFixed(2)}`}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Side: Order Summary Panel */}
          <aside className="glass-panel" style={{ padding: '2rem', borderRadius: '4px', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>SHIPPING INFO</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
              {shippingAddress.address} <br />
              {shippingAddress.city}, {shippingAddress.postalCode} <br />
              {shippingAddress.country}
            </p>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>ORDER ITEMS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}-${item.color}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.size} / {item.color} x {item.qty}</div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}>
                <span>TOTAL</span>
                <span className="gold-gradient-text">${cartSubtotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>

        </div>
      )}

      {/* STEP 3: TRANSACTION SUCCESS & CONFIRMATION INVOICE */}
      {step === 3 && placedOrder && (
        <div style={{ maxWidth: '650px', margin: '3rem auto' }} className="animate-scale">
          <div className="glass-panel" style={{ padding: '4rem 3rem', borderRadius: '8px', textAlign: 'center' }}>
            <CheckCircle2 size={56} style={{ color: '#4caf50', marginBottom: '1.5rem', display: 'inline-block' }} />
            
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '3px', display: 'block' }}>ORDER CONFIRMED</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0 1.5rem 0' }}>WE THANK YOU FOR YOUR TRUST</h1>
            
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
              Your transaction has completed successfully. We have allocated your luxury items from our primary vault and are preparing them in our custom brand boxes.
            </p>

            {/* Receipt Summary Grid */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '4px',
              padding: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '3rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>INVOICE ID</span>
                <strong style={{ fontFamily: 'monospace' }}>{placedOrder._id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>DELIVERY ADDRESS</span>
                <strong style={{ textAlign: 'right' }}>
                  {placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>SHIPPING TYPE</span>
                <strong>VIP Complimentary Courier</strong>
              </div>
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}>
                <span>CHARGED TOTAL</span>
                <span className="gold-gradient-text">${placedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <Link to="/profile" className="gold-btn">VIEW ORDER STATUS</Link>
              <Link to="/shop" className="outline-btn">RETURN TO SHOP</Link>
            </div>
          </div>
        </div>
      )}

      {/* Styled card flipping custom CSS inline injection */}
      <style>{`
        @media (min-width: 992px) {
          .checkout-layout-grid {
            grid-template-columns: 1fr 380px !important;
          }
        }
        .virtual-card.flipped {
          transform: rotateY(180deg) !important;
        }
        .virtual-card > div {
          border-radius: 15px;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
