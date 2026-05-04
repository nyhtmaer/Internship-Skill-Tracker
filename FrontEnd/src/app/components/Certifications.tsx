import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Award, Calendar } from 'lucide-react';
import { useRecords } from '../../hooks';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

export default function Certifications() {
  const { records, isLoading, error, refetch } = useRecords();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const certifications = records.filter((r) => r.type === 'certification');

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    start_date: '',
    end_date: '',
    description: '',
    status: 'completed',
  });

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) {
      toast.error('Title and organization are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type: 'certification',
        title: formData.title,
        organization: formData.organization,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description,
        status: formData.status,
        linked_skills: [],
      };

      const response = await apiClient.post('/records', payload);

      if (response.success) {
        toast.success('Certification added successfully!');
        setFormData({
          title: '',
          organization: '',
          start_date: '',
          end_date: '',
          description: '',
          status: 'completed',
        });
        setShowAddForm(false);
        refetch();
      } else {
        toast.error(response.error || 'Failed to add certification');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error adding certification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        organization: formData.organization,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description,
        status: formData.status,
      };

      const response = await apiClient.put(`/records/${editingId}`, payload);

      if (response.success) {
        toast.success('Certification updated!');
        setFormData({
          title: '',
          organization: '',
          start_date: '',
          end_date: '',
          description: '',
          status: 'completed',
        });
        setEditingId(null);
        setShowAddForm(false);
        refetch();
      } else {
        toast.error(response.error || 'Failed to update certification');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating certification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertification = async (recordId: string) => {
    if (!window.confirm('Delete this certification?')) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.delete(`/records/${recordId}`);

      if (response.success) {
        toast.success('Certification deleted');
        refetch();
      } else {
        toast.error(response.error || 'Failed to delete certification');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting certification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (record: any) => {
    setFormData({
      title: record.title,
      organization: record.organization,
      start_date: record.start_date?.split('T')[0] || '',
      end_date: record.end_date?.split('T')[0] || '',
      description: record.description || '',
      status: record.status || 'completed',
    });
    setEditingId(record._id);
    setShowAddForm(true);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Error loading certifications: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Certifications</h2>
          <p className="text-muted-foreground">
            Track your professional credentials and achievements
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              organization: '',
              start_date: '',
              end_date: '',
              description: '',
              status: 'completed',
            });
            setShowAddForm(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Certifications</div>
          <div className="text-3xl font-bold">{certifications.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Valid</div>
          <div className="text-3xl font-bold">
            {certifications.filter(
              (c) =>
                !c.end_date ||
                new Date(c.end_date) > new Date()
            ).length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Expired</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {certifications.filter(
              (c) => c.end_date && new Date(c.end_date) <= new Date()
            ).length}
          </div>
        </div>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No certifications yet</p>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: '',
                  organization: '',
                  start_date: '',
                  end_date: '',
                  description: '',
                  status: 'completed',
                });
                setShowAddForm(true);
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Add Your First Certification
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {certifications.map((cert) => {
              const isExpired = cert.end_date && new Date(cert.end_date) <= new Date();
              return (
                <div
                  key={cert._id}
                  className={`bg-card border rounded-xl p-6 hover:border-primary/50 transition-colors ${
                    isExpired ? 'border-red-200 dark:border-red-800/30' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-5 h-5 text-amber-600" />
                        <h3 className="text-lg font-semibold">{cert.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{cert.organization}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        {cert.start_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(cert.start_date).toLocaleDateString()} -{' '}
                            {cert.end_date
                              ? new Date(cert.end_date).toLocaleDateString()
                              : 'No expiry'}
                          </div>
                        )}
                        {isExpired && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded text-xs font-medium">
                            Expired
                          </span>
                        )}
                        {!isExpired && cert.end_date && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded text-xs font-medium">
                            Valid
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(cert)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Edit certification"
                      >
                        <Edit2 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCertification(cert._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Delete certification"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {cert.description && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {cert.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Certification Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full my-8">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Certification' : 'Add New Certification'}
            </h3>

            <form
              onSubmit={editingId ? handleUpdateCertification : handleAddCertification}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., AWS Solutions Architect, React Advanced Patterns"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  placeholder="e.g., Amazon, Google, Coursera"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What did this certification cover?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800 h-24"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
