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
import { api } from '../api';

const skillsTimelineData = [
  { month: 'Aug', totalSkills: 12, newSkills: 12 },
  { month: 'Sep', totalSkills: 14, newSkills: 2 },
  { month: 'Oct', totalSkills: 17, newSkills: 3 },
  { month: 'Nov', totalSkills: 19, newSkills: 2 },
  { month: 'Dec', totalSkills: 21, newSkills: 2 },
  { month: 'Jan', totalSkills: 23, newSkills: 2 },
  { month: 'Feb', totalSkills: 25, newSkills: 2 },
];

// Skills data comes from backend now.

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
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    category: 'Frontend',
    skill_level: 50,
  });

  const fetchSkills = async () => {
    try {
      const response = await api.getSkills();
      setSkillsData(
        response.data.map((s: any) => ({
          ...s,
          id: s._id,
          name: s.skill_name.charAt(0).toUpperCase() + s.skill_name.slice(1),
          level: s.skill_level,
          trend: s.trend || 'stable',
          lastPracticed: '0 days ago',
          evidenceCount: 0,
          certifications: 0,
          internships: 0,
          relatedEvidence: []
        }))
      );
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.skill_name) return;
    
    try {
      await api.createSkill(newSkill);
      setIsModalOpen(false);
      setNewSkill({ skill_name: '', category: 'Frontend', skill_level: 50 });
      fetchSkills();
    } catch (error: any) {
      console.error('Failed to add skill:', error);
    }
  };

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
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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

          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md border border-border rounded-xl shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-lg">Add Skill</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-accent rounded-md transition-colors">
                <span className="text-muted-foreground text-xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleAddSkill} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Skill Name</label>
                <input
                  type="text"
                  required
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="React"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {categories.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Skill Level: {newSkill.skill_level}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkill.skill_level}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_level: parseInt(e.target.value) })}
                  className="w-full accent-primary"
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
