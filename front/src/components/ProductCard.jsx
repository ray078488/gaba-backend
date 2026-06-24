import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

export default function ProductCard({ product, onViewDetails, onQuickAdd }) {
  const { Product_Name, Fabric_Quality, Price, Size_Available, Stock_Quantity, Image_URL } = product;

  // Format currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Price);

  return (
    <div 
      className="group relative flex flex-col bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden card-glow transition-all duration-300 animate-fadein cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
        <img
          src={Image_URL}
          alt={Product_Name}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Fabric Quality Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[9px] font-bold tracking-wider uppercase bg-slate-900/90 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-md backdrop-blur-md">
            {Fabric_Quality}
          </span>
        </div>

        {/* Stock Status Badge */}
        {Stock_Quantity <= 15 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[9px] font-bold tracking-wider uppercase bg-rose-600/95 text-white px-2 py-1 rounded-md shadow-md animate-pulse">
              Low Stock
            </span>
          </div>
        )}

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
            className="p-3 bg-slate-850 hover:bg-indigo-600 text-white rounded-full transition-all border border-slate-700/50 transform translate-y-4 group-hover:translate-y-0 duration-300 hover:scale-110 shadow-lg"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-slate-800/30">
        <div>
          {/* Brand */}
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">GABA</span>
          
          {/* Title */}
          <h3 className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {Product_Name}
          </h3>
        </div>

        {/* Pricing and Sizes */}
        <div className="mt-3 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Price</span>
            <span className="text-sm font-black text-white">{formattedPrice}</span>
          </div>

          {/* Sizes available */}
          <div className="flex gap-1">
            {Size_Available.slice(0, 3).map((size) => (
              <span 
                key={size} 
                className="text-[9px] border border-slate-700 bg-slate-900/60 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold"
              >
                {size}
              </span>
            ))}
            {Size_Available.length > 3 && (
              <span className="text-[9px] text-slate-500 font-bold self-center ml-0.5">
                +{Size_Available.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
