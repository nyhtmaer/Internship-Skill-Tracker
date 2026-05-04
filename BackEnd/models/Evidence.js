import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    original_name: {
      type: String,
      required: [true, 'Original filename is required'],
    },
    file_type: {
      type: String,
      required: [true, 'File type/MIME type is required'],
    },
    file_size: {
      type: Number,
      required: [true, 'File size in bytes is required'],
    },
    description: {
      type: String,
      default: '',
    },
    linked_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Record',
      default: null,
    },
    upload_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Evidence', evidenceSchema);
