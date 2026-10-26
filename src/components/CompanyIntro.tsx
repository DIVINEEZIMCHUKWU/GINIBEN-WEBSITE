import React from 'react';
import { Compass, Eye, Target, Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { CompanyConfig } from '../types';

interface CompanyIntroProps {
  company: CompanyConfig;
  onLearnMore?: () => void;
  onOpenConsultation: () => void;
  showFullVisionAndCompany?: boolean;
}

export const CompanyIntro: React.FC<CompanyIntroProps> = ({
  company,
  onLearnMore,
  onOpenConsultation,
  showFullVisionAndCompany = true
}) => {
  return (
    <section 
      id="about-intro"
      className="relative py-20 lg:py-28 bg-white text-stone-900 border-t border-[#c2a67e]/25 font-sans"
      aria-label="Corporate Overview and Company Profile"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Top Block: Corporate Overview & Visual Anchor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#c2a67e]/35 shadow-xl bg-[#faf7f2]">
              <img
                src="https://i.ibb.co/zHxFmrmt/Whats-App-Image-2026-10-23-at-9-04-34-PM.jpg"
                alt="Dr. Benjamin Ukwuteyinor, PhD - Founder & Lead Consultant"
                className="w-full h-[440px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent pointer-events-none" />

              {/* Float Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-dark-morphism border border-white/25">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#16a34a] flex items-center justify-center text-white font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dr. Benjamin Ukwuteyinor, PhD</h4>
                    <p className="text-xs text-stone-300">Founder & Lead Consultant · COMEG, NMGS, IAIA Certified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-[#c2a67e]/50 rounded-tl-2xl pointer-events-none" />
          </div>

          {/* Right Column: Corporate Overview Prose */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f2ec] border border-[#c2a67e]/35 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider font-semibold self-start">
              <Compass className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Corporate Overview</span>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <span>Scientific Precision</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-tight [text-wrap:balance]">
              Integrated Geoscience & Technical Solutions Across the <span className="text-[#16a34a]">Full Project Lifecycle</span>.
            </h2>

            <div className="space-y-4 text-stone-600 text-base leading-relaxed">
              <p>
                <strong className="text-stone-900 font-bold">{company.name}</strong> is a professional geoscience consulting and contracting firm delivering high-value technical solutions across the mineral resources, infrastructure, environmental, and water sectors.
              </p>

              <p>
                We provide integrated, data-driven services that support resource discovery, project development, environmental compliance, and engineering decision-making. Our expertise spans the full project lifecycle, from exploration and evaluation to development support and regulatory advisory.
              </p>

              <div className="p-5 rounded-2xl bg-[#faf7f2] border-l-4 border-[#16a34a] text-stone-800 text-sm sm:text-base italic font-normal">
                “We operate with precision, technical depth, and strict professional standards to ensure our clients make informed, profitable, and sustainable investment decisions.”
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenConsultation}
                className="px-6 py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm transition-all shadow-md shadow-[#16a34a]/20 cursor-pointer"
              >
                Discuss Technical Advisory
              </button>
              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="px-6 py-3 rounded-xl bg-[#f6f2ec] hover:bg-[#ede6dc] text-stone-900 font-semibold text-sm border border-[#c2a67e]/35 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Section 2: THE COMPANY & OUR VISION & PHILOSOPHY (As requested for Homepage & About Page) */}
        {showFullVisionAndCompany && (
          <div className="pt-6 space-y-10">
            
            {/* The Company Full Section */}
            <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-[#faf7f2] border border-[#c2a67e]/35 shadow-lg space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2a67e]/35 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider font-bold">
                <Award className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>CAMA 1990 Registered</span>
                <span aria-hidden="true">·</span>
                <span>ISO 9001:2000 Aligned</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900">
                THE COMPANY: <span className="text-[#16a34a]">GPG Ltd: Nigerian Resource Development & Services</span>
              </h3>

              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p>
                  Incorporated under <strong>CAMA 1990</strong>, we deliver excellence in Geographic Information Systems (GIS), Environmental management, Geological/Geophysical explorations, borehole drilling, water resources, and general procurement. Independent & partnership operations across Nigeria. <strong>COMEG registered · ISO 9001:2000 aligned.</strong>
                </p>

                <p>
                  Our multidisciplinary team has successfully executed over <strong>180+ projects</strong> for government, NGOs, and private sector from high-volume boreholes (depths up to 800ft) to mineral resource estimation and ESIA for major infrastructure. We operate with cutting‑edge GIS labs and advanced geophysical equipment.
                </p>
              </div>

              {/* Accreditation Badges */}
              <div className="pt-3 border-t border-[#c2a67e]/25 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-stone-800">
                <div className="p-3.5 rounded-xl bg-white border border-[#c2a67e]/30 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span className="font-bold">COMEG Statutory Registration</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#c2a67e]/30 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span className="font-bold">NMGS Corporate Member</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#c2a67e]/30 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span className="font-bold">IAIA Certified Practitioners</span>
                </div>
              </div>
            </div>

            {/* Our Vision & Philosophy Dual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* OUR VISION */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#c2a67e]/35 shadow-md flex flex-col justify-between space-y-4 group hover:border-[#16a34a] transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#16a34a]/10 text-[#16a34a] flex items-center justify-center">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-mono uppercase text-[#8b6b3e] font-bold tracking-widest">
                    OUR VISION
                  </h4>
                  <p className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                    World‑class portfolio through human/natural resources development, sustainable impact, strategic IT & scientific application.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#c2a67e]/20 text-xs text-stone-500 font-mono">
                  Guiding every exploration target and community development project.
                </div>
              </div>

              {/* PHILOSOPHY */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#c2a67e]/35 shadow-md flex flex-col justify-between space-y-4 group hover:border-[#16a34a] transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#c2a67e]/20 text-[#8b6b3e] flex items-center justify-center">
                    <Target className="w-6 h-6 text-[#16a34a]" />
                  </div>
                  <h4 className="text-xs font-mono uppercase text-[#8b6b3e] font-bold tracking-widest">
                    OUR PHILOSOPHY
                  </h4>
                  <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
                    Operationalise services, capacity building, cost‑effectiveness, teamwork, technical expertise. We partner with host communities for lasting water & mineral solutions.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#c2a67e]/20 flex items-center gap-2 text-xs font-mono text-[#16a34a] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMEG, NMGS, IAIA certified</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
