import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (!isOpen) return null;

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadein">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between z-10 animate-fadein">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Your Shopping Bag</h2>
            <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full border border-slate-700">
              {cartCount} items
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag className="w-12 h-12 text-slate-700 mb-4" />
              <h3 className="text-sm font-bold text-slate-400">Your bag is empty</h3>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Look like you haven't added anything to your cart. Explore our GABA collections to find your premium apparel.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-bold rounded-full transition-all active:scale-95 shadow-lg shadow-indigo-600/10"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={`${item.Product_ID}-${item.Size}`}
                className="flex gap-4 bg-slate-800/40 border border-slate-800 rounded-2xl p-3 relative group text-xs font-semibold text-slate-300"
              >
                {/* Product Image */}
                <div className="w-20 aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 border border-slate-700/50 flex-shrink-0">
                  <img src={item.Image_URL} alt={item.Product_Name} className="object-cover w-full h-full" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase">GABA</span>
                    <h3 className="text-xs font-bold text-white line-clamp-1 pr-6">{item.Product_Name}</h3>
                    
                    {/* Size and Fabric Info */}
                    <div className="flex gap-2 items-center mt-1 text-[10px] text-slate-400 font-normal">
                      <span>Size: <strong className="text-indigo-300 font-mono font-bold">{item.Size}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span className="truncate max-w-[120px]">{item.Fabric_Quality}</span>
                    </div>
                  </div>

                  {/* Quantity Actions & Pricing */}
                  <div className="flex justify-between items-end mt-2">
                    {/* Qty Selector */}
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden py-0.5 px-2">
                      <button 
                        onClick={() => updateQuantity(item.Cart_ID, item.Quantity - 1)}
                        className="text-slate-400 hover:text-white px-1.5"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-[10px] font-bold text-white">{item.Quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.Cart_ID, item.Quantity + 1)}
                        className="text-slate-400 hover:text-white px-1.5"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] font-normal block">Total</span>
                      <span className="text-xs font-bold text-white">{formatPrice(item.Price * item.Quantity)}</span>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.Cart_ID)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Billing & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-850 bg-slate-950/40 text-xs font-semibold text-slate-300">
            {/* Bill Summary */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400 font-normal">Bag Subtotal</span>
                <span className="text-white">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-normal">Delivery Fee</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-base font-black text-indigo-400">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => { onCheckout(); onClose(); }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all"
            >
              Checkout Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
