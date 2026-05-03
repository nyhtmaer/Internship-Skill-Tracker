import React, { useState } from 'react';
import {
  Download,
  FileText,
  Share2,
  Eye,
  CheckCircle2,
  Copy,
  Mail,
  Linkedin,
  Globe,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export default function Export() {
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    skills: true,
    internships: true,
    certifications: true,
    evidence: false,
    analytics: false,
  });

  const [format, setFormat] = useState<'pdf' | 'json' | 'markdown'>('pdf');
  const [template, setTemplate] = useState<'professional' | 'minimal' | 'detailed'>('professional');

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleExport = () => {
    const sectionCount = Object.values(selectedSections).filter(Boolean).length;
    const id = toast.loading(`Preparing ${format.toUpperCase()} export...`);
    setTimeout(() => {
      toast.success(`${format.toUpperCase()} exported successfully!`, {
        id,
        description: `${sectionCount} sections · ${template} template`,
      });
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://portfolio.example.com/share/abc123').then(() => {
      toast.success('Link copied to clipboard!', {
        description: 'Share this link with recruiters or colleagues.',
      });
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-semibold mb-2">Export Portfolio</h2>
        <p className="text-muted-foreground">
          Generate shareable reports of your skills, internships, and achievements
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="col-span-2 space-y-6">
          {/* Format Selection */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Export Format</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setFormat('pdf')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  format === 'pdf'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <FileText className="w-6 h-6 mb-2" />
                <div className="font-semibold mb-1">PDF</div>
                <div className="text-xs text-muted-foreground">Professional document</div>
              </button>

              <button
                onClick={() => setFormat('json')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  format === 'json'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Settings className="w-6 h-6 mb-2" />
                <div className="font-semibold mb-1">JSON</div>
                <div className="text-xs text-muted-foreground">Raw data export</div>
              </button>

              <button
                onClick={() => setFormat('markdown')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  format === 'markdown'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <FileText className="w-6 h-6 mb-2" />
                <div className="font-semibold mb-1">Markdown</div>
                <div className="text-xs text-muted-foreground">For README files</div>
              </button>
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Template Style</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTemplate('professional')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  template === 'professional'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold mb-1">Professional</div>
                <div className="text-xs text-muted-foreground">
                  Clean layout with charts and metrics
                </div>
              </button>

              <button
                onClick={() => setTemplate('minimal')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  template === 'minimal'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold mb-1">Minimal</div>
                <div className="text-xs text-muted-foreground">
                  Simple list-based format
                </div>
              </button>

              <button
                onClick={() => setTemplate('detailed')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  template === 'detailed'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold mb-1">Detailed</div>
                <div className="text-xs text-muted-foreground">
                  Comprehensive with all evidence
                </div>
              </button>
            </div>
          </div>

          {/* Sections to Include */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Sections to Include</h3>
            <div className="space-y-3">
              {Object.entries(selectedSections).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      value ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {value && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <div>
                      <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-xs text-muted-foreground">
                        {key === 'summary' && 'Overview and key metrics'}
                        {key === 'skills' && 'All tracked skills with levels'}
                        {key === 'internships' && 'Work experience and projects'}
                        {key === 'certifications' && 'Professional certifications'}
                        {key === 'evidence' && 'Linked projects and artifacts'}
                        {key === 'analytics' && 'Growth charts and insights'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleSection(key as keyof typeof selectedSections)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Actions */}
        <div className="col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Export {format.toUpperCase()}
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Share Link
              </button>

              <button
                className="w-full px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
                onClick={() => toast.info('Preview will be available after backend integration.')}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Share Directly</h3>
            <div className="space-y-3">
              <button
                className="w-full px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors flex items-center gap-3"
                onClick={() => toast.info('LinkedIn sharing will be available after backend integration.')}
              >
                <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">Share on LinkedIn</span>
              </button>

              <button
                className="w-full px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors flex items-center gap-3"
                onClick={() => toast.info('Email sharing will be available after backend integration.')}
              >
                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm">Email Portfolio</span>
              </button>

              <button
                className="w-full px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors flex items-center gap-3"
                onClick={() => toast.info('Public profile will be available after backend integration.')}
              >
                <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm">Public Profile Link</span>
              </button>
            </div>
          </div>

          {/* Export Stats */}
          <div className="bg-gradient-to-br from-chart-1/10 to-chart-2/10 border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4">Export Preview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sections</span>
                <span className="font-bold">
                  {Object.values(selectedSections).filter(Boolean).length} / {Object.keys(selectedSections).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Format</span>
                <span className="font-bold uppercase">{format}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Template</span>
                <span className="font-bold capitalize">{template}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-muted-foreground">Est. Size</span>
                <span className="font-bold">
                  {format === 'pdf' ? '2.3 MB' : format === 'json' ? '145 KB' : '68 KB'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Exports</h3>
        <div className="space-y-3">
          {[
            { name: 'Full Portfolio - Professional', date: 'Feb 5, 2026', format: 'PDF', size: '2.1 MB' },
            { name: 'Skills Summary - Minimal', date: 'Feb 1, 2026', format: 'Markdown', size: '52 KB' },
            { name: 'Complete Data Export', date: 'Jan 28, 2026', format: 'JSON', size: '138 KB' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.date} · {item.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-md bg-accent text-accent-foreground">
                  {item.format}
                </span>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
