import React from 'react';
import { Camera, Eye, ArrowRight } from 'lucide-react';
import { MediaItem } from '../types';

interface DualTrackSliderProps {
  allImages: MediaItem[];
  onOpenLightbox: (image: MediaItem) => void;
  onViewFullGallery: () => void;
}

export const DualTrackSlider: React.FC<DualTrackSliderProps> = ({
  allImages,
  onOpenLightbox,
  onViewFullGallery
}) => {
  // Use a rich cross-section of 30 images from across the collection for the moving marquee track
  const trackImages = allImages.slice(0, 30);
  const seamlessMarqueeList = [...trackImages, ...trackImages];

  return (
    <section 
      className="relative py-14 bg-[#faf7f2] border-y border-[#c2a67e]/30 overflow-hidden font-sans"
      aria-label="Fieldwork Visual Slider"
    >
      {/* Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#c2a67e]/35 flex items-center justify-center text-[#16a34a] shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#8b6b3e] uppercase font-bold tracking-wider block">
                Continuous Field Photographic Stream
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                Authentic Operational Realities <span className="text-[#16a34a]">Across West Africa</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onViewFullGallery}
            className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-stone-900 hover:text-white bg-white hover:bg-[#16a34a] border border-[#c2a67e]/35 hover:border-[#16a34a] rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>View More Dedicated Photo Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Moving Marquee Track */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge blur */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#faf7f2] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#faf7f2] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-continuous flex gap-4 w-max py-2 select-none">
          {seamlessMarqueeList.map((img, idx) => (
            <div
              key={`${img.id}-${idx}`}
              onClick={() => onOpenLightbox(img)}
              className="relative w-64 sm:w-72 h-44 rounded-2xl overflow-hidden border border-[#c2a67e]/30 bg-stone-100 shrink-0 group cursor-pointer shadow-sm hover:shadow-xl hover:border-[#16a34a] transition-all duration-300"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <span className="text-[10px] font-mono text-[#c2a67e] uppercase font-bold tracking-wider block">
                  {img.category}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#86efac] transition-colors">
                  {img.title}
                </h4>
              </div>

              <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-stone-950/70 text-[#86efac] opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
