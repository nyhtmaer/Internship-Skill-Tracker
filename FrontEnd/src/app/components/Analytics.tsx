import React from 'react';
import { TrendingDown, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAnalytics, useSkills } from '../../hooks';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export default function Analytics() {
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalytics();
  const { skills, isLoading: skillsLoading } = useSkills();

  // Generate decay data
  const decayData = analyticsData?.slice(0, 10).map(s => ({
    name: s.skill_name,
    decay_rate: s.decay_rate || 0,
    days: s.days_since_practiced || 0,
  })) || [];

  // Category distribution
  const categoryData = (() => {
    const categories = {};
    skills.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, count]) => ({
      name,
      value: count,
    }));
  })();

  // Level distribution
  const levelData = (() => {
    const levels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    skills.forEach(s => {
      levels[s.skill_level] = (levels[s.skill_level] || 0) + 1;
    });
    return Object.entries(levels).map(([level, count]) => ({
      level: `Level ${level}`,
      count,
    }));
  })();

  // Summary statistics
  const stats = {
    totalSkills: skills.length,
    avgDecay: analyticsData?.length > 0 
      ? (analyticsData.reduce((sum, s) => sum + (s.decay_rate || 0), 0) / analyticsData.length).toFixed(2)
      : 0,
    decayingSkills: analyticsData?.filter(s => s.decay_rate > 0.5).length || 0,
    avgLevel: skills.length > 0
      ? (skills.reduce((sum, s) => sum + s.skill_level, 0) / skills.length).toFixed(1)
      : 0,
  };

  const isLoading = analyticsLoading || skillsLoading;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Understand your skill decay patterns and proficiency trends
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-6">
        <StatBox
          title="Total Skills"
          value={stats.totalSkills}
          icon="📊"
          subtitle="Being tracked"
        />
        <StatBox
          title="Average Level"
          value={`${stats.avgLevel}/5`}
          icon="📈"
          subtitle="Across all skills"
        />
        <StatBox
          title="Avg Decay Rate"
          value={`${(stats.avgDecay * 100).toFixed(1)}%`}
          icon="📉"
          subtitle="0 = fresh, 100 = stale"
        />
        <StatBox
          title="Decaying Skills"
          value={stats.decayingSkills}
          icon="⚠️"
          subtitle="Need practice"
          highlight={stats.decayingSkills > 0}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Skill Decay Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Skill Decay Rates</h3>
          </div>
          {decayData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={decayData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  domain={[0, 1]}
                  label={{ value: 'Decay Rate', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${(value * 100).toFixed(1)}%`}
                />
                <Bar dataKey="decay_rate" fill="var(--chart-4)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              Add skills to see decay analytics
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Skills by Category</h3>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} skill${value > 1 ? 's' : ''}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              Add skills to see category distribution
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Skill Level Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Level Distribution</h3>
            <p className="text-sm text-muted-foreground">How many skills at each level</p>
          </div>
          {levelData.length > 0 && levelData.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="level" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              Add skills to see level distribution
            </div>
          )}
        </div>

        {/* Days Since Practice */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Days Since Practice</h3>
            <p className="text-sm text-muted-foreground">How recently skills were updated</p>
          </div>
          {decayData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={decayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value} days ago`}
                />
                <Line 
                  type="monotone" 
                  dataKey="days" 
                  stroke="var(--chart-3)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--chart-3)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              Add skills to see practice timeline
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Understanding Decay</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Skills decay at ~4% per week without practice. The decay rate shows how "stale" each skill has become (0 = just practiced, 1 = 90+ days neglected).
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <p className="font-medium text-green-900 dark:text-green-400">Fresh (0-0.33)</p>
            <p className="text-xs text-green-700 dark:text-green-300">Practiced recently</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="font-medium text-yellow-900 dark:text-yellow-400">Aging (0.34-0.66)</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">Needs refresher</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="font-medium text-red-900 dark:text-red-400">Stale (0.67-1.0)</p>
            <p className="text-xs text-red-700 dark:text-red-300">Requires practice now</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value, icon, subtitle, highlight }) {
  return (
    <div className={`bg-card border rounded-xl p-6 ${highlight ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : 'border-border'}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-sm font-medium text-foreground mt-2">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
