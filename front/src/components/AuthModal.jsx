import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password || (!isLogin && !name)) {
      setErrorMessage('Please fill in all details.');
      return;
    }

    setLoading(true);
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await signup(name, email, password);
    }
    setLoading(false);

    if (result.success) {
      onClose();
      // Reset form fields
      setName('');
      setEmail('');
      setPassword('');
    } else {
      setErrorMessage(result.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadein">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-slideup">
        
        {/* Header Decor */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-2 w-full" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 p-1.5 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Form Body */}
        <div className="px-8 py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-3">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isLogin ? 'Welcome Back to GABA' : 'Create GABA Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isLogin ? 'Enter your details to access your premium apparel collections.' : 'Join us for exclusive catalog items and seamless returns.'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            {/* Name field for Signup */}
            {!isLogin && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-normal"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-normal"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Password</label>
                {isLogin && (
                  <span className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer font-normal">Forgot?</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-normal"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 active:scale-[0.98] font-bold text-xs"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In to GABA' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-xs text-slate-400 font-semibold border-t border-slate-700/60 pt-4">
            {isLogin ? (
              <p>
                New to GABA?{' '}
                <span 
                  onClick={() => { setIsLogin(false); setErrorMessage(''); }}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer hover:underline font-bold"
                >
                  Create an account
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <span 
                  onClick={() => { setIsLogin(true); setErrorMessage(''); }}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer hover:underline font-bold"
                >
                  Sign in here
                </span>
              </p>
            )}
          </div>
          
          {/* Quick Admin Note */}
          <div className="mt-4 p-2 bg-slate-900/50 rounded-lg border border-slate-700/40 text-[10px] text-slate-500 text-center font-normal">
            💡 For testing admin CRUD: Sign up or sign in as <strong className="text-slate-400">admin@gaba.com</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
