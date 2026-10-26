import React from 'react';
import { Briefcase, CheckCircle2, Clock, Check } from 'lucide-react';
import { RECENT_PROJECT_RECORDS } from '../data/companyData';

interface RecentProjectsTableProps {
  title?: string;
  subtitle?: string;
}

export const RecentProjectsTable: React.FC<RecentProjectsTableProps> = ({
  title = "Recent Projects & Verified Deliverables",
  subtitle = "Selected high-impact groundwater, mining, and environmental projects executed for government agencies, universities, and industrial corporations."
}) => {
  const getStatusBadge = (status: string) => {
    if (status.includes('Completed')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#16a34a]/15 text-[#16a34a] border border-[#16a34a]/30">
          <Check className="w-3.5 h-3.5" />
          <span>{status}</span>
        </span>
      );
    }
    if (status.includes('Quantified')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#c2a67e]/20 text-[#8b6b3e] border border-[#c2a67e]/40">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">
        <Clock className="w-3.5 h-3.5" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-[#faf8f5] text-stone-900 border-t border-[#c2a67e]/25 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2a67e]/35 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Track Record</span>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span>Tabular Field Portfolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2 sm:mt-3 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Tabular Frame: Desktop Table & Mobile Responsive Cards */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#c2a67e]/35 bg-white shadow-xl overflow-hidden">
          
          {/* 1. Desktop & Tablet Table (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-[#f6f2ec] border-b border-[#c2a67e]/30 text-xs font-mono uppercase tracking-wider text-stone-800">
                  <th scope="col" className="py-4 px-6 font-bold w-16">#</th>
                  <th scope="col" className="py-4 px-6 font-bold">Project Description</th>
                  <th scope="col" className="py-4 px-6 font-bold">Client / Authority</th>
                  <th scope="col" className="py-4 px-6 font-bold text-right">Execution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c2a67e]/20 text-sm">
                {RECENT_PROJECT_RECORDS.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-[#faf7f2] transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-[#8b6b3e]">
                      {String(item.id).padStart(2, '0')}
                    </td>
                    <td className="py-4 px-6 font-semibold text-stone-900 group-hover:text-[#16a34a] transition-colors">
                      {item.description}
                    </td>
                    <td className="py-4 px-6 text-stone-600 font-medium">
                      {item.client}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Mobile Responsive Card List (< md screens) */}
          <div className="block md:hidden divide-y divide-[#c2a67e]/20">
            {RECENT_PROJECT_RECORDS.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 space-y-2.5 hover:bg-[#faf7f2] transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#8b6b3e] px-2 py-0.5 rounded bg-[#f6f2ec] border border-[#c2a67e]/30">
                    Project #{String(item.id).padStart(2, '0')}
                  </span>
                  <div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-stone-900 leading-snug">
                  {item.description}
                </h4>

                <div className="text-xs text-stone-600 flex items-center gap-1.5 pt-0.5">
                  <span className="font-mono text-[#8b6b3e]">Client:</span>
                  <span className="font-medium text-stone-800">{item.client}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="p-4 sm:p-5 bg-[#faf8f5] border-t border-[#c2a67e]/25 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
            <span className="font-mono text-center sm:text-left">
              180+ documented assignments executed across Nigeria under CAMA 1990 & COMEG registration.
            </span>
            <span className="font-semibold text-[#16a34a] whitespace-nowrap">
              ISO 9001:2000 Aligned QA/QC
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
