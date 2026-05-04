import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface Record {
  _id: string;
  title: string;
  type: 'internship' | 'certification';
  company_name?: string;
  issuer?: string;
  start_date: string;
  end_date?: string;
  skills?: string[];
  description?: string;
}

export function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getRecords();
      if (response.success && Array.isArray(response.data)) {
        setRecords(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Simplified mutation handlers
  const addRecord = async (recordData: Omit<Record, '_id'>) => {
    setError(null);
    try {
      const response = await apiClient.addRecord(recordData);
      if (response.success) await fetchRecords();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add record');
      throw err;
    }
  };

  const updateRecord = async (recordId: string, recordData: Partial<Record>) => {
    setError(null);
    try {
      const response = await apiClient.updateRecord(recordId, recordData);
      if (response.success) await fetchRecords();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update record');
      throw err;
    }
  };

  const deleteRecord = async (recordId: string) => {
    setError(null);
    try {
      const response = await apiClient.deleteRecord(recordId);
      if (response.success) await fetchRecords();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
      throw err;
    }
  };

  return {
    records,
    isLoading,
    error,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
  };
}
