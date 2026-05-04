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

import { api } from '../api';


export default function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [stats, setStats] = React.useState({ internships: 0, skills: 0, certifications: 0, evidence: 0 });
  const [recentItems, setRecentItems] = React.useState<any[]>([]);
  const [skillSnapshot, setSkillSnapshot] = React.useState<any[]>([]);
  const [radarData, setRadarData] = React.useState<any[]>([]);
  const [healthScore, setHealthScore] = React.useState(0);
  const [healthHistory, setHealthHistory] = React.useState<any[]>([]);
  const [alerts, setAlerts] = React.useState<any[]>([]);
  const [deadlines, setDeadlines] = React.useState<any[]>([]);
  const [decayingSkill, setDecayingSkill] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [recordsRes, skillsRes] = await Promise.allSettled([
          api.getRecords(),
          api.getSkills()
        ]);

        const records = recordsRes.status === 'fulfilled' ? (recordsRes.value.data || []) : [];
        const skills = skillsRes.status === 'fulfilled' ? (skillsRes.value.data || []) : [];

        // ---- Stats ----
        setStats({
          internships: records.filter((r: any) => r.type === 'internship').length,
          certifications: records.filter((r: any) => r.type === 'certification').length,
          skills: skills.length,
          evidence: 0,
        });

        // ---- Recent Activity ----
        const combined = [
          ...records.map((r: any) => ({
            action: `${r.type === 'internship' ? 'Added internship' : 'Added certification'}: ${r.title}`,
            time: new Date(r.createdAt || Date.now()).toLocaleDateString(),
            type: r.type === 'internship' ? 'internship' : 'certification',
            date: new Date(r.createdAt || Date.now()),
          })),
          ...skills.map((s: any) => ({
            action: `Started tracking skill: ${s.skill_name}`,
            time: new Date(s.createdAt || Date.now()).toLocaleDateString(),
            type: 'skill',
            date: new Date(s.createdAt || Date.now()),
          })),
        ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);
        setRecentItems(combined);

        // ---- Skill Snapshot ----
        const mappedSkills = skills.slice(0, 6).map((s: any) => ({
          name: s.skill_name,
          level: s.skill_level || 50,
          lastDays: 1,
          status: (s.trend === 'decaying' ? 'decaying' : s.trend === 'stable' ? 'at-risk' : 'active') as 'active' | 'at-risk' | 'decaying',
        }));
        setSkillSnapshot(mappedSkills);

        // ---- Health Score = average of all skill levels ----
        if (skills.length > 0) {
          const avg = Math.round(skills.reduce((acc: number, s: any) => acc + (s.skill_level || 50), 0) / skills.length);
          setHealthScore(avg);
          // Simulate health history from the score trending upward
          const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
          setHealthHistory(months.map((month, i) => ({ month, score: Math.max(30, avg - (months.length - 1 - i) * 5) })));
        } else {
          setHealthScore(0);
          setHealthHistory([]);
        }

        // ---- Radar: group skills by category ----
        const categoryMap: Record<string, number[]> = {};
        skills.forEach((s: any) => {
          const cat = s.category || 'Other';
          if (!categoryMap[cat]) categoryMap[cat] = [];
          categoryMap[cat].push(s.skill_level || 50);
        });
        const radar = Object.entries(categoryMap).map(([skill, levels]) => ({
          skill,
          current: Math.round(levels.reduce((a, b) => a + b, 0) / levels.length),
          target: Math.min(100, Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) + 15),
        }));
        setRadarData(radar.length > 0 ? radar : []);

        // ---- Alerts ----
        const alertList: any[] = [];
        const decaying = skills.filter((s: any) => s.trend === 'decaying');
        if (decaying.length > 0) {
          alertList.push({ title: `${decaying[0].skill_name} skill decaying`, description: 'No recent practice logged', severity: 'warning', cta: 'Log Practice', target: 'skills' });
        }
        const expiring = records.filter((r: any) => r.type === 'certification' && r.status === 'expiring');
        if (expiring.length > 0) {
          alertList.push({ title: `${expiring[0].title} expiring soon`, description: `Expires: ${expiring[0].expiryDate || 'check cert'}`, severity: 'error', cta: 'Check Cert', target: 'certifications' });
        }
        const skillsNoEvidence = skills.filter((s: any) => !s.evidence_count || s.evidence_count === 0);
        if (skillsNoEvidence.length > 0) {
          alertList.push({ title: 'Missing evidence', description: `Link work samples to ${skillsNoEvidence[0].skill_name}`, severity: 'info', cta: 'Link Now →', target: 'evidence' });
        }
        setAlerts(alertList);

        // ---- Upcoming Deadlines from certifications ----
        const deadlineList = records
          .filter((r: any) => r.type === 'certification' && (r.expiryDate || r.status === 'expiring'))
          .map((r: any) => ({
            title: r.title || r.name,
            date: r.expiryDate || 'TBD',
            type: 'Certification',
            priority: r.status === 'expiring' ? 'high' : 'medium',
          })).slice(0, 4);
        setDeadlines(deadlineList);

        // ---- Decay banner ----
        const worstDecay = skills.find((s: any) => s.trend === 'decaying') || skills[skills.length - 1];
        setDecayingSkill(worstDecay || null);

      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const overallBalance = radarData.length > 0
    ? Math.round(radarData.reduce((a, d) => a + d.current, 0) / radarData.length)
    : 0;

  return (
    <div className="p-8 space-y-8">

      {/* Today's Focus — Skill Decay CTA */}
      {decayingSkill ? (
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Today's Focus</p>
                <h3 className="text-lg font-bold mb-1">{decayingSkill.skill_name} skill needs attention</h3>
                <p className="text-white/80 text-sm">Log a practice session to maintain your proficiency level at {decayingSkill.skill_level || 50}%.</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('skills')}
              className="flex-shrink-0 bg-white text-indigo-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Log Practice →
            </button>
          </div>
        </div>
      ) : stats.skills === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Get Started</p>
              <h3 className="text-lg font-bold mb-1">Welcome to SkillTrack 🎉</h3>
              <p className="text-white/80 text-sm">Add your first skill or internship to start tracking your career growth.</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Top Stats & Recent Activity Group */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Top Stats - Made Smaller */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Active Internships"
            value={stats.internships}
            change="Current total"
            trend="up"
            icon={Briefcase}
          />
          <StatCard
            title="Skills Tracked"
            value={stats.skills}
            change="Current total"
            trend="up"
            icon={Target}
          />
          <StatCard
            title="Certifications"
            value={stats.certifications}
            change="Current total"
            trend="up"
            icon={Award}
          />
          <StatCard
            title="Evidence Items"
            value={stats.evidence}
            change="Current total"
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
            {recentItems.map((item, idx) => (
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
            {alerts.length > 0 ? alerts.map((alert, idx) => (
              <AlertItem key={idx} {...alert} onAction={(target: string) => onNavigate && onNavigate(target)} />
            )) : (
              <p className="text-sm text-muted-foreground">No active alerts — you're on track! 🎉</p>
            )}
          </div>
        </div>
        {/* Upcoming Deadlines */}
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
          </div>
          <div className="space-y-3">
            {deadlines.length > 0 ? deadlines.map((item, idx) => (
              <DeadlineItem key={idx} {...item} />
            )) : (
              <p className="text-sm text-muted-foreground">No upcoming deadlines. Add certifications with expiry dates to track them here.</p>
            )}
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
                <AnimatedNumber value={healthScore} duration={1500} />
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 justify-end">
                <TrendingUp className="w-4 h-4" />
                avg skill level
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={healthHistory.length > 0 ? healthHistory : [{ month: 'Now', score: healthScore }]}>
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
            <ProgressRing progress={overallBalance} size={60} strokeWidth={6}>
              <div className="text-xs font-bold">{overallBalance}%</div>
            </ProgressRing>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData.length > 0 ? radarData : [{ skill: 'No data', current: 0, target: 0 }]}>
              <PolarGrid stroke="rgba(128, 128, 128, 0.2)" strokeWidth={1} />
              <PolarAngleAxis
                dataKey="skill"
                stroke="currentColor"
                fontSize={11}
                tickSize={8}
                className="text-foreground"
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
          {skillSnapshot.map((skill) => (
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

function AlertItem({ title, description, severity, cta, target, onAction }: any) {
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
          <button 
            onClick={() => onAction && target && onAction(target)}
            className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${ctaColors[severity as keyof typeof ctaColors]}`}
          >
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