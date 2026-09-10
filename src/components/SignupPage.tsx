import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { UserProfile, ActiveTab } from '../types';

interface SignupPageProps {
  onRegisterSuccess: (user: UserProfile) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onRegisterSuccess,
  setActiveTab,
  onOpenLogin
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    whatsapp: '',
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must accept the Terms of Service to create an account.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register account');
      }

      onRegisterSuccess(data.user);
      setActiveTab('dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#ff5a1f] flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Create SMM ZIVO Account</h1>
            <p className="text-xs text-slate-500 mt-1">
              Join thousands of agencies & resellers worldwide. Get instant access to wholesale rates.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>$15.00 Instant Welcome Bonus Credit Included</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. social_agency"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. client@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number (For Order Updates)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="w-4 h-4 text-[#ff5a1f] rounded border-slate-300 focus:ring-[#ff5a1f]"
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-600">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('terms')}
                  className="text-[#ff5a1f] font-semibold hover:underline cursor-pointer"
                >
                  Terms of Service & API Policies
                </button>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-[#ff5a1f] hover:bg-[#e04810] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account & Claim Bonus'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={onOpenLogin}
                className="text-[#ff5a1f] font-bold hover:underline cursor-pointer"
              >
                Sign In Instead
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
