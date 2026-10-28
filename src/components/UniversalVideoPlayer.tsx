import React, { useState, useEffect } from 'react';
import { Maximize2, Play, Volume2, Shield, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { ProjectVideo } from '../types';
import { isVideoDirectFile, getFormattedVideoEmbedUrl } from '../utils/mediaUtils';

interface UniversalVideoPlayerProps {
  video: ProjectVideo;
  onOpenFullPreview?: () => void;
  className?: string;
  isModal?: boolean;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  video,
  onOpenFullPreview,
  className = '',
  isModal = false
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [hasPlaybackError, setHasPlaybackError] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const rawUrl = video.drivePreviewUrl || video.driveViewUrl || '';
  const isDirect = isVideoDirectFile(rawUrl);
  const formattedEmbedUrl = getFormattedVideoEmbedUrl(rawUrl);
  const isGoogleDrive = rawUrl.toLowerCase().includes('drive.google.com');

  if (!isOnline) {
    return (
      <div className={`relative w-full h-full select-none flex items-center justify-center bg-black ${className}`}>
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover brightness-100 contrast-100"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-4 text-center">
          <div className="bg-black/90 p-4 rounded-xl border border-white/20 text-white max-w-sm space-y-2 shadow-2xl">
            <p className="text-xs font-mono font-bold text-[#86efac]">Offline Preview Mode</p>
            <p className="text-[11px] text-stone-300">
              Field photographic preview active. Reconnect to stream this field video live.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 1. Direct Video Upload (MP4, WebM, MOV, /uploads/...) -> Native HTML5 Video
  if (isDirect) {
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}>
        {hasPlaybackError ? (
          <div className="text-center p-4 text-white space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-xs font-semibold">Video stream loading or codec formatting...</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setHasPlaybackError(false)}
                className="px-3 py-1.5 rounded-lg bg-[#16a34a] text-white text-xs font-bold hover:bg-[#15803d] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Stream</span>
              </button>
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Direct Stream</span>
              </a>
            </div>
          </div>
        ) : (
          <video
            key={`native-${video.id}-${rawUrl}`}
            src={rawUrl}
            poster={video.thumbnail}
            controls
            playsInline
            preload="metadata"
            onError={() => setHasPlaybackError(true)}
            className="w-full h-full object-contain bg-black"
          >
            <source src={rawUrl} type="video/mp4" />
            <source src={rawUrl} type="video/webm" />
            Your browser does not support HTML5 video streaming.
          </video>
        )}

        {onOpenFullPreview && !isModal && (
          <button
            type="button"
            onClick={onOpenFullPreview}
            className="absolute top-2.5 right-2.5 z-30 px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-[11px] font-mono border border-white/25 shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all active:scale-95 touch-manipulation"
            title="Expand to Full Preview modal"
            aria-label="Open Full Preview mode"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#4ade80]" />
            <span className="font-semibold hidden sm:inline">Full Preview</span>
          </button>
        )}
      </div>
    );
  }

  // 2. Google Drive / YouTube Embed via iframe
  return (
    <div className={`relative w-full h-full bg-black overflow-hidden flex flex-col ${className}`}>
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <iframe
          key={`iframe-${video.id}-${formattedEmbedUrl}`}
          src={formattedEmbedUrl}
          title={video.title}
          className="w-full h-full border-0 block brightness-100 contrast-100"
          style={{
            height: isModal ? '100%' : 'calc(100% + 48px)',
            marginTop: isModal ? '0px' : '-48px',
            width: '100%'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Top-right actions: Open on Google Drive if iframe cookie issues arise + Full Preview */}
        <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
          {isGoogleDrive && (
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1.5 rounded-xl bg-black/80 hover:bg-black text-[#86efac] hover:text-white text-[10px] font-mono border border-white/25 shadow-lg flex items-center gap-1 backdrop-blur-md transition-all"
              title="Watch directly on Google Drive"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Google Drive</span>
            </a>
          )}

          {onOpenFullPreview && !isModal && (
            <button
              type="button"
              onClick={onOpenFullPreview}
              className="px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-[11px] font-mono border border-white/25 shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all active:scale-95 touch-manipulation"
              title="Expand to Full Preview modal"
              aria-label="Open Full Preview mode"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#4ade80]" />
              <span className="font-semibold hidden sm:inline">Full Preview</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
