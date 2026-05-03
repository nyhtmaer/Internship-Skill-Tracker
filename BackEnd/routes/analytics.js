import express from 'express';
import { Skill } from '../models/index.js';

const router = express.Router();

// Helper function to calculate decay rate (0.0 to 1.0)
const calculateDecayRate = (lastUpdated) => {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(lastUpdated));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const DECAY_THRESHOLD = 90; // 90 days for full decay

  // If older than 90 days, decay_rate = 1.0
  // If newer, decay_rate = (days / 90) normalized to [0.0, 1.0]
  const decayRate = Math.min(diffDays / DECAY_THRESHOLD, 1.0);

  return {
    decay_rate: Math.round(decayRate * 100) / 100, // Round to 2 decimals
    days_since_practiced: diffDays,
  };
};

// Get analytics for authenticated user's skills
// Returns all skills with calculated decay_rate (0.0 to 1.0)
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token

    const skills = await Skill.find({ user_id }).sort({ skill_name: 1 });

    // Map skills with decay_rate calculation
    const skillsWithDecay = skills.map((skill) => {
      const decayInfo = calculateDecayRate(skill.last_updated);
      return {
        _id: skill._id,
        skill_name: skill.skill_name,
        skill_level: skill.skill_level,
        last_updated: skill.last_updated,
        decay_rate: decayInfo.decay_rate,
        days_since_practiced: decayInfo.days_since_practiced,
      };
    });

    res.status(200).json({
      success: true,
      data: skillsWithDecay,
      summary: {
        total_skills: skillsWithDecay.length,
        decaying_skills: skillsWithDecay.filter((s) => s.decay_rate > 0.5).length,
        average_decay_rate: skillsWithDecay.length
          ? Math.round((skillsWithDecay.reduce((sum, s) => sum + s.decay_rate, 0) / skillsWithDecay.length) * 100) / 100
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch analytics',
      status: 500,
    });
  }
});

export default router;
