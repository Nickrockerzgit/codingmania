const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const approvedAlumni = await p.users.findMany({
    where: {
      applicationStatus: 'approved',
      appliedRole: 'alumni'
    }
  });
  
  console.log('Found', approvedAlumni.length, 'approved alumni users');
  
  for (const user of approvedAlumni) {
    const existingProfile = await p.alumni_profiles.findUnique({
      where: { userId: user.id }
    });
    
    if (!existingProfile) {
      await p.alumni_profiles.create({
        data: {
          userId: user.id,
          batch: '2024',
          branch: 'Computer Science',
          company: 'Company',
          position: 'Software Engineer',
          bio: `Hi, I'm ${user.name}!`
        }
      });
      console.log('Created profile for:', user.name);
    } else {
      console.log('Profile already exists for:', user.name);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => p.$disconnect());