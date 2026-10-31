import React, { useState, useEffect } from 'react';
import { 
  COMPANY_CONFIG, 
  PROJECT_VIDEOS, 
  ALL_PROJECT_VIDEOS,
  INITIAL_GALLERY_IMAGES, 
  INITIAL_SERVICES, 
  INITIAL_PROJECTS, 
  INITIAL_TEAM_MEMBERS, 
  INITIAL_ARTICLES, 
  INITIAL_ENQUIRIES 
} from './data/companyData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DualTrackSlider } from './components/DualTrackSlider';
import { FeaturedVideoSection } from './components/FeaturedVideoSection';
import { CompanyIntro } from './components/CompanyIntro';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { ProjectsSection } from './components/ProjectsSection';
import { RecentProjectsTable } from './components/RecentProjectsTable';
import { FoundersMessage } from './components/FoundersMessage';
import { TeamSection } from './components/TeamSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyModal } from './components/PrivacyModal';
import { LightboxModal } from './components/LightboxModal';
import { MediaItem, ConsultationEnquiry, ProjectItem, ArticleItem, CompanyConfig, ProjectVideo, TeamMember } from './types';
import { ArrowRight, ChevronRight, Layers, MessageSquare, Camera, Maximize2 } from 'lucide-react';
import { 
  getImagesFromApi, saveImageToApi, deleteImageFromApi,
  getVideosFromApi, saveVideoToApi, deleteVideoFromApi,
  getTeamFromApi, saveTeamMemberToApi, deleteTeamMemberFromApi,
  getEnquiriesFromApi, submitEnquiryToApi, updateEnquiryStatusInApi, deleteEnquiryFromApi, clearAllEnquiriesInApi,
  getSettingsFromApi, saveSettingsToApi
} from './services/apiService';

const DELETED_IMAGE_TOKENS = ['ccsDQjRW', 'VYCKFqT7', 'ksFt40BR', 'img-22', 'img-23', 'img-24'];
const sanitizeImages = (imgs: MediaItem[]): MediaItem[] => {
  if (!Array.isArray(imgs)) return [];
  return imgs.filter((img) => !DELETED_IMAGE_TOKENS.some((tok) => img.id === tok || img.url?.includes(tok)));
};

export default function App() {
  // State initialization with persistence fallback
  const [company, setCompany] = useState<CompanyConfig>(() => {
    const saved = localStorage.getItem('giniben_company_config_v2');
    return saved ? JSON.parse(saved) : COMPANY_CONFIG;
  });

  const [galleryImages, setGalleryImages] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('giniben_gallery_images_v10');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === INITIAL_GALLERY_IMAGES.length) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_GALLERY_IMAGES;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('giniben_projects_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [articles, setArticles] = useState<ArticleItem[]>(() => {
    const saved = localStorage.getItem('giniben_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [enquiries, setEnquiries] = useState<ConsultationEnquiry[]>(() => {
    const saved = localStorage.getItem('giniben_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  const [projectVideos, setProjectVideos] = useState<ProjectVideo[]>(() => {
    const saved = localStorage.getItem('giniben_project_videos_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return ALL_PROJECT_VIDEOS;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('giniben_team_members_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_TEAM_MEMBERS;
  });

  // Dedicated Page Routing: 'home' | 'about' | 'services' | 'projects' | 'gallery' | 'contact'
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validPages = ['home', 'about', 'services', 'projects', 'gallery', 'contact'];
    return validPages.includes(hash) ? hash : 'home';
  });

  // Direct Admin Dashboard access: detect /admin or #admin on load
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const hash = window.location.hash.toLowerCase().replace('#', '');
    return path === '/admin' || path.endsWith('/admin') || hash === 'admin';
  });

  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<MediaItem | null>(null);

  // Sync routes on hashchange and popstate (browser back/forward & direct URL changes)
  useEffect(() => {
    const handleRouteSync = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.replace('#', '').toLowerCase();

      // Check if Admin Dashboard route is requested
      if (path === '/admin' || path.endsWith('/admin') || hash === 'admin') {
        setIsAdminOpen(true);
        return;
      }

      const validPages = ['home', 'about', 'services', 'projects', 'gallery', 'contact'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
        setIsAdminOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, []);

  // Admin Open / Close URL Handlers
  const handleOpenAdmin = () => {
    if (window.location.pathname !== '/admin') {
      window.history.pushState(null, '', '/admin');
    }
    setIsAdminOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.toLowerCase().includes('admin')) {
      window.history.pushState(null, '', '/');
    }
    if (window.location.hash.toLowerCase().includes('admin')) {
      window.history.pushState(null, '', '/');
    }
  };

  const handleGoToHomepageFromAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.toLowerCase().includes('admin')) {
      window.history.pushState(null, '', '/');
    }
    setCurrentPage('home');
    window.location.hash = 'home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Curated lists based on placement luxury configured by Admin
  const heroImages = galleryImages.filter((img) => img.showOnHomepage !== false && img.isHero).slice(0, 15);
  const homepageImages = galleryImages.filter((img) => img.showOnHomepage !== false);
  const homepageVideos = projectVideos.filter((v) => v.showOnHomepage !== false);
  const projectPageVideos = projectVideos.filter((v) => v.showOnProjects !== false);
  const projectPageImages = galleryImages.filter((img) => img.showOnProjects !== false && img.category !== 'instruments');
  const galleryPageImages = galleryImages.filter((img) => img.showOnGallery !== false);
  const galleryPageVideos = projectVideos.filter((v) => v.showOnGallery !== false);

  // Page navigation handler
  const handleNavigate = (pageId: string) => {
    const targetPage = pageId === 'videos' ? 'projects' : pageId;
    setCurrentPage(targetPage);
    window.location.hash = targetPage;
    setIsAdminOpen(false);
    if (window.location.pathname.toLowerCase().includes('admin')) {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedService(serviceTitle);
    }
    handleNavigate('contact');
  };

  // Initial load from Truehost cPanel MySQL Backend (with graceful localStorage fallback)
  useEffect(() => {
    getImagesFromApi().then((imgs) => {
      if (imgs && imgs.length > 0) setGalleryImages(imgs);
    });
    getVideosFromApi().then((vids) => {
      if (vids && vids.length > 0) setProjectVideos(vids);
    });
    getTeamFromApi().then((tm) => {
      if (tm && tm.length > 0) setTeam(tm);
    });
    getEnquiriesFromApi().then((enqs) => {
      if (enqs) setEnquiries(enqs);
    });
    getSettingsFromApi().then((sets) => {
      if (sets && typeof sets === 'object') {
        setCompany((prev) => ({ ...prev, ...sets }));
      }
    });
  }, []);

  // Re-fetch latest database records whenever Admin Console is open (with 8s auto-poll)
  useEffect(() => {
    if (!isAdminOpen) return;

    const syncLiveDatabase = () => {
      getEnquiriesFromApi().then((enqs) => {
        if (enqs && Array.isArray(enqs)) {
          setEnquiries(enqs);
          localStorage.setItem('giniben_enquiries', JSON.stringify(enqs));
        }
      });
      getImagesFromApi().then((imgs) => {
        if (imgs && imgs.length > 0) {
          const validUrls = new Set(INITIAL_GALLERY_IMAGES.map((i) => i.url));
          const cleanImgs = imgs.filter((i) => validUrls.has(i.url) || i.id?.startsWith('img-user-'));
          if (cleanImgs.length > 0) {
            setGalleryImages(cleanImgs);
            localStorage.setItem('giniben_gallery_images_v6', JSON.stringify(cleanImgs));
          }
        }
      });
      getVideosFromApi().then((vids) => {
        if (vids && vids.length > 0) {
          setProjectVideos(vids);
          localStorage.setItem('giniben_project_videos_v4', JSON.stringify(vids));
        }
      });
      getTeamFromApi().then((tm) => {
        if (tm && tm.length > 0) {
          setTeam(tm);
          localStorage.setItem('giniben_team_members_v2', JSON.stringify(tm));
        }
      });
      getSettingsFromApi().then((sets) => {
        if (sets && typeof sets === 'object') {
          setCompany((prev) => ({ ...prev, ...sets }));
        }
      });
    };

    // Immediate sync on admin open
    syncLiveDatabase();

    // Auto-poll every 8 seconds while admin is viewing the dashboard
    const pollInterval = setInterval(syncLiveDatabase, 8000);
    return () => clearInterval(pollInterval);
  }, [isAdminOpen]);

  // State handlers with persistent sync (localStorage + MySQL Backend)
  const handleUpdateCompany = (updated: CompanyConfig) => {
    setCompany(updated);
    localStorage.setItem('giniben_company_config', JSON.stringify(updated));
    saveSettingsToApi(updated as any);
  };

  const handleNewEnquiryCreated = (newEnq: ConsultationEnquiry) => {
    const updated = [newEnq, ...enquiries.filter((e) => e.id !== newEnq.id)];
    setEnquiries(updated);
    localStorage.setItem('giniben_enquiries', JSON.stringify(updated));
    submitEnquiryToApi(newEnq);
  };

  const handleUpdateEnquiryStatus = (id: string, newStatus: 'new' | 'reviewed' | 'resolved') => {
    const updated = enquiries.map((enq) =>
      enq.id === id ? { ...enq, status: newStatus } : enq
    );
    setEnquiries(updated);
    localStorage.setItem('giniben_enquiries', JSON.stringify(updated));
    updateEnquiryStatusInApi(id, newStatus);
  };

  const handleDeleteEnquiry = (id: string) => {
    const updated = enquiries.filter((enq) => enq.id !== id);
    setEnquiries(updated);
    localStorage.setItem('giniben_enquiries', JSON.stringify(updated));
    deleteEnquiryFromApi(id);
  };

  const handleAddProject = (newProj: ProjectItem) => {
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('giniben_projects_v3', JSON.stringify(updated));
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem('giniben_projects_v3', JSON.stringify(updated));
  };

  const handleAddGalleryImage = (newImg: MediaItem) => {
    const updated = [newImg, ...galleryImages];
    setGalleryImages(updated);
    localStorage.setItem('giniben_gallery_images_v6', JSON.stringify(updated));
    saveImageToApi(newImg);
  };

  const handleUpdateGalleryImage = (updatedImg: MediaItem) => {
    const updated = galleryImages.map((img) => img.id === updatedImg.id ? updatedImg : img);
    setGalleryImages(updated);
    localStorage.setItem('giniben_gallery_images_v6', JSON.stringify(updated));
    saveImageToApi(updatedImg);
  };

  const handleDeleteGalleryImage = (id: string) => {
    const updated = galleryImages.filter((img) => img.id !== id);
    setGalleryImages(updated);
    localStorage.setItem('giniben_gallery_images_v6', JSON.stringify(updated));
    deleteImageFromApi(id);
  };

  const handleAddVideo = (newVid: ProjectVideo) => {
    const updated = [newVid, ...projectVideos];
    setProjectVideos(updated);
    localStorage.setItem('giniben_project_videos_v4', JSON.stringify(updated));
    saveVideoToApi(newVid);
  };

  const handleUpdateVideo = (updatedVid: ProjectVideo) => {
    const updated = projectVideos.map((v) => v.id === updatedVid.id ? updatedVid : v);
    setProjectVideos(updated);
    localStorage.setItem('giniben_project_videos_v4', JSON.stringify(updated));
    saveVideoToApi(updatedVid);
  };

  const handleDeleteVideo = (id: string) => {
    const updated = projectVideos.filter((v) => v.id !== id);
    setProjectVideos(updated);
    localStorage.setItem('giniben_project_videos_v4', JSON.stringify(updated));
    deleteVideoFromApi(id);
  };

  const handleAddArticle = (newArt: ArticleItem) => {
    const updated = [newArt, ...articles];
    setArticles(updated);
    localStorage.setItem('giniben_articles', JSON.stringify(updated));
  };

  const handleAddTeamMember = (newMember: TeamMember) => {
    const updated = [...team, newMember];
    setTeam(updated);
    localStorage.setItem('giniben_team_members_v2', JSON.stringify(updated));
    saveTeamMemberToApi(newMember);
  };

  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    const updated = team.map((m) => m.id === updatedMember.id ? updatedMember : m);
    setTeam(updated);
    localStorage.setItem('giniben_team_members_v2', JSON.stringify(updated));
    saveTeamMemberToApi(updatedMember);
  };

  const handleDeleteTeamMember = (id: string) => {
    const updated = team.filter((m) => m.id !== id);
    setTeam(updated);
    localStorage.setItem('giniben_team_members_v2', JSON.stringify(updated));
    deleteTeamMemberFromApi(id);
  };

  const handleClearAllEnquiries = () => {
    setEnquiries([]);
    localStorage.setItem('giniben_enquiries', JSON.stringify([]));
    clearAllEnquiriesInApi();
  };

  return (
    <div className="min-h-screen bg-white text-stone-800 flex flex-col font-sans selection:bg-[#16a34a]/25 selection:text-stone-900">
      
      {/* 1. Header (Follows Top Bar Contract & Multi-Page Navigation) */}
      <Header
        company={company}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={handleOpenAdmin}
        isAdminOpen={isAdminOpen}
      />

      {/* Main Dedicated Page Container */}
      <main className="flex-1 pt-16 sm:pt-20">
        
        {/* =========================================================
            PAGE 1: HOME PAGE
            ========================================================= */}
        {currentPage === 'home' && (
          <div>
            {/* 1. Hero Section: 15 full cover cycling images, Poppins, 180+ projects metrics, morphism */}
            <HeroSection
              heroImages={heroImages}
              onExploreServices={() => handleNavigate('services')}
              onDiscussProject={() => handleOpenConsultation()}
              onOpenImageLightbox={(img) => setSelectedLightboxImage(img)}
            />

            {/* 2. RESTORED Image Slider directly after Hero Section (As explicitly requested) */}
            <DualTrackSlider
              allImages={homepageImages}
              onOpenLightbox={(img) => setSelectedLightboxImage(img)}
              onViewFullGallery={() => handleNavigate('gallery')}
            />

            {/* 3. The Company, Our Vision & Philosophy on Homepage */}
            <CompanyIntro
              company={company}
              onLearnMore={() => handleNavigate('about')}
              onOpenConsultation={() => handleOpenConsultation()}
              showFullVisionAndCompany={true}
            />

            {/* 4. Featured Drilling Operations & Subsurface Acquisition Video (Direct Inline Playback, No Redirects) */}
            <FeaturedVideoSection
              videos={homepageVideos}
              onExploreProjects={() => handleNavigate('projects')}
            />

            {/* 5. Value Proposition: "We do not just generate data; we convert data into strategic insight" */}
            <WhyChooseSection />

            {/* 6. Practice Areas Overview (6 Core Services Snapshot) */}
            <section className="py-20 lg:py-28 bg-[#faf8f5] text-stone-900 border-t border-[#c2a67e]/25">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2a67e]/30 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-4">
                      <Layers className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>Technical Solutions</span>
                      <span aria-hidden="true" className="text-stone-400">/</span>
                      <span>Full Project Lifecycle</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                      What <span className="text-[#16a34a]">We Do</span>
                    </h2>
                    <p className="text-base text-stone-600 mt-3 max-w-xl">
                      Integrated technical solutions across mineral resources, infrastructure, environmental compliance, and hydrogeology.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('services')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm transition-all shadow-md cursor-pointer self-start md:self-auto"
                  >
                    <span>View All 6 Practice Areas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {INITIAL_SERVICES.slice(0, 6).map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => handleNavigate('services')}
                      className="group p-8 rounded-2xl bg-white border border-[#c2a67e]/30 hover:border-[#16a34a] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-[#faf7f2] border border-[#c2a67e]/30 flex items-center justify-center text-sm font-mono font-bold text-[#16a34a] mb-5 group-hover:bg-[#16a34a]/10 transition-colors">
                          {srv.numericCode}
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#16a34a] transition-colors leading-snug">
                          {srv.title}
                        </h3>
                        <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                          {srv.tagline}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-[#c2a67e]/20 flex items-center text-xs font-bold text-[#16a34a] group-hover:translate-x-1 transition-transform">
                        <span>Explore Technical Scope</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 7. Tabular Recent Projects Section on Homepage */}
            <RecentProjectsTable 
              title="Recent Projects Executed Across Nigeria"
              subtitle="From 305mm industrial boreholes to 45km highway ESIA, review our verified project records."
            />

            {/* 8. Team Members on Homepage (With user's requested 4 members and photos) */}
            <TeamSection team={team} />

            {/* 9. Founder's Message from Dr. Benjamin Ukwuteyinor, PhD */}
            <FoundersMessage />

            {/* 10. Additional Photographic Grid on Homepage so users have rich visual content */}
            <section className="py-20 lg:py-28 bg-[#faf7f2] border-t border-[#c2a67e]/25">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2a67e]/35 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3">
                      <Camera className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>Field Records</span>
                      <span aria-hidden="true">/</span>
                      <span>Operational Visuals</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
                      Fieldwork & <span className="text-[#16a34a]">Equipment Gallery</span>
                    </h2>
                    <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
                      Authentic photographs capturing geological mappings, borehole siting, geophysical instrumentation, core recovery, and project executions.
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('gallery')}
                    className="px-6 py-3 rounded-xl bg-white hover:bg-[#16a34a] text-stone-900 hover:text-white font-bold text-xs border border-[#c2a67e]/40 shadow-xs transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
                  >
                    <span>View More Dedicated Photo Gallery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Responsive 24-Card Photographic Showcase */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {homepageImages.slice(0, 24).map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedLightboxImage(img)}
                      className="group relative rounded-2xl overflow-hidden border border-[#c2a67e]/30 bg-stone-950 aspect-square shadow-sm hover:shadow-xl hover:border-[#16a34a] transition-all cursor-pointer flex items-center justify-center"
                      title={`Click to open full preview: ${img.title} | ${img.caption}`}
                    >
                      {/* Ambient blur backdrop */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-35 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${img.url})` }}
                      />

                      <img
                        src={img.url}
                        alt={img.alt || img.title}
                        loading="lazy"
                        className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 z-20 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                      {/* Top Right Zoom Icon */}
                      <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-stone-900/80 text-[#4ade80] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>

                      {/* Bottom Caption Pill with Subtitle */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                        <span className="text-[9px] font-mono text-[#c2a67e] font-bold uppercase tracking-wider block">
                          {img.category}
                        </span>
                        <h4 className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-[#4ade80] transition-colors leading-tight mt-0.5">
                          {img.title}
                        </h4>
                        {img.caption && (
                          <p className="text-[9.5px] text-stone-200 line-clamp-1 mt-0.5 font-normal">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 11. Quick Action Consultation Banner */}
            <section className="py-20 bg-[#f6f2ec] border-t border-[#c2a67e]/30">
              <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
                <span className="text-xs font-mono text-[#8b6b3e] uppercase font-bold tracking-widest block">
                  Geoscience Meets Investment Confidence
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
                  Need Subsurface Precision for Your Next Project?
                </h2>
                <p className="text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
                  Engage our technical leads for mineral exploration, geotechnical soil testing, aquifer evaluation, or compliance reporting.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => handleNavigate('contact')}
                    className="px-7 py-3.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Initiate Technical Discussion
                  </button>
                  <a
                    href={`https://wa.me/${company.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-bold text-sm border border-[#c2a67e]/40 shadow-xs transition-all flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#16a34a]" />
                    <span>Direct WhatsApp Desk</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================
            PAGE 2: ABOUT US PAGE
            ========================================================= */}
        {currentPage === 'about' && (
          <div>
            {/* Page Header Breadcrumb */}
            <div className="bg-[#faf7f2] border-b border-[#c2a67e]/25 py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3">
                  <button onClick={() => handleNavigate('home')} className="hover:text-stone-900">Home</button>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-900 font-bold">About Us</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                  Corporate Profile & <span className="text-[#16a34a]">Leadership</span>
                </h1>
                <p className="text-base text-stone-600 mt-3 max-w-3xl leading-relaxed">
                  GiniBen & Partners GEOSERVICES LTD (GPG Ltd) is a professional geoscience consulting and contracting firm delivering high-value technical solutions across Nigeria and West Africa.
                </p>
              </div>
            </div>

            {/* Corporate Overview, The Company (CAMA 1990), Our Vision & Philosophy */}
            <CompanyIntro
              company={company}
              onOpenConsultation={() => handleOpenConsultation()}
              showFullVisionAndCompany={true}
            />

            {/* Founder's Message */}
            <FoundersMessage />

            {/* Our Value Proposition */}
            <WhyChooseSection />

            {/* Technical Team & Leadership (The 4 verified members with user photos) */}
            <TeamSection
              team={team}
            />
          </div>
        )}

        {/* =========================================================
            PAGE 3: SERVICES PAGE
            ========================================================= */}
        {currentPage === 'services' && (
          <div>
            {/* Page Header Breadcrumb */}
            <div className="bg-[#faf7f2] border-b border-[#c2a67e]/25 py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3">
                  <button onClick={() => handleNavigate('home')} className="hover:text-stone-900">Home</button>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-900 font-bold">Services</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                  What We Do & <span className="text-[#16a34a]">Practice Areas</span>
                </h1>
                <p className="text-base text-stone-600 mt-3 max-w-3xl leading-relaxed">
                  We provide integrated, data-driven services that support resource discovery, project development, environmental compliance, and engineering decision-making.
                </p>
              </div>
            </div>

            {/* Full Services Section */}
            <ServicesSection
              services={INITIAL_SERVICES}
              onSelectServiceForConsultation={(title) => handleOpenConsultation(title)}
            />
          </div>
        )}

        {/* =========================================================
            PAGE 4: PROJECTS PAGE
            ========================================================= */}
        {currentPage === 'projects' && (
          <div>
            {/* Page Header Breadcrumb */}
            <div className="bg-[#faf7f2] border-b border-[#c2a67e]/25 py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3">
                  <button onClick={() => handleNavigate('home')} className="hover:text-stone-900">Home</button>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-900 font-bold">Projects</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                  Fieldwork Portfolios & <span className="text-[#16a34a]">Case Studies</span>
                </h1>
                <p className="text-base text-stone-600 mt-3 max-w-3xl leading-relaxed">
                  Verified field investigations, drilling logs, geophysical profiles, and geotechnical studies executed to strict international standards.
                </p>
              </div>
            </div>

            {/* Featured Drilling Video (In-Place Playback, Configured for Projects Page) */}
            {projectPageVideos.length > 0 && (
              <FeaturedVideoSection
                videos={projectPageVideos}
              />
            )}

            {/* Tabular Recent Projects Component */}
            <RecentProjectsTable 
              title="Verified Recent Project Documentation"
              subtitle="Full tabular breakdown of executed industrial boreholes, groundwater schemes, and regulatory ESIA."
            />

            {/* Full Projects Section - 8 Core Disciplines */}
            <ProjectsSection
              onOpenConsultation={() => handleOpenConsultation()}
              isStandalonePage={true}
            />

            {/* Complete Photographic Fieldwork Gallery & Subtitles (Also on Projects Page) */}
            <div id="project-photographic-gallery" className="scroll-mt-10">
              <GallerySection
                images={projectPageImages}
                videos={projectPageVideos}
                selectedLightboxImage={selectedLightboxImage}
                onCloseLightbox={() => setSelectedLightboxImage(null)}
                onOpenLightbox={(img) => setSelectedLightboxImage(img)}
                isStandalonePage={true}
                showVideoSection={false}
                title="Project Photographic Evidence & Fieldwork Gallery"
                subtitle="All authentic operational photographs, field records, and subtitles documenting active drilling, geophysical resistivity imaging, core logging, and personnel on project concessions across Nigeria."
                badgeLabel="Project Field Records & Subtitles"
              />
            </div>
          </div>
        )}

        {/* =========================================================
            PAGE 5: GALLERY PAGE
            ========================================================= */}
        {currentPage === 'gallery' && (
          <div>
            {/* Page Header Breadcrumb */}
            <div className="bg-[#faf7f2] border-b border-[#c2a67e]/25 py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3">
                  <button onClick={() => handleNavigate('home')} className="hover:text-stone-900">Home</button>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-900 font-bold">Gallery</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                  Fieldwork <span className="text-[#16a34a]">Video & Photographic Archive</span>
                </h1>
                <p className="text-base text-stone-600 mt-3 max-w-3xl leading-relaxed">
                  Browse operational videos and {galleryPageImages.length} authentic field records documenting geophysical profiling, diamond core logging, borehole drilling, and personnel deployment across projects.
                </p>
              </div>
            </div>

            {/* Gallery Section with Video Gallery + Image Grid + Lightbox */}
            <GallerySection
              images={galleryPageImages}
              videos={galleryPageVideos}
              selectedLightboxImage={selectedLightboxImage}
              onCloseLightbox={() => setSelectedLightboxImage(null)}
              onOpenLightbox={(img) => setSelectedLightboxImage(img)}
              isStandalonePage={true}
            />
          </div>
        )}

        {/* =========================================================
            PAGE 6: CONTACT US PAGE
            ========================================================= */}
        {currentPage === 'contact' && (
          <div>
            {/* Page Header Breadcrumb */}
            <div className="bg-[#faf7f2] border-b border-[#c2a67e]/25 py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3">
                  <button onClick={() => handleNavigate('home')} className="hover:text-stone-900">Home</button>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-900 font-bold">Contact Us</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                  Consultation, Contacts & <span className="text-[#16a34a]">Office Location</span>
                </h1>
                <p className="text-base text-stone-600 mt-3 max-w-3xl leading-relaxed">
                  Connect with Dr. Benjamin Ukwuteyinor and our engineering team to discuss project requirements, obtain preliminary feasibility guidance, or request formal proposals.
                </p>
              </div>
            </div>

            {/* Full Contact Form, Verified Channels, Social Media, and Google Map */}
            <ContactSection
              company={company}
              preselectedService={preselectedService}
              onNewEnquiryCreated={handleNewEnquiryCreated}
              isStandalonePage={true}
            />
          </div>
        )}

      </main>

      {/* Comprehensive Footer with Dedicated Navigation */}
      <Footer
        company={company}
        onNavigate={handleNavigate}
        onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
      />

      {/* Persistent Floating WhatsApp & Phone Buttons */}
      <FloatingContact company={company} />

      {/* Full Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        onGoToHomepage={handleGoToHomepageFromAdmin}
        company={company}
        onUpdateCompany={handleUpdateCompany}
        enquiries={enquiries}
        onRefreshEnquiries={async () => {
          const enqs = await getEnquiriesFromApi();
          if (enqs && Array.isArray(enqs)) {
            setEnquiries(enqs);
            localStorage.setItem('giniben_enquiries', JSON.stringify(enqs));
          }
        }}
        onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
        onDeleteEnquiry={handleDeleteEnquiry}
        onClearAllEnquiries={handleClearAllEnquiries}
        galleryImages={galleryImages}
        onAddGalleryImage={handleAddGalleryImage}
        onUpdateGalleryImage={handleUpdateGalleryImage}
        onDeleteGalleryImage={handleDeleteGalleryImage}
        videos={projectVideos}
        onAddVideo={handleAddVideo}
        onUpdateVideo={handleUpdateVideo}
        onDeleteVideo={handleDeleteVideo}
        team={team}
        onAddTeamMember={handleAddTeamMember}
        onUpdateTeamMember={handleUpdateTeamMember}
        onDeleteTeamMember={handleDeleteTeamMember}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        company={company}
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Global High-Resolution Fill Preview Lightbox Modal */}
      <LightboxModal
        image={selectedLightboxImage}
        allImages={galleryImages}
        onClose={() => setSelectedLightboxImage(null)}
        onSelectImage={(img) => setSelectedLightboxImage(img)}
      />

    </div>
  );
}
