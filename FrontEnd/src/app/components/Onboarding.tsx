import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, ArrowRight, Loader2, Briefcase, Award, Code, BookOpen, X } from 'lucide-react';
import { api } from '../api';
import { toast } from 'sonner';

type ParseResult = {
  summary: string;
  skillsCreated: string[];
  recordsCreated: { title: string; org: string }[];
  certsCreated: string[];
  evidenceCreated: string[];
  rawExtracted: { skillCount: number; experienceCount: number; certCount: number; projectCount: number };
};

export default function Onboarding() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setStep(2);
    try {
      const res = await api.parseCV(file);
      setResult(res.data);
      setStep(3);
      toast.success('Resume parsed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to parse resume');
      setStep(1);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Career OS Setup
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Build your profile</h1>
          <p className="text-muted-foreground mt-2">Upload your resume and we'll auto-populate your entire portfolio</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${s <= step ? 'bg-primary w-8' : 'bg-border w-4'}`} />
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">

          {/* STEP 1 — Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <Upload className={`w-10 h-10 mx-auto mb-4 ${file ? 'text-primary' : 'text-muted-foreground'}`} />
                {file ? (
                  <div>
                    <p className="font-semibold text-primary">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(0)} KB — Ready to scan</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">Drop your resume here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">PDF files up to 10MB</p>
                  </div>
                )}
              </div>

              {/* What gets extracted */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Code, label: 'Skills & Technologies', desc: '80+ frameworks detected' },
                  { icon: Briefcase, label: 'Work Experience', desc: 'Roles, companies, dates' },
                  { icon: Award, label: 'Certifications', desc: 'Credentials & licenses' },
                  { icon: BookOpen, label: 'Projects', desc: 'Added to Evidence Vault' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleScan}
                  disabled={!file}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Parse Resume <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Scanning */}
          {step === 2 && (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <h2 className="text-xl font-semibold">Analyzing your resume…</h2>
              <p className="text-muted-foreground text-sm">Extracting skills, experience, certifications, and projects</p>
            </div>
          )}

          {/* STEP 3 — Results */}
          {step === 3 && result && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Profile Populated!</h2>
                <p className="text-muted-foreground text-sm mt-1">{result.summary}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Skills', count: result.skillsCreated.length, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Experiences', count: result.recordsCreated.length, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                  { label: 'Certifications', count: result.certsCreated.length, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { label: 'Projects', count: result.evidenceCreated.length, color: 'text-green-500', bg: 'bg-green-500/10' },
                ].map(({ label, count, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                    <div className={`text-2xl font-bold ${color}`}>{count}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Skills preview */}
              {result.skillsCreated.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Skills added:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.skillsCreated.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience preview */}
              {result.recordsCreated.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Work experience added:</p>
                  <div className="space-y-1.5">
                    {result.recordsCreated.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-accent/50">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">{r.title}</span>
                        {r.org && <span className="text-muted-foreground">@ {r.org}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border flex gap-3">
                <button
                  onClick={() => { setStep(1); setFile(null); setResult(null); }}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Re-upload
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
