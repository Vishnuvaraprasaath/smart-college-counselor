import express from 'express';
import { dbRun, dbGet, dbAll } from '../database/database.js';
import { calculateRecommendations } from '../services/recommendationEngine.js';
import { generateRecommendationExplanation } from '../services/aiCounselorService.js';

const router = express.Router();

// POST /api/analyze - Complete Profile Analysis & Recommendation Engine Trigger
router.post('/analyze', async (req, res) => {
  try {
    const {
      name = 'Student',
      cutoff,
      math,
      physics,
      chemistry,
      percentage,
      entrance_score,
      category = 'BC',
      courses = ['ECE'],
      location = 'Coimbatore',
      budget,
      interests = []
    } = req.body;

    if (cutoff === undefined || cutoff === null || isNaN(parseFloat(cutoff))) {
      return res.status(400).json({ error: 'Valid 12th cutoff score is required (e.g. 187.5)' });
    }

    const cutoffNum = parseFloat(cutoff);
    if (cutoffNum < 0 || cutoffNum > 200) {
      return res.status(400).json({ error: 'Cutoff score must be between 0 and 200' });
    }

    // 1. Save student record to DB (including preferred_courses & preferred_location)
    const studentResult = await dbRun(
      `INSERT INTO students (name, cutoff, math, physics, chemistry, percentage, entrance_score, category, budget, location, interests, preferred_courses, preferred_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        cutoffNum,
        math ? parseFloat(math) : null,
        physics ? parseFloat(physics) : null,
        chemistry ? parseFloat(chemistry) : null,
        percentage ? parseFloat(percentage) : null,
        entrance_score ? parseFloat(entrance_score) : null,
        category,
        budget ? parseFloat(budget) : null,
        location,
        JSON.stringify(interests),
        JSON.stringify(courses),
        location
      ]
    );

    const studentId = studentResult.lastID;

    // 2. Execute Deterministic Recommendation Engine
    const profilePayload = {
      studentId,
      cutoff: cutoffNum,
      category,
      courses,
      location,
      budget,
      interests
    };

    const analysisResult = await calculateRecommendations(profilePayload);

    // 3. Generate AI Explanation
    let aiExplanation = '';
    try {
      aiExplanation = await generateRecommendationExplanation(analysisResult);
    } catch (aiErr) {
      console.error('AI Explanation Error:', aiErr);
      aiExplanation = 'Recommendations calculated based on historical admission data. AI counselling summary is temporarily unavailable.';
    }

    // 4. Log recommendations into database (storing both explanation text and JSON reasons)
    for (const rec of analysisResult.recommendations.slice(0, 10)) {
      await dbRun(
        `INSERT INTO recommendations (student_id, college_id, course_id, suitability_score, chance_category, cutoff_delta, explanation, reasons)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          rec.college_id,
          rec.course_id,
          rec.suitability_score,
          rec.chance_category,
          rec.cutoff_delta,
          rec.reasons.join(' '),
          JSON.stringify(rec.reasons)
        ]
      );
    }

    res.json({
      success: true,
      studentId,
      studentProfile: {
        name,
        cutoff: cutoffNum,
        category,
        courses,
        location,
        budget,
        interests
      },
      aiExplanation,
      summary: analysisResult.summary,
      categorized: analysisResult.categorized,
      recommendations: analysisResult.recommendations
    });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: 'Failed to process admission counseling analysis: ' + error.message });
  }
});

// GET /api/history & GET /api/analyses - Retrieve all previous analyses
router.get(['/history', '/analyses'], async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT 
        s.id,
        s.name,
        s.cutoff,
        s.category,
        s.preferred_courses,
        s.preferred_location,
        s.location,
        s.budget,
        s.interests,
        s.created_at,
        COUNT(DISTINCT r.id) AS recommendation_count,
        COUNT(DISTINCT CASE WHEN r.chance_category = 'SAFE' THEN r.id END) AS safe_count,
        COUNT(DISTINCT CASE WHEN r.chance_category = 'MODERATE' THEN r.id END) AS moderate_count,
        COUNT(DISTINCT CASE WHEN r.chance_category = 'AMBITIOUS' THEN r.id END) AS ambitious_count,
        GROUP_CONCAT(DISTINCT co.code) AS recommendation_course_codes
      FROM students s
      LEFT JOIN recommendations r ON s.id = r.student_id
      LEFT JOIN courses co ON r.course_id = co.id
      GROUP BY s.id
      ORDER BY s.created_at DESC, s.id DESC
    `);

    const history = rows.map(row => {
      let courses = [];
      try {
        if (row.preferred_courses) {
          courses = JSON.parse(row.preferred_courses);
        }
      } catch {
        courses = String(row.preferred_courses).split(',').map(s => s.trim()).filter(Boolean);
      }
      if (!Array.isArray(courses) || courses.length === 0) {
        if (row.recommendation_course_codes) {
          courses = row.recommendation_course_codes.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          courses = ['ECE'];
        }
      }

      let interests = [];
      try {
        if (row.interests) {
          interests = JSON.parse(row.interests);
        }
      } catch {
        interests = [];
      }

      return {
        id: row.id,
        student_id: row.id,
        name: row.name || 'Student',
        cutoff: parseFloat(row.cutoff),
        category: row.category || 'BC',
        preferred_courses: courses,
        preferred_location: row.preferred_location || row.location || 'Tamil Nadu',
        location: row.preferred_location || row.location || 'Tamil Nadu',
        budget: row.budget ? parseFloat(row.budget) : null,
        interests: Array.isArray(interests) ? interests : [],
        created_at: row.created_at,
        recommendation_count: parseInt(row.recommendation_count) || 0,
        safe_count: parseInt(row.safe_count) || 0,
        moderate_count: parseInt(row.moderate_count) || 0,
        ambitious_count: parseInt(row.ambitious_count) || 0
      };
    });

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('Error in /api/history:', error);
    res.status(500).json({ error: 'Failed to fetch analysis history: ' + error.message });
  }
});

// GET /api/history/:studentId & GET /api/recommendations/:studentId - Reopen a specific stored analysis
router.get(['/history/:studentId', '/analyses/:studentId', '/recommendations/:studentId'], async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Valid student/analysis ID is required' });
    }

    const student = await dbGet(`SELECT * FROM students WHERE id = ?`, [studentId]);
    if (!student) {
      return res.status(404).json({ error: 'Student analysis record not found' });
    }

    const recs = await dbAll(
      `SELECT 
         r.id,
         r.student_id,
         r.college_id,
         r.course_id,
         r.suitability_score,
         r.chance_category,
         r.cutoff_delta,
         r.explanation,
         r.reasons,
         r.created_at,
         c.name AS college_name,
         c.code AS college_code,
         c.city,
         c.district,
         c.state,
         c.type,
         c.fees,
         c.hostel_available,
         c.hostel_fee,
         c.facilities,
         c.accreditation,
         c.ranking,
         c.placement_rate,
         c.avg_package,
         co.name AS course_name,
         co.code AS course_code,
         ch.cutoff AS historical_cutoff
       FROM recommendations r
       JOIN colleges c ON r.college_id = c.id
       JOIN courses co ON r.course_id = co.id
       LEFT JOIN cutoff_history ch ON ch.college_id = r.college_id AND ch.course_id = r.course_id AND ch.category = ? AND ch.year = 2025
       WHERE r.student_id = ?
       ORDER BY r.suitability_score DESC`,
      [student.category || 'BC', studentId]
    );

    let parsedCourses = [];
    try {
      if (student.preferred_courses) {
        parsedCourses = JSON.parse(student.preferred_courses);
      }
    } catch {
      parsedCourses = String(student.preferred_courses).split(',').map(s => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(parsedCourses) || parsedCourses.length === 0) {
      parsedCourses = [...new Set(recs.map(r => r.course_code).filter(Boolean))];
      if (parsedCourses.length === 0) parsedCourses = ['ECE'];
    }

    let parsedInterests = [];
    try {
      if (student.interests) {
        parsedInterests = JSON.parse(student.interests);
      }
    } catch {
      parsedInterests = [];
    }

    const studentCutoff = parseFloat(student.cutoff);

    const formattedRecs = recs.map(r => {
      const histCutoff = r.historical_cutoff != null 
        ? parseFloat(r.historical_cutoff) 
        : (Math.round((studentCutoff - (r.cutoff_delta || 0)) * 100) / 100);
      const delta = r.cutoff_delta != null 
        ? parseFloat(r.cutoff_delta) 
        : (Math.round((studentCutoff - histCutoff) * 100) / 100);

      let reasonsList = [];
      if (r.reasons) {
        try {
          const parsed = JSON.parse(r.reasons);
          if (Array.isArray(parsed)) reasonsList = parsed;
        } catch {
          reasonsList = [r.reasons];
        }
      }
      if (reasonsList.length === 0 && r.explanation) {
        reasonsList = r.explanation
          .split(/(?<=\.)\s+/)
          .map(s => s.trim())
          .filter(Boolean);
      }
      if (reasonsList.length === 0) {
        reasonsList = [
          `Admission recommendation based on historical ${student.category} cutoff data.`,
          `Offered by ${r.college_name}.`
        ];
      }

      let cutoffScore = 85 + (delta * 3.5);
      cutoffScore = Math.max(0, Math.min(100, Math.round(cutoffScore * 10) / 10));

      const budgetScore = student.budget && r.fees 
        ? (r.fees <= student.budget ? 100 : Math.max(20, Math.round(100 - ((r.fees - student.budget) / 2000))))
        : 100;

      const qualityScore = Math.max(30, Math.min(100, Math.round(100 - ((r.ranking || 100) * 0.4))));

      return {
        college_id: r.college_id,
        college_name: r.college_name,
        college_code: r.college_code,
        city: r.city,
        district: r.district,
        state: r.state,
        type: r.type,
        fees: r.fees ? parseFloat(r.fees) : null,
        hostel_available: Boolean(r.hostel_available),
        hostel_fee: r.hostel_fee ? parseFloat(r.hostel_fee) : null,
        facilities: r.facilities,
        accreditation: r.accreditation,
        ranking: r.ranking,
        placement_rate: r.placement_rate,
        avg_package: r.avg_package,
        course_id: r.course_id,
        course_name: r.course_name,
        course_code: r.course_code,
        historical_cutoff: histCutoff,
        student_cutoff: studentCutoff,
        cutoff_delta: delta,
        chance_category: r.chance_category,
        suitability_score: Math.round(r.suitability_score),
        fit_breakdown: {
          cutoff_fit: Math.round(cutoffScore),
          course_fit: 100,
          location_fit: 100,
          budget_fit: budgetScore,
          quality_fit: qualityScore,
          interest_fit: 85
        },
        breakdown: {
          cutoff: {
            student: studentCutoff,
            historical: histCutoff,
            delta: delta,
            score: cutoffScore,
            weight: 55,
            weightedContribution: Math.round(cutoffScore * 0.55 * 10) / 10
          },
          coursePreference: {
            score: 100,
            weight: 15,
            weightedContribution: 15,
            rank: 1
          },
          location: {
            score: 100,
            weight: 10,
            weightedContribution: 10
          },
          budget: {
            score: budgetScore,
            weight: 10,
            weightedContribution: Math.round(budgetScore * 0.10 * 10) / 10,
            maxBudget: student.budget ? parseFloat(student.budget) : null,
            collegeFee: r.fees ? parseFloat(r.fees) : 0
          },
          quality: {
            score: qualityScore,
            weight: 5,
            weightedContribution: Math.round(qualityScore * 0.05 * 10) / 10,
            ranking: r.ranking,
            placementRate: r.placement_rate
          },
          interest: {
            score: 85,
            weight: 5,
            weightedContribution: 4.3
          }
        },
        reasons: reasonsList
      };
    });

    const safeOptions = formattedRecs.filter(r => r.chance_category === 'SAFE');
    const moderateOptions = formattedRecs.filter(r => r.chance_category === 'MODERATE');
    const ambitiousOptions = formattedRecs.filter(r => r.chance_category === 'AMBITIOUS');

    res.json({
      success: true,
      studentId: student.id,
      studentProfile: {
        name: student.name || 'Student',
        cutoff: studentCutoff,
        category: student.category || 'BC',
        courses: parsedCourses,
        location: student.preferred_location || student.location || 'Coimbatore',
        budget: student.budget ? parseFloat(student.budget) : null,
        interests: Array.isArray(parsedInterests) ? parsedInterests : []
      },
      aiExplanation: `Historical admission counselling analysis for ${student.name || 'Student'} (12th Cutoff: ${studentCutoff} • ${student.category || 'BC'}). Reopened directly from stored database recommendations without recomputation.`,
      summary: {
        totalMatches: formattedRecs.length,
        safeCount: safeOptions.length,
        moderateCount: moderateOptions.length,
        ambitiousCount: ambitiousOptions.length
      },
      categorized: {
        safe: safeOptions,
        moderate: moderateOptions,
        ambitious: ambitiousOptions
      },
      recommendations: formattedRecs,
      student: student
    });
  } catch (error) {
    console.error('Error in fetching historical analysis:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis: ' + error.message });
  }
});

export default router;
