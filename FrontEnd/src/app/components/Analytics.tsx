import React from 'react';
import {
  TrendingUp,
  Target,
  Award,
  Briefcase,
  Calendar,
  Zap,
  Activity,
  AlertCircle
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
import { api } from '../api';

export default function Analytics() {
  const [data, setData] = React.useState<any>(null);
  const [rawSkills, setRawSkills] = React.useState<any[]>([]);
  const [rawRecords, setRawRecords] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch everything in parallel — analytics endpoint + raw data for client-side enrichment
        const [analyticsRes, skillsRes, recordsRes] = await Promise.allSettled([
          api.getAnalytics(),
          api.getSkills(),
          api.getRecords(),
        ]);

        const analyticsData = analyticsRes.status === 'fulfilled' ? analyticsRes.value.data : null;
        const skills = skillsRes.status === 'fulfilled' ? (skillsRes.value.data || []) : [];
        const records = recordsRes.status === 'fulfilled' ? (recordsRes.value.data || []) : [];

        setRawSkills(skills);
        setRawRecords(records);

        if (analyticsData) {
          // Enrich the analytics data with real counts
          const internships = records.filter((r: any) => r.type === 'internship');
          const certifications = records.filter((r: any) => r.type === 'certification');

          // Build real growth timeline from createdAt dates
          const monthBuckets: Record<string, { skills: number; internships: number; certs: number }> = {};
          const addToMonth = (date: string, type: 'skills' | 'internships' | 'certs') => {
            const d = new Date(date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (!monthBuckets[key]) monthBuckets[key] = { skills: 0, internships: 0, certs: 0 };
            monthBuckets[key][type]++;
          };

          skills.forEach((s: any) => s.createdAt && addToMonth(s.createdAt, 'skills'));
          internships.forEach((r: any) => r.createdAt && addToMonth(r.createdAt, 'internships'));
          certifications.forEach((r: any) => r.createdAt && addToMonth(r.createdAt, 'certs'));

          // Build cumulative timeline
          let cumSkills = 0, cumInternships = 0, cumCerts = 0;
          const overallGrowth = Object.entries(monthBuckets)
            .sort((a, b) => new Date(`01 ${a[0]}`).getTime() - new Date(`01 ${b[0]}`).getTime())
            .map(([month, counts]) => {
              cumSkills += counts.skills;
              cumInternships += counts.internships;
              cumCerts += counts.certs;
              return { month, skills: cumSkills, internships: cumInternships, certs: cumCerts };
            });

          // Ensure we have at least 2 points for the chart to draw lines
          if (overallGrowth.length <= 1) {
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthKey = lastMonth.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            overallGrowth.unshift({
              month: lastMonthKey,
              skills: 0,
              internships: 0,
              certs: 0,
            });
            if (overallGrowth.length === 1) {
               overallGrowth.push({
                 month: 'Now',
                 skills: skills.length,
                 internships: internships.length,
                 certs: certifications.length,
               });
            }
          }

          // Skill velocity — group skills by week of creation
          const weekBuckets: Record<string, number> = {};
          skills.forEach((s: any) => {
            if (s.createdAt) {
              const d = new Date(s.createdAt);
              const weekNum = Math.ceil(d.getDate() / 7);
              const key = `W${weekNum} ${d.toLocaleDateString('en-US', { month: 'short' })}`;
              weekBuckets[key] = (weekBuckets[key] || 0) + 1;
            }
          });
          const skillVelocity = Object.entries(weekBuckets).map(([week, velocity]) => ({ week, velocity }));
          
          if (skillVelocity.length === 0) {
             skillVelocity.push({ week: 'Current', velocity: skills.length });
          }

          setData({
            ...analyticsData,
            overallGrowth: overallGrowth,
            skillVelocity: skillVelocity,
            // Real computed stats
            totalSkills: skills.length,
            totalInternships: internships.length,
            totalCerts: certifications.length,
            avgSkillLevel: skills.length > 0
              ? Math.round(skills.reduce((a: number, s: any) => a + (s.skill_level || 0), 0) / skills.length)
              : 0,
          });
        } else {
          // API failed — build everything client-side
          buildClientSideData(skills, records);
        }
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    const buildClientSideData = (skills: any[], records: any[]) => {
      const internships = records.filter((r: any) => r.type === 'internship');
      const certifications = records.filter((r: any) => r.type === 'certification');
      const avgLevel = skills.length > 0
        ? Math.round(skills.reduce((a, s) => a + (s.skill_level || 0), 0) / skills.length)
        : 0;

      const catMap: Record<string, { count: number; sum: number }> = {};
      skills.forEach(s => {
        const cat = s.category || 'Other';
        if (!catMap[cat]) catMap[cat] = { count: 0, sum: 0 };
        catMap[cat].count++;
        catMap[cat].sum += s.skill_level || 0;
      });

      setData({
        totalSkills: skills.length,
        totalInternships: internships.length,
        totalCerts: certifications.length,
        avgSkillLevel: avgLevel,
        categoryDistribution: Object.entries(catMap).map(([category, v]) => ({
          category,
          count: v.count,
          avgLevel: Math.round(v.sum / v.count),
        })),
        skillHealthMatrix: skills.slice(0, 8).map(s => ({
          skill: s.skill_name,
          health: s.skill_level || 0,
          practice: 70,
          evidence: 30,
        })),
        internshipImpact: internships.map(i => ({
          name: i.organization,
          duration: 3,
          skillsGained: i.projects?.length || 0,
          avgGrowth: 25,
        })),
        overallGrowth: [{ month: 'Now', skills: skills.length, internships: internships.length, certs: certifications.length }],
        skillVelocity: [],
      });
    };

    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold mb-2">No analytics data yet</h3>
        <p className="text-sm text-muted-foreground">Add skills, internships, and certifications to see your career analytics.</p>
      </div>
    );
  }

  const {
    overallGrowth = [],
    skillVelocity = [],
    skillHealthMatrix = [],
    categoryDistribution = [],
    internshipImpact = [],
    totalSkills = 0,
    totalInternships = 0,
    totalCerts = 0,
    avgSkillLevel = 0,
  } = data;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-semibold mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Deep insights into your career trajectory and skill development
        </p>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-br from-chart-1/10 to-chart-2/10 border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Key Insights
        </h3>

        <div className="grid grid-cols-4 gap-4">
          <InsightCard
            icon={Target}
            label="Skills Tracked"
            value={totalSkills}
            color="text-blue-600 dark:text-blue-400"
            bg="bg-blue-500/10"
          />
          <InsightCard
            icon={Briefcase}
            label="Internships"
            value={totalInternships}
            color="text-violet-600 dark:text-violet-400"
            bg="bg-violet-500/10"
          />
          <InsightCard
            icon={Award}
            label="Certifications"
            value={totalCerts}
            color="text-green-600 dark:text-green-400"
            bg="bg-green-500/10"
          />
          <InsightCard
            icon={Zap}
            label="Avg Skill Level"
            value={`${avgSkillLevel}%`}
            color="text-orange-600 dark:text-orange-400"
            bg="bg-orange-500/10"
          />
        </div>
      </div>

      {/* Growth Timeline */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Career Growth Timeline
        </h3>
        {overallGrowth.length > 1 ? (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={overallGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="skills" name="Skills" fill="var(--chart-1)" opacity={0.8} radius={[4, 4, 0, 0]} />
              <Bar dataKey="internships" name="Internships" fill="var(--chart-2)" opacity={0.8} radius={[4, 4, 0, 0]} />
              <Bar dataKey="certs" name="Certifications" fill="var(--chart-3)" opacity={0.8} radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            Add more data over time to see your growth timeline here.
          </div>
        )}
      </div>

      {/* Skill Health Matrix + Category Distribution */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Skill Health Matrix</h3>
          {skillHealthMatrix.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={skillHealthMatrix} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis dataKey="skill" type="category" stroke="var(--muted-foreground)" fontSize={11} width={80} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="health" name="Skill Level" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Add skills to see health matrix.</div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Category Distribution</h3>
          {categoryDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="category" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="count" name="# Skills" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="avgLevel" name="Avg Level %" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Add skills with categories to see distribution.</div>
          )}
        </div>
      </div>

      {/* Internship Impact */}
      {internshipImpact.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Internship Impact
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {internshipImpact.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-accent/30">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.duration} month{item.duration !== 1 ? 's' : ''} · {item.skillsGained} projects</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">+{item.avgGrowth}%</div>
                  <div className="text-xs text-muted-foreground">avg growth</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Velocity */}
      {skillVelocity.length > 1 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Skill Acquisition Velocity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={skillVelocity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="velocity" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: 'var(--chart-1)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function InsightCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
