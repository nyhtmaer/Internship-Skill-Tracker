/**
 * Backend Health Check Service
 * Verifies backend connectivity before app renders
 * Provides detailed error reporting for debugging
 */

const DEFAULT_TIMEOUT_MS = 5000;

export type HealthCheckResult = {
  isHealthy: boolean;
  apiUrl: string;
  status?: string;
  environment?: string;
  error?: string;
  timestamp?: string;
};

/**
 * Check backend connection health
 * @param apiUrl - The backend API URL to check
 * @param timeoutMs - Timeout in milliseconds (default: 5000)
 * @returns HealthCheckResult with status and error information
 */
export async function checkBackendConnection(
  apiUrl: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<HealthCheckResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${apiUrl}/api/v1/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        isHealthy: false,
        apiUrl,
        error: `Backend returned HTTP status ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      isHealthy: true,
      apiUrl,
      status: data.status,
      environment: data.environment,
      timestamp: data.timestamp,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Map known error patterns to user-friendly messages
    const userFriendlyError = errorMessage.includes('abort')
      ? `Backend unresponsive (timeout after ${timeoutMs}ms)`
      : errorMessage.includes('Failed to fetch')
      ? 'Cannot reach backend - CORS or network error'
      : errorMessage.includes('ERR_NETWORK')
      ? 'Network error - check internet connection'
      : 'Backend connection failed';

    console.warn('⚠️ Health check failed:', {
      apiUrl,
      error: errorMessage,
      userMessage: userFriendlyError,
    });

    return {
      isHealthy: false,
      apiUrl,
      error: userFriendlyError,
    };
  }
}

/**
 * Check if backend is available at startup
 * Useful for App initialization
 */
export async function ensureBackendAvailable(apiUrl: string): Promise<void> {
  const result = await checkBackendConnection(apiUrl, 10000);

  if (!result.isHealthy) {
    throw new Error(
      `[Startup Error] Backend unavailable: ${result.error}\nAPI URL: ${result.apiUrl}\nPlease ensure the backend server is running.`
    );
  }
}
