import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Target,
  Award,
  Archive,
  BarChart3,
  Share2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

type Page = 'dashboard' | 'internships' | 'skills' | 'certifications' | 'evidence' | 'analytics' | 'export';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const [badges, setBadges] = useState({ skills: 0, certifications: 0, evidence: 0, decayingSkills: 0, expiringCerts: 0 });

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const [skillsRes, recordsRes, evidenceRes] = await Promise.allSettled([
          api.getSkills(),
          api.getRecords(),
          api.getEvidence(),
        ]);

        const skills = skillsRes.status === 'fulfilled' ? (skillsRes.value.data || []) : [];
        const records = recordsRes.status === 'fulfilled' ? (recordsRes.value.data || []) : [];
        const evidence = evidenceRes.status === 'fulfilled' ? (evidenceRes.value.data || []) : [];

        const decayingSkills = skills.filter((s: any) => s.trend === 'decaying').length;
        const expiringCerts = records.filter((r: any) => r.type === 'certification' && r.status === 'expiring').length;

        setBadges({
          skills: skills.length,
          certifications: records.filter((r: any) => r.type === 'certification').length,
          evidence: evidence.length,
          decayingSkills,
          expiringCerts,
        });
      } catch (e) {
        // silently fail — badges just won't show
      }
    };
    loadBadges();
  }, []);

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'internships' as Page, label: 'Internships', icon: Briefcase, badge: null },
    {
      id: 'skills' as Page,
      label: 'Skills',
      icon: Target,
      badge: badges.decayingSkills > 0
        ? { count: `${badges.decayingSkills}↓`, color: 'bg-red-500/15 text-red-500 dark:text-red-400' }
        : null,
    },
    {
      id: 'certifications' as Page,
      label: 'Certifications',
      icon: Award,
      badge: badges.expiringCerts > 0
        ? { count: `${badges.expiringCerts}⚠`, color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' }
        : null,
    },
    {
      id: 'evidence' as Page,
      label: 'Evidence Vault',
      icon: Archive,
      badge: badges.evidence > 0
        ? { count: `${badges.evidence}`, color: 'bg-accent text-muted-foreground' }
        : null,
    },
    { id: 'analytics' as Page, label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'export' as Page, label: 'Export', icon: Share2, badge: null },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col sticky top-0 h-screen overflow-y-auto flex-shrink-0">

      {/* Brand + User Profile */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Target className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm leading-tight">SkillTrack</h2>
            <p className="text-xs text-muted-foreground">Career OS</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl bg-accent/70 border border-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm uppercase">
              {user?.name ? user.name.substring(0, 2) : 'U'}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors" title="Logout">
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                    transition-all duration-150 text-sm
                    ${isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-foreground font-medium hover:bg-accent'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md leading-none ${
                      isActive
                        ? 'bg-white/20 text-primary-foreground'
                        : item.badge.color
                    }`}>
                      {item.badge.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pro Tips — rotating */}
      <div className="p-3 border-t border-border">
        <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl p-3">
          <p className="text-xs font-semibold mb-1 text-violet-600 dark:text-violet-400">💡 Pro Tip</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {[
              'Link evidence to skills to track authentic growth and prevent skill decay.',
              'Upload your resume on the Onboarding page to auto-extract skills and internships.',
              'Skills without practice for 14+ days start to decay — log practice regularly!',
              'Add certifications to make your portfolio stand out to recruiters.',
            ][new Date().getDate() % 4]}
          </p>
        </div>
      </div>

    </aside>
  );
}
