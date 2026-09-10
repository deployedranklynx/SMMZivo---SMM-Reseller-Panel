import React, { useState } from 'react';
import { FileText, ShieldAlert, CheckCircle, RefreshCcw, Lock } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'terms' | 'refund' | 'privacy' | 'refill'>('terms');

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff5a1f] mb-1">
            <FileText className="w-4 h-4" />
            <span>LEGAL & COMPLIANCE AGREEMENTS</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Terms of Service & Policies</h1>
          <p className="text-xs text-slate-500 mt-1">
            Official SMM ZIVO Reseller Agreement • Last updated: 2026
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveSection('terms')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'terms'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            General Terms of Service
          </button>

          <button
            onClick={() => setActiveSection('refund')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'refund'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Refund Policy
          </button>

          <button
            onClick={() => setActiveSection('refill')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'refill'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Warranty & Refill
          </button>

          <button
            onClick={() => setActiveSection('privacy')}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'privacy'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
        </div>

        {/* Content Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-xs text-slate-700 leading-relaxed space-y-6">
          
          {activeSection === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">1. General Overview & Reseller Terms</h2>
              <p>
                By placing an order on SMM ZIVO, you automatically agree with all the terms of service listed below, whether you read them or not. We reserve the right to alter these terms of service without prior notice.
              </p>
              
              <h3 className="text-sm font-bold text-slate-800">2. Service Provision</h3>
              <p>
                SMM ZIVO will only be used to promote your YouTube, Instagram, Facebook, TikTok, Twitter or other social media accounts and help boost your appearance only. We do not guarantee your new followers will interact with you, we simply guarantee you to get the followers you pay for.
              </p>

              <h3 className="text-sm font-bold text-slate-800">3. Liabilities</h3>
              <p>
                SMM ZIVO is in no way liable for any account suspension or picture deletion done by Instagram, Twitter, Facebook, YouTube or Other Social Media.
              </p>
            </div>
          )}

          {activeSection === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Refund Policy</h2>
              <p>
                No refunds will be made to your original payment method. After a deposit has been completed, there is no way to reverse it. You must use your balance on orders from SMM ZIVO.
              </p>
              <p>
                If an order is canceled by our automated engine due to invalid link format or server overload, your account balance will automatically be refunded in full immediately.
              </p>
            </div>
          )}

          {activeSection === 'refill' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Refill & Guarantee Conditions</h2>
              <p>
                Services marked with [Refill] or [Lifetime Stability] come with automated refill protection. If drops occur during the warranty window, click the "Refill" button next to your order in the dashboard.
              </p>
              <p>
                Refill requests are submitted directly to the upstream wholesale provider API and are processed within 1 to 24 hours.
              </p>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Privacy & Confidentiality</h2>
              <p>
                This policy covers how we use your personal information. We take your privacy seriously and will take all measures to protect your personal information.
              </p>
              <p>
                Any personal information received will only be used to fill your order. We will not sell or redistribute your information to anyone. All information is encrypted and saved in secure servers.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
