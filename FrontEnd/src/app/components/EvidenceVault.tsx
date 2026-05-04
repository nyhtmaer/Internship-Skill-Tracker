import React, { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Code,
  Award,
  Calendar,
  Tag,
  Search,
  Download,
  ExternalLink,
  Star,
  Plus,
  X,
  Github,
  Loader2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { api } from '../api';
import { toast } from 'sonner';

const typeIcons: Record<string, any> = {
  project: Code,
  document: FileText,
  certification: Award,
  media: Image,
  achievement: Star,
};

const formatIcons: Record<string, any> = {
  code: Code,
  pdf: FileText,
  video: Video,
  image: Image,
  link: LinkIcon,
};

const EVIDENCE_TYPES = ['project', 'document', 'certification', 'media', 'achievement'];
const FORMATS = ['link', 'pdf', 'code', 'image', 'video'];

export default function EvidenceVault() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localEvidenceItems, setLocalEvidenceItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [githubResult, setGithubResult] = useState<any>(null);
  const [newEvidence, setNewEvidence] = useState({
    title: '',
    description: '',
    type: 'project',
    format: 'link',
    url: '',
    tags_input: '',
    impact: 'medium',
  });

  const isGithubUrl = (url: string) => /github\.com\/[\w.-]+\/[\w.-]+/.test(url);

  const handleAnalyzeGithub = async () => {
    if (!newEvidence.url || !isGithubUrl(newEvidence.url)) return;
    setIsAnalyzing(true);
    setGithubResult(null);
    try {
      const result = await api.analyzeGithub(newEvidence.url);
      const { repo, languages, skillsAutoAdded, readmeSummary } = result.data;
      // Auto-fill form fields
      setNewEvidence(prev => ({
        ...prev,
        title: prev.title || repo.name,
        description: prev.description || repo.description || readmeSummary || '',
        type: 'project',
        tags_input: prev.tags_input || languages.slice(0, 4).map((l: any) => l.name).join(', '),
        impact: repo.stars > 20 ? 'high' : repo.stars > 5 ? 'medium' : 'low',
      }));
      setGithubResult(result.data);
      toast.success(`GitHub analyzed! Auto-added ${skillsAutoAdded.length} new skills.`);
    } catch (err: any) {
      toast.error(err.message || 'GitHub analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchEvidence = async () => {
    try {
      const response = await api.getEvidence();
      setLocalEvidenceItems(response.data || []);
    } catch (error) {
      console.error('Failed to fetch evidence:', error);
      setLocalEvidenceItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvidence();
  }, []);

  const handleToggleStar = async (id: string | number) => {
    const item = localEvidenceItems.find((i) => i._id === id || i.id === id);
    if (!item) return;
    const itemId = item._id || item.id;

    setLocalEvidenceItems((prev) =>
      prev.map((i) => ((i._id || i.id) === itemId ? { ...i, featured: !i.featured } : i))
    );

    try {
      await api.updateEvidence(itemId.toString(), { featured: !item.featured });
    } catch (e) {
      setLocalEvidenceItems((prev) =>
        prev.map((i) => ((i._id || i.id) === itemId ? { ...i, featured: item.featured } : i))
      );
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.title) return;
    try {
      // If GitHub analysis already created the evidence, just close and refresh
      if (githubResult?.evidenceCreated) {
        toast.success('Evidence already saved via GitHub analysis!');
        setIsModalOpen(false);
        setGithubResult(null);
        setNewEvidence({ title: '', description: '', type: 'project', format: 'link', url: '', tags_input: '', impact: 'medium' });
        fetchEvidence();
        return;
      }
      const payload = {
        ...newEvidence,
        tags: newEvidence.tags_input.split(',').map(t => t.trim()).filter(Boolean),
        date: new Date().toISOString().split('T')[0],
        featured: false,
        linkedTo: [],
      };
      await api.createEvidence(payload);
      toast.success('Evidence added!');
      setIsModalOpen(false);
      setGithubResult(null);
      setNewEvidence({ title: '', description: '', type: 'project', format: 'link', url: '', tags_input: '', impact: 'medium' });
      fetchEvidence();
    } catch (err: any) {
      toast.error('Failed to add evidence');
    }
  };

  const filteredItems = localEvidenceItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: localEvidenceItems.length,
    projects: localEvidenceItems.filter(i => i.type === 'project').length,
    documents: localEvidenceItems.filter(i => i.type === 'document').length,
    certifications: localEvidenceItems.filter(i => i.type === 'certification').length,
    media: localEvidenceItems.filter(i => i.type === 'media').length,
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Evidence Vault</h2>
          <p className="text-muted-foreground">
            Centralized repository of your work, achievements, and credentials
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Evidence
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Total Items" value={stats.total} icon={FileText} />
        <StatCard label="Projects" value={stats.projects} icon={Code} />
        <StatCard label="Documents" value={stats.documents} icon={FileText} />
        <StatCard label="Certifications" value={stats.certifications} icon={Award} />
        <StatCard label="Media" value={stats.media} icon={Image} />
      </div>

      {/* Featured Items */}
      {localEvidenceItems.filter(i => i.featured).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
            <h3 className="text-lg font-semibold">Featured Evidence</h3>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
            {localEvidenceItems.filter(item => item.featured).map((item) => (
              <div key={item._id || item.id} className="min-w-[340px] flex-shrink-0">
                <FeaturedCard item={item} onToggleStar={handleToggleStar} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search evidence by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1 flex-wrap">
          {['all', 'project', 'document', 'certification', 'media', 'achievement'].map(f => (
            <FilterButton key={f} active={filter === f} onClick={() => setFilter(f)} label={f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'} />
          ))}
        </div>
      </div>

      {/* All Evidence */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All Evidence ({filteredItems.length})</h3>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Archive className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No evidence yet</h4>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Start building your portfolio by uploading projects, documents, certifications, or links.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <EvidenceCard key={item._id || item.id} item={item} onToggleStar={handleToggleStar} />
            ))}
          </div>
        )}
      </div>

      {/* Add Evidence Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg border border-border rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-lg">Add Evidence</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-accent rounded-md transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleAddEvidence} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newEvidence.title}
                  onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="My Awesome Project"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={newEvidence.description}
                  onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 h-20"
                  placeholder="What did you build or achieve?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    value={newEvidence.type}
                    onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <select
                    value={newEvidence.format}
                    onChange={(e) => setNewEvidence({ ...newEvidence, format: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {FORMATS.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL / Link</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newEvidence.url}
                    onChange={(e) => {
                      setNewEvidence({ ...newEvidence, url: e.target.value });
                      setGithubResult(null);
                    }}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://github.com/yourproject"
                  />
                  {isGithubUrl(newEvidence.url) && (
                    <button
                      type="button"
                      onClick={handleAnalyzeGithub}
                      disabled={isAnalyzing}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 whitespace-nowrap"
                    >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                      {isAnalyzing ? 'Analyzing...' : 'Auto-fill'}
                    </button>
                  )}
                </div>
                {githubResult && (
                  <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      GitHub repo analyzed!
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>⭐ {githubResult.repo.stars} stars · 🍴 {githubResult.repo.forks} forks</div>
                      <div>Languages: {githubResult.languages.slice(0, 4).map((l: any) => `${l.name} ${l.percentage}%`).join(' · ')}</div>
                      {githubResult.skillsAutoAdded.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-green-600 dark:text-green-400 font-medium">Auto-added skills:</span>
                          {githubResult.skillsAutoAdded.map((s: any) => (
                            <span key={s.name} className="px-1.5 py-0.5 text-xs bg-green-500/10 text-green-700 dark:text-green-300 rounded">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-1 text-amber-600 dark:text-amber-400 text-xs">
                        <Zap className="w-3 h-3 inline mr-1" />
                        Evidence entry already saved to vault. Click "Save Evidence" to confirm, or close to discard.
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newEvidence.tags_input}
                  onChange={(e) => setNewEvidence({ ...newEvidence, tags_input: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="React, TypeScript, open-source"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Impact</label>
                <select
                  value={newEvidence.impact}
                  onChange={(e) => setNewEvidence({ ...newEvidence, impact: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Archive({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <Icon className="w-8 h-8 p-1.5 rounded-lg bg-accent text-muted-foreground mb-3" />
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground'
        }
      `}
    >
      {label}
    </button>
  );
}

function FeaturedCard({ item, onToggleStar }: any) {
  const TypeIcon = typeIcons[item.type] || FileText;

  return (
    <div className="bg-gradient-to-br from-chart-1/10 to-chart-2/10 border-2 border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-6 h-6 text-primary" />
        </div>
        <button
          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
          onClick={() => onToggleStar && onToggleStar(item._id || item.id)}
        >
          <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
        </button>
      </div>

      <h4 className="font-semibold mb-2">{item.title}</h4>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3.5 h-3.5" />
        {item.date}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(item.linkedTo || item.tags || []).slice(0, 3).map((tag: string) => (
          <span key={tag} className="px-2 py-1 text-xs font-medium rounded-md bg-accent text-accent-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function EvidenceCard({ item, onToggleStar }: any) {
  const isStarred = item.featured;
  const TypeIcon = typeIcons[item.type] || FileText;
  const FormatIcon = formatIcons[item.format] || LinkIcon;

  const impactColors: Record<string, string> = {
    high: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    medium: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    low: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
          <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
            <TypeIcon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground w-full text-center overflow-hidden text-ellipsis">
            {item.type}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold">{item.title}</h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.impact && (
                <span className={`px-2 py-0.5 mr-2 text-xs font-medium rounded-md border ${impactColors[item.impact] || impactColors.low}`}>
                  {item.impact}
                </span>
              )}
              <button
                className={`p-1.5 hover:bg-accent rounded-md transition-colors ${isStarred ? 'text-orange-500' : 'text-muted-foreground'}`}
                title={isStarred ? 'Remove from featured' : 'Feature this evidence'}
                onClick={(e) => { e.stopPropagation(); if (onToggleStar) onToggleStar(item._id || item.id); }}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-orange-500' : ''}`} />
              </button>
              {item.url && (
                <button
                  className="p-1.5 hover:bg-accent rounded-md transition-colors text-muted-foreground"
                  title="Open link"
                  onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{item.description}</p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <FormatIcon className="w-3.5 h-3.5" />
              {(item.format || 'link').toUpperCase()}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.date || 'No date'}
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {(item.linkedTo || []).length} skills
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(item.tags || []).map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-accent text-accent-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
