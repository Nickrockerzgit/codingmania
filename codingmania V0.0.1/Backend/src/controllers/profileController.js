// const prisma = require('../../prisma/client');
// const bcrypt = require('bcrypt');
// const path = require('path');
// const fs = require('fs');

// // Get user profile
// const getProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const profile = await prisma.users.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phone: true,
//         bio: true,
//         location: true,
//         avatar: true,
//         join_date: true,
//         created_at: true
//       }
//     });

//     if (!profile) {
//       return res.status(404).json({ message: 'Profile not found' });
//     }

//     // Format the response
//     const profileData = {
//       id: profile.id,
//       name: profile.name,
//       email: profile.email,
//       phone: profile.phone,
//       bio: profile.bio || '',
//       location: profile.location || '',
//       avatar: profile.avatar || '',
//       joinDate: profile.join_date || profile.created_at
//     };

//     res.status(200).json({
//       message: 'Profile fetched successfully',
//       data: profileData
//     });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({ message: 'Failed to fetch profile' });
//   }
// };

// // Update user profile
// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { name, phone, bio, location } = req.body;

//     // Validate required fields
//     if (!name || !phone) {
//       return res.status(400).json({ message: 'Name and phone are required' });
//     }

//     // Check if phone is already taken by another user
//     const existingUser = await prisma.users.findFirst({
//       where: {
//         phone,
//         NOT: { id: userId }
//       }
//     });
    
//     if (existingUser) {
//       return res.status(400).json({ message: 'Phone number already exists' });
//     }

//     // Update profile
//     await prisma.users.update({
//       where: { id: userId },
//       data: {
//         name,
//         phone,
//         bio: bio || '',
//         location: location || ''
//       }
//     });

//     res.status(200).json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({ message: 'Failed to update profile' });
//   }
// };

// // Upload profile avatar
// const uploadAvatar = async (req, res) => {
//   try {
//     const userId = req.user.id;
    
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // Get current avatar to delete old one
//     const currentUser = await prisma.users.findUnique({
//       where: { id: userId },
//       select: { avatar: true }
//     });
    
//     // Delete old avatar if exists
//     if (currentUser && currentUser.avatar) {
//       const oldAvatarPath = path.join(__dirname, '..', currentUser.avatar);
//       if (fs.existsSync(oldAvatarPath)) {
//         fs.unlinkSync(oldAvatarPath);
//       }
//     }

//     // Update avatar path in database
//     const avatarPath = `/uploads/images/${req.file.filename}`;
//     await prisma.users.update({
//       where: { id: userId },
//       data: { avatar: avatarPath }
//     });

//     res.status(200).json({
//       message: 'Avatar updated successfully',
//       avatar: avatarPath
//     });
//   } catch (error) {
//     console.error('Upload avatar error:', error);
//     res.status(500).json({ message: 'Failed to upload avatar' });
//   }
// };

// // Change password
// const changePassword = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ message: 'Current password and new password are required' });
//     }

//     if (newPassword.length < 8) {
//       return res.status(400).json({ message: 'New password must be at least 8 characters long' });
//     }

//     // Get current user
//     const user = await prisma.users.findUnique({
//       where: { id: userId },
//       select: { password: true }
//     });
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Verify current password
//     const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
//     if (!isCurrentPasswordValid) {
//       return res.status(400).json({ message: 'Current password is incorrect' });
//     }

//     // Hash new password
//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     // Update password
//     await prisma.users.update({
//       where: { id: userId },
//       data: { password: hashedNewPassword }
//     });

//     res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(500).json({ message: 'Failed to change password' });
//   }
// };

// module.exports = {
//   getProfile,
//   updateProfile,
//   uploadAvatar,
//   changePassword
// };









//imagkit version
const prisma = require('../../prisma/client');
const bcrypt = require('bcrypt');
const imagekit = require('../config/imagekit');


// ================= GET PROFILE =================
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        avatar: true,
        avatarFileId: true,
        join_date: true,
        created_at: true,
        role: true,
        appliedRole: true,
        applicationStatus: true,
        rollNumber: true,
        company: true,
        position: true,
        batch: true,
        branch: true,
        yearOfStudy: true,
        collegeName: true,
        githubUrl: true,
        websiteUrl: true
      }
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({
      message: "Profile fetched successfully",
      data: {
        ...profile,
        joinDate: profile.join_date || profile.created_at
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, bio, location, company, position, batch, branch, yearOfStudy, collegeName, githubUrl, websiteUrl } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const existingUser = await prisma.users.findFirst({
      where: { phone, NOT: { id: userId } }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Only update fields that were actually sent (so editing a student profile
    // doesn't wipe alumni fields and vice-versa).
    const updateData = { name, phone };
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (company !== undefined) updateData.company = company;
    if (position !== undefined) updateData.position = position;
    if (batch !== undefined) updateData.batch = batch;
    if (branch !== undefined) updateData.branch = branch;
    if (yearOfStudy !== undefined) updateData.yearOfStudy = yearOfStudy;
    if (collegeName !== undefined) updateData.collegeName = collegeName;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;

    await prisma.users.update({
      where: { id: userId },
      data: updateData
    });

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


// ================= UPLOAD AVATAR =================
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get old avatar fileId
    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
      select: { avatarFileId: true }
    });

    // Delete old avatar from ImageKit
    if (existingUser?.avatarFileId) {
      try {
        await imagekit.deleteFile(existingUser.avatarFileId);
      } catch (err) {
        console.log("Old avatar deletion failed:", err.message);
      }
    }

    // Upload new avatar
    const uploadResult = await imagekit.upload({
      file: req.file.buffer,
      fileName: `avatar_${userId}_${Date.now()}`,
      folder: "/uploads/avatars"
    });

    // Save in DB
    await prisma.users.update({
      where: { id: userId },
      data: {
        avatar: uploadResult.url,
        avatarFileId: uploadResult.fileId
      }
    });

    res.json({
      message: "Avatar updated successfully",
      avatar: uploadResult.url
    });

  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};


// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ message: "Current password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: userId },
      data: { password: hashed }
    });

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword
};








