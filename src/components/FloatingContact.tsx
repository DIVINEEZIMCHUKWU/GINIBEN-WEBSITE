import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { CompanyConfig } from '../types';

interface FloatingContactProps {
  company: CompanyConfig;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ company }) => {
  const cleanPhone = company.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = company.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <aside 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto"
      aria-label="Direct Quick Contact Options"
    >
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${cleanWhatsApp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#22c55e] text-[#12100d] shadow-xl shadow-black/40 hover:bg-[#4ade80] hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        aria-label="Contact GiniBen Lead Consultant on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
        
        {/* Tooltip Label on Hover (Desktop) */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#1a1612] border border-[#c2a67e]/40 text-xs font-mono font-semibold text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg hidden sm:block">
          WhatsApp: {company.whatsappNumber}
        </span>
      </a>

      {/* Direct Phone Call Floating Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="group relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#c2a67e] text-[#12100d] shadow-xl shadow-black/40 hover:bg-[#d9c2a3] hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        aria-label="Call GiniBen Direct Line"
        title="Call Telephone Line"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />

        {/* Tooltip Label on Hover (Desktop) */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#1a1612] border border-[#c2a67e]/40 text-xs font-mono font-semibold text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg hidden sm:block">
          Call: {company.phone}
        </span>
      </a>
    </aside>
  );
};
