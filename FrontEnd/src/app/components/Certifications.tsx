import React, { useState } from 'react';
import {
  Award,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  TrendingUp,
  X,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '../api';
import { toast } from 'sonner';

export default function Certifications() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    organization: '',
    start_date: new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    credentialId: '',
    verificationUrl: '',
    difficulty: 'Intermediate',
    skills_input: '',
    status: 'active',
  });

  const fetchCerts = async () => {
    try {
      const response = await api.getRecords();
      const data = (response.data || []).filter((r: any) => r.type === 'certification');
      setCertifications(data);
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCerts();
  }, []);

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.organization) return;
    try {
      await api.createRecord({
        title: newCert.title,
        organization: newCert.organization,
        start_date: newCert.issueDate || newCert.start_date || new Date().toISOString().split('T')[0],
        type: 'certification',
        status: newCert.status,
        issueDate: newCert.issueDate,
        expiryDate: newCert.expiryDate,
        credentialId: newCert.credentialId,
        verificationUrl: newCert.verificationUrl,
        difficulty: newCert.difficulty,
        skills: newCert.skills_input.split(',').map(s => s.trim()).filter(Boolean),
        issuer: newCert.organization,
        name: newCert.title,
      });
      toast.success('Certification added!');
      setIsModalOpen(false);
      setNewCert({ title: '', organization: '', start_date: new Date().toISOString().split('T')[0], issueDate: new Date().toISOString().split('T')[0], expiryDate: '', credentialId: '', verificationUrl: '', difficulty: 'Intermediate', skills_input: '', status: 'active' });
      fetchCerts();
    } catch (err: any) {
      toast.error('Failed to add certification');
    }
  };

  const certsByStatus = [
    { name: 'Active', value: certifications.filter(c => c.status === 'active').length, color: '#22c55e' },
    { name: 'Expiring Soon', value: certifications.filter(c => c.status === 'expiring').length, color: '#f97316' },
    { name: 'Expired', value: certifications.filter(c => c.status === 'expired').length, color: '#ef4444' },
  ];

  const certsByDifficulty = [
    { difficulty: 'Beginner', count: certifications.filter(c => c.difficulty === 'Beginner').length },
    { difficulty: 'Intermediate', count: certifications.filter(c => c.difficulty === 'Intermediate').length },
    { difficulty: 'Advanced', count: certifications.filter(c => c.difficulty === 'Advanced').length },
  ];

  const filteredCerts = certifications.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter.toLowerCase().replace(' soon', '')) return false;
    if (difficultyFilter !== 'All' && c.difficulty !== difficultyFilter) return false;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.issueDate || a.start_date || 0).getTime();
    const dateB = new Date(b.issueDate || b.start_date || 0).getTime();
    return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
  });

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
          <h2 className="text-3xl font-semibold mb-2">Certifications</h2>
          <p className="text-muted-foreground">
            Professional credentials and verified achievements
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400" />
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {certifications.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-10 h-10 p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {certifications.filter(c => c.status === 'expiring').length}
          </div>
          <div className="text-sm text-muted-foreground">Expiring Soon</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-10 h-10 p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {certifications.filter(c => c.status === 'expired').length}
          </div>
          <div className="text-sm text-muted-foreground">Expired</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-10 h-10 p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {new Set(certifications.map(c => c.issuer || c.organization)).size}
          </div>
          <div className="text-sm text-muted-foreground">Issuers</div>
        </div>
      </div>

      {/* Analytics */}
      {certifications.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={certsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {certsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {certsByStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">By Difficulty</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={certsByDifficulty}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="difficulty" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters and List */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-accent border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-accent border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-accent border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>
        </div>

        {filteredCerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No certifications yet</h4>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Add your professional credentials to showcase your expertise.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Add Certification
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {filteredCerts.map((cert) => (
              <CertificationCard key={cert._id || cert.id} cert={cert} />
            ))}
          </div>
        )}
      </div>

      {/* Add Certification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg border border-border rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-lg">Add Certification</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-accent rounded-md transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleAddCert} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Certification Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="AWS Cloud Practitioner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Issuing Organization <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newCert.organization}
                  onChange={(e) => setNewCert({ ...newCert, organization: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Date</label>
                  <input
                    type="date"
                    value={newCert.issueDate}
                    onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <input
                    type="date"
                    value={newCert.expiryDate}
                    onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Credential ID</label>
                <input
                  type="text"
                  value={newCert.credentialId}
                  onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="ABC-12345-XYZ"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Verification URL</label>
                <input
                  type="url"
                  value={newCert.verificationUrl}
                  onChange={(e) => setNewCert({ ...newCert, verificationUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://verify.example.com/..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <select
                    value={newCert.difficulty}
                    onChange={(e) => setNewCert({ ...newCert, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={newCert.status}
                    onChange={(e) => setNewCert({ ...newCert, status: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="active">Active</option>
                    <option value="expiring">Expiring Soon</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Related Skills (comma separated)</label>
                <input
                  type="text"
                  value={newCert.skills_input}
                  onChange={(e) => setNewCert({ ...newCert, skills_input: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="AWS, Cloud, DevOps"
                />
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
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CertificationCard({ cert }: any) {
  // Support both old mock schema (cert.name, cert.issuer) and new API schema (cert.title, cert.organization)
  const name = cert.name || cert.title;
  const issuer = cert.issuer || cert.organization;
  const issueDate = cert.issueDate || cert.start_date;
  const expiryDate = cert.expiryDate;
  const credentialId = cert.credentialId;
  const verificationUrl = cert.verificationUrl;
  const skills = cert.skills || cert.skills_applied || [];

  const statusConfig: Record<string, any> = {
    active: {
      badge: 'Active',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-500/20',
    },
    expiring: {
      badge: 'Expiring Soon',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-500/20',
    },
    expired: {
      badge: 'Expired',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-500/20',
    },
  };

  const config = statusConfig[cert.status] || statusConfig.active;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{issuer}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
            {config.badge}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {issueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Issued {issueDate}</span>
            </div>
          )}
          {expiryDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Expires {expiryDate}</span>
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill: string) => (
              <span key={skill} className="px-2.5 py-1 text-xs font-medium rounded-md bg-accent text-accent-foreground">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {credentialId ? `ID: ${credentialId}` : 'No credential ID'}
          </div>
          {verificationUrl && (
            <button
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              onClick={() => window.open(verificationUrl, '_blank', 'noopener,noreferrer')}
            >
              Verify
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
