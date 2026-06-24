import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

const ShopPage = () => {
  const {
    products,
    loading,
    error,
    filters,
    setFilter,
    resetFilters,
    fetchProducts,
  } = useContext(ProductContext);

  const [localSearch, setLocalSearch] = useState(filters.keyword);
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  useEffect(() => {
    // Fetch products based on active filters
    fetchProducts();
  }, [filters.category, filters.size, filters.color, filters.sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter('keyword', localSearch);
    fetchProducts({ ...filters, keyword: localSearch });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    setFilter('minPrice', minPriceInput);
    setFilter('maxPrice', maxPriceInput);
    fetchProducts({ ...filters, minPrice: minPriceInput, maxPrice: maxPriceInput });
  };

  const handleReset = () => {
    resetFilters();
    setLocalSearch('');
    setMinPriceInput('');
    setMaxPriceInput('');
    // Trigger direct refetch with initial empty values
    fetchProducts({
      keyword: '',
      category: 'All',
      size: '',
      color: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
  };

  const categories = ['All', 'Suits & Blazers', 'Shirts', 'Dresses', 'Outerwear', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const colors = ['Navy', 'Onyx', 'Gold', 'Emerald', 'Crimson', 'Camel', 'Pearl', 'Champagne'];

  return (
    <div style={{
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      padding: '3rem 2rem',
    }} className="animate-fade">
      {/* Header and Title */}
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '4px' }}>GABA BRAND ATELIER</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>THE COMPLETE COLLECTIONS</h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2.5rem',
      }} className="shop-grid">
        {/* 1. Sidebar Filters */}
        <aside className="glass-panel shop-sidebar" style={{
          padding: '2rem',
          borderRadius: '4px',
          height: 'fit-content',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-accent)',
            }}>
              <SlidersHorizontal size={18} /> FILTERS
            </h3>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <RefreshCw size={12} /> CLEAR ALL
            </button>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: '2px',
            padding: '0.5rem 0.8rem',
            marginBottom: '2rem',
          }}>
            <input
              type="text"
              placeholder="Search items..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-light)',
                outline: 'none',
                width: '100%',
                fontSize: '0.85rem',
              }}
            />
            <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-accent)' }}>
              <Search size={16} />
            </button>
          </form>

          {/* Category List */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-light)' }}>CATEGORIES</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {categories.map((cat) => (
                <label key={cat} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  color: filters.category === cat ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontWeight: filters.category === cat ? 600 : 400,
                  transition: 'var(--transition-fast)',
                }}>
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => setFilter('category', cat)}
                    style={{ accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Size Selectors */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-light)' }}>SIZES</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter('size', filters.size === s ? '' : s)}
                  style={{
                    background: filters.size === s ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                    color: filters.size === s ? '#03060c' : 'var(--color-text-light)',
                    border: `1px solid ${filters.size === s ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                    padding: '0.4rem 0.2rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    borderRadius: '2px',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selectors */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-light)' }}>COLORS</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter('color', filters.color === c ? '' : c)}
                  style={{
                    background: filters.color === c ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                    color: filters.color === c ? '#03060c' : 'var(--color-text-light)',
                    border: `1px solid ${filters.color === c ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: '2px',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-light)' }}>PRICE RANGE</h4>
            <form onSubmit={handlePriceApply} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    padding: '0.4rem 0.6rem',
                    width: '100%',
                    color: 'var(--color-text-light)',
                    fontSize: '0.8rem',
                  }}
                />
                <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    padding: '0.4rem 0.6rem',
                    width: '100%',
                    color: 'var(--color-text-light)',
                    fontSize: '0.8rem',
                  }}
                />
              </div>
              <button type="submit" className="outline-btn" style={{
                fontSize: '0.75rem',
                padding: '0.5rem 1rem',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
                APPLY PRICES
              </button>
            </form>
          </div>
        </aside>

        {/* 2. Products Grid Panel */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Sorting and Summary Bar */}
          <div className="glass-panel" style={{
            padding: '1rem 1.5rem',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
          }}>
            <span style={{ color: 'var(--color-text-muted)' }}>
              Showing <strong style={{ color: 'var(--color-accent)' }}>{products.length}</strong> luxurious pieces
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>SORT BY:</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-text-light)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '2px',
                  padding: '0.3rem 0.8rem',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Catalog Listing */}
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '40vh',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-accent)',
            }}>
              LOADING GABA CATALOGUE...
            </div>
          ) : error ? (
            <div style={{ color: 'red', textAlign: 'center', padding: '3rem' }}>
              Error: {error}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel" style={{
              padding: '5rem 2rem',
              textAlign: 'center',
              borderRadius: '4px',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '1rem' }}>No Sovereign Pieces Found</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                We could not find items fitting these criteria. Try clearing filters or revising search inputs.
              </p>
              <button onClick={handleReset} className="gold-btn">RESET ALL FILTERS</button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Responsive layout styles injection */}
      <style>{`
        @media (min-width: 992px) {
          .shop-grid {
            grid-template-columns: 300px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;
