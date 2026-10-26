import React from 'react';
import { X, ShieldCheck, Lock, Eye, Database } from 'lucide-react';
import { CompanyConfig } from '../types';

interface PrivacyModalProps {
  company: CompanyConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  company,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#1a1612] border border-[#c2a67e]/40 p-6 sm:p-10 text-white shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#241f1a] text-stone-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close Privacy Policy"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#c2a67e] uppercase">
          <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
          <span>Statutory Governance & Data Transparency</span>
        </div>

        <h3 id="privacy-policy-title" className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Privacy Policy & Information Notice
        </h3>

        <div className="space-y-5 text-sm text-stone-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-[#241f1a] border border-[#c2a67e]/25 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
            <p className="text-xs text-stone-200">
              This policy describes how <strong className="text-white">{company.name}</strong> collects, processes, and protects consultation enquiries submitted through our digital platform on {company.domain}.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#4ade80]" />
              <span>1. Information We Collect</span>
            </h4>
            <p>
              When prospective clients or partners initiate contact via our Consultation Desk, we collect the submitted name, organization, corporate email, telephone/WhatsApp contact, requested service, and project scope descriptions. We do not sell, rent, or lease corporate data to third-party commercial marketing entities.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#4ade80]" />
              <span>2. Storage & Operational Purpose</span>
            </h4>
            <p>
              Submitted technical information is utilized strictly to formulate geoscientific proposals, execute preliminary geological feasibility evaluations, and establish direct consulting communications. Submissions are stored within our secure MySQL database environment with strict access control.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-1.5">
              3. Cookies & Local Application State
            </h4>
            <p>
              Our website uses strictly necessary functional cookies and local session tokens to facilitate administrator authentication and maintain secure communication with our PHP REST API. No invasive tracking cookies or commercial ad trackers are deployed.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-1.5">
              4. Verification Notice
            </h4>
            <p>
              Official telephone and WhatsApp contact channels: <strong className="text-white">{company.phone}</strong>. For inquiries regarding data deletion or statutory privacy clarifications, please contact our administrative desk directly.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#c2a67e]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-[#4ade80] text-[#12100d] font-bold text-sm hover:bg-[#86efac] transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
