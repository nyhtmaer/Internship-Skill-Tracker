import express from 'express';
import { Record, Skill } from '../models/index.js';

const router = express.Router();

// Create a new record (internship or certification)
// The user_id comes from the JWT token, not from request body
router.post('/', async (req, res) => {
  try {
    const { type, title, organization, location, start_date, end_date, description, linked_skills, projects, status } = req.body;
    const user_id = req.user.user_id; // From JWT token

    if (!type || !title || !organization || !start_date) {
      return res.status(400).json({
        error: 'type, title, organization, and start_date are required',
        status: 400,
      });
    }

    if (!['internship', 'certification'].includes(type)) {
      return res.status(400).json({
        error: 'Type must be either "internship" or "certification"',
        status: 400,
      });
    }

    const record = new Record({
      user_id,
      type,
      title,
      organization,
      location: location || '',
      start_date,
      end_date: end_date || null,
      status: status || 'completed',
      description: description || '',
      linked_skills: linked_skills || [],
      projects: projects || [],
      evidence_files: [],
    });

    await record.save();

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to create record',
      status: 500,
    });
  }
});

// Get all records for the authenticated user
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    
    const records = await Record.find({ user_id })
      .populate('linked_skills')
      .populate('evidence_files')
      .sort({ start_date: -1 });

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch records',
      status: 500,
    });
  }
});

// Get single record by ID (with ownership validation)
router.get('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    const record = await Record.findById(req.params.id)
      .populate('linked_skills')
      .populate('evidence_files');

    if (!record) {
      return res.status(404).json({
        error: 'Record not found',
        status: 404,
      });
    }

    // Validate ownership
    if (record.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This record belongs to another user',
        status: 403,
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch record',
      status: 500,
    });
  }
});

// Update record (with ownership validation)
router.put('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    const { title, organization, location, start_date, end_date, description, linked_skills, projects, status } = req.body;

    // Fetch existing record to validate ownership
    const existingRecord = await Record.findById(req.params.id);

    if (!existingRecord) {
      return res.status(404).json({
        error: 'Record not found',
        status: 404,
      });
    }

    // Validate ownership
    if (existingRecord.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This record belongs to another user',
        status: 403,
      });
    }

    const record = await Record.findByIdAndUpdate(
      req.params.id,
      {
        title,
        organization,
        location,
        start_date,
        end_date,
        status,
        description,
        linked_skills,
        projects,
      },
      { new: true, runValidators: true }
    ).populate('linked_skills').populate('evidence_files');

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to update record',
      status: 500,
    });
  }
});

// Delete record (with ownership validation)
router.delete('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token
    
    // Fetch existing record to validate ownership
    const existingRecord = await Record.findById(req.params.id);

    if (!existingRecord) {
      return res.status(404).json({
        error: 'Record not found',
        status: 404,
      });
    }

    // Validate ownership
    if (existingRecord.user_id.toString() !== user_id) {
      return res.status(403).json({
        error: 'Access denied: This record belongs to another user',
        status: 403,
      });
    }

    await Record.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to delete record',
      status: 500,
    });
  }
});

export default router;
