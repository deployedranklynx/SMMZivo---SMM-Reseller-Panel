import React from 'react';
import { Zap, ShieldCheck, Headphones, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-14 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 mb-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 flex items-center justify-center text-[#ff5a1f]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant Delivery</h4>
              <p className="text-xs text-slate-400">Automated dispatch within seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Gateways</h4>
              <p className="text-xs text-slate-400">JazzCash, Easypaisa, Crypto & Cards</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
              <p className="text-xs text-slate-400">WhatsApp & Live ticket assistance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Auto Refill Warranty</h4>
              <p className="text-xs text-slate-400">Lifetime & 30-365 days guarantee</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10 text-xs">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white font-mono font-bold text-sm border border-slate-800">
                Z<span className="text-[#ff5a1f]">.</span>
              </div>
              <span className="text-xl font-black text-white font-sans tracking-tight">
                SMM <span className="text-[#ff5a1f]">ZIVO</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              SMM ZIVO is the premier wholesale social media marketing panel connecting resellers directly with high-speed API automated processing.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All 70+ Provider Server APIs Operational</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                  Services & Rates
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('api')} className="hover:text-white transition-colors">
                  API Documentation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                  Orders Panel
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Top Platforms</h5>
            <ul className="space-y-2">
              <li>YouTube Watch Time & Monetization</li>
              <li>WhatsApp Poll Votes</li>
              <li>Instagram Non-Drop Followers</li>
              <li>TikTok Likes & Shares</li>
              <li>Telegram Channel Members</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Legal & Compliance</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-white transition-colors">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-white transition-colors">
                  Refill Conditions
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SMM ZIVO Panel. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Wholesale SMM v2 Standard</span>
            <span>•</span>
            <span>Automated Provider Routing</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
