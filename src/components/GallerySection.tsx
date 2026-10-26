import React, { useState, useEffect } from 'react';
import { Camera, Film, Eye, Play, Shield, MapPin, Calendar, WifiOff, Wifi, Maximize2, X } from 'lucide-react';
import { MediaItem, ProjectVideo } from '../types';
import { ALL_PROJECT_VIDEOS } from '../data/companyData';

interface GallerySectionProps {
  images: MediaItem[];
  videos?: ProjectVideo[];
  selectedLightboxImage: MediaItem | null;
  onCloseLightbox: () => void;
  onOpenLightbox: (image: MediaItem) => void;
  isStandalonePage?: boolean;
  showVideoSection?: boolean;
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
  excludeCategories?: string[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  images,
  videos,
  selectedLightboxImage,
  onCloseLightbox,
  onOpenLightbox,
  isStandalonePage = false,
  showVideoSection = true,
  title = "Comprehensive Fieldwork Archive",
  subtitle = "Explore authentic photographs capturing geological mappings, borehole siting, geophysical instrumentation, core recovery, and project executions in real African terrains.",
  badgeLabel = "Photographic Field Records",
  excludeCategories = []
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsFullPreviewOpen(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Lock body scroll when Full Preview Modal is open
  useEffect(() => {
    if (isFullPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullPreviewOpen]);

  const baseCategories = [
    { key: 'all', label: 'All Images' },
    { key: 'geology', label: 'Geological Fieldwork' },
    { key: 'geophysics', label: 'Geophysical Profiling' },
    { key: 'groundwater', label: 'Groundwater & VES' },
    { key: 'drilling', label: 'Drilling & Core Logging' },
    { key: 'instruments', label: 'Instruments & Sensors' },
    { key: 'environmental', label: 'Environmental Studies' },
    { key: 'team', label: 'Field Personnel' },
  ];

  const categories = baseCategories.filter((cat) => !excludeCategories.includes(cat.key));

  const validImages = excludeCategories.length > 0
    ? images.filter((img) => !excludeCategories.includes(img.category))
    : images;

  const filteredImages = activeCategory === 'all'
    ? validImages
    : validImages.filter((img) => img.category === activeCategory);

  const activeVideosList = videos && videos.length > 0 ? videos : ALL_PROJECT_VIDEOS;
  const activeVideo: ProjectVideo = activeVideosList[selectedVideoIndex] || activeVideosList[0];

  const handleSelectVideo = (idx: number) => {
    setSelectedVideoIndex(idx);
  };

  return (
    <div className="bg-white font-sans text-stone-900">
      
      {/* 1. DEDICATED VIDEO GALLERY SECTION (Displays Field Videos) */}
      {showVideoSection && (
        <section className="py-16 sm:py-24 bg-[#faf7f2] border-b border-[#c2a67e]/25 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
            
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2a67e]/35 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3 shadow-xs">
                <Film className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Video Documentation Archive</span>
                <span aria-hidden="true" className="text-stone-300">/</span>
                <span>{activeVideosList.length} Field Records</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
                Video Gallery: <span className="text-[#16a34a]">Field Operations & Drilling</span>
              </h2>
              <p className="text-base text-stone-600 mt-3 leading-relaxed">
                Watch verified field footage documenting deep rotary borehole drilling, trial pit trenching, alluvial panning, and geophysical data acquisition executed on active concessions.
              </p>
            </div>

            {/* Fast In-Line Video Player inside an Animated Glowing Modern Shape Frame */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Active Player (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                
                <div className="relative">
                  {/* 1. Animated Ambient Morphing Glow Shape behind the video */}
                  <div className="absolute -inset-4 sm:-inset-6 pointer-events-none -z-10">
                    <div className="absolute -top-8 -left-8 w-72 h-72 bg-gradient-to-br from-[#16a34a]/35 via-[#4ade80]/20 to-[#c2a67e]/25 rounded-full blur-3xl animate-float-blob" />
                    <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-gradient-to-tl from-[#c2a67e]/30 via-[#16a34a]/20 to-[#0d9488]/25 rounded-full blur-3xl animate-pulse-glow" />
                  </div>

                  {/* 2. Animated Glowing Border Frame (Dedicated Portrait Standard for Mobile & Desktop) */}
                  <div className="relative p-[2.5px] rounded-[28px] sm:rounded-[34px] overflow-hidden shadow-2xl bg-stone-900 transition-all duration-500 mx-auto max-w-[360px] sm:max-w-[400px] w-full">
                    
                    {/* Rotating Conic Ribbon */}
                    <div className="absolute -inset-[150%] animate-rotate-gradient bg-[conic-gradient(from_0deg_at_50%_50%,#16a34a_0deg,#c2a67e_70deg,#22c55e_150deg,#86efac_240deg,#16a34a_360deg)] opacity-80" />

                    {/* Inner Screen Container - Dedicated Portrait Screen for Mobile */}
                    <div className="relative w-full overflow-hidden bg-black transition-all duration-500 rounded-[26px] sm:rounded-[32px] aspect-[9/16] sm:aspect-[3/4]">
                      
                      {isOnline ? (
                        /* Live Direct In-Place Video Player: 100% Brightness, Zero Dimming, Watchable Instantly */
                        <div className="relative w-full h-full bg-black overflow-hidden">
                          <iframe
                            key={activeVideo.id}
                            src={activeVideo.drivePreviewUrl}
                            title={activeVideo.title}
                            className="w-full border-0 block brightness-100 contrast-100"
                            style={{
                              height: 'calc(100% + 48px)',
                              marginTop: '-48px',
                              width: '100%'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />

                          {/* Solid black mask over top-right corner to permanently conceal and block any pop-out arrow */}
                          <div 
                            className="absolute top-0 right-0 w-16 h-12 z-20 bg-black pointer-events-auto cursor-default select-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            aria-hidden="true"
                          />

                          {/* Top Right: Full Preview Expand Icon Button */}
                          <button
                            onClick={() => setIsFullPreviewOpen(true)}
                            className="absolute top-2.5 right-2.5 z-30 px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-[11px] font-mono border border-white/25 shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all active:scale-95"
                            title="Expand to Full Preview modal"
                            aria-label="Open Full Preview mode"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-[#4ade80]" />
                            <span className="font-semibold hidden sm:inline">Full Preview</span>
                          </button>
                        </div>
                      ) : (
                        /* Offline Fallback: Show High-Res Picture Preview with no iframe error screen */
                        <div className="relative w-full h-full select-none flex items-center justify-center bg-black">
                          <img
                            src={activeVideo.thumbnail}
                            alt={activeVideo.title}
                            className="w-full h-full object-cover brightness-100 contrast-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-4 text-center">
                            <div className="bg-black/90 p-4 rounded-xl border border-white/20 text-white max-w-sm space-y-2">
                              <p className="text-xs font-mono font-bold text-[#86efac]">Offline Preview Mode</p>
                              <p className="text-[11px] text-stone-300">Photographic preview active. Reconnect to the internet to stream this video record directly.</p>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 font-mono px-1 mx-auto max-w-[360px] sm:max-w-[400px] w-full">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Shield className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Portrait Mobile Record {selectedVideoIndex < 9 ? `0${selectedVideoIndex + 1}` : selectedVideoIndex + 1} of {activeVideosList.length}</span>
                  </span>
                  <button
                    onClick={() => setIsFullPreviewOpen(true)}
                    className="text-[#16a34a] hover:underline font-bold cursor-pointer"
                  >
                    Open Full Preview
                  </button>
                </div>
              </div>

              {/* Active Video Technical Meta (4 cols) */}
              <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#c2a67e]/35 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#16a34a] font-bold uppercase">
                  <Shield className="w-4 h-4" />
                  <span>Field Operational Metadata</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-xs font-medium text-[#8b6b3e]">
                  {activeVideo.subtitle}
                </p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {activeVideo.description}
                </p>
                <div className="pt-3 border-t border-[#c2a67e]/20 text-xs font-mono text-[#8b6b3e] space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    <span>Direct In-Place Streaming</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    <span>COMEG Certified Operations</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    <span>Groundwater & Mineral Exploration</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Video Playlist Grid (Field Videos Available for Immediate In-Place Playback) */}
            <div className="pt-4 border-t border-[#c2a67e]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono text-[#8b6b3e] uppercase font-bold tracking-wider">
                  Select from All {activeVideosList.length} Operational Records:
                </h3>
                <span className="text-xs text-stone-500 font-mono">
                  Click any thumbnail to play instantly
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {activeVideosList.map((vid, idx) => {
                  const isCurrent = idx === selectedVideoIndex;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => handleSelectVideo(idx)}
                      className={`group relative rounded-xl overflow-hidden p-2 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[#16a34a] bg-white ring-2 ring-[#16a34a]/30 shadow-md'
                          : 'border-[#c2a67e]/30 bg-white/80 hover:bg-white hover:border-[#16a34a]/60 hover:shadow-sm'
                      }`}
                      title={vid.title}
                    >
                      <div>
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-black mb-2">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 brightness-100 contrast-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              isCurrent ? 'bg-[#16a34a] text-white shadow-md' : 'bg-black/60 text-white group-hover:scale-110 transition-transform'
                            }`}>
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#16a34a] text-white">
                              Active
                            </span>
                          )}
                          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-600 text-white">
                            Portrait
                          </span>
                        </div>

                        <span className="text-[9px] font-mono text-[#16a34a] font-bold block">
                          Video {idx < 9 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <h4 className="text-[11px] font-bold text-stone-900 line-clamp-2 leading-snug mt-0.5 group-hover:text-[#16a34a] transition-colors">
                          {vid.title}
                        </h4>
                      </div>

                      <p className="text-[9.5px] text-stone-500 line-clamp-1 mt-1">
                        {vid.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 2. PHOTOGRAPHIC FIELDWORK ARCHIVE (All Images with Subtitles & Full Lightbox Preview) */}
      <section 
        id="gallery"
        className={`relative ${isStandalonePage ? 'py-16 sm:py-24' : 'py-20 lg:py-28'} bg-white text-stone-900`}
        aria-label="Dedicated Visual Fieldwork Archive"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f2ec] border border-[#c2a67e]/30 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-4">
                <Camera className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>{badgeLabel}</span>
                <span aria-hidden="true" className="text-stone-400">/</span>
                <span>{filteredImages.length} Verified Records</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight [text-wrap:balance]">
                {title}
              </h2>

              <p className="text-base text-stone-600 mt-4 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Filter Pills / Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-xl bg-[#faf7f2] border border-[#c2a67e]/30 shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.key
                      ? 'bg-[#16a34a] text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid (Responsive Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => onOpenLightbox(image)}
                className="group relative rounded-2xl overflow-hidden border border-[#c2a67e]/30 bg-stone-900 aspect-[4/3] shadow-sm hover:shadow-xl hover:border-[#16a34a] transition-all duration-300 cursor-pointer"
                title={`Click for full preview: ${image.title} | ${image.caption}`}
              >
                <img
                  src={image.url}
                  alt={image.alt || image.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Glass Caption & Subtitle */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#c2a67e] font-semibold uppercase tracking-wider mb-0.5">
                    <span>{image.category}</span>
                    {image.date && <span className="text-stone-300">{image.date}</span>}
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#4ade80] transition-colors leading-tight mt-0.5">
                    {image.title}
                  </h4>
                  {image.caption && (
                    <p className="text-[11px] text-stone-200 line-clamp-2 mt-1 leading-snug font-normal drop-shadow-xs">
                      {image.caption}
                    </p>
                  )}
                  {image.location && (
                    <span className="flex items-center gap-1 text-[9.5px] text-stone-400 mt-1 line-clamp-1 font-mono">
                      <MapPin className="w-2.5 h-2.5 text-[#16a34a] shrink-0" />
                      <span>{image.location}</span>
                    </span>
                  )}
                </div>

                {/* View Overlay Icon */}
                <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Eye className="w-4 h-4 text-[#4ade80]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FULL PREVIEW MODAL FOR IMMERSIVE VIEWING */}
      {isFullPreviewOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar */}
          <div className="w-full max-w-[440px] mx-auto flex items-center justify-between py-2 sm:py-3 px-2 text-white mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold font-mono text-[#86efac] uppercase tracking-wider truncate max-w-[220px] sm:max-w-xs">
                [Portrait View] {activeVideo.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                  } else {
                    document.documentElement.requestFullscreen().catch(() => {});
                  }
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                title="Toggle device full screen"
              >
                <Maximize2 className="w-4 h-4 text-[#4ade80]" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
              <button
                onClick={() => setIsFullPreviewOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                aria-label="Close full preview"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>

          {/* Full Screen Theatre Box (Dedicated Mobile Portrait Standard) */}
          <div className="relative w-full max-w-[420px] h-[82vh] max-h-[850px] aspect-[9/16] sm:aspect-[3/4] overflow-hidden bg-black shadow-2xl border border-white/20 transition-all duration-300 rounded-2xl mx-auto">
            <iframe
              key={`modal-gal-${activeVideo.id}`}
              src={activeVideo.drivePreviewUrl}
              title={activeVideo.title}
              className="w-full h-full border-0 block brightness-100 contrast-100"
              style={{
                height: 'calc(100% + 48px)',
                marginTop: '-48px',
                width: '100%'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Top-right shield in modal to block pop-out arrow */}
            <div 
              className="absolute top-0 right-0 w-16 h-12 z-30 bg-black pointer-events-auto cursor-default select-none"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              aria-hidden="true"
            />
          </div>

          {/* Bottom Subtitle Bar */}
          <div className="w-full max-w-[440px] mx-auto mt-3 px-2 text-stone-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <p className="line-clamp-2">{activeVideo.subtitle}</p>
            <span className="text-[11px] font-mono text-[#c2a67e] shrink-0">
              Portrait 9:16 Field Capture
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
