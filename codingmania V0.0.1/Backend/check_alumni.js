const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.alumni_profiles.findMany({ include: { user: true } })
  .then(r => { 
    console.log('Count:', r.length); 
    console.log(JSON.stringify(r.slice(0, 3), null, 2)); 
  })
  .catch(e => console.log('Error:', e.message))
  .finally(() => p.$disconnect());