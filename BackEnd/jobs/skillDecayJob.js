import cron from 'node-cron';
import { Skill } from '../models/index.js';

const startSkillDecayJob = () => {
  // Run every day at midnight (0 0 * * *)
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🔄 Running skill decay check...');

      const threshold = parseInt(process.env.SKILL_DECAY_THRESHOLD) || 30;
      const now = new Date();
      const decayDate = new Date(now.getTime() - threshold * 24 * 60 * 60 * 1000);

      // Find skills that haven't been updated within the threshold
      const decayingSkills = await Skill.find({
        last_updated: { $lt: decayDate },
      }).populate('user_id', 'name email');

      if (decayingSkills.length > 0) {
        console.log(`⚠️  Found ${decayingSkills.length} decaying skills:`);
        decayingSkills.forEach((skill) => {
          console.log(
            `  - ${skill.skill_name} (Level ${skill.skill_level}) for user ${skill.user_id.name} (${skill.user_id.email})`
          );
        });
      } else {
        console.log('✅ No decaying skills found.');
      }

      console.log('✅ Skill decay check completed.');
    } catch (error) {
      console.error('❌ Error in skill decay job:', error.message);
    }
  });

  console.log('📅 Skill decay job scheduled to run daily at midnight');
};

export default startSkillDecayJob;
