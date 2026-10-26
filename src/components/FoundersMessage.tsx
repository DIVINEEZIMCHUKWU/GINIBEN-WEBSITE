import React from 'react';
import { Quote, Award } from 'lucide-react';

export const FoundersMessage: React.FC = () => {
  return (
    <section 
      className="relative py-28 lg:py-36 bg-white text-stone-900 border-t border-[#c2a67e]/20 overflow-hidden"
      aria-label="Founder's Message"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl p-8 sm:p-14 lg:p-16 bg-[#faf9f6] border border-[#c2a67e]/35 shadow-xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Founder Portrait (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-[#9c7a4e] shadow-xl bg-stone-100 mb-5">
                <img
                  src="https://i.ibb.co/zHxFmrmt/Whats-App-Image-2026-10-23-at-9-04-34-PM.jpg"
                  alt="Dr. Benjamin Ukwuteyinor, PhD - Founder & Lead Consultant"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-xl font-bold text-stone-900">
                Dr. Benjamin Ukwuteyinor, PhD
              </h3>
              <p className="text-xs font-mono text-[#9c7a4e] uppercase tracking-wider mt-1 font-semibold">
                Founder & Lead Consultant
              </p>
              
              <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-600 bg-white px-3 py-1.5 rounded-lg border border-[#c2a67e]/30 shadow-sm">
                <Award className="w-4 h-4 text-[#22c55e]" />
                <span className="font-semibold">COMEG, NMGS · 20+ Yrs Field Leadership</span>
              </div>
            </div>

            {/* Right: Message Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="flex items-center gap-2 text-xs font-mono text-[#9c7a4e] uppercase tracking-widest font-semibold">
                <Quote className="w-4 h-4 text-[#22c55e]" />
                <span>Founder's Executive Message</span>
              </div>

              {/* Exact supplied text */}
              <blockquote className="space-y-4 text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
                <p>
                  “At GiniBen & Partners GEOSERVICES LTD, we believe that geology is the foundation of sustainable wealth creation and infrastructure development.
                </p>

                <p>
                  Our vision is clear: to build a geoscience firm that delivers technical excellence, ethical integrity, and measurable value to investors, governments, and communities.
                </p>

                <div className="p-5 rounded-2xl bg-[#f5efe6] border-l-4 border-[#22c55e] text-stone-900 font-bold text-lg sm:text-xl leading-snug">
                  In resource development, accuracy is capital. Precision reduces risk. Insight drives profitability.
                </div>

                <p>
                  We are committed to ensuring that every project we undertake is grounded in sound science, strategic thinking, and long-term sustainability.”
                </p>
              </blockquote>

              <div className="pt-4 border-t border-[#c2a67e]/25 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-stone-900">Dr. Benjamin Ukwuteyinor, PhD</div>
                  <div className="text-xs text-stone-500 font-mono">Lead Geoscientist & Executive Consultant</div>
                </div>

                <div className="text-xs font-mono text-[#16a34a] font-semibold hidden sm:block">
                  COMEG Statutory Compliance
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
