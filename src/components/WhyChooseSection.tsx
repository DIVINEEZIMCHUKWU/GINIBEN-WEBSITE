import React from 'react';
import { Target, Layers, TrendingUp, Leaf, CheckCircle2, ShieldCheck, Check } from 'lucide-react';

export const WhyChooseSection: React.FC = () => {
  const valuePoints = [
    {
      title: "Scientific Precision",
      desc: "Methodical data acquisition utilizing calibrated geophysical sensors, structural geological mapping, and strict verification protocols.",
      icon: Target
    },
    {
      title: "Technology-Driven Solutions",
      desc: "Application of advanced 2D/3D electrical resistivity tomography, digital core logging, and geophysical inversion software.",
      icon: Layers
    },
    {
      title: "Investment-Focused Reporting",
      desc: "Delivering defensible technical documentation structured to meet capital partner due diligence and bankable feasibility requirements.",
      icon: TrendingUp
    },
    {
      title: "Sustainable Resource Development",
      desc: "Balancing exploration targets with environmental stewardship, aquifer longevity, and responsible community footprint management.",
      icon: Leaf
    },
    {
      title: "Reliable Project Execution",
      desc: "Disciplined operational logistics, field safety compliance, and on-schedule technical completion across demanding regional terrains.",
      icon: CheckCircle2
    },
    {
      title: "Strong Regulatory Alignment",
      desc: "Accredited practice led by COMEG and NMGS certified geoscientists ensuring full alignment with statutory mining and water guidelines.",
      icon: ShieldCheck
    }
  ];

  return (
    <section 
      className="relative py-28 lg:py-36 bg-[#faf9f6] text-stone-900 border-t border-[#c2a67e]/25 overflow-hidden"
      aria-label="Our Value Proposition"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Signature Philosophy Banner with Carton Brown Kraft Styling */}
        <div className="relative rounded-3xl p-8 sm:p-14 lg:p-16 mb-20 bg-gradient-to-br from-white via-[#f5efe6] to-white border border-[#c2a67e]/40 shadow-xl overflow-hidden text-center">
          
          <div className="text-xs font-mono text-[#9c7a4e] uppercase tracking-widest mb-3 font-semibold">
            Institutional Philosophy
          </div>

          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-stone-900 tracking-tight max-w-4xl mx-auto leading-snug [text-wrap:balance]">
            “We do not just generate data; we convert data into <span className="text-[#16a34a]">strategic insight</span>.”
          </blockquote>

          <div className="w-20 h-1 bg-[#22c55e] mx-auto mt-6 rounded-full" />
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9c7a4e] uppercase tracking-wider mb-3 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
            <span>Value Proposition</span>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span>Why GiniBen & Partners</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-tight [text-wrap:balance]">
            Guaranteed Scientific Rigor & <span className="text-[#16a34a]">Institutional Credibility</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-600 mt-4 leading-relaxed font-normal">
            Whether structuring concession mineral delineations or engineering groundwater systems, our work withstands technical audit and drives commercial returns.
          </p>
        </div>

        {/* 6 Value Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valuePoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-[#c2a67e]/35 shadow-sm hover:shadow-xl hover:border-[#22c55e] transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5efe6] border border-[#c2a67e]/40 flex items-center justify-center text-[#16a34a]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#9c7a4e]">
                    0{idx + 1}.
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22c55e] shrink-0" />
                    <h3 className="text-lg font-bold text-stone-900">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
