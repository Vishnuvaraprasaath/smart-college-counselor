import express from 'express';
import { dbAll, dbGet } from '../database/database.js';

const router = express.Router();

// GET /api/courses - List all engineering programs
router.get('/courses', async (req, res) => {
  try {
    const courses = await dbAll(`SELECT * FROM courses ORDER BY name ASC`);
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/courses/:id - Single course overview, skills, careers & colleges offering it
router.get('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await dbGet(`SELECT * FROM courses WHERE id = ? OR code = ?`, [courseId, courseId.toUpperCase()]);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Fetch colleges offering this course
    const offeringColleges = await dbAll(
      `SELECT c.id, c.name, c.code, c.city, c.type, c.fees, c.ranking, c.placement_rate, cc.seats
       FROM college_courses cc
       JOIN colleges c ON cc.college_id = c.id
       WHERE cc.course_id = ?
       ORDER BY c.ranking ASC`,
      [course.id]
    );

    res.json({
      course,
      offeringColleges
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
