import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ServicesPage } from './components/ServicesPage';
import { ApiDocPage } from './components/ApiDocPage';
import { SignupPage } from './components/SignupPage';
import { TermsPage } from './components/TermsPage';
import { DashboardPage } from './components/DashboardPage';
import { LoginModal } from './components/LoginModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { INITIAL_SERVICES } from './data/initialServices';
import { ActiveTab, DashboardSubTab, SMMService, SMMOrder, ExternalProvider, UserProfile } from './types';

export default function App() {
  // Sync tab with URL hash if provided
  const getInitialTab = (): ActiveTab => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'services', 'api', 'signup', 'terms', 'dashboard'].includes(hash)) {
        return hash as ActiveTab;
      }
      const pathname = window.location.pathname.replace('/', '').toLowerCase();
      if (['services', 'api', 'signup', 'terms', 'orders', 'dashboard'].includes(pathname)) {
        if (pathname === 'orders') return 'dashboard';
        return pathname as ActiveTab;
      }
    }
    // Default directly to services if user specifically wanted services, or keep home
    return 'services';
  };

  const [activeTab, setActiveTabState] = useState<ActiveTab>(getInitialTab());
  const [dashboardSubTab, setDashboardSubTab] = useState<DashboardSubTab>('new-order');
  
  // Data states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<SMMService[]>(INITIAL_SERVICES);
  const [orders, setOrders] = useState<SMMOrder[]>([]);
  const [providers, setProviders] = useState<ExternalProvider[]>([]);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [detailModalService, setDetailModalService] = useState<SMMService | null>(null);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<SMMService | null>(null);

  // Switch tab and update browser history / hash cleanly
  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#${tab}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch initial data from backend API
  const fetchBackendData = async () => {
    try {
      // 1. Fetch user profile
      const userRes = await fetch('/api/user');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      // 2. Fetch services list
      const servicesRes = await fetch('/api/services');
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        if (Array.isArray(servicesData) && servicesData.length > 0) {
          setServices(servicesData);
        }
      }

      // 3. Fetch orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      // 4. Fetch providers
      const provRes = await fetch('/api/providers');
      if (provRes.ok) {
        const provData = await provRes.json();
        setProviders(provData);
      }
    } catch (err) {
      console.warn('Backend initial fetch fallback to local defaults:', err);
    }
  };

  useEffect(() => {
    fetchBackendData();

    // Listen to hashchange
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'services', 'api', 'signup', 'terms', 'dashboard'].includes(hash)) {
        setActiveTabState(hash as ActiveTab);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleOrderPlaced = (newOrder: SMMOrder, newBalance: number) => {
    setOrders([newOrder, ...orders]);
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  const handleBalanceUpdated = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  const handleSelectServiceToOrder = (service: SMMService) => {
    setSelectedServiceForOrder(service);
    setDashboardSubTab('new-order');
    setActiveTab('dashboard');
  };

  const handleOpenAddFunds = () => {
    setDashboardSubTab('add-funds');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    // Switch to guest demo
    setUser({
      id: 'guest',
      username: 'guest_user',
      email: 'guest@smmzivo.com',
      firstName: 'Guest',
      lastName: 'Visitor',
      balance: 0.00,
      apiKey: 'smmz_guest_key_not_active',
      role: 'user',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-[#ff5a1f] selection:text-white">
      
      {/* Top Banner Notice: Full automated backend working */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-center text-[11px] font-sans flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          <strong className="text-white">SMM ZIVO Automated Reseller Engine Active</strong> • API v2 Standard Live • Direct WhatsApp Support
        </span>
      </div>

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenAddFunds={handleOpenAddFunds}
      />

      {/* Main Page Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            services={services}
            onSelectServiceToOrder={handleSelectServiceToOrder}
          />
        )}

        {activeTab === 'services' && (
          <ServicesPage
            services={services}
            setActiveTab={setActiveTab}
            onSelectServiceToOrder={handleSelectServiceToOrder}
            onOpenDetailModal={(service) => setDetailModalService(service)}
          />
        )}

        {activeTab === 'api' && (
          <ApiDocPage user={user} />
        )}

        {activeTab === 'signup' && (
          <SignupPage
            setActiveTab={setActiveTab}
            onRegisterSuccess={(newUser) => {
              setUser(newUser);
              fetchBackendData();
            }}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'terms' && (
          <TermsPage />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            user={user || {
              id: 'guest',
              username: 'demo_user',
              email: 'demo@smmzivo.com',
              firstName: 'Demo',
              lastName: 'User',
              balance: 25.50,
              apiKey: 'smmz_live_key_998124987',
              role: 'user',
              createdAt: new Date().toISOString()
            }}
            services={services}
            orders={orders}
            providers={providers}
            selectedServiceForOrder={selectedServiceForOrder}
            onRefreshData={fetchBackendData}
            onOrderPlaced={handleOrderPlaced}
            onBalanceUpdated={handleBalanceUpdated}
            onOpenDetailModal={(service) => setDetailModalService(service)}
            defaultSubTab={dashboardSubTab}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Floating WhatsApp Support Widget matching Screenshot */}
      <WhatsAppWidget />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          fetchBackendData();
        }}
        onOpenSignup={() => {
          setIsLoginModalOpen(false);
          setActiveTab('signup');
        }}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={detailModalService}
        onClose={() => setDetailModalService(null)}
        onOrderNow={handleSelectServiceToOrder}
      />

    </div>
  );
}
