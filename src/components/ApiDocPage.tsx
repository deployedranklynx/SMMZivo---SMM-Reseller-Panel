import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Play, 
  Send, 
  Layers, 
  Wallet, 
  RefreshCw, 
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

interface ApiDocPageProps {
  user: UserProfile | null;
}

export const ApiDocPage: React.FC<ApiDocPageProps> = ({ user }) => {
  const [activeCodeLang, setActiveCodeLang] = useState<'curl' | 'python' | 'php' | 'nodejs'>('curl');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Live Console State
  const [consoleAction, setConsoleAction] = useState<'services' | 'balance' | 'status' | 'add'>('balance');
  const [consoleApiKey, setConsoleApiKey] = useState(user ? user.apiKey : 'smmz_live_8f3a9e047c214bd1a5e7829cd1a05');
  const [consoleServiceId, setConsoleServiceId] = useState('101');
  const [consoleLink, setConsoleLink] = useState('https://youtube.com/@channel_link');
  const [consoleQuantity, setConsoleQuantity] = useState('100');
  const [consoleOrderId, setConsoleOrderId] = useState('98124');
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [consoleResponse, setConsoleResponse] = useState<any>(null);

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/v2` : 'https://smmzivo.com/api/v2';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTestApi = async () => {
    setConsoleLoading(true);
    setConsoleResponse(null);

    try {
      const payload: Record<string, any> = {
        key: consoleApiKey,
        action: consoleAction
      };

      if (consoleAction === 'add') {
        payload.service = consoleServiceId;
        payload.link = consoleLink;
        payload.quantity = consoleQuantity;
      } else if (consoleAction === 'status') {
        payload.order = consoleOrderId;
      }

      const res = await fetch('/api/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setConsoleResponse({
        status: res.status,
        ok: res.ok,
        data
      });
    } catch (err: any) {
      setConsoleResponse({
        status: 500,
        ok: false,
        data: { error: err.message || 'Failed to connect to API endpoint' }
      });
    } finally {
      setConsoleLoading(false);
    }
  };

  const codeSnippets = {
    curl: `# Check Account Balance
curl -X POST "${baseUrl}" \\
  -d "key=${consoleApiKey}" \\
  -d "action=balance"

# Place New Automated Order
curl -X POST "${baseUrl}" \\
  -d "key=${consoleApiKey}" \\
  -d "action=add" \\
  -d "service=101" \\
  -d "link=https://youtube.com/@channel" \\
  -d "quantity=1000"`,

    python: `import requests

API_URL = "${baseUrl}"
API_KEY = "${consoleApiKey}"

# 1. Check Balance
res = requests.post(API_URL, data={
    "key": API_KEY,
    "action": "balance"
})
print("Balance:", res.json())

# 2. Place Order
order_res = requests.post(API_URL, data={
    "key": API_KEY,
    "action": "add",
    "service": 101,
    "link": "https://youtube.com/@channel",
    "quantity": 500
})
print("Order Response:", order_res.json())`,

    php: `<?php
$apiUrl = "${baseUrl}";
$apiKey = "${consoleApiKey}";

// Add Order Example
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'key' => $apiKey,
    'action' => 'add',
    'service' => 101,
    'link' => 'https://youtube.com/@channel',
    'quantity' => 1000
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`,

    nodejs: `// Node.js (Fetch API)
const API_URL = "${baseUrl}";
const API_KEY = "${consoleApiKey}";

async function placeOrder() {
  const params = new URLSearchParams();
  params.append("key", API_KEY);
  params.append("action", "add");
  params.append("service", "101");
  params.append("link", "https://youtube.com/@channel");
  params.append("quantity", "1000");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  const data = await response.json();
  console.log("Order placed:", data);
}

placeOrder();`
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff5a1f] mb-1">
            <Code2 className="w-4 h-4" />
            <span>DEVELOPER & RESELLER API v2</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">API Documentation & Integration</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Standard SMM Provider API v2 specification. Compatible with PerfectPanel, SmartPanel, RentPanel, WordPress, Telegram Bots, and any custom SMM software.
          </p>
        </div>

        {/* General Specs Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-1">HTTP Method</h3>
            <p className="text-xl font-bold font-mono text-emerald-600">POST</p>
            <p className="text-xs text-slate-500 mt-1">Accepts application/x-www-form-urlencoded and JSON</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-1">API Endpoint URL</h3>
            <div className="flex items-center justify-between">
              <code className="text-xs font-mono text-[#ff5a1f] font-bold truncate">{baseUrl}</code>
              <button
                onClick={() => copyToClipboard(baseUrl, 'url')}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Copy URL"
              >
                {copiedSection === 'url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Direct high-speed automated routing</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-1">Response Format</h3>
            <p className="text-xl font-bold font-mono text-blue-600">JSON</p>
            <p className="text-xs text-slate-500 mt-1">Standard SMM v2 key-value response objects</p>
          </div>
        </div>

        {/* Interactive Live API Console */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#ff5a1f]" />
                <h2 className="text-lg font-bold text-slate-900">Live Interactive API Console</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Send live HTTP requests directly to our backend server and verify responses in real time.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Live Server Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Controls */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* API Key */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your API Key (<code className="text-[#ff5a1f]">key</code>)
                </label>
                <input
                  type="text"
                  value={consoleApiKey}
                  onChange={(e) => setConsoleApiKey(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              {/* Action selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Action (<code className="text-[#ff5a1f]">action</code>)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['balance', 'services', 'status', 'add'] as const).map((act) => (
                    <button
                      key={act}
                      onClick={() => setConsoleAction(act)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        consoleAction === act
                          ? 'bg-[#ff5a1f] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional inputs */}
              {consoleAction === 'add' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Service ID</label>
                    <input
                      type="number"
                      value={consoleServiceId}
                      onChange={(e) => setConsoleServiceId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Link</label>
                    <input
                      type="text"
                      value={consoleLink}
                      onChange={(e) => setConsoleLink(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={consoleQuantity}
                      onChange={(e) => setConsoleQuantity(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>
              )}

              {consoleAction === 'status' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Order ID</label>
                  <input
                    type="number"
                    value={consoleOrderId}
                    onChange={(e) => setConsoleOrderId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                  />
                </div>
              )}

              <button
                onClick={handleTestApi}
                disabled={consoleLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#ff5a1f] hover:bg-[#e04810] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>{consoleLoading ? 'Sending HTTP Request...' : 'Send Live API Request'}</span>
              </button>

            </div>

            {/* Response Console */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Live JSON Response</span>
                {consoleResponse && (
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                    consoleResponse.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    HTTP {consoleResponse.status}
                  </span>
                )}
              </div>
              <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-auto max-h-72">
                {consoleLoading ? (
                  <div className="flex items-center gap-2 text-slate-400 py-10 justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#ff5a1f]" />
                    <span>Communicating with SMM ZIVO API Engine...</span>
                  </div>
                ) : consoleResponse ? (
                  <pre className="text-[11px] leading-relaxed">
                    {JSON.stringify(consoleResponse.data, null, 2)}
                  </pre>
                ) : (
                  <div className="text-slate-500 py-12 text-center text-[11px]">
                    Click "Send Live API Request" to test endpoint live.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Code Snippets Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Integration Code Samples</h3>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {(['curl', 'python', 'php', 'nodejs'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveCodeLang(lang)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                    activeCodeLang === lang
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
              {codeSnippets[activeCodeLang]}
            </pre>
            <button
              onClick={() => copyToClipboard(codeSnippets[activeCodeLang], 'code')}
              className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Copy Code"
            >
              {copiedSection === 'code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
