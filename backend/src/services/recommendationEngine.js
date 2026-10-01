import { dbAll, dbGet } from '../database/database.js';

/**
 * Calculates college recommendations based on student profile and historical cutoff data.
 * Weights:
 * - Cutoff compatibility: 55%
 * - Course preference: 15%
 * - Location preference: 10%
 * - Budget compatibility: 10%
 * - College quality/ranking: 5%
 * - Student interests: 5%
 */
export const calculateRecommendations = async (studentProfile) => {
  const {
    cutoff,
    category,
    courses: preferredCourses = [],
    location = 'Any location',
    budget = null,
    interests = []
  } = studentProfile;

  // Fetch all colleges and their offered courses with recent 2025 cutoffs
  // for the student's category.
  const query = `
    SELECT 
      c.id as college_id,
      c.name as college_name,
      c.code as college_code,
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
      co.id as course_id,
      co.name as course_name,
      co.code as course_code,
      ch.cutoff as historical_cutoff,
      ch.year as cutoff_year
    FROM colleges c
    JOIN college_courses cc ON c.id = cc.college_id
    JOIN courses co ON cc.course_id = co.id
    JOIN cutoff_history ch
      ON c.id = ch.college_id
      AND co.id = ch.course_id
    WHERE ch.category = ? AND ch.year = 2025
  `;

  const rawOptions = await dbAll(query, [category]);

  if (!rawOptions || rawOptions.length === 0) {
    return {
      studentProfile,
      recommendations: [],
      summary: {
        totalMatches: 0,
        safeCount: 0,
        moderateCount: 0,
        ambitiousCount: 0
      },
      categorized: {
        safe: [],
        moderate: [],
        ambitious: []
      }
    };
  }

  /*
   * Apply explicit user preferences as filters.
   *
   * If courses are selected:
   *   Only those courses are considered.
   *
   * If a location is selected:
   *   Only colleges whose city OR district matches that location
   *   are considered.
   *
   * If no preference is selected:
   *   All available options remain eligible.
   */
  let filteredOptions = rawOptions;

  // Course filter
  if (preferredCourses.length > 0) {
    const normalizedCourses = preferredCourses.map(course =>
      course.toString().trim().toUpperCase()
    );

    filteredOptions = filteredOptions.filter(item => {
      const courseCode = (item.course_code || '').trim().toUpperCase();
      const courseName = (item.course_name || '').trim().toUpperCase();

      return (
        normalizedCourses.includes(courseCode) ||
        normalizedCourses.includes(courseName)
      );
    });
  }

  // Location filter
  if (
    location &&
    location !== 'Any location' &&
    location !== 'Any'
  ) {
    const targetLocation = location.toString().trim().toLowerCase();

    filteredOptions = filteredOptions.filter(item => {
      const city = (item.city || '').trim().toLowerCase();
      const district = (item.district || '').trim().toLowerCase();

      return city === targetLocation || district === targetLocation;
    });
  }

  // No matching options after applying preferences
  if (filteredOptions.length === 0) {
    return {
      studentProfile: {
        cutoff: parseFloat(cutoff),
        category,
        courses: preferredCourses,
        location,
        budget,
        interests
      },
      recommendations: [],
      summary: {
        totalMatches: 0,
        safeCount: 0,
        moderateCount: 0,
        ambitiousCount: 0
      },
      categorized: {
        safe: [],
        moderate: [],
        ambitious: []
      }
    };
  }

  const recommendations = [];

  for (const item of filteredOptions) {
    const studentCutoff = parseFloat(cutoff);
    const historicalCutoff = parseFloat(item.historical_cutoff);

    const cutoffDelta =
      Math.round((studentCutoff - historicalCutoff) * 100) / 100;

    // 1. Academic & Cutoff Score
    let cutoffScore = 85 + (cutoffDelta * 3.5);
    cutoffScore = Math.max(0, Math.min(100, cutoffScore));

    // 2. Course Preference Score
    let coursePrefScore = 50;
    let coursePreferenceRank = -1;

    if (preferredCourses.length > 0) {
      const matchIndex = preferredCourses.findIndex(
        p =>
          p.toUpperCase() === item.course_code.toUpperCase() ||
          p.toUpperCase() === item.course_name.toUpperCase()
      );

      if (matchIndex === 0) {
        coursePrefScore = 100;
        coursePreferenceRank = 1;
      } else if (matchIndex > 0) {
        coursePrefScore = Math.max(
          60,
          100 - (matchIndex * 15)
        );
        coursePreferenceRank = matchIndex + 1;
      } else {
        coursePrefScore = 30;
      }
    }

    // 3. Location Match Score
    let locationScore = 100;

    if (
      location &&
      location !== 'Any location' &&
      location !== 'Any'
    ) {
      const targetLoc = location.toLowerCase().trim();
      const cityLoc = item.city.toLowerCase().trim();
      const distLoc = item.district.toLowerCase().trim();

      if (cityLoc === targetLoc || distLoc === targetLoc) {
        locationScore = 100;
      } else {
        locationScore = 40;
      }
    }

    // 4. Budget Compatibility Score
    let budgetScore = 100;
    const maxBudget = budget ? parseFloat(budget) : null;

    if (maxBudget && maxBudget > 0) {
      const collegeFee = parseFloat(item.fees);

      if (collegeFee <= maxBudget) {
        budgetScore = 100;
      } else {
        const overageRatio =
          (collegeFee - maxBudget) / maxBudget;

        budgetScore = Math.max(
          10,
          Math.round(100 - (overageRatio * 100))
        );
      }
    }

    // 5. College Quality & Ranking Score
    let qualityScore = 70;

    if (item.ranking) {
      qualityScore = Math.max(
        40,
        100 - (item.ranking * 0.4)
      );
    }

    if (item.placement_rate) {
      qualityScore = Math.round(
        (qualityScore + item.placement_rate) / 2
      );
    }

    // 6. Student Interest Score
    let interestScore = 60;

    if (interests && interests.length > 0) {
      const courseText =
        `${item.course_name} ${item.course_code}`.toLowerCase();

      const matchedInterest = interests.some(interest => {
        const iLower = interest.toLowerCase();

        if (
          iLower.includes('electronics') &&
          (
            courseText.includes('ece') ||
            courseText.includes('electronics')
          )
        ) {
          return true;
        }

        if (
          iLower.includes('programming') ||
          iLower.includes('web') ||
          iLower.includes('software')
        ) {
          if (
            courseText.includes('cse') ||
            courseText.includes('it') ||
            courseText.includes('computer')
          ) {
            return true;
          }
        }

        if (
          iLower.includes('ai') ||
          iLower.includes('data science') ||
          iLower.includes('machine learning')
        ) {
          if (
            courseText.includes('aids') ||
            courseText.includes('aiml') ||
            courseText.includes('artificial')
          ) {
            return true;
          }
        }

        if (iLower.includes('cyber')) {
          if (
            courseText.includes('cyber') ||
            courseText.includes('cse')
          ) {
            return true;
          }
        }

        if (
          iLower.includes('core') ||
          iLower.includes('robotics')
        ) {
          if (
            courseText.includes('mech') ||
            courseText.includes('eee') ||
            courseText.includes('ece')
          ) {
            return true;
          }
        }

        return false;
      });

      if (matchedInterest) {
        interestScore = 95;
      }
    }

    // Weighted Overall Suitability Score
    const overallSuitability = Math.round(
      (cutoffScore * 0.55) +
      (coursePrefScore * 0.15) +
      (locationScore * 0.10) +
      (budgetScore * 0.10) +
      (qualityScore * 0.05) +
      (interestScore * 0.05)
    );

    // Classification of Admission Chance
    let chanceCategory = 'MODERATE';

    if (cutoffDelta >= 0) {
      chanceCategory = 'SAFE';
    } else if (cutoffDelta >= -3.5) {
      chanceCategory = 'MODERATE';
    } else {
      chanceCategory = 'AMBITIOUS';
    }

    // Build structured rationale reasons
    const reasons = [];

    if (cutoffDelta >= 0) {
      reasons.push(
        `Your cutoff (${studentCutoff.toFixed(2)}) is +${cutoffDelta.toFixed(2)} points above the 2025 historical cutoff (${historicalCutoff.toFixed(2)}).`
      );
    } else if (cutoffDelta >= -3.5) {
      reasons.push(
        `Your cutoff (${studentCutoff.toFixed(2)}) is close to the 2025 cutoff (${historicalCutoff.toFixed(2)}), making it a realistic competitive choice.`
      );
    } else {
      reasons.push(
        `Historical cutoff (${historicalCutoff.toFixed(2)}) is higher than your score (${studentCutoff.toFixed(2)}) by ${Math.abs(cutoffDelta).toFixed(2)} points.`
      );
    }

    if (coursePreferenceRank === 1) {
      reasons.push(
        `Matches your #1 preferred course (${item.course_code}).`
      );
    } else if (coursePreferenceRank > 1) {
      reasons.push(
        `Matches your #${coursePreferenceRank} preferred course choice (${item.course_code}).`
      );
    }

    if (
      locationScore === 100 &&
      location !== 'Any location' &&
      location !== 'Any'
    ) {
      reasons.push(
        `Located in your preferred city/district (${item.city}).`
      );
    }

    if (budgetScore === 100 && maxBudget) {
      reasons.push(
        `Annual fee (₹${Number(item.fees).toLocaleString('en-IN')}) is within your selected budget limit.`
      );
    } else if (maxBudget && budgetScore < 100) {
      reasons.push(
        `Annual fee (₹${Number(item.fees).toLocaleString('en-IN')}) exceeds specified budget.`
      );
    }

    recommendations.push({
      college_id: item.college_id,
      college_name: item.college_name,
      college_code: item.college_code,
      city: item.city,
      district: item.district,
      type: item.type,
      fees: item.fees,
      hostel_available: item.hostel_available,
      hostel_fee: item.hostel_fee,
      accreditation: item.accreditation,
      ranking: item.ranking,
      placement_rate: item.placement_rate,
      avg_package: item.avg_package,
      course_id: item.course_id,
      course_name: item.course_name,
      course_code: item.course_code,
      historical_cutoff: historicalCutoff,
      student_cutoff: studentCutoff,
      cutoff_delta: cutoffDelta,
      chance_category: chanceCategory,
      suitability_score: overallSuitability,

      fit_breakdown: {
        cutoff_fit: Math.round(cutoffScore),
        course_fit: Math.round(coursePrefScore),
        location_fit: Math.round(locationScore),
        budget_fit: Math.round(budgetScore),
        quality_fit: Math.round(qualityScore),
        interest_fit: Math.round(interestScore)
      },

      breakdown: {
        cutoff: {
          student: studentCutoff,
          historical: historicalCutoff,
          delta: cutoffDelta,
          score: Math.round(cutoffScore * 10) / 10,
          weight: 55,
          weightedContribution:
            Math.round(cutoffScore * 0.55 * 10) / 10
        },

        coursePreference: {
          score: Math.round(coursePrefScore * 10) / 10,
          weight: 15,
          weightedContribution:
            Math.round(coursePrefScore * 0.15 * 10) / 10,
          rank: coursePreferenceRank
        },

        location: {
          score: Math.round(locationScore * 10) / 10,
          weight: 10,
          weightedContribution:
            Math.round(locationScore * 0.10 * 10) / 10
        },

        budget: {
          score: Math.round(budgetScore * 10) / 10,
          weight: 10,
          weightedContribution:
            Math.round(budgetScore * 0.10 * 10) / 10,
          maxBudget,
          collegeFee: parseFloat(item.fees)
        },

        quality: {
          score: Math.round(qualityScore * 10) / 10,
          weight: 5,
          weightedContribution:
            Math.round(qualityScore * 0.05 * 10) / 10,
          ranking: item.ranking,
          placementRate: item.placement_rate
        },

        interest: {
          score: Math.round(interestScore * 10) / 10,
          weight: 5,
          weightedContribution:
            Math.round(interestScore * 0.05 * 10) / 10
        }
      },

      reasons
    });
  }

  // Sort by suitability score descending
  recommendations.sort(
    (a, b) => b.suitability_score - a.suitability_score
  );

  // Separate into Safe, Moderate, Ambitious categories
  const safeOptions = recommendations.filter(
    r => r.chance_category === 'SAFE'
  );

  const moderateOptions = recommendations.filter(
    r => r.chance_category === 'MODERATE'
  );

  const ambitiousOptions = recommendations.filter(
    r => r.chance_category === 'AMBITIOUS'
  );

  return {
    studentProfile: {
      cutoff: parseFloat(cutoff),
      category,
      courses: preferredCourses,
      location,
      budget,
      interests
    },

    summary: {
      totalMatches: recommendations.length,
      safeCount: safeOptions.length,
      moderateCount: moderateOptions.length,
      ambitiousCount: ambitiousOptions.length
    },

    recommendations,

    categorized: {
      safe: safeOptions,
      moderate: moderateOptions,
      ambitious: ambitiousOptions
    }
  };
};
