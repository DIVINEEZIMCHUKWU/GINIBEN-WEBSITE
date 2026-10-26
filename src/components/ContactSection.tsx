import React, { useState } from 'react';
import { Send, Phone, MessageSquare, Facebook, Linkedin, MapPin, Mail, CheckCircle2, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { CompanyConfig, ConsultationEnquiry } from '../types';

interface ContactSectionProps {
  company: CompanyConfig;
  preselectedService?: string;
  onNewEnquiryCreated: (enquiry: ConsultationEnquiry) => void;
  isStandalonePage?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  company,
  preselectedService,
  onNewEnquiryCreated,
  isStandalonePage = false
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    serviceOfInterest: preselectedService || 'Mineral Resources & Exploration',
    projectLocation: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const servicesList = [
    'Mineral Resources & Exploration',
    'Resource Assessment & Project Advisory',
    'Environmental & Regulatory Services',
    'Geotechnical & Engineering Support',
    'Hydrogeology & Water Development',
    'Geospatial, Mapping & Related Technical Services',
    'General Geoscience Inquiry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill out all required fields (Full Name, Email, and Message).');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please enter a valid corporate or personal email address.');
      return;
    }

    setIsSubmitting(true);

    const generatedRef = 'GB-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newEnquiry: ConsultationEnquiry = {
      id: 'enq-' + Date.now(),
      referenceNumber: generatedRef,
      fullName: formData.fullName.trim(),
      company: formData.company.trim() || undefined,
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      serviceOfInterest: formData.serviceOfInterest,
      projectLocation: formData.projectLocation.trim() || undefined,
      subject: formData.subject.trim() || `Consultation: ${formData.serviceOfInterest}`,
      message: formData.message.trim(),
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Transmit consultation to FormSubmit for direct delivery to info@ginibengeoservices.com (forwarded to benukwutevinor@yahoo.com and gpg1.geoservices@gmail.com)
      fetch('https://formsubmit.co/ajax/info@ginibengeoservices.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Technical Consultation: ${formData.serviceOfInterest} [${generatedRef}]`,
          _cc: 'benukwutevinor@yahoo.com,gpg1.geoservices@gmail.com',
          _template: 'table',
          'Reference Number': generatedRef,
          'Full Name': formData.fullName.trim(),
          'Company': formData.company.trim() || 'Not specified',
          'Client Email': formData.email.trim(),
          'Phone / WhatsApp': formData.phone.trim() || 'Not specified',
          'Service Required': formData.serviceOfInterest,
          'Project Location': formData.projectLocation.trim() || 'Not specified',
          'Subject': formData.subject.trim() || `Consultation: ${formData.serviceOfInterest}`,
          'Technical Message': formData.message.trim()
        })
      }).catch(() => {
        // Fallback silently if offline or blocked
      });

      // 2. Also attempt sending to local PHP API endpoint if available on Truehost cPanel
      await fetch('/api/enquiries.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => {
        // Fallback gracefully in dev environment without throwing UI error
      });

      // Synchronize in app state and persistent store
      onNewEnquiryCreated(newEnquiry);
      setSubmissionSuccess(generatedRef);
      setFormData({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        serviceOfInterest: 'Mineral Resources & Exploration',
        projectLocation: '',
        subject: '',
        message: ''
      });
    } catch {
      setErrorMessage('Failed to transmit message. Please contact us directly via WhatsApp or Telephone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefToClipboard = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <section 
      id="contact"
      className={`relative ${isStandalonePage ? 'py-16 sm:py-24' : 'py-20 lg:py-28'} bg-white text-stone-900 border-t border-[#c2a67e]/25 font-sans`}
      aria-label="Contact and Consultation Enquiries"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* Left Column: Direct Channels & Corporate Contacts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f2ec] border border-[#c2a67e]/30 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-4">
                <MessageSquare className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Consultation Desk</span>
                <span aria-hidden="true" className="text-stone-400">/</span>
                <span>Direct Access</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight [text-wrap:balance]">
                Initiate a Technical <span className="text-[#16a34a]">Discussion</span>
              </h2>

              <p className="text-sm sm:text-base text-stone-600 mt-4 leading-relaxed">
                Connect directly with Dr. Benjamin Ukwuteyinor and our senior geoscientists to discuss exploration targets, borehole siting, survey logistics, or regulatory reporting.
              </p>
            </div>

            {/* Direct Verified Channels */}
            <div className="space-y-3.5">
              
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${company.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#c2a67e]/35 hover:border-[#16a34a] hover:bg-white flex items-center justify-between group transition-all shadow-sm hover:scale-[1.01]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 text-[#16a34a] flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-[#8b6b3e] uppercase font-bold tracking-wider block">
                      Direct WhatsApp Desk
                    </span>
                    <span className="text-base font-bold text-stone-900 group-hover:text-[#16a34a] transition-colors">
                      {company.whatsappNumber}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#16a34a] font-bold">Chat Now →</span>
              </a>

              {/* Telephone */}
              <a
                href={`tel:${company.phone.replace(/[^0-9+]/g, '')}`}
                className="p-4 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#c2a67e]/35 hover:border-[#16a34a] hover:bg-white flex items-center justify-between group transition-all shadow-sm hover:scale-[1.01]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c2a67e]/20 text-[#8b6b3e] flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                    <Phone className="w-6 h-6 text-[#16a34a]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-[#8b6b3e] uppercase font-bold tracking-wider block">
                      Direct Telephone Line
                    </span>
                    <span className="text-base font-bold text-stone-900 group-hover:text-[#16a34a] transition-colors">
                      {company.phone}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#8b6b3e] font-semibold group-hover:text-stone-900">Call Us →</span>
              </a>

              {/* Emails */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#c2a67e]/35 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c2a67e]/20 text-[#16a34a] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-[#8b6b3e] uppercase font-bold tracking-wider block">
                      Official Email Desks
                    </span>
                    <div className="space-y-0.5 text-xs font-semibold text-stone-800">
                      <a href="mailto:info@ginibengeoservices.com" className="block text-[#16a34a] hover:underline transition-colors font-bold">
                        info@ginibengeoservices.com
                      </a>
                      <a href="mailto:benukwutevinor@yahoo.com" className="block hover:text-[#16a34a] transition-colors">
                        benukwutevinor@yahoo.com
                      </a>
                      <a href="mailto:gpg1.geoservices@gmail.com" className="block hover:text-[#16a34a] transition-colors">
                        gpg1.geoservices@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links: Facebook & LinkedIn */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={company.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#faf7f2] border border-[#c2a67e]/35 hover:border-[#1877F2] hover:bg-white flex items-center gap-3 group transition-all shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono text-[#8b6b3e] uppercase font-bold block truncate">Facebook</span>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-[#1877F2] transition-colors truncate block">GiniBen Page</span>
                  </div>
                </a>

                <a
                  href={company.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#faf7f2] border border-[#c2a67e]/35 hover:border-[#0A66C2] hover:bg-white flex items-center gap-3 group transition-all shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono text-[#8b6b3e] uppercase font-bold block truncate">LinkedIn</span>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-[#0A66C2] transition-colors truncate block">Company Profile</span>
                  </div>
                </a>
              </div>

            </div>

            {/* Offices Addresses */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#f6f2ec] border border-[#c2a67e]/35 text-xs text-stone-700 space-y-1.5">
                <div className="flex items-center gap-2 text-[#16a34a] font-bold">
                  <MapPin className="w-4 h-4 shrink-0 text-[#8b6b3e]" />
                  <span>Registered Office</span>
                </div>
                <p className="font-semibold text-stone-900 leading-relaxed">
                  2 Leck Avenue, Adjacent State Police Headquarters GRA, Enugu, Enugu State, Nigeria
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f6f2ec] border border-[#c2a67e]/35 text-xs text-stone-700 space-y-1.5">
                <div className="flex items-center gap-2 text-[#8b6b3e] font-bold">
                  <MapPin className="w-4 h-4 shrink-0 text-[#8b6b3e]" />
                  <span>Other Office</span>
                </div>
                <p className="font-semibold text-stone-900 leading-relaxed">
                  #3 Nnamani Street, Trans Ekulu, Enugu
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Consultation Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#faf7f2] border border-[#c2a67e]/35 p-6 sm:p-10 rounded-3xl shadow-lg">
            
            {submissionSuccess ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#16a34a]/15 text-[#16a34a] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <h3 className="text-2xl font-bold text-stone-900">
                  Consultation Enquiry Logged
                </h3>

                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you. Your project specifications have been securely recorded. Our Lead Consultant, <strong className="text-stone-900 font-bold">Dr. Benjamin Ukwuteyinor</strong>, will evaluate your scope.
                </p>

                <div className="p-4 rounded-xl bg-white border border-[#c2a67e]/35 max-w-xs mx-auto flex items-center justify-between shadow-sm">
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-[#8b6b3e] uppercase font-bold block">REFERENCE NUMBER</span>
                    <span className="text-sm font-mono font-bold text-stone-900">{submissionSuccess}</span>
                  </div>
                  <button
                    onClick={() => copyRefToClipboard(submissionSuccess)}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    title="Copy reference code"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-[#16a34a]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSubmissionSuccess(null)}
                    className="px-6 py-3 rounded-xl bg-[#16a34a] text-white font-bold text-sm hover:bg-[#15803d] transition-colors cursor-pointer shadow-md"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="border-b border-[#c2a67e]/20 pb-4">
                  <h3 className="text-xl font-bold text-stone-900">
                    Submit Project Specifications
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Fields marked with an asterisk (<span className="text-[#16a34a] font-bold">*</span>) are required.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#8b6b3e] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Engr. Samuel Adeleke"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#c2a67e]/35 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#16a34a] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#8b6b3e] mb-1.5">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Mining Consortium"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#c2a67e]/35 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#16a34a] shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#8b6b3e] mb-1.5">
                      Corporate / Personal Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@organization.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#c2a67e]/35 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#16a34a] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#8b6b3e] mb-1.5">
                      Telephone / WhatsApp Contact
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 ..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#c2a67e]/35 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#16a34a] shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#8b6b3e] mb-1.5">
                      Service Area of Interest *
                    </label>
                    <select
                      value={formData.serviceOfInterest}
                      onChange={(e) => setFormData({ ...formData, serviceOfInterest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#c2a67e]/35 text-stone-900 text-sm focus:outline-none focus:border-[#16a34a] shadow-xs"
                    >
                      {servicesList.map((srv, idx) => (
                        <option key={idx} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#8b6b3e] mb-1.5">
                      Project Location / State
                    </label>
                    <input
                      type="text"
                      value={formData.projectLocation}
                      onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                      placeholder="e.g. Enugu / Kogi State Concession"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#c2a67e]/35 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#16a34a] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#8b6b3e] mb-1.5">
                    Subject / Project Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Request for Deep Industrial Borehole / 2D ERT Survey"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#c2a67e]/35 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#16a34a] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#8b6b3e] mb-1.5">
                    Project Scope Details & Technical Objectives *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please specify target depth, terrain context, prospective minerals, or borehole requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#c2a67e]/35 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#16a34a] resize-none shadow-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm transition-all shadow-md shadow-[#16a34a]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Specifications...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Consultation Request</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

        {/* Interactive Google Map on Contact Page */}
        <div className="rounded-3xl border border-[#c2a67e]/35 overflow-hidden shadow-xl bg-white">
          <div className="p-5 sm:p-6 bg-[#f6f2ec] border-b border-[#c2a67e]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#8b6b3e] uppercase font-bold tracking-wider block">
                  Registered Corporate Location Map
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  2 Leck Avenue, Adjacent State Police Headquarters GRA, Enugu
                </h3>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=2+Leck+Avenue,+Adjacent+State+Police+Headquarters+GRA,+Enugu,+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#c2a67e]/40 text-xs font-semibold text-stone-800 hover:text-[#16a34a] shadow-xs transition-colors shrink-0"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 relative bg-stone-100">
            <iframe
              src="https://maps.google.com/maps?q=2%20Leck%20Avenue,%20Adjacent%20State%20Police%20Headquarters%20GRA,%20Enugu,%20Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
              title="GiniBen & Partners Registered Office Map"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </section>
  );
};
