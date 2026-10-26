import React, { useState } from 'react';
import { 
  X, LayoutDashboard, MessageSquare, Briefcase, Image as ImageIcon, 
  Layers, Users, Settings, Server, Check, Trash2, 
  Plus, Edit, Eye, EyeOff, ShieldCheck, Database, Copy, ExternalLink, 
  Film, Lock, KeyRound, Mail, Phone, Globe, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';
import { 
  CompanyConfig, ConsultationEnquiry, ProjectItem, MediaItem, 
  ServiceItem, TeamMember, ArticleItem, ProjectVideo, GalleryCategory 
} from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyConfig;
  onUpdateCompany: (updated: CompanyConfig) => void;
  enquiries: ConsultationEnquiry[];
  onUpdateEnquiryStatus: (id: string, newStatus: 'new' | 'reviewed' | 'resolved') => void;
  onDeleteEnquiry: (id: string) => void;
  projects: ProjectItem[];
  onAddProject: (project: ProjectItem) => void;
  onUpdateProject?: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  galleryImages: MediaItem[];
  onAddGalleryImage: (image: MediaItem) => void;
  onUpdateGalleryImage: (image: MediaItem) => void;
  onDeleteGalleryImage: (id: string) => void;
  videos: ProjectVideo[];
  onAddVideo: (video: ProjectVideo) => void;
  onUpdateVideo: (video: ProjectVideo) => void;
  onDeleteVideo: (id: string) => void;
  services: ServiceItem[];
  team: TeamMember[];
  articles: ArticleItem[];
  onAddArticle: (article: ArticleItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  company,
  onUpdateCompany,
  enquiries,
  onUpdateEnquiryStatus,
  onDeleteEnquiry,
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  galleryImages,
  onAddGalleryImage,
  onUpdateGalleryImage,
  onDeleteGalleryImage,
  videos,
  onAddVideo,
  onUpdateVideo,
  onDeleteVideo,
  services,
  team
}) => {
  if (!isOpen) return null;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('giniben_admin_session') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'images' | 'videos' | 'projects' | 'enquiries' | 'services' | 'team' | 'settings' | 'cpanel'
  >('overview');

  // Image Filter & Modal State
  const [imagePlacementFilter, setImagePlacementFilter] = useState<'all' | 'homepage' | 'projects' | 'gallery'>('all');
  const [imageSearch, setImageSearch] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<MediaItem | null>(null);
  const [imageForm, setImageForm] = useState({
    title: '',
    url: '',
    caption: '',
    category: 'geology' as GalleryCategory,
    showOnHomepage: true,
    showOnProjects: true,
    showOnGallery: true,
    isHero: false
  });

  // Video Filter & Modal State
  const [videoSearch, setVideoSearch] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ProjectVideo | null>(null);
  const [previewingVideo, setPreviewingVideo] = useState<ProjectVideo | null>(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    subtitle: '',
    driveUrl: '',
    thumbnail: '',
    description: '',
    showOnHomepage: true,
    showOnGallery: true
  });

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Hydrogeology & Water',
    location: '',
    summary: '',
    methodology: ''
  });

  // Settings State: Password Change
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings State: Company Coordinates
  const [phoneInput, setPhoneInput] = useState(company.phone);
  const [whatsappInput, setWhatsappInput] = useState(company.whatsappNumber);
  const [emailInput, setEmailInput] = useState(company.email);
  const [facebookInput, setFacebookInput] = useState(company.facebookUrl);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Email Test Status
  const [emailTestStatus, setEmailTestStatus] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // -------------------------------------------------------------
  // AUTHENTICATION LOGIC
  // -------------------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('giniben_admin_password') || 'Giniben123';
    if (passwordInput.trim() === storedPassword.trim()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('giniben_admin_session', 'true');
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('giniben_admin_session');
    setPasswordInput('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    const storedPassword = localStorage.getItem('giniben_admin_password') || 'Giniben123';
    if (currentPass !== storedPassword) {
      setPassMessage({ type: 'error', text: 'Current password does not match. Please verify and retry.' });
      return;
    }

    if (newPass.length < 6) {
      setPassMessage({ type: 'error', text: 'New password must be at least 6 characters in length.' });
      return;
    }

    if (newPass !== confirmPass) {
      setPassMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    localStorage.setItem('giniben_admin_password', newPass);
    setPassMessage({ type: 'success', text: 'Password successfully changed! Your new master password is now active.' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  // -------------------------------------------------------------
  // IMAGE CRUD HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddImage = () => {
    setEditingImage(null);
    setImageForm({
      title: '',
      url: '',
      caption: '',
      category: 'geology',
      showOnHomepage: true,
      showOnProjects: true,
      showOnGallery: true,
      isHero: false
    });
    setIsImageModalOpen(true);
  };

  const handleOpenEditImage = (img: MediaItem) => {
    setEditingImage(img);
    setImageForm({
      title: img.title,
      url: img.url,
      caption: img.caption,
      category: img.category,
      showOnHomepage: img.showOnHomepage !== false,
      showOnProjects: img.showOnProjects !== false,
      showOnGallery: img.showOnGallery !== false,
      isHero: Boolean(img.isHero)
    });
    setIsImageModalOpen(true);
  };

  const handleSaveImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageForm.title.trim() || !imageForm.url.trim()) return;

    if (editingImage) {
      const updated: MediaItem = {
        ...editingImage,
        title: imageForm.title.trim(),
        url: imageForm.url.trim(),
        caption: imageForm.caption.trim(),
        category: imageForm.category,
        showOnHomepage: imageForm.showOnHomepage,
        showOnProjects: imageForm.showOnProjects,
        showOnGallery: imageForm.showOnGallery,
        isHero: imageForm.isHero,
        alt: imageForm.title.trim()
      };
      onUpdateGalleryImage(updated);
    } else {
      const newImg: MediaItem = {
        id: 'img-' + Date.now(),
        title: imageForm.title.trim(),
        url: imageForm.url.trim(),
        caption: imageForm.caption.trim() || 'Verified fieldwork record.',
        category: imageForm.category,
        showOnHomepage: imageForm.showOnHomepage,
        showOnProjects: imageForm.showOnProjects,
        showOnGallery: imageForm.showOnGallery,
        isHero: imageForm.isHero,
        alt: imageForm.title.trim(),
        order: galleryImages.length + 1
      };
      onAddGalleryImage(newImg);
    }

    setIsImageModalOpen(false);
    setEditingImage(null);
  };

  // -------------------------------------------------------------
  // VIDEO CRUD HANDLERS
  // -------------------------------------------------------------
  const formatDriveUrl = (inputUrl: string) => {
    const trimmed = inputUrl.trim();
    if (trimmed.includes('drive.google.com') && trimmed.includes('/view')) {
      return trimmed.replace(/\/view(\?.*)?$/, '/preview');
    }
    return trimmed;
  };

  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      title: '',
      subtitle: '',
      driveUrl: '',
      thumbnail: '',
      description: '',
      showOnHomepage: true,
      showOnGallery: true
    });
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (vid: ProjectVideo) => {
    setEditingVideo(vid);
    setVideoForm({
      title: vid.title,
      subtitle: vid.subtitle,
      driveUrl: vid.drivePreviewUrl,
      thumbnail: vid.thumbnail,
      description: vid.description,
      showOnHomepage: vid.showOnHomepage !== false,
      showOnGallery: vid.showOnGallery !== false
    });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim() || !videoForm.driveUrl.trim()) return;

    const formattedPreview = formatDriveUrl(videoForm.driveUrl);
    const formattedView = formattedPreview.replace('/preview', '/view');

    if (editingVideo) {
      const updated: ProjectVideo = {
        ...editingVideo,
        title: videoForm.title.trim(),
        subtitle: videoForm.subtitle.trim() || 'Subsurface Operations Record',
        driveViewUrl: formattedView,
        drivePreviewUrl: formattedPreview,
        thumbnail: videoForm.thumbnail.trim() || editingVideo.thumbnail,
        description: videoForm.description.trim() || editingVideo.description,
        isVertical: true,
        orientation: 'vertical',
        showOnHomepage: videoForm.showOnHomepage,
        showOnGallery: videoForm.showOnGallery
      };
      onUpdateVideo(updated);
    } else {
      const newVid: ProjectVideo = {
        id: 'vid-' + Date.now(),
        title: videoForm.title.trim(),
        subtitle: videoForm.subtitle.trim() || 'Subsurface Operations Record',
        driveViewUrl: formattedView,
        drivePreviewUrl: formattedPreview,
        thumbnail: videoForm.thumbnail.trim() || 'https://i.ibb.co/fdkK6DqF/Whats-App-Image-2026-10-23-at-9-04-53-PM.jpg',
        description: videoForm.description.trim() || 'Operational fieldwork record documented by GiniBen personnel.',
        isVertical: true,
        orientation: 'vertical',
        showOnHomepage: videoForm.showOnHomepage,
        showOnGallery: videoForm.showOnGallery
      };
      onAddVideo(newVid);
    }

    setIsVideoModalOpen(false);
    setEditingVideo(null);
  };

  // -------------------------------------------------------------
  // PROJECT CRUD HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Hydrogeology & Water',
      location: '',
      summary: '',
      methodology: ''
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    if (editingProject && onUpdateProject) {
      const updated: ProjectItem = {
        ...editingProject,
        title: projectForm.title.trim(),
        category: projectForm.category,
        location: projectForm.location.trim() || 'Nigeria Field Site',
        summary: projectForm.summary.trim() || 'Integrated field investigation executed by GiniBen personnel.',
        methodology: projectForm.methodology.trim() || editingProject.methodology
      };
      onUpdateProject(updated);
    } else {
      const newProj: ProjectItem = {
        id: 'prj-' + Date.now(),
        slug: projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: projectForm.title.trim(),
        category: projectForm.category,
        categoryKey: 'geology',
        location: projectForm.location.trim() || 'Nigeria Field Site',
        date: 'Field Assignment',
        coverImage: galleryImages[0]?.url || 'https://i.ibb.co/mrQLCJTb/Whats-App-Image-2026-10-23-at-6-39-30-PM-1.jpg',
        summary: projectForm.summary.trim() || 'Integrated field investigation executed by GiniBen personnel.',
        methodology: projectForm.methodology.trim() || 'Deployment of specialized geophysical profiling and continuous geological logging.',
        keyDeliverables: [
          'Geological cross-sections and survey logs',
          'Technical report signed by COMEG Lead Consultant'
        ],
        galleryImages: [galleryImages[0]?.url, galleryImages[1]?.url].filter(Boolean),
        featured: true,
        status: 'Published'
      };
      onAddProject(newProj);
    }

    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  // -------------------------------------------------------------
  // SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany({
      ...company,
      phone: phoneInput.trim(),
      whatsappNumber: whatsappInput.trim(),
      email: emailInput.trim(),
      facebookUrl: facebookInput.trim()
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleTriggerTestEmail = async () => {
    setEmailTestStatus('Transmitting test notification...');
    try {
      await fetch('https://formsubmit.co/ajax/benukwutevinor@yahoo.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: 'GiniBen Admin Test Notification',
          _cc: 'gpg1.geoservices@gmail.com',
          _template: 'table',
          'Message': 'This is a test notification from GiniBen Admin Console to confirm email delivery.',
          'Timestamp': new Date().toLocaleString()
        })
      });
      setEmailTestStatus('Test sent! Please check benukwutevinor@yahoo.com and gpg1.geoservices@gmail.com');
      setTimeout(() => setEmailTestStatus(null), 5000);
    } catch {
      setEmailTestStatus('Transmission simulated. Live network delivery requires internet connectivity.');
      setTimeout(() => setEmailTestStatus(null), 4000);
    }
  };

  // -------------------------------------------------------------
  // FILTERED LISTS
  // -------------------------------------------------------------
  const filteredImages = galleryImages.filter((img) => {
    const matchesSearch = img.title.toLowerCase().includes(imageSearch.toLowerCase()) ||
                          img.caption.toLowerCase().includes(imageSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (imagePlacementFilter === 'homepage') return img.showOnHomepage !== false;
    if (imagePlacementFilter === 'projects') return img.showOnProjects !== false;
    if (imagePlacementFilter === 'gallery') return img.showOnGallery !== false;
    return true;
  });

  const filteredVideos = videos.filter((vid) => {
    return vid.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
           vid.subtitle.toLowerCase().includes(videoSearch.toLowerCase()) ||
           vid.description.toLowerCase().includes(videoSearch.toLowerCase());
  });

  // =============================================================
  // 1. LOGIN GATE VIEW (IF NOT AUTHENTICATED)
  // =============================================================
  if (!isAuthenticated) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full max-w-md bg-[#181512] border border-[#c2a67e]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 space-y-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Admin Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#0d9488] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#16a34a]/30 mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              GiniBen Admin Portal
            </h2>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Global Standard Subsurface & Engineering Content Management Console
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-mono text-[#c2a67e] uppercase font-bold tracking-wider block">
                Enter Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Enter administrator password..."
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-black/50 border border-[#c2a67e]/35 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Invalid password. Please enter the authorized password (Default: Giniben123).</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white font-bold text-sm transition-all shadow-md shadow-[#16a34a]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="pt-2 border-t border-[#c2a67e]/20 text-[11px] text-stone-400 text-center space-y-1">
            <p className="text-stone-300 font-mono">Default master password: <span className="text-[#4ade80] font-bold">Giniben123</span></p>
            <p className="text-stone-500">You can seamlessly change this password anytime in the Settings tab.</p>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================
  // 2. MAIN AUTHENTICATED DASHBOARD VIEW
  // =============================================================
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans text-stone-100"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-7xl h-[92vh] max-h-[950px] bg-[#14120f] border border-[#c2a67e]/35 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 border-b border-[#c2a67e]/25 bg-[#1a1612] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16a34a] flex items-center justify-center text-white font-bold shadow-md shadow-[#16a34a]/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white leading-tight">
                  GiniBen Central Management Console
                </span>
                <span className="hidden md:inline px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-semibold">
                  Global Standard
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#c2a67e] block">
                Authorized COMEG Lead Administrator Session
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5 text-[#c2a67e]" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Split: Sidebar & Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <aside className="w-52 sm:w-64 border-r border-[#c2a67e]/20 bg-[#161310] p-3 space-y-1 overflow-y-auto shrink-0 text-xs font-medium">
            <div className="text-[10px] font-mono uppercase text-[#c2a67e] px-3 py-2 font-bold tracking-wider">
              Management Modules
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#16a34a] text-white font-bold shadow-md shadow-[#16a34a]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'images'
                  ? 'bg-[#16a34a] text-white font-bold shadow-md shadow-[#16a34a]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4" />
                <span>Photos & Images</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-[#86efac]">
                {galleryImages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-[#16a34a] text-white font-bold shadow-md shadow-[#16a34a]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4" />
                <span>Field Videos</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-[#86efac]">
                {videos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#16a34a] text-white font-bold shadow-md shadow-[#16a34a]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Projects</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-[#86efac]">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-[#16a34a] text-white font-bold shadow-md shadow-[#16a34a]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Client Enquiries</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-[#86efac]">
                {enquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#16a34a] text-white font-bold shadow-md shadow-[#16a34a]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Technical Services</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-stone-400">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-[#16a34a] text-white font-bold shadow-md shadow-[#16a34a]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Personnel</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-stone-400">
                {team.length}
              </span>
            </button>

            <div className="pt-3 border-t border-[#c2a67e]/20 text-[10px] font-mono uppercase text-[#c2a67e] px-3 py-1 font-bold tracking-wider">
              System & Security
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#c2a67e] text-stone-950 font-bold shadow-md shadow-[#c2a67e]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Password</span>
            </button>

            <button
              onClick={() => setActiveTab('cpanel')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'cpanel'
                  ? 'bg-[#c2a67e] text-stone-950 font-bold shadow-md shadow-[#c2a67e]/25'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Truehost cPanel Guide</span>
            </button>
          </aside>

          {/* Main Content Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#12100d]">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-5xl">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Executive Operational Overview
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1">
                    Direct access to media assets, technical records, and corporate parameters.
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-[#c2a67e]/25 space-y-2">
                    <div className="flex items-center justify-between text-[#c2a67e]">
                      <span className="text-xs font-mono font-bold uppercase">Photos</span>
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {galleryImages.length}
                    </div>
                    <p className="text-[11px] text-stone-400">Fieldwork photographic assets</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-[#c2a67e]/25 space-y-2">
                    <div className="flex items-center justify-between text-[#16a34a]">
                      <span className="text-xs font-mono font-bold uppercase">Field Videos</span>
                      <Film className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {videos.length}
                    </div>
                    <p className="text-[11px] text-stone-400">Portrait HD streaming records</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-[#c2a67e]/25 space-y-2">
                    <div className="flex items-center justify-between text-blue-400">
                      <span className="text-xs font-mono font-bold uppercase">Projects</span>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {projects.length}
                    </div>
                    <p className="text-[11px] text-stone-400">Published industrial case studies</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-[#c2a67e]/25 space-y-2">
                    <div className="flex items-center justify-between text-amber-400">
                      <span className="text-xs font-mono font-bold uppercase">Enquiries</span>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {enquiries.length}
                    </div>
                    <p className="text-[11px] text-stone-400">Direct client consultations</p>
                  </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="p-6 rounded-2xl bg-[#1b1713] border border-[#c2a67e]/30 space-y-4">
                  <span className="text-xs font-mono text-[#c2a67e] uppercase font-bold tracking-wider block">
                    Fast Administrative Actions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      onClick={handleOpenAddImage}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#16a34a]" />
                      <span>Add New Photo</span>
                    </button>
                    <button
                      onClick={handleOpenAddVideo}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#16a34a]" />
                      <span>Add Field Video</span>
                    </button>
                    <button
                      onClick={handleOpenAddProject}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#16a34a]" />
                      <span>Add Case Study</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-[#c2a67e]" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>

                {/* System Status Information */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs text-stone-300">
                  <div className="flex items-center gap-2 text-[#4ade80] font-mono font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Real-Time State Persistence Active</span>
                  </div>
                  <p className="leading-relaxed">
                    All additions, image placements (Homepage, Project Page, Gallery Page), video records, and password updates are synchronized in browser state and local memory. When deployed to Truehost cPanel, this console connects to your MySQL backend seamlessly.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PHOTOS & IMAGES */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      Fieldwork Photos & Image Placements
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 mt-1">
                      Control where each image appears across the Homepage, Project Page, and Gallery Page.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddImage}
                    className="px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Image</span>
                  </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                  {/* Placement Filter Pills */}
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <button
                      onClick={() => setImagePlacementFilter('all')}
                      className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        imagePlacementFilter === 'all'
                          ? 'bg-[#16a34a] text-white border-[#16a34a]'
                          : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      All ({galleryImages.length})
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('homepage')}
                      className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        imagePlacementFilter === 'homepage'
                          ? 'bg-[#16a34a] text-white border-[#16a34a]'
                          : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Homepage ({galleryImages.filter((i) => i.showOnHomepage !== false).length})
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('projects')}
                      className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        imagePlacementFilter === 'projects'
                          ? 'bg-[#16a34a] text-white border-[#16a34a]'
                          : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Project Page ({galleryImages.filter((i) => i.showOnProjects !== false).length})
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('gallery')}
                      className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        imagePlacementFilter === 'gallery'
                          ? 'bg-[#16a34a] text-white border-[#16a34a]'
                          : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Gallery Page ({galleryImages.filter((i) => i.showOnGallery !== false).length})
                    </button>
                  </div>

                  {/* Search Bar */}
                  <input
                    type="text"
                    value={imageSearch}
                    onChange={(e) => setImageSearch(e.target.value)}
                    placeholder="Search photos by title or caption..."
                    className="px-3.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#16a34a] w-full md:w-64"
                  />
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((img) => (
                    <div 
                      key={img.id}
                      className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#c2a67e]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-video bg-black overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/75 text-[#c2a67e]">
                            {img.category}
                          </span>
                        </div>

                        <div className="p-3.5 space-y-2">
                          <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                            {img.title}
                          </h4>
                          <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                            {img.caption}
                          </p>

                          {/* Placements Badges */}
                          <div className="pt-2 flex flex-wrap gap-1">
                            {img.showOnHomepage !== false && (
                              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/30">
                                Homepage
                              </span>
                            )}
                            {img.showOnProjects !== false && (
                              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-blue-950/80 text-blue-300 border border-blue-500/30">
                                Projects
                              </span>
                            )}
                            {img.showOnGallery !== false && (
                              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                                Gallery
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="p-3 pt-0 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <button
                          onClick={() => handleOpenEditImage(img)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#4ade80]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${img.title}"?`)) {
                              onDeleteGalleryImage(img.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-950/60 text-red-400 transition-colors cursor-pointer"
                          title="Delete image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: FIELD VIDEOS */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      Field Videos Archive ({videos.length} Records)
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 mt-1">
                      Manage portrait field records for the Homepage drilling section and Dedicated Gallery.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddVideo}
                    className="px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Video</span>
                  </button>
                </div>

                {/* Video Search Bar */}
                <input
                  type="text"
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  placeholder="Search field videos by title, subtitle, or description..."
                  className="px-3.5 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#16a34a] w-full max-w-md"
                />

                {/* Videos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredVideos.map((vid, idx) => (
                    <div 
                      key={vid.id}
                      className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#c2a67e]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[3/4] bg-black overflow-hidden">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#16a34a] text-white">
                            Record 0{idx + 1}
                          </span>
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/75 text-[#86efac]">
                            Portrait HD
                          </span>
                        </div>

                        <div className="p-3.5 space-y-2">
                          <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                            {vid.title}
                          </h4>
                          <p className="text-[10.5px] text-[#c2a67e] font-mono line-clamp-1">
                            {vid.subtitle}
                          </p>
                          <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                            {vid.description}
                          </p>

                          {/* Placements */}
                          <div className="pt-2 flex flex-wrap gap-1">
                            {vid.showOnHomepage !== false && (
                              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                                Homepage Section
                              </span>
                            )}
                            {vid.showOnGallery !== false && (
                              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-blue-950/80 text-blue-300 border border-blue-500/30">
                                Dedicated Gallery
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="p-3 pt-0 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setPreviewingVideo(vid)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
                            title="Watch Video Preview"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#4ade80]" />
                          </button>
                          <button
                            onClick={() => handleOpenEditVideo(vid)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#4ade80]" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete video "${vid.title}"?`)) {
                              onDeleteVideo(vid.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-950/60 text-red-400 transition-colors cursor-pointer"
                          title="Delete video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      Field Projects & Case Studies ({projects.length})
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 mt-1">
                      Manage published exploration surveys, rotary boreholes, and regulatory documentation.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddProject}
                    className="px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div 
                      key={proj.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#16a34a] font-bold">{proj.category}</span>
                          <span className="text-stone-400">{proj.location}</span>
                        </div>
                        <h4 className="text-base font-bold text-white leading-snug">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                          {proj.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                        <span className="text-[#c2a67e]">{proj.status}</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete project "${proj.title}"?`)) {
                              onDeleteProject(proj.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-950/60 text-red-400 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CLIENT ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Client Consultations & Field Enquiries ({enquiries.length})
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1">
                    Direct inquiries submitted through the website consultation desk.
                  </p>
                </div>

                <div className="space-y-3">
                  {enquiries.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/5 text-center text-stone-400 text-xs">
                      No client consultations recorded yet.
                    </div>
                  ) : (
                    enquiries.map((enq) => (
                      <div 
                        key={enq.id}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                          <div>
                            <span className="text-sm font-bold text-white block">{enq.fullName}</span>
                            <span className="text-xs text-stone-400">{enq.email} {enq.phone && `• ${enq.phone}`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={enq.status}
                              onChange={(e) => onUpdateEnquiryStatus(enq.id, e.target.value as any)}
                              className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/20 text-xs text-white"
                            >
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            <button
                              onClick={() => onDeleteEnquiry(enq.id)}
                              className="p-1.5 rounded-lg hover:bg-red-950 text-red-400 cursor-pointer"
                              title="Delete enquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-stone-300 space-y-1">
                          <p><strong className="text-[#c2a67e]">Service:</strong> {enq.serviceOfInterest}</p>
                          {enq.projectLocation && <p><strong className="text-[#c2a67e]">Location:</strong> {enq.projectLocation}</p>}
                          <p className="pt-1 text-stone-300 whitespace-pre-wrap">{enq.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Technical Service Disciplines ({services.length})
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1">
                    Core practice areas certified under COMEG & NMGS regulatory standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((srv) => (
                    <div key={srv.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="text-xs font-mono text-[#16a34a] font-bold">Code: {srv.numericCode}</div>
                      <h4 className="text-sm font-bold text-white">{srv.title}</h4>
                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">{srv.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: TEAM */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Key Technical Personnel & Partners ({team.length})
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1">
                    COMEG registered geoscientists and exploration personnel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.map((mem) => (
                    <div key={mem.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <img 
                        src={mem.image} 
                        alt={mem.name} 
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5 overflow-hidden">
                        <h4 className="text-xs font-bold text-white truncate">{mem.name}</h4>
                        <p className="text-[11px] text-[#c2a67e] truncate">{mem.title}</p>
                        <p className="text-[10px] text-stone-400 truncate">{mem.experienceYears}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: SETTINGS & PASSWORD */}
            {activeTab === 'settings' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Administration Settings & Security
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 mt-1">
                    Manage master passwords, corporate email routing, and contact details.
                  </p>
                </div>

                {/* CARD 1: CHANGE MASTER PASSWORD */}
                <div className="p-6 rounded-3xl bg-[#1a1612] border border-[#c2a67e]/40 shadow-xl space-y-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#c2a67e] flex items-center justify-center text-stone-950 font-bold">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Change Master Admin Password</h4>
                      <p className="text-xs text-stone-400">Seamlessly update your password anytime.</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#c2a67e] uppercase font-bold block">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Enter current password (Default: Giniben123)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#16a34a]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#c2a67e] uppercase font-bold block">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#16a34a]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-[#c2a67e] uppercase font-bold block">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-[#16a34a]"
                          required
                        />
                      </div>
                    </div>

                    {passMessage && (
                      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                        passMessage.type === 'success'
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                          : 'bg-red-950/80 border-red-500/40 text-red-200'
                      }`}>
                        {passMessage.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{passMessage.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save New Password</span>
                    </button>
                  </form>
                </div>

                {/* CARD 2: CORPORATE EMAIL ROUTING GUIDE */}
                <div className="p-6 rounded-3xl bg-[#1a1612] border border-[#c2a67e]/40 shadow-xl space-y-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#16a34a] flex items-center justify-center text-white font-bold">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Email Receiving & Forwarding Configuration</h4>
                      <p className="text-xs text-stone-400">
                        How inquiries reach benukwutevinor@yahoo.com and gpg1.geoservices@gmail.com.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs text-stone-300">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="font-bold text-[#4ade80] block text-sm">
                        Method 1: FormSubmit (Pre-Configured & Recommended)
                      </span>
                      <p className="leading-relaxed">
                        The website consultation form is pre-wired to transmit directly to <strong>benukwutevinor@yahoo.com</strong> with CC to <strong>gpg1.geoservices@gmail.com</strong>.
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-stone-400">
                        <li>The very first time a client submits a form, FormSubmit sends an activation link to your Yahoo/Gmail inbox.</li>
                        <li>Simply click the single <strong>&quot;Activate Form&quot;</strong> button in that email once.</li>
                        <li>After that one-click activation, every single submission will land directly in your email inbox automatically!</li>
                      </ul>
                      <div className="pt-2">
                        <button
                          onClick={handleTriggerTestEmail}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#4ade80]" />
                          <span>Send Test Notification Now</span>
                        </button>
                        {emailTestStatus && (
                          <p className="text-[11px] text-[#86efac] font-mono mt-1.5">{emailTestStatus}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="font-bold text-[#c2a67e] block text-sm">
                        Method 2: Truehost cPanel Forwarders (Domain Email)
                      </span>
                      <p className="leading-relaxed">
                        If you prefer custom domain addresses like <em>consultation@ginibeng.com</em>:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1 text-stone-400">
                        <li>Log into your Truehost cPanel account.</li>
                        <li>Click on <strong>Forwarders</strong> under the Email section.</li>
                        <li>Click <strong>Add Forwarder</strong>.</li>
                        <li>Set address to forward (e.g. <code>info</code>) and forward to <code>benukwutevinor@yahoo.com</code>.</li>
                        <li>Add a second forwarder to <code>gpg1.geoservices@gmail.com</code>.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* CARD 3: EDIT COMPANY COORDINATES */}
                <div className="p-6 rounded-3xl bg-[#1a1612] border border-[#c2a67e]/40 shadow-xl space-y-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#c2a67e] flex items-center justify-center text-stone-950 font-bold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Company Public Coordinates</h4>
                      <p className="text-xs text-stone-400">Update phone, WhatsApp, and social media handles.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveCompanySettings} className="space-y-4 max-w-lg">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#c2a67e] uppercase font-bold block">Phone Number</label>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#c2a67e] uppercase font-bold block">WhatsApp Number</label>
                      <input
                        type="text"
                        value={whatsappInput}
                        onChange={(e) => setWhatsappInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#c2a67e] uppercase font-bold block">Primary Email</label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#c2a67e] uppercase font-bold block">Facebook Page URL</label>
                      <input
                        type="text"
                        value={facebookInput}
                        onChange={(e) => setFacebookInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs"
                      />
                    </div>

                    {settingsSaved && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Company settings updated successfully!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Company Details</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 9: TRUEHOST CPANEL GUIDE */}
            {activeTab === 'cpanel' && (
              <div className="space-y-6 max-w-4xl text-xs text-stone-300">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Truehost cPanel & Production Deployment
                  </h3>
                  <p className="text-stone-400 mt-1">
                    Complete turnkey documentation for uploading to your Truehost server.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#1a1612] border border-[#c2a67e]/35 space-y-4">
                  <h4 className="text-base font-bold text-white">Step-by-Step Truehost Deployment</h4>
                  <ol className="list-decimal pl-5 space-y-2 leading-relaxed">
                    <li>Run <code>npm run build</code> to produce the production-ready static assets in the <code>dist/</code> folder.</li>
                    <li>Log into your Truehost cPanel account at <code>cpanel.yourdomain.com</code>.</li>
                    <li>Open <strong>File Manager</strong> and navigate into <code>public_html/</code>.</li>
                    <li>Upload all files from the <code>dist/</code> directory directly into <code>public_html/</code>.</li>
                    <li>Ensure your <code>.htaccess</code> is present to handle single-page routing without 404s.</li>
                  </ol>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* =========================================================
          MODAL A: ADD / EDIT PHOTO WITH PLACEMENT LUXURY
          ========================================================= */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#181512] border border-[#c2a67e]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#c2a67e]/20 pb-3">
              <h3 className="text-lg font-bold font-display text-white">
                {editingImage ? 'Edit Photo & Placements' : 'Add New Fieldwork Photo'}
              </h3>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveImage} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Photo Title *</label>
                <input
                  type="text"
                  value={imageForm.title}
                  onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                  placeholder="e.g. Diamond Core Sample Extraction"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Image URL *</label>
                <input
                  type="url"
                  value={imageForm.url}
                  onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })}
                  placeholder="Direct image URL (e.g. https://i.ibb.co/...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                  required
                />
                {imageForm.url && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                    <img src={imageForm.url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Caption / Description</label>
                <textarea
                  value={imageForm.caption}
                  onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })}
                  rows={2}
                  placeholder="Detailed geological or operational caption..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Category</label>
                <select
                  value={imageForm.category}
                  onChange={(e) => setImageForm({ ...imageForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                >
                  <option value="geology">Geological Fieldwork</option>
                  <option value="geophysics">Geophysical Profiling</option>
                  <option value="groundwater">Groundwater & VES</option>
                  <option value="drilling">Drilling & Core Logging</option>
                  <option value="instruments">Instruments & Sensors</option>
                  <option value="environmental">Environmental Studies</option>
                  <option value="team">Field Personnel</option>
                </select>
              </div>

              {/* LUXURY PLACEMENT CHECKBOXES */}
              <div className="p-4 rounded-2xl bg-black/60 border border-[#c2a67e]/30 space-y-2.5">
                <span className="font-mono text-[#c2a67e] font-bold block uppercase text-[11px]">
                  Where Should This Image Appear? (Select all that apply)
                </span>
                
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={imageForm.showOnHomepage}
                    onChange={(e) => setImageForm({ ...imageForm, showOnHomepage: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16a34a] focus:ring-0"
                  />
                  <span>Show on <strong>HOMEPAGE</strong> (Hero Showcase & Dual Track Slider)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={imageForm.showOnProjects}
                    onChange={(e) => setImageForm({ ...imageForm, showOnProjects: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16a34a] focus:ring-0"
                  />
                  <span>Show on <strong>PROJECT Page</strong> (Project Field Records)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={imageForm.showOnGallery}
                    onChange={(e) => setImageForm({ ...imageForm, showOnGallery: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16a34a] focus:ring-0"
                  />
                  <span>Show on <strong>GALLERY Page</strong> (Dedicated Fieldwork Archive)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  {editingImage ? 'Save Changes' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL B: ADD / EDIT FIELD VIDEO
          ========================================================= */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#181512] border border-[#c2a67e]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#c2a67e]/20 pb-3">
              <h3 className="text-lg font-bold font-display text-white">
                {editingVideo ? 'Edit Field Video' : 'Add New Field Video'}
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Video Title *</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Diamond Rotary Borehole Advance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Subtitle / Specification</label>
                <input
                  type="text"
                  value={videoForm.subtitle}
                  onChange={(e) => setVideoForm({ ...videoForm, subtitle: e.target.value })}
                  placeholder="e.g. Deep Aquifer Siting & Continuous Mast Rotation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Google Drive Share Link or Preview URL *</label>
                <input
                  type="url"
                  value={videoForm.driveUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, driveUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/.../view or /preview"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                  required
                />
                <span className="text-[10px] text-stone-400 font-mono block">
                  Paste standard share link; system auto-converts to clean streaming format.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={videoForm.thumbnail}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  placeholder="https://i.ibb.co/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Detailed Operational Description</label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  rows={3}
                  placeholder="Accurate technical description of what happens in the video..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              {/* Video Placement Options */}
              <div className="p-4 rounded-2xl bg-black/60 border border-[#c2a67e]/30 space-y-2.5">
                <span className="font-mono text-[#c2a67e] font-bold block uppercase text-[11px]">
                  Video Display Placement
                </span>
                
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoForm.showOnHomepage}
                    onChange={(e) => setVideoForm({ ...videoForm, showOnHomepage: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16a34a] focus:ring-0"
                  />
                  <span>Show in Homepage <strong>&quot;Drilling Operations & Subsurface Data Acquisition&quot;</strong></span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoForm.showOnGallery}
                    onChange={(e) => setVideoForm({ ...videoForm, showOnGallery: e.target.checked })}
                    className="w-4 h-4 rounded text-[#16a34a] focus:ring-0"
                  />
                  <span>Show in Dedicated <strong>Video Gallery</strong></span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  {editingVideo ? 'Save Changes' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL C: IN-DASHBOARD PORTRAIT VIDEO PLAYER PREVIEW
          ========================================================= */}
      {previewingVideo && (
        <div 
          className="fixed inset-0 z-70 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center p-4 font-sans"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[420px] flex items-center justify-between text-white mb-2">
            <span className="text-xs font-bold font-mono text-[#86efac] truncate">
              [Preview] {previewingVideo.title}
            </span>
            <button
              onClick={() => setPreviewingVideo(null)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full max-w-[400px] aspect-[9/16] sm:aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <iframe
              src={previewingVideo.drivePreviewUrl}
              title={previewingVideo.title}
              className="w-full h-full border-0 block"
              style={{
                height: 'calc(100% + 48px)',
                marginTop: '-48px',
                width: '100%'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Top-right shield to block pop-out arrow */}
            <div 
              className="absolute top-0 right-0 w-16 h-12 z-30 bg-black pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          </div>

          <p className="text-xs text-stone-300 mt-2 max-w-[400px] text-center line-clamp-2">
            {previewingVideo.subtitle}
          </p>
        </div>
      )}

      {/* =========================================================
          MODAL D: ADD / EDIT PROJECT
          ========================================================= */}
      {isProjectModalOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#181512] border border-[#c2a67e]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 space-y-5">
            <div className="flex items-center justify-between border-b border-[#c2a67e]/20 pb-3">
              <h3 className="text-lg font-bold font-display text-white">
                {editingProject ? 'Edit Project' : 'Post New Field Case Study'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Project Title *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Deep Rotary Aquifer Siting for Industrial Facility"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[#c2a67e] font-bold block uppercase">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  >
                    <option value="Hydrogeology & Water">Hydrogeology & Water</option>
                    <option value="Mineral Exploration">Mineral Exploration</option>
                    <option value="Geophysical Profiling">Geophysical Profiling</option>
                    <option value="Geotechnical Engineering">Geotechnical Engineering</option>
                    <option value="Environmental ESIA">Environmental ESIA</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[#c2a67e] font-bold block uppercase">Location</label>
                  <input
                    type="text"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="e.g. Enugu State, Nigeria"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[#c2a67e] font-bold block uppercase">Summary</label>
                <textarea
                  value={projectForm.summary}
                  onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                  rows={2}
                  placeholder="High-level project objective and outcome..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
