import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { ArrowRight, Sparkles, Shield, RefreshCcw } from 'lucide-react';

function StorefrontContent() {
  const { user } = useAuth();
  
  // App views state
  const [activeView, setActiveView] = useState('store'); // 'store', 'checkout', 'orders', 'admin'
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Products catalog state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend api
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      // Append category filter query if not 'All'
      if (activeCategory !== 'All') {
        url += `?category=${activeCategory}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map(p => {
          if (p.Image_URL && p.Image_URL.startsWith('/uploads')) {
            return { ...p, Image_URL: `https://gaba-backend.onrender.com${p.Image_URL}` };
          }
          return p;
        });
        setProducts(mappedData);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  // Open details modal
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  // Change view safety checks
  const handleViewChange = (view) => {
    if (view === 'admin' && (!user || user.Role !== 'admin')) {
      setActiveView('store');
      return;
    }
    setActiveView(view);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client search term filter
  const searchedProducts = products.filter(p => 
    p.Product_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Fabric_Quality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Navigation Header */}
      <Navbar 
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        activeView={activeView}
        onChangeView={handleViewChange}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: STORE FRONT CATALOG */}
        {activeView === 'store' && (
          <div>
            {/* Hero Brand Banner */}
            <div className="relative w-full overflow-hidden bg-slate-950 px-6 py-20 md:py-28 border-b border-slate-800">
              {/* Background gradient flares */}
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative max-w-4xl mx-auto text-center z-10">
                <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-6 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premium Summer Collection 2026
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase leading-tight italic">
                  ELEVATED{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    SIMPLICITY
                  </span>
                </h1>
                <p className="max-w-xl mx-auto text-slate-400 text-xs sm:text-sm font-medium leading-relaxed mb-8">
                  Discover the exquisite craftsmanship of linen blends, heavy organic cottons, and acid-wash denims tailored for premium comfort and style.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setActiveCategory('Men')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-indigo-600/15 transition-all text-xs flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    Shop Men's Wear
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveCategory('Women')}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold px-6 py-3 rounded-full transition-all text-xs cursor-pointer"
                  >
                    Explore Women's Wear
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid Area */}
            {loading ? (
              <div className="text-center py-24">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading premium GABA catalog...</p>
              </div>
            ) : (
              <ProductGrid 
                products={searchedProducts}
                onViewDetails={handleViewDetails}
                activeCategory={activeCategory}
              />
            )}
          </div>
        )}

        {/* VIEW 2: CHECKOUT VIEW */}
        {activeView === 'checkout' && (
          <Checkout 
            onBackToStore={() => handleViewChange('store')}
            onOpenAuth={() => setAuthModalOpen(true)}
            onChangeView={handleViewChange}
          />
        )}

        {/* VIEW 3: ORDER HISTORY VIEW */}
        {activeView === 'orders' && (
          <OrderHistory 
            onBackToStore={() => handleViewChange('store')}
          />
        )}

        {/* VIEW 4: ADMIN PANEL */}
        {activeView === 'admin' && (
          <AdminDashboard 
            onBackToStore={() => handleViewChange('store')}
          />
        )}

      </main>

      {/* Overlays / Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      <CartDrawer 
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onCheckout={() => handleViewChange('checkout')}
      />

      <ProductDetailModal 
        isOpen={detailModalOpen}
        product={selectedProduct}
        onClose={() => setDetailModalOpen(false)}
      />

      {/* Premium Footer */}
      <footer className="bg-slate-950 border-t border-slate-850 px-6 py-12 text-slate-500 font-semibold text-xs mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black italic tracking-widest bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">GABA</span>
            </div>
            <p className="text-[10px] text-slate-500 font-normal leading-relaxed">
              GABA is a premium college project e-commerce website designed to mimic high-end fashion platforms like Myntra and Ajio. Built with React and Express.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase text-slate-400 tracking-wider mb-3">Shop Collections</h4>
            <ul className="space-y-2 font-normal">
              <li><button onClick={() => { setActiveCategory('Men'); setActiveView('store'); }} className="hover:text-indigo-400 transition-colors">Men's Apparel</button></li>
              <li><button onClick={() => { setActiveCategory('Women'); setActiveView('store'); }} className="hover:text-indigo-400 transition-colors">Women's Apparel</button></li>
              <li><button onClick={() => { setActiveCategory('Unisex'); setActiveView('store'); }} className="hover:text-indigo-400 transition-colors">Unisex Streetwear</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase text-slate-400 tracking-wider mb-3">Post-Purchase</h4>
            <ul className="space-y-2 font-normal">
              <li><button onClick={() => handleViewChange('orders')} className="hover:text-indigo-400 transition-colors">Order History</button></li>
              <li><button onClick={() => handleViewChange('orders')} className="hover:text-indigo-400 transition-colors">Return Request</button></li>
              <li><button onClick={() => handleViewChange('orders')} className="hover:text-indigo-400 transition-colors">Exchange tickets</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase text-slate-400 tracking-wider mb-3">College Evaluation Info</h4>
            <ul className="space-y-2 font-normal text-slate-500">
              <li>Project: E-Commerce Web Application</li>
              <li>Brand Target: GABA Brand Store</li>
              <li>Tech: Node, Express, React, MySQL</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-normal text-[10px]">
          <span>© 2026 GABA Premium Clothing. Prepared for Academic Evaluation.</span>
          <div className="flex items-center gap-1.5 text-indigo-400/80">
            <Shield className="w-3.5 h-3.5" />
            <span>Secured Admin Encryption Pipeline</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StorefrontContent />
      </CartProvider>
    </AuthProvider>
  );
}
