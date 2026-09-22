import { dbRun, dbGet, dbAll, initTables } from './database.js';

export const seedDatabase = async (force = false) => {
  await initTables();

  // Check if already seeded
  const count = await dbGet(`SELECT COUNT(*) as count FROM colleges`);
  if (count && count.count > 0) {
    if (!force) {
      console.log(`Database already seeded with ${count.count} colleges. Preserving existing records.`);
      return;
    }
    console.log(`Force seeding requested: cleaning and re-seeding data...`);
    await dbRun(`DELETE FROM recommendations`);
    await dbRun(`DELETE FROM cutoff_history`);
    await dbRun(`DELETE FROM college_courses`);
    await dbRun(`DELETE FROM colleges`);
    await dbRun(`DELETE FROM courses`);
  }

  console.log('Seeding courses...');
  const coursesData = [
    {
      name: 'Computer Science and Engineering',
      code: 'CSE',
      description: 'Study of computing systems, software development, algorithms, and computational theory.',
      overview: 'CSE is one of the most sought-after engineering disciplines focusing on software development, data structures, cloud computing, and software engineering principles.',
      skills: 'Python, Java, C++, Data Structures, System Design, SQL, Web Development',
      careers: 'Software Development Engineer, Full Stack Developer, Systems Architect, Cloud Engineer',
      industries: 'IT & Software, Product Startups, Fintech, E-commerce, AI Labs'
    },
    {
      name: 'Artificial Intelligence and Data Science',
      code: 'AIDS',
      description: 'Specialized program in machine learning, deep learning, data analytics, and intelligent systems.',
      overview: 'AIDS combines statistical analysis, data processing, and AI model building to solve complex decision-making problems across industries.',
      skills: 'Machine Learning, Deep Learning, Python, R, TensorFlow, Data Visualization, Big Data',
      careers: 'AI Engineer, Data Scientist, ML Ops Engineer, Data Analyst, BI Developer',
      industries: 'Tech Giants, Analytics Firms, Healthcare Tech, Autonomous Mobility, Finance'
    },
    {
      name: 'Artificial Intelligence and Machine Learning',
      code: 'AIML',
      description: 'Focused curriculum on neural networks, natural language processing, computer vision, and predictive modeling.',
      overview: 'AIML teaches students how to build smart algorithms capable of learning patterns from large datasets and performing autonomous actions.',
      skills: 'Neural Networks, NLP, Computer Vision, PyTorch, Model Deployment, Algorithmic Logic',
      careers: 'ML Engineer, Computer Vision Engineer, NLP Specialist, Research Scientist',
      industries: 'AI Research Labs, Robotics, Defense Tech, Tech Services'
    },
    {
      name: 'Information Technology',
      code: 'IT',
      description: 'Focuses on application development, network management, web technologies, and enterprise software.',
      overview: 'IT engineering emphasizes practical software applications, web engineering, database architecture, and network security.',
      skills: 'Web Stack, Cloud Computing, Database Admin, Networking, DevOps',
      careers: 'IT Consultant, DevOps Engineer, Full Stack Dev, Database Architect',
      industries: 'Enterprise IT, Consulting Services, Telecom, Software Houses'
    },
    {
      name: 'Electronics and Communication Engineering',
      code: 'ECE',
      description: 'Covers semiconductor devices, microprocessors, VLSI, signal processing, and wireless communications.',
      overview: 'ECE bridges hardware and software. Students learn embedded systems, IoT architecture, circuit design, and wireless communication protocols.',
      skills: 'VLSI Design, Embedded C, Microcontrollers, Signal Processing, MATLAB, Circuit Simulation',
      careers: 'Embedded Systems Engineer, VLSI Hardware Engineer, IoT Specialist, Telecom Engineer',
      industries: 'Semiconductor Manufacturers, Consumer Electronics, Automotive, Telecom, Defense'
    },
    {
      name: 'Electrical and Electronics Engineering',
      code: 'EEE',
      description: 'Study of electrical power generation, smart grids, electric vehicles, control systems, and power electronics.',
      overview: 'EEE focuses on energy systems, renewable power generation, EV battery management, automation, and industrial control.',
      skills: 'Power Electronics, Smart Grids, MATLAB, Control Systems, EV Architecture, PLC Automation',
      careers: 'Electrical Engineer, Power Systems Analyst, EV Hardware Design Engineer, Automation Engineer',
      industries: 'Electric Vehicle Firms, Renewable Energy, Power Sector, Industrial Manufacturing'
    },
    {
      name: 'Mechanical Engineering',
      code: 'MECH',
      description: 'Fundamental engineering branch dealing with thermal systems, CAD/CAM, robotics, and manufacturing technology.',
      overview: 'Mechanical Engineering equips students with physical modeling, mechanics, thermal engineering, robotics, and digital manufacturing skills.',
      skills: 'CAD/CAM, SolidWorks, ANSYS, Thermodynamics, Mechatronics, Robotics',
      careers: 'Design Engineer, Thermal Analyst, Production Engineer, Robotics Specialist',
      industries: 'Automotive, Aerospace, Heavy Machinery, Energy, Precision Engineering'
    },
    {
      name: 'Civil Engineering',
      code: 'CIVIL',
      description: 'Focuses on structural engineering, transportation networks, environmental engineering, and smart city infrastructure.',
      overview: 'Civil Engineering involves designing, constructing, and maintaining resilient buildings, bridges, water treatment, and transit networks.',
      skills: 'AutoCAD, STAAD Pro, Structural Analysis, Geotechnical Engg, Project Estimation',
      careers: 'Structural Engineer, Construction Manager, Site Engineer, Urban Planner',
      industries: 'Infrastructure Firms, Real Estate Development, Government Public Works, Metro Projects'
    },
    {
      name: 'Cyber Security',
      code: 'CYBER',
      description: 'Specialized program covering network security, ethical hacking, cryptography, and digital forensics.',
      overview: 'Cyber Security prepares students to protect corporate and government infrastructure against cyber attacks, vulnerability exploits, and data breaches.',
      skills: 'Ethical Hacking, Network Security, Cryptography, Penetration Testing, SOC Operations',
      careers: 'Cyber Security Analyst, Penetration Tester, Security Consultant, SOC Lead',
      industries: 'Cybersecurity Agencies, Banking & Finance, Defense, Enterprise Security'
    }
  ];

  for (const c of coursesData) {
    await dbRun(
      `INSERT INTO courses (name, code, description, overview, skills, careers, industries) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [c.name, c.code, c.description, c.overview, c.skills, c.careers, c.industries]
    );
  }

  const coursesList = await dbAll(`SELECT id, code FROM courses`);
  const courseMap = {};
  coursesList.forEach(c => { courseMap[c.code] = c.id; });

  console.log('Seeding colleges...');
  const collegesData = [
    {
      name: 'PSG College of Technology',
      code: 'PSGTECH',
      city: 'Coimbatore',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      type: 'Government-Aided & Autonomous',
      website: 'https://www.psgtech.edu',
      fees: 110000,
      hostel_available: 1,
      hostel_fee: 65000,
      facilities: 'Advanced Research Labs, Supercomputing Center, Sports Complex, 24/7 Library, Incubation Center',
      accreditation: 'NAAC A++, NBA Accredited',
      ranking: 53,
      placement_rate: 96.5,
      avg_package: 10.5
    },
    {
      name: 'PSG Institute of Technology and Applied Research',
      code: 'PSGITECH',
      city: 'Coimbatore',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      type: 'Private & Autonomous',
      website: 'https://www.psgitech.ac.in',
      fees: 140000,
      hostel_available: 1,
      hostel_fee: 70000,
      facilities: 'Modern Green Campus, Innovation Hub, Advanced Electronics Labs, High-Speed Wi-Fi',
      accreditation: 'NAAC A+, NBA Accredited',
      ranking: 85,
      placement_rate: 94.0,
      avg_package: 8.5
    },
    {
      name: 'Kumaraguru College of Technology',
      code: 'KCT',
      city: 'Coimbatore',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      type: 'Private & Autonomous',
      website: 'https://www.kct.ac.in',
      fees: 150000,
      hostel_available: 1,
      hostel_fee: 75000,
      facilities: 'FORGE Innovation Accelerator, 150-acre Eco Campus, Sports Arena, Digital Library',
      accreditation: 'NAAC A++, NBA Accredited',
      ranking: 70,
      placement_rate: 93.5,
      avg_package: 7.8
    },
    {
      name: 'Bannari Amman Institute of Technology',
      code: 'BIT',
      city: 'Sathyamangalam',
      district: 'Erode',
      state: 'Tamil Nadu',
      type: 'Private & Autonomous',
      website: 'https://www.bitsathy.ac.in',
      fees: 120000,
      hostel_available: 1,
      hostel_fee: 60000,
      facilities: 'Special Learning Labs, Robotics Hub, 500Mbps Internet, Synthetic Track, Smart Classrooms',
      accreditation: 'NAAC A++, NBA Accredited',
      ranking: 89,
      placement_rate: 95.0,
      avg_package: 6.8
    },
    {
      name: 'Government College of Technology',
      code: 'GCT',
      city: 'Coimbatore',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      type: 'Government',
      website: 'https://www.gct.ac.in',
      fees: 45000,
      hostel_available: 1,
      hostel_fee: 35000,
      facilities: 'Heritage Campus, Government Research Grants, Historic Library, Central Workshop',
      accreditation: 'NAAC A, NBA Accredited',
      ranking: 95,
      placement_rate: 91.0,
      avg_package: 7.2
    },
    {
      name: 'Sri Ramakrishna Engineering College',
      code: 'SREC',
      city: 'Coimbatore',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      type: 'Private & Autonomous',
      website: 'https://www.srec.ac.in',
      fees: 115000,
      hostel_available: 1,
      hostel_fee: 55000,
      facilities: 'Bosch & PwC CoE Labs, Startup Incubator, Hostel Gym, Cultural Auditorium',
      accreditation: 'NAAC A+, NBA Accredited',
      ranking: 110,
      placement_rate: 92.0,
      avg_package: 6.2
    },
    {
      name: 'Coimbatore Institute of Technology',
      code: 'CIT',
      city: 'Coimbatore',
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      type: 'Government-Aided & Autonomous',
      website: 'https://www.cit.edu.in',
      fees: 85000,
      hostel_available: 1,
      hostel_fee: 50000,
      facilities: 'Computing Center, Nanotechnology Lab, Active Alumni Network, Sports Complex',
      accreditation: 'NAAC A+, NBA Accredited',
      ranking: 102,
      placement_rate: 93.0,
      avg_package: 8.2
    },
    {
      name: 'College of Engineering Guindy (CEG - Anna University)',
      code: 'CEG',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu',
      type: 'Government University Department',
      website: 'https://ceg.annauniv.edu',
      fees: 35000,
      hostel_available: 1,
      hostel_fee: 30000,
      facilities: 'Premier Heritage Institution, High Performance Computing, Research Centers, Central Library',
      accreditation: 'NAAC A++, NIRF Top 15',
      ranking: 13,
      placement_rate: 98.0,
      avg_package: 12.5
    },
    {
      name: 'SSN College of Engineering',
      code: 'SSN',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu',
      type: 'Private & Autonomous',
      website: 'https://www.ssn.edu.in',
      fees: 160000,
      hostel_available: 1,
      hostel_fee: 80000,
      facilities: 'World-Class Research Infrastructure, Shiv Nadar Innovation Labs, Olympic Standard Sports',
      accreditation: 'NAAC A++, NIRF Top 45',
      ranking: 45,
      placement_rate: 97.0,
      avg_package: 10.2
    },
    {
      name: 'Rajalakshmi Engineering College',
      code: 'REC',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu',
      type: 'Private & Autonomous',
      website: 'https://www.rajalakshmi.org',
      fees: 145000,
      hostel_available: 1,
      hostel_fee: 72000,
      facilities: 'Idea Factory, Apple iOS Lab, Modern Hostels, Fleet Transportation',
      accreditation: 'NAAC A++, NBA Accredited',
      ranking: 98,
      placement_rate: 93.0,
      avg_package: 6.5
    },
    {
      name: 'Thiagarajar College of Engineering',
      code: 'TCE',
      city: 'Madurai',
      district: 'Madurai',
      state: 'Tamil Nadu',
      type: 'Government-Aided & Autonomous',
      website: 'https://www.tce.edu',
      fees: 75000,
      hostel_available: 1,
      hostel_fee: 48000,
      facilities: 'TCE Technology Business Incubator, Modern CAD Labs, Sports Ground, Library',
      accreditation: 'NAAC A+, NBA Accredited',
      ranking: 82,
      placement_rate: 94.5,
      avg_package: 7.9
    },
    {
      name: 'Kongu Engineering College',
      code: 'KEC',
      city: 'Perundurai',
      district: 'Erode',
      state: 'Tamil Nadu',
      type: 'Private & Autonomous',
      website: 'https://www.kongu.ac.in',
      fees: 125000,
      hostel_available: 1,
      hostel_fee: 58000,
      facilities: '167-acre Campus, Technology Incubation Park, Solar Power Grid, Convention Center',
      accreditation: 'NAAC A++, NBA Accredited',
      ranking: 118,
      placement_rate: 91.5,
      avg_package: 5.8
    }
  ];

  for (const col of collegesData) {
    await dbRun(
      `INSERT INTO colleges (name, code, city, district, state, type, website, fees, hostel_available, hostel_fee, facilities, accreditation, ranking, placement_rate, avg_package)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [col.name, col.code, col.city, col.district, col.state, col.type, col.website, col.fees, col.hostel_available, col.hostel_fee, col.facilities, col.accreditation, col.ranking, col.placement_rate, col.avg_package]
    );
  }

  const collegesList = await dbAll(`SELECT id, code FROM colleges`);
  const collegeMap = {};
  collegesList.forEach(c => { collegeMap[c.code] = c.id; });

  console.log('Seeding college courses & historical cutoffs...');

  // Cutoff matrix template generator based on realistic TNEA trends
  // Format: { collegeCode, courseCode, categoryCutoffs: { OC, BC, MBC, SC, ST } for 2025 }
  // We generate 2023 & 2024 slightly lower to show realistic historical progression.

  const cutoffSeeds = [
    // CEG Guindy
    { col: 'CEG', crs: 'CSE', cutoffs: { OC: 199.50, BC: 198.50, MBC: 197.00, SC: 191.00, ST: 184.00 } },
    { col: 'CEG', crs: 'ECE', cutoffs: { OC: 198.25, BC: 196.75, MBC: 194.50, SC: 187.50, ST: 180.00 } },
    { col: 'CEG', crs: 'IT',  cutoffs: { OC: 197.50, BC: 196.00, MBC: 193.50, SC: 186.00, ST: 178.50 } },

    // PSG Tech
    { col: 'PSGTECH', crs: 'CSE',  cutoffs: { OC: 198.50, BC: 197.25, MBC: 195.00, SC: 188.00, ST: 181.00 } },
    { col: 'PSGTECH', crs: 'ECE',  cutoffs: { OC: 196.75, BC: 195.25, MBC: 192.50, SC: 184.50, ST: 177.00 } },
    { col: 'PSGTECH', crs: 'AIDS', cutoffs: { OC: 196.00, BC: 194.50, MBC: 191.00, SC: 183.00, ST: 175.50 } },
    { col: 'PSGTECH', crs: 'MECH', cutoffs: { OC: 190.50, BC: 187.00, MBC: 182.00, SC: 171.00, ST: 162.00 } },

    // SSN
    { col: 'SSN', crs: 'CSE',  cutoffs: { OC: 197.50, BC: 196.00, MBC: 193.00, SC: 185.00, ST: 178.00 } },
    { col: 'SSN', crs: 'ECE',  cutoffs: { OC: 195.50, BC: 193.75, MBC: 190.50, SC: 182.00, ST: 173.00 } },
    { col: 'SSN', crs: 'AIDS', cutoffs: { OC: 194.75, BC: 193.00, MBC: 189.50, SC: 180.50, ST: 171.00 } },

    // PSG iTech
    { col: 'PSGITECH', crs: 'CSE',  cutoffs: { OC: 194.50, BC: 192.50, MBC: 188.00, SC: 178.00, ST: 168.00 } },
    { col: 'PSGITECH', crs: 'ECE',  cutoffs: { OC: 191.50, BC: 188.50, MBC: 184.00, SC: 173.00, ST: 163.00 } }, // Moderate for 187.5
    { col: 'PSGITECH', crs: 'AIDS', cutoffs: { OC: 192.00, BC: 189.00, MBC: 185.00, SC: 174.00, ST: 164.00 } },

    // KCT Coimbatore
    { col: 'KCT', crs: 'CSE',  cutoffs: { OC: 195.00, BC: 193.50, MBC: 189.50, SC: 179.00, ST: 169.00 } },
    { col: 'KCT', crs: 'ECE',  cutoffs: { OC: 192.50, BC: 189.50, MBC: 185.00, SC: 174.50, ST: 164.00 } }, // Moderate (-2.00) for 187.5 BC
    { col: 'KCT', crs: 'AIDS', cutoffs: { OC: 193.00, BC: 190.50, MBC: 186.00, SC: 175.50, ST: 165.00 } },
    { col: 'KCT', crs: 'IT',   cutoffs: { OC: 191.00, BC: 188.00, MBC: 183.50, SC: 172.00, ST: 162.00 } },

    // GCT Coimbatore
    { col: 'GCT', crs: 'CSE',  cutoffs: { OC: 196.00, BC: 194.00, MBC: 191.00, SC: 182.00, ST: 172.00 } },
    { col: 'GCT', crs: 'ECE',  cutoffs: { OC: 193.75, BC: 191.50, MBC: 187.00, SC: 177.00, ST: 167.00 } }, // Ambitious (-4.00) for 187.5 BC
    { col: 'GCT', crs: 'EEE',  cutoffs: { OC: 189.00, BC: 185.50, MBC: 180.00, SC: 168.00, ST: 158.00 } },

    // Bannari Amman (BIT) - Erode / Sathy
    { col: 'BIT', crs: 'ECE',  cutoffs: { OC: 188.50, BC: 184.25, MBC: 179.50, SC: 165.00, ST: 155.00 } }, // Safe (+3.25) for 187.5 BC
    { col: 'BIT', crs: 'CSE',  cutoffs: { OC: 191.00, BC: 187.50, MBC: 182.00, SC: 170.00, ST: 160.00 } },
    { col: 'BIT', crs: 'AIDS', cutoffs: { OC: 189.50, BC: 185.50, MBC: 180.50, SC: 167.00, ST: 157.00 } },
    { col: 'BIT', crs: 'IT',   cutoffs: { OC: 187.50, BC: 183.00, MBC: 178.00, SC: 164.00, ST: 154.00 } },

    // SREC Coimbatore
    { col: 'SREC', crs: 'ECE',  cutoffs: { OC: 186.00, BC: 181.50, MBC: 176.00, SC: 160.00, ST: 150.00 } }, // Safe (+6.00) for 187.5 BC
    { col: 'SREC', crs: 'CSE',  cutoffs: { OC: 189.00, BC: 185.00, MBC: 179.50, SC: 164.00, ST: 154.00 } },
    { col: 'SREC', crs: 'AIDS', cutoffs: { OC: 187.00, BC: 182.50, MBC: 177.00, SC: 161.00, ST: 151.00 } },
    { col: 'SREC', crs: 'CYBER',cutoffs: { OC: 185.00, BC: 180.00, MBC: 174.50, SC: 158.00, ST: 148.00 } },

    // CIT Coimbatore
    { col: 'CIT', crs: 'CSE',  cutoffs: { OC: 196.25, BC: 194.50, MBC: 191.50, SC: 182.50, ST: 172.50 } },
    { col: 'CIT', crs: 'ECE',  cutoffs: { OC: 194.00, BC: 191.75, MBC: 188.00, SC: 177.50, ST: 167.50 } },

    // REC Chennai
    { col: 'REC', crs: 'CSE',  cutoffs: { OC: 192.50, BC: 189.50, MBC: 185.00, SC: 174.00, ST: 164.00 } },
    { col: 'REC', crs: 'ECE',  cutoffs: { OC: 189.00, BC: 185.00, MBC: 180.00, SC: 168.00, ST: 158.00 } },

    // TCE Madurai
    { col: 'TCE', crs: 'CSE',  cutoffs: { OC: 196.00, BC: 194.00, MBC: 190.50, SC: 181.00, ST: 171.00 } },
    { col: 'TCE', crs: 'ECE',  cutoffs: { OC: 193.50, BC: 190.50, MBC: 186.00, SC: 175.00, ST: 165.00 } },

    // Kongu Erode
    { col: 'KEC', crs: 'CSE',  cutoffs: { OC: 188.00, BC: 183.50, MBC: 178.00, SC: 162.00, ST: 152.00 } },
    { col: 'KEC', crs: 'ECE',  cutoffs: { OC: 184.50, BC: 179.50, MBC: 173.50, SC: 156.00, ST: 146.00 } }
  ];

  const categories = ['OC', 'BC', 'MBC', 'SC', 'ST'];

  for (const item of cutoffSeeds) {
    const collegeId = collegeMap[item.col];
    const courseId = courseMap[item.crs];

    if (!collegeId || !courseId) continue;

    // Add college_courses record
    await dbRun(
      `INSERT INTO college_courses (college_id, course_id, seats, fees, eligibility) VALUES (?, ?, ?, ?, ?)`,
      [collegeId, courseId, 120, 120000, 'Minimum 50% in PCM in 12th standard or TNEA eligibility']
    );

    // Add cutoff_history for 2023, 2024, 2025
    for (const cat of categories) {
      const cut2025 = item.cutoffs[cat];
      const cut2024 = Math.round((cut2025 - 1.25) * 100) / 100;
      const cut2023 = Math.round((cut2025 - 2.50) * 100) / 100;

      await dbRun(
        `INSERT INTO cutoff_history (college_id, course_id, category, year, cutoff) VALUES (?, ?, ?, ?, ?)`,
        [collegeId, courseId, cat, 2023, cut2023]
      );
      await dbRun(
        `INSERT INTO cutoff_history (college_id, course_id, category, year, cutoff) VALUES (?, ?, ?, ?, ?)`,
        [collegeId, courseId, cat, 2024, cut2024]
      );
      await dbRun(
        `INSERT INTO cutoff_history (college_id, course_id, category, year, cutoff) VALUES (?, ?, ?, ?, ?)`,
        [collegeId, courseId, cat, 2025, cut2025]
      );
    }
  }

  console.log('Database successfully seeded!');
};

if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase(true).then(() => process.exit(0)).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
