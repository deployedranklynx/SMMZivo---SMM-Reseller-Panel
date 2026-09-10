import React, { useState } from 'react';
import { 
  Layers, 
  Code2, 
  UserPlus, 
  FileText, 
  LayoutDashboard, 
  Wallet, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenAddFunds: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenLogin,
  onLogout,
  onOpenAddFunds
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-t-2 border-[#ff5a1f] border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo (Matching Screenshot SMM ZIVO logo) */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
            id="nav-logo-btn"
          >
            {/* Custom SMM ZIVO Stylized Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-950 via-slate-800 to-slate-900 p-0.5 shadow-md flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative">
                {/* Stylized Z letter with orange accent */}
                <span className="text-xl font-black italic tracking-tighter text-white font-mono">
                  Z<span className="text-[#ff5a1f]">.</span>
                </span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ff5a1f] rounded-full blur-[2px] opacity-70"></div>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-950 font-sans">
                  SMM <span className="text-[#ff5a1f]">ZIVO</span>
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
                SMM ZIVO PANEL
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            
            {/* Sign in / Dashboard depending on auth */}
            {!user || user.id === 'guest' ? (
              <button
                id="nav-signin-btn"
                onClick={onOpenLogin}
                className="text-sm font-semibold text-slate-700 hover:text-[#ff5a1f] px-3 py-2 transition-colors cursor-pointer"
              >
                Sign in
              </button>
            ) : null}

            {/* Services (Solid Orange Pill Button matching Screenshot) */}
            <button
              id="nav-services-btn"
              onClick={() => handleNav('services')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-xs cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#ff5a1f] hover:bg-[#e04810] text-white shadow-sm'
                  : 'bg-[#ff5a1f] hover:bg-[#e04810] text-white'
              }`}
            >
              Services
            </button>

            {/* API Docs Link */}
            <button
              id="nav-api-btn"
              onClick={() => handleNav('api')}
              className={`text-sm font-semibold px-3 py-2 transition-colors cursor-pointer ${
                activeTab === 'api'
                  ? 'text-[#ff5a1f] font-bold'
                  : 'text-slate-700 hover:text-[#ff5a1f]'
              }`}
            >
              API
            </button>

            {/* Terms Link */}
            <button
              id="nav-terms-btn"
              onClick={() => handleNav('terms')}
              className={`text-sm font-semibold px-3 py-2 transition-colors cursor-pointer ${
                activeTab === 'terms'
                  ? 'text-[#ff5a1f] font-bold'
                  : 'text-slate-700 hover:text-[#ff5a1f]'
              }`}
            >
              Terms
            </button>

            {/* Orders Panel / Dashboard */}
            <button
              id="nav-dashboard-btn"
              onClick={() => handleNav('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Orders Panel</span>
            </button>

            {/* Sign up */}
            {(!user || user.id === 'guest') && (
              <button
                id="nav-signup-btn"
                onClick={() => handleNav('signup')}
                className={`text-sm font-semibold px-3 py-2 transition-colors cursor-pointer ${
                  activeTab === 'signup'
                    ? 'text-[#ff5a1f] font-bold'
                    : 'text-slate-700 hover:text-[#ff5a1f]'
                }`}
              >
                Sign up
              </button>
            )}

            {/* If logged in, show balance & user badge */}
            {user && user.id !== 'guest' && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {/* Balance Pill */}
                <div 
                  onClick={onOpenAddFunds}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors"
                  title="Click to Add Funds"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-mono font-bold">${Number(user.balance ?? 0).toFixed(2)}</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-1 py-0.5 rounded font-bold">+</span>
                </div>

                {/* User menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#ff5a1f] text-white flex items-center justify-center font-bold text-[10px]">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.username}</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-slate-400 text-[10px]">Signed in as</p>
                        <p className="font-bold text-slate-900 truncate">{user.username}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          setActiveTab('dashboard');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </nav>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => handleNav('services')}
              className="bg-[#ff5a1f] text-white text-xs font-bold px-3 py-1.5 rounded-md"
            >
              Services
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('services')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold bg-[#ff5a1f] text-white"
          >
            Services Catalog
          </button>
          <button
            onClick={() => handleNav('api')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            API Docs
          </button>
          <button
            onClick={() => handleNav('dashboard')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Orders Panel
          </button>
          <button
            onClick={() => handleNav('terms')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Terms of Service
          </button>

          {!user || user.id === 'guest' ? (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="flex-1 py-2 text-center text-xs font-bold text-slate-800 bg-slate-100 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('signup')}
                className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#ff5a1f] rounded-lg"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Balance: ${Number(user?.balance ?? 0).toFixed(2)}</span>
              <button
                onClick={onLogout}
                className="text-xs text-red-600 font-bold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
