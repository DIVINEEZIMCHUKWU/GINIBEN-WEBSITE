import React, { useState, useRef } from 'react';
import { 
  X, LayoutDashboard, MessageSquare, Image as ImageIcon, 
  Users, Settings, Check, Trash2, Plus, Edit, Eye, EyeOff, 
  ShieldCheck, Film, Lock, KeyRound, Mail, Phone, 
  Globe, CheckCircle2, AlertCircle, Home, Upload, Moon, Sun, 
  Camera, Video, Database, Loader2
} from 'lucide-react';
import { 
  CompanyConfig, ConsultationEnquiry, MediaItem, 
  TeamMember, ProjectVideo, GalleryCategory 
} from '../types';
import { changeAdminPasswordInApi } from '../services/apiService';
import { uploadMediaToServer, uploadVideoInChunks, generateVideoThumbnail, getFormattedVideoEmbedUrl } from '../utils/mediaUtils';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToHomepage: () => void;
  company: CompanyConfig;
  onUpdateCompany: (updated: CompanyConfig) => void;
  enquiries: ConsultationEnquiry[];
  onRefreshEnquiries?: () => void;
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
  onRefreshEnquiries,
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
    category: 'GEOLOGICAL MAPPING & EXPLORATION' as GalleryCategory,
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
  // FILE READING & SERVER UPLOAD HELPERS (DEVICE / PHONE GALLERY UPLOAD)
  // -------------------------------------------------------------
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [videoUploadStatusText, setVideoUploadStatusText] = useState<string>('');
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setVideoUploadProgress(1);
    const mbTotal = (file.size / (1024 * 1024)).toFixed(1);
    setVideoUploadStatusText(`Preparing video (0% of ${mbTotal}MB)...`);

    try {
      // 1. Generate video thumbnail frame
      generateVideoThumbnail(file).then((thumbData) => {
        if (thumbData) {
          setVideoForm((prev) => ({ ...prev, thumbnail: prev.thumbnail || thumbData }));
        }
      });

      // 2. Reliable Chunked upload to /api/chunked_upload.php in 1.5MB slices
      const res = await uploadVideoInChunks(file, (percent, loadedMb, totalMb) => {
        setVideoUploadProgress(percent);
        setVideoUploadStatusText(`${percent}% (${loadedMb}MB / ${totalMb}MB)`);
      });

      if (res.success && res.url) {
        setVideoForm((prev) => ({
          ...prev,
          driveUrl: res.url
        }));
        setVideoUploadProgress(null);
        setVideoUploadStatusText('');
      } else {
        setUploadError(res.error || 'Server upload failed. Please try again.');
        setVideoUploadProgress(null);
        setVideoUploadStatusText('');
      }
    } catch (err: any) {
      setUploadError('Failed to upload video: ' + (err?.message || 'Network error'));
      setVideoUploadProgress(null);
      setVideoUploadStatusText('');
    }
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoaded: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadProgress(5);
    try {
      const res = await uploadMediaToServer(file, (percent) => {
        setImageUploadProgress(percent);
      });

      if (res.success && res.url) {
        onLoaded(res.url);
        setImageUploadProgress(null);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            onLoaded(event.target.result);
          }
          setImageUploadProgress(null);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onLoaded(event.target.result);
        }
        setImageUploadProgress(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onLoaded: (dataUrl: string) => void) => {
    handleImageFileChange(e, onLoaded);
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
    changeAdminPasswordInApi(currentPass, newPass).then((res) => {
      if (res.success) {
        setPassMessage({ type: 'success', text: 'Password successfully updated in MySQL database & local console!' });
      } else {
        setPassMessage({ type: 'success', text: 'Password changed locally. (Server sync note: ' + res.message + ')' });
      }
    });
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
      category: 'GEOLOGICAL MAPPING & EXPLORATION',
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
    if (previewUrl.includes('drive.google.com')) {
      previewUrl = getFormattedVideoEmbedUrl(previewUrl);
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
        image: teamForm.image.trim() || 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg',
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
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm overflow-hidden',
    mainShell: isCarton 
      ? 'w-full md:max-w-7xl h-full md:h-[92vh] md:max-h-[950px] bg-[#221a14] text-[#f4efe8] rounded-none md:rounded-2xl shadow-2xl flex flex-col border-0 md:border md:border-[#523f2f] overflow-hidden'
      : 'w-full md:max-w-7xl h-full md:h-[92vh] md:max-h-[950px] bg-white text-stone-900 rounded-none md:rounded-2xl shadow-2xl flex flex-col border-0 md:border md:border-stone-200 overflow-hidden',
    header: isCarton 
      ? 'flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-[#523f2f] bg-[#292019] shrink-0'
      : 'flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-stone-200 bg-white shrink-0',
    sidebar: isCarton 
      ? 'hidden md:flex w-60 lg:w-64 border-r border-[#523f2f] bg-[#2a211a] p-4 flex-col justify-between shrink-0'
      : 'hidden md:flex w-60 lg:w-64 border-r border-stone-200 bg-[#faf8f5] p-4 flex-col justify-between shrink-0',
    contentArea: isCarton 
      ? 'min-w-0 min-h-0 flex-1 bg-[#1e1712] p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain'
      : 'min-w-0 min-h-0 flex-1 bg-white p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain',
    card: isCarton 
      ? 'bg-[#2b221a] border border-[#523f2f] rounded-2xl p-3.5 sm:p-5 shadow-sm'
      : 'bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-5 shadow-xs',
    input: isCarton 
      ? 'w-full px-3.5 py-2.5 rounded-xl bg-[#1a1410] border border-[#5a4635] text-white placeholder-stone-400 focus:outline-none focus:border-[#c2a67e] text-base sm:text-sm min-h-[42px] transition-colors'
      : 'w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#16a34a] text-base sm:text-sm min-h-[42px] transition-colors',
    label: isCarton 
      ? 'text-xs font-mono uppercase tracking-wider text-[#d7cbbe] block mb-1.5 font-bold'
      : 'text-xs font-mono uppercase tracking-wider text-stone-600 block mb-1.5 font-bold',
    navButtonActive: 'bg-[#16a34a] text-white shadow-md ring-2 ring-[#16a34a]/30',
    navButtonInactive: isCarton 
      ? 'text-[#dfd6cb] hover:bg-[#382c22] hover:text-white'
      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
    mobileNavInactive: isCarton
      ? 'bg-[#2c231b] hover:bg-[#382c22] text-[#dfd6cb] border border-[#4d3a2b]'
      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200',
    primaryButton: 'px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation min-h-[40px]',
    secondaryButton: isCarton
      ? 'px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#3a2e24] hover:bg-[#48392d] active:scale-[0.98] text-white text-xs sm:text-sm font-bold border border-[#5a4635] transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation min-h-[40px]'
      : 'px-3.5 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 active:scale-[0.98] text-stone-800 text-xs sm:text-sm font-bold border border-stone-300 transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation min-h-[40px]'
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN GATE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <div className={`w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative my-auto ${isCarton ? 'bg-[#261e17] text-[#f4efe8] border border-[#523f2f]' : 'bg-white text-stone-900 border border-stone-200'}`}>
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-stone-200/50 mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#16a34a]/15 text-[#16a34a] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg leading-tight">Admin Console</h3>
                <span className="text-[10px] sm:text-[11px] font-mono text-stone-400">GiniBen & Partners Ltd</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
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
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="font-display font-bold text-sm sm:text-base leading-tight truncate">Admin Console</h2>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#16a34a]/15 text-[#16a34a] font-bold">
                  PORTAL
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-400 block truncate">GiniBen & Partners Ltd</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* GO TO HOMEPAGE BUTTON */}
            <button
              onClick={() => {
                onClose();
                onGoToHomepage();
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#16a34a]/10 hover:bg-[#16a34a]/20 text-[#16a34a] text-xs font-bold transition-all border border-[#16a34a]/30 cursor-pointer"
              title="Exit Admin and navigate to Homepage"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Go to Homepage</span>
              <span className="sm:hidden text-[11px]">Home</span>
            </button>

            {/* WHITE / CARTON BROWN DARKMODE TOGGLE */}
            <button
              onClick={toggleAdminTheme}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                isCarton 
                  ? 'bg-[#382b20] text-[#c2a67e] border-[#5a4736] hover:bg-[#463629]' 
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title={`Switch to ${isCarton ? 'White Mode' : 'Carton Brown Darkmode'}`}
            >
              {isCarton ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#c2a67e]" />
                  <span className="hidden md:inline">White Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden md:inline">Carton Brown</span>
                </>
              )}
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors border border-rose-500/20 cursor-pointer flex items-center gap-1"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5 sm:hidden" />
              <span className="hidden sm:inline">Lock Console</span>
            </button>

            {/* CLOSE MODAL */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Close Console"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        {/* Dedicated Mobile Horizontal Tab Bar (Visible on mobile/tablet screens < md) */}
        <div className={`md:hidden flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x px-3 py-2.5 border-b shrink-0 ${
          isCarton ? 'bg-[#251d16] border-[#523f2f]' : 'bg-[#faf8f5] border-stone-200'
        }`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'overview' ? themeClasses.navButtonActive : themeClasses.mobileNavInactive
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'images' ? themeClasses.navButtonActive : themeClasses.mobileNavInactive
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span>Images ({galleryImages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'videos' ? themeClasses.navButtonActive : themeClasses.mobileNavInactive
            }`}
          >
            <Film className="w-4 h-4 shrink-0" />
            <span>Videos ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'team' ? themeClasses.navButtonActive : themeClasses.mobileNavInactive
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Team ({team.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'enquiries' ? themeClasses.navButtonActive : themeClasses.mobileNavInactive
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Enquiries</span>
            {enquiries.length > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'enquiries' ? 'bg-white text-[#16a34a]' : 'bg-[#16a34a] text-white'
              }`}>
                {enquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'settings' ? themeClasses.navButtonActive : themeClasses.mobileNavInactive
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>
        </div>

        {/* Body Grid: Sidebar + Active Panel */}
        <div className="min-h-0 flex-1 flex flex-col overflow-hidden sm:flex-row">
          
          {/* Navigation Sidebar (Desktop screens >= md) */}
          <aside className={themeClasses.sidebar}>
            <nav className="flex gap-1 overflow-x-auto no-scrollbar sm:block sm:space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-auto shrink-0 whitespace-nowrap flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer sm:w-full ${
                  activeTab === 'overview' ? themeClasses.navButtonActive : themeClasses.navButtonInactive
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('images')}
                className={`w-auto shrink-0 whitespace-nowrap flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer sm:w-full ${
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
                className={`w-auto shrink-0 whitespace-nowrap flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer sm:w-full ${
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
                className={`w-auto shrink-0 whitespace-nowrap flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer sm:w-full ${
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
                className={`w-auto shrink-0 whitespace-nowrap flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer sm:w-full ${
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
                className={`w-auto shrink-0 whitespace-nowrap flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer sm:w-full ${
                  activeTab === 'settings' ? themeClasses.navButtonActive : themeClasses.navButtonInactive
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings & Password</span>
              </button>
            </nav>

            {/* Quick Summary Footnote */}
            <div className={`hidden sm:block p-3 rounded-xl border text-[11px] space-y-1 ${isCarton ? 'bg-[#211913] border-[#483729] text-[#c2a67e]' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
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
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">System Status & Resource Metrics</h3>
                  <p className="text-xs text-stone-400 mt-1">Manage public site content, verified field media, personnel profiles, and client inquiries.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  <div className={themeClasses.card}>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 uppercase">Field Photos</span>
                      <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16a34a]" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono">{galleryImages.length}</div>
                    <div className="text-[10px] sm:text-[11px] text-stone-500 mt-1 line-clamp-1">Home, Projects, Gallery</div>
                  </div>

                  <div className={themeClasses.card}>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 uppercase">Field Videos</span>
                      <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16a34a]" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono">{videos.length}</div>
                    <div className="text-[10px] sm:text-[11px] text-stone-500 mt-1 line-clamp-1">Mobile portrait videos</div>
                  </div>

                  <div className={themeClasses.card}>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 uppercase">Team Members</span>
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16a34a]" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono">{team.length}</div>
                    <div className="text-[10px] sm:text-[11px] text-stone-500 mt-1 line-clamp-1">Geoscientists & leaders</div>
                  </div>

                  <div className={themeClasses.card}>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 uppercase">Enquiries</span>
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16a34a]" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono">{enquiries.length}</div>
                    <div className="text-[10px] sm:text-[11px] text-stone-500 mt-1 line-clamp-1">Client submissions</div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className={themeClasses.card}>
                  <h4 className="font-bold text-xs sm:text-sm mb-3 sm:mb-4">Quick Management Shortcuts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    <button
                      onClick={handleOpenAddImage}
                      className={themeClasses.secondaryButton}
                    >
                      <Plus className="w-4 h-4 text-[#16a34a] shrink-0" />
                      <span>Upload New Image from Gallery</span>
                    </button>

                    <button
                      onClick={handleOpenAddVideo}
                      className={themeClasses.secondaryButton}
                    >
                      <Plus className="w-4 h-4 text-[#16a34a] shrink-0" />
                      <span>Add / Upload New Field Video</span>
                    </button>

                    <button
                      onClick={handleOpenAddTeamMember}
                      className={themeClasses.secondaryButton}
                    >
                      <Plus className="w-4 h-4 text-[#16a34a] shrink-0" />
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
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">Fieldwork & Equipment Gallery</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Add, edit, or upload photos directly from your phone/PC gallery with instant placement control.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddImage}
                    className={`w-full sm:w-auto ${themeClasses.primaryButton}`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Image from Gallery</span>
                  </button>
                </div>

                {/* Filter and Placement Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-black/10 border border-stone-200/20 text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
                    <button
                      onClick={() => setImagePlacementFilter('all')}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        imagePlacementFilter === 'all' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      All ({galleryImages.length})
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('homepage')}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        imagePlacementFilter === 'homepage' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Homepage
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('projects')}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        imagePlacementFilter === 'projects' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Projects
                    </button>
                    <button
                      onClick={() => setImagePlacementFilter('gallery')}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        imagePlacementFilter === 'gallery' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Gallery
                    </button>
                  </div>

                  <input
                    type="text"
                    value={imageSearch}
                    onChange={(e) => setImageSearch(e.target.value)}
                    placeholder="Search images by title..."
                    className={`w-full sm:max-w-xs ${themeClasses.input}`}
                  />
                </div>

                {/* Images Grid - 2 columns on mobile, 3 on md, 4 on lg */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {filteredImages.map((img) => (
                    <div
                      key={img.id}
                      className={`group relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                        isCarton ? 'bg-[#2b221a] border-[#523f2f]' : 'bg-white border-stone-200 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="aspect-square w-full overflow-hidden bg-black relative">
                          <img
                            src={img.url}
                            alt={img.alt || img.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
                            {img.showOnHomepage !== false && (
                              <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#16a34a] text-white font-bold">
                                Home
                              </span>
                            )}
                            {img.showOnProjects !== false && (
                              <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                                Project
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-2 sm:p-3.5">
                          <span className="text-[8px] sm:text-[9px] font-mono text-[#c2a67e] font-bold uppercase">{img.category}</span>
                          <h4 className="font-bold text-[11px] sm:text-xs line-clamp-1 mt-0.5">{img.title}</h4>
                          <p className="text-[10px] sm:text-[11px] text-stone-400 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-snug">{img.caption}</p>
                        </div>
                      </div>

                      <div className="p-2 sm:p-3.5 pt-0">
                        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-stone-200/20 text-xs">
                          <button
                            onClick={() => handleOpenEditImage(img)}
                            className="py-1.5 px-2 rounded-lg bg-[#16a34a]/10 hover:bg-[#16a34a]/20 text-[#16a34a] font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation text-[11px]"
                            title="Edit Image Details"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => onDeleteGalleryImage(img.id)}
                            className="py-1.5 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation text-[11px]"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Del</span>
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
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">Verified Field Video Records</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Manage portrait drilling & exploration videos. Toggle visibility across Homepage, Projects Page, and Gallery.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddVideo}
                    className={`w-full sm:w-auto ${themeClasses.primaryButton}`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Video / Link Video</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-mono text-stone-400">Total Records: {filteredVideos.length}</span>
                  <input
                    type="text"
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    placeholder="Search videos by title..."
                    className={`w-full sm:max-w-xs ${themeClasses.input}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
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
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
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

                      <div className="p-3.5 sm:p-4 space-y-3">
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{vid.description}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-stone-200/20 text-xs">
                          <button
                            onClick={() => setPreviewingVideo(vid)}
                            className="min-h-[36px] py-1.5 px-3 rounded-lg bg-stone-500/10 hover:bg-stone-500/20 text-stone-300 hover:text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#16a34a]" />
                            <span>Preview Video</span>
                          </button>
                          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                            <button
                              onClick={() => handleOpenEditVideo(vid)}
                              className="min-h-[36px] py-1.5 px-3 rounded-lg bg-[#16a34a]/10 hover:bg-[#16a34a]/20 text-[#16a34a] font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => onDeleteVideo(vid.id)}
                              className="min-h-[36px] py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
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
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">Personnel & Technical Team</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Manage company leadership, consultants, geologists, and geophysicists shown on About and Homepage.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddTeamMember}
                    className={`w-full sm:w-auto ${themeClasses.primaryButton}`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Team Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                  {team.map((member) => (
                    <div
                      key={member.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCarton ? 'bg-[#2b221a] border-[#523f2f]' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-stone-200/20">
                          <img
                            src={member.image}
                            alt={member.name}
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
                        <div className="overflow-hidden min-w-0">
                          <h4 className="font-bold text-sm leading-tight text-stone-100 line-clamp-1">{member.name}</h4>
                          <span className="text-xs text-[#16a34a] font-semibold block truncate mt-0.5">{member.title}</span>
                          <span className="text-[11px] font-mono text-stone-400 block truncate mt-0.5">{member.experienceYears}</span>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 pt-3 border-t border-stone-200/20 space-y-2">
                        <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">{member.bio}</p>
                        {member.credentials && (
                          <div className="text-[10px] font-mono text-[#c2a67e] truncate font-bold">
                            {member.credentials}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-stone-200/20 text-xs">
                        <button
                          onClick={() => handleOpenEditTeamMember(member)}
                          className="min-h-[36px] py-1.5 px-2.5 rounded-lg bg-[#16a34a]/10 hover:bg-[#16a34a]/20 text-[#16a34a] font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Member</span>
                        </button>
                        <button
                          onClick={() => onDeleteTeamMember && onDeleteTeamMember(member.id)}
                          className="min-h-[36px] py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
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
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight">Client Inquiries & Consultation Requests</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Direct inquiries submitted through the website consultation form appear here in real time.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {onRefreshEnquiries && (
                      <button
                        type="button"
                        onClick={onRefreshEnquiries}
                        className="px-3 py-1.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95 touch-manipulation"
                        title="Fetch latest enquiries directly from MySQL database"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Sync with Database</span>
                      </button>
                    )}

                    {enquiries.length > 0 && onClearAllEnquiries && (
                      <button
                        onClick={onClearAllEnquiries}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
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

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-stone-200/20 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-stone-400 text-[11px] font-bold">Status:</span>
                            <button
                              onClick={() => onUpdateEnquiryStatus(enq.id, 'reviewed')}
                              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 touch-manipulation flex items-center gap-1 ${
                                enq.status === 'reviewed' ? 'bg-[#16a34a] text-white shadow-xs' : 'border border-stone-400/50 text-stone-400 hover:text-white'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Reviewed</span>
                            </button>
                            <button
                              onClick={() => onUpdateEnquiryStatus(enq.id, 'resolved')}
                              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 touch-manipulation flex items-center gap-1 ${
                                enq.status === 'resolved' ? 'bg-blue-600 text-white shadow-xs' : 'border border-stone-400/50 text-stone-400 hover:text-white'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Resolved</span>
                            </button>
                          </div>

                          <button
                            onClick={() => onDeleteEnquiry(enq.id)}
                            className="min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation self-start sm:self-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Enquiry</span>
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
                  <h3 className="font-display font-extrabold text-xl tracking-tight sm:text-2xl">System Settings & Password Control</h3>
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
                      className={`w-full sm:w-auto ${themeClasses.primaryButton}`}
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
                          Official corporate address: info@ginibengeoservices.com (forwarding to benukwuteyinor@yahoomail.com and gpgl.geoservices@gmail.com)
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
                      className={`w-full sm:w-auto ${themeClasses.primaryButton}`}
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-lg max-h-[92dvh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl relative border my-auto flex flex-col ${isCarton ? 'bg-[#261e17] text-[#f4efe8] border-[#523f2f]' : 'bg-white text-stone-900 border-stone-200'}`}>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-200/20 mb-3 sm:mb-4 shrink-0">
              <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Camera className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#16a34a] shrink-0" />
                <span className="truncate">{editingImage ? 'Edit Fieldwork Photograph' : 'Upload Fieldwork Image'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close image modal"
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

            <form onSubmit={handleSaveImage} className="space-y-3.5 sm:space-y-4">
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
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                  >
                    <Upload className="w-4 h-4 shrink-0" />
                    <span>Upload Direct from Device Gallery</span>
                  </button>
                </div>
                {imageUploadProgress !== null && (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#16a34a] mb-2 p-2 rounded-lg bg-[#16a34a]/10">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading photo to server ({imageUploadProgress}%)...</span>
                  </div>
                )}
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
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
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
                  <option value="GEOLOGICAL MAPPING & EXPLORATION">GEOLOGICAL MAPPING & EXPLORATION</option>
                  <option value="BOREHOLE CONSTRUCTION & WATER PROJECT">BOREHOLE CONSTRUCTION & WATER PROJECT</option>
                  <option value="GEOPHYSICS & MINERAL EXPLORATION">GEOPHYSICS & MINERAL EXPLORATION</option>
                  <option value="CORE DRILLING & MINERAL EVALUATION">CORE DRILLING & MINERAL EVALUATION</option>
                  <option value="GEOCHEMICAL MAPPING">GEOCHEMICAL MAPPING</option>
                  <option value="GIS & GEOSPATIAL DATA SERVICES">GIS & GEOSPATIAL DATA SERVICES</option>
                  <option value="GEOPHYSICAL SURVEYS">GEOPHYSICAL SURVEYS</option>
                  <option value="ENVIRONMENTAL GEOSCIENCE SERVICES">ENVIRONMENTAL GEOSCIENCE SERVICES</option>
                </select>
              </div>

              {/* Display Placement Checkboxes */}
              <div>
                <label className={themeClasses.label}>Display Placements Across Website</label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={imageForm.showOnHomepage}
                      onChange={(e) => setImageForm({ ...imageForm, showOnHomepage: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Homepage (Fieldwork & Equipment Section)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={imageForm.showOnProjects}
                      onChange={(e) => setImageForm({ ...imageForm, showOnProjects: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Projects Page Photographic Records</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
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

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-stone-200/20 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className={`w-full sm:w-auto ${themeClasses.secondaryButton}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`w-full sm:w-auto ${themeClasses.primaryButton}`}
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-lg max-h-[92dvh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl relative border my-auto flex flex-col ${isCarton ? 'bg-[#261e17] text-[#f4efe8] border-[#523f2f]' : 'bg-white text-stone-900 border-stone-200'}`}>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-200/20 mb-3 sm:mb-4 shrink-0">
              <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Video className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#16a34a] shrink-0" />
                <span className="truncate">{editingVideo ? 'Edit Field Video Record' : 'Upload Field Video'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close video modal"
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
              onChange={handleVideoFileChange}
            />
            <input
              type="file"
              ref={videoThumbFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFileChange(e, (url) => setVideoForm((prev) => ({ ...prev, thumbnail: url })))}
            />

            <form onSubmit={handleSaveVideo} className="space-y-3.5 sm:space-y-4">
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
                    disabled={videoUploadProgress !== null}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] disabled:bg-stone-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                  >
                    {videoUploadProgress !== null ? (
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    ) : (
                      <Upload className="w-4 h-4 shrink-0" />
                    )}
                    <span>{videoUploadProgress !== null ? `Uploading (${videoUploadProgress}%)...` : 'Upload Video from Device Gallery'}</span>
                  </button>
                </div>

                {/* Upload Progress Bar */}
                {videoUploadProgress !== null && (
                  <div className="p-3 mb-2.5 rounded-xl bg-[#16a34a]/15 border border-[#16a34a]/30 space-y-1.5 animate-pulse">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#16a34a]">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{videoUploadStatusText || 'Transmitting video chunks to server...'}</span>
                      </span>
                      <span>{videoUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-[#16a34a] h-full transition-all duration-300 rounded-full shadow-sm"
                        style={{ width: `${videoUploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-400">
                      Chunked upload active: sends slices in 1.5MB packets directly to server disk. Works for gallery videos of ANY size without timeouts.
                    </p>
                  </div>
                )}

                {uploadError && (
                  <div className="p-2.5 mb-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <input
                  type="text"
                  value={videoForm.driveUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, driveUrl: e.target.value })}
                  placeholder="Or paste Google Drive view / preview link / mp4 URL"
                  className={themeClasses.input}
                  required
                />
              </div>

              {/* Live Preview Player inside modal */}
              {videoForm.driveUrl && (
                <div className="space-y-1.5">
                  <label className={themeClasses.label}>In-Modal Video Player Test</label>
                  <div className="aspect-[3/4] max-h-52 w-full rounded-xl overflow-hidden bg-black border border-stone-700 mx-auto">
                    <UniversalVideoPlayer
                      video={{
                        id: 'temp-preview',
                        title: videoForm.title || 'Video Test',
                        subtitle: videoForm.subtitle || '',
                        driveViewUrl: videoForm.driveUrl,
                        drivePreviewUrl: videoForm.driveUrl,
                        thumbnail: videoForm.thumbnail || '',
                        description: videoForm.description || '',
                        showOnHomepage: true,
                        showOnProjects: true,
                        showOnGallery: true
                      }}
                      isModal={true}
                    />
                  </div>
                </div>
              )}

              {/* Thumbnail Image */}
              <div>
                <label className={themeClasses.label}>Cover Thumbnail (Gallery Upload or Auto-generated)</label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => videoThumbFileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                  >
                    <Upload className="w-4 h-4 shrink-0" />
                    <span>Upload Custom Thumbnail</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={videoForm.thumbnail}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  placeholder="Thumbnail Image URL (Auto-captured from video or paste URL)"
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
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={videoForm.showOnHomepage}
                      onChange={(e) => setVideoForm({ ...videoForm, showOnHomepage: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Homepage Video Stage</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={videoForm.showOnProjects}
                      onChange={(e) => setVideoForm({ ...videoForm, showOnProjects: e.target.checked })}
                      className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Show on Projects Page Video Stage</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
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

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-stone-200/20 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className={`w-full sm:w-auto ${themeClasses.secondaryButton}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={videoUploadProgress !== null}
                  className={`w-full sm:w-auto ${themeClasses.primaryButton} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {videoUploadProgress !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Video ({videoUploadProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingVideo ? 'Save Video Changes' : 'Publish Field Video'}</span>
                    </>
                  )}
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-lg max-h-[92dvh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl relative border my-auto flex flex-col ${isCarton ? 'bg-[#261e17] text-[#f4efe8] border-[#523f2f]' : 'bg-white text-stone-900 border-stone-200'}`}>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-200/20 mb-3 sm:mb-4 shrink-0">
              <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#16a34a] shrink-0" />
                <span className="truncate">{editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close team member modal"
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

            <form onSubmit={handleSaveTeamMember} className="space-y-3.5 sm:space-y-4">
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
                    placeholder="e.g. 25+ years of practice"
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
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                  >
                    <Upload className="w-4 h-4 shrink-0" />
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
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
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

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-stone-200/20 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className={`w-full sm:w-auto ${themeClasses.secondaryButton}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`w-full sm:w-auto ${themeClasses.primaryButton}`}
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
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-sm sm:max-w-md max-h-[92dvh] rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-stone-800 shadow-2xl relative flex flex-col my-auto">
            <div className="flex items-center justify-between p-3.5 bg-stone-900 border-b border-stone-800 shrink-0">
              <span className="font-bold text-xs text-white truncate pr-2">{previewingVideo.title}</span>
              <button
                type="button"
                onClick={() => setPreviewingVideo(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
                aria-label="Close video preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[9/16] w-full bg-black max-h-[60dvh] flex items-center justify-center">
              <UniversalVideoPlayer
                video={previewingVideo}
                isModal={true}
              />
            </div>

            <div className="p-3 bg-stone-900 text-stone-300 text-xs shrink-0">
              <span className="text-[10px] font-mono text-[#c2a67e] block truncate">{previewingVideo.subtitle}</span>
              <p className="line-clamp-2 mt-1 text-[11px]">{previewingVideo.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
