import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Briefcase,
  Target,
  Award,
  Calendar,
  ArrowUpRight,
  Clock,
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
  Radar
} from 'recharts';
import CustomTooltip from './CustomTooltip';
import AnimatedNumber from './AnimatedNumber';
import ProgressRing from './ProgressRing';

const skillHealthData = [
  { month: 'Aug', score: 65 },
  { month: 'Sep', score: 72 },
  { month: 'Oct', score: 78 },
  { month: 'Nov', score: 75 },
  { month: 'Dec', score: 82 },
  { month: 'Jan', score: 88 },
  { month: 'Feb', score: 92 },
];

const skillRadarData = [
  { skill: 'Frontend', current: 85, target: 90 },
  { skill: 'Backend', current: 65, target: 80 },
  { skill: 'Design', current: 75, target: 85 },
  { skill: 'Data', current: 60, target: 75 },
  { skill: 'Mobile', current: 55, target: 70 },
  { skill: 'DevOps', current: 50, target: 65 },
];

const upcomingDeadlines = [
  { title: 'React Advanced Certification', date: 'Feb 15, 2026', type: 'Certification', priority: 'high' },
  { title: 'Internship Review - Meta', date: 'Feb 18, 2026', type: 'Review', priority: 'high' },
  { title: 'TypeScript Workshop', date: 'Feb 22, 2026', type: 'Learning', priority: 'medium' },
  { title: 'Portfolio Update', date: 'Feb 28, 2026', type: 'Task', priority: 'low' },
];

const recentActivity = [
  { action: 'Completed AWS Cloud Practitioner', time: '2 hours ago', type: 'certification' },
  { action: 'Added 3 new pieces of evidence', time: '5 hours ago', type: 'evidence' },
  { action: 'Updated React skill level', time: '1 day ago', type: 'skill' },
  { action: 'Started internship at Stripe', time: '3 days ago', type: 'internship' },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">

      {/* Today's Focus — Skill Decay CTA */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Today's Focus</p>
              <h3 className="text-lg font-bold mb-1">Python skill is decaying — 18 days without practice</h3>
              <p className="text-white/80 text-sm">Your proficiency tends to drop ~4% per week without practice. Spend 30 min today to hold your level.</p>
            </div>
          </div>
          <button className="flex-shrink-0 bg-white text-indigo-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap">
            Log Practice →
          </button>
        </div>
      </div>

      {/* Top Stats & Recent Activity Group */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Top Stats - Made Smaller */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Active Internships"
            value="2"
            change="+1 this month"
            trend="up"
            icon={Briefcase}
          />
          <StatCard
            title="Skills Tracked"
            value="24"
            change="+3 this week"
            trend="up"
            icon={Target}
          />
          <StatCard
            title="Certifications"
            value="8"
            change="+2 this month"
            trend="up"
            icon={Award}
          />
          <StatCard
            title="Evidence Items"
            value="47"
            change="+5 this week"
            trend="up"
            icon={ArrowUpRight}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentActivity.map((item, idx) => (
              <ActivityItem key={idx} {...item} />
            ))}
          </div>
        </div>

      </div>

      {/* Alerts & Timeline Row — prioritised above activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Alerts</h3>
          </div>
          <div className="space-y-3">
            <AlertItem title="React skill decaying" description="No practice in 14 days" severity="warning" cta="Add Evidence" />
            <AlertItem title="Certificate expiring soon" description="AWS cert expires Mar 15" severity="error" cta="Set Reminder" />
            <AlertItem title="Missing evidence" description="Link work samples to Node.js" severity="info" cta="Link Now →" />
          </div>
        </div>
        {/* Upcoming Deadlines */}
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((item, idx) => (
              <DeadlineItem key={idx} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Skill Health Score */}
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors group">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                Skill Health Score
                <CustomTooltip content="Weighted average of all skill proficiency levels, practice frequency, and evidence quality">
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:border-primary cursor-help">
                    ?
                  </div>
                </CustomTooltip>
              </h3>
              <p className="text-sm text-muted-foreground">
                Overall competency trajectory
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                <AnimatedNumber value={92} duration={1500} />
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 justify-end">
                <TrendingUp className="w-4 h-4" />
                +10 pts
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={skillHealthData}>
              <defs>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
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
                stroke="var(--muted-foreground)"
                fontSize={12}
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
                dataKey="score"
                stroke="var(--chart-1)"
                strokeWidth={3}
                fill="url(#healthGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Radar */}
        <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors group">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Skill Balance</h3>
              <p className="text-sm text-muted-foreground">
                Current vs Target
              </p>
            </div>
            <ProgressRing progress={76} size={60} strokeWidth={6}>
              <div className="text-xs font-bold">76%</div>
            </ProgressRing>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={skillRadarData}>
              <PolarGrid stroke="var(--border)" strokeWidth={0.5} />
              <PolarAngleAxis
                dataKey="skill"
                stroke="var(--foreground)"
                fontSize={11}
                tickSize={8}
              />
              {/* Radius axis labels hidden — values visible on hover tooltip */}
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                stroke="transparent"
                tick={false}
                tickCount={5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: 12,
                }}
                formatter={(value: any, name: string) => [`${value}%`, name]}
              />
              <Radar
                key="target-radar"
                name="Target"
                dataKey="target"
                stroke="var(--chart-2)"
                fill="var(--chart-2)"
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
              <Radar
                key="current-radar"
                name="Current"
                dataKey="current"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.3}
                strokeWidth={2.5}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-1)' }}></div>
              <span className="text-muted-foreground">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-2)' }}></div>
              <span className="text-muted-foreground">Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* (Alerts & Deadlines moved above) */}

      {/* Skill Health Snapshot */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Skill Health Snapshot
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">All tracked skills — colour shows decay status</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>Active</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>At Risk</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span>Decaying</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: 'JavaScript', level: 88, lastDays: 2,  status: 'active'  as const },
            { name: 'React',      level: 85, lastDays: 3,  status: 'active'  as const },
            { name: 'TypeScript', level: 80, lastDays: 1,  status: 'active'  as const },
            { name: 'Node.js',    level: 75, lastDays: 11, status: 'at-risk' as const },
            { name: 'Python',     level: 62, lastDays: 18, status: 'decaying' as const },
            { name: 'Docker',     level: 58, lastDays: 24, status: 'decaying' as const },
          ].map((skill) => (
            <SkillSnapshotRow key={skill.name} {...skill} />
          ))}
        </div>
      </div>

    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-accent text-muted-foreground">
          <Icon className="w-4 h-4" />
        </div>
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
        )}
      </div>
      <div className="text-2xl font-bold mb-0.5">{value}</div>
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{change}</div>
    </div>
  );
}

function AlertItem({ title, description, severity, cta }: any) {
  const colors = {
    warning: 'border-orange-500/40 bg-orange-500/15 dark:bg-orange-500/20',
    error:   'border-red-500/40 bg-red-500/15 dark:bg-red-500/20',
    info:    'border-blue-500/40 bg-blue-500/15 dark:bg-blue-500/20',
  };
  const icons = {
    warning: '⚠️',
    error:   '🔴',
    info:    '🔵',
  };
  const ctaColors = {
    warning: 'text-orange-600 dark:text-orange-400 hover:bg-orange-500/10',
    error:   'text-red-600 dark:text-red-400 hover:bg-red-500/10',
    info:    'text-blue-600 dark:text-blue-400 hover:bg-blue-500/10',
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[severity as keyof typeof colors]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="font-medium text-sm mb-0.5 flex items-center gap-1.5">
            <span className="text-base leading-none">{icons[severity as keyof typeof icons]}</span>
            {title}
          </div>
          <div className="text-xs text-muted-foreground pl-6">{description}</div>
        </div>
        {cta && (
          <button className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${ctaColors[severity as keyof typeof ctaColors]}`}>
            {cta}
          </button>
        )}
      </div>
    </div>
  );
}

function DeadlineItem({ title, date, type, priority }: any) {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-blue-500',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[priority as keyof typeof priorityColors]}`} />
      <div className="flex-1">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
      <div className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border">
        {type}
      </div>
    </div>
  );
}

function ActivityItem({ action, time, type }: any) {
  const typeIcons = {
    certification: Award,
    evidence: ArrowUpRight,
    skill: Target,
    internship: Briefcase,
  };

  const Icon = typeIcons[type as keyof typeof typeIcons];

  return (
    <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <Icon className="w-4 h-4 mb-2 text-muted-foreground" />
      <div className="text-xs font-medium mb-1 line-clamp-2">{action}</div>
      <div className="text-[10px] text-muted-foreground">{time}</div>
    </div>
  );
}

function SkillSnapshotRow({
  name,
  level,
  lastDays,
  status,
}: {
  name: string;
  level: number;
  lastDays: number;
  status: 'active' | 'at-risk' | 'decaying';
}) {
  const barColor = {
    active:   'bg-emerald-500',
    'at-risk': 'bg-amber-500',
    decaying:  'bg-red-500',
  }[status];

  const dotColor = {
    active:   'bg-emerald-500',
    'at-risk': 'bg-amber-500',
    decaying:  'bg-red-500',
  }[status];

  const lastPracticedColor = {
    active:   'text-emerald-600 dark:text-emerald-400',
    'at-risk': 'text-amber-600 dark:text-amber-400',
    decaying:  'text-red-600 dark:text-red-400',
  }[status];

  return (
    <div className="flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor} ${
        status === 'decaying' ? 'animate-pulse' : ''
      }`} />
      <span className="w-24 text-sm font-medium truncate flex-shrink-0">{name}</span>
      <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="w-8 text-xs font-semibold text-right flex-shrink-0">{level}%</span>
      <span className={`w-28 text-xs text-right flex-shrink-0 ${lastPracticedColor}`}>
        {lastDays === 0 ? 'Today' : lastDays === 1 ? 'Yesterday' : `${lastDays}d ago`}
      </span>
    </div>
  );
}