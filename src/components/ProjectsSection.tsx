import React from 'react';
import { Compass, ArrowRight, Check, ShieldCheck } from 'lucide-react';

export interface ProjectServiceEntry {
  id: string;
  number: number;
  title: string;
  categoryKey: string;
  tagline: string;
  image: string;
  activities: string[];
}

export const PROJECT_DISCIPLINES: ProjectServiceEntry[] = [
  {
    id: "proj-disc-01",
    number: 1,
    title: "Geological Mapping & Exploration",
    categoryKey: "GEOLOGICAL MAPPING & EXPLORATION",
    tagline: "Field Surveys, Lithological Identification & Structural Assessment",
    image: "https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg",
    activities: [
      "Geological mapping and field surveys",
      "Rock and soil identification",
      "Geological investigations",
      "Structural geology and ground assessment"
    ]
  },
  {
    id: "proj-disc-02",
    number: 2,
    title: "Geophysical Surveys",
    categoryKey: "GEOPHYSICAL SURVEYS",
    tagline: "Resistivity, Magnetic, Electromagnetic & Subsurface Interpretation",
    image: "https://i.ibb.co/KcMj4W6Q/IMG-20261030-WA0032.jpg",
    activities: [
      "Electrical resistivity surveys",
      "Magnetic surveys",
      "Electromagnetic surveys",
      "Subsurface investigation and interpretation"
    ]
  },
  {
    id: "proj-disc-03",
    number: 3,
    title: "Geotechnical Investigations",
    categoryKey: "GEOTECHNICAL INVESTIGATIONS",
    tagline: "Soil Sampling, Foundation Evaluation & Ground-Condition Studies",
    image: "https://i.ibb.co/1YHbckyG/Whats-App-Image-2026-10-23-at-6-39-40-PM-1.jpg",
    activities: [
      "Soil investigation and sampling",
      "Subsurface soil assessment",
      "Foundation and construction-site investigations",
      "Ground-condition evaluation"
    ]
  },
  {
    id: "proj-disc-04",
    number: 4,
    title: "Hydrogeology & Groundwater Exploration",
    categoryKey: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    tagline: "Groundwater Prospecting, Aquifer Identification & Borehole Siting",
    image: "https://i.ibb.co/CTNfv6k/Whats-App-Image-2026-10-23-at-6-39-34-PM-1.jpg",
    activities: [
      "Groundwater prospecting",
      "Aquifer identification",
      "Groundwater potential assessment",
      "Borehole siting and water-source investigation"
    ]
  },
  {
    id: "proj-disc-05",
    number: 5,
    title: "Borehole Drilling & Water Solutions",
    categoryKey: "BOREHOLE CONSTRUCTION & WATER PROJECT",
    tagline: "Borehole Drilling, Well Development, Completion & Testing",
    image: "https://i.ibb.co/9HrCtyrv/IMG-20261030-WA0015.jpg",
    activities: [
      "Borehole drilling",
      "Water-well development",
      "Borehole completion",
      "Borehole testing and related water-supply solutions"
    ]
  },
  {
    id: "proj-disc-06",
    number: 6,
    title: "Mineral & Resource Exploration",
    categoryKey: "GEOPHYSICS & MINERAL EXPLORATION",
    tagline: "Exploration Surveys, Occurrence Investigations & Resource Assessment",
    image: "https://i.ibb.co/ch3qSLDL/IMG-20261030-WA0049.jpg",
    activities: [
      "Mineral exploration surveys",
      "Mineral occurrence investigations",
      "Rock and mineral sampling",
      "Preliminary resource assessment"
    ]
  },
  {
    id: "proj-disc-07",
    number: 7,
    title: "GIS & Geospatial Data Services",
    categoryKey: "GIS & GEOSPATIAL DATA SERVICES",
    tagline: "Geographic Information Systems, Digital Mapping & Spatial Analytics",
    image: "https://i.ibb.co/pBcPqw0p/imm-01.jpg",
    activities: [
      "Geographic Information Systems (GIS)",
      "Digital mapping",
      "Spatial data analysis",
      "Geospatial data interpretation"
    ]
  },
  {
    id: "proj-disc-08",
    number: 8,
    title: "Environmental Geoscience Services",
    categoryKey: "ENVIRONMENTAL GEOSCIENCE SERVICES",
    tagline: "Environmental Field Investigations, Soil & Water Assessment & Baseline Studies",
    image: "https://i.ibb.co/JjPm7nBf/IMG-20261030-WA0046.jpg",
    activities: [
      "Environmental field investigations",
      "Soil and water assessment",
      "Environmental baseline studies",
      "Ground and site assessment"
    ]
  }
];

interface ProjectsSectionProps {
  onOpenConsultation?: () => void;
  isStandalonePage?: boolean;
  onExploreGalleryCategory?: (category: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onOpenConsultation,
  isStandalonePage = false,
  onExploreGalleryCategory
}) => {
  const handleScrollToGallery = (categoryKey: string) => {
    if (onExploreGalleryCategory) {
      onExploreGalleryCategory(categoryKey);
    }
    const target = document.getElementById('project-photographic-gallery');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const fallback = document.getElementById('gallery');
      if (fallback) {
        fallback.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section 
      id="projects"
      className={`relative ${isStandalonePage ? 'py-16 sm:py-24' : 'py-24 lg:py-32'} bg-white text-stone-900 border-t border-[#c2a67e]/25 font-sans`}
      aria-label="Verified Field Investigations and Project Records"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Pure Title & Subtitle without Search Box or Category Filters */}
        <div className="max-w-3xl mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f2ec] border border-[#c2a67e]/30 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Fieldwork Disciplines</span>
            <span aria-hidden="true" className="text-stone-400">/</span>
            <span>8 Verified Practice Areas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight [text-wrap:balance]">
            Verified Field Investigations & <span className="text-[#16a34a]">Project Records</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-600 mt-4 leading-relaxed font-normal">
            Explore our verified operational assignments, drilling programs, and geoscientific field investigations across Africa. Select any practice area below to inspect its dedicated photographic evidence and field records.
          </p>
        </div>

        {/* 8 Core Fieldwork Discipline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {PROJECT_DISCIPLINES.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl overflow-hidden border border-[#c2a67e]/35 bg-white flex flex-col justify-between hover:border-[#16a34a] hover:shadow-xl hover:shadow-[#9c7a4e]/10 transition-all duration-300 shadow-xs"
            >
              <div>
                {/* Visual Header with Relatable Field Picture */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg') {
                        target.src = 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Number Badge */}
                  <span className="absolute top-3 left-3 text-xs font-mono font-bold text-white px-2.5 py-1 rounded-lg bg-black/70 border border-white/20 backdrop-blur-md">
                    0{item.number}
                  </span>

                  <span className="absolute bottom-2.5 left-3 text-[10px] font-mono font-bold text-[#86efac] uppercase tracking-wider">
                    Verified Field Scope
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#16a34a] transition-colors leading-snug">
                      {item.number}. {item.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#9c7a4e] uppercase font-semibold mt-1">
                      {item.tagline}
                    </p>
                  </div>

                  {/* 4 Activities List */}
                  <div className="pt-3 border-t border-[#c2a67e]/20 space-y-2 text-xs text-stone-700">
                    {item.activities.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                        <span className="leading-snug font-medium text-stone-800">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Directs directly to Project Photographic Evidence & Fieldwork Gallery */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleScrollToGallery(item.categoryKey)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group/btn"
                  title={`View photographic evidence for ${item.title}`}
                >
                  <span>Explore Field Evidence & Photos</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
