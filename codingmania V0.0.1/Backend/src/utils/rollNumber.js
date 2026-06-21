// MPDTE college + branch reference data and roll-number parser.
// Roll number format: <collegeCode(4 digits)><branchCode(2-4 letters)><admissionYear(2 digits)><studentNumber(4 digits)>
// Example: 0967CS221060  ->  college 0967, branch CS, year 2022, student 1060

const COLLEGES = {
  // Government & Government-Aided
  "0104": "SGSITS Indore",
  "0201": "Jabalpur Engineering College (JEC)",
  "0102": "Madhav Institute of Technology & Science (MITS), Gwalior",
  "0101": "IET DAVV, Indore",
  "0103": "Samrat Ashok Technological Institute (SATI), Vidisha",
  "0109": "UIT RGPV Bhopal",
  "0202": "Ujjain Engineering College (UEC)",
  "0203": "Rewa Engineering College (REC)",
  "0204": "Indira Gandhi Engineering College (IGEC), Sagar",
  "0967": "UIT Shivpuri",
  "0941": "UIT Shahdol",
  "0205": "Nowgong Engineering College",
  "0942": "UIT Jhabua",
  // Private
  "0113": "LNCT Bhopal",
  "0176": "LNCT Excellence",
  "0144": "LNCT Science",
  "0115": "OIST Bhopal",
  "0149": "SISTec Bhopal",
  "0117": "TIT Bhopal",
  "0114": "BIST Bhopal",
  "0108": "IPS Academy Indore",
  "0143": "Indore Institute of Science and Technology",
  "0192": "Acropolis Institute of Technology and Research",
  "0110": "Medi-Caps Institute",
  "0112": "Shri Vaishnav Institute",
  "0208": "Gyan Ganga Institute",
  "0217": "Shriram Institute of Information Technology",
};

const BRANCHES = {
  // Computer Science & IT
  CS: "Computer Science Engineering",
  IT: "Information Technology",
  CI: "Computer Science & Information Technology",
  CSBS: "Computer Science & Business Systems",
  // AI & Modern Specializations
  AI: "Artificial Intelligence",
  AL: "Artificial Intelligence & Machine Learning",
  CL: "Artificial Intelligence & Machine Learning",
  AD: "Artificial Intelligence & Data Science",
  DS: "Data Science",
  CD: "Data Science",
  CY: "Cyber Security",
  CN: "Cyber Security",
  IO: "Internet of Things",
  IS: "IoT & Cyber Security with Blockchain",
  RA: "Robotics & Artificial Intelligence",
  // Core Engineering
  CE: "Civil Engineering",
  ME: "Mechanical Engineering",
  EE: "Electrical Engineering",
  EC: "Electronics & Communication Engineering",
  EX: "Electrical & Electronics Engineering",
  // Specialized Branches
  AU: "Automobile Engineering",
  CM: "Chemical Engineering",
  BT: "Biotechnology",
  BM: "Biomedical Engineering",
  FT: "Fire Technology & Safety Engineering",
  IP: "Industrial & Production Engineering",
  MI: "Mining Engineering",
  TX: "Textile Technology",
  PE: "Petrochemical Engineering",
  EV: "Environmental Engineering",
};

// A student is considered "alumni" once 4 years have passed since admission.
const COURSE_DURATION_YEARS = 4;

const ordinal = (n) => {
  if (n <= 1) return "1st Year";
  if (n === 2) return "2nd Year";
  if (n === 3) return "3rd Year";
  return "4th Year";
};

/**
 * Parse & validate an MPDTE roll number.
 * @param {string} rawRoll
 * @param {number} [currentYear] defaults to the server's current year
 * @returns {{ valid: boolean, error?: string, rollNumber?, collegeCode?, collegeName?, branchCode?, branchName?, admissionYear?, studentNumber?, role?, batch?, yearOfStudy? }}
 */
const parseRollNumber = (rawRoll, currentYear = new Date().getFullYear()) => {
  if (!rawRoll || typeof rawRoll !== "string") {
    return { valid: false, error: "Roll number is required." };
  }

  const roll = rawRoll.trim().toUpperCase();

  // 4-digit college + 2-4 letter branch + 2-digit year + 4-digit student number
  if (!/^\d{4}[A-Z]{2,4}\d{6}$/.test(roll)) {
    return { valid: false, error: "Invalid roll number format (e.g. 0967CS221060)." };
  }

  const collegeCode = roll.slice(0, 4);
  const last6 = roll.slice(-6);
  const branchCode = roll.slice(4, roll.length - 6);
  const yearTwoDigit = last6.slice(0, 2);
  const studentNumber = last6.slice(2);

  const collegeName = COLLEGES[collegeCode];
  if (!collegeName) {
    return { valid: false, error: `Unknown college code "${collegeCode}".` };
  }

  const branchName = BRANCHES[branchCode];
  if (!branchName) {
    return { valid: false, error: `Unknown branch code "${branchCode}".` };
  }

  const admissionYear = 2000 + parseInt(yearTwoDigit, 10);
  if (admissionYear > currentYear + 1) {
    return { valid: false, error: "Admission year cannot be in the future." };
  }

  const yearsSinceAdmission = currentYear - admissionYear;
  const role = yearsSinceAdmission >= COURSE_DURATION_YEARS ? "alumni" : "student";

  return {
    valid: true,
    rollNumber: roll,
    collegeCode,
    collegeName,
    branchCode,
    branchName,
    admissionYear,
    studentNumber,
    role,
    // Alumni: their pass-out batch year. Student: current year of study.
    batch: String(admissionYear + COURSE_DURATION_YEARS),
    yearOfStudy: role === "student" ? ordinal(yearsSinceAdmission + 1) : null,
  };
};

module.exports = { COLLEGES, BRANCHES, COURSE_DURATION_YEARS, parseRollNumber };
