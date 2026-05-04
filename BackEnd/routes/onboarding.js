import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Known skills dictionary for keyword matching
const KNOWN_SKILLS = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++',
  'Docker', 'AWS', 'MongoDB', 'SQL', 'PostgreSQL', 'HTML', 'CSS', 'Tailwind',
  'Git', 'Linux', 'Machine Learning', 'GraphQL', 'Express'
];

router.post('/parse', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded', status: 400 });
    }

    // Parse the PDF buffer
    const data = await pdf(req.file.buffer);
    const text = data.text;

    // Scan text for keywords
    const foundSkills = [];
    
    // Simple case-insensitive matching
    KNOWN_SKILLS.forEach(skill => {
      // Escape regex special chars for skills like C++
      const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      if (regex.test(text)) {
        // Map to standard category and level based on some logic (mocked)
        let category = 'Tools';
        if (['React', 'HTML', 'CSS', 'Tailwind'].includes(skill)) category = 'Frontend';
        if (['Node.js', 'Express', 'Python', 'Java', 'C++'].includes(skill)) category = 'Backend';
        if (['MongoDB', 'SQL', 'PostgreSQL'].includes(skill)) category = 'Database';
        if (['Docker', 'AWS', 'Linux'].includes(skill)) category = 'Cloud & DevOps';

        foundSkills.push({
          skill_name: skill,
          category: category,
          skill_level: Math.floor(Math.random() * 40) + 40, // random baseline level 40-80
          trend: 'stable'
        });
      }
    });

    // We can also return a "found internship" if we detect keywords like Intern
    const foundInternships = [];
    if (/intern\b|internship/i.test(text)) {
      foundInternships.push({
        title: "Software Engineering Intern",
        organization: "Extracted Company",
        start_date: "2025-06-01",
        description: "Extracted from resume",
        skills: foundSkills.slice(0, 2).map(s => s.skill_name)
      });
    }

    // Add an artificial delay to make it feel like "AI Processing"
    setTimeout(() => {
      res.status(200).json({
        success: true,
        data: {
          skills: foundSkills,
          internships: foundInternships
        }
      });
    }, 2000); // 2 second mock delay

  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: 'Failed to parse resume', status: 500 });
  }
});

export default router;
