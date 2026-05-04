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
    location: {
      type: String,
      default: '',
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'completed',
    },
    description: {
      type: String,
      default: '',
    },
    linked_skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    projects: [{
      type: String,
      default: '',
    }],
    evidence_files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evidence',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Record', recordSchema);
