import React, { useState } from 'react';
import {
  Award,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  TrendingUp
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
  LineChart,
  Line
} from 'recharts';

const certifications = [
  {
    id: 1,
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issueDate: 'Jan 15, 2026',
    expiryDate: 'Jan 15, 2029',
    status: 'active',
    credentialId: 'AWS-CCP-2026-12345',
    skills: ['AWS', 'Cloud Computing', 'DevOps'],
    verificationUrl: 'https://aws.amazon.com/verify',
    difficulty: 'Intermediate',
  },
  {
    id: 2,
    name: 'React Advanced Patterns',
    issuer: 'Frontend Masters',
    issueDate: 'Dec 10, 2025',
    expiryDate: null,
    status: 'active',
    credentialId: 'FM-REACT-2025-67890',
    skills: ['React', 'JavaScript', 'Design Patterns'],
    verificationUrl: 'https://frontendmasters.com/verify',
    difficulty: 'Advanced',
  },
  {
    id: 3,
    name: 'Professional Scrum Master I',
    issuer: 'Scrum.org',
    issueDate: 'Nov 5, 2025',
    expiryDate: null,
    status: 'active',
    credentialId: 'PSM-I-2025-11223',
    skills: ['Agile', 'Scrum', 'Project Management'],
    verificationUrl: 'https://scrum.org/verify',
    difficulty: 'Intermediate',
  },
  {
    id: 4,
    name: 'Docker Certified Associate',
    issuer: 'Docker Inc.',
    issueDate: 'Oct 20, 2025',
    expiryDate: 'Oct 20, 2027',
    status: 'active',
    credentialId: 'DCA-2025-44556',
    skills: ['Docker', 'Containers', 'DevOps'],
    verificationUrl: 'https://docker.com/verify',
    difficulty: 'Intermediate',
  },
  {
    id: 5,
    name: 'MongoDB Developer',
    issuer: 'MongoDB University',
    issueDate: 'Sep 12, 2025',
    expiryDate: null,
    status: 'active',
    credentialId: 'MONGO-DEV-2025-77889',
    skills: ['MongoDB', 'NoSQL', 'Database'],
    verificationUrl: 'https://university.mongodb.com/verify',
    difficulty: 'Intermediate',
  },
  {
    id: 6,
    name: 'Google Analytics Certified',
    issuer: 'Google',
    issueDate: 'Mar 15, 2025',
    expiryDate: 'Mar 15, 2026',
    status: 'expiring',
    credentialId: 'GA-2025-99001',
    skills: ['Analytics', 'Marketing', 'Data'],
    verificationUrl: 'https://google.com/verify',
    difficulty: 'Beginner',
  },
  {
    id: 7,
    name: 'Python for Data Science',
    issuer: 'DataCamp',
    issueDate: 'Jan 10, 2025',
    expiryDate: 'Jan 10, 2026',
    status: 'expired',
    credentialId: 'DC-PY-2025-22334',
    skills: ['Python', 'Data Science', 'Pandas'],
    verificationUrl: 'https://datacamp.com/verify',
    difficulty: 'Intermediate',
  },
  {
    id: 8,
    name: 'TypeScript Fundamentals',
    issuer: 'Pluralsight',
    issueDate: 'Aug 22, 2025',
    expiryDate: null,
    status: 'active',
    credentialId: 'PS-TS-2025-55667',
    skills: ['TypeScript', 'JavaScript'],
    verificationUrl: 'https://pluralsight.com/verify',
    difficulty: 'Beginner',
  },
];

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

const certsOverTime = [
  { month: 'Jan', count: 1 },
  { month: 'Mar', count: 2 },
  { month: 'Aug', count: 3 },
  { month: 'Sep', count: 4 },
  { month: 'Oct', count: 5 },
  { month: 'Nov', count: 6 },
  { month: 'Dec', count: 7 },
  { month: 'Jan', count: 8 },
];

export default function Certifications() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredCerts = certifications.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter.toLowerCase().replace(' soon', '')) return false;
    if (difficultyFilter !== 'All' && c.difficulty !== difficultyFilter) return false;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.issueDate).getTime();
    const dateB = new Date(b.issueDate).getTime();
    return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Certifications</h2>
          <p className="text-muted-foreground">
            Professional credentials and verified achievements
          </p>
        </div>
        
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          + Add Certification
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
            {new Set(certifications.map(c => c.issuer)).size}
          </div>
          <div className="text-sm text-muted-foreground">Issuers</div>
        </div>
      </div>

      {/* Analytics */}
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
              <XAxis 
                dataKey="difficulty" 
                stroke="var(--muted-foreground)"
                fontSize={11}
              />
              <YAxis 
                stroke="var(--muted-foreground)"
                fontSize={11}
              />
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

        <div className="grid grid-cols-2 gap-6">
          {filteredCerts.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificationCard({ cert }: any) {
  const statusConfig = {
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

  const config = statusConfig[cert.status as keyof typeof statusConfig];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
            </div>
          </div>
          
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
            {config.badge}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Issued {cert.issueDate}</span>
          </div>
          {cert.expiryDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Expires {cert.expiryDate}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {cert.skills.map((skill: string) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-accent text-accent-foreground"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            ID: {cert.credentialId}
          </div>
          <button
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            onClick={() => window.open(cert.verificationUrl, '_blank', 'noopener,noreferrer')}
          >
            Verify
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
