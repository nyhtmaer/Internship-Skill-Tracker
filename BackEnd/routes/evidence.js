import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { Evidence, Record } from '../models/index.js';

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
    // Generate UUID + original extension
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// File filter to whitelist specific file types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png, gif, and pdf files are allowed'));
  }
};

// Configure multer with 5MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST: Upload file and save metadata to database
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        status: 400,
      });
    }

    const user_id = req.user.user_id; // From JWT token
    const { description, linked_to } = req.body;

    // If linked_to is provided, validate that record belongs to user
    if (linked_to) {
      const record = await Record.findById(linked_to);
      if (!record || record.user_id.toString() !== user_id) {
        // Delete uploaded file if record ownership validation fails
        fs.unlinkSync(path.join(uploadsDir, req.file.filename));
        return res.status(403).json({
          error: 'Record not found or access denied',
          status: 403,
        });
      }
    }

    // Create Evidence record in database
    const evidence = new Evidence({
      user_id,
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      description: description || '',
      linked_to: linked_to || null,
    });

    await evidence.save();

    // If evidence is linked to a record, add it to record's evidence_files array
    if (linked_to) {
      await Record.findByIdAndUpdate(
        linked_to,
        { $push: { evidence_files: evidence._id } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    // Cleanup uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(path.join(uploadsDir, req.file.filename));
      } catch (unlinkError) {
        console.error('Failed to delete file on error:', unlinkError);
      }
    }
    res.status(500).json({
      error: error.message || 'Failed to upload file',
      status: 500,
    });
  }
});

// GET: Get all evidence files for authenticated user
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    const { record_id } = req.query;

    let query = { user_id };
    if (record_id) {
      query.linked_to = record_id;
    }

    const evidence = await Evidence.find(query)
      .populate('linked_to', 'title organization')
      .sort({ upload_date: -1 });

    res.status(200).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch evidence files',
      status: 500,
    });
  }
});

// GET: Get single evidence file by ID (with ownership validation)
router.get('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    const evidence = await Evidence.findById(req.params.id).populate('linked_to', 'title organization');

    if (!evidence) {
      return res.status(404).json({
        error: 'Evidence file not found',
        status: 404,
      });
    }

    // Validate ownership
    if (evidence.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This evidence file belongs to another user',
        status: 403,
      });
    }

    res.status(200).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch evidence file',
      status: 500,
    });
  }
});

// PUT: Link existing evidence to a record
router.put('/:id/link/:recordId', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token

    // Validate evidence ownership
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) {
      return res.status(404).json({
        error: 'Evidence file not found',
        status: 404,
      });
    }

    if (evidence.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This evidence file belongs to another user',
        status: 403,
      });
    }

    // Validate record ownership
    const record = await Record.findById(req.params.recordId);
    if (!record) {
      return res.status(404).json({
        error: 'Record not found',
        status: 404,
      });
    }

    if (record.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This record belongs to another user',
        status: 403,
      });
    }

    // Update evidence linked_to
    evidence.linked_to = req.params.recordId;
    await evidence.save();

    // Add evidence to record's evidence_files if not already present
    if (!record.evidence_files.includes(evidence._id)) {
      await Record.findByIdAndUpdate(
        req.params.recordId,
        { $push: { evidence_files: evidence._id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to link evidence to record',
      status: 500,
    });
  }
});

// DELETE: Delete evidence file and remove from record
router.delete('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token

    // Fetch evidence to validate ownership
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        error: 'Evidence file not found',
        status: 404,
      });
    }

    // Validate ownership
    if (evidence.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This evidence file belongs to another user',
        status: 403,
      });
    }

    // Remove evidence from linked record if applicable
    if (evidence.linked_to) {
      await Record.findByIdAndUpdate(
        evidence.linked_to,
        { $pull: { evidence_files: evidence._id } },
        { new: true }
      );
    }

    // Delete file from disk
    const filePath = path.join(uploadsDir, evidence.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete evidence record from database
    await Evidence.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Evidence file deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to delete evidence file',
      status: 500,
    });
  }
});

export default router;
