import express from 'express';
import { Op } from 'sequelize';
import { 
  sequelize,
  Institution, 
  Course, 
  TneaCutoff, 
  DataSource,
  District 
} from '../database/database.js';

const router = express.Router();

// ── GET /api/tnea/cutoffs ─────────────────────────────────────────────────────
// Query multi-year cutoffs with comprehensive filters
router.get('/cutoffs', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const offset = (page - 1) * limit;

    const { 
      institution_id, 
      tnea_code, 
      college_code,
      course_id, 
      course_code, 
      year, 
      round, 
      community,
      min_cutoff,
      max_cutoff 
    } = req.query;

    const where = {};

    if (year) where.academic_year = parseInt(year, 10);
    if (round && round !== 'All') where.round = round;
    if (community && community !== 'All') where.community = community;
    if (min_cutoff) where.cutoff = { ...where.cutoff, [Op.gte]: parseFloat(min_cutoff) };
    if (max_cutoff) where.cutoff = { ...where.cutoff, [Op.lte]: parseFloat(max_cutoff) };

    const institutionWhere = {};
    const code = tnea_code || college_code;
    if (code) institutionWhere.tnea_code = code;
    if (institution_id) institutionWhere.id = parseInt(institution_id, 10);

    const courseWhere = {};
    if (course_code && course_code !== 'All') courseWhere.code = course_code;
    if (course_id) courseWhere.id = parseInt(course_id, 10);

    const { count, rows } = await TneaCutoff.findAndCountAll({
      where,
      include: [
        {
          model: Institution,
          as: 'institution',
          where: Object.keys(institutionWhere).length > 0 ? institutionWhere : undefined,
          attributes: ['id', 'tnea_code', 'name', 'short_name', 'city', 'district_id', 'institution_type', 'autonomous']
        },
        {
          model: Course,
          as: 'course',
          where: Object.keys(courseWhere).length > 0 ? courseWhere : undefined,
          attributes: ['id', 'code', 'name', 'degree']
        },
        {
          model: DataSource,
          as: 'source',
          attributes: ['id', 'source_name', 'url', 'academic_year']
        }
      ],
      order: [
        ['academic_year', 'DESC'],
        ['cutoff', 'DESC']
      ],
      limit,
      offset
    });

    return res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error querying TNEA cutoffs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch TNEA cutoffs', error: error.message });
  }
});

// ── GET /api/tnea/cutoffs/history ─────────────────────────────────────────────
// Multi-year comparison trajectory for a specific college + course + community
router.get('/cutoffs/history', async (req, res) => {
  try {
    const { tnea_code, institution_id, course_code, community, round } = req.query;

    if (!course_code) {
      return res.status(400).json({ success: false, message: 'course_code is required' });
    }

    const instWhere = {};
    if (tnea_code) instWhere.tnea_code = tnea_code;
    if (institution_id) instWhere.id = parseInt(institution_id, 10);

    const targetRound = round || 'Round 1';
    const targetCommunity = community || 'OC';

    const cutoffs = await TneaCutoff.findAll({
      where: {
        round: targetRound,
        community: targetCommunity
      },
      include: [
        {
          model: Institution,
          as: 'institution',
          where: Object.keys(instWhere).length > 0 ? instWhere : undefined,
          attributes: ['id', 'tnea_code', 'name', 'short_name']
        },
        {
          model: Course,
          as: 'course',
          where: { code: course_code },
          attributes: ['id', 'code', 'name']
        },
        {
          model: DataSource,
          as: 'source',
          attributes: ['source_name', 'url']
        }
      ],
      order: [['academic_year', 'ASC']]
    });

    const trajectory = cutoffs.map(c => ({
      year: c.academic_year,
      cutoff: c.cutoff,
      opening_rank: c.opening_rank,
      closing_rank: c.closing_rank,
      round: c.round,
      community: c.community,
      verified: c.verified,
      source: c.source?.source_name
    }));

    return res.json({
      success: true,
      parameters: {
        tnea_code,
        course_code,
        community: targetCommunity,
        round: targetRound
      },
      trajectory
    });
  } catch (error) {
    console.error('Error fetching cutoff history trajectory:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch trajectory', error: error.message });
  }
});

// ── GET /api/tnea/rounds ──────────────────────────────────────────────────────
router.get('/rounds', (req, res) => {
  return res.json({
    success: true,
    data: {
      academic_years: [2025, 2024, 2023, 2022],
      counseling_rounds: ['Round 1', 'Round 2', 'Round 3'],
      communities: [
        { code: 'OC', label: 'Open Competition (OC)' },
        { code: 'BC', label: 'Backward Class (BC)' },
        { code: 'BCM', label: 'Backward Class Muslim (BCM)' },
        { code: 'MBC', label: 'Most Backward Class & DNC (MBC)' },
        { code: 'SC', label: 'Scheduled Caste (SC)' },
        { code: 'SCA', label: 'Scheduled Caste Arunthathiyar (SCA)' },
        { code: 'ST', label: 'Scheduled Tribe (ST)' }
      ],
      quotas: ['TNEA Government Quota (General Academic)', '7.5% Government School Quota', 'Vocational Quota']
    }
  });
});

// ── GET /api/data-status ─────────────────────────────────────────────────────
// Real-time metadata on database coverage, verified records, and freshness
router.get('/data-status', async (req, res) => {
  try {
    const [collegeCount, courseCount, cutoffCount, sources] = await Promise.all([
      Institution.count(),
      Course.count(),
      TneaCutoff.count(),
      DataSource.findAll({ attributes: ['id', 'source_name', 'source_type', 'academic_year', 'url', 'status'] })
    ]);

    const latestCutoff = await TneaCutoff.findOne({
      order: [['id', 'DESC']]
    });

    return res.json({
      success: true,
      scope: 'Tamil Nadu Engineering Admissions (TNEA) Only',
      statistics: {
        total_institutions: collegeCount,
        total_courses: courseCount,
        total_cutoffs: cutoffCount,
        academic_years_covered: [2022, 2023, 2024, 2025],
        counseling_rounds: ['Round 1', 'Round 2', 'Round 3'],
        communities_tracked: ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'],
        data_freshness: latestCutoff?.created_at || new Date(),
        sources_count: sources.length
      },
      verified_sources: sources
    });
  } catch (error) {
    console.error('Error fetching data status:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch data status', error: error.message });
  }
});

export default router;
