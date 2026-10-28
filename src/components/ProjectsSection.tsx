import React, { useState } from 'react';
import { Compass, MapPin, Calendar, ArrowRight, Check, X, Layers, Maximize2, Eye } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onOpenConsultation: () => void;
  isStandalonePage?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onOpenConsultation,
  isStandalonePage = false
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [selectedProjectPhoto, setSelectedProjectPhoto] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'All Assignments' },
    { key: 'groundwater', label: 'Hydrogeology & Water' },
    { key: 'geology', label: 'Mineral Exploration' },
    { key: 'geophysics', label: 'Geotechnical & Geophysics' },
    { key: 'environmental', label: 'Environmental Studies' },
  ];

  const filteredProjects = selectedFilter === 'all'
    ? projects
    : projects.filter((p) => p.categoryKey === selectedFilter);

  return (
    <section 
      id="projects"
      className={`relative ${isStandalonePage ? 'py-16 sm:py-24' : 'py-24 lg:py-32'} bg-white text-stone-900 border-t border-[#c2a67e]/25 font-sans`}
      aria-label="Documented Projects and Field Case Studies"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f2ec] border border-[#c2a67e]/30 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Fieldwork Portfolios</span>
              <span aria-hidden="true" className="text-stone-400">/</span>
              <span>Subsurface Case Studies</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight [text-wrap:balance]">
              Verified Field Investigations & <span className="text-[#16a34a]">Project Records</span>
            </h2>

            <p className="text-base text-stone-600 mt-4 leading-relaxed">
              Explore documented assignments demonstrating our scientific methodology, equipment deployment, and tangible deliverables across West Africa.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-xl bg-[#faf7f2] border border-[#c2a67e]/30 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedFilter(cat.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === cat.key
                    ? 'bg-[#16a34a] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl overflow-hidden border border-[#c2a67e]/30 bg-white flex flex-col justify-between hover:border-[#16a34a] hover:shadow-xl transition-all duration-300"
            >
              {/* Project Image Frame (Adaptive Aspect Ratio for Laptops and Smartphones - Uncropped Display) */}
              <div 
                onClick={() => setActiveProjectModal(project)}
                className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/10] w-full overflow-hidden bg-stone-950 cursor-pointer flex items-center justify-center group/img"
              >
                {/* Soft ambient blur backdrop */}
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-35 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${project.coverImage})` }}
                />

                {/* Main image with object-contain to preserve full uncropped photograph */}
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 z-30 px-3 py-1 rounded-full text-xs font-mono font-semibold text-white bg-[#16a34a] shadow-md pointer-events-none">
                  {project.category}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProjectPhoto(project.coverImage);
                  }}
                  className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-mono border border-white/20 shadow-lg flex items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs"
                  title="Inspect Full Uncropped Photo"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#4ade80]" />
                  <span className="hidden sm:inline">Inspect Full Image</span>
                </button>
              </div>

              {/* Card Meta & Methodology */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 bg-[#faf8f5]/50">
                <div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500 mb-2.5">
                    <span className="flex items-center gap-1.5 text-[#16a34a] font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{project.location}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Calendar className="w-3.5 h-3.5 text-[#9c7a4e]" />
                      <span>{project.date}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#16a34a] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* Key Deliverables */}
                <div className="pt-4 border-t border-[#c2a67e]/20 space-y-2 text-xs text-stone-700">
                  <div className="text-[11px] font-mono text-[#8b6b3e] uppercase tracking-wider font-semibold">Key Method & Deliverables:</div>
                  {project.keyDeliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* View Details Action */}
                <div className="pt-3 flex items-center justify-between border-t border-[#c2a67e]/15">
                  <button
                    onClick={() => setActiveProjectModal(project)}
                    className="text-xs font-bold text-[#16a34a] hover:text-[#15803d] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Inspect Case Study & Field Data</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Case Study Full Modal */}
      {activeProjectModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-[#c2a67e]/40 p-6 sm:p-10 text-stone-900 shadow-2xl space-y-6">
            
            <button
              onClick={() => setActiveProjectModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#8b6b3e] uppercase">
              <span className="text-[#16a34a] font-bold">{activeProjectModal.category}</span>
              <span aria-hidden="true">·</span>
              <span>{activeProjectModal.location}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900">
              {activeProjectModal.title}
            </h3>

            {/* Gallery Images Strip for this Project */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeProjectModal.galleryImages.map((imgUrl, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedProjectPhoto(imgUrl)}
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-[#c2a67e]/30 bg-stone-950 shadow-inner cursor-pointer group/modalimg relative flex items-center justify-center"
                  title="Click to inspect full uncropped high resolution image"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${imgUrl})` }}
                  />
                  <img
                    src={imgUrl}
                    alt=""
                    className="w-full h-full object-contain relative z-10 transition-transform group-hover/modalimg:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover/modalimg:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-mono">
                    <Maximize2 className="w-4 h-4 text-[#4ade80]" />
                    <span>Uncropped View</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-5 text-sm text-stone-600 leading-relaxed">
              <div>
                <h4 className="text-xs font-mono uppercase text-[#8b6b3e] tracking-wider font-bold mb-1.5">
                  Project Scope & Context
                </h4>
                <p className="text-stone-700">{activeProjectModal.summary}</p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-[#8b6b3e] tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#16a34a]" />
                  <span>Geoscientific Methodology</span>
                </h4>
                <p className="p-4 rounded-xl bg-[#faf7f2] border border-[#c2a67e]/30 text-stone-800">
                  {activeProjectModal.methodology}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-[#8b6b3e] tracking-wider font-bold mb-2">
                  Verified Technical Deliverables
                </h4>
                <div className="space-y-2">
                  {activeProjectModal.keyDeliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#c2a67e]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-stone-500">
                Requires similar investigation for your concession or site?
              </span>
              <button
                onClick={() => {
                  setActiveProjectModal(null);
                  onOpenConsultation();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#16a34a] text-white font-bold text-sm hover:bg-[#15803d] transition-colors cursor-pointer shadow-sm"
              >
                Discuss Similar Project
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Uncropped Full-Resolution Photo Lightbox */}
      {selectedProjectPhoto && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setSelectedProjectPhoto(null)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close uncropped preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl h-[85vh] max-h-[900px] flex items-center justify-center">
            <img
              src={selectedProjectPhoto}
              alt="Full Uncropped Project View"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </section>
  );
};
