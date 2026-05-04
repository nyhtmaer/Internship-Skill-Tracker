import React, { useState } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, Clock } from 'lucide-react';
import { useSkills } from '../../hooks';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

export default function Skills() {
  const { skills, isLoading, error, refetch } = useSkills();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPracticeForm, setShowPracticeForm] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    skill_name: '',
    skill_level: 3,
    category: 'Frontend',
  });

  const categories = [
    'Frontend',
    'Backend',
    'Languages',
    'Database',
    'DevOps',
    'Tools',
    'Soft Skills',
    'Other',
  ];

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skill_name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        skill_name: formData.skill_name,
        skill_level: Number(formData.skill_level),
        category: formData.category,
      };

      const response = await apiClient.post('/skills', payload);

      if (response.success) {
        toast.success('Skill added successfully!');
        setFormData({ skill_name: '', skill_level: 3, category: 'Frontend' });
        setShowAddForm(false);
        refetch();
      } else {
        toast.error(response.error || 'Failed to add skill');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error adding skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogPractice = async () => {
    if (!selectedSkillId) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.put(`/skills/${selectedSkillId}`, {
        last_updated: new Date(),
      });

      if (response.success) {
        toast.success('Practice logged! Skill updated.');
        setShowPracticeForm(false);
        setSelectedSkillId(null);
        refetch();
      } else {
        toast.error(response.error || 'Failed to log practice');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error logging practice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!window.confirm('Delete this skill?')) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.delete(`/skills/${skillId}`);

      if (response.success) {
        toast.success('Skill deleted');
        refetch();
      } else {
        toast.error(response.error || 'Failed to delete skill');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.skill_name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.put(`/skills/${editingId}`, {
        skill_name: formData.skill_name,
        skill_level: Number(formData.skill_level),
        category: formData.category,
      });

      if (response.success) {
        toast.success('Skill updated!');
        setFormData({ skill_name: '', skill_level: 3, category: 'Frontend' });
        setEditingId(null);
        setShowAddForm(false);
        refetch();
      } else {
        toast.error(response.error || 'Failed to update skill');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (skill: any) => {
    setFormData({
      skill_name: skill.skill_name,
      skill_level: skill.skill_level,
      category: skill.category,
    });
    setEditingId(skill._id);
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
        <p className="text-red-600 dark:text-red-400">Error loading skills: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Skills</h2>
          <p className="text-muted-foreground">
            Track and manage your technical and soft skills
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ skill_name: '', skill_level: 3, category: 'Frontend' });
            setShowAddForm(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Skills</div>
          <div className="text-3xl font-bold">{skills.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Average Level</div>
          <div className="text-3xl font-bold">
            {skills.length > 0
              ? Math.round(
                  skills.reduce((sum, s) => sum + s.skill_level, 0) /
                    skills.length
                )
              : 0}
            %
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Categories</div>
          <div className="text-3xl font-bold">
            {new Set(skills.map((s) => s.category)).size}
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground mb-4">No skills yet</p>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ skill_name: '', skill_level: 3, category: 'Frontend' });
                setShowAddForm(true);
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Add Your First Skill
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{skill.skill_name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 px-2 py-1 rounded">
                        {skill.category}
                      </span>
                      <span>Level: {skill.skill_level}/5</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedSkillId(skill._id);
                        setShowPracticeForm(true);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Log practice"
                    >
                      <Clock className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleEditClick(skill)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit skill"
                    >
                      <Edit2 className="w-4 h-4 text-amber-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill._id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Delete skill"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Level Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                    style={{ width: `${(skill.skill_level / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Skill Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h3>

            <form
              onSubmit={editingId ? handleUpdateSkill : handleAddSkill}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formData.skill_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skill_name: e.target.value,
                    })
                  }
                  placeholder="e.g., React, Python, Data Analysis"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Level: {formData.skill_level}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.skill_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skill_level: Number(e.target.value),
                    })
                  }
                  className="w-full"
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

      {/* Log Practice Modal */}
      {showPracticeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Log Practice</h3>
            <p className="text-muted-foreground mb-6">
              Mark this skill as recently practiced to update your decay tracking.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPracticeForm(false);
                  setSelectedSkillId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogPractice}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Logging...' : 'Log Practice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
