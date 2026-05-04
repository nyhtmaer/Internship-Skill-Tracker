import React from 'react';
import {
  TrendingUp,
  Target,
  Award,
  Briefcase,
  Calendar,
  Zap,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  ComposedChart,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

const overallGrowth = [
  { month: 'Feb 25', skills: 12, internships: 0, certs: 3, evidence: 8 },
  { month: 'Apr 25', skills: 14, internships: 0, certs: 4, evidence: 12 },
  { month: 'Jun 25', skills: 16, internships: 1, certs: 4, evidence: 18 },
  { month: 'Aug 25', skills: 18, internships: 1, certs: 5, evidence: 25 },
  { month: 'Oct 25', skills: 20, internships: 1, certs: 6, evidence: 32 },
  { month: 'Dec 25', skills: 23, internships: 2, certs: 7, evidence: 40 },
  { month: 'Feb 26', skills: 24, internships: 2, certs: 8, evidence: 47 },
];

const skillVelocity = [
  { week: 'W1', velocity: 3.2 },
  { week: 'W2', velocity: 4.1 },
  { week: 'W3', velocity: 2.8 },
  { week: 'W4', velocity: 5.3 },
  { week: 'W5', velocity: 4.7 },
  { week: 'W6', velocity: 6.2 },
  { week: 'W7', velocity: 5.8 },
  { week: 'W8', velocity: 7.1 },
];

const skillHealthMatrix = [
  { skill: 'JavaScript', health: 92, practice: 95, evidence: 90 },
  { skill: 'React', health: 88, practice: 90, evidence: 85 },
  { skill: 'Node.js', health: 82, practice: 75, evidence: 88 },
  { skill: 'PostgreSQL', health: 78, practice: 70, evidence: 82 },
  { skill: 'Docker', health: 75, practice: 65, evidence: 78 },
  { skill: 'AWS', health: 68, practice: 60, evidence: 75 },
];

const categoryDistribution = [
  { category: 'Languages', count: 3, avgLevel: 77 },
  { category: 'Frontend', count: 2, avgLevel: 70 },
  { category: 'Backend', count: 1, avgLevel: 75 },
  { category: 'Database', count: 2, avgLevel: 67 },
  { category: 'Cloud', count: 1, avgLevel: 58 },
  { category: 'DevOps', count: 2, avgLevel: 51 },
  { category: 'Tools', count: 1, avgLevel: 90 },
];

const internshipImpact = [
  { name: 'Meta', duration: 2, skillsGained: 8, avgGrowth: 28 },
  { name: 'Stripe', duration: 6, skillsGained: 12, avgGrowth: 65 },
];

const productivityHeatmap = [
  { day: 'Mon', hour: '9-12', activity: 12 },
  { day: 'Mon', hour: '12-15', activity: 8 },
  { day: 'Mon', hour: '15-18', activity: 15 },
  { day: 'Tue', hour: '9-12', activity: 14 },
  { day: 'Tue', hour: '12-15', activity: 10 },
  { day: 'Tue', hour: '15-18', activity: 18 },
  { day: 'Wed', hour: '9-12', activity: 16 },
  { day: 'Wed', hour: '12-15', activity: 12 },
  { day: 'Wed', hour: '15-18', activity: 20 },
  { day: 'Thu', hour: '9-12', activity: 11 },
  { day: 'Thu', hour: '12-15', activity: 9 },
  { day: 'Thu', hour: '15-18', activity: 13 },
  { day: 'Fri', hour: '9-12', activity: 15 },
  { day: 'Fri', hour: '12-15', activity: 11 },
  { day: 'Fri', hour: '15-18', activity: 17 },
];

export default function Analytics() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-semibold mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Deep insights into your career trajectory and skill development
        </p>
      </div>

      {/* Key Insights - Moved to top */}
      <div className="bg-gradient-to-br from-chart-1/10 to-chart-2/10 border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Key Insights
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <InsightCard
            title="Strongest Growth Area"
            value="Frontend Development"
            description="82% average proficiency across 8 skills"
            variant="success"
          />
          <InsightCard
            title="Highest ROI Internship"
            value="Stripe (6 months)"
            description="65% average skill growth, 12 new competencies"
            variant="info"
          />
          <InsightCard
            title="Focus Recommendation"
            value="Backend & DevOps"
            description="Below average proficiency, high career demand"
            variant="warning"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Growth Velocity"
          value="7.1"
          unit="pts/week"
          change="+22%"
          trend="up"
          icon={Zap}
        />
        <MetricCard
          title="Avg Skill Health"
          value="79"
          unit="%"
          change="+8%"
          trend="up"
          icon={Activity}
        />
        <MetricCard
          title="Active Streaks"
          value="24"
          unit="days"
          change="+5 days"
          trend="up"
          icon={Calendar}
        />
        <MetricCard
          title="Evidence/Skill"
          value="1.96"
          unit="ratio"
          change="+0.3"
          trend="up"
          icon={Target}
        />
      </div>

      {/* Overall Growth Trend */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Overall Growth Trajectory</h3>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={overallGrowth}>
            <defs>
              <linearGradient id="skillsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="var(--chart-3)"
              fontSize={12}
              tickCount={4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="evidence"
              fill="url(#skillsGradient)"
              stroke="var(--chart-1)"
              strokeWidth={2}
              name="Evidence"
              dot={{ fill: 'var(--chart-1)', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="skills"
              stroke="var(--chart-2)"
              strokeWidth={3}
              dot={{ fill: 'var(--chart-2)', r: 4 }}
              activeDot={{ r: 6 }}
              name="Skills"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="certs"
              stroke="var(--chart-4)"
              strokeWidth={3}
              dot={{ fill: 'var(--chart-4)', r: 4 }}
              activeDot={{ r: 6 }}
              name="Certifications"
            />
            <Bar 
              yAxisId="right"
              dataKey="internships" 
              fill="var(--chart-3)"
              name="Internships"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Skill Velocity */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-chart-1" />
            <h3 className="text-lg font-semibold">Skill Development Velocity</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={skillVelocity}>
              <defs>
                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: 'var(--chart-2)', stopOpacity: 0.4 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--chart-2)', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis 
                dataKey="week" 
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--muted-foreground)"
                fontSize={12}
                label={{ value: 'Points/Week', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
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
                dataKey="velocity"
                stroke="var(--chart-2)"
                strokeWidth={3}
                fill="url(#velocityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Health Matrix */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-chart-1" />
            <h3 className="text-lg font-semibold">Skill Health Matrix</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={skillHealthMatrix}>
              <PolarGrid stroke="var(--border)" strokeWidth={0.5} />
              <PolarAngleAxis 
                dataKey="skill" 
                stroke="var(--foreground)"
                fontSize={11}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Overall Health"
                dataKey="health"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Practice Frequency"
                dataKey="practice"
                stroke="var(--chart-2)"
                fill="var(--chart-2)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Skills by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis 
                dataKey="category" 
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
              <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 8, 8, 0]} />
              <Bar dataKey="avgLevel" fill="var(--chart-2)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Internship Impact */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-chart-1" />
            <h3 className="text-lg font-semibold">Internship Impact Analysis</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis 
                dataKey="duration" 
                type="number" 
                name="Duration (months)"
                stroke="var(--muted-foreground)"
                fontSize={11}
                label={{ value: 'Duration (months)', position: 'insideBottom', offset: -5, style: { fontSize: 11 } }}
              />
              <YAxis 
                dataKey="skillsGained" 
                type="number" 
                name="Skills Gained"
                stroke="var(--muted-foreground)"
                fontSize={11}
                label={{ value: 'Skills Gained', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
              />
              <ZAxis dataKey="avgGrowth" range={[400, 1000]} name="Avg Growth %" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'Avg Growth %') return [`${value}%`, name];
                  return [value, name];
                }}
              />
              <Scatter 
                data={internshipImpact} 
                fill="var(--chart-1)"
                name="Internships"
              />
            </ScatterChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {internshipImpact.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-accent">
                <span className="font-medium text-sm">{item.name}</span>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{item.duration} months</span>
                  <span>{item.skillsGained} skills</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    +{item.avgGrowth}% avg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, change, trend, icon: Icon }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-10 h-10 p-2 rounded-xl bg-accent" />
        <div className={`text-sm font-medium ${
          trend === 'up' 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {change}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}

function InsightCard({ title, value, description, variant }: any) {
  const variants = {
    success: 'border-green-500/30 bg-green-500/5',
    info: 'border-blue-500/30 bg-blue-500/5',
    warning: 'border-orange-500/30 bg-orange-500/5',
  };

  return (
    <div className={`p-4 rounded-xl border ${variants[variant as keyof typeof variants]}`}>
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className="font-semibold mb-2">{value}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
