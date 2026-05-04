import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface AnalyticsData {
  success: boolean;
  data: Array<{
    _id: string;
    skill_name: string;
    skill_level: number;
    last_updated: string;
    decay_rate: number;
    days_since_practiced: number;
  }>;
  summary?: {
    total_skills: number;
    decaying_skills: number;
    average_decay_rate: number;
  };
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getAnalytics();
      if (response.success) {
        setAnalytics(response as AnalyticsData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}
