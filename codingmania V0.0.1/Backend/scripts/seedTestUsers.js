require('dotenv').config();

const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');

const TEST_PASSWORD = 'Test@12345';

const publicUsers = [
  {
    name: 'Public Demo One',
    email: 'public.demo.one@technoverse.test',
    phone: '9000000001',
    bio: 'Public test account for normal website login checks.',
    location: 'Bhopal',
  },
  {
    name: 'Public Demo Two',
    email: 'public.demo.two@technoverse.test',
    phone: '9000000002',
    bio: 'Second public test account for access-control checks.',
    location: 'Indore',
  },
];

const studentUsers = [
  {
    name: 'Student Demo One',
    email: 'student.demo.one@technoverse.test',
    phone: '9000000003',
    bio: 'Approved student test account.',
    location: 'Delhi',
    yearOfStudy: '2nd Year',
    branch: 'CSE',
    collegeName: 'Technoverse Institute of Technology',
    githubUrl: 'https://github.com/student-demo-one',
    websiteUrl: 'https://student-demo-one.example.com',
  },
  {
    name: 'Student Demo Two',
    email: 'student.demo.two@technoverse.test',
    phone: '9000000004',
    bio: 'Second approved student test account.',
    location: 'Lucknow',
    yearOfStudy: '3rd Year',
    branch: 'IT',
    collegeName: 'Technoverse Institute of Technology',
    githubUrl: 'https://github.com/student-demo-two',
    websiteUrl: 'https://student-demo-two.example.com',
  },
];

const alumniUsers = [
  {
    name: 'Alumni Demo One',
    email: 'alumni.demo.one@technoverse.test',
    phone: '9000000005',
    bio: 'Approved alumni test account.',
    location: 'Pune',
    company: 'TechNova Labs',
    position: 'Software Engineer',
    batch: '2022',
    branch: 'CSE',
  },
  {
    name: 'Alumni Demo Two',
    email: 'alumni.demo.two@technoverse.test',
    phone: '9000000006',
    bio: 'Second approved alumni test account.',
    location: 'Bengaluru',
    company: 'Future Stack Systems',
    position: 'Product Designer',
    batch: '2021',
    branch: 'IT',
  },
];

const adminApplicants = [
  {
    user: {
      name: 'Admin Applicant One',
      email: 'admin.applicant.one@technoverse.test',
      phone: '9000000007',
      bio: 'Normal account that also has a pending admin application.',
      location: 'Hyderabad',
    },
    request: {
      full_name: 'Admin Applicant One',
      email: 'admin.applicant.one@technoverse.test',
      phone: '9000000007',
      college_name: 'Technoverse Institute of Technology',
      course_stream: 'B.Tech CSE',
      year_of_study: '4th Year',
      skills: JSON.stringify(['React.js', 'Node.js', 'Team Leadership']),
      interests: JSON.stringify(['Open Source Contributions', 'Event Management']),
      motivation: 'I want to help manage operations, support events, and contribute to the community as an admin.',
      github_url: 'https://github.com/admin-applicant-one',
      linkedin_url: 'https://linkedin.com/in/admin-applicant-one',
      website_url: 'https://admin-applicant-one.example.com',
      team_preferences: JSON.stringify(['Backend Developer', 'Event Organizer']),
      role_applied: 'admin',
      status: 'pending',
    },
  },
  {
    user: {
      name: 'Admin Applicant Two',
      email: 'admin.applicant.two@technoverse.test',
      phone: '9000000008',
      bio: 'Second normal account with a pending admin application.',
      location: 'Jaipur',
    },
    request: {
      full_name: 'Admin Applicant Two',
      email: 'admin.applicant.two@technoverse.test',
      phone: '9000000008',
      college_name: 'Technoverse Institute of Technology',
      course_stream: 'B.Tech IT',
      year_of_study: '3rd Year',
      skills: JSON.stringify(['UI/UX Design', 'Content Writing', 'Operations']),
      interests: JSON.stringify(['UI/UX Design', 'Community Building']),
      motivation: 'I want to contribute to the Technoverse admin team and help coordinate content and member experience.',
      github_url: 'https://github.com/admin-applicant-two',
      linkedin_url: 'https://linkedin.com/in/admin-applicant-two',
      website_url: 'https://admin-applicant-two.example.com',
      team_preferences: JSON.stringify(['Designer', 'Content Creator']),
      role_applied: 'admin',
      status: 'pending',
    },
  },
];

async function upsertUser(userData, overrides = {}) {
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  return prisma.users.upsert({
    where: { email: userData.email },
    update: {
      name: userData.name,
      phone: userData.phone,
      password: hashedPassword,
      bio: userData.bio || null,
      location: userData.location || '',
      avatar: '',
      avatarFileId: null,
      role: overrides.role || 'student',
      adminAccess: false,
      superAdminAccess: false,
      applicationStatus: overrides.applicationStatus ?? 'pending',
      appliedRole: overrides.appliedRole ?? null,
      yearOfStudy: overrides.yearOfStudy ?? null,
      collegeName: overrides.collegeName ?? null,
      githubUrl: overrides.githubUrl ?? null,
      websiteUrl: overrides.websiteUrl ?? null,
      company: overrides.company ?? null,
      position: overrides.position ?? null,
      batch: overrides.batch ?? null,
      branch: overrides.branch ?? null,
    },
    create: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword,
      bio: userData.bio || null,
      location: userData.location || '',
      avatar: '',
      avatarFileId: null,
      role: overrides.role || 'student',
      adminAccess: false,
      superAdminAccess: false,
      applicationStatus: overrides.applicationStatus ?? 'pending',
      appliedRole: overrides.appliedRole ?? null,
      yearOfStudy: overrides.yearOfStudy ?? null,
      collegeName: overrides.collegeName ?? null,
      githubUrl: overrides.githubUrl ?? null,
      websiteUrl: overrides.websiteUrl ?? null,
      company: overrides.company ?? null,
      position: overrides.position ?? null,
      batch: overrides.batch ?? null,
      branch: overrides.branch ?? null,
    },
  });
}

async function ensurePendingAdminRequest(requestData) {
  const existing = await prisma.join_us.findFirst({
    where: {
      email: requestData.email,
      role_applied: 'admin',
    },
    orderBy: {
      id: 'desc',
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.join_us.create({
    data: requestData,
  });
}

async function main() {
  console.log('Seeding local test users...');
  console.log(`Default test password for all seeded users: ${TEST_PASSWORD}`);

  for (const user of publicUsers) {
    await upsertUser(user, {
      role: 'student',
      applicationStatus: 'pending',
      appliedRole: null,
    });
  }

  for (const user of studentUsers) {
    await upsertUser(user, {
      role: 'student',
      appliedRole: 'student',
      applicationStatus: 'approved',
      yearOfStudy: user.yearOfStudy,
      branch: user.branch,
      collegeName: user.collegeName,
      githubUrl: user.githubUrl,
      websiteUrl: user.websiteUrl,
    });
  }

  for (const user of alumniUsers) {
    await upsertUser(user, {
      role: 'alumni',
      appliedRole: 'alumni',
      applicationStatus: 'approved',
      company: user.company,
      position: user.position,
      batch: user.batch,
      branch: user.branch,
    });
  }

  for (const applicant of adminApplicants) {
    await upsertUser(applicant.user, {
      role: 'student',
      applicationStatus: 'pending',
      appliedRole: null,
    });
    await ensurePendingAdminRequest(applicant.request);
  }

  console.log('Seed complete.');
  console.log('Created or updated accounts:');
  [
    ...publicUsers,
    ...studentUsers,
    ...alumniUsers,
    ...adminApplicants.map((entry) => entry.user),
  ].forEach((user) => {
    console.log(`- ${user.email}`);
  });
}

main()
  .catch((error) => {
    console.error('Failed to seed test users:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
