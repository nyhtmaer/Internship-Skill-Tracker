import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Link as LinkIcon,
  FileText,
  Award,
  Briefcase,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
  Code,
  Layers,
  Server,
  Database as DatabaseIcon,
  Cloud,
  Wrench
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const skillsTimelineData = [
  { month: 'Aug', totalSkills: 12, newSkills: 12 },
  { month: 'Sep', totalSkills: 14, newSkills: 2 },
  { month: 'Oct', totalSkills: 17, newSkills: 3 },
  { month: 'Nov', totalSkills: 19, newSkills: 2 },
  { month: 'Dec', totalSkills: 21, newSkills: 2 },
  { month: 'Jan', totalSkills: 23, newSkills: 2 },
  { month: 'Feb', totalSkills: 25, newSkills: 2 },
];

const skillsData = [
  {
    id: 1,
    name: 'React',
    category: 'Frontend',
    level: 85,
    trend: 'growing',
    lastPracticed: '2 days ago',
    evidenceCount: 12,
    certifications: 2,
    internships: 2,
    growthData: [
      { date: 'Aug', level: 50 },
      { date: 'Sep', level: 58 },
      { date: 'Oct', level: 65 },
      { date: 'Nov', level: 72 },
      { date: 'Dec', level: 78 },
      { date: 'Jan', level: 82 },
      { date: 'Feb', level: 85 },
    ],
    relatedEvidence: [
      { type: 'project', title: 'E-commerce Dashboard', impact: 'high' },
      { type: 'certification', title: 'React Advanced Patterns', impact: 'medium' },
      { type: 'internship', title: 'Meta - Frontend Intern', impact: 'high' },
    ],
  },
  {
    id: 2,
    name: 'TypeScript',
    category: 'Languages',
    level: 80,
    trend: 'growing',
    lastPracticed: '1 day ago',
    evidenceCount: 9,
    certifications: 1,
    internships: 2,
    growthData: [
      { date: 'Aug', level: 40 },
      { date: 'Sep', level: 48 },
      { date: 'Oct', level: 55 },
      { date: 'Nov', level: 63 },
      { date: 'Dec', level: 70 },
      { date: 'Jan', level: 75 },
      { date: 'Feb', level: 80 },
    ],
    relatedEvidence: [
      { type: 'project', title: 'Type-safe API Client', impact: 'high' },
      { type: 'internship', title: 'Meta - Frontend Intern', impact: 'high' },
    ],
  },
  {
    id: 3,
    name: 'Node.js',
    category: 'Backend',
    level: 75,
    trend: 'stable',
    lastPracticed: '5 days ago',
    evidenceCount: 8,
    certifications: 1,
    internships: 1,
    growthData: [
      { date: 'Aug', level: 45 },
      { date: 'Sep', level: 52 },
      { date: 'Oct', level: 60 },
      { date: 'Nov', level: 68 },
      { date: 'Dec', level: 72 },
      { date: 'Jan', level: 74 },
      { date: 'Feb', level: 75 },
    ],
    relatedEvidence: [
      { type: 'project', title: 'REST API Service', impact: 'high' },
      { type: 'internship', title: 'Stripe - Full Stack Intern', impact: 'high' },
    ],
  },
  {
    id: 4,
    name: 'Python',
    category: 'Languages',
    level: 62,
    trend: 'decaying',
    lastPracticed: '21 days ago',
    evidenceCount: 5,
    certifications: 0,
    internships: 0,
    growthData: [
      { date: 'Aug', level: 70 },
      { date: 'Sep', level: 70 },
      { date: 'Oct', level: 68 },
      { date: 'Nov', level: 67 },
      { date: 'Dec', level: 65 },
      { date: 'Jan', level: 63 },
      { date: 'Feb', level: 62 },
    ],
    relatedEvidence: [
      { type: 'project', title: 'Data Analysis Script', impact: 'medium' },
      { type: 'certification', title: 'Python Fundamentals', impact: 'low' },
    ],
  },
  {
    id: 5,
    name: 'PostgreSQL',
    category: 'Database',
    level: 68,
    trend: 'growing',
    lastPracticed: '7 days ago',
    evidenceCount: 6,
    certifications: 0,
    internships: 1,
    growthData: [
      { date: 'Aug', level: 35 },
      { date: 'Sep', level: 42 },
      { date: 'Oct', level: 50 },
      { date: 'Nov', level: 57 },
      { date: 'Dec', level: 62 },
      { date: 'Jan', level: 65 },
      { date: 'Feb', level: 68 },
    ],
    relatedEvidence: [
      { type: 'internship', title: 'Stripe - Full Stack Intern', impact: 'high' },
      { type: 'project', title: 'Database Migration Tool', impact: 'medium' },
    ],
  },
  {
    id: 6,
    name: 'Docker',
    category: 'DevOps',
    level: 60,
    trend: 'growing',
    lastPracticed: '10 days ago',
    evidenceCount: 4,
    certifications: 1,
    internships: 1,
    growthData: [
      { date: 'Aug', level: 25 },
      { date: 'Sep', level: 32 },
      { date: 'Oct', level: 40 },
      { date: 'Nov', level: 48 },
      { date: 'Dec', level: 53 },
      { date: 'Jan', level: 57 },
      { date: 'Feb', level: 60 },
    ],
    relatedEvidence: [
      { type: 'internship', title: 'Stripe - Full Stack Intern', impact: 'high' },
      { type: 'certification', title: 'Docker Essentials', impact: 'medium' },
    ],
  },
  {
    id: 7,
    name: 'JavaScript',
    category: 'Languages',
    level: 88,
    trend: 'stable',
    lastPracticed: '1 day ago',
    evidenceCount: 15,
    certifications: 1,
    internships: 2,
    growthData: [
      { date: 'Aug', level: 75 },
      { date: 'Sep', level: 78 },
      { date: 'Oct', level: 82 },
      { date: 'Nov', level: 85 },
      { date: 'Dec', level: 86 },
      { date: 'Jan', level: 87 },
      { date: 'Feb', level: 88 },
    ],
    relatedEvidence: [
      { type: 'internship', title: 'Meta - Frontend Intern', impact: 'high' },
      { type: 'project', title: 'Interactive Web Apps', impact: 'high' },
    ],
  },
  {
    id: 8,
    name: 'Vue.js',
    category: 'Frontend',
    level: 55,
    trend: 'growing',
    lastPracticed: '15 days ago',
    evidenceCount: 3,
    certifications: 0,
    internships: 0,
    growthData: [
      { date: 'Aug', level: 30 },
      { date: 'Sep', level: 35 },
      { date: 'Oct', level: 40 },
      { date: 'Nov', level: 45 },
      { date: 'Dec', level: 48 },
      { date: 'Jan', level: 52 },
      { date: 'Feb', level: 55 },
    ],
    relatedEvidence: [
      { type: 'project', title: 'Personal Portfolio', impact: 'medium' },
    ],
  },
  {
    id: 9,
    name: 'AWS',
    category: 'Cloud',
    level: 58,
    trend: 'growing',
    lastPracticed: '8 days ago',
    evidenceCount: 7,
    certifications: 1,
    internships: 1,
    growthData: [
      { date: 'Aug', level: 20 },
      { date: 'Sep', level: 28 },
      { date: 'Oct', level: 38 },
      { date: 'Nov', level: 45 },
      { date: 'Dec', level: 50 },
      { date: 'Jan', level: 54 },
      { date: 'Feb', level: 58 },
    ],
    relatedEvidence: [
      { type: 'certification', title: 'AWS Cloud Practitioner', impact: 'high' },
      { type: 'project', title: 'Serverless API', impact: 'high' },
    ],
  },
  {
    id: 10,
    name: 'MongoDB',
    category: 'Database',
    level: 65,
    trend: 'stable',
    lastPracticed: '12 days ago',
    evidenceCount: 5,
    certifications: 0,
    internships: 0,
    growthData: [
      { date: 'Aug', level: 58 },
      { date: 'Sep', level: 60 },
      { date: 'Oct', level: 62 },
      { date: 'Nov', level: 63 },
      { date: 'Dec', level: 64 },
      { date: 'Jan', level: 65 },
      { date: 'Feb', level: 65 },
    ],
    relatedEvidence: [
      { type: 'project', title: 'User Auth System', impact: 'medium' },
    ],
  },
  {
    id: 11,
    name: 'Git',
    category: 'Tools',
    level: 90,
    trend: 'stable',
    lastPracticed: '1 day ago',
    evidenceCount: 20,
    certifications: 0,
    internships: 2,
    growthData: [
      { date: 'Aug', level: 82 },
      { date: 'Sep', level: 84 },
      { date: 'Oct', level: 86 },
      { date: 'Nov', level: 87 },
      { date: 'Dec', level: 88 },
      { date: 'Jan', level: 89 },
      { date: 'Feb', level: 90 },
    ],
    relatedEvidence: [
      { type: 'internship', title: 'All Projects', impact: 'high' },
    ],
  },
  {
    id: 12,
    name: 'Kubernetes',
    category: 'DevOps',
    level: 42,
    trend: 'growing',
    lastPracticed: '18 days ago',
    evidenceCount: 2,
    certifications: 0,
    internships: 0,
    growthData: [
      { date: 'Aug', level: 15 },
      { date: 'Sep', level: 20 },
      { date: 'Oct', level: 25 },
      { date: 'Nov', level: 30 },
      { date: 'Dec', level: 35 },
      { date: 'Jan', level: 38 },
      { date: 'Feb', level: 42 },
    ],
    relatedEvidence: [
      { type: 'project', title: 'Container Orchestration', impact: 'medium' },
    ],
  },
];

const categories = [
  { name: 'Languages', icon: Code, color: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-blue-500/30' },
  { name: 'Frontend', icon: Layers, color: 'from-purple-500/20 to-purple-600/20', borderColor: 'border-purple-500/30' },
  { name: 'Backend', icon: Server, color: 'from-green-500/20 to-green-600/20', borderColor: 'border-green-500/30' },
  { name: 'Database', icon: DatabaseIcon, color: 'from-orange-500/20 to-orange-600/20', borderColor: 'border-orange-500/30' },
  { name: 'Cloud', icon: Cloud, color: 'from-cyan-500/20 to-cyan-600/20', borderColor: 'border-cyan-500/30' },
  { name: 'DevOps', icon: Wrench, color: 'from-red-500/20 to-red-600/20', borderColor: 'border-red-500/30' },
  { name: 'Tools', icon: Target, color: 'from-pink-500/20 to-pink-600/20', borderColor: 'border-pink-500/30' },
];

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<typeof skillsData[0] | null>(null);

  const getCategoryStats = (categoryName: string) => {
    const categorySkills = skillsData.filter(s => s.category === categoryName);
    const avgLevel = categorySkills.length > 0
      ? Math.round(categorySkills.reduce((sum, s) => sum + s.level, 0) / categorySkills.length)
      : 0;
    const growing = categorySkills.filter(s => s.trend === 'growing').length;
    const decaying = categorySkills.filter(s => s.trend === 'decaying').length;

    return { count: categorySkills.length, avgLevel, growing, decaying };
  };

  // Category Overview View
  if (!selectedCategory) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Skills</h2>
            <p className="text-muted-foreground">
              Track growth, decay, and evidence across skill categories
            </p>
          </div>

          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            + Add Skill
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Skills</div>
            <div className="text-3xl font-bold">{skillsData.length}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground mb-1">Average Level</div>
            <div className="text-3xl font-bold">
              {Math.round(skillsData.reduce((sum, s) => sum + s.level, 0) / skillsData.length)}%
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground mb-1">Growing Skills</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {skillsData.filter(s => s.trend === 'growing').length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground mb-1">Needs Attention</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {skillsData.filter(s => s.trend === 'decaying').length}
            </div>
          </div>
        </div>

        {/* Skill Categories */}
        <div className="grid grid-cols-3 gap-6">
          {categories.map((category) => {
            const stats = getCategoryStats(category.name);
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`
                  bg-card border ${category.borderColor} rounded-2xl p-6 text-left
                  transition-all hover:shadow-lg hover:scale-[1.02] group
                  bg-gradient-to-br ${category.color}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-card border ${category.borderColor}">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stats.avgLevel}%</div>
                    <div className="text-xs text-muted-foreground">avg level</div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  {stats.count} {stats.count === 1 ? 'skill' : 'skills'} tracked
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    {stats.growing} growing
                  </div>
                  {stats.decaying > 0 && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <TrendingDown className="w-3 h-3" />
                      {stats.decaying} decaying
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    );
  }

  // Category Detail View
  const categorySkills = skillsData.filter(s => s.category === selectedCategory);
  const currentSkill = selectedSkill || categorySkills[0];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSkill(null);
          }}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-semibold mb-2">{selectedCategory}</h2>
          <p className="text-muted-foreground">
            {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'} in this category
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Grid Skills List */}
        <div className="grid grid-cols-4 gap-4">
          {categorySkills.map((skill) => {
            // Derive decay tier from trend + lastPracticed text
            const tier: 'active' | 'at-risk' | 'decaying' =
              skill.trend === 'decaying' ? 'decaying'
              : skill.trend === 'stable'  ? 'at-risk'
              : 'active';

            const barClass = {
              active:   'bg-emerald-500',
              'at-risk': 'bg-amber-500',
              decaying:  'bg-red-500',
            }[tier];

            const dotClass = {
              active:   'bg-emerald-500',
              'at-risk': 'bg-amber-500',
              decaying:  'bg-red-500 animate-pulse',
            }[tier];

            const lastPracticedClass = {
              active:   'text-emerald-600 dark:text-emerald-400',
              'at-risk': 'text-amber-600 dark:text-amber-400',
              decaying:  'text-red-600 dark:text-red-400',
            }[tier];

            return (
            <button
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className={`
                min-w-[280px] flex-shrink-0 text-left p-4 rounded-xl border transition-all
                ${currentSkill.id === skill.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                  : 'bg-card border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
                  <span className="font-semibold">{skill.name}</span>
                </div>
                {skill.trend === 'growing' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : skill.trend === 'decaying' ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <div className="w-4 h-4" />
                )}
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={currentSkill.id === skill.id ? 'opacity-90' : 'text-muted-foreground'}>
                    Level
                  </span>
                  <span className="font-bold">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      currentSkill.id === skill.id ? 'bg-primary-foreground/70' : barClass
                    }`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>

              <div className={`text-xs mb-2 font-medium ${
                currentSkill.id === skill.id ? 'text-primary-foreground/80' : lastPracticedClass
              }`}>
                Last: {skill.lastPracticed}
              </div>

              <div className={`flex items-center gap-3 text-xs ${currentSkill.id === skill.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {skill.evidenceCount}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {skill.certifications}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {skill.internships}
                </span>
              </div>
            </button>
            );
          })}
        </div>

        {/* Skill Detail View */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {/* Growth Chart */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">{currentSkill.name}</h3>
                <p className="text-sm text-muted-foreground">{currentSkill.category}</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold">{currentSkill.level}%</div>
                <div className={`text-sm flex items-center gap-1 justify-end mt-1 ${
                  currentSkill.trend === 'growing'
                    ? 'text-green-600 dark:text-green-400'
                    : currentSkill.trend === 'decaying'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
                }`}>
                  {currentSkill.trend === 'growing' ? (
                    <><TrendingUp className="w-4 h-4" /> Growing</>
                  ) : currentSkill.trend === 'decaying' ? (
                    <><TrendingDown className="w-4 h-4" /> Decaying</>
                  ) : (
                    <>Stable</>
                  )}
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={currentSkill.growthData}>
                <defs>
                  <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      style={{ stopColor: currentSkill.trend === 'decaying' ? 'var(--chart-5)' : 'var(--chart-1)', stopOpacity: 0.3 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: currentSkill.trend === 'decaying' ? 'var(--chart-5)' : 'var(--chart-1)', stopOpacity: 0 }}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="level"
                  stroke={currentSkill.trend === 'decaying' ? 'var(--chart-5)' : 'var(--chart-1)'}
                  strokeWidth={3}
                  fill="url(#skillGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-accent">
                <div className="text-xs text-muted-foreground mb-1">Last Practiced</div>
                <div className="font-semibold">{currentSkill.lastPracticed}</div>
              </div>
              <div className="p-3 rounded-lg bg-accent">
                <div className="text-xs text-muted-foreground mb-1">Evidence Items</div>
                <div className="font-semibold">{currentSkill.evidenceCount} linked</div>
              </div>
              <div className="p-3 rounded-lg bg-accent">
                <div className="text-xs text-muted-foreground mb-1">Experience</div>
                <div className="font-semibold">{currentSkill.internships} internships</div>
              </div>
            </div>

            {currentSkill.trend === 'decaying' && (
              <div className="mt-4 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-orange-600 dark:text-orange-400 mb-1">
                    Skill Decay Alert
                  </div>
                  <div className="text-xs text-muted-foreground">
                    No practice in {currentSkill.lastPracticed.split(' ')[0]} days.
                    Consider working on a project or taking a refresher course.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Evidence Mapping */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <LinkIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Evidence Mapping</h3>
            </div>

            <div className="space-y-3">
              {currentSkill.relatedEvidence.map((evidence, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {evidence.type === 'project' && (
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    {evidence.type === 'certification' && (
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                    {evidence.type === 'internship' && (
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}

                    <div>
                      <div className="font-medium text-sm">{evidence.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {evidence.type}
                      </div>
                    </div>
                  </div>

                  <div className={`
                    px-2.5 py-1 rounded-md text-xs font-medium
                    ${evidence.impact === 'high'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                      : evidence.impact === 'medium'
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {evidence.impact} impact
                  </div>
                </div>
              ))}

              <button className="w-full p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Sparkles className="w-4 h-4" />
                Link New Evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
