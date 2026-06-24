import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, HelpCircle, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);

  if (!isOpen || !product) return null;

  const { Product_ID, Product_Name, Category, Fabric_Quality, Price, Size_Available, Stock_Quantity, Description, Image_URL } = product;

  // Format currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Price);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeWarning(true);
      return;
    }
    setSizeWarning(false);

    const result = await addToCart(product, selectedSize, quantity);
    if (result.success) {
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        onClose();
        setSelectedSize('');
        setQuantity(1);
      }, 1500);
    } else {
      alert(result.message || 'Failed to add item to cart.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadein">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-slideup">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 p-2 rounded-full transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-[500px] bg-slate-900 overflow-hidden">
            <img 
              src={Image_URL} 
              alt={Product_Name}
              className="object-cover w-full h-full"
            />
            {/* Fabric Accent */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="text-[10px] font-bold bg-slate-900/90 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                {Fabric_Quality}
              </span>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between h-full md:h-[500px] overflow-y-auto font-semibold text-slate-300 text-xs">
            
            {/* Product Metadata & Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">GABA</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-400 font-semibold">{Category}'s Wear</span>
              </div>
              
              <h2 className="text-lg font-extrabold text-white leading-snug">
                {Product_Name}
              </h2>
              
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-xl font-black text-white">{formattedPrice}</span>
                <span className="text-[10px] text-slate-400 line-through font-normal">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Price * 1.4)}
                </span>
                <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/25">
                  40% OFF
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-[11px] leading-relaxed text-slate-400 font-normal">
                {Description || 'No detailed description available. Crafted under GABA brand standard for quality, fit, and elegance.'}
              </p>
            </div>

            {/* Selection Options */}
            <div className="mt-5 border-t border-slate-700/50 pt-5 space-y-4">
              
              {/* Sizes Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Select Size</span>
                  {sizeWarning && (
                    <span className="text-[10px] text-rose-400 font-bold animate-pulse">Required *</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Size_Available.map(size => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(size); setSizeWarning(false); }}
                        className={`w-10 h-10 rounded-xl border text-xs font-mono font-bold transition-all ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/15' 
                            : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Qty</span>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden py-1 px-2.5">
                  <button 
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => q - 1)}
                    className="text-slate-400 hover:text-white px-2 py-1 disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                  <button 
                    disabled={quantity >= Stock_Quantity}
                    onClick={() => setQuantity(q => q + 1)}
                    className="text-slate-400 hover:text-white px-2 py-1 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">
                  (Only {Stock_Quantity} in stock)
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 border-t border-slate-700/50 pt-5 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={added || Stock_Quantity === 0}
                className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold shadow-lg transition-all active:scale-[0.98] ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : Stock_Quantity === 0
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Bag
                  </>
                ) : Stock_Quantity === 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag
                  </>
                )}
              </button>
            </div>

            {/* Guarantee note */}
            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 font-normal self-center">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400/80" />
              <span>GABA 100% Original Premium Quality Apparel</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
