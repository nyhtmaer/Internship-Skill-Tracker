import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

interface Skill {
  _id: string;
  skill_name: string;
  skill_level: number;
  description?: string;
  last_updated: string;
  decay_status?: string;
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // memoized fetch
  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getSkills();
      if (response.success && Array.isArray(response.data)) {
        setSkills(response.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch skills';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // skill operations
  const addSkill = async (skillName: string, skillLevel: number, description?: string) => {
    setError(null);
    try {
      const response = await apiClient.addSkill(skillName, skillLevel, description);
      if (response.success) {
        await fetchSkills();
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add skill';
      setError(message);
      throw err;
    }
  };

  const updateSkill = async (skillId: string, skillLevel: number, description?: string) => {
    setError(null);
    try {
      const response = await apiClient.updateSkill(skillId, skillLevel, description);
      if (response.success) {
        await fetchSkills();
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update skill';
      setError(message);
      throw err;
    }
  };

  const deleteSkill = async (skillId: string) => {
    setError(null);
    try {
      const response = await apiClient.deleteSkill(skillId);
      if (response.success) {
        await fetchSkills();
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete skill';
      setError(message);
      throw err;
    }
  };

  return {
    skills,
    isLoading,
    error,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
  };
}
