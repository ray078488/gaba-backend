import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, LayoutDashboard, History, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import logo from '../logo.jpg';

export default function Navbar({ onOpenCart, onOpenAuth, onSelectCategory, activeCategory, onSearchChange, searchTerm, activeView, onChangeView }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = [
    { id: 'All', name: 'All Collection' },
    { id: 'Men', name: "Men's Wear" },
    { id: 'Women', name: "Women's Wear" },
    { id: 'Unisex', name: 'Unisex' }
  ];

  return (
    <nav className="glass-nav sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => { onChangeView('store'); onSelectCategory('All'); }}
      >
        <img 
          src={logo} 
          alt="GABA Logo" 
          className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400"
        />
        <span className="text-3xl font-black tracking-widest bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">
          GABA
        </span>
        <span className="hidden sm:inline text-[10px] tracking-wider text-slate-400 uppercase font-semibold border border-slate-700 px-1.5 py-0.5 rounded">
          PREMIUM
        </span>
      </div>

      {/* Category Links */}
      {activeView === 'store' && (
        <div className="hidden md:flex items-center gap-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                activeCategory === cat.id 
                  ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' 
                  : 'text-slate-300 hover:text-indigo-300 pb-1'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Search & Actions */}
      <div className="flex items-center gap-6 flex-1 md:flex-initial justify-end">
        {/* Search Input */}
        {activeView === 'store' && (
          <div className="relative w-full max-w-xs hidden sm:block">
            <input
              type="text"
              placeholder="Search GABA clothes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 pl-10 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2" />
          </div>
        )}

        {/* User Account Controls */}
        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full py-1.5 px-3.5 transition-all text-xs font-semibold"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                  {user.Name.substring(0, 1).toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate text-slate-300">{user.Name}</span>
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 text-xs animate-fadein"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-700 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Role: {user.Role}
                  </div>
                  <button
                    onClick={() => { onChangeView('orders'); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-300 hover:text-white"
                  >
                    <History className="w-4 h-4 text-indigo-400" />
                    Order History
                  </button>
                  {user.Role === 'admin' && (
                    <button
                      onClick={() => { onChangeView('admin'); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-300 hover:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4 text-purple-400" />
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); onChangeView('store'); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-rose-400 hover:text-rose-300 border-t border-slate-700 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full px-5 py-2 text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>

        {/* Shopping Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full p-2.5 transition-all active:scale-95 group"
        >
          <ShoppingBag className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-indigo-500 text-[10px] font-extrabold text-white rounded-full w-5.5 h-5.5 flex items-center justify-center border-2 border-slate-900 px-1">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
