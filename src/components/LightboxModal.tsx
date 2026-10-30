import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Tag, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ZoomIn, 
  ZoomOut,
  Layers
} from 'lucide-react';
import { MediaItem } from '../types';

interface LightboxModalProps {
  image: MediaItem | null;
  allImages: MediaItem[];
  onClose: () => void;
  onSelectImage: (img: MediaItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  image,
  allImages,
  onClose,
  onSelectImage,
}) => {
  const [fillMode, setFillMode] = useState<'contain' | 'fill'>('contain');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);

  // Reset zoom on image change
  useEffect(() => {
    setIsZoomed(false);
  }, [image?.id]);

  const currentIndex = image ? allImages.findIndex((item) => item.id === image.id) : -1;
  const totalCount = allImages.length;

  const handleNext = useCallback(() => {
    if (currentIndex === -1 || totalCount === 0) return;
    const nextIdx = (currentIndex + 1) % totalCount;
    onSelectImage(allImages[nextIdx]);
  }, [currentIndex, totalCount, allImages, onSelectImage]);

  const handlePrev = useCallback(() => {
    if (currentIndex === -1 || totalCount === 0) return;
    const prevIdx = (currentIndex - 1 + totalCount) % totalCount;
    onSelectImage(allImages[prevIdx]);
  }, [currentIndex, totalCount, allImages, onSelectImage]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!image) return;
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'f' || e.key === 'F') {
      setFillMode((prev) => (prev === 'contain' ? 'fill' : 'contain'));
    }
  }, [image, onClose, handleNext, handlePrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (image) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [image]);

  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col bg-stone-950/95 backdrop-blur-xl text-stone-100 font-sans transition-opacity duration-300 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Image Full Preview Lightbox"
    >
      {/* 1. TOP CONTROL BAR */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md">
        
        {/* Left: Counter & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-mono">
            <span className="text-[#4ade80] font-bold">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-300">{String(totalCount).padStart(2, '0')}</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#c2a67e] uppercase tracking-wider font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Verified Technical Field Record</span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Fill / Contain Mode Toggle */}
          <button
            onClick={() => setFillMode((prev) => (prev === 'contain' ? 'fill' : 'contain'))}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              fillMode === 'fill'
                ? 'bg-[#16a34a] text-white border-[#16a34a]'
                : 'bg-white/10 text-stone-200 border-white/15 hover:bg-white/20'
            }`}
            title={fillMode === 'contain' ? 'Switch to Full Fill View (F)' : 'Switch to Fit Screen View (F)'}
          >
            {fillMode === 'fill' ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fit Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fill View</span>
              </>
            )}
          </button>

          {/* Zoom Toggle */}
          <button
            onClick={() => setIsZoomed((prev) => !prev)}
            className={`p-2 rounded-lg text-xs border transition-all cursor-pointer ${
              isZoomed 
                ? 'bg-[#16a34a] text-white border-[#16a34a]' 
                : 'bg-white/10 text-stone-200 border-white/15 hover:bg-white/20'
            }`}
            title={isZoomed ? 'Zoom Out' : 'Zoom In to Inspect Details'}
            aria-label="Toggle zoom"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* Toggle Thumbnails */}
          <button
            onClick={() => setShowThumbnails((prev) => !prev)}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              showThumbnails
                ? 'bg-white/10 text-stone-200 border-white/15 hover:bg-white/20'
                : 'bg-transparent text-stone-400 border-white/10'
            }`}
            title="Toggle thumbnail strip"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Strip</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white border border-red-500/40 transition-colors cursor-pointer"
            aria-label="Close Lightbox (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN VIEWPORT (IMAGE STAGE) */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-4 md:p-6 select-none">
        
        {/* Navigation Previous */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-stone-900/80 hover:bg-[#16a34a] text-white border border-white/20 shadow-2xl transition-all cursor-pointer active:scale-95 group"
          aria-label="Previous Image (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Navigation Next */}
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-stone-900/80 hover:bg-[#16a34a] text-white border border-white/20 shadow-2xl transition-all cursor-pointer active:scale-95 group"
          aria-label="Next Image (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Image Container with Fill / Contain Modes */}
        <div 
          className={`relative max-w-full max-h-full flex items-center justify-center transition-all duration-300 ${
            fillMode === 'fill' ? 'w-full h-full' : 'w-auto h-auto'
          }`}
          onClick={(e) => {
            // Click outside image dismisses, click on image zooms
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <div 
            className={`relative rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl transition-all duration-300 cursor-zoom-in ${
              isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'
            } ${
              fillMode === 'fill' 
                ? 'w-full h-full max-w-6xl max-h-[75vh]' 
                : 'max-w-5xl max-h-[68vh]'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed((prev) => !prev);
            }}
          >
            <img
              src={image.url}
              alt={image.alt || image.title}
              className={`w-full h-full transition-all duration-300 ${
                fillMode === 'fill' ? 'object-cover' : 'object-contain'
              }`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg') {
                  target.src = 'https://i.ibb.co/dwYLLnSP/IMG-20261030-WA0002.jpg';
                }
              }}
            />
          </div>
        </div>

      </div>

      {/* 3. BOTTOM CAPTION & METADATA BAR (Glassmorphism & Crisp Typography) */}
      <div className="shrink-0 p-4 sm:p-5 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1.5 max-w-3xl">
            {/* Meta tags line */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-md bg-[#16a34a]/30 border border-[#16a34a]/50 text-[#86efac] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                <span>{image.category}</span>
              </span>

              {image.location && (
                <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-stone-300 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#c2a67e]" />
                  <span>{image.location}</span>
                </span>
              )}

              {image.date && (
                <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-stone-300 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#c2a67e]" />
                  <span>{image.date}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {image.title}
            </h3>

            {/* Caption */}
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              {image.caption}
            </p>
          </div>

          {/* Quick instructions & mode info */}
          <div className="shrink-0 text-right hidden lg:block">
            <span className="text-[11px] font-mono text-stone-400 block">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-stone-200">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-stone-200">→</kbd> to navigate
            </span>
            <span className="text-[11px] font-mono text-stone-400 block mt-1">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-stone-200">F</kbd> for Fill View · <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-stone-200">Esc</kbd> to exit
            </span>
          </div>

        </div>

        {/* 4. HORIZONTAL THUMBNAIL TRAY (Quick Access to all 41 Images) */}
        {showThumbnails && (
          <div className="mt-3 pt-3 border-t border-white/10 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pb-1">
              {allImages.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => onSelectImage(item)}
                  className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    item.id === image.id
                      ? 'border-[#4ade80] scale-105 shadow-md shadow-[#16a34a]/30'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/60'
                  }`}
                  title={`${idx + 1}. ${item.title}`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {item.id === image.id && (
                    <div className="absolute inset-0 bg-[#16a34a]/25" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
