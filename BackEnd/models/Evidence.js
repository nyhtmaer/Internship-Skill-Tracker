import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    type: {
      type: String,
      enum: ['project', 'document', 'certification', 'media', 'achievement'],
      required: [true, 'Evidence type is required'],
    },
    format: {
      type: String,
      enum: ['code', 'pdf', 'video', 'image', 'link'],
      required: [true, 'Format is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tags: [
      {
        type: String,
      },
    ],
    linkedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    description: {
      type: String,
      default: '',
    },
    url: {
      type: String, // For external links or repository URLs
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    impact: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    file_path: {
      type: String, // The actual filename returned by multer
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Evidence', evidenceSchema);
