/**
 * dataValidator.js — Validation utilities and CSV parser for TNEA data ingestion
 */

export const TN_DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 
  'Erode', 'Tirunelveli', 'Chengalpattu', 'Kanchipuram', 'Tiruvallur', 
  'Vellore', 'Tiruppur', 'Thanjavur', 'Dindigul', 'Virudhunagar', 
  'Thoothukudi', 'Kanyakumari', 'Namakkal', 'Krishnagiri', 'Dharmapuri', 
  'Karur', 'Cuddalore', 'Viluppuram', 'Tiruvannamalai', 'Pudukkottai', 
  'Nagapattinam', 'Tiruvarur', 'Ramanathapuram', 'Sivaganga', 'Theni', 
  'Tenkasi', 'Nilgiris', 'Ariyalur', 'Perambalur', 'Kallakurichi', 
  'Ranipet', 'Tirupathur', 'Mayiladuthurai'
];

export const VALID_COMMUNITIES = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];

export const VALID_COURSE_CODES = [
  'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 
  'AIDS', 'AIML', 'CYBER', 'BT', 'BM', 'CB', 'CSBS', 
  'AUTO', 'CHEM', 'FT', 'RA'
];

export const VALID_INSTITUTION_TYPES = [
  'Government', 'Government Aided', 'Self Financing', 
  'University Department', 'Constituent College'
];

/**
 * Validates a cutoff value according to Tamil Nadu 200-mark scale.
 * Minimum cutoff for engineering counseling eligibility is 77.50, max is 200.00.
 */
export const validateCutoff = (cutoff) => {
  const num = parseFloat(cutoff);
  if (isNaN(num)) return { valid: false, error: 'Cutoff must be a valid number' };
  if (num < 77.50 || num > 200.00) {
    return { valid: false, error: `Cutoff mark ${num} is outside valid TNEA range (77.50 to 200.00)` };
  }
  return { valid: true, value: Math.round(num * 100) / 100 };
};

/**
 * Validates community category
 */
export const validateCommunity = (community) => {
  if (!community) return { valid: false, error: 'Community category is required' };
  const comm = String(community).trim().toUpperCase();
  if (!VALID_COMMUNITIES.includes(comm)) {
    return { valid: false, error: `Invalid community '${community}'. Must be one of: ${VALID_COMMUNITIES.join(', ')}` };
  }
  return { valid: true, value: comm };
};

/**
 * Validates academic year
 */
export const validateAcademicYear = (year) => {
  const y = parseInt(year, 10);
  if (isNaN(y) || y < 2015 || y > 2030) {
    return { valid: false, error: `Academic year '${year}' is invalid. Expected between 2015 and 2030.` };
  }
  return { valid: true, value: y };
};

/**
 * Validates district name (case-insensitive fuzzy match against 38 official districts)
 */
export const validateDistrict = (districtName) => {
  if (!districtName) return { valid: false, error: 'District name is required' };
  const clean = String(districtName).trim().toLowerCase().replace(/\s*district\s*$/i, '');
  const found = TN_DISTRICTS.find(d => d.toLowerCase() === clean);
  if (!found) {
    return { valid: false, error: `Unknown Tamil Nadu district '${districtName}'` };
  }
  return { valid: true, value: found };
};

/**
 * Validates course code
 */
export const validateCourseCode = (code, extraValidCourses = []) => {
  if (!code) return { valid: false, error: 'Course code is required' };
  const clean = String(code).trim().toUpperCase();
  const allValid = [...new Set([...VALID_COURSE_CODES, ...extraValidCourses.map(c => c.toUpperCase())])];
  if (!allValid.includes(clean)) {
    return { valid: false, error: `Unknown course code '${code}'. Valid codes: ${allValid.join(', ')}` };
  }
  return { valid: true, value: clean };
};

/**
 * Parses a standard CSV string into an array of objects
 */
export const parseCSV = (csvString) => {
  if (!csvString || typeof csvString !== 'string') return [];

  const lines = csvString
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) return [];

  // Parse header
  const parseLine = (line) => {
    const result = [];
    let insideQuotes = false;
    let current = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[\s_-]+/g, '_'));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

    const row = {};
    headers.forEach((header, idx) => {
      let val = values[idx] !== undefined ? values[idx] : '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      row[header] = val;
    });
    records.push(row);
  }

  return records;
};
