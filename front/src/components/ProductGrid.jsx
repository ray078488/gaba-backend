import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function ProductGrid({ products, onViewDetails, onQuickAdd, activeCategory }) {
  // Filters state
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const fabrics = [
    { id: 'All', name: 'All Fabrics' },
    { id: 'Cotton', name: 'Premium Cotton' },
    { id: 'Linen', name: 'Linen Blend' },
    { id: 'Denim', name: 'Denim' },
    { id: 'Silk', name: 'Silk Blend' }
  ];

  const priceOptions = [
    { id: 'All', name: 'Any Price' },
    { id: 'under-1000', name: 'Under ₹1,000' },
    { id: '1000-2000', name: '₹1,000 - ₹2,000' },
    { id: 'over-2000', name: 'Over ₹2,000' }
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Toggle Size selection
  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedSizes([]);
    setSelectedFabric('All');
    setPriceRange('All');
  };

  // Client-side filtering logic
  const filteredProducts = products.filter(product => {
    // 1. Size Filter
    if (selectedSizes.length > 0) {
      const hasSize = product.Size_Available.some(size => selectedSizes.includes(size));
      if (!hasSize) return false;
    }

    // 2. Fabric Filter
    if (selectedFabric !== 'All') {
      const matchesFabric = product.Fabric_Quality.toLowerCase().includes(selectedFabric.toLowerCase());
      if (!matchesFabric) return false;
    }

    // 3. Price Filter
    if (priceRange !== 'All') {
      if (priceRange === 'under-1000' && product.Price >= 1000) return false;
      if (priceRange === '1000-2000' && (product.Price < 1000 || product.Price > 2000)) return false;
      if (priceRange === 'over-2000' && product.Price <= 2000) return false;
    }

    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Grid Layout (Sidebar + Catalog) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 h-fit text-xs font-semibold text-slate-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
            <div className="flex items-center gap-2 text-white">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
            </div>
            {(selectedSizes.length > 0 || selectedFabric !== 'All' || priceRange !== 'All') && (
              <button 
                onClick={handleResetFilters}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {/* Price Filters */}
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-wider text-slate-400 mb-3">Price Range</h4>
            <div className="space-y-2">
              {priceOptions.map(option => (
                <label key={option.id} className="flex items-center gap-2 cursor-pointer font-medium hover:text-white transition-colors">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === option.id}
                    onChange={() => setPriceRange(option.id)}
                    className="accent-indigo-500 rounded border-slate-700 bg-slate-900"
                  />
                  <span>{option.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Selectors */}
          <div className="mb-6">
            <h4 className="text-[10px] uppercase tracking-wider text-slate-400 mb-3">Available Sizes</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`w-9 h-9 rounded-xl border text-xs font-mono font-bold transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10' 
                        : 'bg-slate-900 border-slate-700/80 hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fabric Quality Filters */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-slate-400 mb-3">Fabric / Materials</h4>
            <div className="space-y-2">
              {fabrics.map(fab => (
                <label key={fab.id} className="flex items-center gap-2 cursor-pointer font-medium hover:text-white transition-colors">
                  <input
                    type="radio"
                    name="fabric"
                    checked={selectedFabric === fab.id}
                    onChange={() => setSelectedFabric(fab.id)}
                    className="accent-indigo-500 rounded border-slate-700 bg-slate-900"
                  />
                  <span>{fab.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>{activeCategory} Collection</span>
              <span className="text-xs text-slate-400 font-semibold bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} items
              </span>
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/20 border border-dashed border-slate-700 rounded-3xl">
              <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-slate-300">No matching apparel found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                We couldn't find any GABA clothes fitting your selected filters. Try loosening your requirements or changing categories.
              </p>
              <button 
                onClick={handleResetFilters}
                className="mt-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2 text-xs font-semibold rounded-full text-indigo-400 hover:text-indigo-300 transition-all active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.Product_ID}
                  product={product}
                  onViewDetails={onViewDetails}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
