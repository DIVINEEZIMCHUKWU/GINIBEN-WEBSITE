import React, { useState, useEffect } from 'react';
import { Film, CheckCircle2, Shield, Play, Maximize2, X } from 'lucide-react';
import { ProjectVideo } from '../types';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';

interface FeaturedVideoSectionProps {
  videos: ProjectVideo[];
  onExploreProjects?: () => void;
}

export const FeaturedVideoSection: React.FC<FeaturedVideoSectionProps> = ({
  videos,
  onExploreProjects
}) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
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

  const activeVideo = videos[selectedVideoIndex] || videos[0];

  if (!activeVideo) return null;

  const handleSelectVideo = (index: number) => {
    setSelectedVideoIndex(index);
  };

  return (
    <section
      id="videos"
      className="relative py-16 sm:py-24 lg:py-28 bg-[#fbf9f5] text-stone-900 overflow-hidden border-t border-[#c2a67e]/25 font-sans"
      aria-label="Featured Drilling and Subsurface Operations Documentation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2a67e]/35 text-xs font-mono text-[#8b6b3e] uppercase tracking-wider mb-3 shadow-xs">
            <Film className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Field Video Archive</span>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span>Verified Drilling Records</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-tight [text-wrap:balance]">
            Drilling Operations & <span className="text-[#16a34a]">Subsurface Data Acquisition</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-600 mt-4 leading-relaxed font-normal">
            Direct operational capture of deep drilling rig logistics, stratigraphical core logging, ground validation, and engineering fieldwork executed by GiniBen technical personnel.
          </p>
        </div>

        {/* Video Stage Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Video Embed (8 cols) inside Animated Modern Shape Frame */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            <div className="relative">
              {/* 1. Animated Ambient Morphing Glow Shape behind the video */}
              <div className="absolute -inset-4 sm:-inset-6 pointer-events-none -z-10">
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-gradient-to-br from-[#16a34a]/35 via-[#4ade80]/20 to-[#c2a67e]/25 rounded-full blur-3xl animate-float-blob" />
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-gradient-to-tl from-[#c2a67e]/30 via-[#16a34a]/20 to-[#0d9488]/25 rounded-full blur-3xl animate-pulse-glow" />
              </div>

              {/* 2. Animated Glowing Border Frame (Dedicated Portrait Standard for Mobile & Desktop) */}
              <div className="relative p-[2.5px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl bg-stone-900 transition-all duration-500 mx-auto max-w-[360px] sm:max-w-[400px] w-full">
                
                {/* Rotating Conic Ribbon */}
                <div className="absolute -inset-[150%] animate-rotate-gradient bg-[conic-gradient(from_0deg_at_50%_50%,#16a34a_0deg,#c2a67e_70deg,#22c55e_150deg,#86efac_240deg,#16a34a_360deg)] opacity-80" />

                {/* Inner Screen Container - Standard Display for Mobile & Laptops */}
                <div className="relative w-full overflow-hidden bg-black transition-all duration-500 rounded-[22px] sm:rounded-[30px] aspect-[9/16] sm:aspect-[3/4]">
                  <UniversalVideoPlayer
                    video={activeVideo}
                    onOpenFullPreview={() => setIsFullPreviewOpen(true)}
                  />
                </div>
              </div>
            </div>

            {/* In-place status notice */}
            <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 font-mono pt-1 px-2 gap-2 mx-auto max-w-[360px] sm:max-w-[400px] w-full">
              <span className="flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Portrait Mobile Field Capture</span>
              </span>
              <span className="text-[#8b6b3e] font-semibold">
                HD Operational Video
              </span>
            </div>

            {/* 10-Video Interactive Selector Grid below the main player */}
            <div className="pt-2">
              <div className="text-xs font-mono text-[#8b6b3e] uppercase font-bold tracking-wider mb-2.5 flex items-center justify-between">
                <span>Select from All {videos.length} Drilling & Field Records:</span>
                <span className="text-[11px] text-stone-500 font-normal">Active Record {selectedVideoIndex < 9 ? `0${selectedVideoIndex + 1}` : selectedVideoIndex + 1} of {videos.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {videos.map((vid, idx) => {
                  const isSelected = idx === selectedVideoIndex;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => handleSelectVideo(idx)}
                      className={`relative rounded-xl overflow-hidden p-2 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#16a34a] bg-white ring-2 ring-[#16a34a]/30 shadow-md'
                          : 'border-[#c2a67e]/30 bg-white/70 hover:bg-white hover:border-[#16a34a]/50 hover:shadow-xs'
                      }`}
                      title={vid.title}
                    >
                      <div>
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-stone-900 mb-2">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-[#16a34a] text-white shadow-md' : 'bg-black/60 text-white'
                            }`}>
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                          </div>
                          {isSelected && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#16a34a] text-white">
                              Active
                            </span>
                          )}
                          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-600 text-white">
                            Portrait
                          </span>
                        </div>
                        <span className="text-[9.5px] font-mono text-[#16a34a] font-bold block">
                          Record {idx < 9 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1 leading-snug mt-0.5">
                          {vid.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1 mt-1">
                        {vid.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Operational Context & Highlights (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#c2a67e]/35 shadow-lg shadow-[#9c7a4e]/5 space-y-5">
              
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#16a34a] uppercase font-bold tracking-wider">
                  Fieldwork Specification
                </span>
                <h3 className="text-xl font-bold text-stone-900 leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-xs font-medium text-[#8b6b3e]">
                  {activeVideo.subtitle}
                </p>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">
                {activeVideo.description}
              </p>

              {/* Verified Technical Highlights */}
              <div className="pt-3 border-t border-[#c2a67e]/20 space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                  <span>Continuous core sample extraction & stratigraphical logging</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                  <span>Downhole geophysical validation & drilling fluid monitoring</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                  <span>Supervised by COMEG Registered Lead Consultants</span>
                </div>
              </div>

              {onExploreProjects && (
                <div className="pt-2">
                  <button
                    onClick={onExploreProjects}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm transition-all shadow-md shadow-[#16a34a]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Explore Documented Projects</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

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

          {/* Full Screen Theatre Box (Adaptive Display for All Devices) */}
          <div className="relative w-full max-w-[500px] h-[82vh] max-h-[850px] aspect-[9/16] sm:aspect-[3/4] overflow-hidden bg-black shadow-2xl border border-white/20 transition-all duration-300 rounded-2xl mx-auto flex items-center justify-center">
            <UniversalVideoPlayer
              video={activeVideo}
              isModal={true}
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
    </section>
  );
};
