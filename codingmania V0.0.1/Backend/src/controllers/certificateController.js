const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get certificates for the logged-in user
exports.getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.id;

    const certificates = await prisma.certificates.findMany({
      orderBy: { date: 'desc' },
    });

    // Parse skills text back to array if possible
    const formattedCertificates = certificates.map(cert => {
      let parsedSkills = [];
      try {
        if (cert.skills) {
             // Let's assume it could be JSON string or comma separated
             parsedSkills = JSON.parse(cert.skills);
        }
      } catch (e) {
          if (cert.skills) {
            parsedSkills = cert.skills.split(',').map(s => s.trim());
          }
      }

      return {
        ...cert,
        skills: parsedSkills,
      };
    });

    res.json(formattedCertificates);
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ error: 'Failed to get user certificates' });
  }
};
