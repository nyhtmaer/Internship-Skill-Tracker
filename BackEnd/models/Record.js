import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: ['internship', 'certification'],
      required: [true, 'Type (internship or certification) is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    organization: {
      type: String,
      required: [true, 'Organization (company or issuing body) is required'],
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end_date: {
      type: Date,
    },
    description: {
      type: String,
      default: '',
    },
    // Internship Specific Fields
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expiring', 'expired'],
      default: 'completed',
    },
    projects: [
      {
        type: String,
      },
    ],
    impact: [
      {
        metric: String,
        before: Number,
        after: Number,
        growth: Number,
      },
    ],
    // Certification Specific Fields
    credentialId: {
      type: String,
    },
    verificationUrl: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    // Relations and Media
    linked_skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    evidence_file: {
      type: String, // URL string for evidence
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Record', recordSchema);
