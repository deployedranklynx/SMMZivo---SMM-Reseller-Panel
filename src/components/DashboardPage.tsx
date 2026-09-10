import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  ListOrdered, 
  Wallet, 
  Key, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowRight, 
  Send, 
  Trash2, 
  Play, 
  ShieldCheck, 
  Info,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';
import { 
  SMMService, 
  SMMOrder, 
  ExternalProvider, 
  UserProfile, 
  DashboardSubTab, 
  OrderStatus 
} from '../types';

interface DashboardPageProps {
  user: UserProfile;
  services: SMMService[];
  orders: SMMOrder[];
  providers: ExternalProvider[];
  selectedServiceForOrder: SMMService | null;
  onRefreshData: () => void;
  onOrderPlaced: (order: SMMOrder, newBalance: number) => void;
  onBalanceUpdated: (newBalance: number) => void;
  onOpenDetailModal: (service: SMMService) => void;
  defaultSubTab?: DashboardSubTab;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  services,
  orders,
  providers,
  selectedServiceForOrder,
  onRefreshData,
  onOrderPlaced,
  onBalanceUpdated,
  onOpenDetailModal,
  defaultSubTab = 'new-order'
}) => {
  const [subTab, setSubTab] = useState<DashboardSubTab>(defaultSubTab);

  // Sync subTab if defaultSubTab changes (e.g. from nav Add Funds)
  useEffect(() => {
    if (defaultSubTab) {
      setSubTab(defaultSubTab);
    }
  }, [defaultSubTab]);

  // -------------------------------------------------------------
  // 1. NEW ORDER STATE
  // -------------------------------------------------------------
  const [orderCategory, setOrderCategory] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    services.forEach(s => cats.add(s.category));
    return Array.from(cats);
  }, [services]);

  // Pre-fill selected service if passed via props
  useEffect(() => {
    if (selectedServiceForOrder) {
      setOrderCategory(selectedServiceForOrder.category);
      setSelectedServiceId(selectedServiceForOrder.id);
      setQuantity(selectedServiceForOrder.min);
      setSubTab('new-order');
    } else if (categories.length > 0 && !orderCategory) {
      setOrderCategory(categories[0]);
    }
  }, [selectedServiceForOrder, categories]);

  // When category changes, default to first service of that category
  const servicesInCategory = useMemo(() => {
    return services.filter(s => s.category === orderCategory);
  }, [services, orderCategory]);

  useEffect(() => {
    if (servicesInCategory.length > 0) {
      if (!selectedServiceId || !servicesInCategory.some(s => s.id === selectedServiceId)) {
        setSelectedServiceId(servicesInCategory[0].id);
        setQuantity(servicesInCategory[0].min);
      }
    }
  }, [servicesInCategory, selectedServiceId]);

  const currentService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId);
  }, [services, selectedServiceId]);

  // Calculate charge
  const calculatedCharge = useMemo(() => {
    if (!currentService || !quantity) return 0;
    const rate = Number(currentService.rate ?? 0);
    return Number(((rate / 1000) * quantity).toFixed(4));
  }, [currentService, quantity]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    setOrderSuccessMsg(null);

    if (!currentService) {
      setOrderError('Please choose a valid service');
      return;
    }

    if (!targetLink.trim()) {
      setOrderError('Please provide a target profile or post link');
      return;
    }

    const minQty = Number(currentService.min ?? 1);
    const maxQty = Number(currentService.max ?? 1000000);
    if (quantity < minQty || quantity > maxQty) {
      setOrderError(`Quantity must be between ${minQty.toLocaleString()} and ${maxQty.toLocaleString()}`);
      return;
    }

    const currentBalance = Number(user?.balance ?? 0);
    if (currentBalance < calculatedCharge) {
      setOrderError(`Insufficient balance ($${currentBalance.toFixed(2)}). Total cost is $${(calculatedCharge ?? 0).toFixed(2)}. Please add funds.`);
      return;
    }

    setOrderSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: currentService.id,
          link: targetLink.trim(),
          quantity
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      onOrderPlaced(data.order, data.balance);
      setOrderSuccessMsg(
        `Order #${data.order.id} placed successfully! Automated dispatch sent to ${data.order.providerName || 'Cluster'}.`
      );
      setTargetLink('');
    } catch (err: any) {
      setOrderError(err.message || 'An error occurred while placing order');
    } finally {
      setOrderSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // 2. ORDERS LOG STATE
  // -------------------------------------------------------------
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [syncingOrders, setSyncingOrders] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = orderFilterStatus === 'All' || o.status.toLowerCase() === orderFilterStatus.toLowerCase();
      const matchesSearch = 
        o.id.toString().includes(orderSearch) ||
        o.link.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.serviceName.toLowerCase().includes(orderSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderFilterStatus, orderSearch]);

  const handleSyncOrders = async () => {
    setSyncingOrders(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/orders/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSyncMsg(data.message || 'Orders synchronized with provider API');
        onRefreshData();
      }
    } catch (err) {
      setSyncMsg('Failed to sync orders');
    } finally {
      setSyncingOrders(false);
    }
  };

  const handleRefillOrder = async (orderId: number) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/refill`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Refill request dispatched to upstream provider');
        onRefreshData();
      } else {
        alert(data.error || 'Refill failed');
      }
    } catch (err) {
      alert('Failed to submit refill request');
    }
  };

  // -------------------------------------------------------------
  // 3. EXTERNAL SMM PROVIDERS STATE
  // -------------------------------------------------------------
  const [providerList, setProviderList] = useState<ExternalProvider[]>(providers);
  const [newProvName, setNewProvName] = useState('');
  const [newProvUrl, setNewProvUrl] = useState('');
  const [newProvKey, setNewProvKey] = useState('');
  const [addingProv, setAddingProv] = useState(false);
  const [testingProv, setTestingProv] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; balance?: number; currency?: string } | null>(null);

  useEffect(() => {
    setProviderList(providers);
  }, [providers]);

  const handleTestProvider = async (url: string, key: string) => {
    setTestingProv(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl: url, apiKey: key })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, message: 'Connection failed to provider endpoint' });
    } finally {
      setTestingProv(false);
    }
  };

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName || !newProvUrl || !newProvKey) return;

    setAddingProv(true);
    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProvName,
          apiUrl: newProvUrl,
          apiKey: newProvKey
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProviderList([...providerList, data.provider]);
        setNewProvName('');
        setNewProvUrl('');
        setNewProvKey('');
        setTestResult(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingProv(false);
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this external provider?')) return;
    try {
      const res = await fetch(`/api/providers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProviderList(providerList.filter(p => p.id !== id));
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // 4. ADD FUNDS STATE
  // -------------------------------------------------------------
  const [depositAmount, setDepositAmount] = useState<number>(25);
  const [depositMethod, setDepositMethod] = useState<string>('JazzCash / Easypaisa (PKR)');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null);

  const depositBonus = useMemo(() => {
    if (depositMethod.includes('Bonus') || depositMethod.includes('USDT')) {
      return depositAmount * 0.05;
    }
    return 0;
  }, [depositMethod, depositAmount]);

  const totalCredited = depositAmount + depositBonus;

  const handleDeposit = async () => {
    if (depositAmount <= 0) return;
    setDepositLoading(true);
    setDepositSuccess(null);

    try {
      const res = await fetch('/api/user/add-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositAmount,
          method: depositMethod
        })
      });

      const data = await res.json();
      if (res.ok) {
        onBalanceUpdated(data.balance);
        setDepositSuccess(`Payment confirmed! Added $${Number(totalCredited ?? 0).toFixed(2)} to your balance instantly.`);
      }
    } catch (err) {
      alert('Deposit transaction simulation error');
    } finally {
      setDepositLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 5. API KEY STATE
  // -------------------------------------------------------------
  const [copiedKey, setCopiedKey] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = async () => {
    if (!confirm('Generating a new API key will invalidate your existing key on all connected panels and bots. Proceed?')) {
      return;
    }
    setGeneratingKey(true);
    try {
      const res = await fetch('/api/user/generate-key', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        user.apiKey = data.apiKey;
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingKey(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Strip with User Balance & Quick Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff5a1f] mb-1">
              <Activity className="w-4 h-4" />
              <span>OPERATIONAL SMM ZIVO CONSOLE</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Orders Panel & Automation Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Signed in as <strong className="text-slate-800">{user.username}</strong> ({user.email})
            </p>
          </div>

          {/* Balance Card with Quick Add */}
          <div className="flex items-center gap-4 bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 px-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Available Balance</p>
              <p className="text-2xl font-mono font-black text-emerald-950">${Number(user?.balance ?? 0).toFixed(2)}</p>
            </div>
            <button
              onClick={() => setSubTab('add-funds')}
              className="ml-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              + Add Funds
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          
          <button
            id="tab-new-order-btn"
            onClick={() => setSubTab('new-order')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'new-order'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Order</span>
          </button>

          <button
            id="tab-orders-log-btn"
            onClick={() => setSubTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'orders'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Orders Log ({orders.length})</span>
          </button>

          <button
            id="tab-external-providers-btn"
            onClick={() => setSubTab('providers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'providers'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>External Providers & API Routing</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-white/20 font-mono font-bold">
              {providerList.length} Connected
            </span>
          </button>

          <button
            id="tab-add-funds-btn"
            onClick={() => setSubTab('add-funds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'add-funds'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Add Funds / Deposit</span>
          </button>

          <button
            id="tab-api-key-btn"
            onClick={() => setSubTab('api-key')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'api-key'
                ? 'bg-[#ff5a1f] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Credentials</span>
          </button>

        </div>

        {/* ========================================================================= */}
        {/* 1. SUB-TAB: NEW ORDER */}
        {/* ========================================================================= */}
        {subTab === 'new-order' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Form (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Place Single Order</h2>
                  <p className="text-xs text-slate-500">Automated wholesale dispatch with instant calculation</p>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-bold">
                  Automated Engine Active
                </span>
              </div>

              {orderSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">Success!</p>
                    <p className="text-emerald-700">{orderSuccessMsg}</p>
                  </div>
                  <button
                    onClick={() => setSubTab('orders')}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                  >
                    View Orders
                  </button>
                </div>
              )}

              {orderError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{orderError}</span>
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                
                {/* Category selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. Choose Category
                  </label>
                  <select
                    id="order-category-select"
                    value={orderCategory}
                    onChange={(e) => setOrderCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#ff5a1f] cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Choose Service
                  </label>
                  <select
                    id="order-service-select"
                    value={selectedServiceId || ''}
                    onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#ff5a1f] cursor-pointer font-medium"
                  >
                    {servicesInCategory.map((s) => (
                      <option key={s.id} value={s.id}>
                        #{s.id} - {s.name} (${Number(s?.rate ?? 0).toFixed(4)} / 1,000)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Link input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      3. Target Link <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Public profile or post URL</span>
                  </div>
                  <input
                    id="order-link-input"
                    type="text"
                    required
                    placeholder="https://youtube.com/channel/... or https://instagram.com/p/..."
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#ff5a1f] placeholder-slate-400"
                  />
                </div>

                {/* Quantity input with min/max indicator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      4. Quantity <span className="text-red-500">*</span>
                    </label>
                    {currentService && (
                      <span className="text-[11px] font-mono text-slate-500">
                        Min: {Number(currentService.min ?? 1).toLocaleString()} | Max: {Number(currentService.max ?? 10000).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <input
                    id="order-quantity-input"
                    type="number"
                    required
                    min={currentService?.min || 50}
                    max={currentService?.max || 1000000}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                  />

                  {/* Quick preset chips */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[100, 500, 1000, 5000, 10000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setQuantity(preset)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-mono font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        +{preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary & Price bar */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase font-bold">Total Charge</p>
                    <p className="text-2xl font-black font-mono text-slate-950">
                      ${Number(calculatedCharge ?? 0).toFixed(4)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Rate: ${Number(currentService?.rate ?? 0).toFixed(4)} per 1,000
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Your Balance:</p>
                    <p className={`text-sm font-mono font-bold ${
                      Number(user?.balance ?? 0) >= calculatedCharge ? 'text-slate-900' : 'text-red-600'
                    }`}>
                      ${Number(user?.balance ?? 0).toFixed(2)}
                    </p>
                    {Number(user?.balance ?? 0) < calculatedCharge && (
                      <span className="text-[10px] text-red-600 font-bold block">Insufficient balance</span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="submit-new-order-btn"
                  type="submit"
                  disabled={orderSubmitting || Number(user?.balance ?? 0) < calculatedCharge}
                  className="w-full py-3 px-4 rounded-lg bg-[#ff5a1f] hover:bg-[#e04810] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {orderSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Order to SMM Engine...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Order (${Number(calculatedCharge ?? 0).toFixed(4)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Right Service Description Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {currentService && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-[#ff5a1f]">SERVICE DETAILS</span>
                    <span className="text-xs font-mono text-slate-500">ID #{currentService.id}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {currentService.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                        {currentService.category}
                      </span>
                      {currentService.refill && (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                          Refill Guarantee
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Speed / Avg Time</span>
                      <span className="font-semibold text-slate-900">{currentService.avgTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Start Time</span>
                      <span className="font-semibold text-emerald-600">Instant (0-15 Min)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Min Order</span>
                      <span className="font-mono font-bold text-slate-900">{Number(currentService.min ?? 1).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Max Order</span>
                      <span className="font-mono font-bold text-slate-900">{Number(currentService.max ?? 10000).toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#ff5a1f]" />
                      <span>Instructions & Description</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
                      <p>{currentService.description}</p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                        <li>Ensure account is set to PUBLIC before ordering.</li>
                        <li>Do not change username or delete link while order is in progress.</li>
                        <li>Orders dispatch automatically into the provider processing queue.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-[#ff5a1f] shrink-0" />
                    <div>
                      <p className="font-bold">Automated Provider Mapping</p>
                      <p className="text-[11px] text-orange-800">
                        Direct automated API routing to high-capacity provider servers
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. SUB-TAB: ORDERS LOG */}
        {/* ========================================================================= */}
        {subTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Orders Filter & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              
              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['All', 'Pending', 'In Progress', 'Processing', 'Completed', 'Partial', 'Canceled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      orderFilterStatus === st
                        ? 'bg-[#ff5a1f] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st} {st === 'All' ? `(${orders.length})` : `(${orders.filter(o => o.status === st).length})`}
                  </button>
                ))}
              </div>

              {/* Sync & Search */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by ID or link..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                  />
                </div>

                <button
                  id="sync-orders-btn"
                  onClick={handleSyncOrders}
                  disabled={syncingOrders}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  title="Pull real-time progress from external provider API"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingOrders ? 'animate-spin text-[#ff5a1f]' : ''}`} />
                  <span>Sync Status</span>
                </button>
              </div>

            </div>

            {syncMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{syncMsg}</span>
              </div>
            )}

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Target Link</th>
                    <th className="py-3 px-4">Charge</th>
                    <th className="py-3 px-4">Start</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Remains</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">External Dispatch</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-500">
                        <p className="font-semibold">No orders found.</p>
                        <button
                          onClick={() => setSubTab('new-order')}
                          className="mt-2 text-xs text-[#ff5a1f] font-bold hover:underline cursor-pointer"
                        >
                          Place your first order
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusColors: Record<OrderStatus, string> = {
                        'Pending': 'bg-amber-50 text-amber-800 border-amber-200',
                        'Processing': 'bg-blue-50 text-blue-800 border-blue-200',
                        'In Progress': 'bg-indigo-50 text-indigo-800 border-indigo-200',
                        'Completed': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        'Partial': 'bg-orange-50 text-orange-800 border-orange-200',
                        'Canceled': 'bg-red-50 text-red-800 border-red-200'
                      };

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">
                            #{order.id}
                          </td>

                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>

                          <td className="py-3 px-4 text-slate-900 font-medium max-w-xs truncate" title={order.serviceName}>
                            {order.serviceName}
                          </td>

                          <td className="py-3 px-4 text-[#ff5a1f] max-w-xs truncate">
                            <a 
                              href={order.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 hover:underline"
                            >
                              <span className="truncate max-w-[140px]">{order.link}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>

                          <td className="py-3 px-4 font-mono font-bold text-slate-950">
                            ${Number(order?.charge ?? 0).toFixed(4)}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-500">
                            {Number(order?.startCount ?? 0).toLocaleString()}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-900 font-bold">
                            {Number(order?.quantity ?? 0).toLocaleString()}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-500">
                            {Number(order?.remains ?? 0).toLocaleString()}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex flex-col text-[10px]">
                              <span className="font-mono text-slate-800 font-semibold">{order.externalOrderId || 'Internal Auto'}</span>
                              <span className="text-slate-500 truncate max-w-[120px]">{order.providerName || 'Cluster SMM'}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {order.refillStatus === 'Available' ? (
                              <button
                                onClick={() => handleRefillOrder(order.id)}
                                className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 cursor-pointer"
                              >
                                Refill
                              </button>
                            ) : order.refillStatus === 'Requested' ? (
                              <span className="text-[10px] text-amber-700 font-bold">Refill Queued</span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. SUB-TAB: EXTERNAL SMM PROVIDERS */}
        {/* ========================================================================= */}
        {subTab === 'providers' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff5a1f] mb-1">
                    <Cpu className="w-4 h-4" />
                    <span>AUTOMATED EXTERNAL SMM API GATEWAY</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">External SMM API Providers Integration</h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Connect third-party SMM providers (JustAnotherPanel, Peakerr, SMMKings, or any custom API). 
                    When clients order on this panel, our backend automatically forwards the request to the upstream provider via SMM v2 protocol, retrieves external Order IDs, and monitors status.
                  </p>
                </div>
              </div>
            </div>

            {/* Connect New Provider Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#ff5a1f]" />
                <span>Connect New External SMM Provider</span>
              </h3>

              <form onSubmit={handleAddProvider} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Provider Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Peakerr HQ or JustAnotherPanel"
                    value={newProvName}
                    onChange={(e) => setNewProvName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">API v2 URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://provider.com/api/v2"
                    value={newProvUrl}
                    onChange={(e) => setNewProvUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Provider API Key</label>
                  <input
                    type="password"
                    required
                    placeholder="Secret API key from provider"
                    value={newProvKey}
                    onChange={(e) => setNewProvKey(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestProvider(newProvUrl, newProvKey)}
                    disabled={testingProv || !newProvUrl || !newProvKey}
                    className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    title="Test API Key & Balance before saving"
                  >
                    {testingProv ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Test API'}
                  </button>
                  <button
                    type="submit"
                    disabled={addingProv}
                    className="flex-1 py-2 px-4 rounded-lg bg-[#ff5a1f] hover:bg-[#e04810] text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {addingProv ? 'Saving...' : 'Add Provider'}
                  </button>
                </div>
              </form>

              {/* Test result feedback banner */}
              {testResult && (
                <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
                  testResult.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Info className="w-4 h-4 text-amber-600" />}
                    <span>{testResult.message}</span>
                    {testResult.balance !== undefined && (
                      <strong className="font-mono text-emerald-700">Balance: ${testResult.balance} {testResult.currency}</strong>
                    )}
                  </div>
                  <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
                </div>
              )}
            </div>

            {/* Connected Providers List */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Active External Provider Connections ({providerList.length})</h3>
                <span className="text-xs font-mono text-slate-500">Automatic SMM v2 Handshake</span>
              </div>

              <div className="divide-y divide-slate-100">
                {providerList.map((prov) => (
                  <div key={prov.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h4 className="text-sm font-bold text-slate-900">{prov.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                          Auto-Forwarding: ON
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                        <span>API URL: <code className="text-[#ff5a1f] font-bold">{prov.apiUrl}</code></span>
                        <span>Key: <code className="text-slate-700">••••••••••••{prov.apiKey.slice(-4)}</code></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Provider Balance</p>
                        <p className="text-sm font-mono font-bold text-emerald-600">
                          ${prov.balance !== undefined ? Number(prov.balance).toFixed(2) : '100.00'} USD
                        </p>
                      </div>

                      <button
                        onClick={() => handleTestProvider(prov.apiUrl, prov.apiKey)}
                        disabled={testingProv}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Test Connection"
                      >
                        <Play className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProvider(prov.id)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Provider"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. SUB-TAB: ADD FUNDS */}
        {/* ========================================================================= */}
        {subTab === 'add-funds' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Deposit Funds to Wallet</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instant automatic crediting. Support for JazzCash, Easypaisa, Crypto, Cards and PayPal.
                </p>
              </div>

              {depositSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">{depositSuccess}</span>
                </div>
              )}

              {/* Payment Gateway Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  1. Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { name: 'JazzCash / Easypaisa (PKR)', icon: '🇵🇰', desc: 'Instant mobile account transfer' },
                    { name: 'USDT (TRC-20) [5% Bonus]', icon: '⚡', desc: 'Instant crypto deposit + 5% bonus' },
                    { name: 'Credit / Debit Card (Stripe)', icon: '💳', desc: 'Visa, Mastercard, UnionPay' },
                    { name: 'Binance Pay / Cryptos', icon: '🪙', desc: 'BTC, ETH, SOL, BNB' },
                    { name: 'PayPal (Global)', icon: '🌐', desc: 'Instant PayPal balance checkout' },
                    { name: 'Bank Transfer (IBFT)', icon: '🏦', desc: 'All Pakistani Banks automated' }
                  ].map((gateway) => (
                    <div
                      key={gateway.name}
                      onClick={() => setDepositMethod(gateway.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        depositMethod === gateway.name
                          ? 'bg-orange-50/70 border-[#ff5a1f] shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                        <span>{gateway.icon}</span>
                        <span>{gateway.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{gateway.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Enter Deposit Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="deposit-amount-input"
                    type="number"
                    min={5}
                    max={5000}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                  />
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  {[10, 25, 50, 100, 250, 500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDepositAmount(val)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mono font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Deposit Amount:</span>
                  <span className="font-mono text-slate-900 font-bold">${Number(depositAmount ?? 0).toFixed(2)}</span>
                </div>
                {depositBonus > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>5% Crypto Bonus:</span>
                    <span className="font-mono">+${Number(depositBonus ?? 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Amount Credited:</span>
                  <span className="font-mono text-emerald-700">${Number(totalCredited ?? 0).toFixed(2)}</span>
                </div>
              </div>

              <button
                id="confirm-deposit-btn"
                onClick={handleDeposit}
                disabled={depositLoading || depositAmount <= 0}
                className="w-full py-3 px-4 rounded-lg bg-[#ff5a1f] hover:bg-[#e04810] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {depositLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Instant Deposit...</span>
                  </>
                ) : (
                  <>
                    <span>Pay & Add ${Number(totalCredited ?? 0).toFixed(2)} to Balance</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

            {/* Right Deposit Rules & Crypto Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Deposit Instructions</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <li>• Minimum deposit is $5.00 (PKR 1,400) across all payment methods.</li>
                  <li>• USDT (TRC-20) payments receive an automatic 5% top-up bonus.</li>
                  <li>• JazzCash & Easypaisa payments are confirmed within 1-5 minutes automatically.</li>
                  <li>• For WhatsApp manual confirmation, click the floating WhatsApp button.</li>
                </ul>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4">
                  <p className="text-[11px] font-bold text-slate-700 mb-1">Local Manual Deposit Account:</p>
                  <div className="text-xs text-slate-800 space-y-1 font-mono">
                    <p>JazzCash: <strong>0300-1234567</strong></p>
                    <p>Easypaisa: <strong>0345-7654321</strong></p>
                    <p>Title: <strong>SMM ZIVO OFFICIAL</strong></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. SUB-TAB: API KEY MANAGEMENT */}
        {/* ========================================================================= */}
        {subTab === 'api-key' && (
          <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Your Reseller API Credentials</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Use this key to authenticate your scripts, Telegram bots, or reseller panels with SMM ZIVO API v2.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Active API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={user.apiKey}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyApiKey}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Regenerate Key</p>
                <p className="text-[11px] text-slate-500">Invalidates the current key immediately</p>
              </div>
              <button
                onClick={handleRegenerateKey}
                disabled={generatingKey}
                className="px-3.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {generatingKey ? 'Generating...' : 'Generate New Key'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 space-y-2 text-xs">
              <p className="font-mono text-[#ff5a1f] font-bold">Standard SMM API v2 Quick Command:</p>
              <pre className="text-[11px] text-emerald-400 overflow-x-auto p-2 bg-slate-900 rounded font-mono">
                curl -X POST "{typeof window !== 'undefined' ? window.location.origin : ''}/api/v2" -d "key={user.apiKey}" -d "action=balance"
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
