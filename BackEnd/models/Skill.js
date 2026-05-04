import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    skill_name: {
      type: String,
      required: [true, 'Skill name is required'],
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Tools',
    },
    skill_level: {
      type: Number,
      required: [true, 'Skill level is required'],
      min: 0,
      max: 100,
      default: 0,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Skill', skillSchema);
