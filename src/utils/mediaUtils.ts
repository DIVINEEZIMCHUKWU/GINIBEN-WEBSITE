/**
 * GiniBen & Partners GEOSERVICES LTD
 * Media & Video Utilities
 * Supports dual-stream playback (Google Drive iframe embeds and native HTML5 direct video uploads)
 * and seamless cPanel server uploads with progress tracking.
 */

export function isVideoDirectFile(url?: string): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.startsWith('/uploads/') ||
    clean.includes('/uploads/') ||
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.3gp') ||
    clean.endsWith('.mkv') ||
    clean.startsWith('blob:') ||
    clean.startsWith('data:video')
  );
}

export function isGoogleDriveVideo(url?: string): boolean {
  if (!url) return false;
  return url.toLowerCase().includes('drive.google.com');
}

export function getFormattedVideoEmbedUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // 1. Google Drive URLs
  if (trimmed.includes('drive.google.com')) {
    if (trimmed.includes('/preview')) {
      return trimmed;
    }
    const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch && fileMatch[1]) {
      return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
    }
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
    return trimmed;
  }

  // 2. YouTube URLs
  if (trimmed.includes('youtube.com/watch')) {
    const vMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (vMatch && vMatch[1]) {
      return `https://www.youtube.com/embed/${vMatch[1]}?autoplay=0&rel=0`;
    }
  }
  if (trimmed.includes('youtu.be/')) {
    const ytMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    }
  }

  return trimmed;
}

/**
 * Uploads media file to Truehost cPanel server via /api/upload.php
 * with progress tracking for large video uploads.
 */
export async function uploadMediaToServer(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; url: string; error?: string }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload.php', true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          const json = JSON.parse(xhr.responseText);
          if (json.success && json.url) {
            resolve({ success: true, url: json.url });
            return;
          }
          resolve({ success: false, url: '', error: json.message || 'Server rejected file upload.' });
        } else {
          resolve({ 
            success: false, 
            url: '', 
            error: `Server upload failed with status ${xhr.status}. Please check upload limit or folder permissions.` 
          });
        }
      } catch (err: any) {
        resolve({ success: false, url: '', error: 'Unexpected response from server upload handler: ' + err.message });
      }
    };

    xhr.onerror = () => {
      resolve({ success: false, url: '', error: 'Network error occurred while uploading media file to server.' });
    };

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
}

/**
 * Uploads large videos in reliable 1.5MB chunks to /api/chunked_upload.php
 * Handles files of ANY size without exceeding PHP POST limits.
 */
export async function uploadVideoInChunks(
  file: File,
  onProgress?: (percent: number, loadedMb: number, totalMb: number) => void
): Promise<{ success: boolean; url: string; error?: string }> {
  const CHUNK_SIZE = 1.5 * 1024 * 1024; // 1.5 MB slices
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const fileId = 'up_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const totalMb = parseFloat((file.size / (1024 * 1024)).toFixed(1));

  let finalUrl = '';

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunkBlob = file.slice(start, end);

    let attempts = 0;
    let uploaded = false;
    let lastError = '';

    while (attempts < 3 && !uploaded) {
      attempts++;
      try {
        const formData = new FormData();
        formData.append('file', chunkBlob, file.name);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileId', fileId);
        formData.append('fileName', file.name);

        const res = await fetch('/api/chunked_upload.php', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          uploaded = true;
          if (data.url) {
            finalUrl = data.url;
          }
        } else {
          lastError = data.message || 'Chunk upload was rejected by server.';
        }
      } catch (err: any) {
        lastError = err?.message || 'Network error during chunk transmission';
        if (attempts < 3) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    if (!uploaded) {
      return {
        success: false,
        url: '',
        error: `Upload interrupted at chunk ${chunkIndex + 1} of ${totalChunks}: ${lastError}`
      };
    }

    const currentLoadedMb = parseFloat((end / (1024 * 1024)).toFixed(1));
    const percent = Math.min(99, Math.round((end / file.size) * 100));
    if (onProgress) {
      onProgress(percent, currentLoadedMb, totalMb);
    }
  }

  if (finalUrl) {
    if (onProgress) onProgress(100, totalMb, totalMb);
    return { success: true, url: finalUrl };
  }

  return { success: false, url: '', error: 'Upload process terminated unexpectedly.' };
}

/**
 * Captures first available frame from a video file into an image data URL
 * to serve as video thumbnail.
 */
export async function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const objUrl = URL.createObjectURL(file);
      video.src = objUrl;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, video.duration / 2);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbUrl = canvas.toDataURL('image/jpeg', 0.85);
            URL.revokeObjectURL(objUrl);
            resolve(thumbUrl);
            return;
          }
        } catch {
          // ignore canvas security or draw error
        }
        URL.revokeObjectURL(objUrl);
        resolve('');
      };

      video.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve('');
      };

      // Timeout fallback
      setTimeout(() => {
        URL.revokeObjectURL(objUrl);
        resolve('');
      }, 4000);
    } catch {
      resolve('');
    }
  });
}
