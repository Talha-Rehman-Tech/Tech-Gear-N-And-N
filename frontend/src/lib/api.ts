const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api');

/**
 * Get authentication headers from localStorage or cookie
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('userToken');
    if (!token) {
      const match = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (match) {
        token = match.split('=')[1];
      }
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Helper to fetch data with error handling
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const defaultHeaders = getAuthHeaders();
  const combinedHeaders = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: combinedHeaders,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.statusText}`);
    }

    return data as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[API Client] Fetch failed for ${url}:`, message);
    throw error;
  }
}

export { API_BASE_URL };
