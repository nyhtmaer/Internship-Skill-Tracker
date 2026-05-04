const BASE_URL = '/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data;
};

export const api = {
  // --- Skills ---
  getSkills: async () => {
    const res = await fetch(`${BASE_URL}/skills`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createSkill: async (data: any) => {
    const res = await fetch(`${BASE_URL}/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateSkill: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteSkill: async (id: string) => {
    const res = await fetch(`${BASE_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- Records (Internships & Certifications) ---
  getRecords: async () => {
    const res = await fetch(`${BASE_URL}/records`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createRecord: async (data: any) => {
    const res = await fetch(`${BASE_URL}/records`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateRecord: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/records/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteRecord: async (id: string) => {
    const res = await fetch(`${BASE_URL}/records/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- Evidence ---
  getEvidence: async () => {
    const res = await fetch(`${BASE_URL}/evidence`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createEvidence: async (data: any) => {
    const res = await fetch(`${BASE_URL}/evidence`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  uploadEvidenceFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Custom headers without Content-Type so fetch can auto-set the boundary for multipart/form-data
    const token = localStorage.getItem('jwt_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/evidence/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
  updateEvidence: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/evidence/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteEvidence: async (id: string) => {
    const res = await fetch(`${BASE_URL}/evidence/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  parseResume: async (formData: FormData) => {
    const token = localStorage.getItem('jwt_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/onboarding/parse`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },

  // --- GitHub Analysis ---
  analyzeGithub: async (url: string) => {
    const res = await fetch(`${BASE_URL}/github/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url }),
    });
    return handleResponse(res);
  },

  // --- CV Parsing ---
  parseCV: async (file: File) => {
    const formData = new FormData();
    formData.append('cv', file);
    // Don't set Content-Type — browser sets it with the correct boundary
    const token = localStorage.getItem('jwt_token');
    const res = await fetch(`${BASE_URL}/cv/parse`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return handleResponse(res);
  },

  // --- Analytics ---
  getAnalytics: async () => {
    const res = await fetch(`${BASE_URL}/analytics`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // --- Export ---
  exportPDF: async (data: { sections: any, template: string }) => {
    const res = await fetch(`${BASE_URL}/portfolio/export/pdf`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to export PDF');
    }
    return res.blob();
  },
};
