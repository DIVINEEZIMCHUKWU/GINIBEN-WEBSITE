import React, { useState } from 'react';
import { Users, Award, Briefcase, ChevronRight, X, Check } from 'lucide-react';
import { TeamMember } from '../types';

interface TeamSectionProps {
  team: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  const [activeMemberModal, setActiveMemberModal] = useState<TeamMember | null>(null);

  return (
    <section 
      id="team"
      className="relative py-28 lg:py-36 bg-[#faf9f6] text-stone-900 border-t border-[#c2a67e]/20"
      aria-label="Our Leadership & Geoscientific Team"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9c7a4e] uppercase tracking-wider mb-3 font-semibold">
            <Users className="w-4 h-4 text-[#22c55e]" />
            <span>Consulting Leadership</span>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span>Multidisciplinary Expertise</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-tight [text-wrap:balance]">
            Led by Recognized <span className="text-[#16a34a]">Geoscientists</span> & Engineers
          </h2>

          <p className="text-base sm:text-lg text-stone-600 mt-4 leading-relaxed font-normal">
            Our principal consultants combine decades of academic research authority with extensive field contracting experience across Africa.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              onClick={() => setActiveMemberModal(member)}
              className="group rounded-3xl overflow-hidden border border-[#c2a67e]/35 bg-white flex flex-col justify-between hover:border-[#22c55e] hover:shadow-xl hover:shadow-[#9c7a4e]/10 transition-all duration-300 cursor-pointer"
            >
              {/* Member Image Frame */}
              <div className="relative h-72 w-full overflow-hidden bg-stone-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg') {
                      target.src = 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                
                <span className="absolute bottom-3 left-3 text-[11px] font-mono text-stone-900 bg-white/95 px-2.5 py-1 rounded-md border border-[#c2a67e]/35 font-semibold backdrop-blur-md">
                  {member.experienceYears}
                </span>
              </div>

              {/* Member Meta */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#16a34a] transition-colors leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-[#9c7a4e] uppercase font-semibold mt-1">
                    {member.title}
                  </p>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>

                <div className="pt-3 border-t border-[#c2a67e]/20 flex items-center justify-between text-xs text-[#16a34a] font-semibold">
                  <span>View Credentials</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Member Details Modal */}
      {activeMemberModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#c2a67e]/40 p-6 sm:p-10 text-stone-900 shadow-2xl space-y-6">
            
            <button
              onClick={() => setActiveMemberModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#c2a67e]/40 shrink-0">
                <img
                  src={activeMemberModal.image}
                  alt={activeMemberModal.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg') {
                      target.src = 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg';
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">{activeMemberModal.name}</h3>
                <p className="text-xs font-mono text-[#9c7a4e] uppercase font-semibold">{activeMemberModal.title}</p>
                <p className="text-xs text-stone-500 font-mono mt-0.5">{activeMemberModal.experienceYears}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
              <p>{activeMemberModal.bio}</p>
              
              {activeMemberModal.affiliations && activeMemberModal.affiliations.length > 0 && (
                <div className="pt-3 border-t border-[#c2a67e]/20 space-y-2">
                  <span className="text-xs font-mono text-[#9c7a4e] uppercase font-bold tracking-wider">
                    Institutional Affiliations & Accreditations
                  </span>
                  <div className="space-y-1.5">
                    {activeMemberModal.affiliations.map((aff, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-800">
                        <Check className="w-4 h-4 text-[#22c55e] shrink-0" />
                        <span>{aff}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#c2a67e]/20 flex justify-end">
              <button
                onClick={() => setActiveMemberModal(null)}
                className="px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
