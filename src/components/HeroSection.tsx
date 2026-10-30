import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Compass, ShieldCheck, Layers, Play, Pause, Maximize2, Award } from 'lucide-react';
import { MediaItem } from '../types';

interface HeroSectionProps {
  heroImages: MediaItem[];
  onExploreServices: () => void;
  onDiscussProject: () => void;
  onOpenImageLightbox: (image: MediaItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroImages,
  onExploreServices,
  onDiscussProject,
  onOpenImageLightbox
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Take the 15 curated company photos to cover the Hero section
  const displayImages = heroImages.slice(0, 15);

  // Auto-advance through the 15 images one by one
  useEffect(() => {
    if (!isPlaying || displayImages.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayImages.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying, displayImages.length]);

  // Continuous Typing Animation for "GEOSERVICES LTD" only
  const typingText = "GEOSERVICES LTD";

  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (charCount < typingText.length) {
        timeout = setTimeout(() => {
          setCharCount((prev) => prev + 1);
        }, 90);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2600);
      }
    } else {
      if (charCount > 0) {
        timeout = setTimeout(() => {
          setCharCount((prev) => prev - 1);
        }, 45);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [charCount, isDeleting, typingText.length]);

  const activeImage = displayImages[activeIndex] || displayImages[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const stats = [
    { value: "180+", label: "Projects", sub: "Executed" },
    { value: "35", label: "Years", sub: "Experience" },
    { value: "500k", label: "KL/day", sub: "Yield Target" },
    { value: "12+", label: "Rigs", sub: "Fleet Operations" },
  ];

  return (
    <section 
      id="home"
      className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-stone-950 text-white pt-20 pb-16 lg:py-24"
      aria-label="GiniBen & Partners Fieldwork Hero Showcase"
    >
      {/* 1. Full-Bleed Background Images Covering the Entire Hero Section (Optimized for Visibility) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {displayImages.map((img, idx) => (
          <div
            key={img.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } transition-transform duration-[6000ms]`}
          >
            <img
              src={img.url}
              alt={img.alt || img.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}

        {/* Lighter, balanced gradient scrim so the full fieldwork photo is clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent" />
      </div>

      {/* 2. Main Hero Content with Heavy Morphism Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Glassmorphic Core Brand Card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="glass-dark-morphism p-5 sm:p-8 lg:p-11 rounded-2xl sm:rounded-3xl border border-white/30 shadow-2xl space-y-5 sm:space-y-6">
              
              {/* Domain-Native Unboxed Kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#c2a67e] tracking-wider uppercase font-semibold">
                <span className="text-[#86efac]">COMEG Registered</span>
                <span aria-hidden="true" className="text-white/40">·</span>
                <span className="text-stone-300">ISO 9001:2000 Aligned</span>
                <span aria-hidden="true" className="text-white/40">·</span>
                <span className="text-[#86efac]">CAMA 1990</span>
              </div>

              {/* Main Display Headline with Continuous Typing Animation on GEOSERVICES LTD */}
              <div className="space-y-2">
                <h1 
                  className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.14] min-h-[4.75rem] sm:min-h-[6.5rem] lg:min-h-[7.8rem] flex flex-col justify-start"
                  aria-label="GiniBen & Partners GEOSERVICES LTD"
                >
                  <span aria-hidden="true" className="block select-none">
                    {/* Line 1: GiniBen & Partners (Static) */}
                    <span>GiniBen & Partners</span>
                    <br />

                    {/* Line 2: GEOSERVICES LTD (Typing continuously) */}
                    <span className="text-[#86efac]">
                      {typingText.slice(0, charCount)}
                      <span className="inline-block w-[3px] h-[0.82em] bg-[#86efac] ml-1.5 align-baseline animate-pulse shadow-[0_0_8px_#86efac]" />
                    </span>
                  </span>
                </h1>
                <p className="text-lg sm:text-2xl font-medium text-stone-200 tracking-tight">
                  Precision Beneath the Surface.
                </p>
              </div>

              {/* Core Corporate Overview Excerpt */}
              <p className="text-xs sm:text-base text-stone-200 font-normal leading-relaxed">
                Professional geoscience consulting and contracting firm delivering high-value technical solutions across mineral resources, infrastructure, environmental, and water sectors.
              </p>

              {/* Supporting Value Statements */}
              <div className="pt-2 pb-1 border-y border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs text-stone-200">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#4ade80] shrink-0" />
                  <span className="font-medium">Exploring Resources. Unlocking Potential.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#c2a67e] shrink-0" />
                  <span className="font-medium">Data. Depth. Development.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4ade80] shrink-0" />
                  <span className="font-medium">Geoscience Meets Investment Confidence.</span>
                </div>
              </div>

              {/* Action Buttons (Full width on mobile, inline on sm+) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
                <button
                  onClick={onExploreServices}
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-stone-950 bg-[#22c55e] hover:bg-[#4ade80] transition-all rounded-xl shadow-lg shadow-[#22c55e]/25 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onDiscussProject}
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 hover:border-[#4ade80] transition-all rounded-xl cursor-pointer backdrop-blur-md text-center"
                >
                  Book Technical Consultation
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Correlated Active Photo Card (Morphism Floating Widget) */}
          <div className="lg:col-span-5 flex flex-col justify-end space-y-4">
            <div className="glass-dark-morphism p-5 sm:p-6 rounded-3xl border border-white/35 shadow-2xl space-y-4">
              
              {/* Category Pill & Live Status (without the unwanted text) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse" />
                  <span className="text-xs font-mono text-[#86efac] uppercase font-bold tracking-wider">
                    {activeImage.category} Field Documentation
                  </span>
                </div>

                <button
                  onClick={() => onOpenImageLightbox(activeImage)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-xs text-stone-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Inspect Full Photo</span>
                </button>
              </div>

              {/* Exact Correlating Image Name & Caption */}
              <div className="space-y-1.5 border-l-2 border-[#22c55e] pl-3 py-1">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {activeImage.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {activeImage.caption}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#22c55e] h-full transition-all duration-500 ease-out rounded-full shadow-sm"
                  style={{ width: `${((activeIndex + 1) / displayImages.length) * 100}%` }}
                />
              </div>

              {/* Controls */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-lg bg-white/10 hover:bg-[#22c55e] hover:text-stone-950 text-white transition-colors cursor-pointer border border-white/20"
                    aria-label="Previous Fieldwork Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-[#22c55e] hover:text-stone-950 text-white transition-colors cursor-pointer border border-white/20"
                    aria-label={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-2 rounded-lg bg-white/10 hover:bg-[#22c55e] hover:text-stone-950 text-white transition-colors cursor-pointer border border-white/20"
                    aria-label="Next Fieldwork Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs font-mono text-stone-400">
                  Field Asset {activeIndex + 1} of {displayImages.length}
                </span>
              </div>

            </div>

            {/* Thumbnail Navigator for 15 Fieldwork Images */}
            <div className="p-2 rounded-2xl glass-dark-morphism border border-white/25 flex gap-1.5 overflow-x-auto no-scrollbar">
              {displayImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative w-11 h-9 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'border-[#22c55e] ring-2 ring-[#22c55e]/70 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Show ${img.title}`}
                  title={img.title}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* 3. The 4 Key Statistics Metrics Requested: 180+ Projects, 35 Years, 500k KL/day, 12+ Rigs */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass-dark-morphism p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-white/25 shadow-xl hover:border-[#22c55e]/60 transition-all text-center flex flex-col justify-center items-center group"
              >
                <span className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#4ade80] group-hover:scale-105 transition-transform duration-300 block">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-1 block">
                  {stat.label}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-stone-300 mt-0.5">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
