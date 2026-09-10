import React from 'react';
import { X, Layers, ShoppingCart, CheckCircle2, Clock, ShieldCheck, Link2 } from 'lucide-react';
import { SMMService } from '../types';

interface ServiceDetailModalProps {
  service: SMMService | null;
  onClose: () => void;
  onOrderNow: (service: SMMService) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onOrderNow
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5 text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff5a1f]">
          <Layers className="w-4 h-4" />
          <span>SERVICE SPECIFICATIONS #{service.id}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-950 leading-snug">
          {service.name}
        </h2>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-md text-xs bg-slate-100 text-slate-700 font-medium">
            {service.category}
          </span>
          {service.refill && (
            <span className="px-3 py-1 rounded-md text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Auto Refill Warranty
            </span>
          )}
          <span className="px-3 py-1 rounded-md text-xs bg-orange-50 text-[#ff5a1f] border border-orange-200 font-mono font-bold">
            ${Number(service?.rate ?? 0).toFixed(4)} / 1,000
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Min Order</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{Number(service?.min ?? 1).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Max Order</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{Number(service?.max ?? 10000).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Average Speed</span>
            <span className="font-semibold text-slate-800">{service.avgTime}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Dispatch System</span>
            <span className="font-semibold text-emerald-600">Automated API</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Instructions & Delivery Notes</h4>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
            <p>{service.description}</p>
            <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
              <p className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <Link2 className="w-3.5 h-3.5 text-[#ff5a1f]" />
                <span>Link Formatting Example:</span>
              </p>
              <p className="text-slate-600 font-mono text-[11px]">
                https://youtube.com/channel/XXXXX or https://instagram.com/username
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onOrderNow(service);
              onClose();
            }}
            className="px-5 py-2.5 rounded-lg bg-[#ff5a1f] hover:bg-[#e04810] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Order This Service</span>
          </button>
        </div>

      </div>
    </div>
  );
};
