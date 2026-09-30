import express from 'express';
import { dbAll, dbGet } from '../database/database.js';

const router = express.Router();

// Normalize a location string: trim whitespace, collapse internal spaces,
// and strip a trailing " District" or " district" suffix.
function normalizeLocation(raw) {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*district\s*$/i, '')
    .trim();
}

// GET /api/colleges - List colleges with optional search/filter
router.get('/colleges', async (req, res) => {
  try {
    const { city, type, search } = req.query;
    let sql = `SELECT * FROM colleges WHERE 1=1`;
    const params = [];

    if (city && city !== 'Any location' && city !== 'Any') {
      const loc = normalizeLocation(city);
      // Partial, case-insensitive match against both city and district columns.
      // Using LIKE with leading+trailing wildcards so "Coimbatore" matches
      // stored values like "Coimbatore" regardless of extra surrounding text,
      // but a deliberate LIKE guard (`loc` must be non-empty after normalise)
      // prevents accidental full-table matches.
      if (loc.length > 0) {
        sql += ` AND (LOWER(city) LIKE LOWER(?) OR LOWER(district) LIKE LOWER(?))`;
        params.push(`%${loc}%`, `%${loc}%`);
      }
    }
    if (type) {
      sql += ` AND LOWER(type) LIKE LOWER(?)`;
      params.push(`%${type}%`);
    }
    if (search) {
      sql += ` AND (LOWER(name) LIKE LOWER(?) OR LOWER(code) LIKE LOWER(?) OR LOWER(city) LIKE LOWER(?))`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY CASE WHEN ranking IS NULL OR ranking = 0 THEN 1 ELSE 0 END, ranking ASC, name ASC`;
    const colleges = await dbAll(sql, params);

    res.json({ colleges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/colleges/:id - Single college detail page data
router.get('/colleges/:id', async (req, res) => {
  try {
    const collegeId = req.params.id;
    const { cutoff = 187.5, category = 'BC' } = req.query;

    const college = await dbGet(`SELECT * FROM colleges WHERE id = ?`, [collegeId]);
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    // Fetch offered courses and historical cutoffs
    const courses = await dbAll(
      `SELECT cc.*, co.name as course_name, co.code as course_code, co.description
       FROM college_courses cc
       JOIN courses co ON cc.course_id = co.id
       WHERE cc.college_id = ?`,
      [collegeId]
    );

    // Fetch cutoff history for all courses in this college
    const cutoffs = await dbAll(
      `SELECT ch.*, co.code as course_code
       FROM cutoff_history ch
       JOIN courses co ON ch.course_id = co.id
       WHERE ch.college_id = ? AND ch.category = ?
       ORDER BY ch.year ASC`,
      [collegeId, category]
    );

    // Group cutoffs by course for chart rendering
    const cutoffTrendsByCourse = {};
    cutoffs.forEach(item => {
      if (!cutoffTrendsByCourse[item.course_code]) {
        cutoffTrendsByCourse[item.course_code] = [];
      }
      cutoffTrendsByCourse[item.course_code].push({
        year: item.year,
        cutoff: item.cutoff,
        student_cutoff: parseFloat(cutoff)
      });
    });

    res.json({
      college,
      courses,
      category,
      cutoffTrendsByCourse
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/compare - Side-by-side comparison matrix for up to 3 colleges
router.get('/compare', async (req, res) => {
  try {
    const { ids, course = 'ECE', category = 'BC', cutoff = 187.5 } = req.query;
    if (!ids) {
      return res.status(400).json({ error: 'Please specify college IDs to compare (e.g. ?ids=1,2,3)' });
    }

    const idList = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)).slice(0, 3);
    if (idList.length === 0) {
      return res.status(400).json({ error: 'No valid college IDs provided' });
    }

    const collegesComparison = [];

    for (const collegeId of idList) {
      const col = await dbGet(`SELECT * FROM colleges WHERE id = ?`, [collegeId]);
      if (!col) continue;

      // Find course cutoff history
      const cutoffRow = await dbGet(
        `SELECT ch.cutoff, ch.year
         FROM cutoff_history ch
         JOIN courses co ON ch.course_id = co.id
         WHERE ch.college_id = ? AND (co.code = ? OR co.name = ?) AND ch.category = ? AND ch.year = 2025`,
        [collegeId, course, course, category]
      );

      const studentCutoff = parseFloat(cutoff);
      const histCutoff = cutoffRow ? parseFloat(cutoffRow.cutoff) : null;
      const delta = histCutoff !== null ? Math.round((studentCutoff - histCutoff) * 100) / 100 : null;

      let chanceCategory = 'N/A';
      if (delta !== null) {
        if (delta >= 0) chanceCategory = 'SAFE';
        else if (delta >= -3.5) chanceCategory = 'MODERATE';
        else chanceCategory = 'AMBITIOUS';
      }

      collegesComparison.push({
        ...col,
        compared_course: course,
        category,
        historical_cutoff_2025: histCutoff,
        student_cutoff: studentCutoff,
        cutoff_delta: delta,
        chance_category: chanceCategory
      });
    }

    res.json({
      comparison: collegesComparison
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cutoffs - Explore cutoff trend dataset
router.get('/cutoffs', async (req, res) => {
  try {
    const { category = 'BC', course, year = 2025 } = req.query;
    let sql = `
      SELECT ch.*, c.name as college_name, c.city, co.name as course_name, co.code as course_code
      FROM cutoff_history ch
      JOIN colleges c ON ch.college_id = c.id
      JOIN courses co ON ch.course_id = co.id
      WHERE ch.category = ? AND ch.year = ?
    `;
    const params = [category, parseInt(year)];

    if (course) {
      sql += ` AND (co.code = ? OR co.name LIKE ?)`;
      params.push(course, `%${course}%`);
    }

    sql += ` ORDER BY ch.cutoff DESC`;
    const cutoffs = await dbAll(sql, params);

    res.json({ cutoffs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
