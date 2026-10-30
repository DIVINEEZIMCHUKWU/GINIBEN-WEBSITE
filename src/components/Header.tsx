import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, MessageSquare } from 'lucide-react';
import { CompanyConfig } from '../types';

interface HeaderProps {
  company: CompanyConfig;
  currentPage: string;
  onNavigate: (pageId: string) => void;
  onOpenConsultation: () => void;
  onOpenAdmin?: () => void;
  isAdminOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  company,
  currentPage,
  onNavigate,
  onOpenConsultation,
  isAdminOpen = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleConsultationClick = () => {
    onOpenConsultation();
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled
          ? 'glass-nav py-2.5 sm:py-3 shadow-md shadow-[#9c7a4e]/10'
          : 'bg-white/98 backdrop-blur-md border-b border-[#c2a67e]/30 py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          
          {/* Zone 1: Brand Wordmark + Logo */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 sm:gap-3 group text-left min-w-0 shrink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] rounded-lg p-0.5 cursor-pointer"
            aria-label={`${company.name} Home`}
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[#c2a67e]/45 shadow-xs bg-[#faf9f6] shrink-0">
              <img
                src={company.logoUrl || '/logo.jpg'}
                alt="GiniBen & Partners Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/logo.jpg';
                }}
              />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-display font-bold text-stone-900 text-sm sm:text-base tracking-tight group-hover:text-[#16a34a] transition-colors leading-tight truncate">
                GiniBen & Partners
              </span>
              <span className="text-[9px] sm:text-[11px] font-mono tracking-wider text-[#9c7a4e] uppercase font-semibold">
                GEOSERVICES LTD
              </span>
            </div>
          </button>

          {/* Zone 2: Dedicated Desktop Navigation Links */}
          <nav 
            className="hidden lg:flex items-center gap-7 xl:gap-8 text-[14px] font-medium text-stone-700"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = currentPage === link.id && !isAdminOpen;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer hover:text-[#16a34a] ${
                    isActive ? 'text-[#16a34a] font-bold' : 'text-stone-700'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#16a34a] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Book Consultation Button + Mobile Menu Icon (Properly aligned with no Admin button) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Book Consultation Button (Accessible on all screen sizes) */}
            <button
              onClick={handleConsultationClick}
              className="h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm font-bold text-white bg-[#16a34a] hover:bg-[#15803d] active:scale-95 transition-all rounded-xl shadow-xs hover:shadow-md flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"
              aria-label="Book Technical Consultation"
            >
              <span className="inline">Book Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </button>

            {/* Mobile Menu Hamburger / Close Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#faf7f2] hover:bg-[#f3ede3] active:bg-[#e8ded1] border border-[#c2a67e]/40 text-stone-800 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-stone-800" />
              ) : (
                <Menu className="w-5 h-5 text-stone-800" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation (Completely Mobile Responsive) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#c2a67e]/30 px-4 pt-3.5 pb-5 mt-2.5 shadow-2xl space-y-3.5 max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id && !isAdminOpen;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#16a34a]/12 text-[#16a34a] font-bold border border-[#16a34a]/30'
                      : 'text-stone-700 bg-[#faf7f2] hover:bg-[#f3ede3] border border-[#c2a67e]/20'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />}
                </button>
              );
            })}
          </div>

          {/* Action Row Inside Drawer */}
          <div className="pt-2 border-t border-[#c2a67e]/25 space-y-2">
            <button
              onClick={handleConsultationClick}
              className="w-full py-3 px-4 text-center text-xs sm:text-sm font-bold text-white bg-[#16a34a] hover:bg-[#15803d] active:scale-98 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Book Technical Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Quick Contact Buttons for Mobile Call & WhatsApp */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${company.phone.replace(/[^0-9+]/g, '')}`}
                className="py-2.5 px-3 rounded-xl bg-[#faf7f2] hover:bg-[#f5efe6] border border-[#c2a67e]/35 text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Call Direct</span>
              </a>

              <a
                href={`https://wa.me/${company.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#22c55e]/15 hover:bg-[#22c55e]/25 border border-[#22c55e]/35 text-xs font-semibold text-stone-900 flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
