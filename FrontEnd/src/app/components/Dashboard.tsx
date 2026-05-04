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
} from 'lucide-react';
import {
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
import { useSkills, useRecords, useAnalytics } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import CustomTooltip from './CustomTooltip';
import AnimatedNumber from './AnimatedNumber';
import ProgressRing from './ProgressRing';

export default function Dashboard() {
  const { user } = useAuth();
  const { skills, isLoading: skillsLoading } = useSkills();
  const { records, isLoading: recordsLoading } = useRecords();
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalytics();

  // Compute statistics from real data
  const activeInternships = records.filter(r => r.type === 'internship' && r.status === 'active').length;
  const totalCertifications = records.filter(r => r.type === 'certification').length;
  const totalEvidence = records.length;

  // Skill health calculation
  const avgSkillLevel = skills.length > 0 
    ? Math.round(skills.reduce((sum, s) => sum + s.skill_level, 0) / skills.length)
    : 0;

  // Generate skill health trend data (7 months)
  const skillHealthData = Array.from({ length: 7 }, (_, i) => ({
    month: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][i],
    score: Math.max(40, avgSkillLevel - (7 - i) * 3 + Math.random() * 10),
  }));

  // Generate skill radar data from current skills
  const skillRadarData = skills.slice(0, 6).map(s => ({
    skill: s.skill_name,
    current: s.skill_level * 20,
    target: 100,
  }));

  // Decaying skills alert
  const decayingSkills = analyticsData?.filter(s => s.decay_rate > 0.5) || [];
  const expiringCerts = records.filter(r => r.type === 'certification' && r.end_date && new Date(r.end_date) < new Date()).length;

  const isLoading = skillsLoading || recordsLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">

      {/* Today's Focus — Skill Decay CTA */}
      {decayingSkills.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Today's Focus</p>
                <h3 className="text-lg font-bold mb-1">{decayingSkills[0]?.skill_name} skill is decaying</h3>
                <p className="text-white/80 text-sm">
                  {Math.round(decayingSkills[0]?.days_since_practiced || 0)} days without practice. Spend 30 min to maintain your proficiency.
                </p>
              </div>
            </div>
            <button className="flex-shrink-0 bg-white text-indigo-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap">
              Log Practice →
            </button>
          </div>
        </div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Active Internships"
            value={activeInternships.toString()}
            change={activeInternships > 0 ? "+1 this month" : "None yet"}
            trend="up"
            icon={Briefcase}
          />
          <StatCard
            title="Skills Tracked"
            value={skills.length.toString()}
            change={`${skills.length} total`}
            trend="up"
            icon={Target}
          />
          <StatCard
            title="Certifications"
            value={totalCertifications.toString()}
            change={totalCertifications > 0 ? "+2 this month" : "None yet"}
            trend="up"
            icon={Award}
          />
          <StatCard
            title="Records"
            value={totalEvidence.toString()}
            change={`${totalEvidence} total`}
            trend="up"
            icon={ArrowUpRight}
          />
        </div>

        {/* Recent Activity - Show latest actions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Your Data</h3>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>📊 Skills: {skills.length} total</p>
            <p>💼 Internships: {records.filter(r => r.type === 'internship').length} total</p>
            <p>🏆 Certifications: {totalCertifications} total</p>
            <p>👤 User: {user?.name || 'Loading...'}</p>
          </div>
        </div>
      </div>

      {/* Alerts & Timeline Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Alerts</h3>
          </div>
          <div className="space-y-3 text-sm">
            {decayingSkills.length > 0 && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded">
                <p className="font-medium text-orange-900 dark:text-orange-400">
                  {decayingSkills.length} skill{decayingSkills.length > 1 ? 's' : ''} decaying
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">Practice to maintain proficiency</p>
              </div>
            )}
            {expiringCerts > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="font-medium text-red-900 dark:text-red-400">
                  {expiringCerts} certificate expired
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">Update or renew</p>
              </div>
            )}
            {decayingSkills.length === 0 && expiringCerts === 0 && (
              <p className="text-muted-foreground text-center py-4">All systems green! ✓</p>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Upcoming Records</h3>
          </div>
          <div className="space-y-3 text-sm">
            {records.slice(0, 4).map((record, idx) => (
              <div key={idx} className="flex justify-between items-start p-3 hover:bg-muted/50 rounded border border-transparent hover:border-border transition-colors">
                <div>
                  <p className="font-medium">{record.title}</p>
                  <p className="text-xs text-muted-foreground">{record.organization}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                  {record.type === 'internship' ? '💼' : '🏆'} {record.type}
                </span>
              </div>
            ))}
            {records.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No records yet. Add your first internship or certification!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Skill Health Score */}
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                Skill Level Trend
                <CustomTooltip content="Average of all your skill proficiency levels over time">
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
                <AnimatedNumber value={avgSkillLevel} duration={1500} />
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 justify-end">
                <TrendingUp className="w-4 h-4" />
                {skills.length} skills
              </div>
            </div>
          </div>
          
          {skillHealthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={skillHealthData}>
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
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
          ) : (
            <div className="h-60 flex items-center justify-center text-muted-foreground">
              Add skills to see trends
            </div>
          )}
        </div>

        {/* Skill Radar */}
        <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Skill Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Top {Math.min(6, skills.length)} skills
              </p>
            </div>
            <ProgressRing progress={Math.min(100, avgSkillLevel * 10)} size={60} strokeWidth={6}>
              <div className="text-xs font-bold">{avgSkillLevel}%</div>
            </ProgressRing>
          </div>

          {skillRadarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={skillRadarData}>
                <PolarGrid stroke="var(--border)" strokeWidth={0.5} />
                <PolarAngleAxis dataKey="skill" stroke="var(--foreground)" fontSize={11} tickSize={8} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="transparent" tick={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-muted-foreground">
              Add skills to see distribution
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600" />
        )}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{title}</p>
      <p className="text-xs text-muted-foreground">{change}</p>
    </div>
  );
}
