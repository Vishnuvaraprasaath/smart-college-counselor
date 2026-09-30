/**
 * database.js — Sequelize-backed database layer
 * Replaces the previous pure-JS JSON persistence (dbStore / counselor.json).
 * Exports the same dbRun / dbGet / dbAll / initTables interface so all existing
 * routes and services continue to work without modification.
 */
import { Op, QueryTypes } from 'sequelize';
import sequelize from '../models/index.js';
import College from '../models/College.js';
import Course from '../models/Course.js';
import CollegeCourse from '../models/CollegeCourse.js';
import CutoffHistory from '../models/CutoffHistory.js';
import Student from '../models/Student.js';
import StudentPreference from '../models/StudentPreference.js';
import Recommendation from '../models/Recommendation.js';
import State from '../models/State.js';
import District from '../models/District.js';
import Institution from '../models/Institution.js';
import InstitutionCourse from '../models/InstitutionCourse.js';
import TneaCutoff from '../models/TneaCutoff.js';
import DataSource from '../models/DataSource.js';
import DataImport from '../models/DataImport.js';

// ── Associations ────────────────────────────────────────────────────────────
College.hasMany(CollegeCourse, { foreignKey: 'college_id' });
CollegeCourse.belongsTo(College, { foreignKey: 'college_id' });

Course.hasMany(CollegeCourse, { foreignKey: 'course_id' });
CollegeCourse.belongsTo(Course, { foreignKey: 'course_id' });

College.hasMany(CutoffHistory, { foreignKey: 'college_id' });
CutoffHistory.belongsTo(College, { foreignKey: 'college_id' });

Course.hasMany(CutoffHistory, { foreignKey: 'course_id' });
CutoffHistory.belongsTo(Course, { foreignKey: 'course_id' });

Student.hasMany(StudentPreference, { foreignKey: 'student_id', onDelete: 'CASCADE' });
StudentPreference.belongsTo(Student, { foreignKey: 'student_id' });

Student.hasMany(Recommendation, { foreignKey: 'student_id', onDelete: 'CASCADE' });
Recommendation.belongsTo(Student, { foreignKey: 'student_id' });

College.hasMany(Recommendation, { foreignKey: 'college_id' });
Recommendation.belongsTo(College, { foreignKey: 'college_id' });

Course.hasMany(Recommendation, { foreignKey: 'course_id' });
Recommendation.belongsTo(Course, { foreignKey: 'course_id' });

// Tamil Nadu Platform Associations
State.hasMany(District, { foreignKey: 'state_id', as: 'districts' });
District.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

District.hasMany(Institution, { foreignKey: 'district_id', as: 'institutions' });
Institution.belongsTo(District, { foreignKey: 'district_id', as: 'district' });

Institution.hasMany(InstitutionCourse, { foreignKey: 'institution_id', as: 'courses' });
InstitutionCourse.belongsTo(Institution, { foreignKey: 'institution_id', as: 'institution' });

Course.hasMany(InstitutionCourse, { foreignKey: 'course_id', as: 'offered_by' });
InstitutionCourse.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Institution.hasMany(TneaCutoff, { foreignKey: 'institution_id', as: 'tnea_cutoffs' });
TneaCutoff.belongsTo(Institution, { foreignKey: 'institution_id', as: 'institution' });

Course.hasMany(TneaCutoff, { foreignKey: 'course_id', as: 'tnea_cutoffs' });
TneaCutoff.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

DataSource.hasMany(TneaCutoff, { foreignKey: 'source_id', as: 'cutoffs' });
TneaCutoff.belongsTo(DataSource, { foreignKey: 'source_id', as: 'source' });

DataSource.hasMany(DataImport, { foreignKey: 'source_id', as: 'imports' });
DataImport.belongsTo(DataSource, { foreignKey: 'source_id', as: 'source' });

// ── initTables ───────────────────────────────────────────────────────────────
export const initTables = async () => {
  await sequelize.authenticate();
  console.log('MySQL connection established via Sequelize.');
  await sequelize.sync({ alter: true });
  console.log('Database tables synced.');
};

// ── dbRun ────────────────────────────────────────────────────────────────────
// Handles INSERT INTO and DELETE FROM queries used by seedData.js
export const dbRun = async (sql, params = []) => {
  const sqlUpper = sql.trim().toUpperCase();

  // DELETE FROM <table>
  if (sqlUpper.startsWith('DELETE FROM')) {
    const table = sql.trim().split(/\s+/)[2].toLowerCase();
    const modelMap = {
      colleges: College,
      courses: Course,
      college_courses: CollegeCourse,
      cutoff_history: CutoffHistory,
      students: Student,
      student_preferences: StudentPreference,
      recommendations: Recommendation,
      states: State,
      districts: District,
      institutions: Institution,
      institution_courses: InstitutionCourse,
      tnea_cutoffs: TneaCutoff,
      data_sources: DataSource,
      data_imports: DataImport
    };
    const Model = modelMap[table];
    if (Model) {
      const count = await Model.destroy({ where: {}, truncate: false });
      return { changes: count };
    }
    return { changes: 0 };
  }

  // INSERT INTO <table> (fields) VALUES (?)
  if (sqlUpper.startsWith('INSERT INTO')) {
    const match = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([\s\S]+?)\)\s*VALUES\s*\(([\s\S]+?)\)/i);
    if (match) {
      const table = match[1].toLowerCase();
      const fields = match[2].split(',').map(f => f.trim().replace(/[\r\n]+/g, ''));
      const modelMap = {
        colleges: College,
        courses: Course,
        college_courses: CollegeCourse,
        cutoff_history: CutoffHistory,
        students: Student,
        student_preferences: StudentPreference,
        recommendations: Recommendation,
        states: State,
        districts: District,
        institutions: Institution,
        institution_courses: InstitutionCourse,
        tnea_cutoffs: TneaCutoff,
        data_sources: DataSource,
        data_imports: DataImport
      };
      const Model = modelMap[table];
      if (Model) {
        const data = {};
        fields.forEach((field, i) => { data[field] = params[i] !== undefined ? params[i] : null; });
        const record = await Model.create(data);
        return { lastID: record.id, changes: 1 };
      }
    }

    // Direct raw query execution fallback
    const [result] = await sequelize.query(sql, { replacements: params, type: QueryTypes.INSERT });
    return { lastID: result, changes: 1 };
  }

  const [rawResult] = await sequelize.query(sql, { replacements: params });
  return { lastID: rawResult, changes: 1 };
};

// ── dbGet ────────────────────────────────────────────────────────────────────
export const dbGet = async (sql, params = []) => {
  const rows = await dbAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
};

// ── dbAll ────────────────────────────────────────────────────────────────────
// Pattern-matches the SQL queries used by routes & services and executes them
// via Sequelize / raw SQL with parameterised bindings.
export const dbAll = async (sql, params = []) => {
  const sqlTrim = sql.trim().toLowerCase();

  // 1. COUNT colleges
  if (sqlTrim.includes('select count(*) as count from colleges')) {
    const count = await College.count();
    return [{ count }];
  }

  // 2. Recommendation engine master query
  //    FROM colleges c JOIN college_courses cc JOIN courses co JOIN cutoff_history ch
  if (sqlTrim.includes('from colleges c') && sqlTrim.includes('join cutoff_history ch')) {
    const category = params[0];
    const rows = await sequelize.query(
      `SELECT
         c.id AS college_id, c.name AS college_name, c.code AS college_code,
         c.city, c.district, c.state, c.type, c.fees,
         c.hostel_available, c.hostel_fee, c.facilities,
         c.accreditation, c.ranking, c.placement_rate, c.avg_package,
         co.id AS course_id, co.name AS course_name, co.code AS course_code,
         ch.cutoff AS historical_cutoff, ch.year AS cutoff_year
       FROM colleges c
       JOIN college_courses cc ON c.id = cc.college_id
       JOIN courses co ON cc.course_id = co.id
       JOIN cutoff_history ch ON c.id = ch.college_id AND co.id = ch.course_id
       WHERE ch.category = ? AND ch.year = 2025`,
      { replacements: [category], type: QueryTypes.SELECT }
    );
    return rows;
  }

  // 3. College detail — courses offered
  //    FROM college_courses cc JOIN courses co WHERE cc.college_id = ?
  if (sqlTrim.includes('from college_courses cc') && sqlTrim.includes('join courses co')) {
    const collegeId = params[0];
    const rows = await sequelize.query(
      `SELECT cc.*, co.name AS course_name, co.code AS course_code, co.description
       FROM college_courses cc
       JOIN courses co ON cc.course_id = co.id
       WHERE cc.college_id = ?`,
      { replacements: [collegeId], type: QueryTypes.SELECT }
    );
    return rows;
  }

  // 4. Compare endpoint — cutoff row for specific college+course+category+year
  //    FROM cutoff_history ch JOIN courses co WHERE ch.college_id = ? AND (co.code = ? ...) AND ch.category = ? AND ch.year = 2025
  if (sqlTrim.includes('from cutoff_history ch') && sqlTrim.includes('co.code = ?')) {
    const [collegeId, courseCode, courseName, category] = params;
    const rows = await sequelize.query(
      `SELECT ch.cutoff, ch.year
       FROM cutoff_history ch
       JOIN courses co ON ch.course_id = co.id
       WHERE ch.college_id = ? AND (co.code = ? OR co.name = ?) AND ch.category = ? AND ch.year = 2025`,
      { replacements: [collegeId, courseCode, courseName, category], type: QueryTypes.SELECT }
    );
    return rows;
  }

  // 5. Cutoff history for college detail (ch JOIN courses co WHERE college_id AND category)
  if (sqlTrim.includes('from cutoff_history ch') && sqlTrim.includes('join courses co') && !sqlTrim.includes('join colleges c') && !sqlTrim.includes('co.code = ?')) {
    const collegeId = params[0];
    const category = params[1];
    const rows = await sequelize.query(
      `SELECT ch.*, co.code AS course_code
       FROM cutoff_history ch
       JOIN courses co ON ch.course_id = co.id
       WHERE ch.college_id = ? AND ch.category = ?
       ORDER BY ch.year ASC`,
      { replacements: [collegeId, category], type: QueryTypes.SELECT }
    );
    return rows;
  }

  // 6. Cutoff trends query (ch JOIN colleges c JOIN courses co)
  if (sqlTrim.includes('from cutoff_history ch') && sqlTrim.includes('join colleges c')) {
    const category = params[0];
    const year = params[1];
    let rawSql = `
      SELECT ch.*, c.name AS college_name, c.city, co.name AS course_name, co.code AS course_code
      FROM cutoff_history ch
      JOIN colleges c ON ch.college_id = c.id
      JOIN courses co ON ch.course_id = co.id
      WHERE ch.category = ? AND ch.year = ?`;
    const replacements = [category, year];

    // Optional course filter appended dynamically in collegeRoutes
    if (sqlTrim.includes('co.code = ?') || sqlTrim.includes('co.name like ?')) {
      rawSql += ` AND (co.code = ? OR co.name LIKE ?)`;
      replacements.push(params[2], params[3]);
    }
    rawSql += ` ORDER BY ch.cutoff DESC`;

    const rows = await sequelize.query(rawSql, { replacements, type: QueryTypes.SELECT });
    return rows;
  }

  // 7. Offering colleges for a course
  //    FROM college_courses cc JOIN colleges c WHERE cc.course_id = ?
  if (sqlTrim.includes('from college_courses cc') && sqlTrim.includes('join colleges c')) {
    const courseId = params[0];
    const rows = await sequelize.query(
      `SELECT c.id, c.name, c.code, c.city, c.type, c.fees, c.ranking, c.placement_rate, cc.seats
       FROM college_courses cc
       JOIN colleges c ON cc.college_id = c.id
       WHERE cc.course_id = ?`,
      { replacements: [courseId], type: QueryTypes.SELECT }
    );
    return rows;
  }

  // 8. Generic courses query
  if (sqlTrim.includes('from courses')) {
    if (sqlTrim.includes('where id = ? or code = ?')) {
      const searchVal = params[0];
      const rows = await Course.findAll({
        where: {
          [Op.or]: [
            { id: isNaN(searchVal) ? 0 : parseInt(searchVal) },
            sequelize.where(
              sequelize.fn('UPPER', sequelize.col('code')),
              String(searchVal).toUpperCase()
            )
          ]
        }
      });
      return rows.map(r => r.toJSON());
    }
    const rows = await Course.findAll({ order: [['name', 'ASC']] });
    return rows.map(r => r.toJSON());
  }

  // 9. Generic colleges query
  if (sqlTrim.includes('from colleges')) {
    if (sqlTrim.includes('where id = ?')) {
      const row = await College.findByPk(params[0]);
      return row ? [row.toJSON()] : [];
    }

    // Direct execution of the parameterized query (handles filters in collegeRoutes)
    const rows = await sequelize.query(sql, { replacements: params, type: QueryTypes.SELECT });
    return rows;
  }

  // 10. Generic students query (only for simple single-table SELECTs)
  if (sqlTrim.startsWith('select * from students') && !sqlTrim.includes('join')) {
    if (sqlTrim.includes('where id = ?')) {
      const row = await Student.findByPk(params[0]);
      return row ? [row.toJSON()] : [];
    }
    const rows = await Student.findAll();
    return rows.map(r => r.toJSON());
  }

  // General Fallback Query Execution for any other SQL query
  try {
    const rows = await sequelize.query(sql, { replacements: params, type: QueryTypes.SELECT });
    return rows;
  } catch (err) {
    console.error('dbAll query fallback error:', err.message);
    return [];
  }
};

export {
  sequelize,
  State,
  District,
  Institution,
  Course,
  InstitutionCourse,
  TneaCutoff,
  DataSource,
  DataImport,
  College,
  CollegeCourse,
  CutoffHistory,
  Student,
  StudentPreference,
  Recommendation
};

export default sequelize;
