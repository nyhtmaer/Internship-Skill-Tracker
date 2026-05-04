import React, { useState } from 'react';
import { Plus, Trash2, Edit2, MapPin, Calendar } from 'lucide-react';
import { useRecords } from '../../hooks';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

export default function Internships() {
  const { records, isLoading, error, refetch } = useRecords();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const internships = records.filter((r) => r.type === 'internship');

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    status: 'completed',
  });

  const handleAddInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) {
      toast.error('Title and organization are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type: 'internship',
        title: formData.title,
        organization: formData.organization,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description,
        status: formData.status,
        linked_skills: [],
      };

      const response = await apiClient.post('/records', payload);

      if (response.success) {
        toast.success('Internship added successfully!');
        setFormData({
          title: '',
          organization: '',
          location: '',
          start_date: '',
          end_date: '',
          description: '',
          status: 'completed',
        });
        setShowAddForm(false);
        refetch();
      } else {
        toast.error(response.error || 'Failed to add internship');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error adding internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateInternship = async (e: React.FormEvent) => {
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
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description,
        status: formData.status,
      };

      const response = await apiClient.put(`/records/${editingId}`, payload);

      if (response.success) {
        toast.success('Internship updated!');
        setFormData({
          title: '',
          organization: '',
          location: '',
          start_date: '',
          end_date: '',
          description: '',
          status: 'completed',
        });
        setEditingId(null);
        setShowAddForm(false);
        refetch();
      } else {
        toast.error(response.error || 'Failed to update internship');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInternship = async (recordId: string) => {
    if (!window.confirm('Delete this internship?')) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.delete(`/records/${recordId}`);

      if (response.success) {
        toast.success('Internship deleted');
        refetch();
      } else {
        toast.error(response.error || 'Failed to delete internship');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (record: any) => {
    setFormData({
      title: record.title,
      organization: record.organization,
      location: record.location || '',
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
        <p className="text-red-600 dark:text-red-400">Error loading internships: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Internships</h2>
          <p className="text-muted-foreground">
            Track your internship experiences and career growth
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              organization: '',
              location: '',
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
          Add Internship
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Internships</div>
          <div className="text-3xl font-bold">{internships.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Active</div>
          <div className="text-3xl font-bold">
            {internships.filter((i) => i.status === 'active').length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Completed</div>
          <div className="text-3xl font-bold">
            {internships.filter((i) => i.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Internships List */}
      <div className="space-y-4">
        {internships.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground mb-4">No internships yet</p>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: '',
                  organization: '',
                  location: '',
                  start_date: '',
                  end_date: '',
                  description: '',
                  status: 'completed',
                });
                setShowAddForm(true);
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Add Your First Internship
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {internships.map((internship) => (
              <div
                key={internship._id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{internship.title}</h3>
                    <p className="text-muted-foreground">{internship.organization}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      {internship.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {internship.location}
                        </div>
                      )}
                      {internship.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(internship.start_date).toLocaleDateString()} -{' '}
                          {internship.end_date
                            ? new Date(internship.end_date).toLocaleDateString()
                            : 'Present'}
                        </div>
                      )}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          internship.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {internship.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(internship)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit internship"
                    >
                      <Edit2 className="w-4 h-4 text-amber-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteInternship(internship._id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Delete internship"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {internship.description && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {internship.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Internship Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full my-8">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Internship' : 'Add New Internship'}
            </h3>

            <form
              onSubmit={editingId ? handleUpdateInternship : handleAddInternship}
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
                  placeholder="e.g., Frontend Intern, Full Stack Intern"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  placeholder="e.g., Google, Meta, Stripe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., San Francisco, CA"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date
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
                    End Date
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
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
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
                  placeholder="What did you learn and accomplish?"
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
