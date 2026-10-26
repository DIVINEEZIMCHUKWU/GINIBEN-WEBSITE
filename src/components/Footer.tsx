import React from 'react';
import { ArrowUp, Facebook, Linkedin, Phone, MessageSquare, ShieldCheck, Globe, Mail, MapPin, Lock } from 'lucide-react';
import { CompanyConfig } from '../types';

interface FooterProps {
  company: CompanyConfig;
  onNavigate: (sectionId: string) => void;
  onOpenPrivacyModal: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  company,
  onNavigate,
  onOpenPrivacyModal,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#f6f2ec] text-stone-700 border-t border-[#c2a67e]/35 pt-16 pb-12 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#c2a67e]/25">
          
          {/* Brand & Slogan Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#c2a67e]/50 bg-white p-1 shadow-sm shrink-0">
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-display font-extrabold text-stone-900 text-lg block leading-snug">
                  GiniBen & Partners
                </span>
                <span className="text-xs font-mono font-bold text-[#8b6b3e] uppercase tracking-wider block">
                  GEOSERVICES LTD
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed max-w-sm">
              Integrated geoscience, mineral exploration, environmental and engineering solutions that transform technical data into informed decisions and sustainable development.
            </p>

            <div className="pt-2 text-xs font-mono font-medium text-[#8b6b3e] space-y-1">
              <div>• Precision Beneath the Surface.</div>
              <div>• Exploring Resources. Unlocking Potential.</div>
              <div>• Data. Depth. Development.</div>
              <div>• Geoscience Meets Investment Confidence.</div>
            </div>

            {/* Social Media Channels */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={company.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white border border-[#c2a67e]/35 hover:border-[#1877F2] text-stone-700 hover:text-[#1877F2] flex items-center justify-center transition-colors shadow-xs"
                title="Follow on Facebook"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={company.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white border border-[#c2a67e]/35 hover:border-[#0A66C2] text-stone-700 hover:text-[#0A66C2] flex items-center justify-center transition-colors shadow-xs"
                title="Connect on LinkedIn"
                aria-label="LinkedIn Company Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${company.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white border border-[#c2a67e]/35 hover:border-[#25D366] text-stone-700 hover:text-[#25D366] flex items-center justify-center transition-colors shadow-xs"
                title="Direct WhatsApp"
                aria-label="WhatsApp Desk"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Practice Areas / Services */}
          <div>
            <h4 className="text-xs font-mono uppercase text-stone-900 font-bold tracking-wider mb-4 border-b border-[#c2a67e]/30 pb-1.5">
              Practice Areas
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#16a34a] transition-colors text-left cursor-pointer">
                  Mineral Resources & Exploration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#16a34a] transition-colors text-left cursor-pointer">
                  Resource Assessment & Advisory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#16a34a] transition-colors text-left cursor-pointer">
                  Environmental & Regulatory Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#16a34a] transition-colors text-left cursor-pointer">
                  Geotechnical & Engineering Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#16a34a] transition-colors text-left cursor-pointer">
                  Hydrogeology & Water Development
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#16a34a] transition-colors text-left cursor-pointer">
                  Geospatial & Topographic Services
                </button>
              </li>
            </ul>
          </div>

          {/* Dedicated Page Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase text-stone-900 font-bold tracking-wider mb-4 border-b border-[#c2a67e]/30 pb-1.5">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#16a34a] transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#16a34a] transition-colors cursor-pointer">
                  About Us (Corporate Profile)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#16a34a] transition-colors cursor-pointer">
                  Technical Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="hover:text-[#16a34a] transition-colors cursor-pointer">
                  Projects & Case Studies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#16a34a] transition-colors cursor-pointer">
                  Fieldwork Gallery & Videos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#16a34a] transition-colors cursor-pointer">
                  Contact Us & Map
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Contact Details & Addresses */}
          <div>
            <h4 className="text-xs font-mono uppercase text-stone-900 font-bold tracking-wider mb-4 border-b border-[#c2a67e]/30 pb-1.5">
              Headquarters & Contacts
            </h4>
            <div className="space-y-3 text-xs text-stone-600">
              <a 
                href={`tel:${company.phone.replace(/[^0-9+]/g, '')}`} 
                className="flex items-center gap-2 hover:text-[#16a34a] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>{company.phone}</span>
              </a>

              <a 
                href={`https://wa.me/${company.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#16a34a] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>WhatsApp: {company.whatsappNumber}</span>
              </a>

              <div className="flex items-start gap-2 text-stone-600">
                <Mail className="w-3.5 h-3.5 text-[#16a34a] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a href="mailto:benukwutevinor@yahoo.com" className="block hover:text-[#16a34a] transition-colors">benukwutevinor@yahoo.com</a>
                  <a href="mailto:gpg1.geoservices@gmail.com" className="block hover:text-[#16a34a] transition-colors">gpg1.geoservices@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-2 text-stone-600 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#8b6b3e] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  2 Leck Avenue, Adjacent State Police Headquarters GRA, Enugu
                </span>
              </div>

              <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>COMEG, NMGS, IAIA · CAMA 1990</span>
              </div>
            </div>
          </div>

        </div>

        {/* Welcome Statement Banner */}
        <div className="py-4 px-6 rounded-2xl bg-white border border-[#c2a67e]/35 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] shrink-0" />
            <span className="font-display font-bold text-stone-900 text-sm sm:text-base tracking-tight">
              Welcome to GPG Ltd Geo-Environmental Excellence since 2005
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-[#8b6b3e] tracking-wider uppercase">
            Precision Geoscience & Infrastructure Engineering
          </span>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={onOpenPrivacyModal}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Privacy Policy & Terms
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                title="Staff & Administrator Portal"
                aria-label="Open Admin Dashboard"
              >
                <Lock className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Admin Portal</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-[#c2a67e]/35 transition-colors cursor-pointer shadow-xs"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
