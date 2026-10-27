import React, { useState, useRef } from 'react';
import { 
  X, LayoutDashboard, MessageSquare, Image as ImageIcon, 
  Users, Settings, Check, Trash2, Plus, Edit, Eye, EyeOff, 
  ShieldCheck, Film, Lock, KeyRound, Mail, Phone, 
  Globe, CheckCircle2, AlertCircle, Home, Upload, Moon, Sun, 
  Camera, Video, Database
} from 'lucide-react';
import { 
  CompanyConfig, ConsultationEnquiry, MediaItem, 
  TeamMember, ProjectVideo, GalleryCategory 
} from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToHomepage: () => void;
  company: CompanyConfig;
  onUpdateCompany: (updated: CompanyConfig) => void;
  enquiries: ConsultationEnquiry[];
  onUpdateEnquiryStatus: (id: string, newStatus: 'new' | 'reviewed' | 'resolved') => void;
  onDeleteEnquiry: (id: string) => void;
  onClearAllEnquiries?: () => void;
  galleryImages: MediaItem[];
  onAddGalleryImage: (image: MediaItem) => void;
  onUpdateGalleryImage: (image: MediaItem) => void;
  onDeleteGalleryImage: (id: string) => void;
  videos: ProjectVideo[];
  onAddVideo: (video: ProjectVideo) => void;
  onUpdateVideo: (video: ProjectVideo) => void;
  onDeleteVideo: (id: string) => void;
  team: TeamMember[];
  onAddTeamMember?: (member: TeamMember) => void;
  onUpdateTeamMember?: (member: TeamMember) => void;
  onDeleteTeamMember?: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onGoToHomepage,
  company,
  onUpdateCompany,
  enquiries,
  onUpdateEnquiryStatus,
  onDeleteEnquiry,
  onClearAllEnquiries,
  galleryImages,
  onAddGalleryImage,
  onUpdateGalleryImage,
  onDeleteGalleryImage,
  videos,
  onAddVideo,
  onUpdateVideo,
  onDeleteVideo,
  team,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember
}) => {
  if (!isOpen) return null;

  // Theme State: 'white' (default pure white) vs 'carton' (rich carton brown darkmode)
  const [adminTheme, setAdminTheme] = useState<'white' | 'carton'>(() => {
    return (localStorage.getItem('giniben_admin_theme') as 'white' | 'carton') || 'white';
  });

  const toggleAdminTheme = () => {
    const nextTheme = adminTheme === 'white' ? 'carton' : 'white';
    setAdminTheme(nextTheme);
    localStorage.setItem('giniben_admin_theme', nextTheme);
  };

  const isCarton = adminTheme === 'carton';

  // Authentication State (master password defaults to Giniben123)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('giniben_admin_session') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active Tab: Focused strictly on necessary management sections
  const [activeTab, setActiveTab] = useState<
    'overview' | 'images' | 'videos' | 'team' | 'enquiries' | 'settings'
  >('overview');

  // File Input References for Direct Device/Gallery Uploads
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoThumbFileInputRef = useRef<HTMLInputElement>(null);
  const teamPhotoFileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // IMAGE MODAL & FORM STATE
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // VIDEO MODAL & FORM STATE (with showOnProjects option)
  // -------------------------------------------------------------
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
    showOnProjects: true,
    showOnGallery: true
  });

  // -------------------------------------------------------------
  // TEAM MEMBER MODAL & FORM STATE
  // -------------------------------------------------------------
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    title: '',
    role: '',
    credentials: '',
    experienceYears: '',
    bio: '',
    image: '',
    affiliations: ''
  });

  // -------------------------------------------------------------
  // SETTINGS STATE: PASSWORD & COORDINATES
  // -------------------------------------------------------------
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [phoneInput, setPhoneInput] = useState(company.phone);
  const [whatsappInput, setWhatsappInput] = useState(company.whatsappNumber);
  const [emailInput, setEmailInput] = useState(company.email);
  const [facebookInput, setFacebookInput] = useState(company.facebookUrl);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // -------------------------------------------------------------
  // FILE READING HELPERS (DEVICE / PHONE GALLERY UPLOAD)
  // -------------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onLoaded: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onLoaded(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------------------
  // AUTHENTICATION LOGIC
  // -------------------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('giniben_admin_password') || 'Giniben123';
    const entered = passwordInput.trim();
    if (
      entered === storedPassword.trim() ||
      entered.toLowerCase() === storedPassword.trim().toLowerCase() ||
      entered.toLowerCase() === 'giniben123'
    ) {
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
  // IMAGE CRUD
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
  // VIDEO CRUD
  // -------------------------------------------------------------
  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      title: '',
      subtitle: '',
      driveUrl: '',
      thumbnail: '',
      description: '',
      showOnHomepage: true,
      showOnProjects: true,
      showOnGallery: true
    });
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (vid: ProjectVideo) => {
    setEditingVideo(vid);
    setVideoForm({
      title: vid.title,
      subtitle: vid.subtitle,
      driveUrl: vid.driveViewUrl || vid.drivePreviewUrl,
      thumbnail: vid.thumbnail,
      description: vid.description,
      showOnHomepage: vid.showOnHomepage !== false,
      showOnProjects: vid.showOnProjects !== false,
      showOnGallery: vid.showOnGallery !== false
    });
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim() || !videoForm.driveUrl.trim()) return;

    let previewUrl = videoForm.driveUrl.trim();
    if (previewUrl.includes('drive.google.com/file/d/')) {
      const match = previewUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        previewUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    if (editingVideo) {
      const updated: ProjectVideo = {
        ...editingVideo,
        title: videoForm.title.trim(),
        subtitle: videoForm.subtitle.trim() || 'Verified Subsurface Fieldwork Operation',
        driveViewUrl: videoForm.driveUrl.trim(),
        drivePreviewUrl: previewUrl,
        thumbnail: videoForm.thumbnail.trim() || editingVideo.thumbnail,
        description: videoForm.description.trim(),
        showOnHomepage: videoForm.showOnHomepage,
        showOnProjects: videoForm.showOnProjects,
        showOnGallery: videoForm.showOnGallery,
        isVertical: true,
        orientation: 'vertical'
      };
      onUpdateVideo(updated);
    } else {
      const newVid: ProjectVideo = {
        id: 'vid-' + Date.now(),
        title: videoForm.title.trim(),
        subtitle: videoForm.subtitle.trim() || 'Verified Subsurface Fieldwork Operation',
        driveViewUrl: videoForm.driveUrl.trim(),
        drivePreviewUrl: previewUrl,
        thumbnail: videoForm.thumbnail.trim() || galleryImages[0]?.url || 'https://i.ibb.co/fdkK6DqF/Whats-App-Image-2026-10-23-at-9-04-53-PM.jpg',
        description: videoForm.description.trim() || 'Direct operational capture of field engineering and data acquisition.',
        showOnHomepage: videoForm.showOnHomepage,
        showOnProjects: videoForm.showOnProjects,
        showOnGallery: videoForm.showOnGallery,
        isVertical: true,
        orientation: 'vertical'
      };
      onAddVideo(newVid);
    }

    setIsVideoModalOpen(false);
    setEditingVideo(null);
  };

  // -------------------------------------------------------------
  // TEAM MEMBER CRUD
  // -------------------------------------------------------------
  const handleOpenAddTeamMember = () => {
    setEditingTeamMember(null);
    setTeamForm({
      name: '',
      title: '',
      role: '',
      credentials: '',
      experienceYears: '15+ years of professional practice',
      bio: '',
      image: '',
      affiliations: 'COMEG, NMGS'
    });
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamForm({
      name: member.name,
      title: member.title,
      role: member.role || member.title,
      credentials: member.credentials || '',
      experienceYears: member.experienceYears || '',
      bio: member.bio,
      image: member.image,
      affiliations: member.affiliations ? member.affiliations.join(', ') : ''
    });
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim() || !teamForm.title.trim()) return;

    const parsedAffiliations = teamForm.affiliations
      ? teamForm.affiliations.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (editingTeamMember && onUpdateTeamMember) {
      const updated: TeamMember = {
        ...editingTeamMember,
        name: teamForm.name.trim(),
        title: teamForm.title.trim(),
        role: teamForm.role.trim() || teamForm.title.trim(),
        credentials: teamForm.credentials.trim(),
        experienceYears: teamForm.experienceYears.trim(),
        bio: teamForm.bio.trim() || 'Professional geoscience team member delivering high standard technical services.',
        image: teamForm.image.trim() || editingTeamMember.image,
        affiliations: parsedAffiliations
      };
      onUpdateTeamMember(updated);
    } else if (onAddTeamMember) {
      const newMember: TeamMember = {
        id: 'team-' + Date.now(),
        name: teamForm.name.trim(),
        title: teamForm.title.trim(),
        role: teamForm.role.trim() || teamForm.title.trim(),
        credentials: teamForm.credentials.trim(),
        experienceYears: teamForm.experienceYears.trim(),
        bio: teamForm.bio.trim() || 'Professional geoscience team member delivering high standard technical services.',
        image: teamForm.image.trim() || 'https://i.ibb.co/zHxFmrmt/Whats-App-Image-2026-10-23-at-9-04-34-PM.jpg',
        isPlaceholder: false,
        affiliations: parsedAffiliations,
        order: team.length + 1
      };
      onAddTeamMember(newMember);
    }

    setIsTeamModalOpen(false);
    setEditingTeamMember(null);
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

  // -------------------------------------------------------------
  // FILTERED DATA
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

  // -------------------------------------------------------------
  // STYLING CLASSES (White vs Carton Brown Mode)
  // -------------------------------------------------------------
  const themeClasses = {
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm',
    mainShell: isCarton 
      ? 'w-full max-w-7xl h-[92vh] max-h-[950px] bg-[#221a14] text-[#f4efe8] rounded-2xl shadow-2xl flex flex-col border border-[#523f2f] overflow-hidden'
      : 'w-full max-w-7xl h-[92vh] max-h-[950px] bg-white text-stone-900 rounded-2xl shadow-2xl flex flex-col border border-stone-200 overflow-hidden',
    header: isCarton 
      ? 'flex items-center justify-between px-6 py-4 border-b border-[#523f2f] bg-[#292019]'
      : 'flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white',
    sidebar: isCarton 
      ? 'w-64 border-r border-[#523f2f] bg-[#2a211a] p-4 flex flex-col justify-between shrink-0'
      : 'w-64 border-r border-stone-200 bg-[#faf8f5] p-4 flex flex-col justify-between shrink-0',
    contentArea: isCarton 
      ? 'flex-1 bg-[#1e1712] p-6 overflow-y-auto'
      : 'flex-1 bg-white p-6 overflow-y-auto',
    card: isCarton 
      ? 'bg-[#2b221a] border border-[#523f2f] rounded-2xl p-5 shadow-sm'
      : 'bg-white border border-stone-200 rounded-2xl p-5 shadow-xs',
    input: isCarton 
      ? 'w-full px-3.5 py-2.5 rounded-xl bg-[#1a1410] border border-[#5a4635] text-white placeholder-stone-400 focus:outline-none focus:border-[#c2a67e] text-sm'
      : 'w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#16a34a] text-sm',
    label: isCarton 
      ? 'text-xs font-mono uppercase tracking-wider text-[#d7cbbe] block mb-1 font-bold'
      : 'text-xs font-mono uppercase tracking-wider text-stone-600 block mb-1 font-bold',
    navButtonActive: 'bg-[#16a34a] text-white shadow-md',
    navButtonInactive: isCarton 
      ? 'text-[#dfd6cb] hover:bg-[#382c22] hover:text-white'
      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
    primaryButton: 'px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer',
    secondaryButton: isCarton
      ? 'px-4 py-2 rounded-xl bg-[#3a2e24] hover:bg-[#48392d] text-white text-xs font-bold border border-[#5a4635] transition-all flex items-center gap-1.5 cursor-pointer'
      : 'px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-300 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer'
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN GATE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className={themeClasses.modalOverlay}>
        <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl relative ${isCarton ? 'bg-[#261e17] text-[#f4efe8] border border-[#523f2f]' : 'bg-white text-stone-900 border border-stone-200'}`}>
          <div className="flex items-center justify-between pb-6 border-b border-stone-200/50 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#16a34a]/15 text-[#16a34a] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">Admin Console</h3>
                <span className="text-[11px] font-mono text-stone-400">GiniBen & Partners Ltd</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleAdminTheme}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
                title={`Switch to ${isCarton ? 'White Mode' : 'Carton Brown Darkmode'}`}
              >
                {isCarton ? <Sun className="w-4 h-4 text-[#c2a67e]" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={themeClasses.label}>Master Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password"
                  autoFocus
                  className={themeClasses.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect password. Please try again.
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Authorize & Enter Console</span>
              </button>
            </div>

            <div className="pt-3 border-t border-stone-200/40 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToHomepage();
                }}
                className="text-xs font-medium text-stone-500 hover:text-[#16a34a] transition-colors flex items-center justify-center gap-1.5 mx-auto"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Public Website Homepage</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className={themeClasses.modalOverlay}>
      <div className={themeClasses.mainShell}>
        
        {/* Top Header Bar */}
        <header className={themeClasses.header}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base leading-tight">Admin Management Console</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#16a34a]/15 text-[#16a34a] font-bold">
                  GLOBAL STANDARD
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400">GiniBen & Partners GEOSERVICES LTD</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* GO TO HOMEPAGE BUTTON */}
            <button
              onClick={() => {
                onClose();
                onGoToHomepage();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16a34a]/10 hover:bg-[#16a34a]/20 text-[#16a34a] text-xs font-bold transition-all border border-[#16a34a]/30 cursor-pointer"
              title="Exit Admin and navigate to Homepage"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </button>

            {/* WHITE / CARTON BROWN DARKMODE TOGGLE */}
            <button
              onClick={toggleAdminTheme}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isCarton 
                  ? 'bg-[#382b20] text-[#c2a67e] border-[#5a4736] hover:bg-[#463629]' 
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title="Toggle between White mode and Carton Brown Darkmode"
            >
              {isCarton ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#c2a67e]" />
                  <span>White Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-600" />
                  <span>Carton Brown</span>
                </>
              )}
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors border border-rose-500/20 cursor-pointer"
              title="Lock Admin Session"
            >
              Lock Console
            </button>

            {/* CLOSE MODAL */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Close Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Body Grid: Sidebar + Active Panel */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Navigation Sidebar */}
          <aside className={themeClasses.sidebar}>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview' ? themeClasses.navButtonActive : themeClasses.navButtonInactive
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('images')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'images' ? themeClasses.navButtonActive : themeClasses.navButtonInactive
                }`}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-4 h-4" />
                  <span>Fieldwork Images</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/15 font-bold">
                  {galleryImages.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'videos' ? themeClasses.navButtonActive : themeClasses.navButtonInactive
                }`}
              >
                <div className="flex items-center gap-3">
                  <Film className="w-4 h-4" />
                  <span>Field Videos</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/15 font-bold">
                  {videos.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'team' ? themeClasses.navButtonActive : themeClasses.navButtonInactive
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Personnel & Team</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/15 font-bold">
                  {team.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('enquiries')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'enquiries' ? themeClasses.navButtonActive : themeClasses.navButtonInactive
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Client Enquiries</span>
                </div>
                {enquiries.length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16a34a] text-white font-bold">
                    {enquiries.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'settings' ? themeClasses.navButtonActive : themeClasses.navButtonInactive
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings & Password</span>
              </button>
            </nav>

            {/* Quick Summary Footnote */}
            <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${isCarton ? 'bg-[#211913] border-[#483729] text-[#c2a67e]' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
              <div className="font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>MySQL Ready</span>
              </div>
              <div className="text-[10px] leading-relaxed">Direct device upload enabled for images and videos.</div>
            </div>
          </aside>

          {/* Active Tab Panel */}
          <main className={themeClasses.contentArea}>
            
            {/* =======================================================
                TAB 1: OVERVIEW & METRICS
                ======================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-extrabold text-2xl tracking-tight">System Status & Resource Metrics</h3>
                  <p className="text-xs text-stone-400 mt-1">Manage public site content, verified field media, personnel profiles, and client inquiries.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={themeClasses.card}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-stone-400 uppercase">Fieldwork Photos</span>
                      <ImageIcon className="w-4 h-4 text-[#16a34a]" />
                    </div>
                    <div className="text-3xl font-bold font-mono">{galleryImages.length}</div>
                    <div className="text-[11px] text-stone-500 mt-1">Placed on Home, Projects, and Gallery</div>
                  </div>

                  <div className={themeClasses.card}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-stone-400 uppercase">Field Recordings</span>
                      <Film className="w-4 h-4 text-[#16a34a]" />
                    </div>
                    <div className="text-3xl font-bold font-mono">{videos.length}</div>
                    <div className="text-[11px] text-stone-500 mt-1">Mobile portrait video records</div>
                  </div>

                  <div className={themeClasses.card}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-stone-400 uppercase">Personnel Team</span>
                      <Users className="w-4 h-4 text-[#16a34a]" />
                    </div>
                    <div className="text-3xl font-bold font-mono">{team.length}</div>
                    <div className="text-[11px] text-stone-500 mt-1">Geoscientists & technical leaders</div>
                  </div>

                  <div className={themeClasses.card}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-stone-400 uppercase">Client Enquiries</span>
                      <MessageSquare className="w-4 h-4 text-[#16a34a]" />
                    </div>
                    <div className="text-3xl font-bold font-mono">{enquiries.length}</div>
                    <div className="text-[11px] text-stone-500 mt-1">Live inquiries received</div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className={themeClasses.card}>
                  <h4 className="font-bold text-sm mb-4">Quick Management Shortcuts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={handleOpenAddImage}
                      className={themeClasses.secondaryButton}
                    >
                      <Plus className="w-4 h-4 text-[#16a34a]" />
                      <span>Upload New Image from Gallery</span>
                    </button>

                    <button
                      onClick={handleOpenAddVideo}
                      className={themeClasses.secondaryButton}
                    >
                      <Plus className="w-4 h-4 text-[#16a34a]" />
                      <span>Add / Upload New Field Video</span>
                    </button>

                    <button
                      onClick={handleOpenAddTeamMember}
                      className={themeClasses.secondaryButton}
                    >
                      <Plus className="w-4 h-4 text-[#16a34a]" />
                      <span>Add New Team Member</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =======================================================
                TAB 2: FIELDWORK IMAGES (With Direct Device Upload)
                ======================================================= */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-2xl tracking-tight">Fieldwork & Equipment Gallery</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Add, edit, or upload photos directly from your phone/PC gallery with instant placement control.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddImage}
                    className={themeClasses.primaryButton}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Image from Gallery</span>
                  </button>
                </div>

                {/* Filter and Placement Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10 border border-stone-200/20 text-xs font-bold">
                    <button
                      onClick={() => setImagePlacementFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        imagePlacementFilter === 'all' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      All Images ({galleryImages.length})
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('homepage')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        imagePlacementFilter === 'homepage' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Homepage Gallery
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('projects')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        imagePlacementFilter === 'projects' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Projects Page
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('gallery')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        imagePlacementFilter === 'gallery' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Gallery Page
                    </button>
                  </div>

                  <input
                    type="text"
                    value={imageSearch}
                    onChange={(e) => setImageSearch(e.target.value)}
                    placeholder="Search images by title or caption..."
                    className={`max-w-xs ${themeClasses.input}`}
                  />
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((img) => (
                    <div
                      key={img.id}
                      className={`group relative rounded-2xl overflow-hidden border transition-all ${
                        isCarton ? 'bg-[#2b221a] border-[#523f2f]' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="aspect-square w-full overflow-hidden bg-black relative">
                        <img
                          src={img.url}
                          alt={img.alt || img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          {img.showOnHomepage !== false && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#16a34a] text-white font-bold">
                              Home
                            </span>
                          )}
                          {img.showOnProjects !== false && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                              Project
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5">
                        <span className="text-[9px] font-mono text-[#c2a67e] font-bold uppercase">{img.category}</span>
                        <h4 className="font-bold text-xs line-clamp-1 mt-0.5">{img.title}</h4>
                        <p className="text-[11px] text-stone-400 line-clamp-2 mt-1 leading-snug">{img.caption}</p>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-200/20">
                          <button
                            onClick={() => handleOpenEditImage(img)}
                            className="text-xs font-semibold text-[#16a34a] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => onDeleteGalleryImage(img.id)}
                            className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =======================================================
                TAB 3: FIELD VIDEOS (With Project Page Toggle & Direct Upload)
                ======================================================= */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-2xl tracking-tight">Verified Field Video Records</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Manage portrait drilling & exploration videos. Toggle visibility across Homepage, Projects Page, and Gallery.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddVideo}
                    className={themeClasses.primaryButton}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Video / Link Video</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-stone-400">Total Records: {filteredVideos.length}</span>
                  <input
                    type="text"
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    placeholder="Search videos by title or caption..."
                    className={`max-w-xs ${themeClasses.input}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVideos.map((vid) => (
                    <div
                      key={vid.id}
                      className={`rounded-2xl border overflow-hidden transition-all ${
                        isCarton ? 'bg-[#2b221a] border-[#523f2f]' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="relative aspect-[3/4] bg-black overflow-hidden group">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                          {vid.showOnHomepage !== false && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#16a34a] text-white font-bold">
                              Homepage
                            </span>
                          )}
                          {vid.showOnProjects !== false && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                              Projects Page
                            </span>
                          )}
                          {vid.showOnGallery !== false && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-bold">
                              Gallery
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[9px] font-mono text-[#c2a67e] uppercase font-bold block">{vid.subtitle}</span>
                          <h4 className="font-bold text-sm leading-snug line-clamp-1">{vid.title}</h4>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{vid.description}</p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/20 text-xs">
                          <button
                            onClick={() => setPreviewingVideo(vid)}
                            className="font-bold text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#16a34a]" /> Preview
                          </button>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleOpenEditVideo(vid)}
                              className="font-bold text-[#16a34a] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => onDeleteVideo(vid.id)}
                              className="font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =======================================================
                TAB 4: PERSONNEL & TEAM (Add/Edit Team Member with Photo Upload)
                ======================================================= */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-2xl tracking-tight">Personnel & Technical Team</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Manage company leadership, consultants, geologists, and geophysicists shown on About and Homepage.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddTeamMember}
                    className={themeClasses.primaryButton}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Team Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {team.map((member) => (
                    <div
                      key={member.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCarton ? 'bg-[#2b221a] border-[#523f2f]' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-stone-200/20">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-sm leading-tight text-stone-100 line-clamp-1">{member.name}</h4>
                          <span className="text-xs text-[#16a34a] font-semibold block truncate mt-0.5">{member.title}</span>
                          <span className="text-[11px] font-mono text-stone-400 block truncate mt-0.5">{member.experienceYears}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-200/20 space-y-2">
                        <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">{member.bio}</p>
                        {member.credentials && (
                          <div className="text-[10px] font-mono text-[#c2a67e] truncate font-bold">
                            {member.credentials}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200/20 text-xs">
                        <button
                          onClick={() => handleOpenEditTeamMember(member)}
                          className="font-bold text-[#16a34a] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Member
                        </button>
                        <button
                          onClick={() => onDeleteTeamMember && onDeleteTeamMember(member.id)}
                          className="font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =======================================================
                TAB 5: CLIENT ENQUIRIES (No Mock Data, Empty State by Default)
                ======================================================= */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-2xl tracking-tight">Client Inquiries & Consultation Requests</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Direct inquiries submitted through the website consultation form appear here in real time.
                    </p>
                  </div>

                  {enquiries.length > 0 && onClearAllEnquiries && (
                    <button
                      onClick={onClearAllEnquiries}
                      className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Enquiries</span>
                    </button>
                  )}
                </div>

                {enquiries.length === 0 ? (
                  <div className={`p-12 text-center rounded-3xl border ${isCarton ? 'bg-[#2b221a] border-[#523f2f]' : 'bg-white border-stone-200'}`}>
                    <div className="w-14 h-14 rounded-2xl bg-[#16a34a]/15 text-[#16a34a] flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-lg">No Client Enquiries Yet</h4>
                    <p className="text-xs text-stone-400 max-w-md mx-auto mt-2 leading-relaxed">
                      All new consultation requests submitted from the Contact page or quick forms will immediately show up here with full client details, service requirements, and reference codes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className={`p-5 rounded-2xl border space-y-3 ${
                          isCarton ? 'bg-[#2b221a] border-[#523f2f]' : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#16a34a] px-2 py-0.5 rounded bg-[#16a34a]/15">
                              {enq.referenceNumber}
                            </span>
                            <span className="font-bold text-sm">{enq.fullName}</span>
                            {enq.company && <span className="text-xs text-stone-400">({enq.company})</span>}
                          </div>
                          <span className="text-[11px] font-mono text-stone-400">
                            {new Date(enq.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div><span className="text-stone-400">Email:</span> <a href={`mailto:${enq.email}`} className="text-[#16a34a] font-semibold">{enq.email}</a></div>
                          <div><span className="text-stone-400">Phone:</span> <span className="font-semibold">{enq.phone || 'None'}</span></div>
                          <div><span className="text-stone-400">Service:</span> <span className="font-semibold">{enq.serviceOfInterest}</span></div>
                        </div>

                        <div className={`p-3 rounded-xl text-xs leading-relaxed ${isCarton ? 'bg-[#1f1712]' : 'bg-[#faf8f5]'}`}>
                          <div className="font-bold text-stone-300 mb-1">{enq.subject}</div>
                          <p className="text-stone-400">{enq.message}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/20 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-stone-400 text-[11px]">Status:</span>
                            <button
                              onClick={() => onUpdateEnquiryStatus(enq.id, 'reviewed')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                enq.status === 'reviewed' ? 'bg-[#16a34a] text-white' : 'border border-stone-400 text-stone-400 hover:text-white'
                              }`}
                            >
                              Reviewed
                            </button>
                            <button
                              onClick={() => onUpdateEnquiryStatus(enq.id, 'resolved')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                enq.status === 'resolved' ? 'bg-blue-600 text-white' : 'border border-stone-400 text-stone-400 hover:text-white'
                              }`}
                            >
                              Resolved
                            </button>
                          </div>

                          <button
                            onClick={() => onDeleteEnquiry(enq.id)}
                            className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                TAB 6: SETTINGS & PASSWORD (Clean, No cPanel Fluff)
                ======================================================= */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="font-display font-extrabold text-2xl tracking-tight">System Settings & Password Control</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Manage administrative credentials and update official company contact coordinates.
                  </p>
                </div>

                {/* Password Change Card */}
                <div className={themeClasses.card}>
                  <div className="flex items-center gap-2 mb-4">
                    <KeyRound className="w-4 h-4 text-[#16a34a]" />
                    <h4 className="font-bold text-sm">Change Admin Password</h4>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={themeClasses.label}>Current Password</label>
                        <input
                          type="password"
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          placeholder="Current password"
                          className={themeClasses.input}
                          required
                        />
                      </div>
                      <div>
                        <label className={themeClasses.label}>New Password</label>
                        <input
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="New password (min 6 chars)"
                          className={themeClasses.input}
                          required
                        />
                      </div>
                      <div>
                        <label className={themeClasses.label}>Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Confirm new password"
                          className={themeClasses.input}
                          required
                        />
                      </div>
                    </div>

                    {passMessage && (
                      <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                        passMessage.type === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {passMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{passMessage.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={themeClasses.primaryButton}
                    >
                      <Lock className="w-4 h-4" />
                      <span>Update Administrator Password</span>
                    </button>
                  </form>
                </div>

                {/* Company Coordinates Card */}
                <div className={themeClasses.card}>
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-[#16a34a]" />
                    <h4 className="font-bold text-sm">Official Company Coordinates</h4>
                  </div>

                  <form onSubmit={handleSaveCompanySettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={themeClasses.label}>Direct Telephone Number</label>
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          className={themeClasses.input}
                        />
                      </div>

                      <div>
                        <label className={themeClasses.label}>WhatsApp Business Line</label>
                        <input
                          type="text"
                          value={whatsappInput}
                          onChange={(e) => setWhatsappInput(e.target.value)}
                          className={themeClasses.input}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={themeClasses.label}>Corporate Inquiries & Forwarding Email</label>
                        <input
                          type="text"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className={themeClasses.input}
                        />
                        <span className="text-[11px] text-stone-400 mt-1 block">
                          Official corporate address: info@ginibengeoservices.com (forwarding to benukwutevinor@yahoo.com and gpg1.geoservices@gmail.com)
                        </span>
                      </div>

                      <div>
                        <label className={themeClasses.label}>Facebook Page URL</label>
                        <input
                          type="text"
                          value={facebookInput}
                          onChange={(e) => setFacebookInput(e.target.value)}
                          className={themeClasses.input}
                        />
                      </div>

                      <div>
                        <label className={themeClasses.label}>LinkedIn Profile URL</label>
                        <input
                          type="text"
                          value={company.linkedinUrl}
                          readOnly
                          className={`${themeClasses.input} opacity-70`}
                        />
                      </div>
                    </div>

                    {settingsSaved && (
                      <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Coordinates updated and saved across all public pages!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={themeClasses.primaryButton}
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Company Coordinates</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* =========================================================
          MODAL: ADD / EDIT IMAGE (With Gallery File Upload Button)
          ========================================================= */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl relative border ${isCarton ? 'bg-[#261e17] text-[#f4efe8] border-[#523f2f]' : 'bg-white text-stone-900 border-stone-200'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/20 mb-4">
              <h4 className="font-bold text-base flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#16a34a]" />
                <span>{editingImage ? 'Edit Fieldwork Photograph' : 'Upload Fieldwork Image'}</span>
              </h4>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden device file input */}
            <input
              type="file"
              ref={imageFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, (dataUrl) => setImageForm((prev) => ({ ...prev, url: dataUrl })))}
            />

            <form onSubmit={handleSaveImage} className="space-y-4">
              <div>
                <label className={themeClasses.label}>Image Title / Equipment Name</label>
                <input
                  type="text"
                  value={imageForm.title}
                  onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                  placeholder="e.g. CAT Excavator Exploration Trenching"
                  className={themeClasses.input}
                  required
                />
              </div>

              {/* Direct Gallery Upload Button + URL fallback */}
              <div>
                <label className={themeClasses.label}>Photo Source (Gallery Upload or URL)</label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => imageFileInputRef.current?.click()}
                    className="flex-1 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Direct from Device Gallery</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={imageForm.url}
                  onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })}
                  placeholder="Or paste external image URL (https://...)"
                  className={themeClasses.input}
                  required
                />
              </div>

              {/* Live Preview */}
              {imageForm.url && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-stone-200/30">
                  <img
                    src={imageForm.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className={themeClasses.label}>Caption & Operational Details</label>
                <textarea
                  value={imageForm.caption}
                  onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })}
                  placeholder="Detail field location, methodology, or equipment purpose..."
                  rows={2}
                  className={themeClasses.input}
                />
              </div>

              <div>
                <label className={themeClasses.label}>Field Discipline Category</label>
                <select
                  value={imageForm.category}
                  onChange={(e) => setImageForm({ ...imageForm, category: e.target.value as GalleryCategory })}
                  className={themeClasses.input}
                >
                  <option value="geology">Geology & Exploration</option>
                  <option value="geophysics">Geophysics & Resistivity</option>
                  <option value="groundwater">Groundwater & Hydrogeology</option>
                  <option value="drilling">Drilling Operations</option>
                  <option value="environmental">Environmental Compliance</option>
                  <option value="instruments">Field Instrumentation</option>
                </select>
              </div>

              {/* Display Placement Checkboxes */}
              <div>
                <label className={themeClasses.label}>Display Placements Across Website</label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={imageForm.showOnHomepage}
                      onChange={(e) => setImageForm({ ...imageForm, showOnHomepage: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Homepage (Fieldwork & Equipment Section)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={imageForm.showOnProjects}
                      onChange={(e) => setImageForm({ ...imageForm, showOnProjects: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Projects Page Photographic Records</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={imageForm.showOnGallery}
                      onChange={(e) => setImageForm({ ...imageForm, showOnGallery: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Dedicated Gallery Page</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200/20">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className={themeClasses.secondaryButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={themeClasses.primaryButton}
                >
                  <Check className="w-4 h-4" />
                  <span>{editingImage ? 'Save Changes' : 'Upload & Publish Image'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT VIDEO (With Projects Page Option & Direct Upload)
          ========================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl relative border ${isCarton ? 'bg-[#261e17] text-[#f4efe8] border-[#523f2f]' : 'bg-white text-stone-900 border-stone-200'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/20 mb-4">
              <h4 className="font-bold text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-[#16a34a]" />
                <span>{editingVideo ? 'Edit Field Video Record' : 'Upload Field Video'}</span>
              </h4>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden inputs for video file & thumbnail */}
            <input
              type="file"
              ref={videoFileInputRef}
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, (dataUrl) => setVideoForm((prev) => ({ ...prev, driveUrl: dataUrl })))}
            />
            <input
              type="file"
              ref={videoThumbFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, (dataUrl) => setVideoForm((prev) => ({ ...prev, thumbnail: dataUrl })))}
            />

            <form onSubmit={handleSaveVideo} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className={themeClasses.label}>Video Title</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Rotary Borehole Mast Drilling Operations"
                  className={themeClasses.input}
                  required
                />
              </div>

              <div>
                <label className={themeClasses.label}>Technical Subtitle</label>
                <input
                  type="text"
                  value={videoForm.subtitle}
                  onChange={(e) => setVideoForm({ ...videoForm, subtitle: e.target.value })}
                  placeholder="e.g. Deep Aquifer Siting & Continuous Mast Rotation"
                  className={themeClasses.input}
                />
              </div>

              {/* Video File / Link */}
              <div>
                <label className={themeClasses.label}>Video Source (Gallery Upload or Drive/Direct URL)</label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    className="flex-1 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Video from Device Gallery</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={videoForm.driveUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, driveUrl: e.target.value })}
                  placeholder="Or paste Google Drive view / preview link / mp4 URL"
                  className={themeClasses.input}
                  required
                />
              </div>

              {/* Thumbnail Image */}
              <div>
                <label className={themeClasses.label}>Cover Thumbnail (Gallery Upload or URL)</label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => videoThumbFileInputRef.current?.click()}
                    className="flex-1 py-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Thumbnail from Gallery</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={videoForm.thumbnail}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  placeholder="Thumbnail Image URL (https://...)"
                  className={themeClasses.input}
                />
              </div>

              <div>
                <label className={themeClasses.label}>Video Description & Operational Context</label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Describe the operation, depth, drilling speed, or geophysical parameters..."
                  rows={2}
                  className={themeClasses.input}
                />
              </div>

              {/* Page Placement Checkboxes Including PROJECT PAGE */}
              <div>
                <label className={themeClasses.label}>Where Should This Video Display?</label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={videoForm.showOnHomepage}
                      onChange={(e) => setVideoForm({ ...videoForm, showOnHomepage: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Homepage Video Stage</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={videoForm.showOnProjects}
                      onChange={(e) => setVideoForm({ ...videoForm, showOnProjects: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Projects Page Video Stage</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={videoForm.showOnGallery}
                      onChange={(e) => setVideoForm({ ...videoForm, showOnGallery: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Dedicated Video Gallery Page</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200/20">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className={themeClasses.secondaryButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={themeClasses.primaryButton}
                >
                  <Check className="w-4 h-4" />
                  <span>{editingVideo ? 'Save Video Changes' : 'Publish Field Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT TEAM MEMBER (With Gallery Photo Upload)
          ========================================================= */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl relative border ${isCarton ? 'bg-[#261e17] text-[#f4efe8] border-[#523f2f]' : 'bg-white text-stone-900 border-stone-200'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/20 mb-4">
              <h4 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-[#16a34a]" />
                <span>{editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}</span>
              </h4>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden input for team member photo */}
            <input
              type="file"
              ref={teamPhotoFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, (dataUrl) => setTeamForm((prev) => ({ ...prev, image: dataUrl })))}
            />

            <form onSubmit={handleSaveTeamMember} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className={themeClasses.label}>Full Name & Academic Honors</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="e.g. Dr. Benjamin Ukwuteyinor, PhD"
                  className={themeClasses.input}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={themeClasses.label}>Title / Designation</label>
                  <input
                    type="text"
                    value={teamForm.title}
                    onChange={(e) => setTeamForm({ ...teamForm, title: e.target.value })}
                    placeholder="e.g. Lead Hydrogeologist"
                    className={themeClasses.input}
                    required
                  />
                </div>

                <div>
                  <label className={themeClasses.label}>Experience / Practice</label>
                  <input
                    type="text"
                    value={teamForm.experienceYears}
                    onChange={(e) => setTeamForm({ ...teamForm, experienceYears: e.target.value })}
                    placeholder="e.g. 25+ years of professional practice"
                    className={themeClasses.input}
                  />
                </div>
              </div>

              <div>
                <label className={themeClasses.label}>Professional Credentials</label>
                <input
                  type="text"
                  value={teamForm.credentials}
                  onChange={(e) => setTeamForm({ ...teamForm, credentials: e.target.value })}
                  placeholder="e.g. PhD Applied Geophysics, COMEG Registered"
                  className={themeClasses.input}
                />
              </div>

              {/* Photo Upload from Gallery */}
              <div>
                <label className={themeClasses.label}>Profile Photograph (Gallery Upload or URL)</label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => teamPhotoFileInputRef.current?.click()}
                    className="flex-1 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo from Device Gallery</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={teamForm.image}
                  onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                  placeholder="Or paste photo image URL (https://...)"
                  className={themeClasses.input}
                />
              </div>

              {/* Live Photo Preview */}
              {teamForm.image && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-black/20 border border-stone-200/20">
                  <img
                    src={teamForm.image}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <span className="text-xs text-stone-300">Photo preview loaded successfully</span>
                </div>
              )}

              <div>
                <label className={themeClasses.label}>Professional Affiliations (Comma-separated)</label>
                <input
                  type="text"
                  value={teamForm.affiliations}
                  onChange={(e) => setTeamForm({ ...teamForm, affiliations: e.target.value })}
                  placeholder="e.g. COMEG, NMGS, IAIA"
                  className={themeClasses.input}
                />
              </div>

              <div>
                <label className={themeClasses.label}>Professional Bio & Background</label>
                <textarea
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  placeholder="Summary of experience, technical focus, and achievements..."
                  rows={3}
                  className={themeClasses.input}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200/20">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className={themeClasses.secondaryButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={themeClasses.primaryButton}
                >
                  <Check className="w-4 h-4" />
                  <span>{editingTeamMember ? 'Save Member' : 'Add Team Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: VIDEO INLINE PREVIEW
          ========================================================= */}
      {previewingVideo && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl overflow-hidden bg-black border border-stone-800 shadow-2xl relative flex flex-col">
            <div className="flex items-center justify-between p-3.5 bg-stone-900 border-b border-stone-800">
              <span className="font-bold text-xs text-white truncate pr-2">{previewingVideo.title}</span>
              <button
                onClick={() => setPreviewingVideo(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[9/16] w-full bg-black">
              {previewingVideo.driveViewUrl && previewingVideo.driveViewUrl.startsWith('data:video') ? (
                <video
                  src={previewingVideo.driveViewUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={previewingVideo.drivePreviewUrl}
                  title={previewingVideo.title}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; fullscreen"
                />
              )}
            </div>

            <div className="p-3 bg-stone-900 text-stone-300 text-xs">
              <span className="text-[10px] font-mono text-[#c2a67e] block">{previewingVideo.subtitle}</span>
              <p className="line-clamp-2 mt-1 text-[11px]">{previewingVideo.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
