import { MediaItem, ProjectVideo, TeamMember, ConsultationEnquiry, CompanyConfig } from '../types';

/**
 * GiniBen & Partners GEOSERVICES LTD
 * Unified API Client for MySQL / Truehost cPanel PHP Backend
 * With seamless fallback to persistent localStorage in local/preview environments.
 */

const API_BASE = '/api';

// Helper for safe fetch with timeout
async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ============================================================================
// 1. IMAGES API
// ============================================================================
export async function getImagesFromApi(): Promise<MediaItem[] | null> {
  try {
    const res = await apiFetch('/images.php');
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveImageToApi(image: MediaItem): Promise<boolean> {
  try {
    const res = await apiFetch('/images.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(image)
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

export async function deleteImageFromApi(id: string): Promise<boolean> {
  try {
    const res = await apiFetch(`/images.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

// ============================================================================
// 2. VIDEOS API
// ============================================================================
export async function getVideosFromApi(): Promise<ProjectVideo[] | null> {
  try {
    const res = await apiFetch('/videos.php');
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveVideoToApi(video: ProjectVideo): Promise<boolean> {
  try {
    const res = await apiFetch('/videos.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video)
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

export async function deleteVideoFromApi(id: string): Promise<boolean> {
  try {
    const res = await apiFetch(`/videos.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

// ============================================================================
// 3. TEAM MEMBERS API
// ============================================================================
export async function getTeamFromApi(): Promise<TeamMember[] | null> {
  try {
    const res = await apiFetch('/team.php');
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveTeamMemberToApi(member: TeamMember): Promise<boolean> {
  try {
    const res = await apiFetch('/team.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

export async function deleteTeamMemberFromApi(id: string): Promise<boolean> {
  try {
    const res = await apiFetch(`/team.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

// ============================================================================
// 4. CLIENT ENQUIRIES API
// ============================================================================
export async function getEnquiriesFromApi(): Promise<ConsultationEnquiry[] | null> {
  try {
    const res = await apiFetch('/enquiries.php');
    if (res?.success && Array.isArray(res.data)) {
      return res.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function submitEnquiryToApi(enquiry: ConsultationEnquiry): Promise<boolean> {
  try {
    const res = await apiFetch('/enquiries.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry)
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

export async function updateEnquiryStatusInApi(id: string, status: 'new' | 'reviewed' | 'resolved'): Promise<boolean> {
  try {
    const res = await apiFetch('/enquiries.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

export async function deleteEnquiryFromApi(id: string): Promise<boolean> {
  try {
    const res = await apiFetch(`/enquiries.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

export async function clearAllEnquiriesInApi(): Promise<boolean> {
  try {
    const res = await apiFetch('/enquiries.php?all=true', {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

// ============================================================================
// 5. COMPANY SETTINGS API
// ============================================================================
export async function getSettingsFromApi(): Promise<Partial<CompanyConfig> | null> {
  try {
    const res = await apiFetch('/settings.php');
    if (res?.success && res.data) {
      return res.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveSettingsToApi(settings: Record<string, any>): Promise<boolean> {
  try {
    const res = await apiFetch('/settings.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    });
    return Boolean(res?.success);
  } catch {
    return false;
  }
}

// ============================================================================
// 6. DIRECT FILE UPLOAD (CPANEL HOSTING)
// ============================================================================
export async function uploadMediaFileToCpanel(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success && json?.url ? json.url : null;
  } catch {
    return null;
  }
}
