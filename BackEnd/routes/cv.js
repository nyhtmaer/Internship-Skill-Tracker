import express from 'express';
import multer from 'multer';
import path from 'path';
import { Skill, Record, Evidence } from '../models/index.js';

const router = express.Router();

// Multer — memory storage so we can pass buffer to pdf-parse
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') cb(null, true);
    else cb(new Error('Only PDF files are supported'));
  },
});

// ── Keyword databases ──────────────────────────────────────────────────────
const SKILL_KEYWORDS = {
  // Languages
  Frontend: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Sass', 'HTML5', 'CSS3'],
  Backend: ['Python', 'Java', 'Go', 'Golang', 'Rust', 'Ruby', 'PHP', 'C#', 'C++', 'Kotlin', 'Swift', 'Scala', 'Elixir', 'Haskell', 'Node.js', 'Node'],
  Data: ['R', 'Julia', 'MATLAB', 'SQL', 'PostgreSQL', 'MySQL', 'SQLite'],
  DevOps: ['Bash', 'Shell', 'PowerShell'],
  // Frameworks & Tools
  'Frontend Frameworks': {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'Vue.js', 'Vue', 'Angular', 'Svelte', 'SvelteKit', 'Nuxt', 'Gatsby', 'Remix', 'Tailwind', 'Bootstrap', 'MUI', 'Chakra UI'],
  },
  'Backend Frameworks': {
    category: 'Backend',
    skills: ['Express.js', 'Express', 'Django', 'FastAPI', 'Flask', 'Spring Boot', 'Spring', 'NestJS', 'Laravel', 'Rails', 'Ruby on Rails', 'Gin', 'Fiber', 'Hono', 'GraphQL', 'REST', 'gRPC'],
  },
  'Databases': {
    category: 'Backend',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'Elasticsearch', 'Neo4j', 'Prisma', 'Mongoose', 'SQLAlchemy'],
  },
  'AI/ML': {
    category: 'AI/ML',
    skills: ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Scikit', 'HuggingFace', 'LangChain', 'OpenAI', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'XGBoost', 'NLTK', 'spaCy', 'YOLO', 'OpenCV'],
  },
  'DevOps & Cloud': {
    category: 'DevOps',
    skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'CI/CD', 'Nginx', 'Linux', 'Git'],
  },
  'Mobile': {
    category: 'Mobile',
    skills: ['React Native', 'Flutter', 'SwiftUI', 'Jetpack Compose', 'Android', 'iOS', 'Expo'],
  },
};

// Flatten for matching
const ALL_SKILLS = [];
for (const [key, val] of Object.entries(SKILL_KEYWORDS)) {
  if (Array.isArray(val)) {
    val.forEach(s => ALL_SKILLS.push({ name: s, category: key }));
  } else {
    val.skills.forEach(s => ALL_SKILLS.push({ name: s, category: val.category }));
  }
}

// Role titles → internship detection
const ROLE_PATTERNS = [
  /(?:^|\n|\.|,)\s*([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Intern|Analyst|Scientist|Researcher|Designer|Architect|Lead|Manager|Consultant|Specialist|Associate))\b/g,
];

const ORG_CONTEXT_PATTERN = /(?:at|@|,)\s*([A-Z][a-zA-Z\s&.,]+(?:Inc|Ltd|LLC|Corp|Technologies|Tech|Solutions|Labs|Systems|Services|Group|Studio)?)/g;

const DATE_PATTERN = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}\s*[-–]\s*(?:\d{4}|Present|Current|Now)/gi;

const CERT_KEYWORDS = [
  'AWS Certified', 'Google Cloud', 'Microsoft Azure', 'Certified', 'Certificate', 'Certification',
  'CompTIA', 'CISSP', 'PMP', 'CPA', 'CFA', 'Scrum', 'Agile', 'ITIL', 'Oracle Certified',
  'Cisco', 'CCNA', 'CCNP', 'Meta Certified', 'HubSpot', 'Salesforce Certified',
];

function extractSkills(text) {
  const found = new Map();
  const textUpper = text;

  for (const skill of ALL_SKILLS) {
    // Word-boundary aware match, case-insensitive
    const regex = new RegExp(`(?<![\\w-])${skill.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`, 'i');
    if (regex.test(textUpper)) {
      if (!found.has(skill.name.toLowerCase())) {
        found.set(skill.name.toLowerCase(), skill);
      }
    }
  }
  return [...found.values()];
}

function extractSection(text, headers) {
  // Try to find a section by its header and return its content
  for (const header of headers) {
    const regex = new RegExp(`(?:^|\\n)\\s*${header}\\s*[:\\n]([\\s\\S]*?)(?=\\n\\s*[A-Z][A-Z\\s]{2,}\\s*[:\\n]|$)`, 'i');
    const match = text.match(regex);
    if (match) return match[1].trim();
  }
  return '';
}

function extractExperience(text) {
  const experienceSection = extractSection(text, [
    'Experience', 'Work Experience', 'Professional Experience', 'Employment', 'Internship', 'Internships',
  ]);

  const target = experienceSection || text;
  const entries = [];

  // Split on likely job entry separators: lines that look like company + date
  const lines = target.split('\n').map(l => l.trim()).filter(Boolean);
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasDate = DATE_PATTERN.test(line);
    DATE_PATTERN.lastIndex = 0;

    const isRoleTitle = /Intern|Engineer|Developer|Analyst|Researcher|Designer|Lead|Manager|Consultant|Associate/i.test(line);

    if (isRoleTitle && line.length < 80) {
      if (current) entries.push(current);
      current = {
        title: line,
        organization: lines[i + 1]?.length < 60 ? lines[i + 1] : '',
        description: '',
        dates: [],
        type: /intern/i.test(line) ? 'internship' : 'internship',
      };
      i++; // skip next line (used as org)
    } else if (hasDate && current) {
      current.dates.push(line);
    } else if (current) {
      current.description += ` ${line}`;
    }
  }
  if (current) entries.push(current);

  return entries.slice(0, 8); // max 8 experiences
}

function extractCertifications(text) {
  const certSection = extractSection(text, ['Certifications', 'Certificates', 'Licenses', 'Credentials']);
  const target = certSection || text;
  const found = [];

  for (const keyword of CERT_KEYWORDS) {
    const regex = new RegExp(`${keyword}[^\\n]{0,80}`, 'gi');
    const matches = [...target.matchAll(regex)];
    for (const m of matches) {
      const cert = m[0].trim();
      if (cert.length > 5 && !found.includes(cert)) {
        found.push(cert);
      }
    }
  }

  return found.slice(0, 10);
}

function extractProjects(text) {
  const projectSection = extractSection(text, ['Projects', 'Personal Projects', 'Academic Projects', 'Portfolio']);
  if (!projectSection) return [];

  const lines = projectSection.split('\n').map(l => l.trim()).filter(l => l.length > 5);
  const projects = [];
  let current = null;

  for (const line of lines) {
    // Project titles tend to be short, capitalized, possibly with a | separator for tech stack
    if (line.length < 80 && /^[A-Z]/.test(line) && !line.startsWith('-') && !line.startsWith('•')) {
      if (current) projects.push(current);
      current = { title: line.split('|')[0].trim(), description: '', techStack: line.includes('|') ? line.split('|').slice(1).join('|').trim() : '' };
    } else if (current) {
      current.description += ` ${line.replace(/^[-•]\s*/, '')}`;
    }
  }
  if (current) projects.push(current);

  return projects.slice(0, 8);
}

/**
 * POST /api/v1/cv/parse
 * Accepts a PDF resume, extracts structured data, and creates records.
 */
router.post('/parse', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

    const user_id = req.user.user_id;

    // Dynamically import pdf-parse (CommonJS)
    const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    if (!text || text.length < 100) {
      return res.status(422).json({ error: 'Could not extract readable text from PDF. Try a text-based PDF (not scanned image).' });
    }

    // ── Extract everything ─────────────────────────────────────────────────
    const detectedSkills = extractSkills(text);
    const experiences = extractExperience(text);
    const certifications = extractCertifications(text);
    const projects = extractProjects(text);

    // ── Upsert skills ──────────────────────────────────────────────────────
    const existingSkills = await Skill.find({ user_id });
    const existingNames = new Set(existingSkills.map(s => s.skill_name.toLowerCase()));
    const skillsCreated = [];

    for (const skill of detectedSkills) {
      if (!existingNames.has(skill.name.toLowerCase())) {
        await Skill.create({
          user_id,
          skill_name: skill.name,
          category: skill.category,
          skill_level: 50, // Default — user can adjust
          trend: 'stable',
          last_updated: new Date(),
        });
        skillsCreated.push(skill.name);
        existingNames.add(skill.name.toLowerCase());
      }
    }

    // ── Create internship/work records ─────────────────────────────────────
    const recordsCreated = [];
    for (const exp of experiences) {
      if (!exp.title && !exp.organization) continue;
      try {
        const record = await Record.create({
          user_id,
          title: exp.title || 'Work Experience',
          organization: exp.organization || 'Unknown Organization',
          start_date: new Date(), // CV doesn't always give parseable dates
          description: exp.description.trim().slice(0, 500),
          type: exp.type,
          status: 'completed',
        });
        recordsCreated.push({ title: record.title, org: record.organization });
      } catch (e) {
        // Skip invalid records
      }
    }

    // ── Create certification records ───────────────────────────────────────
    const certsCreated = [];
    for (const cert of certifications) {
      try {
        const record = await Record.create({
          user_id,
          title: cert.slice(0, 100),
          organization: cert.match(/(?:AWS|Google|Microsoft|Meta|Cisco|CompTIA|Oracle|HubSpot|Salesforce)/i)?.[0] || 'Issuing Body',
          start_date: new Date(),
          type: 'certification',
          status: 'active',
        });
        certsCreated.push(record.title);
      } catch (e) {}
    }

    // ── Create project evidence entries ────────────────────────────────────
    const evidenceCreated = [];
    for (const proj of projects) {
      if (!proj.title) continue;
      try {
        const evidence = await Evidence.create({
          user_id,
          title: proj.title.slice(0, 100),
          description: (proj.description + (proj.techStack ? ` | Tech: ${proj.techStack}` : '')).trim().slice(0, 500),
          type: 'project',
          format: 'link',
          url: '',
          impact: 'medium',
          tags: proj.techStack ? proj.techStack.split(/[,|]/).map(t => t.trim()).filter(Boolean).slice(0, 5) : [],
          date: new Date().toISOString().split('T')[0],
          linkedTo: [],
          featured: false,
        });
        evidenceCreated.push(evidence.title);
      } catch (e) {}
    }

    res.status(200).json({
      success: true,
      data: {
        textLength: text.length,
        summary: `Parsed CV: found ${skillsCreated.length} new skills, ${recordsCreated.length} work experiences, ${certsCreated.length} certifications, ${evidenceCreated.length} projects.`,
        skillsCreated,
        recordsCreated,
        certsCreated,
        evidenceCreated,
        rawExtracted: {
          skillCount: detectedSkills.length,
          experienceCount: experiences.length,
          certCount: certifications.length,
          projectCount: projects.length,
        },
      },
    });
  } catch (error) {
    console.error('CV parse error:', error);
    res.status(500).json({ error: error.message || 'CV parsing failed' });
  }
});

export default router;
