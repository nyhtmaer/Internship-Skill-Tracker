/**
 * URL Configuration Service
 * Handles dynamic URL loading from backend configuration
 * Provides helper functions to construct file URLs
 */

interface UrlConfig {
  apiUrl: string;
  fileUploadUrl: string;
  environment: string;
}

let config: UrlConfig | null = null;
let isInitializing = false;
let initializationPromise: Promise<UrlConfig> | null = null;

/**
 * Initialize URL configuration from backend
 * Fetches the config once and caches it for subsequent calls
 */
export async function initializeUrlConfig(): Promise<UrlConfig> {
  // If already initialized, return cached config
  if (config) {
    return config;
  }

  // If currently initializing, wait for existing promise
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  isInitializing = true;

  initializationPromise = (async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/v1/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }

      const data = await response.json();
      config = data.data;

      console.log('✅ URL configuration loaded:', {
        apiUrl: config.apiUrl,
        environment: config.environment,
      });

      return config;
    } catch (error) {
      console.warn('⚠️ Failed to fetch URL config from backend, using fallback:', error);
      // Fallback to environment variable or localhost
      config = {
        apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        fileUploadUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads`,
        environment: 'fallback',
      };
      return config;
    } finally {
      isInitializing = false;
    }
  })();

  return initializationPromise;
}

/**
 * Get current URL configuration
 * Must call initializeUrlConfig() first
 */
export function getConfig(): UrlConfig {
  if (!config) {
    throw new Error('URL configuration not initialized. Call initializeUrlConfig() first.');
  }
  return config;
}

/**
 * Get API base URL
 * Example: http://localhost:5000
 */
export function getApiUrl(): string {
  return getConfig().apiUrl;
}

/**
 * Generate full URL for an uploaded file
 * @param filename - The filename as stored in database (e.g., "uuid.jpg")
 * @returns Full URL to access the file (e.g., "http://localhost:5000/uploads/uuid.jpg")
 */
export function getFileUrl(filename: string): string {
  if (!filename) {
    throw new Error('Filename is required');
  }
  const fileUploadUrl = getConfig().fileUploadUrl;
  return `${fileUploadUrl}/${filename}`;
}

/**
 * Update the cached configuration (useful for testing or manual updates)
 */
export function setConfig(newConfig: UrlConfig): void {
  config = newConfig;
}

/**
 * Reset configuration (useful for testing)
 */
export function resetConfig(): void {
  config = null;
  isInitializing = false;
  initializationPromise = null;
}
