import express from 'express';
import { 
  Institution, 
  Course, 
  TneaCutoff, 
  District, 
  DataSource, 
  DataImport,
  College,
  CutoffHistory
} from '../database/database.js';
import {
  parseCSV,
  validateDistrict,
  validateCutoff,
  validateCommunity,
  validateAcademicYear,
  validateCourseCode
} from '../utils/dataValidator.js';

const router = express.Router();

// ── GET /api/admin/imports ────────────────────────────────────────────────────
// List past data ingestion logs
router.get('/imports', async (req, res) => {
  try {
    const logs = await DataImport.findAll({
      order: [['imported_at', 'DESC']],
      limit: 20
    });
    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('Error fetching import history:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch imports', error: error.message });
  }
});

// ── POST /api/admin/import ────────────────────────────────────────────────────
// Ingests batch dataset (JSON array or CSV string of institutions or cutoffs)
router.post('/import', async (req, res) => {
  try {
    let { type, academic_year, file_name, records, csv_content } = req.body;

    // Handle CSV payload if provided
    if (csv_content || (typeof records === 'string' && records.includes(','))) {
      const csvStr = csv_content || records;
      records = parseCSV(csvStr);
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payload: records array or valid CSV content is required' 
      });
    }

    const yearValidation = validateAcademicYear(academic_year || 2025);
    const defaultYear = yearValidation.valid ? yearValidation.value : 2025;

    let recordsReceived = records.length;
    let recordsInserted = 0;
    let recordsUpdated = 0;
    let duplicatesSkipped = 0;
    let invalidRecords = 0;
    let unmatchedInstitutions = 0;
    let unmatchedCourses = 0;
    const errors = [];

    if (type === 'colleges' || type === 'institutions') {
      for (let idx = 0; idx < records.length; idx++) {
        const item = records[idx];

        // 1. Validate required identifiers
        if (!item.tnea_code || !item.name) {
          invalidRecords++;
          errors.push(`Row ${idx + 1}: Missing required identifier 'tnea_code' or 'name'`);
          continue;
        }

        const cleanCode = String(item.tnea_code).trim();
        const cleanName = String(item.name).trim();

        // 2. Validate district
        let districtId = 1;
        let districtName = 'Tamil Nadu';
        if (item.district) {
          const dVal = validateDistrict(item.district);
          if (dVal.valid) {
            districtName = dVal.value;
            const dist = await District.findOne({ where: { name: districtName } });
            if (dist) districtId = dist.id;
          } else {
            // Create or fallback
            const [dist] = await District.findOrCreate({
              where: { name: String(item.district).trim() },
              defaults: { state_id: 1, headquarters: item.city || item.district, region: 'Tamil Nadu' }
            });
            districtId = dist.id;
            districtName = dist.name;
          }
        }

        const isAuto = item.autonomous === true || String(item.autonomous).toLowerCase() === 'true' || item.autonomous === 1;

        // 3. Find existing institution by TNEA code
        const existing = await Institution.findOne({ where: { tnea_code: cleanCode } });

        if (!existing) {
          // Insert new
          const created = await Institution.create({
            tnea_code: cleanCode,
            name: cleanName,
            short_name: item.short_name || cleanName,
            institution_type: item.institution_type || 'Self Financing',
            ownership: item.ownership || 'Private',
            district_id: districtId,
            city: item.city || districtName,
            address: item.address || null,
            pincode: item.pincode || null,
            university: item.university || 'Anna University, Chennai',
            affiliation: item.affiliation || 'Anna University',
            autonomous: isAuto,
            established_year: item.established_year ? parseInt(item.established_year, 10) : null,
            accreditation: item.accreditation || 'Anna University Approved',
            website: item.website || null,
            phone: item.phone || null,
            email: item.email || null,
            ranking: item.ranking ? parseInt(item.ranking, 10) : null,
            placement_rate: item.placement_rate ? parseFloat(item.placement_rate) : null,
            avg_package: item.avg_package ? parseFloat(item.avg_package) : null,
            status: 'Active',
            last_verified_at: new Date()
          });

          // Mirror to legacy colleges table
          await College.create({
            id: created.id,
            name: cleanName,
            code: cleanCode,
            city: item.city || districtName,
            district: districtName,
            state: 'Tamil Nadu',
            type: `${item.institution_type || 'Self Financing'}${isAuto ? ' & Autonomous' : ''}`,
            website: item.website || null,
            fees: item.fees ? parseInt(item.fees, 10) : (isAuto ? 125000 : 85000),
            hostel_available: 1,
            hostel_fee: item.hostel_fee ? parseInt(item.hostel_fee, 10) : 65000,
            facilities: 'Modern Laboratories, Campus Wi-Fi, Digital Library, Sports Facilities',
            accreditation: item.accreditation || 'Anna University Approved',
            ranking: item.ranking ? parseInt(item.ranking, 10) : null,
            placement_rate: item.placement_rate ? parseFloat(item.placement_rate) : 85.0,
            avg_package: item.avg_package ? parseFloat(item.avg_package) : 5.0
          });

          recordsInserted++;
        } else {
          // Check if identical data (duplicate skip)
          const isIdentical = 
            existing.name === cleanName && 
            existing.institution_type === (item.institution_type || existing.institution_type) &&
            existing.ranking === (item.ranking ? parseInt(item.ranking, 10) : existing.ranking);

          if (isIdentical && !item.force_update) {
            duplicatesSkipped++;
          } else {
            // Update existing
            await existing.update({
              name: cleanName,
              short_name: item.short_name || existing.short_name,
              institution_type: item.institution_type || existing.institution_type,
              ranking: item.ranking ? parseInt(item.ranking, 10) : existing.ranking,
              placement_rate: item.placement_rate ? parseFloat(item.placement_rate) : existing.placement_rate,
              avg_package: item.avg_package ? parseFloat(item.avg_package) : existing.avg_package,
              website: item.website || existing.website,
              last_verified_at: new Date()
            });

            // Mirror update to colleges
            await College.update({
              name: cleanName,
              ranking: item.ranking ? parseInt(item.ranking, 10) : undefined,
              placement_rate: item.placement_rate ? parseFloat(item.placement_rate) : undefined,
              avg_package: item.avg_package ? parseFloat(item.avg_package) : undefined
            }, { where: { id: existing.id } });

            recordsUpdated++;
          }
        }
      }
    } else if (type === 'cutoffs') {
      // Import cutoffs
      for (let idx = 0; idx < records.length; idx++) {
        const item = records[idx];

        // 1. Validate required identifiers
        if (!item.tnea_code || !item.course_code || item.cutoff === undefined || item.cutoff === '') {
          invalidRecords++;
          errors.push(`Row ${idx + 1}: Missing tnea_code, course_code, or cutoff mark`);
          continue;
        }

        // 2. Validate cutoff mark range
        const cutVal = validateCutoff(item.cutoff);
        if (!cutVal.valid) {
          invalidRecords++;
          errors.push(`Row ${idx + 1}: ${cutVal.error}`);
          continue;
        }

        // 3. Validate community
        const commVal = validateCommunity(item.community || 'OC');
        if (!commVal.valid) {
          invalidRecords++;
          errors.push(`Row ${idx + 1}: ${commVal.error}`);
          continue;
        }

        // 4. Validate academic year
        const itemYear = item.academic_year || defaultYear;
        const yVal = validateAcademicYear(itemYear);
        if (!yVal.valid) {
          invalidRecords++;
          errors.push(`Row ${idx + 1}: ${yVal.error}`);
          continue;
        }

        // 5. Match Institution
        const cleanInstCode = String(item.tnea_code).trim();
        const inst = await Institution.findOne({ where: { tnea_code: cleanInstCode } });
        if (!inst) {
          unmatchedInstitutions++;
          errors.push(`Row ${idx + 1}: Unmatched institution with TNEA code '${cleanInstCode}'`);
          continue;
        }

        // 6. Match Course
        const cleanCourseCode = String(item.course_code).trim().toUpperCase();
        const course = await Course.findOne({ where: { code: cleanCourseCode } });
        if (!course) {
          unmatchedCourses++;
          errors.push(`Row ${idx + 1}: Unmatched course code '${cleanCourseCode}'`);
          continue;
        }

        const round = item.round || 'Round 1';
        const academicYearNum = yVal.value;
        const community = commVal.value;
        const cutoffScore = cutVal.value;

        // Check if cutoff record already exists
        const existingCutoff = await TneaCutoff.findOne({
          where: {
            institution_id: inst.id,
            course_id: course.id,
            academic_year: academicYearNum,
            round: round,
            community: community
          }
        });

        if (!existingCutoff) {
          await TneaCutoff.create({
            institution_id: inst.id,
            course_id: course.id,
            academic_year: academicYearNum,
            round: round,
            community: community,
            special_category: item.special_category || 'General Academic',
            quota: item.quota || 'TNEA Government Quota',
            opening_rank: item.opening_rank ? parseInt(item.opening_rank, 10) : null,
            closing_rank: item.closing_rank ? parseInt(item.closing_rank, 10) : null,
            cutoff: cutoffScore,
            source_id: 1,
            source_document: item.source || `TNEA ${academicYearNum} Official Allotment`,
            verified: true,
            last_verified_at: new Date()
          });

          // Mirror Round 1 to CutoffHistory
          if (round === 'Round 1') {
            await CutoffHistory.create({
              college_id: inst.id,
              course_id: course.id,
              category: community,
              year: academicYearNum,
              cutoff: cutoffScore
            });
          }

          recordsInserted++;
        } else {
          // Duplicate check
          if (existingCutoff.cutoff === cutoffScore && !item.force_update) {
            duplicatesSkipped++;
          } else {
            await existingCutoff.update({
              cutoff: cutoffScore,
              opening_rank: item.opening_rank ? parseInt(item.opening_rank, 10) : existingCutoff.opening_rank,
              closing_rank: item.closing_rank ? parseInt(item.closing_rank, 10) : existingCutoff.closing_rank,
              last_verified_at: new Date()
            });

            if (round === 'Round 1') {
              const hist = await CutoffHistory.findOne({
                where: { college_id: inst.id, course_id: course.id, category: community, year: academicYearNum }
              });
              if (hist) {
                await hist.update({ cutoff: cutoffScore });
              } else {
                await CutoffHistory.create({
                  college_id: inst.id,
                  course_id: course.id,
                  category: community,
                  year: academicYearNum,
                  cutoff: cutoffScore
                });
              }
            }

            recordsUpdated++;
          }
        }
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type: must be "colleges" or "cutoffs"' });
    }

    const totalProcessed = recordsReceived;
    const added = recordsInserted;
    const updated = recordsUpdated;
    const rejected = invalidRecords + unmatchedInstitutions + unmatchedCourses;

    // Log import entry
    const importLog = await DataImport.create({
      source_id: 1,
      file_name: file_name || 'admin_ingestion.json',
      academic_year: defaultYear,
      records_processed: totalProcessed,
      records_added: added,
      records_updated: updated,
      records_rejected: rejected,
      status: 'completed',
      details: `Processed ${totalProcessed} records (${type}). Inserted: ${added}, Updated: ${updated}, Skipped: ${duplicatesSkipped}, Rejected: ${rejected}`
    });

    return res.json({
      success: true,
      summary: {
        records_received: recordsReceived,
        records_inserted: recordsInserted,
        records_updated: recordsUpdated,
        duplicates_skipped: duplicatesSkipped,
        invalid_records: invalidRecords,
        unmatched_institutions: unmatchedInstitutions,
        unmatched_courses: unmatchedCourses,
        total_processed: totalProcessed,
        added: added,
        updated: updated,
        rejected: rejected,
        errors: errors.slice(0, 15),
        import_id: importLog.id
      }
    });
  } catch (error) {
    console.error('Error during admin data import:', error);
    return res.status(500).json({ success: false, message: 'Import failed', error: error.message });
  }
});

export default router;
