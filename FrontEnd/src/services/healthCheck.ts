/**
 * Backend Health Check Service
 * Verifies backend connectivity before app renders
 * Provides detailed error reporting for debugging
 */

export interface HealthCheckResult {
  isHealthy: boolean;
  apiUrl: string;
  status?: string;
  environment?: string;
  error?: string;
  timestamp?: string;
}

/**
 * Check backend connection health
 * @param apiUrl - The backend API URL to check
 * @param timeoutMs - Timeout in milliseconds (default: 5000)
 * @returns HealthCheckResult with status and error information
 */
export async function checkBackendConnection(
  apiUrl: string,
  timeoutMs: number = 5000
): Promise<HealthCheckResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${apiUrl}/api/v1/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        isHealthy: false,
        apiUrl,
        error: `Backend returned status ${response.status}`,
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

    // Determine specific error type
    let userFriendlyError = 'Backend connection failed';
    if (errorMessage.includes('abort')) {
      userFriendlyError = `Backend unresponsive (timeout after ${timeoutMs}ms)`;
    } else if (errorMessage.includes('Failed to fetch')) {
      userFriendlyError = 'Cannot reach backend - CORS or network error';
    } else if (errorMessage.includes('ERR_NETWORK')) {
      userFriendlyError = 'Network error - check internet connection';
    }

    console.error('❌ Health check failed:', {
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
      `Backend unavailable: ${result.error}\n\nAPI URL: ${result.apiUrl}\n\nPlease ensure the backend server is running.`
    );
  }
}
