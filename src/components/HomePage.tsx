import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Code2, 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  ChevronRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { ActiveTab, SMMService } from '../types';
import { PlatformIcon } from './PlatformIcons';

interface HomePageProps {
  setActiveTab: (tab: ActiveTab) => void;
  services: SMMService[];
  onSelectServiceToOrder?: (service: SMMService) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, services, onSelectServiceToOrder }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [searchFilter, setSearchFilter] = useState('');

  const featuredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    s.category.toLowerCase().includes(searchFilter.toLowerCase())
  ).slice(0, 6);

  const faqs = [
    {
      q: "What is an SMM Panel?",
      a: "An SMM (Social Media Marketing) Panel is an automated platform providing online marketing services such as likes, followers, views, watch hours, and comments across all major social networks at wholesale prices."
    },
    {
      q: "How fast are the orders processed on SMM ZIVO?",
      a: "Most services start within 0 to 5 minutes! Our system connects via automated API dispatch engines to high-capacity provider clusters for instant start times."
    },
    {
      q: "Can I connect my own website or panel to SMM ZIVO API?",
      a: "Yes! SMM ZIVO supports the universal SMM API v2 standard. Any platform using PerfectPanel, SmartPanel, RentPanel, or custom scripts can connect with your API key in seconds."
    },
    {
      q: "Are the services safe for my social media accounts?",
      a: "Yes, 100%. Our services comply with natural drip-feed delivery mechanisms and organic engagement patterns. We never ask for your account passwords—only your public profile or post link."
    },
    {
      q: "What payment methods are supported?",
      a: "We support JazzCash, Easypaisa, USDT (TRC-20 & BEP-20) with bonus credits, Credit / Debit cards via Stripe, PayPal, and Binance Pay with instant automatic wallet crediting."
    }
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-white via-slate-50/50 to-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#ff5a1f] text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>World's #1 Automated SMM Reseller Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] mb-6">
              Grow Your Social Media with <br className="hidden sm:inline" />
              <span className="text-[#ff5a1f]">
                SMM ZIVO Wholesale Panel
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get the cheapest wholesale rates for YouTube watch time, WhatsApp poll votes, Instagram followers, TikTok views, and Telegram members with instant automated dispatch.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="hero-view-services-btn"
                onClick={() => setActiveTab('services')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ff5a1f] hover:bg-[#e04810] text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>View All Services & Rates</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-order-now-btn"
                onClick={() => setActiveTab('dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Orders Panel</span>
              </button>

              <button
                id="hero-api-docs-btn"
                onClick={() => setActiveTab('api')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-[#ff5a1f]" />
                <span>API v2</span>
              </button>
            </div>

            {/* Mini Trust Features */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Starting from PKR 2.50 / 1,000</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Lifetime Refill Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24/7 WhatsApp Support</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Real-time Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          
          <div className="text-center p-3">
            <div className="flex items-center justify-center gap-1.5 text-[#ff5a1f] mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">15,482,900+</div>
            <p className="text-xs text-slate-500 mt-1">Processed automatically</p>
          </div>

          <div className="text-center p-3 border-l border-slate-100">
            <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Active Services</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{services.length}+</div>
            <p className="text-xs text-slate-500 mt-1">Across 15 platforms</p>
          </div>

          <div className="text-center p-3 border-l border-slate-100">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Active Clients</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">118,500+</div>
            <p className="text-xs text-slate-500 mt-1">Agencies worldwide</p>
          </div>

          <div className="text-center p-3 border-l border-slate-100">
            <div className="flex items-center justify-center gap-1.5 text-purple-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Avg Dispatch</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">&lt; 2.0 sec</div>
            <p className="text-xs text-slate-500 mt-1">Instant server routing</p>
          </div>

        </div>
      </section>

      {/* Supported Platforms Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xs uppercase font-bold tracking-wider text-[#ff5a1f] mb-1">Omni-Channel Coverage</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Supported Social Media Platforms</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
            Direct wholesale access to all platforms with high speed and retention.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'YouTube', sub: 'From PKR 250 / 1K' },
            { name: 'WhatsApp', sub: 'From PKR 335 / 1K' },
            { name: 'Instagram', sub: 'From PKR 95 / 1K' },
            { name: 'TikTok', sub: 'From PKR 20 / 1K' },
            { name: 'Telegram', sub: 'From PKR 45 / 1K' },
            { name: 'Facebook', sub: 'From PKR 110 / 1K' }
          ].map((item) => (
            <div 
              key={item.name}
              onClick={() => setActiveTab('services')}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#ff5a1f] hover:shadow-xs transition-all cursor-pointer group text-center"
            >
              <div className="w-10 h-10 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <PlatformIcon platform={item.name} className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#ff5a1f] transition-colors">{item.name}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs uppercase font-bold tracking-wider text-[#ff5a1f] mb-1">Simple & Fast</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">How SMM ZIVO Works in 4 Steps</h3>
            <p className="text-xs text-slate-500 mt-1">Get started in under 60 seconds with instant balance crediting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-3xl font-black text-[#ff5a1f] font-mono">01</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">Create Account</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign up with username and email. No identity documents or complex KYC required.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-3xl font-black text-[#ff5a1f] font-mono">02</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">Add Funds</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deposit via JazzCash, Easypaisa, USDT, Cards or PayPal. Instant automated wallet crediting.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-3xl font-black text-[#ff5a1f] font-mono">03</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">Select Service</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose target platform, paste link, enter quantity and place your wholesale order.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-3xl font-black text-[#ff5a1f] font-mono">04</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">Instant Results</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Orders dispatch automatically to provider servers with live progress tracking.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Services Preview with Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Featured High-Speed Services</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live rates and instant dispatch benchmarks</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Filter by keyword (e.g. Monetized, Followers)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full md:w-64 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#ff5a1f]"
            />
            <button
              onClick={() => setActiveTab('services')}
              className="px-4 py-2 rounded-lg bg-[#ff5a1f] hover:bg-[#e04810] text-white text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
            >
              All Services →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Rate / 1000</th>
                <th className="py-3 px-4">Min / Max</th>
                <th className="py-3 px-4">Avg Speed</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {featuredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-700">#{service.id}</td>
                  <td className="py-3 px-4 text-slate-900 font-medium max-w-sm">
                    {service.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{service.category}</td>
                  <td className="py-3 px-4 font-bold text-slate-950">
                    ${Number(service?.rate ?? 0).toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {Number(service?.min ?? 1).toLocaleString()} / {Number(service?.max ?? 10000).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{service.avgTime}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        if (onSelectServiceToOrder) {
                          onSelectServiceToOrder(service);
                        }
                        setActiveTab('dashboard');
                      }}
                      className="px-3 py-1 rounded bg-[#ff5a1f] hover:bg-[#e04810] text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xs uppercase font-bold tracking-wider text-[#ff5a1f] mb-1">Common Questions</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500 mt-1">Everything you need to know about our services and automated order engine.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-slate-800 font-bold text-sm hover:text-[#ff5a1f] cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#ff5a1f] shrink-0" />
                  {faq.q}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-90 text-[#ff5a1f]' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
