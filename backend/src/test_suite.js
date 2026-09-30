/**
 * test_suite.js — Full API Verification & Recommendation Engine Tests
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('====================================================');
  console.log('Running Smart College Counselor System Verification');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function assertTest(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  await assertTest('1. GET /api/health', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'online' && data.status !== 'ok') throw new Error(`Expected status ok/online, got ${data.status}`);
  });

  // 2. Data Status endpoint
  await assertTest('2. GET /api/data-status', async () => {
    const res = await fetch(`${BASE_URL}/api/data-status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('data-status not successful');
    console.log(`   📊 Total Institutions: ${data.statistics.total_institutions}`);
    console.log(`   📊 Total Courses: ${data.statistics.total_courses}`);
    console.log(`   📊 Total Cutoffs: ${data.statistics.total_cutoffs}`);
    if (data.statistics.total_institutions < 100) {
      throw new Error(`Expected >= 100 institutions, got ${data.statistics.total_institutions}`);
    }
  });

  // 3. Tamil Nadu Districts endpoint
  await assertTest('3. GET /api/tamilnadu/districts', async () => {
    const res = await fetch(`${BASE_URL}/api/tamilnadu/districts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.count !== 38) {
      throw new Error(`Expected 38 districts, got ${data.count}`);
    }
    const chennai = data.data.find(d => d.name === 'Chennai');
    const cbe = data.data.find(d => d.name === 'Coimbatore');
    console.log(`   📍 Chennai College Count: ${chennai?.college_count || 0}`);
    console.log(`   📍 Coimbatore College Count: ${cbe?.college_count || 0}`);
  });

  // 4. College Listing & Pagination
  await assertTest('4. GET /api/tamilnadu/colleges (Pagination limit=12)', async () => {
    const res = await fetch(`${BASE_URL}/api/tamilnadu/colleges?page=1&limit=12`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.length !== 12) {
      throw new Error(`Expected 12 items on page 1, got ${data.data?.length}`);
    }
    console.log(`   📄 Total College Records: ${data.pagination.total}, Total Pages: ${data.pagination.totalPages}`);
  });

  // 5. Search filtering (Search for CEG / Guindy)
  await assertTest('5. GET /api/tamilnadu/colleges?search=Guindy', async () => {
    const res = await fetch(`${BASE_URL}/api/tamilnadu/colleges?search=Guindy`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.length === 0) {
      throw new Error('Search for Guindy returned 0 results');
    }
    const ceg = data.data[0];
    if (ceg.tnea_code !== '0001') {
      throw new Error(`Expected tnea_code 0001, got ${ceg.tnea_code}`);
    }
    console.log(`   🔍 Found: ${ceg.name} (TNEA: ${ceg.tnea_code}, District: ${ceg.district_name})`);
  });

  // 6. District filtering (Coimbatore colleges)
  await assertTest('6. GET /api/tamilnadu/colleges?district=Coimbatore', async () => {
    const res = await fetch(`${BASE_URL}/api/tamilnadu/colleges?district=Coimbatore&limit=50`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.length === 0) {
      throw new Error('District filter for Coimbatore returned 0 results');
    }
    const allCbe = data.data.every(c => c.district_name === 'Coimbatore');
    if (!allCbe) throw new Error('Non-Coimbatore college found in district filter');
    console.log(`   🏛️ Coimbatore colleges retrieved: ${data.data.length} institutions`);
  });

  // 7. Course filtering (Colleges offering AIDS)
  await assertTest('7. GET /api/tamilnadu/colleges?course=AIDS', async () => {
    const res = await fetch(`${BASE_URL}/api/tamilnadu/colleges?course=AIDS&limit=50`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.length === 0) {
      throw new Error('Course filter for AIDS returned 0 results');
    }
    console.log(`   💻 Colleges offering AIDS: ${data.pagination.total} institutions`);
  });

  // 8. College Detail by ID or TNEA Code
  await assertTest('8. GET /api/tamilnadu/colleges/0001', async () => {
    const res = await fetch(`${BASE_URL}/api/tamilnadu/colleges/0001`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data) throw new Error('Failed to load college detail for 0001');
    console.log(`   🏫 ${data.data.name}`);
    console.log(`   📚 Offering ${data.data.courses?.length || 0} branches`);
    console.log(`   📈 Cutoffs tracked: ${data.data.tnea_cutoffs?.length || 0} records`);
  });

  // 9. Legacy /api/colleges endpoint (Backward compatibility)
  await assertTest('9. GET /api/colleges (Legacy endpoint)', async () => {
    const res = await fetch(`${BASE_URL}/api/colleges?search=PSG`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.colleges || data.colleges.length === 0) {
      throw new Error('Legacy /api/colleges?search=PSG returned 0');
    }
    console.log(`   🏛️ Legacy /api/colleges matched: ${data.colleges.length} colleges`);
  });

  // 10. Courses endpoint
  await assertTest('10. GET /api/courses', async () => {
    const res = await fetch(`${BASE_URL}/api/courses`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.courses || data.courses.length < 12) {
      throw new Error(`Expected at least 12 courses, got ${data.courses?.length}`);
    }
    console.log(`   🎓 Engineering Programs: ${data.courses.length} courses (${data.courses.map(c => c.code).join(', ')})`);
  });

  // 11. Multi-Year TNEA Cutoffs query
  await assertTest('11. GET /api/tnea/cutoffs?round=Round 1&community=BC', async () => {
    const res = await fetch(`${BASE_URL}/api/tnea/cutoffs?round=Round%201&community=BC&limit=5`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.length === 0) {
      throw new Error('Cutoff query returned 0 rows');
    }
    console.log(`   📉 Multi-year cutoffs sample: ${data.data[0].institution.name} - ${data.data[0].course.code}: Cutoff ${data.data[0].cutoff}`);
  });

  // 12. Recommendation Engine test (Vishnu, 187.5 cutoff, BC, ECE/CSE, Coimbatore, 150000 budget)
  await assertTest('12. POST /api/analyze (Recommendation Engine 6-Factor Scoring)', async () => {
    const payload = {
      name: 'Vishnu',
      cutoff: 187.5,
      math: 95,
      physics: 92.5,
      chemistry: 92.5,
      percentage: 93.3,
      category: 'BC',
      courses: ['ECE', 'CSE'],
      location: 'Coimbatore',
      budget: 150000,
      interests: ['Electronics', 'IoT', 'Programming']
    };

    const res = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.recommendations || data.recommendations.length === 0) {
      throw new Error('Recommendation engine returned 0 recommendations');
    }

    console.log(`   🎯 Total Recommendations Generated: ${data.recommendations.length}`);
    console.log(`   🎯 Safe: ${data.summary?.safe}, Moderate: ${data.summary?.moderate}, Ambitious: ${data.summary?.ambitious}`);
    const top = data.recommendations[0];
    console.log(`   🥇 Top Choice: ${top.college_name} (${top.course_code})`);
    console.log(`      Score: ${top.suitability_score}/100 | Chance: ${top.chance_category} | Cutoff Δ: ${top.cutoff_delta}`);
    console.log(`      Fit Breakdown: Cutoff ${top.fit_breakdown?.cutoff_fit}, Course ${top.fit_breakdown?.course_fit}, Loc ${top.fit_breakdown?.location_fit}, Budget ${top.fit_breakdown?.budget_fit}`);
  });

  // 13. Admin CSV Ingestion test
  await assertTest('13. POST /api/admin/import (CSV Ingestion & Validation Report)', async () => {
    const csvData = `tnea_code,course_code,academic_year,round,community,cutoff,opening_rank,closing_rank
0001,CSE,2025,Round 1,OC,199.50,1,120
0001,ECE,2025,Round 1,OC,198.50,121,250
999999,INVALID_CRS,2025,Round 1,INVALID_COMM,250.00,0,0`;

    const res = await fetch(`${BASE_URL}/api/admin/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'cutoffs',
        academic_year: 2025,
        file_name: 'test_validation_import.csv',
        csv_content: csvData
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('CSV Import failed');

    console.log(`   📥 Records Received: ${data.summary.records_received}`);
    console.log(`   📥 Records Inserted/Updated/Skipped: ${data.summary.records_inserted} inserted, ${data.summary.records_updated} updated, ${data.summary.duplicates_skipped} skipped`);
    console.log(`   📥 Invalid Records Caught: ${data.summary.invalid_records}`);
    console.log(`   📥 Unmatched Caught: ${data.summary.unmatched_institutions} institutions, ${data.summary.unmatched_courses} courses`);
    if (data.summary.invalid_records < 1) {
      throw new Error('Validation failed to catch impossible cutoff 250.00 / invalid community');
    }
  });

  console.log('\n====================================================');
  console.log(`Verification Complete: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');
}

runTests().catch(console.error);
