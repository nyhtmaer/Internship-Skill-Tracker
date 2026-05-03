import React, { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Code,
  Award,
  Briefcase,
  Calendar,
  Tag,
  Search,
  Filter,
  Download,
  ExternalLink,
  Star
} from 'lucide-react';

const evidenceItems = [
  {
    id: 1,
    title: 'E-commerce Dashboard React App',
    type: 'project',
    format: 'code',
    date: 'Feb 5, 2026',
    tags: ['React', 'TypeScript', 'Tailwind'],
    linkedTo: ['React', 'TypeScript', 'UI/UX'],
    description: 'Full-featured admin dashboard with real-time analytics',
    url: 'https://github.com/user/ecommerce-dashboard',
    featured: true,
    impact: 'high',
  },
  {
    id: 2,
    title: 'Meta Internship Offer Letter',
    type: 'document',
    format: 'pdf',
    date: 'Jan 10, 2026',
    tags: ['Internship', 'Meta'],
    linkedTo: ['React', 'Frontend'],
    description: 'Official offer letter for Frontend Engineering Intern position',
    featured: true,
    impact: 'high',
  },
  {
    id: 3,
    title: 'AWS Cloud Practitioner Certificate',
    type: 'certification',
    format: 'pdf',
    date: 'Jan 15, 2026',
    tags: ['AWS', 'Cloud', 'DevOps'],
    linkedTo: ['AWS', 'Cloud Computing', 'DevOps'],
    description: 'AWS Certified Cloud Practitioner credential',
    url: 'https://aws.amazon.com/verify/12345',
    featured: false,
    impact: 'high',
  },
  {
    id: 4,
    title: 'Payment Integration Demo Video',
    type: 'media',
    format: 'video',
    date: 'Dec 20, 2025',
    tags: ['Stripe', 'Node.js', 'API'],
    linkedTo: ['Node.js', 'API Development'],
    description: 'Walkthrough of custom payment SDK implementation',
    featured: false,
    impact: 'medium',
  },
  {
    id: 5,
    title: 'Open Source Contribution - React',
    type: 'project',
    format: 'link',
    date: 'Nov 28, 2025',
    tags: ['React', 'Open Source', 'TypeScript'],
    linkedTo: ['React', 'TypeScript', 'Open Source'],
    description: 'PR merged to React core library for performance optimization',
    url: 'https://github.com/facebook/react/pull/12345',
    featured: true,
    impact: 'high',
  },
  {
    id: 6,
    title: 'Hackathon Winner Certificate',
    type: 'achievement',
    format: 'pdf',
    date: 'Oct 15, 2025',
    tags: ['Hackathon', 'AI', 'Full Stack'],
    linkedTo: ['React', 'Node.js', 'AI/ML'],
    description: '1st place at TechCrunch Disrupt Hackathon',
    featured: true,
    impact: 'high',
  },
  {
    id: 7,
    title: 'Database Migration Tool Code',
    type: 'project',
    format: 'code',
    date: 'Sep 30, 2025',
    tags: ['PostgreSQL', 'Python', 'DevOps'],
    linkedTo: ['PostgreSQL', 'Python'],
    description: 'Automated database migration and backup utility',
    url: 'https://github.com/user/db-migration-tool',
    featured: false,
    impact: 'medium',
  },
  {
    id: 8,
    title: 'UI Design Portfolio Screenshots',
    type: 'media',
    format: 'image',
    date: 'Aug 22, 2025',
    tags: ['Design', 'Figma', 'UI/UX'],
    linkedTo: ['UI/UX', 'Design'],
    description: 'Collection of UI designs for mobile and web apps',
    featured: false,
    impact: 'medium',
  },
  {
    id: 9,
    title: 'Conference Talk - Modern React Patterns',
    type: 'media',
    format: 'video',
    date: 'Jul 10, 2025',
    tags: ['React', 'Public Speaking'],
    linkedTo: ['React', 'Communication'],
    description: 'Presented at ReactConf 2025',
    url: 'https://youtube.com/watch?v=abc123',
    featured: true,
    impact: 'high',
  },
  {
    id: 10,
    title: 'Recommendation Letter - Stripe Manager',
    type: 'document',
    format: 'pdf',
    date: 'Dec 28, 2025',
    tags: ['Internship', 'Stripe', 'Recommendation'],
    linkedTo: ['Node.js', 'Full Stack'],
    description: 'Letter of recommendation from engineering manager',
    featured: false,
    impact: 'high',
  },
];

const typeIcons = {
  project: Code,
  document: FileText,
  certification: Award,
  media: Image,
  achievement: Star,
};

const formatIcons = {
  code: Code,
  pdf: FileText,
  video: Video,
  image: Image,
  link: LinkIcon,
};

export default function EvidenceVault() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localEvidenceItems, setLocalEvidenceItems] = useState(evidenceItems);

  const handleToggleStar = (id: number) => {
    setLocalEvidenceItems(prev => prev.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
  };

  const filteredItems = localEvidenceItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: localEvidenceItems.length,
    projects: localEvidenceItems.filter(i => i.type === 'project').length,
    documents: localEvidenceItems.filter(i => i.type === 'document').length,
    certifications: localEvidenceItems.filter(i => i.type === 'certification').length,
    media: localEvidenceItems.filter(i => i.type === 'media').length,
    achievements: localEvidenceItems.filter(i => i.type === 'achievement').length,
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Evidence Vault</h2>
          <p className="text-muted-foreground">
            Centralized repository of your work, achievements, and credentials
          </p>
        </div>
        
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          + Upload Evidence
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Total Items" value={stats.total} icon={FileText} />
        <StatCard label="Projects" value={stats.projects} icon={Code} />
        <StatCard label="Documents" value={stats.documents} icon={FileText} />
        <StatCard label="Certifications" value={stats.certifications} icon={Award} />
        <StatCard label="Media" value={stats.media} icon={Image} />
      </div>

      {/* Featured Items */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
          <h3 className="text-lg font-semibold">Featured Evidence</h3>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          {localEvidenceItems.filter(item => item.featured).map((item) => (
            <div key={item.id} className="min-w-[340px] flex-shrink-0">
              <FeaturedCard item={item} onToggleStar={handleToggleStar} />
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter (Moved below Featured) */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search evidence by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1 flex-wrap">
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
            label="All"
          />
          <FilterButton 
            active={filter === 'project'} 
            onClick={() => setFilter('project')}
            label="Projects"
          />
          <FilterButton 
            active={filter === 'document'} 
            onClick={() => setFilter('document')}
            label="Documents"
          />
          <FilterButton 
            active={filter === 'certification'} 
            onClick={() => setFilter('certification')}
            label="Certs"
          />
          <FilterButton 
            active={filter === 'media'} 
            onClick={() => setFilter('media')}
            label="Media"
          />
          <FilterButton 
            active={filter === 'achievement'} 
            onClick={() => setFilter('achievement')}
            label="Achievements"
          />
        </div>
      </div>

      {/* All Evidence */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All Evidence ({filteredItems.length})</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <EvidenceCard key={item.id} item={item} onToggleStar={handleToggleStar} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <Icon className="w-8 h-8 p-1.5 rounded-lg bg-accent text-muted-foreground mb-3" />
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${active 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground'
        }
      `}
    >
      {label}
    </button>
  );
}

function FeaturedCard({ item, onToggleStar }: any) {
  const TypeIcon = typeIcons[item.type as keyof typeof typeIcons];
  const FormatIcon = formatIcons[item.format as keyof typeof formatIcons];

  return (
    <div className="bg-gradient-to-br from-chart-1/10 to-chart-2/10 border-2 border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-6 h-6 text-primary" />
        </div>
        <button 
          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
          onClick={() => onToggleStar && onToggleStar(item.id)}
        >
          <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
        </button>
      </div>

      <h4 className="font-semibold mb-2">{item.title}</h4>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {item.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3.5 h-3.5" />
        {item.date}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {item.linkedTo.slice(0, 3).map((skill: string) => (
          <span
            key={skill}
            className="px-2 py-1 text-xs font-medium rounded-md bg-accent text-accent-foreground"
          >
            {skill}
          </span>
        ))}
        {item.linkedTo.length > 3 && (
          <span className="px-2 py-1 text-xs font-medium text-muted-foreground">
            +{item.linkedTo.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

function EvidenceCard({ item, onToggleStar }: any) {
  const isStarred = item.featured;
  const TypeIcon = typeIcons[item.type as keyof typeof typeIcons];
  const FormatIcon = formatIcons[item.format as keyof typeof formatIcons];

  const impactColors = {
    high: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    medium: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    low: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
          <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
            <TypeIcon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground w-full text-center overflow-hidden text-ellipsis">
            {item.type}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold">{item.title}</h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`px-2 py-0.5 mr-2 text-xs font-medium rounded-md border ${impactColors[item.impact as keyof typeof impactColors]}`}>
                {item.impact}
              </span>
              <button
                className={`p-1.5 hover:bg-accent rounded-md transition-colors ${isStarred ? 'text-orange-500' : 'text-muted-foreground'}`}
                title={isStarred ? "Remove from featured" : "Feature this evidence"}
                onClick={(e) => { e.stopPropagation(); if(onToggleStar) onToggleStar(item.id); }}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-orange-500' : ''}`} />
              </button>
              {item.url && (
                <button
                  className="p-1.5 hover:bg-accent rounded-md transition-colors text-muted-foreground"
                  title="Open link"
                  onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
            {item.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <FormatIcon className="w-3.5 h-3.5" />
              {item.format.toUpperCase()}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {item.linkedTo.length} skills
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-md bg-accent text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
