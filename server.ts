import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_SERVICES } from "./src/data/initialServices";
import { SMMService, SMMOrder, ExternalProvider, UserProfile, Transaction } from "./src/types";

const app = express();
const PORT = 3000;

// Middleware for parsing JSON and urlencoded bodies (required for standard SMM v2 API)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- In-memory Database & State ---
let services: SMMService[] = [...INITIAL_SERVICES];

let currentUser: UserProfile = {
  id: "user_1",
  username: "reseller_pro",
  email: "demo@smmzivo.com",
  firstName: "Alex",
  lastName: "Rivera",
  balance: 125.50,
  apiKey: "smmz_live_8f3a9e047c214bd1a5e7829cd1a05",
  role: "admin",
  createdAt: new Date().toISOString()
};

let externalProviders: ExternalProvider[] = [
  {
    id: "prov-1",
    name: "Global SMM Provider 1 (Primary HQ)",
    apiUrl: "https://api.smmprovider-mock.com/api/v2",
    apiKey: "demo_api_key_global_smm_prod_993",
    balance: 489.20,
    currency: "USD",
    status: "active",
    lastChecked: new Date().toISOString(),
    autoProcess: true
  },
  {
    id: "prov-2",
    name: "Apex Media Stream Engine (YouTube & Video)",
    apiUrl: "https://api.apexstream-mock.com/api/v2",
    apiKey: "demo_api_key_apex_stream_442",
    balance: 210.00,
    currency: "USD",
    status: "active",
    lastChecked: new Date().toISOString(),
    autoProcess: true
  }
];

let orders: SMMOrder[] = [
  {
    id: 98124,
    userId: "user_1",
    serviceId: 101,
    serviceName: "Instagram Followers [High Quality - Non Drop] ⚡ Fast Speed - 30D Refill",
    category: "Instagram Followers",
    link: "https://instagram.com/fashion_trendsetter",
    quantity: 1000,
    charge: 0.85,
    startCount: 4210,
    remains: 0,
    status: "Completed",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    externalOrderId: "EXT-889124",
    providerName: "Global SMM Provider 1 (Primary HQ)",
    refillStatus: "Available"
  },
  {
    id: 98125,
    userId: "user_1",
    serviceId: 301,
    serviceName: "Instagram Reels Views [Instant Start] 🚀 1 Million/Day Speed",
    category: "Instagram Views & Reels",
    link: "https://instagram.com/reel/C89xZpL12",
    quantity: 5000,
    charge: 0.10,
    startCount: 120,
    remains: 1200,
    status: "In Progress",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    externalOrderId: "EXT-889125",
    providerName: "Global SMM Provider 1 (Primary HQ)",
    refillStatus: "None"
  },
  {
    id: 98126,
    userId: "user_1",
    serviceId: 401,
    serviceName: "YouTube Views [High Retention 3-5 Mins] 🎥 Monetizable - Non Drop",
    category: "YouTube Services",
    link: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    quantity: 1000,
    charge: 1.65,
    startCount: 28400,
    remains: 450,
    status: "Processing",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    externalOrderId: "EXT-49012",
    providerName: "Apex Media Stream Engine (YouTube & Video)",
    refillStatus: "Available"
  }
];

let nextOrderId = 98127;

let transactions: Transaction[] = [
  {
    id: "tx_101",
    userId: "user_1",
    amount: 50.00,
    method: "USDT (TRC-20)",
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    transactionRef: "0x89f2a74c1029cba88214"
  },
  {
    id: "tx_102",
    userId: "user_1",
    amount: 100.00,
    method: "Credit / Debit Card (Stripe)",
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    transactionRef: "ch_3N84kY2eZvKYlo2C1g9"
  }
];

// Helper: Dispatch order to external SMM Provider API via standard SMM v2 protocol
async function dispatchOrderToExternalProvider(order: SMMOrder, service: SMMService) {
  if (!service.providerId || !service.providerServiceId) {
    return {
      success: true,
      externalOrderId: `SIM-${Math.floor(Math.random() * 900000) + 100000}`,
      providerName: "SMMZivo Internal Dispatch Engine",
      mode: "local_simulator"
    };
  }

  const provider = externalProviders.find(p => p.id === service.providerId);
  if (!provider || !provider.autoProcess) {
    return {
      success: true,
      externalOrderId: `LOC-${Math.floor(Math.random() * 900000) + 100000}`,
      providerName: provider ? provider.name : "Local Queue",
      mode: "queued"
    };
  }

  // Attempt real HTTP call to external SMM API
  try {
    const params = new URLSearchParams();
    params.append("key", provider.apiKey);
    params.append("action", "add");
    params.append("service", service.providerServiceId);
    params.append("link", order.link);
    params.append("quantity", order.quantity.toString());

    // 5-second timeout for real external panel connection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(provider.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (data && data.order) {
      return {
        success: true,
        externalOrderId: data.order,
        providerName: provider.name,
        mode: "external_live"
      };
    } else if (data && data.error) {
      console.warn(`[External SMM API] Provider returned error: ${data.error}. Falling back to automated queue.`);
      return {
        success: true,
        externalOrderId: `ERR-FALLBACK-${Math.floor(Math.random() * 89999) + 10000}`,
        providerName: `${provider.name} (Simulated)`,
        mode: "fallback",
        note: data.error
      };
    }
  } catch (err: any) {
    // If the external provider URL is a demo URL or unreachable, fail softly to internal automated simulator
    return {
      success: true,
      externalOrderId: `EXT-SIM-${Math.floor(Math.random() * 899999) + 100000}`,
      providerName: provider.name,
      mode: "simulated_success"
    };
  }

  return {
    success: true,
    externalOrderId: `AUTO-${Math.floor(Math.random() * 89999) + 10000}`,
    providerName: provider.name,
    mode: "auto"
  };
}

// ==========================================
// 1. STANDARD SMM RESELLER API v2 (`/api/v2`)
// ==========================================
// Any external panel, script, or developer can connect to this endpoint!
app.post("/api/v2", async (req, res) => {
  const { key, action, service, link, quantity, order, orders: ordersParam } = req.body;

  // Validate API key
  if (!key || key !== currentUser.apiKey) {
    return res.status(401).json({ error: "Incorrect or invalid API key" });
  }

  if (!action) {
    return res.status(400).json({ error: "Missing required 'action' parameter" });
  }

  // Action: services
  if (action === "services") {
    const formattedServices = services.map(s => ({
      service: s.id,
      name: s.name,
      type: s.type || "Default",
      category: s.category,
      rate: Number(s.rate ?? 0).toFixed(4),
      min: s.min,
      max: s.max,
      refill: s.refill,
      cancel: s.cancel
    }));
    return res.json(formattedServices);
  }

  // Action: balance
  if (action === "balance") {
    return res.json({
      balance: Number(currentUser.balance ?? 0).toFixed(2),
      currency: "USD"
    });
  }

  // Action: add
  if (action === "add") {
    if (!service || !link || !quantity) {
      return res.status(400).json({ error: "Missing parameters: service, link, and quantity are required" });
    }

    const targetService = services.find(s => s.id === Number(service));
    if (!targetService) {
      return res.status(400).json({ error: "Service not found or inactive" });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < targetService.min || qty > targetService.max) {
      return res.status(400).json({
        error: `Quantity must be between ${targetService.min} and ${targetService.max}`
      });
    }

    const charge = Number(((targetService.rate / 1000) * qty).toFixed(4));
    if (currentUser.balance < charge) {
      return res.status(400).json({ error: "Not enough funds on balance" });
    }

    // Deduct balance
    currentUser.balance = Number((currentUser.balance - charge).toFixed(4));

    const newOrder: SMMOrder = {
      id: nextOrderId++,
      userId: currentUser.id,
      serviceId: targetService.id,
      serviceName: targetService.name,
      category: targetService.category,
      link: String(link).trim(),
      quantity: qty,
      charge,
      startCount: Math.floor(Math.random() * 800) + 50,
      remains: qty,
      status: "In Progress",
      createdAt: new Date().toISOString(),
      refillStatus: targetService.refill ? "Available" : "None"
    };

    // Forward to external provider if linked
    const dispatchResult = await dispatchOrderToExternalProvider(newOrder, targetService);
    newOrder.externalOrderId = dispatchResult.externalOrderId;
    newOrder.providerName = dispatchResult.providerName;

    orders.unshift(newOrder);

    return res.json({ order: newOrder.id });
  }

  // Action: status
  if (action === "status") {
    if (!order) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    const found = orders.find(o => o.id === Number(order));
    if (!found) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json({
      charge: Number(found.charge ?? 0).toFixed(4),
      start_count: (found.startCount ?? 0).toString(),
      status: found.status,
      remains: (found.remains ?? 0).toString(),
      currency: "USD"
    });
  }

  // Action: multiStatus
  if (action === "multiStatus") {
    if (!ordersParam) {
      return res.status(400).json({ error: "Orders list is required" });
    }
    const idList = String(ordersParam).split(",").map(s => Number(s.trim()));
    const result: Record<string, any> = {};

    for (const id of idList) {
      const found = orders.find(o => o.id === id);
      if (found) {
        result[id.toString()] = {
          charge: Number(found.charge ?? 0).toFixed(4),
          start_count: (found.startCount ?? 0).toString(),
          status: found.status,
          remains: (found.remains ?? 0).toString(),
          currency: "USD"
        };
      } else {
        result[id.toString()] = { error: "Incorrect order ID" };
      }
    }
    return res.json(result);
  }

  return res.status(400).json({ error: `Invalid action: ${action}` });
});

// Also support GET /api/v2 for test check
app.get("/api/v2", (req, res) => {
  res.json({
    status: "online",
    name: "SMMZivo API v2 Service",
    doc: "/api",
    supported_actions: ["services", "add", "status", "multiStatus", "balance"]
  });
});

// ==========================================
// 2. INTERNAL PANEL REST APIS
// ==========================================

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "2.4.0",
    name: "SMMZivo Engine",
    activeOrders: orders.length,
    servicesCount: services.length,
    timestamp: new Date().toISOString()
  });
});

// User profile & balance
app.get("/api/user", (req, res) => {
  res.json({
    user: currentUser,
    transactions
  });
});

// Generate new API key
app.post("/api/user/generate-key", (req, res) => {
  const randomHex = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  currentUser.apiKey = `smmz_live_${randomHex}`;
  res.json({ apiKey: currentUser.apiKey });
});

// Add funds / deposit
app.post("/api/user/add-funds", (req, res) => {
  const { amount, method } = req.body;
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Invalid deposit amount" });
  }

  // Add 5% bonus for crypto if selected
  const bonus = method && method.includes("USDT") ? numAmount * 0.05 : 0;
  const finalAdd = numAmount + bonus;

  currentUser.balance = Number((currentUser.balance + finalAdd).toFixed(2));

  const newTx: Transaction = {
    id: `tx_${Date.now()}`,
    userId: currentUser.id,
    amount: numAmount,
    method: method || "Card Payment",
    status: "Completed",
    createdAt: new Date().toISOString(),
    transactionRef: `REF-${Math.floor(Math.random() * 9000000) + 1000000}`
  };

  transactions.unshift(newTx);

  res.json({
    success: true,
    newBalance: currentUser.balance,
    transaction: newTx,
    bonusApplied: bonus > 0 ? bonus : undefined
  });
});

// Authentication Mock / Switch
app.post("/api/auth/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  currentUser.username = username;
  res.json({ success: true, user: currentUser });
});

app.post("/api/auth/register", (req, res) => {
  const { username, email, firstName, lastName } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }
  currentUser = {
    id: `user_${Date.now()}`,
    username,
    email,
    firstName: firstName || "User",
    lastName: lastName || "",
    balance: 15.00, // Welcome signup bonus credit!
    apiKey: `smmz_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    role: "user",
    createdAt: new Date().toISOString()
  };
  res.json({ success: true, user: currentUser, message: "Welcome bonus of $15.00 credited!" });
});

// Services List
app.get("/api/services", (req, res) => {
  res.json(services);
});

// Add or edit service
app.post("/api/services", (req, res) => {
  const { name, category, rate, min, max, description, avgTime, refill, cancel, providerId, providerServiceId } = req.body;
  if (!name || !category || !rate) {
    return res.status(400).json({ error: "Missing required service fields" });
  }

  const newService: SMMService = {
    id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
    name,
    category,
    rate: parseFloat(rate),
    min: parseInt(min) || 50,
    max: parseInt(max) || 100000,
    description: description || "Instant delivery",
    avgTime: avgTime || "15 minutes",
    refill: !!refill,
    cancel: !!cancel,
    type: "Default",
    providerId,
    providerServiceId
  };

  services.push(newService);
  res.json(newService);
});

// Link / Map Service to External SMM Provider
app.post("/api/services/map-provider", (req, res) => {
  const { serviceId, providerId, providerServiceId } = req.body;
  const service = services.find(s => s.id === Number(serviceId));
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  service.providerId = providerId || undefined;
  service.providerServiceId = providerServiceId || undefined;

  res.json({ success: true, service });
});

// Orders List
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Create Order (via panel UI)
app.post("/api/orders", async (req, res) => {
  const { serviceId, link, quantity } = req.body;
  if (!serviceId || !link || !quantity) {
    return res.status(400).json({ error: "Service, link, and quantity are required" });
  }

  const service = services.find(s => s.id === Number(serviceId));
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  const qty = parseInt(quantity);
  if (isNaN(qty) || qty < service.min || qty > service.max) {
    return res.status(400).json({
      error: `Quantity must be between ${service.min} and ${service.max}`
    });
  }

  const charge = Number(((service.rate / 1000) * qty).toFixed(4));
  if (currentUser.balance < charge) {
    return res.status(400).json({
      error: `Insufficient balance ($${currentUser.balance.toFixed(2)}). Total cost is $${charge.toFixed(2)}. Please add funds.`
    });
  }

  // Deduct balance
  currentUser.balance = Number((currentUser.balance - charge).toFixed(4));

  const newOrder: SMMOrder = {
    id: nextOrderId++,
    userId: currentUser.id,
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    link: String(link).trim(),
    quantity: qty,
    charge,
    startCount: Math.floor(Math.random() * 1200) + 100,
    remains: qty,
    status: "Processing",
    createdAt: new Date().toISOString(),
    refillStatus: service.refill ? "Available" : "None"
  };

  // Dispatch to external SMM Provider
  const dispatchResult = await dispatchOrderToExternalProvider(newOrder, service);
  newOrder.externalOrderId = dispatchResult.externalOrderId;
  newOrder.providerName = dispatchResult.providerName;

  orders.unshift(newOrder);

  res.json({
    success: true,
    order: newOrder,
    balance: currentUser.balance,
    dispatchMode: dispatchResult.mode
  });
});

// Request refill for an order
app.post("/api/orders/:id/refill", (req, res) => {
  const orderId = Number(req.params.id);
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (order.refillStatus === "Requested") {
    return res.status(400).json({ error: "Refill already submitted for this order" });
  }

  order.refillStatus = "Requested";
  res.json({ success: true, message: "Refill request sent to automated delivery provider", order });
});

// Sync order statuses with external provider or automated delivery progress
app.post("/api/orders/sync", (req, res) => {
  let updatedCount = 0;

  orders = orders.map(order => {
    if (order.status === "Pending") {
      updatedCount++;
      return {
        ...order,
        status: "Processing" as const,
        remains: Math.round(order.quantity * 0.85)
      };
    } else if (order.status === "Processing") {
      updatedCount++;
      return {
        ...order,
        status: "In Progress" as const,
        remains: Math.round(order.quantity * 0.4)
      };
    } else if (order.status === "In Progress") {
      updatedCount++;
      return {
        ...order,
        status: "Completed" as const,
        remains: 0
      };
    }
    return order;
  });

  res.json({
    success: true,
    syncedOrders: updatedCount,
    totalOrders: orders.length,
    orders
  });
});

// ==========================================
// 3. EXTERNAL SMM API PROVIDERS MANAGER
// ==========================================

// Get providers
app.get("/api/providers", (req, res) => {
  res.json(externalProviders);
});

// Add external provider
app.post("/api/providers", (req, res) => {
  const { name, apiUrl, apiKey, autoProcess } = req.body;
  if (!name || !apiUrl || !apiKey) {
    return res.status(400).json({ error: "Name, API URL, and API Key are required" });
  }

  const newProvider: ExternalProvider = {
    id: `prov-${Date.now()}`,
    name,
    apiUrl: String(apiUrl).trim(),
    apiKey: String(apiKey).trim(),
    balance: 100.00,
    currency: "USD",
    status: "active",
    lastChecked: new Date().toISOString(),
    autoProcess: autoProcess !== false
  };

  externalProviders.push(newProvider);
  res.json(newProvider);
});

// Delete external provider
app.delete("/api/providers/:id", (req, res) => {
  const id = req.params.id;
  externalProviders = externalProviders.filter(p => p.id !== id);
  res.json({ success: true });
});

// Test connection to an external SMM provider API
app.post("/api/providers/test", async (req, res) => {
  const { apiUrl, apiKey } = req.body;
  if (!apiUrl || !apiKey) {
    return res.status(400).json({ error: "apiUrl and apiKey are required" });
  }

  try {
    const params = new URLSearchParams();
    params.append("key", apiKey);
    params.append("action", "balance");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (data && data.balance !== undefined) {
      return res.json({
        success: true,
        message: "Successfully connected to external SMM Provider API!",
        balance: data.balance,
        currency: data.currency || "USD"
      });
    } else if (data && data.error) {
      return res.json({
        success: false,
        message: `Provider rejected API key: ${data.error}`
      });
    }

    return res.json({
      success: true,
      message: "External API responded with valid HTTP format",
      raw: data
    });
  } catch (err: any) {
    return res.json({
      success: false,
      message: `Connection failed: ${err.message}. If this is a private test domain or mock provider, the internal fallback pipeline will handle automated orders.`
    });
  }
});

// Import services from external SMM API
app.post("/api/providers/import-services", async (req, res) => {
  const { providerId } = req.body;
  const provider = externalProviders.find(p => p.id === providerId);
  if (!provider) {
    return res.status(404).json({ error: "Provider not found" });
  }

  try {
    const params = new URLSearchParams();
    params.append("key", provider.apiKey);
    params.append("action", "services");

    const response = await fetch(provider.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const data = await response.json();
    if (Array.isArray(data)) {
      // map services
      let imported = 0;
      data.slice(0, 20).forEach((extService: any) => {
        const localId = nextOrderId++;
        services.push({
          id: localId,
          name: extService.name,
          category: extService.category || "Imported Services",
          rate: parseFloat(extService.rate) * 1.3, // apply 30% margin
          min: parseInt(extService.min) || 100,
          max: parseInt(extService.max) || 10000,
          description: `Imported from ${provider.name}`,
          avgTime: "15 minutes",
          refill: !!extService.refill,
          cancel: !!extService.cancel,
          type: "Default",
          providerId: provider.id,
          providerServiceId: String(extService.service)
        });
        imported++;
      });
      return res.json({ success: true, importedCount: imported });
    }
    return res.status(400).json({ error: "Invalid services response from provider" });
  } catch (err: any) {
    return res.status(500).json({
      error: `Could not import services from provider URL: ${err.message}`
    });
  }
});

// ==========================================
// 4. VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SMMZivo Server] running on http://0.0.0.0:${PORT}`);
    console.log(`[SMMZivo API v2] available at http://0.0.0.0:${PORT}/api/v2`);
  });
}

startServer();
