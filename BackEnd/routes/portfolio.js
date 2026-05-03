import express from 'express';
import PDFDocument from 'pdfkit';
import { User, Record, Skill } from '../models/index.js';

const router = express.Router();

// Helper function to format dates for PDF
const formatDate = (date) => {
  if (!date) return 'Present';
  const d = new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

// Export portfolio as PDF
router.get('/export', async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT token

    // Fetch user data
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        status: 404,
      });
    }

    // Fetch user's records and skills
    const records = await Record.find({ user_id })
      .populate('linked_skills')
      .sort({ start_date: -1 });

    const skills = await Skill.find({ user_id }).sort({ skill_name: 1 });

    // Create PDF document
    const doc = new PDFDocument({
      margin: 50,
      size: 'letter',
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="portfolio.pdf"');

    // Pipe document to response
    doc.pipe(res);

    // ===== PDF CONTENT =====

    // Title: User Name
    doc.fontSize(24).font('Helvetica-Bold').text(user.name, { align: 'center' });
    doc.moveDown(0.5);

    // Bio if available
    if (user.bio) {
      doc.fontSize(12).font('Helvetica').text(user.bio, { align: 'center' });
      doc.moveDown(1);
    } else {
      doc.moveDown(1);
    }

    // Divider line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.8);

    // ===== PROFESSIONAL RECORDS SECTION =====
    if (records && records.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Professional Records');
      doc.moveDown(0.5);

      records.forEach((record, index) => {
        // Record type and title
        doc.fontSize(11).font('Helvetica-Bold').text(`${record.type.charAt(0).toUpperCase() + record.type.slice(1)}: ${record.title}`);

        // Organization and dates
        const startDate = formatDate(record.start_date);
        const endDate = formatDate(record.end_date);
        doc.fontSize(10).font('Helvetica').text(`${record.organization} | ${startDate} - ${endDate}`);

        // Description if available
        if (record.description) {
          doc.fontSize(10).font('Helvetica').text(record.description, { width: 450 });
        }

        // Linked skills if available
        if (record.linked_skills && record.linked_skills.length > 0) {
          const skillNames = record.linked_skills.map((s) => s.skill_name).join(', ');
          doc.fontSize(9).font('Helvetica-Oblique').text(`Skills: ${skillNames}`);
        }

        // Add spacing between records
        if (index < records.length - 1) {
          doc.moveDown(0.5);
        } else {
          doc.moveDown(1);
        }
      });
    } else {
      doc.fontSize(11).font('Helvetica').text('No professional records added yet.');
      doc.moveDown(1);
    }

    // Divider line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.8);

    // ===== SKILLS SECTION =====
    if (skills && skills.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Skills');
      doc.moveDown(0.5);

      // Create table for skills
      skills.forEach((skill) => {
        const levelText = '●'.repeat(skill.skill_level) + '○'.repeat(5 - skill.skill_level);
        doc.fontSize(10).font('Helvetica').text(`${skill.skill_name.charAt(0).toUpperCase() + skill.skill_name.slice(1)}`, { width: 300, continued: true });
        doc.font('Helvetica').text(` ${levelText}`, { align: 'right' });
      });

      doc.moveDown(1);
    } else {
      doc.fontSize(11).font('Helvetica').text('No skills added yet.');
      doc.moveDown(1);
    }

    // Divider line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.8);

    // Footer with generation timestamp
    const generatedDate = new Date().toLocaleString();
    doc.fontSize(8).font('Helvetica-Oblique').text(`Generated on ${generatedDate}`, { align: 'center', color: '#666' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate portfolio PDF',
      status: 500,
    });
  }
});

export default router;
