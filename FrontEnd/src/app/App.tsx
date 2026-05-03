import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toaster } from 'sonner';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
import Dashboard from './components/Dashboard';
import Internships from './components/Internships';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import EvidenceVault from './components/EvidenceVault';
import Analytics from './components/Analytics';
import Export from './components/Export';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';

type Page = 'dashboard' | 'internships' | 'skills' | 'certifications' | 'evidence' | 'analytics' | 'export';

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  internships: 'Internships',
  skills: 'Skills',
  certifications: 'Certifications',
  evidence: 'Evidence Vault',
  analytics: 'Analytics',
  export: 'Export Portfolio',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Apply dark class to <html> so SVG/Recharts CSS vars inherit correctly
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your analytics and overview',
      category: 'Navigation',
      action: () => setCurrentPage('dashboard'),
    },
    {
      id: 'nav-internships',
      title: 'Go to Internships',
      subtitle: 'Manage your work experiences',
      category: 'Navigation',
      action: () => setCurrentPage('internships'),
    },
    {
      id: 'nav-skills',
      title: 'Go to Skills',
      subtitle: 'Track your skill development',
      category: 'Navigation',
      action: () => setCurrentPage('skills'),
    },
    {
      id: 'nav-certifications',
      title: 'Go to Certifications',
      subtitle: 'View your credentials',
      category: 'Navigation',
      action: () => setCurrentPage('certifications'),
    },
    {
      id: 'nav-evidence',
      title: 'Go to Evidence Vault',
      subtitle: 'Browse your portfolio items',
      category: 'Navigation',
      action: () => setCurrentPage('evidence'),
    },
    {
      id: 'nav-analytics',
      title: 'Go to Analytics',
      subtitle: 'Deep dive into your data',
      category: 'Navigation',
      action: () => setCurrentPage('analytics'),
    },
    {
      id: 'nav-export',
      title: 'Go to Export',
      subtitle: 'Generate shareable reports',
      category: 'Navigation',
      action: () => setCurrentPage('export'),
    },
    {
      id: 'theme-toggle',
      title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Change color theme',
      category: 'Settings',
      action: toggleTheme,
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'internships':
        return <Internships />;
      case 'skills':
        return <Skills />;
      case 'certifications':
        return <Certifications />;
      case 'evidence':
        return <EvidenceVault />;
      case 'analytics':
        return <Analytics />;
      case 'export':
        return <Export />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          
          <div className="flex-1 flex flex-col">
            <header className="border-b border-border bg-card sticky top-0 z-10">
              <div className="flex items-center justify-between px-8 py-4">
                <div>
                  {currentPage === 'dashboard' ? (
                    <>
                      <h1 className="text-2xl font-semibold tracking-tight">
                        {getGreeting()}, Maya 👋
                      </h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Here's your career snapshot for today
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl font-semibold tracking-tight">{PAGE_TITLES[currentPage]}</h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Track your growth, measure your impact
                      </p>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm"
                  >
                    <span className="text-muted-foreground">Quick actions</span>
                    <kbd className="px-1.5 py-0.5 text-xs rounded bg-background border border-border font-mono">
                      ⌘K
                    </kbd>
                  </button>
                  
                  <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-lg hover:bg-accent transition-colors"
                    aria-label="Toggle theme"
                  >
                    {isDark ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-auto">
              <div key={currentPage} className="page-enter">
                {renderPage()}
              </div>
            </main>
          </div>
        </div>

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          commands={commands}
        />
        <Toaster
          theme={isDark ? 'dark' : 'light'}
          position="bottom-right"
          richColors
        />
      </div>
    </div>
  );
}