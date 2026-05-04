import express from 'express';
import PDFDocument from 'pdfkit';
import { User, Record, Skill, Evidence } from '../models/index.js';

const router = express.Router();

// Helper function to format dates for PDF
const formatDate = (date) => {
  if (!date) return 'Present';
  const d = new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

// Export portfolio as customized PDF
router.post('/export/pdf', async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { sections = {}, template = 'professional' } = req.body;

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const records = await Record.find({ user_id }).populate('linked_skills').sort({ start_date: -1 });
    const skills = await Skill.find({ user_id }).sort({ skill_name: 1 });
    const evidence = await Evidence.find({ user_id });

    const doc = new PDFDocument({ margin: 50, size: 'letter' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${user.name.replace(/\s+/g, '_')}_Portfolio.pdf"`);
    doc.pipe(res);

    // --- Styling Options based on template ---
    const colors = {
      professional: { primary: '#2563eb', text: '#333333', accent: '#64748b' },
      minimal: { primary: '#000000', text: '#000000', accent: '#666666' },
      detailed: { primary: '#0f172a', text: '#1e293b', accent: '#475569' }
    }[template] || { primary: '#2563eb', text: '#333333', accent: '#64748b' };

    const titleSize = template === 'minimal' ? 20 : 26;
    const headerSize = template === 'minimal' ? 14 : 16;
    const textSize = 11;

    // Helper: Section Divider
    const drawDivider = () => {
      doc.moveDown(0.5);
      if (template !== 'minimal') {
        doc.rect(50, doc.y, 510, 1).fill(colors.accent);
        doc.moveDown(1);
      } else {
        doc.moveDown(0.5);
      }
    };

    // ===== HEADER SUMMARY =====
    if (sections.summary !== false) {
      doc.fontSize(titleSize).fillColor(colors.primary).font('Helvetica-Bold').text(user.name.toUpperCase(), { align: template === 'professional' ? 'center' : 'left' });
      doc.moveDown(0.2);
      doc.fontSize(12).fillColor(colors.accent).font('Helvetica').text(user.email, { align: template === 'professional' ? 'center' : 'left' });
      
      if (user.bio) {
        doc.moveDown(0.5);
        doc.fontSize(textSize).fillColor(colors.text).text(user.bio, { align: template === 'professional' ? 'center' : 'left' });
      }
      doc.moveDown(1);
    }

    // ===== SKILLS =====
    if (sections.skills && skills.length > 0) {
      drawDivider();
      doc.fontSize(headerSize).fillColor(colors.primary).font('Helvetica-Bold').text('SKILLS');
      doc.moveDown(0.5);

      const categorizedSkills = skills.reduce((acc, s) => {
        const cat = s.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s);
        return acc;
      }, {});

      Object.keys(categorizedSkills).forEach(category => {
        doc.fontSize(12).fillColor(colors.text).font('Helvetica-Bold').text(category);
        doc.moveDown(0.2);
        
        let skillLine = '';
        categorizedSkills[category].forEach(s => {
          if (template === 'minimal') {
            skillLine += `${s.skill_name}, `;
          } else {
            skillLine += `${s.skill_name} (${s.skill_level}%), `;
          }
        });
        
        doc.fontSize(textSize).font('Helvetica').fillColor(colors.text).text(skillLine.slice(0, -2));
        doc.moveDown(0.5);
      });
    }

    // ===== INTERNSHIPS & WORK =====
    if (sections.internships) {
      const internships = records.filter(r => r.type === 'internship');
      if (internships.length > 0) {
        drawDivider();
        doc.fontSize(headerSize).fillColor(colors.primary).font('Helvetica-Bold').text('WORK EXPERIENCE');
        doc.moveDown(0.5);

        internships.forEach(item => {
          doc.fontSize(12).fillColor(colors.text).font('Helvetica-Bold').text(item.title, { continued: true });
          doc.font('Helvetica').text(` at ${item.organization}`, { align: 'left' });
          
          const sDate = formatDate(item.start_date);
          const eDate = item.status === 'active' ? 'Present' : formatDate(item.end_date);
          doc.fontSize(10).fillColor(colors.accent).font('Helvetica-Oblique').text(`${sDate} - ${eDate}`);
          doc.moveDown(0.2);
          
          if (item.description) {
            doc.fontSize(textSize).fillColor(colors.text).font('Helvetica').text(item.description, { align: 'justify' });
            doc.moveDown(0.5);
          }
        });
      }
    }

    // ===== CERTIFICATIONS =====
    if (sections.certifications) {
      const certs = records.filter(r => r.type === 'certification');
      if (certs.length > 0) {
        drawDivider();
        doc.fontSize(headerSize).fillColor(colors.primary).font('Helvetica-Bold').text('CERTIFICATIONS');
        doc.moveDown(0.5);

        certs.forEach(item => {
          doc.fontSize(12).fillColor(colors.text).font('Helvetica-Bold').text(item.title);
          doc.fontSize(10).fillColor(colors.accent).font('Helvetica').text(`${item.organization} | ${formatDate(item.start_date)}`);
          doc.moveDown(0.3);
        });
      }
    }

    // ===== EVIDENCE & PROJECTS =====
    if (sections.evidence && evidence.length > 0) {
      drawDivider();
      doc.fontSize(headerSize).fillColor(colors.primary).font('Helvetica-Bold').text('PROJECTS & ARTIFACTS');
      doc.moveDown(0.5);

      evidence.forEach(item => {
        doc.fontSize(12).fillColor(colors.text).font('Helvetica-Bold').text(item.title);
        if (item.url) {
          doc.fontSize(10).fillColor(colors.primary).text(item.url, { link: item.url, underline: true });
        }
        if (template === 'detailed' && item.description) {
          doc.moveDown(0.2);
          doc.fontSize(textSize).fillColor(colors.text).font('Helvetica').text(item.description);
        }
        doc.moveDown(0.5);
      });
    }

    // Footer
    const pageCount = doc.bufferedPageRange ? doc.bufferedPageRange().count : 1;
    doc.fontSize(9).fillColor(colors.accent).font('Helvetica-Oblique').text(`Generated securely by Career OS · ${new Date().toLocaleDateString()}`, 50, doc.page.height - 50, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate PDF' });
  }
});

export default router;
