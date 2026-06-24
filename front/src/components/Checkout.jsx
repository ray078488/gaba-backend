import React, { useState } from 'react';
import { ShieldCheck, ShoppingBag, Truck, CreditCard, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout({ onBackToStore, onOpenAuth, onChangeView }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token, user } = useAuth();

  // Form states
  const [name, setName] = useState(user ? user.Name : '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Checkout states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please sign in to complete your checkout.');
      onOpenAuth();
      return;
    }

    if (!address || !city || !zip || !phone) {
      alert('Please fill in all shipping details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: cartTotal
        })
      });

      const data = await res.json();

      if (res.ok) {
        setPlacedOrderId(data.order.Order_ID);
        setOrderSuccess(true);
        clearCart();
      } else {
        alert(data.message || 'Checkout failed.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="w-full max-w-xl mx-auto px-6 py-16 text-center animate-fadein text-xs font-semibold text-slate-400">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Order Placed Successfully!</h2>
        <p className="max-w-md mx-auto text-slate-400 leading-relaxed font-normal">
          Thank you for shopping with GABA! We have received your order, and your items are being prepared for dispatch.
        </p>
        
        <div className="mt-8 bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 max-w-sm mx-auto">
          <div className="flex justify-between items-center py-1">
            <span>Order Reference:</span>
            <span className="text-white font-mono font-bold">#GABA-{placedOrderId}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-t border-slate-700/40 mt-2 pt-2">
            <span>Payment Method:</span>
            <span className="text-white uppercase font-bold">{paymentMethod}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onChangeView('orders')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2"
          >
            View Order History
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onBackToStore}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold px-6 py-3 rounded-xl transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      {/* Back button */}
      <button 
        onClick={onBackToStore}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6 group cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Catalog
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-semibold text-slate-300">
        
        {/* Left Columns: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Form */}
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-400" />
              Delivery Address
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Recipient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-normal text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-normal text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Appartement, Street, Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-normal text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-normal text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Pincode / ZIP</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 400001"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-normal text-xs"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Options */}
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label 
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-white' 
                    : 'border-slate-800 hover:border-slate-750 bg-slate-900/30'
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => {}}
                    className="accent-indigo-500"
                  />
                  <div>
                    <span className="font-bold block">Cash on Delivery</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pay cash upon parcel delivery</span>
                  </div>
                </div>
              </label>

              <label 
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-white' 
                    : 'border-slate-800 hover:border-slate-750 bg-slate-900/30'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'card'}
                    onChange={() => {}}
                    className="accent-indigo-500"
                  />
                  <div>
                    <span className="font-bold block">Simulated Card</span>
                    <span className="text-[10px] text-slate-400 font-normal">Mock debit or credit card</span>
                  </div>
                </div>
              </label>
            </div>
            
            {/* Show mock fields for card payment */}
            {paymentMethod === 'card' && (
              <div className="mt-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-700/50 grid grid-cols-3 gap-3 animate-fadein">
                <div className="col-span-3">
                  <input type="text" placeholder="Card Number (4000 1234 5678 9010)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-300 focus:outline-none text-[11px] font-normal" />
                </div>
                <div className="col-span-2">
                  <input type="text" placeholder="Expiry Date (MM/YY)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-300 focus:outline-none text-[11px] font-normal" />
                </div>
                <div>
                  <input type="password" placeholder="CVV" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-300 focus:outline-none text-[11px] font-normal" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl p-6 md:p-8 sticky top-28">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2 pb-4 border-b border-slate-700/50">
              <ShoppingBag className="w-5 h-5 text-pink-400" />
              Order Summary
            </h2>

            {/* Items Mini-list */}
            <div className="max-h-[220px] overflow-y-auto pr-2 space-y-3 mb-6">
              {cartItems.map(item => (
                <div key={`${item.Product_ID}-${item.Size}`} className="flex items-center gap-3">
                  <img src={item.Image_URL} alt="" className="w-10 h-13 object-cover rounded-lg bg-slate-900 border border-slate-700/40 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-white truncate">{item.Product_Name}</h4>
                    <span className="text-[10px] text-slate-400 font-normal">Size: {item.Size} | Qty: {item.Quantity}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200">{formatPrice(item.Price * item.Quantity)}</span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="border-t border-slate-800 pt-4 space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400 font-normal">Order Subtotal</span>
                <span className="text-white">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-normal">Shipping & Handling</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="border-t border-slate-800 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-base font-black text-indigo-400">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            {token ? (
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all"
              >
                {isSubmitting ? 'Validating & Placing...' : 'Confirm & Place Order'}
              </button>
            ) : (
              <div>
                <button
                  onClick={onOpenAuth}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all mb-2"
                >
                  Sign In to Place Order
                </button>
                <p className="text-[10px] text-center text-slate-500 font-normal">
                  You must be logged in to securely save orders, submit returns or file exchange tickets.
                </p>
              </div>
            )}

            {/* Security Guarantee */}
            <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-500 font-normal justify-center border-t border-slate-800/40 pt-4">
              <ShieldCheck className="w-4 h-4 text-indigo-500/70" />
              <span>GABA Simulated Checkout (Safe & Secure Encrypted Pipeline)</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
