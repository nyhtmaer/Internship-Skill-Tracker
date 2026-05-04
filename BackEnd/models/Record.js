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
      enum: {
        values: ['internship', 'certification'],
        message: '{VALUE} is not a valid type',
      },
      required: [true, 'Type (internship or certification) is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization (company or issuing body) is required'],
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end_date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'completed',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    linked_skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    projects: [
      {
        type: String,
        trim: true,
      },
    ],
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
