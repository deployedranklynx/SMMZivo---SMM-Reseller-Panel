export interface SMMService {
  id: number;
  name: string;
  category: string;
  rate: number; // rate per 1000 in USD
  min: number;
  max: number;
  description: string;
  avgTime: string;
  refill: boolean;
  cancel: boolean;
  type: string;
  providerId?: string; // external provider ID if linked
  providerServiceId?: string; // external provider's service ID
}

export type OrderStatus = 'Pending' | 'In Progress' | 'Processing' | 'Completed' | 'Partial' | 'Canceled';

export interface SMMOrder {
  id: number;
  userId: string;
  serviceId: number;
  serviceName: string;
  category: string;
  link: string;
  quantity: number;
  charge: number;
  startCount: number;
  remains: number;
  status: OrderStatus;
  createdAt: string;
  externalOrderId?: string | number;
  providerName?: string;
  refillStatus?: 'Available' | 'Requested' | 'Completed' | 'None';
}

export interface ExternalProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  balance?: number;
  currency?: string;
  status: 'active' | 'inactive' | 'error';
  lastChecked?: string;
  autoProcess: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  apiKey: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: string;
  transactionRef: string;
}

export type ActiveTab = 'home' | 'services' | 'api' | 'signup' | 'terms' | 'dashboard';
export type DashboardSubTab = 'new-order' | 'orders' | 'add-funds' | 'api-key' | 'providers';
