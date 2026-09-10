import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  SlidersHorizontal, 
  ChevronDown,
  Info,
  ShoppingCart,
  CheckCircle2,
  Menu,
  RotateCcw
} from 'lucide-react';
import { SMMService, ActiveTab } from '../types';
import { PlatformIcon } from './PlatformIcons';

interface ServicesPageProps {
  services: SMMService[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectServiceToOrder: (service: SMMService) => void;
  onOpenDetailModal: (service: SMMService) => void;
}

type Currency = 'PKR' | 'USD' | 'EUR' | 'INR';

const CURRENCY_CONFIG: Record<Currency, { symbol: string; code: string; rate: number }> = {
  PKR: { symbol: 'PKR', code: 'PKR', rate: 279.0 },
  USD: { symbol: '$', code: 'USD', rate: 1.0 },
  EUR: { symbol: '€', code: 'EUR', rate: 0.92 },
  INR: { symbol: '₹', code: 'INR', rate: 86.5 }
};

// Category platform mapping for grid matching the screenshot
const PLATFORM_CATEGORIES = [
  { id: 'All', name: 'All', iconName: 'all' },
  { id: 'YouTube', name: 'YouTube', iconName: 'youtube' },
  { id: 'Facebook', name: 'Facebook', iconName: 'facebook' },
  { id: 'Instagram', name: 'Instagram', iconName: 'instagram' },
  { id: 'TikTok', name: 'TikTok', iconName: 'tiktok' },
  { id: 'Telegram', name: 'Telegram', iconName: 'telegram' },
  { id: 'Spotify', name: 'Spotify', iconName: 'spotify' },
  { id: 'Snapchat', name: 'Snapchat', iconName: 'snapchat' },
  { id: 'Threads', name: 'Threads', iconName: 'threads' },
  { id: 'Twitter', name: 'Twitter', iconName: 'twitter' },
  { id: 'LinkedIn', name: 'LinkedIn', iconName: 'linkedin' },
  { id: 'Twitch', name: 'Twitch', iconName: 'twitch' },
  { id: 'Kick', name: 'Kick', iconName: 'kick' },
  { id: 'Traffic', name: 'Traffic', iconName: 'traffic' },
  { id: 'Other', name: 'Other', iconName: 'other' }
];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  setActiveTab,
  onSelectServiceToOrder,
  onOpenDetailModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedDetailedCategory, setSelectedDetailedCategory] = useState<string>('All');
  const [currency, setCurrency] = useState<Currency>('PKR');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'id' | 'rate-asc' | 'rate-desc'>('id');

  // Extract distinct service categories from the catalog
  const detailedCategories = useMemo(() => {
    const set = new Set<string>();
    services.forEach(s => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [services]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    return services
      .filter(service => {
        // Platform filter
        let matchesPlatform = true;
        if (selectedPlatform !== 'All') {
          const normName = (service.category + ' ' + service.name).toLowerCase();
          if (selectedPlatform === 'Other') {
            const known = ['youtube', 'facebook', 'instagram', 'tiktok', 'telegram', 'spotify', 'snapchat', 'threads', 'twitter', 'linkedin', 'twitch', 'kick', 'traffic', 'website'];
            matchesPlatform = !known.some(k => normName.includes(k));
          } else if (selectedPlatform === 'Traffic') {
            matchesPlatform = normName.includes('traffic') || normName.includes('website');
          } else {
            matchesPlatform = normName.includes(selectedPlatform.toLowerCase());
          }
        }

        // Detailed category filter
        const matchesDetailed = selectedDetailedCategory === 'All' || service.category === selectedDetailedCategory;

        // Search term
        const term = searchTerm.trim().toLowerCase();
        const matchesSearch = !term || 
          service.name.toLowerCase().includes(term) ||
          service.id.toString().includes(term) ||
          service.category.toLowerCase().includes(term);

        return matchesPlatform && matchesDetailed && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rate-asc') return a.rate - b.rate;
        if (sortBy === 'rate-desc') return b.rate - a.rate;
        return a.id - b.id;
      });
  }, [services, selectedPlatform, selectedDetailedCategory, searchTerm, sortBy]);

  // Group services by category for categorized view
  const groupedServices = useMemo(() => {
    const groups: { category: string; items: SMMService[] }[] = [];
    const map = new Map<string, SMMService[]>();

    filteredServices.forEach(s => {
      if (!map.has(s.category)) {
        map.set(s.category, []);
      }
      map.get(s.category)!.push(s);
    });

    map.forEach((items, category) => {
      groups.push({ category, items });
    });

    return groups;
  }, [filteredServices]);

  // Format currency
  const formatRate = (usdRate: number | undefined | null) => {
    const curr = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
    const rateNum = typeof usdRate === 'number' && !isNaN(usdRate) ? usdRate : 0;
    const converted = rateNum * (curr?.rate || 1);
    if (curr.code === 'PKR') {
      return `PKR ${converted.toFixed(2)}`;
    }
    if (curr.code === 'USD') {
      return `$${converted < 0.01 ? converted.toFixed(4) : converted.toFixed(3)}`;
    }
    if (curr.code === 'EUR') {
      return `€${converted < 0.01 ? converted.toFixed(4) : converted.toFixed(3)}`;
    }
    return `₹${converted.toFixed(2)}`;
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(services, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "smmzivo_services.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pb-16">
      
      {/* Top Banner / Breadcrumb Area */}
      <div className="bg-white border-b border-slate-200/80 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Services List</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Wholesale social media marketing rates • Instant automated processing
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Currency:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {(['PKR', 'USD', 'INR', 'EUR'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    currency === curr
                      ? 'bg-[#ff5a1f] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportJson}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs transition-colors"
              title="Export Services JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Categories Grid (Matching Screenshot Exactly) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {PLATFORM_CATEGORIES.map((item) => {
            const isActive = selectedPlatform === item.id;
            return (
              <button
                key={item.id}
                id={`category-btn-${item.id.toLowerCase()}`}
                onClick={() => {
                  setSelectedPlatform(item.id);
                  setSelectedDetailedCategory('All');
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-semibold transition-all duration-150 text-left cursor-pointer border ${
                  isActive
                    ? 'bg-[#ff5a1f] text-white border-[#ff5a1f] shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-xs'
                }`}
              >
                {item.id === 'All' ? (
                  <span className="w-5 h-5 flex items-center justify-center font-bold text-base">
                    ☰
                  </span>
                ) : (
                  <PlatformIcon platform={item.id} className="w-5 h-5 shrink-0" />
                )}
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Controls Bar (Matching Screenshot) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {/* Filter Toggle Button on Left: [ 🎛️ ˅ ] */}
            <button
              id="services-filter-toggle-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="bg-[#ff5a1f] hover:bg-[#e04810] text-white px-4 py-3 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
              title="Filter by sub-category"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Wide Search Input */}
            <div className="relative flex-1">
              <input
                id="services-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff5a1f] shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Orange Search Icon Button on Right: [ 🔍 ] */}
            <button
              id="services-search-submit-btn"
              className="bg-[#ff5a1f] hover:bg-[#e04810] text-white p-3.5 rounded-lg flex items-center justify-center shadow-sm transition-colors cursor-pointer shrink-0"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Collapsible Filter Sub-bar */}
          {showFilterDropdown && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 animate-in fade-in duration-150">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">Detailed Category Filter</label>
                <select
                  value={selectedDetailedCategory}
                  onChange={(e) => setSelectedDetailedCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-[#ff5a1f]"
                >
                  {detailedCategories.map((c) => (
                    <option key={c} value={c}>
                      {c} ({c === 'All' ? services.length : services.filter(s => s.category === c).length})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-xs font-bold text-slate-600 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-[#ff5a1f]"
                >
                  <option value="id">Service ID</option>
                  <option value="rate-asc">Price: Low to High</option>
                  <option value="rate-desc">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedPlatform('All');
                    setSelectedDetailedCategory('All');
                    setSearchTerm('');
                    setSortBy('id');
                  }}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Services Table (Matching Screenshot Columns & Layout) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Header Row */}
              <thead>
                <tr className="border-b border-slate-200 bg-white text-slate-900 font-bold text-sm">
                  <th className="py-3.5 px-4 w-16">ID</th>
                  <th className="py-3.5 px-4 min-w-[280px]">Service</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Rate per 1000</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Min order</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Max order</th>
                  <th className="py-3.5 px-4 text-center w-28 whitespace-nowrap">Description</th>
                </tr>
              </thead>

              {/* Table Body with Category Group Banners */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <p className="text-sm font-semibold text-slate-600">No services found.</p>
                      <p className="text-xs text-slate-400 mt-1">Try changing your search term or platform filter.</p>
                      <button
                        onClick={() => {
                          setSelectedPlatform('All');
                          setSelectedDetailedCategory('All');
                          setSearchTerm('');
                        }}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#ff5a1f] hover:underline"
                      >
                        Reset All Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  groupedServices.map((group) => (
                    <React.Fragment key={group.category}>
                      {/* Category Banner Row (Like in Screenshot) */}
                      <tr className="bg-slate-50/80 border-y border-slate-200/90">
                        <td colSpan={6} className="py-3 px-4 font-bold text-slate-900 text-sm">
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={group.category} className="w-4 h-4 shrink-0" />
                            <span>{group.category}</span>
                            <span className="text-[11px] font-normal text-slate-500 ml-1">
                              ({group.items.length} {group.items.length === 1 ? 'service' : 'services'})
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Services in this category */}
                      {group.items.map((service) => (
                        <tr 
                          key={service.id} 
                          className="hover:bg-[#fff9f5] transition-colors group"
                        >
                          {/* ID */}
                          <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                            {service.id}
                          </td>

                          {/* Service Name */}
                          <td className="py-3.5 px-4 text-slate-800 leading-relaxed font-normal">
                            <div className="flex flex-col gap-1">
                              <span className="hover:text-[#ff5a1f] cursor-pointer transition-colors" onClick={() => onOpenDetailModal(service)}>
                                {service.name}
                              </span>
                              {service.refill && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Auto Refill Guaranteed
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Rate per 1000 */}
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {formatRate(service.rate)}
                          </td>

                          {/* Min Order */}
                          <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                            {Number(service?.min ?? 1).toLocaleString()}
                          </td>

                          {/* Max Order */}
                          <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                            {Number(service?.max ?? 10000).toLocaleString()}
                          </td>

                          {/* Description View Button (Matching Screenshot) */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              id={`view-service-${service.id}`}
                              onClick={() => onOpenDetailModal(service)}
                              className="bg-[#ff5a1f] hover:bg-[#e04810] text-white font-semibold text-xs px-4 py-1.5 rounded-md shadow-xs transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-1"
                              title="View service description and instructions"
                            >
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Catalog Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 px-1">
          <span>Showing <strong>{filteredServices.length}</strong> active services</span>
          <span className="text-slate-400">All prices updated in real-time with automatic provider dispatch</span>
        </div>

      </div>
    </div>
  );
};
