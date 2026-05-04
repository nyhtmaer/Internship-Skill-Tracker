import express from 'express';
import { Record, Skill } from '../models/index.js';

const router = express.Router();

const formatRecordResponse = (record) => {
  const recordObj = record.toObject();
  
  // Format period string for UI
  if (recordObj.start_date) {
    const start = new Date(recordObj.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const end = recordObj.end_date 
      ? new Date(recordObj.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Present';
    recordObj.period = `${start} - ${end}`;
  }
  
  // Flatten linked_skills to strings (skill names) as expected by frontend
  if (recordObj.linked_skills) {
    recordObj.skills = recordObj.linked_skills.map(skill => skill.skill_name || skill);
  }
  
  // Map fields to match UI keys
  recordObj.company = recordObj.organization;
  recordObj.role = recordObj.title;
  recordObj.issuer = recordObj.organization;
  recordObj.name = recordObj.title;
  
  // Format dates for certifications
  if (recordObj.start_date) {
    recordObj.issueDate = new Date(recordObj.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (recordObj.end_date) {
    recordObj.expiryDate = new Date(recordObj.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return recordObj;
};

// Create a new record
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const user_id = req.user.user_id;

    if (!data.type || !data.title || !data.organization || !data.start_date) {
      return res.status(400).json({
        error: 'type, title, organization, and start_date are required',
        status: 400,
      });
    }

    const record = new Record({
      ...data,
      user_id,
      end_date: data.end_date || null,
      description: data.description || '',
      linked_skills: data.linked_skills || [],
      evidence_file: data.evidence_file || null,
    });

    await record.save();
    await record.populate('linked_skills', 'skill_name');

    res.status(201).json({
      success: true,
      data: formatRecordResponse(record),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to create record',
      status: 500,
    });
  }
});

// Get all records
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.user_id;
    
    const records = await Record.find({ user_id })
      .populate('linked_skills', 'skill_name')
      .sort({ start_date: -1 });

    const formattedRecords = records.map(formatRecordResponse);

    res.status(200).json({
      success: true,
      data: formattedRecords,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Failed to fetch records',
      status: 500,
    });
  }
});

// Get single record
router.get('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const record = await Record.findById(req.params.id).populate('linked_skills', 'skill_name');

    if (!record) return res.status(404).json({ error: 'Record not found', status: 404 });
    if (record.user_id.toString() !== user_id) return res.status(403).json({ error: 'Access denied', status: 403 });

    res.status(200).json({
      success: true,
      data: formatRecordResponse(record),
    });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Update record
router.put('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const existingRecord = await Record.findById(req.params.id);

    if (!existingRecord) return res.status(404).json({ error: 'Record not found', status: 404 });
    if (existingRecord.user_id.toString() !== user_id) return res.status(403).json({ error: 'Access denied', status: 403 });

    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('linked_skills', 'skill_name');

    res.status(200).json({
      success: true,
      data: formatRecordResponse(record),
    });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 500 });
  }
});

// Delete record
router.delete('/:id', async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const existingRecord = await Record.findById(req.params.id);

    if (!existingRecord) return res.status(404).json({ error: 'Record not found', status: 404 });
    if (existingRecord.user_id.toString() !== user_id) return res.status(403).json({ error: 'Access denied', status: 403 });

    await Record.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message, status: 500 });
  }
});

export default router;
