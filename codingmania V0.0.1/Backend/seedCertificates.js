const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const certificatesData = [
  {
    title: "Cybersecurity Specialist",
    issuer: "SecureNet Academy",
    date: new Date("2025-02-15"),
    description: "Advanced cybersecurity training covering threat analysis, network security, and incident response.",
    credentialId: "CS-2025-445566",
    skills: JSON.stringify(["Cybersecurity", "Network Security", "Incident Response"]),
    downloadUrl: "/certificates/cybersecurity.pdf",
    verificationUrl: "https://securenet.academy/verify/CS-2025-445566",
    status: "in-progress"
  },
  {
    title: "Advanced React Development",
    issuer: "TechCorp Academy",
    date: new Date("2024-12-15"),
    description: "Comprehensive course covering advanced React concepts, hooks, context API, and performance optimization.",
    credentialId: "RC-2024-001234",
    skills: JSON.stringify(["React", "JavaScript", "Redux", "Hooks"]),
    downloadUrl: "/certificates/react-advanced.pdf",
    verificationUrl: "https://techcorp.academy/verify/RC-2024-001234",
    status: "completed"
  },
  {
    title: "Full Stack Web Development",
    issuer: "CodeMasters Institute",
    date: new Date("2024-11-20"),
    description: "Complete full-stack development bootcamp covering frontend, backend, and database technologies.",
    credentialId: "FS-2024-005678",
    skills: JSON.stringify(["Node.js", "MongoDB", "Express", "React"]),
    downloadUrl: "/certificates/fullstack.pdf",
    verificationUrl: "https://codemasters.edu/verify/FS-2024-005678",
    status: "completed"
  },
  {
    title: "Cloud Computing Fundamentals",
    issuer: "CloudTech University",
    date: new Date("2024-10-10"),
    description: "Introduction to cloud computing, AWS services, and deployment strategies.",
    credentialId: "CC-2024-009876",
    skills: JSON.stringify(["AWS", "Cloud Computing", "Docker", "Kubernetes"]),
    downloadUrl: "/certificates/cloud-fundamentals.pdf",
    verificationUrl: "https://cloudtech.university/verify/CC-2024-009876",
    status: "completed"
  },
  {
    title: "Data Science with Python",
    issuer: "DataScience Pro",
    date: new Date("2024-09-05"),
    description: "Comprehensive data science course covering Python, pandas, machine learning, and data visualization.",
    credentialId: "DS-2024-112233",
    skills: JSON.stringify(["Python", "Pandas", "Machine Learning", "Data Visualization"]),
    downloadUrl: "/certificates/data-science.pdf",
    verificationUrl: "https://datasciencepro.com/verify/DS-2024-112233",
    status: "completed"
  }
];

async function main() {
  const user = await prisma.users.findFirst({
    where: { role: 'student' }
  });

  if (!user) {
    console.log("No student user found. Attempting to get any user.");
    const anyUser = await prisma.users.findFirst();
    if(!anyUser){
      console.log("No users in the database at all! Can't seed certificates.");
      return;
    }
    await seedForUser(anyUser.id);
  } else {
    await seedForUser(user.id);
  }
}

async function seedForUser(userId) {
  console.log(`Seeding certificates for user ID: ${userId}`);
  
  for (const cert of certificatesData) {
    await prisma.certificates.create({
      data: {
        userId: userId,
        ...cert
      }
    });
    console.log(`Created certificate: ${cert.title}`);
  }
  
  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
