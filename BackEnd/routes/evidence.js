import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import Evidence from '../models/Evidence.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.mp4'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png, gif, pdf, and mp4 files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // increased to 20MB for videos
});

// Upload file endpoint (changed from / to /upload)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided', status: 400 });
    }
    res.status(201).json({ success: true, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to upload file', status: 500 });
  }
});

// Create evidence metadata
router.post('/', async (req, res) => {
  try {
    const evidenceData = { ...req.body, user_id: req.user.user_id };
    const evidence = new Evidence(evidenceData);
    await evidence.save();
    res.status(201).json({ success: true, data: evidence });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all evidence for the logged-in user
router.get('/', async (req, res) => {
  try {
    const evidence = await Evidence.find({ user_id: req.user.user_id }).populate('linkedTo', 'skill_name category');
    res.json({ success: true, data: evidence });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific evidence by ID
router.get('/:id', async (req, res) => {
  try {
    const evidence = await Evidence.findOne({ _id: req.params.id, user_id: req.user.user_id }).populate('linkedTo', 'skill_name category');
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update evidence
router.put('/:id', async (req, res) => {
  try {
    const evidence = await Evidence.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.user_id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    res.json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete evidence
router.delete('/:id', async (req, res) => {
  try {
    const evidence = await Evidence.findOneAndDelete({ _id: req.params.id, user_id: req.user.user_id });
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    // Optionally: delete the associated file from the disk if evidence.file_path exists
    if (evidence.file_path) {
      const filePath = path.join(uploadsDir, evidence.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.json({ message: 'Evidence deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
