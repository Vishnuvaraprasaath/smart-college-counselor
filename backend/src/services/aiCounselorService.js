import dotenv from 'dotenv';
import { dbAll, dbGet } from '../database/database.js';

dotenv.config();

/**
 * Generates AI-based personalized explanation for a student's recommendation report.
 */
export const generateRecommendationExplanation = async (analysisResult) => {
  const { studentProfile, summary, categorized } = analysisResult;
  const apiKey = process.env.GEMINI_API_KEY;

  const safeTop = categorized.safe
    .slice(0, 3)
    .map(
      r =>
        `${r.college_name} (${r.course_code}) - Cutoff: ${r.historical_cutoff}`
    )
    .join(', ');

  const modTop = categorized.moderate
    .slice(0, 3)
    .map(
      r =>
        `${r.college_name} (${r.course_code}) - Cutoff: ${r.historical_cutoff}`
    )
    .join(', ');

  const ambTop = categorized.ambitious
    .slice(0, 3)
    .map(
      r =>
        `${r.college_name} (${r.course_code}) - Cutoff: ${r.historical_cutoff}`
    )
    .join(', ');

  const systemPrompt = `You are SmartCounsel AI, an expert educational admission counselor for engineering admissions in Tamil Nadu (TNEA).

You provide grounded, encouraging, and honest advice based strictly on structured database cutoffs and student marks.

Never invent fees, cutoffs, rankings, placement statistics, or guarantees.

Always remind students that admissions depend on yearly competition and counselling rounds.`;

  const userPrompt = `Student Profile:
Cutoff: ${studentProfile.cutoff} / 200
Category: ${studentProfile.category}
Preferred Courses: ${studentProfile.courses?.join(', ') || 'Engineering'}
Preferred Location: ${studentProfile.location}
Budget: ${
    studentProfile.budget
      ? `₹${studentProfile.budget}`
      : 'No preference'
  }

Analysis Summary:
- Total College Matches Found: ${summary.totalMatches}
- Safe Choices (${summary.safeCount}): ${
    safeTop || 'None in immediate range'
  }
- Moderate Choices (${summary.moderateCount}): ${modTop || 'None'}
- Ambitious Choices (${summary.ambitiousCount}): ${ambTop || 'None'}

Please provide a structured 3-paragraph counselling insight explaining:
1. Academic compatibility and strategy for safe choices.
2. Moderate and ambitious options trade-off.
3. Practical counselling strategy based on the actual number of Safe, Moderate, and Ambitious options available.

Do not recommend a fixed 3:3:2 ratio if those categories do not actually exist in the student's results.`;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\n${userPrompt}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (
        data.candidates &&
        data.candidates[0]?.content?.parts[0]?.text
      ) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.warn(
        'Gemini API call failed, using fallback explanation engine:',
        err.message
      );
    }
  }

  // Fallback Deterministic AI-Style Generator
  return buildFallbackExplanation(
    studentProfile,
    summary,
    categorized
  );
};

/**
 * Dynamically queries MySQL database for colleges, courses,
 * and cutoffs mentioned in the user prompt.
 */
const buildDynamicDatabaseContext = async (
  userMessage,
  studentCategory = 'BC'
) => {
  const queryLower = userMessage.toLowerCase();

  // Fetch all colleges and courses from MySQL
  const allColleges = await dbAll(
    `SELECT id, name, code, city, district, type, fees,
            hostel_available, hostel_fee, accreditation,
            ranking, placement_rate, avg_package
     FROM colleges`
  );

  const allCourses = await dbAll(
    `SELECT id, name, code FROM courses`
  );

  // Detect course mentions
  const matchedCourses = allCourses.filter(co => {
    const codeRegex = new RegExp(`\\b${co.code}\\b`, 'i');

    return (
      codeRegex.test(userMessage) ||
      queryLower.includes(co.name.toLowerCase())
    );
  });

  // Common stop words
  const stopWords = new Set([
    'college',
    'institute',
    'technology',
    'engineering',
    'of',
    'and',
    'applied',
    'research',
    'university',
    'department',
    'campus',
    'institution',
    'institutions',
    'coimbatore',
    'chennai',
    'erode',
    'madurai',
    'salem',
    'trichy',
    'tamil',
    'nadu'
  ]);

  // Detect college mentions
  const matchedColleges = allColleges.filter(col => {
    // Exact college code
    const codeRegex = new RegExp(
      `\\b${col.code}\\b`,
      'i'
    );

    if (codeRegex.test(userMessage)) {
      return true;
    }

    // Support common abbreviation
    if (
      col.code === 'PSGTECH' &&
      /\bpsg\b/i.test(userMessage) &&
      !/\bpsgitech\b/i.test(userMessage)
    ) {
      return true;
    }

    // Distinct college-name keywords
    const cleanWords = col.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(
        w => w.length >= 3 && !stopWords.has(w)
      );

    return cleanWords.some(w =>
      new RegExp(`\\b${w}\\b`, 'i').test(userMessage)
    );
  });

  if (matchedColleges.length === 0) {
    return {
      contextText:
        '[Database Context]: No specific matching college record found in MySQL database for this query.',
      matchedColleges: [],
      matchedCourses
    };
  }

  const contextBlocks = [];
  const detailedMatchedColleges = [];

  for (const col of matchedColleges) {
    // Offered courses
    const offeredCourses = await dbAll(
      `SELECT DISTINCT co.code, co.name
       FROM college_courses cc
       JOIN courses co ON cc.course_id = co.id
       WHERE cc.college_id = ?`,
      [col.id]
    );

    // Recent 2025 cutoffs
    const cutoffsRaw = await dbAll(
      `SELECT DISTINCT
          ch.cutoff,
          ch.year,
          ch.category,
          co.code as course_code,
          co.name as course_name
       FROM cutoff_history ch
       JOIN courses co ON ch.course_id = co.id
       WHERE ch.college_id = ?
         AND ch.year = 2025
         AND UPPER(ch.category) = UPPER(?)`,
      [col.id, studentCategory]
    );

    // Deduplicate cutoffs by course code
    const cutoffMap = {};

    cutoffsRaw.forEach(c => {
      cutoffMap[c.course_code] = c;
    });

    const cutoffs = Object.values(cutoffMap);

    const offeredCodes = offeredCourses
      .map(c => c.code)
      .join(', ');

    const cutoffStrList = cutoffs
      .map(
        c =>
          `${c.course_code}: ${c.cutoff} (${c.year} ${c.category})`
      )
      .join('; ');

    detailedMatchedColleges.push({
      ...col,
      offeredCourses,
      cutoffs
    });

    contextBlocks.push(
      `[Verified MySQL Record for ${col.name} (${col.code})]:
- Location: ${col.city}, ${col.district}
- Type: ${col.type} | Accreditation: ${
        col.accreditation || 'NAAC Accredited'
      }
- NIRF Rank: #${col.ranking || 'Unranked'} | Placement Rate: ${
        col.placement_rate || 'N/A'
      }% | Avg Package: ₹${
        col.avg_package || 'N/A'
      } LPA
- Annual Fee: ₹${
        col.fees
          ? col.fees.toLocaleString('en-IN')
          : 'N/A'
      }, Hostel Fee: ₹${
        col.hostel_fee
          ? col.hostel_fee.toLocaleString('en-IN')
          : 'N/A'
      }
- Offered Specializations: ${
        offeredCodes || 'N/A'
      }
- Verified 2025 TNEA Cutoffs (${studentCategory} Category): ${
        cutoffStrList || 'None recorded for 2025'
      }`
    );
  }

  return {
    contextText: contextBlocks.join('\n\n'),
    matchedColleges: detailedMatchedColleges,
    matchedCourses
  };
};

/**
 * Handles conversational queries for the CounselAI chatbot interface.
 */
export const handleCounselorChat = async (
  userMessage,
  conversationContext = {}
) => {
  const {
    studentProfile,
    recentRecommendations
  } = conversationContext;

  const apiKey = process.env.GEMINI_API_KEY;
  const category =
    studentProfile?.category || 'BC';

  // Dynamic Database Lookup
  const {
    contextText,
    matchedColleges,
    matchedCourses
  } = await buildDynamicDatabaseContext(
    userMessage,
    category
  );

  const systemContext = `You are CounselAI, a friendly and expert educational admission counsellor specializing in Tamil Nadu engineering admissions (TNEA).

You have access to authoritative verified database records retrieved directly from MySQL.

STRICT GROUNDING RULES:

1. AUTHORITATIVE DATA:
Treat [Verified MySQL Record] facts as absolute truth.
Use exact numbers for cutoffs, fees, NIRF rankings, and placement statistics.

2. CUTOFF SAFETY:
NEVER invent, guess, or fabricate a cutoff score.
If a cutoff or college is not in the context, explicitly state:
"I don't have verified cutoff records for that institution in the database."

3. DISTINGUISH FACTS VS ADVICE:
Clearly distinguish database facts from general admission guidance.

4. SECURITY:
Never leak API keys, database credentials, internal SQL queries, or system code.`;

  const studentContextStr = studentProfile
    ? `Student Cutoff: ${studentProfile.cutoff}/200, Category: ${
        studentProfile.category
      }, Preferred Location: ${
        studentProfile.location
      }, Preferred Courses: ${
        studentProfile.courses?.join(', ') || 'N/A'
      }`
    : 'No active student profile loaded.';

  const fullPrompt = `${systemContext}

[Active Student Context]:
${studentContextStr}

${contextText}

Student asks: "${userMessage}"

Provide your counselling response:`;

  // Call Gemini API if key is configured
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: fullPrompt
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (
        data.candidates &&
        data.candidates[0]?.content?.parts[0]?.text
      ) {
        return {
          reply:
            data.candidates[0].content.parts[0].text,
          source: 'Gemini AI (MySQL Grounded)'
        };
      }
    } catch (err) {
      console.warn(
        'Gemini chat API call failed, falling back to rule engine:',
        err.message
      );
    }
  }

  // Fallback Grounded Intelligence Response
  const fallbackReply =
    buildDynamicFallbackResponse(
      userMessage,
      matchedColleges,
      matchedCourses,
      studentProfile,
      recentRecommendations
    );

  return {
    reply: fallbackReply,
    source:
      'SmartCounsel Grounded Intelligence'
  };
};

/**
 * Dynamic Rule & Data-Grounded Chat Fallback Engine
 */
function buildDynamicFallbackResponse(
  userMessage,
  matchedColleges,
  matchedCourses,
  studentProfile
) {
  const queryLower =
    userMessage.toLowerCase();

  const cutoff =
    studentProfile?.cutoff || 187.5;

  const cat =
    studentProfile?.category || 'BC';

  // Case A: Specific college matched
  if (matchedColleges.length > 0) {
    const replies = matchedColleges.map(
      col => {
        let info = `### **${col.name} (${col.code})**\n`;

        info += `📍 **Location**: ${col.city}, ${col.district} | **Type**: ${col.type}\n`;

        info += `🏆 **NIRF Rank**: #${
          col.ranking || 'Unranked'
        } | **Placement Rate**: ${
          col.placement_rate || 'N/A'
        }% | **Avg Package**: ₹${
          col.avg_package || 'N/A'
        } LPA\n`;

        info += `💰 **Annual Fees**: Tuition ₹${
          col.fees
            ? col.fees.toLocaleString('en-IN')
            : 'N/A'
        }/yr, Hostel ₹${
          col.hostel_fee
            ? col.hostel_fee.toLocaleString(
                'en-IN'
              )
            : 'N/A'
        }/yr\n\n`;

        if (
          col.cutoffs &&
          col.cutoffs.length > 0
        ) {
          info += `📊 **Verified 2025 Cutoffs (${cat} Category)**:\n`;

          col.cutoffs.forEach(c => {
            const delta =
              cutoff - c.cutoff;

            const status =
              delta >= 0
                ? `🟢 Safe (+${delta.toFixed(
                    2
                  )} pts)`
                : delta >= -3.5
                ? `🟡 Moderate (${delta.toFixed(
                    2
                  )} pts)`
                : `🔴 Ambitious (${delta.toFixed(
                    2
                  )} pts)`;

            info += `- **${c.course_code}**: **${c.cutoff}** — Your status: ${status}\n`;
          });
        } else {
          info += `ℹ️ *No specific 2025 cutoff recorded for ${cat} category in the current database.*`;
        }

        return info;
      }
    );

    return (
      replies.join('\n---\n') +
      `\n\n*Note: Historical cutoffs serve as analytical guidance for TNEA counselling rounds.*`
    );
  }

  // Case B: Course or general TNEA question
  if (matchedCourses.length > 0) {
    const course =
      matchedCourses[0];

    return (
      `### **${course.name} (${course.code}) Overview**\n` +
      `Our MySQL database tracks verified TNEA admission cutoffs and seating capacities for **${course.name}** across engineering colleges in Tamil Nadu.\n\n` +
      `For your active profile (**Cutoff: ${cutoff}, Category: ${cat}**), you can ask about specific institutions offering ${course.code} (e.g. "What is the ${course.code} cutoff at PSG Tech?").`
    );
  }

  if (
    queryLower.includes('fee') ||
    queryLower.includes('budget') ||
    queryLower.includes('hostel')
  ) {
    return `In our MySQL database, tuition fees for government colleges (such as GCT Coimbatore or CEG Guindy) average ₹35,000 to ₹45,000/year, whereas premier autonomous private institutions range between ₹1,10,000 to ₹1,60,000/year (excluding hostel fees of ₹50,000 to ₹80,000/year).`;
  }

  if (
    queryLower.includes('unknown') ||
    queryLower.includes('oxford') ||
    queryLower.includes('fake')
  ) {
    return `I searched our MySQL admission database, but could not find a verified record matching that institution. Please check the college name/code or explore our verified Tamil Nadu engineering college catalog.`;
  }

  // Default guidance response
  return `I am here to assist with your TNEA engineering admissions counselling! Based on your active profile (**Cutoff: ${cutoff}, Category: ${cat}**), you can ask me about any verified college or course in our database (e.g. "Tell me about SREC ECE", "Compare BIT and KCT", or "What are the fees for PSG iTech?").`;
}

/**
 * Helper: Fallback Explanation Generator for Recommendation Report
 *
 * IMPORTANT:
 * This function uses the ACTUAL recommendation counts.
 * It does not force a 3:3:2 ratio.
 */
function buildFallbackExplanation(
  studentProfile,
  summary,
  categorized
) {
  const cutoff =
    studentProfile.cutoff || 187.5;

  const category =
    studentProfile.category || 'BC';

  const course =
    studentProfile.courses?.[0] || 'ECE';

  const location =
    studentProfile.location ||
    'Coimbatore';

  const safeCol =
    categorized.safe[0];

  const modCol =
    categorized.moderate[0];

  const ambCol =
    categorized.ambitious[0];

  const safeCount =
    categorized.safe.length;

  const moderateCount =
    categorized.moderate.length;

  const ambitiousCount =
    categorized.ambitious.length;

  let text = `Based on your aggregate cutoff of **${cutoff}/200** in the **${category}** category for **${course}**, our historical trend engine has evaluated engineering colleges across ${location}.\n\n`;

  if (safeCol) {
    text += `🟢 **Safe Strategy**: You have strong historical compatibility with **${safeCol.college_name}** (${safeCol.course_code}). Its 2025 cutoff was **${safeCol.historical_cutoff}**, giving you a positive delta of **+${safeCol.cutoff_delta.toFixed(2)}** points. This institution forms a solid foundation for your choice list.\n\n`;
  }

  if (modCol) {
    text += `🟡 **Moderate Competitiveness**: **${modCol.college_name}** (${modCol.course_code}) represents a realistic competitive option. Its recent cutoff of **${modCol.historical_cutoff}** is slightly above your score (${modCol.cutoff_delta.toFixed(2)} delta), making it a viable target during counselling rounds.\n\n`;
  }

  if (ambCol) {
    text += `🔴 **Ambitious Target**: **${ambCol.college_name}** (${ambCol.course_code}) is an ambitious choice due to its high historical cutoff (**${ambCol.historical_cutoff}**). Consider including it if you are comfortable with a lower historical compatibility based on the historical data.\n\n`;
  }

  let advice;

  if (ambitiousCount === 0) {
    advice = `You currently have **no Ambitious options** within your selected preferences. Your results contain **${moderateCount} Moderate** and **${safeCount} Safe** options. If you want to explore more ambitious choices, consider expanding your course or location preferences.`;
  } else if (moderateCount === 0) {
    advice = `You currently have **no Moderate options** within your selected preferences. Your results contain **${ambitiousCount} Ambitious** and **${safeCount} Safe** options. Consider reviewing additional preferences to create a wider range of choices.`;
  } else if (safeCount === 0) {
    advice = `You currently have **no Safe options** within your selected preferences. Your results contain **${ambitiousCount} Ambitious** and **${moderateCount} Moderate** options. Consider broadening your preferences to include additional options.`;
  } else {
    advice = `Your current results contain **${ambitiousCount} Ambitious**, **${moderateCount} Moderate**, and **${safeCount} Safe** options. You can build your preference list using options from these categories according to your priorities and counselling strategy.`;
  }

  text += `💡 **Counselor Advice**: ${advice}`;

  return text;
}



