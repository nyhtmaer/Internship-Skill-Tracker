import express from 'express';
import { Skill, Record, Evidence } from '../models/index.js';

const router = express.Router();

// Framework/tool → skill category mapping
const FRAMEWORK_SKILLS = {
  // Frontend frameworks
  'react': { name: 'React', category: 'Frontend' },
  'next': { name: 'Next.js', category: 'Frontend' },
  'nextjs': { name: 'Next.js', category: 'Frontend' },
  'vue': { name: 'Vue.js', category: 'Frontend' },
  'nuxt': { name: 'Nuxt.js', category: 'Frontend' },
  'angular': { name: 'Angular', category: 'Frontend' },
  'svelte': { name: 'Svelte', category: 'Frontend' },
  'tailwindcss': { name: 'Tailwind CSS', category: 'Frontend' },
  'vite': { name: 'Vite', category: 'Frontend' },
  'webpack': { name: 'Webpack', category: 'Frontend' },
  // Backend frameworks
  'express': { name: 'Express.js', category: 'Backend' },
  'fastapi': { name: 'FastAPI', category: 'Backend' },
  'django': { name: 'Django', category: 'Backend' },
  'flask': { name: 'Flask', category: 'Backend' },
  'spring': { name: 'Spring Boot', category: 'Backend' },
  'rails': { name: 'Ruby on Rails', category: 'Backend' },
  'gin': { name: 'Gin', category: 'Backend' },
  'nestjs': { name: 'NestJS', category: 'Backend' },
  'hono': { name: 'Hono', category: 'Backend' },
  // Databases
  'mongoose': { name: 'MongoDB', category: 'Backend' },
  'mongodb': { name: 'MongoDB', category: 'Backend' },
  'prisma': { name: 'Prisma', category: 'Backend' },
  'sequelize': { name: 'SQL', category: 'Backend' },
  'typeorm': { name: 'TypeORM', category: 'Backend' },
  'redis': { name: 'Redis', category: 'Backend' },
  'psycopg2': { name: 'PostgreSQL', category: 'Backend' },
  'sqlalchemy': { name: 'SQLAlchemy', category: 'Backend' },
  // AI/ML
  'torch': { name: 'PyTorch', category: 'AI/ML' },
  'pytorch': { name: 'PyTorch', category: 'AI/ML' },
  'tensorflow': { name: 'TensorFlow', category: 'AI/ML' },
  'keras': { name: 'Keras', category: 'AI/ML' },
  'scikit-learn': { name: 'Scikit-Learn', category: 'AI/ML' },
  'sklearn': { name: 'Scikit-Learn', category: 'AI/ML' },
  'numpy': { name: 'NumPy', category: 'AI/ML' },
  'pandas': { name: 'Pandas', category: 'Data' },
  'transformers': { name: 'HuggingFace', category: 'AI/ML' },
  'langchain': { name: 'LangChain', category: 'AI/ML' },
  'openai': { name: 'OpenAI API', category: 'AI/ML' },
  // DevOps/Cloud
  'docker': { name: 'Docker', category: 'DevOps' },
  'kubernetes': { name: 'Kubernetes', category: 'DevOps' },
  'aws-sdk': { name: 'AWS', category: 'DevOps' },
  '@aws-sdk': { name: 'AWS', category: 'DevOps' },
  'firebase': { name: 'Firebase', category: 'Backend' },
  'supabase': { name: 'Supabase', category: 'Backend' },
  'graphql': { name: 'GraphQL', category: 'Backend' },
  'apollo': { name: 'GraphQL', category: 'Backend' },
  'stripe': { name: 'Stripe', category: 'Backend' },
  'socket.io': { name: 'Socket.io', category: 'Backend' },
};

function getLanguageCategory(lang) {
  const l = lang.toLowerCase();
  if (['javascript', 'typescript', 'html', 'css', 'scss', 'vue', 'svelte'].includes(l)) return 'Frontend';
  if (['python', 'java', 'go', 'rust', 'ruby', 'php', 'c#', 'c++', 'scala', 'kotlin', 'swift'].includes(l)) return 'Backend';
  if (['r', 'julia', 'matlab', 'sql', 'jupyter notebook'].includes(l)) return 'Data';
  if (['dockerfile', 'shell', 'hcl', 'nix'].includes(l)) return 'DevOps';
  return 'Backend';
}

async function fetchText(url, headers) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

async function fetchJSON(url, headers) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function extractDepsFromPkg(pkgJson) {
  if (!pkgJson) return [];
  const allDeps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
  };
  const found = [];
  for (const dep of Object.keys(allDeps)) {
    const key = dep.toLowerCase().replace(/^@[^/]+\//, '');
    if (FRAMEWORK_SKILLS[dep.toLowerCase()] || FRAMEWORK_SKILLS[key]) {
      found.push(FRAMEWORK_SKILLS[dep.toLowerCase()] || FRAMEWORK_SKILLS[key]);
    }
  }
  return found;
}

function extractDepsFromRequirements(text) {
  if (!text) return [];
  const found = [];
  const lines = text.split('\n').map(l => l.split('==')[0].split('>=')[0].split('[')[0].trim().toLowerCase());
  for (const dep of lines) {
    if (FRAMEWORK_SKILLS[dep]) found.push(FRAMEWORK_SKILLS[dep]);
  }
  return found;
}

function extractDepsFromGoMod(text) {
  if (!text) return [];
  const found = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const m = line.trim().match(/^\s*([\w./-]+)\s+v/);
    if (m) {
      const pkg = m[1].split('/').pop()?.toLowerCase() || '';
      if (FRAMEWORK_SKILLS[pkg]) found.push(FRAMEWORK_SKILLS[pkg]);
    }
  }
  return found;
}

/**
 * POST /api/v1/github/analyze
 */
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    const user_id = req.user.user_id;

    if (!url) return res.status(400).json({ error: 'GitHub URL is required' });

    const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+?)(?:\.git)?(?:\/|$|\?|#)/);
    if (!match) return res.status(400).json({ error: 'Invalid GitHub URL format' });

    const [, owner, repo] = match;
    const ghToken = process.env.GITHUB_TOKEN;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SkillTrack-App',
      ...(ghToken ? { 'Authorization': `Bearer ${ghToken}` } : {}),
    };

    // ── Fetch everything in parallel ───────────────────────────────────────
    const [repoRes, langsRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
    ]);

    if (repoRes.status === 'rejected' || !repoRes.value.ok) {
      return res.status(404).json({ error: `Cannot access repo "${owner}/${repo}". Is it public?` });
    }

    const repoData = await repoRes.value.json();
    const languagesRaw = langsRes.status === 'fulfilled' && langsRes.value.ok
      ? await langsRes.value.json() : {};

    // ── Deep-dive: fetch dependency files & README in parallel ─────────────
    const base = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD`;

    const [readmeData, pkgRaw, requirementsTxt, goMod, cargoToml, workflowsDir] = await Promise.all([
      fetchJSON(`https://api.github.com/repos/${owner}/${repo}/readme`, headers),
      fetchText(`${rawBase}/package.json`, headers),
      fetchText(`${rawBase}/requirements.txt`, headers),
      fetchText(`${rawBase}/go.mod`, headers),
      fetchText(`${rawBase}/Cargo.toml`, headers),
      fetchJSON(`${base}/.github/workflows`, headers),
    ]);

    // README text
    let readmeContent = '';
    if (readmeData?.content) {
      const decoded = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      readmeContent = decoded.replace(/#{1,6}\s/g, '').replace(/[*_`[\]()]/g, '').replace(/\n+/g, ' ').slice(0, 600);
    }

    // ── Compute language percentages ───────────────────────────────────────
    const totalBytes = Object.values(languagesRaw).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languagesRaw)
      .map(([name, bytes]) => ({
        name,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
        bytes,
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10);

    // ── Extract framework/tool skills from dependency files ────────────────
    let pkgJson = null;
    try { pkgJson = pkgRaw ? JSON.parse(pkgRaw) : null; } catch {}

    const frameworkSkills = [
      ...extractDepsFromPkg(pkgJson),
      ...extractDepsFromRequirements(requirementsTxt),
      ...extractDepsFromGoMod(goMod),
    ];

    // Deduplicate frameworks by name
    const uniqueFrameworks = [...new Map(frameworkSkills.map(f => [f.name, f])).values()];

    // CI/CD detection from .github/workflows
    const hasCI = Array.isArray(workflowsDir) && workflowsDir.length > 0;
    if (hasCI) uniqueFrameworks.push({ name: 'GitHub Actions', category: 'DevOps' });
    if (cargoToml) uniqueFrameworks.push({ name: 'Rust', category: 'Backend' });

    // ── Upsert skills (languages + frameworks) ─────────────────────────────
    const existingSkills = await Skill.find({ user_id });
    const existingNames = new Set(existingSkills.map(s => s.skill_name.toLowerCase()));

    const newSkillsCreated = [];

    // Language-based skills
    for (const lang of languages) {
      if (!existingNames.has(lang.name.toLowerCase()) && lang.percentage >= 5) {
        const level = Math.min(60, Math.max(30, Math.round(lang.percentage * 0.8)));
        const skill = await Skill.create({
          user_id,
          skill_name: lang.name,
          category: getLanguageCategory(lang.name),
          skill_level: level,
          trend: 'stable',
          last_updated: new Date(),
        });
        newSkillsCreated.push({ name: lang.name, level, category: skill.category, source: 'language' });
        existingNames.add(lang.name.toLowerCase());
      }
    }

    // Framework/tool-based skills
    for (const fw of uniqueFrameworks) {
      if (!existingNames.has(fw.name.toLowerCase())) {
        const skill = await Skill.create({
          user_id,
          skill_name: fw.name,
          category: fw.category,
          skill_level: 45, // Conservative estimate for dependency-detected skills
          trend: 'stable',
          last_updated: new Date(),
        });
        newSkillsCreated.push({ name: fw.name, level: 45, category: fw.category, source: 'dependency' });
        existingNames.add(fw.name.toLowerCase());
      }
    }

    // ── Create Evidence entry ──────────────────────────────────────────────
    const evidenceEntry = await Evidence.create({
      user_id,
      title: repoData.name || repo,
      description: repoData.description || readmeContent || `GitHub repo: ${repoData.full_name}`,
      type: 'project',
      format: 'link',
      url: repoData.html_url,
      featured: repoData.stargazers_count > 5,
      impact: repoData.stargazers_count > 20 ? 'high' : repoData.stargazers_count > 5 ? 'medium' : 'low',
      tags: [
        ...languages.slice(0, 3).map(l => l.name),
        ...(repoData.topics || []).slice(0, 3),
        ...uniqueFrameworks.slice(0, 2).map(f => f.name),
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 8),
      date: new Date().toISOString().split('T')[0],
      linkedTo: [],
    });

    res.status(200).json({
      success: true,
      data: {
        repo: {
          name: repoData.name,
          fullName: repoData.full_name,
          description: repoData.description,
          url: repoData.html_url,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          primaryLanguage: repoData.language,
          topics: repoData.topics || [],
        },
        languages,
        frameworks: uniqueFrameworks,
        readmeSummary: readmeContent,
        dependencyFiles: {
          packageJson: !!pkgJson,
          requirementsTxt: !!requirementsTxt,
          goMod: !!goMod,
          cargoToml: !!cargoToml,
          githubActions: hasCI,
        },
        skillsAutoAdded: newSkillsCreated,
        evidenceCreated: { id: evidenceEntry._id, title: evidenceEntry.title },
        summary: `Analyzed ${owner}/${repo}: found ${languages.length} languages + ${uniqueFrameworks.length} frameworks/tools. Auto-added ${newSkillsCreated.length} skills.`,
      },
    });
  } catch (error) {
    console.error('GitHub analysis error:', error);
    res.status(500).json({ error: error.message || 'GitHub analysis failed' });
  }
});

export default router;
