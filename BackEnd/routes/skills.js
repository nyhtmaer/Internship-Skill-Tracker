import express from 'express';
import { Skill, Record, Evidence } from '../models/index.js';

const router = express.Router();

// Helper function to calculate decay status and trend
const getDecayStatus = (lastUpdated) => {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(lastUpdated));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const threshold = parseInt(process.env.SKILL_DECAY_THRESHOLD) || 30;

  let trend = 'stable';
  if (diffDays > threshold) {
    trend = 'decaying';
  } else if (diffDays <= 7) {
    trend = 'growing'; // practiced in the last week
  }

  return {
    days_since_practiced: diffDays,
    is_decaying: diffDays > threshold,
    decay_threshold: threshold,
    trend,
    lastPracticed: diffDays === 0 ? 'Today' : diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
  };
};

const populateSkillStats = async (skillData) => {
  const skillId = skillData._id;
  const user_id = skillData.user_id;

  const evidenceCount = await Evidence.countDocuments({ user_id, linkedTo: skillId });
  const certifications = await Record.countDocuments({ user_id, type: 'certification', linked_skills: skillId });
  const internships = await Record.countDocuments({ user_id, type: 'internship', linked_skills: skillId });
  
  // Get related evidence for the UI (max 3 for preview)
  const relatedEvidenceDocs = await Evidence.find({ user_id, linkedTo: skillId }).limit(3);
  const relatedEvidence = relatedEvidenceDocs.map(e => ({ type: e.type, title: e.title, impact: e.impact }));

  // Growth data could be mocked or calculated if we stored historical data. For now, mock a slight upward trend.
  const growthData = [
    { date: 'Month 1', level: Math.max(0, skillData.skill_level - 10) },
    { date: 'Month 2', level: Math.max(0, skillData.skill_level - 5) },
    { date: 'Current', level: skillData.skill_level }
  ];

  return {
    ...skillData,
    evidenceCount,
    certifications,
    internships,
    relatedEvidence,
    growthData,
    category: skillData.category || 'Tools'
  };
};

// Create a new skill
router.post('/', async (req, res) => {
  try {
    const { skill_name, skill_level, category } = req.body;
    const user_id = req.user.user_id; // From JWT token

    if (!skill_name || skill_level === undefined) {
      return res.status(400).json({
        error: 'skill_name and skill_level are required',
        status: 400,
      });
    }

    if (skill_level < 0 || skill_level > 100) {
      return res.status(400).json({
        error: 'skill_level must be between 0 and 100',
        status: 400,
      });
    }

    const skill = new Skill({
      user_id,
      skill_name: skill_name.toLowerCase(),
      skill_level,
      category: category || 'Tools',
      last_updated: new Date(),
    });

    await skill.save();

    let skillData = skill.toObject();
    skillData.decay_status = getDecayStatus(skill.last_updated);
    skillData.trend = skillData.decay_status.trend;
    skillData.lastPracticed = skillData.decay_status.lastPracticed;
    skillData = await populateSkillStats(skillData);

    res.status(201).json({
      success: true,
      data: skillData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to create skill',
      status: 500,
    });
  }
});

// Get all skills for the authenticated user
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    
    const skills = await Skill.find({ user_id }).sort({ skill_name: 1 });

    const skillsWithDecayAndStats = await Promise.all(skills.map(async (skill) => {
      let skillData = skill.toObject();
      skillData.decay_status = getDecayStatus(skill.last_updated);
      skillData.trend = skillData.decay_status.trend;
      skillData.lastPracticed = skillData.decay_status.lastPracticed;
      skillData = await populateSkillStats(skillData);
      return skillData;
    }));

    res.status(200).json({
      success: true,
      data: skillsWithDecayAndStats,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch skills',
      status: 500,
    });
  }
});

// Get single skill by ID
router.get('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found',
        status: 404,
      });
    }

    if (skill.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This skill belongs to another user',
        status: 403,
      });
    }

    let skillData = skill.toObject();
    skillData.decay_status = getDecayStatus(skill.last_updated);
    skillData.trend = skillData.decay_status.trend;
    skillData.lastPracticed = skillData.decay_status.lastPracticed;
    skillData = await populateSkillStats(skillData);

    res.status(200).json({
      success: true,
      data: skillData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch skill',
      status: 500,
    });
  }
});

// Update skill
router.put('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    const { skill_level, category } = req.body;

    if (skill_level !== undefined && (skill_level < 0 || skill_level > 100)) {
      return res.status(400).json({
        error: 'skill_level must be between 0 and 100',
        status: 400,
      });
    }

    const existingSkill = await Skill.findById(req.params.id);

    if (!existingSkill) {
      return res.status(404).json({
        error: 'Skill not found',
        status: 404,
      });
    }

    if (existingSkill.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This skill belongs to another user',
        status: 403,
      });
    }

    const updates = { last_updated: new Date() };
    if (skill_level !== undefined) updates.skill_level = skill_level;
    if (category !== undefined) updates.category = category;

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    let skillData = skill.toObject();
    skillData.decay_status = getDecayStatus(skill.last_updated);
    skillData.trend = skillData.decay_status.trend;
    skillData.lastPracticed = skillData.decay_status.lastPracticed;
    skillData = await populateSkillStats(skillData);

    res.status(200).json({
      success: true,
      data: skillData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to update skill',
      status: 500,
    });
  }
});

// Delete skill
router.delete('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    const existingSkill = await Skill.findById(req.params.id);

    if (!existingSkill) {
      return res.status(404).json({
        error: 'Skill not found',
        status: 404,
      });
    }

    if (existingSkill.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This skill belongs to another user',
        status: 403,
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to delete skill',
      status: 500,
    });
  }
});

export default router;
