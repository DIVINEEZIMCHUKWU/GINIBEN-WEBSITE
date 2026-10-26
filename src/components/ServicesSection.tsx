import React, { useState } from 'react';
import { ArrowUpRight, Check, X, Layers, Compass, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForConsultation: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForConsultation
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section 
      id="services"
      className="relative py-28 lg:py-36 bg-white text-stone-900 border-t border-[#c2a67e]/20"
      aria-label="Our Core Technical Services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Spacious Airy Composition */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9c7a4e] uppercase tracking-wider mb-3 font-semibold">
            <Layers className="w-4 h-4 text-[#22c55e]" />
            <span>Core Practice Areas</span>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span>Disciplined Methodology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-tight [text-wrap:balance]">
            Precision Geoscience & <span className="text-[#16a34a]">Engineering Services</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-600 mt-4 leading-relaxed font-normal">
            Delivering data-driven investigations, exploration campaigns, and advisory services that de-risk capital investment and guarantee technical defensibility.
          </p>
        </div>

        {/* Editorial Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-3xl overflow-hidden border border-[#c2a67e]/35 bg-white flex flex-col justify-between hover:border-[#22c55e] hover:shadow-xl hover:shadow-[#9c7a4e]/10 transition-all duration-300"
            >
              {/* Image Preview Header */}
              <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                <img
                  src={service.featuredImage}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                
                {/* Numeric Code Pill */}
                <span className="absolute top-4 left-4 text-xs font-mono font-bold text-stone-900 px-3 py-1 rounded-lg bg-white/95 border border-[#c2a67e]/40 shadow-sm backdrop-blur-md">
                  {service.numericCode}
                </span>
              </div>

              {/* Service Meta & Description */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#16a34a] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs font-mono text-[#9c7a4e] mt-1 uppercase font-semibold">
                    {service.tagline}
                  </p>

                  <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Scope Preview List */}
                <div className="pt-4 border-t border-[#c2a67e]/20 space-y-2 text-xs text-stone-700">
                  <div className="text-[11px] font-mono text-[#9c7a4e] uppercase font-bold">Key Technical Focus:</div>
                  {service.methodsAndDeliverables.slice(0, 3).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#c2a67e]/20 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-xs font-semibold text-[#9c7a4e] hover:text-stone-900 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Full Technical Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectServiceForConsultation(service.title)}
                    className="text-xs font-bold text-[#15803d] hover:text-[#16a34a] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Book Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full Scope Modal Reader */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#c2a67e]/40 p-6 sm:p-10 text-stone-900 shadow-2xl space-y-6">
            
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close Service Scope"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-xs font-mono text-[#16a34a] uppercase font-bold tracking-wider">
                {selectedService.numericCode} · Technical Scope
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 mt-1">
                {selectedService.title}
              </h3>
              <p className="text-xs font-mono text-[#9c7a4e] mt-1">
                {selectedService.tagline}
              </p>
            </div>

            <div className="h-56 rounded-2xl overflow-hidden border border-[#c2a67e]/30">
              <img
                src={selectedService.featuredImage}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {selectedService.description}
            </p>

            {/* Scope Bulleted List */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-[#9c7a4e] uppercase font-bold tracking-wider">
                Methodological Scope & Deliverables
              </h4>
              <div className="space-y-2.5">
                {selectedService.methodsAndDeliverables.map((deliv: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#faf9f6] border border-[#c2a67e]/25 text-xs sm:text-sm text-stone-800">
                    <Check className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#c2a67e]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-stone-500">
                Ready to deploy this capability for your site?
              </span>
              <button
                onClick={() => {
                  const title = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForConsultation(title);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#15803d] hover:bg-[#16a34a] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Request Scope & Proposal
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
