import express from 'express';
import { Op } from 'sequelize';
import { 
  sequelize,
  District, 
  Institution, 
  Course, 
  InstitutionCourse, 
  TneaCutoff, 
  DataSource 
} from '../database/database.js';

const router = express.Router();

// ── GET /api/tamilnadu/districts ─────────────────────────────────────────────
// Returns all 38 districts of Tamil Nadu with college counts
router.get('/districts', async (req, res) => {
  try {
    const districts = await District.findAll({
      order: [['name', 'ASC']]
    });

    // Compute college count per district
    const counts = await Institution.findAll({
      attributes: ['district_id', [sequelize.fn('COUNT', sequelize.col('id')), 'college_count']],
      group: ['district_id']
    });

    const countMap = {};
    counts.forEach(c => {
      countMap[c.district_id] = parseInt(c.get('college_count'), 10);
    });

    const result = districts.map(d => ({
      id: d.id,
      name: d.name,
      headquarters: d.headquarters,
      region: d.region,
      college_count: countMap[d.id] || 0
    }));

    return res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    console.error('Error fetching TN districts:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch Tamil Nadu districts', error: error.message });
  }
});

// ── GET /api/tamilnadu/colleges & /institutions ──────────────────────────────
// Paginated, searchable, filterable list of Tamil Nadu institutions
router.get(['/colleges', '/institutions'], async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const { search, district, district_id, type, autonomous, course, sort, order } = req.query;

    const where = {};

    // Search filter across name, short_name, tnea_code, city
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: q } },
        { short_name: { [Op.like]: q } },
        { tnea_code: { [Op.like]: q } },
        { city: { [Op.like]: q } }
      ];
    }

    // District filter
    if (district_id) {
      where.district_id = parseInt(district_id, 10);
    } else if (district && district !== 'All') {
      const dist = await District.findOne({ where: { name: district } });
      if (dist) where.district_id = dist.id;
    }

    // Type filter (Government, Government Aided, Self Financing)
    if (type && type !== 'All') {
      where.institution_type = { [Op.like]: `%${type}%` };
    }

    // Autonomous filter
    if (autonomous !== undefined && autonomous !== '' && autonomous !== 'All') {
      where.autonomous = autonomous === 'true' || autonomous === '1' || autonomous === true;
    }

    // Course filter: filter colleges offering specific course code
    const include = [
      {
        model: District,
        as: 'district',
        attributes: ['id', 'name', 'region']
      }
    ];

    if (course && course !== 'All') {
      include.push({
        model: InstitutionCourse,
        as: 'courses',
        required: true,
        where: { course_code: course },
        attributes: ['id', 'course_code', 'intake', 'annual_fee']
      });
    } else {
      include.push({
        model: InstitutionCourse,
        as: 'courses',
        required: false,
        attributes: ['id', 'course_code', 'intake', 'annual_fee']
      });
    }

    // Sorting
    let orderClause = [[sequelize.literal('CASE WHEN Institution.ranking IS NULL OR Institution.ranking = 0 THEN 1 ELSE 0 END'), 'ASC'], ['ranking', 'ASC'], ['name', 'ASC']];
    if (sort === 'name') {
      orderClause = [['name', order === 'desc' ? 'DESC' : 'ASC']];
    } else if (sort === 'ranking') {
      orderClause = [[sequelize.literal('CASE WHEN Institution.ranking IS NULL OR Institution.ranking = 0 THEN 1 ELSE 0 END'), 'ASC'], ['ranking', order === 'desc' ? 'DESC' : 'ASC'], ['name', 'ASC']];
    } else if (sort === 'placement') {
      orderClause = [[sequelize.literal('CASE WHEN Institution.placement_rate IS NULL THEN 1 ELSE 0 END'), 'ASC'], ['placement_rate', order === 'asc' ? 'ASC' : 'DESC']];
    } else if (sort === 'tnea_code') {
      orderClause = [['tnea_code', order === 'desc' ? 'DESC' : 'ASC']];
    }

    const { count, rows } = await Institution.findAndCountAll({
      where,
      include,
      order: orderClause,
      limit,
      offset,
      distinct: true
    });

    // Format response with verified badges and course counts
    const data = rows.map(inst => {
      const json = inst.toJSON();
      return {
        id: json.id,
        tnea_code: json.tnea_code,
        name: json.name,
        short_name: json.short_name,
        institution_type: json.institution_type,
        ownership: json.ownership,
        district_id: json.district_id,
        district_name: json.district?.name || 'Tamil Nadu',
        region: json.district?.region || 'Tamil Nadu',
        city: json.city,
        address: json.address,
        pincode: json.pincode,
        university: json.university,
        affiliation: json.affiliation,
        autonomous: json.autonomous,
        established_year: json.established_year,
        accreditation: json.accreditation,
        website: json.website,
        phone: json.phone,
        email: json.email,
        ranking: json.ranking,
        placement_rate: json.placement_rate,
        avg_package: json.avg_package,
        courses_count: json.courses ? json.courses.length : 0,
        courses_offered: json.courses ? json.courses.map(c => c.course_code) : [],
        verified: true,
        data_source: 'Directorate of Technical Education (DoTE) Tamil Nadu',
        last_verified_at: json.last_verified_at || json.updated_at
      };
    });

    return res.json({
      success: true,
      data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching TN colleges:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch colleges', error: error.message });
  }
});

// ── GET /api/tamilnadu/colleges/:id & /institutions/:id ──────────────────────
// Detailed profile for a single college by ID or TNEA Code
router.get(['/colleges/:id', '/institutions/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by PK or tnea_code
    let inst = await Institution.findByPk(id, {
      include: [
        { model: District, as: 'district' },
        { 
          model: InstitutionCourse, 
          as: 'courses',
          include: [{ model: Course, as: 'course' }]
        },
        {
          model: TneaCutoff,
          as: 'tnea_cutoffs',
          limit: 150,
          order: [['academic_year', 'DESC'], ['cutoff', 'DESC']],
          include: [{ model: Course, as: 'course' }, { model: DataSource, as: 'source' }]
        }
      ]
    });

    if (!inst) {
      inst = await Institution.findOne({
        where: { tnea_code: id },
        include: [
          { model: District, as: 'district' },
          { 
            model: InstitutionCourse, 
            as: 'courses',
            include: [{ model: Course, as: 'course' }]
          },
          {
            model: TneaCutoff,
            as: 'tnea_cutoffs',
            limit: 150,
            order: [['academic_year', 'DESC'], ['cutoff', 'DESC']],
            include: [{ model: Course, as: 'course' }, { model: DataSource, as: 'source' }]
          }
        ]
      });
    }

    if (!inst) {
      return res.status(404).json({ success: false, message: `Institution not found with ID or TNEA code: ${id}` });
    }

    const json = inst.toJSON();

    return res.json({
      success: true,
      data: {
        ...json,
        district_name: json.district?.name,
        region: json.district?.region,
        verified: true,
        verification_source: 'Official DoTE Tamil Nadu Engineering Admissions (TNEA)',
        last_verified_at: json.last_verified_at || new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching college detail:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch college profile', error: error.message });
  }
});

// ── GET /api/tamilnadu/colleges/:id/courses ──────────────────────────────────
router.get('/colleges/:id/courses', async (req, res) => {
  try {
    const { id } = req.params;
    const inst = isNaN(id) 
      ? await Institution.findOne({ where: { tnea_code: id } })
      : await Institution.findByPk(id);

    if (!inst) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    const courses = await InstitutionCourse.findAll({
      where: { institution_id: inst.id },
      include: [{ model: Course, as: 'course' }],
      order: [['course_code', 'ASC']]
    });

    return res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    console.error('Error fetching college courses:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch college courses', error: error.message });
  }
});

// ── GET /api/tamilnadu/colleges/:id/cutoffs ──────────────────────────────────
router.get('/colleges/:id/cutoffs', async (req, res) => {
  try {
    const { id } = req.params;
    const { year, round, community, course_id } = req.query;

    const inst = isNaN(id) 
      ? await Institution.findOne({ where: { tnea_code: id } })
      : await Institution.findByPk(id);

    if (!inst) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    const where = { institution_id: inst.id };
    if (year) where.academic_year = parseInt(year, 10);
    if (round) where.round = round;
    if (community) where.community = community;
    if (course_id) where.course_id = parseInt(course_id, 10);

    const cutoffs = await TneaCutoff.findAll({
      where,
      include: [
        { model: Course, as: 'course', attributes: ['id', 'name', 'code', 'degree'] },
        { model: DataSource, as: 'source', attributes: ['id', 'source_name', 'url', 'academic_year'] }
      ],
      order: [
        ['academic_year', 'DESC'],
        ['round', 'ASC'],
        ['cutoff', 'DESC']
      ]
    });

    return res.json({ success: true, count: cutoffs.length, data: cutoffs });
  } catch (error) {
    console.error('Error fetching college cutoffs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch cutoffs', error: error.message });
  }
});

// ── GET /api/tamilnadu/courses ───────────────────────────────────────────────
// List all Tamil Nadu B.E. / B.Tech engineering disciplines
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [['name', 'ASC']]
    });

    // Count offerings for each course
    const counts = await InstitutionCourse.findAll({
      attributes: ['course_id', [sequelize.fn('COUNT', sequelize.col('id')), 'college_count']],
      group: ['course_id']
    });

    const countMap = {};
    counts.forEach(c => {
      countMap[c.course_id] = parseInt(c.get('college_count'), 10);
    });

    const result = courses.map(c => ({
      id: c.id,
      code: c.code,
      name: c.name,
      degree: c.degree,
      discipline: c.discipline,
      specialization: c.specialization,
      duration: c.duration,
      description: c.description,
      overview: c.overview,
      skills: c.skills,
      careers: c.careers,
      industries: c.industries,
      colleges_count: countMap[c.id] || 0
    }));

    return res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    console.error('Error fetching TN courses:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
});

// ── GET /api/tamilnadu/courses/:id/colleges ──────────────────────────────────
router.get('/courses/:id/colleges', async (req, res) => {
  try {
    const { id } = req.params;
    const course = isNaN(id) 
      ? await Course.findOne({ where: { code: id } })
      : await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const offerings = await InstitutionCourse.findAll({
      where: { course_id: course.id },
      include: [
        {
          model: Institution,
          as: 'institution',
          include: [{ model: District, as: 'district' }]
        }
      ],
      order: [[{ model: Institution, as: 'institution' }, 'ranking', 'ASC']]
    });

    const data = offerings.map(o => ({
      institution_id: o.institution?.id,
      tnea_code: o.institution?.tnea_code,
      college_name: o.institution?.name,
      short_name: o.institution?.short_name,
      city: o.institution?.city,
      district: o.institution?.district?.name,
      institution_type: o.institution?.institution_type,
      autonomous: o.institution?.autonomous,
      ranking: o.institution?.ranking,
      placement_rate: o.institution?.placement_rate,
      intake: o.intake,
      annual_fee: o.annual_fee,
      hostel_available: o.hostel_available
    }));

    return res.json({
      success: true,
      course: { id: course.id, code: course.code, name: course.name },
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Error fetching course colleges:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch colleges for course', error: error.message });
  }
});

// ── POST /api/tamilnadu/choice-sheet ────────────────────────────────────────
// Generates or formats a TNEA 3:3:2 choice-filling sequence
router.post('/choice-sheet', async (req, res) => {
  try {
    const { recommendations = [], studentName = 'Student', cutoff, category = 'BC' } = req.body;

    let pool = Array.isArray(recommendations) ? [...recommendations] : [];
    if (pool.length === 0 && cutoff !== undefined && cutoff !== null) {
      // Calculate from recommendation engine if not provided
      const { calculateRecommendations } = await import('../services/recommendationEngine.js');
      const recResult = await calculateRecommendations({
        cutoff: parseFloat(cutoff),
        category,
        courses: req.body.courses || ['CSE', 'ECE'],
        location: req.body.location || 'Coimbatore',
        budget: req.body.budget || 150000
      });
      pool = recResult.recommendations || [];
    }

    const ambitiousPool = pool.filter(r => r.chance_category === 'AMBITIOUS' || r.tier === 'AMBITIOUS');
    const moderatePool = pool.filter(r => r.chance_category === 'MODERATE' || r.tier === 'MODERATE');
    const safePool = pool.filter(r => r.chance_category === 'SAFE' || r.tier === 'SAFE');

    const ambitiousChoices = ambitiousPool.slice(0, 3).map((item, idx) => ({
      ...item,
      choiceNumber: idx + 1,
      tier: 'AMBITIOUS'
    }));

    const moderateChoices = moderatePool.slice(0, 3).map((item, idx) => ({
      ...item,
      choiceNumber: ambitiousChoices.length + idx + 1,
      tier: 'MODERATE'
    }));

    const safeChoices = safePool.slice(0, 2).map((item, idx) => ({
      ...item,
      choiceNumber: ambitiousChoices.length + moderateChoices.length + idx + 1,
      tier: 'SAFE'
    }));

    const orderedChoices = [...ambitiousChoices, ...moderateChoices, ...safeChoices];

    return res.json({
      success: true,
      studentName,
      strategy: '3:3:2 (3 Ambitious, 3 Moderate, 2 Safe)',
      summary: {
        totalChoices: orderedChoices.length,
        ambitiousCount: ambitiousChoices.length,
        moderateCount: moderateChoices.length,
        safeCount: safeChoices.length
      },
      orderedChoices
    });
  } catch (error) {
    console.error('Error generating choice sheet:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate TNEA choice sheet', error: error.message });
  }
});

export default router;
