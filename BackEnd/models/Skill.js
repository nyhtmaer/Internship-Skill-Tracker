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
    skill_level: {
      type: Number,
      required: [true, 'Skill level is required'],
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Languages', 'Database', 'DevOps', 'Tools', 'Soft Skills', 'Other'],
      default: 'Other',
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
    last_level: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Skill', skillSchema);
