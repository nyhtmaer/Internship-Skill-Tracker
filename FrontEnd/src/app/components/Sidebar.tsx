import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Target,
  Award,
  Archive,
  BarChart3,
  Share2
} from 'lucide-react';

type Page = 'dashboard' | 'internships' | 'skills' | 'certifications' | 'evidence' | 'analytics' | 'export';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  // Static badges — will be driven by real backend data post-integration
  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard',     icon: LayoutDashboard, badge: null },
    { id: 'internships' as Page, label: 'Internships',  icon: Briefcase,       badge: null },
    { id: 'skills' as Page,      label: 'Skills',       icon: Target,          badge: { count: '2↓', color: 'bg-red-500/15 text-red-500 dark:text-red-400' } },
    { id: 'certifications' as Page, label: 'Certifications', icon: Award,      badge: { count: '1⚠', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' } },
    { id: 'evidence' as Page,    label: 'Evidence Vault', icon: Archive,       badge: { count: '47', color: 'bg-accent text-muted-foreground' } },
    { id: 'analytics' as Page,   label: 'Analytics',    icon: BarChart3,       badge: null },
    { id: 'export' as Page,      label: 'Export',       icon: Share2,          badge: null },
  ];

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
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-accent/70 border border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm">
            M
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">Maya Kumar</div>
            <div className="text-xs text-muted-foreground truncate">Software Intern</div>
          </div>
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

      {/* Pro Tip */}
      <div className="p-3 border-t border-border">
        <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl p-3">
          <p className="text-xs font-semibold mb-1 text-violet-600 dark:text-violet-400">💡 Pro Tip</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Link evidence to skills to track authentic growth and prevent skill decay
          </p>
        </div>
      </div>

    </aside>
  );
}
