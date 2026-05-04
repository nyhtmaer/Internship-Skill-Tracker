import express from 'express';
import { Skill } from '../models/index.js';

const router = express.Router();

// Helper function to determine trend
const getTrend = (currentLevel, lastLevel) => {
  if (lastLevel === null || lastLevel === undefined) return 'stable';
  if (currentLevel > lastLevel) return 'growing';
  if (currentLevel < lastLevel) return 'decaying';
  return 'stable';
};

// Helper function to calculate decay status
const getDecayStatus = (lastUpdated) => {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(lastUpdated));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const threshold = parseInt(process.env.SKILL_DECAY_THRESHOLD) || 30;

  return {
    days_since_practiced: diffDays,
    is_decaying: diffDays > threshold,
    decay_threshold: threshold,
  };
};

// Create a new skill
// The user_id comes from the JWT token, not from request body
router.post('/', async (req, res) => {
  try {
    const { skill_name, skill_level, category } = req.body;
    const user_id = req.user.user_id; // From JWT token

    if (!skill_name || !skill_level) {
      return res.status(400).json({
        error: 'skill_name and skill_level are required',
        status: 400,
      });
    }

    if (skill_level < 1 || skill_level > 5) {
      return res.status(400).json({
        error: 'skill_level must be between 1 and 5',
        status: 400,
      });
    }

    const skill = new Skill({
      user_id,
      skill_name: skill_name.toLowerCase(),
      skill_level,
      category: category || 'Other',
      last_level: null,
      last_updated: new Date(),
    });

    await skill.save();

    const skillData = skill.toObject();
    skillData.decay_status = getDecayStatus(skill.last_updated);

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

    const skillsWithDecay = skills.map((skill) => ({
      ...skill.toObject(),
      decay_status: getDecayStatus(skill.last_updated),
      trend: getTrend(skill.skill_level, skill.last_level),
    }));

    res.status(200).json({
      success: true,
      data: skillsWithDecay,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch skills',
      status: 500,
    });
  }
});

// Get single skill by ID (with ownership validation)
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

    // Validate ownership
    if (skill.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This skill belongs to another user',
        status: 403,
      });
    }

    const skillData = skill.toObject();
    skillData.decay_status = getDecayStatus(skill.last_updated);
    skillData.trend = getTrend(skill.skill_level, skill.last_level);

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

// Update skill (with ownership validation and auto-update of last_updated)
router.put('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    const { skill_level, category } = req.body;

    if (skill_level && (skill_level < 1 || skill_level > 5)) {
      return res.status(400).json({
        error: 'skill_level must be between 1 and 5',
        status: 400,
      });
    }

    // Fetch existing skill to validate ownership
    const existingSkill = await Skill.findById(req.params.id);

    if (!existingSkill) {
      return res.status(404).json({
        error: 'Skill not found',
        status: 404,
      });
    }

    // Validate ownership
    if (existingSkill.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This skill belongs to another user',
        status: 403,
      });
    }

    const updateData = {
      last_updated: new Date(),
    };

    if (skill_level) {
      updateData.last_level = existingSkill.skill_level;
      updateData.skill_level = skill_level;
    }

    if (category) {
      updateData.category = category;
    }

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    const skillData = skill.toObject();
    skillData.decay_status = getDecayStatus(skill.last_updated);
    skillData.trend = getTrend(skill.skill_level, skill.last_level);

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

// Delete skill (with ownership validation)
router.delete('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    
    // Fetch existing skill to validate ownership
    const existingSkill = await Skill.findById(req.params.id);

    if (!existingSkill) {
      return res.status(404).json({
        error: 'Skill not found',
        status: 404,
      });
    }

    // Validate ownership
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
