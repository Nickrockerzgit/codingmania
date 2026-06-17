const prisma = require('../../prisma/client');

class ProfileService {
  // Get user profile with additional data
  static async getProfileWithStats(userId) {
    try {
      const profile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          bio: true,
          location: true,
          avatar: true,
          join_date: true,
          created_at: true
        }
      });

      if (profile) {
        profile.joinDate = profile.join_date ? new Date(profile.join_date).toLocaleString('en-US', { month: 'long', year: 'numeric' }) : null;
      }

      return profile;
    } catch (error) {
      throw new Error('Failed to fetch profile data');
    }
  }

  // Validate profile data
  static validateProfileData(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.phone || !/^\+?[\d\s-()]{10,}$/.test(data.phone)) {
      errors.push('Invalid phone number format');
    }

    if (data.bio && data.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    if (data.location && data.location.length > 100) {
      errors.push('Location must be less than 100 characters');
    }

    return errors;
  }

  // Check if user exists
  static async userExists(userId) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return !!user;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ProfileService;