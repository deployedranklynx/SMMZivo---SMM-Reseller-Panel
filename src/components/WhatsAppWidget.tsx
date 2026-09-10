import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Hello SMM ZIVO Support! I need assistance with services and orders.');

  const handleSend = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923001234567?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Support Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 p-1 flex items-center justify-center">
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.38 17.06L2.05 21.95L7.05 20.64C8.49 21.5 10.18 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.63 16.14C16.42 16.73 15.58 17.21 14.93 17.35C14.49 17.44 13.91 17.51 12.01 16.72C9.57 15.72 8 13.25 7.88 13.09C7.76 12.93 6.9 11.78 6.9 10.59C6.9 9.4 7.51 8.81 7.75 8.57C7.99 8.33 8.32 8.22 8.54 8.22C8.69 8.22 8.83 8.23 8.95 8.24C9.25 8.25 9.4 8.27 9.6 8.75C9.84 9.34 10.42 10.78 10.49 10.93C10.56 11.08 10.63 11.28 10.53 11.48C10.43 11.68 10.35 11.77 10.2 11.94C10.05 12.11 9.91 12.24 9.75 12.42C9.58 12.59 9.41 12.78 9.6 13.11C9.79 13.44 10.45 14.52 11.43 15.39C12.69 16.51 13.71 16.87 14.07 17.02C14.43 17.17 14.65 17.13 14.86 16.89C15.07 16.65 15.77 15.83 16.01 15.47C16.25 15.11 16.49 15.17 16.82 15.29C17.15 15.41 18.91 16.28 19.27 16.46C19.63 16.64 19.87 16.73 19.96 16.88C20.05 17.03 20.05 17.65 16.63 16.14Z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">SMM ZIVO Official Support</h4>
                <p className="text-[11px] text-white/90">Typically replies instantly ⚡</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#ece5dd]/40 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-slate-100 text-xs text-slate-700">
              <p className="font-semibold text-slate-900 mb-1">Hi there! 👋</p>
              <p>Welcome to <strong>SMM ZIVO</strong>. Need help choosing a service, checking your order, or depositing funds?</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-600 block">Your Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#25D366] text-slate-800 resize-none bg-white"
                placeholder="Type your message here..."
              />
            </div>

            <button
              onClick={handleSend}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Circle Trigger Button (Matching Screenshot) */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative group"
        title="Chat with SMM ZIVO on WhatsApp"
        aria-label="WhatsApp Support"
      >
        <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.57 14.34C16.32 14.21 15.1 13.61 14.87 13.53C14.64 13.44 14.48 13.4 14.31 13.65C14.15 13.9 13.68 14.45 13.54 14.61C13.4 14.77 13.26 14.79 13.01 14.67C12.76 14.54 11.96 14.28 11.01 13.43C10.27 12.77 9.77 11.96 9.63 11.71C9.49 11.46 9.61 11.33 9.74 11.2C9.85 11.09 9.99 10.91 10.11 10.77C10.23 10.63 10.27 10.53 10.35 10.36C10.43 10.2 10.39 10.05 10.33 9.93C10.27 9.81 9.78 8.6 9.57 8.11C9.37 7.62 9.17 7.69 9.01 7.68C8.87 7.67 8.7 7.67 8.54 7.67C8.38 7.67 8.11 7.73 7.89 7.97C7.66 8.22 7.03 8.81 7.03 10.01C7.03 11.21 7.91 12.37 8.03 12.53C8.15 12.69 9.75 15.16 12.21 16.22C12.8 16.47 13.25 16.62 13.61 16.74C14.2 16.93 14.74 16.9 15.17 16.84C15.65 16.77 16.63 16.24 16.84 15.67C17.04 15.1 17.04 14.61 16.98 14.51C16.92 14.41 16.81 14.34 16.57 14.34Z" />
        </svg>

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center p-[2px]">
          <span className="w-full h-full bg-emerald-500 rounded-full animate-ping"></span>
        </span>
      </button>
    </div>
  );
};
