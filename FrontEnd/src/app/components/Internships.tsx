import React from 'react';
import {
  Building2,
  Calendar,
  TrendingUp,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Circle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';
import { api } from '../api';

const internships = [
  {
    id: 1,
    company: 'Meta',
    role: 'Frontend Engineering Intern',
    location: 'Menlo Park, CA',
    period: 'Jan 2026 - Present',
    status: 'active',
    description: 'Working on React-based internal tools for data visualization',
    skills: ['React', 'TypeScript', 'GraphQL', 'Jest'],
    impact: [
      { metric: 'React', before: 65, after: 85, growth: 31 },
      { metric: 'TypeScript', before: 55, after: 80, growth: 45 },
      { metric: 'GraphQL', before: 30, after: 70, growth: 133 },
      { metric: 'Jest', before: 40, after: 75, growth: 88 },
    ],
    projects: ['Data Dashboard v2', 'Component Library', 'Performance Monitoring'],
  },
  {
    id: 2,
    company: 'Stripe',
    role: 'Full Stack Intern',
    location: 'San Francisco, CA',
    period: 'Jun 2025 - Dec 2025',
    status: 'completed',
    description: 'Built payment integration tools and developer documentation',
    skills: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
    impact: [
      { metric: 'Node.js', before: 45, after: 75, growth: 67 },
      { metric: 'React', before: 50, after: 65, growth: 30 },
      { metric: 'PostgreSQL', before: 35, after: 68, growth: 94 },
      { metric: 'Docker', before: 25, after: 60, growth: 140 },
    ],
    projects: ['Payment SDK', 'API Documentation', 'Webhook Manager'],
  },
];

const skillImpactTimeline = [
  { month: 'Jun', skills: 12 },
  { month: 'Jul', skills: 14 },
  { month: 'Aug', skills: 16 },
  { month: 'Sep', skills: 17 },
  { month: 'Oct', skills: 19 },
  { month: 'Nov', skills: 21 },
  { month: 'Dec', skills: 23 },
  { month: 'Jan', skills: 24 },
];

export default function Internships() {
  const [internships, setInternships] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newInternship, setNewInternship] = React.useState({
    title: '',
    organization: '',
    start_date: new Date().toISOString().split('T')[0],
    description: '',
    skills_input: '',
    projects_input: ''
  });

  const fetchInternships = async () => {
    try {
      // @ts-ignore
      const response = await api.getRecords();
      const data = response.data.filter((r: any) => r.type === 'internship');
      setInternships(data);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInternships();
  }, []);

  const handleAddInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternship.title || !newInternship.organization) return;
    
    try {
      const payload = {
        title: newInternship.title,
        organization: newInternship.organization,
        start_date: newInternship.start_date,
        description: newInternship.description,
        skills_applied: newInternship.skills_input.split(',').map(s => s.trim()).filter(Boolean),
        projects: newInternship.projects_input.split(',').map(s => s.trim()).filter(Boolean),
        type: 'internship',
        status: 'active',
      };
      
      // @ts-ignore
      await api.createRecord(payload);
      setIsModalOpen(false);
      setNewInternship({ title: '', organization: '', start_date: new Date().toISOString().split('T')[0], description: '', skills_input: '', projects_input: '' });
      fetchInternships();
    } catch (error: any) {
      console.error('Failed to add internship:', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Internships</h2>
          <p className="text-muted-foreground">
            Track your experiences and measure skill development
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          + Add Internship
        </button>
      </div>

      {/* Internships List */}

      {/* Internship Cards */}
      <div className="space-y-6">
        {internships.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-6">
              <Building2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No internships yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Start building your career portfolio by adding your first internship or work experience.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              + Add Your First Internship
            </button>
          </div>
        ) : (
          internships.map((internship) => (
            <InternshipCard key={internship._id || internship.id} internship={internship} />
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md border border-border rounded-xl shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-lg">Add Internship</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-accent rounded-md transition-colors">
                <span className="text-muted-foreground text-xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleAddInternship} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Title</label>
                <input
                  type="text"
                  required
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Software Engineering Intern"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization</label>
                <input
                  type="text"
                  required
                  value={newInternship.organization}
                  onChange={(e) => setNewInternship({ ...newInternship, organization: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Tech Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newInternship.start_date}
                    onChange={(e) => setNewInternship({ ...newInternship, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={newInternship.description}
                  onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 h-20"
                  placeholder="What did you do?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Skills Applied (comma separated)</label>
                <input
                  type="text"
                  value={newInternship.skills_input}
                  onChange={(e) => setNewInternship({ ...newInternship, skills_input: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Projects (comma separated)</label>
                <input
                  type="text"
                  value={newInternship.projects_input}
                  onChange={(e) => setNewInternship({ ...newInternship, projects_input: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Data Dashboard v2, Auth System"
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
                  Save Internship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InternshipCard({ internship }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold">{internship.company || internship.organization}</h3>
                {internship.status === 'active' ? (
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                    Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                    Completed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                <span>{internship.role || internship.title}</span>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-muted-foreground font-normal">
                  <MapPin className="w-3.5 h-3.5" />
                  {internship.location || internship.organization}
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-muted-foreground font-normal">
                  <Calendar className="w-3.5 h-3.5" />
                  {internship.period || new Date(internship.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
          
          <button
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title={`Search ${internship.company || internship.organization}`}
            onClick={() => window.open(`https://www.linkedin.com/company/${(internship.company || internship.organization || '').toLowerCase()}`, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">{internship.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(internship.skills_applied || internship.skills || []).map((skill: string) => (
            <span
              key={skill}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent text-accent-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Key Projects - Moved to top */}
      <div className="p-4 border-b border-border bg-gradient-to-br from-chart-1/5 to-chart-2/5">
        <h4 className="text-sm font-semibold mb-3">Key Projects</h4>
        <div className="grid grid-cols-3 gap-3">
          {(internship.projects || []).map((project: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{project}</span>
            </div>
          ))}
          {(!internship.projects || internship.projects.length === 0) && (
            <div className="text-sm text-muted-foreground col-span-3">No projects recorded.</div>
          )}
        </div>
      </div>

      {/* Skill Impact Visualization */}
      {internship.impact && (
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Skill Impact Analysis
            </h4>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={internship.impact} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis 
                  dataKey="metric" 
                  type="category" 
                  stroke="var(--muted-foreground)"
                  width={80}
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="before" fill="var(--muted-foreground)" radius={[0, 4, 4, 0]} opacity={0.5} />
                <Bar dataKey="after" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Growth Metrics</h4>
            
            <div className="grid grid-cols-2 gap-3">
              {internship.impact.map((item: any) => (
                <div key={item.metric} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                  <div>
                    <div className="font-medium text-sm">{item.metric}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.before} → {item.after}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-green-600 dark:text-green-400">
                      +{item.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
