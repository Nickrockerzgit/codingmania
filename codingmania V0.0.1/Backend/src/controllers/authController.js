const prisma = require('../../prisma/client'); // New: Prisma client
const { sendEmail } = require('../config/email');
const emailTemplates = require('../utils/emailTemplates');
const generateOTP = require('../utils/generateOTP');
const bcrypt = require('bcrypt');
const generateToken = require('../config/jwt');
const { parseRollNumber } = require('../utils/rollNumber');

// Google Auth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SUPER_ADMIN_EMAIL = 'lancer969976@gmail.com';

const buildAuthPayload = (user) => ({
  role: user?.role,
  appliedRole: user?.appliedRole,
  applicationStatus: user?.applicationStatus,
  adminAccess: !!user?.adminAccess,
  superAdminAccess: !!user?.superAdminAccess,
});

// -------------------- OTP SIGNUP --------------------
const sendSignupOTP = async (req, res) => {
  const { name, email, phone, password, rollNumber } = req.body;
  try {
    // Validate the roll number up-front so we don't send an OTP for an invalid one
    const parsed = parseRollNumber(rollNumber);
    if (!parsed.valid) {
      return res.status(400).json({ message: parsed.error });
    }

    // Check if email, phone, or roll number already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { phone },
          { rollNumber: parsed.rollNumber }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
      if (existingUser.rollNumber === parsed.rollNumber) {
        return res.status(400).json({ message: "Roll number already registered" });
      }
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 min
    
    // Delete any existing OTPs for this email
    await prisma.otps.deleteMany({ where: { email } });
    
    await prisma.otps.create({
      data: { email, otp, expires_at: expiresAt }
    });
    
    try {
      await sendEmail(email, "Signup OTP - Technoverse", emailTemplates.otp(name, otp));
    } catch (emailErr) {
      console.error("Failed to send OTP email:", emailErr);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
    
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: err.message || "Failed to send OTP" });
  }
};

const verifySignupOTP = async (req, res) => {
  const { name, email, phone, password, otp, rollNumber } = req.body;
  try {
    // Re-validate & derive student/alumni from the roll number
    const parsed = parseRollNumber(rollNumber);
    if (!parsed.valid) {
      return res.status(400).json({ message: parsed.error });
    }

    const otpRecord = await prisma.otps.findFirst({
      where: { email },
      orderBy: { id: 'desc' }
    });
    if (!otpRecord || otpRecord.otp !== otp || new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email, phone, or roll number already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { phone },
          { rollNumber: parsed.rollNumber }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
      if (existingUser.rollNumber === parsed.rollNumber) {
        return res.status(400).json({ message: "Roll number already registered" });
      }
    }

    // Auto-assign student/alumni based on the roll number — no manual application needed.
    const user = await prisma.users.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        rollNumber: parsed.rollNumber,
        role: parsed.role,
        appliedRole: parsed.role,
        applicationStatus: 'approved',
        collegeName: parsed.collegeName,
        branch: parsed.branchName,
        batch: parsed.batch,
        yearOfStudy: parsed.yearOfStudy,
      }
    });
    await prisma.otps.deleteMany({ where: { email } });

    try {
      await sendEmail(email, "Welcome to Technoverse!", emailTemplates.welcome(name));
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    const token = generateToken({ id: user.id, email });
    res.status(201).json({
      message: "Signup successful",
      token,
      role: user.role,
      appliedRole: user.appliedRole,
      applicationStatus: user.applicationStatus,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message || "Signup failed" });
  }
};

// -------------------- OTP LOGIN --------------------
const sendLoginOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.blocked) {
      return res.status(403).json({ message: "Your account has been blocked. Please contact the admin." });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000);
    await prisma.otps.create({
      data: { email, otp, expires_at: expiresAt }
    });
    await sendEmail(email, "Login OTP - Technoverse", emailTemplates.otp(user.name, otp));
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await prisma.otps.findFirst({
      where: { email },
      orderBy: { id: 'desc' }
    });
    if (!otpRecord || otpRecord.otp !== otp || new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.otps.deleteMany({ where: { email } });

    const user = await prisma.users.findUnique({ where: { email }, select: { name: true } });
    if (user) {
      await sendEmail(email, "New Sign In Detected", emailTemplates.signin(user.name));
    }

    const fullUser = await prisma.users.findUnique({ where: { email } });
    const token = generateToken({ id: fullUser.id, email });
    res.status(200).json({
      message: "Login successful",
      token,
      ...buildAuthPayload(fullUser),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// -------------------- ADMIN OTP LOGIN --------------------
const sendAdminLoginOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }

    if (!user.adminAccess && !user.superAdminAccess) {
      return res.status(403).json({ message: "You are not an approved admin member yet" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000);

    await prisma.otps.deleteMany({ where: { email } });
    await prisma.otps.create({
      data: { email, otp, expires_at: expiresAt }
    });

    await sendEmail(email, "Admin Login OTP - Technoverse", emailTemplates.otp(user.name, otp));
    res.status(200).json({ message: "OTP sent to your admin email" });
  } catch (err) {
    console.error("Admin send OTP error:", err);
    res.status(500).json({ message: "Failed to send admin OTP" });
  }
};

const verifyAdminLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }

    if (!user.adminAccess && !user.superAdminAccess) {
      return res.status(403).json({ message: "You are not an approved admin member yet" });
    }

    const otpRecord = await prisma.otps.findFirst({
      where: { email },
      orderBy: { id: 'desc' }
    });

    if (!otpRecord || otpRecord.otp !== otp || new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const shouldBeSuperAdmin = user.superAdminAccess || user.email === SUPER_ADMIN_EMAIL;

    if (shouldBeSuperAdmin && !user.superAdminAccess) {
      await prisma.users.update({
        where: { email },
        data: {
          adminAccess: true,
          superAdminAccess: true,
        },
      });
    }

    await prisma.otps.deleteMany({ where: { email } });

    const refreshedUser = await prisma.users.findUnique({ where: { email } });
    const token = generateToken({ id: refreshedUser.id, email });

    res.status(200).json({
      message: "Admin login successful",
      token,
      isSuperAdmin: !!refreshedUser?.superAdminAccess,
      ...buildAuthPayload(refreshedUser),
    });
  } catch (err) {
    console.error("Admin verify OTP error:", err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

// -------------------- ALUMNI OTP SIGNUP --------------------
const sendAlumniSignupOTP = async (req, res) => {
  const { name, email, phone, password, company, position, batch, branch } = req.body;
  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000);
    await prisma.otps.create({
      data: { email, otp, expires_at: expiresAt }
    });
    await sendEmail(email, "Alumni Signup OTP - Technoverse", emailTemplates.otp(name, otp));
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyAlumniSignupOTP = async (req, res) => {
  const { name, email, phone, password, company, position, batch, branch, otp } = req.body;
  try {
    const otpRecord = await prisma.otps.findFirst({
      where: { email },
      orderBy: { id: 'desc' }
    });
    if (!otpRecord || otpRecord.otp !== otp || new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { 
        name, 
        email, 
        phone, 
        password: hashedPassword,
        role: 'alumni',
        company,
        position,
        batch,
        branch
      }
    });
    await prisma.otps.deleteMany({ where: { email } });

    await sendEmail(email, "Welcome to Technoverse Alumni!", emailTemplates.welcome(name));

    const token = generateToken({ id: user.id, email });
    res.status(201).json({ message: "Alumni signup successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// -------------------- ALUMNI SIGNUP WITH AVATAR --------------------
const verifyAlumniSignupOTPWithAvatar = async (req, res) => {
  const { name, email, phone, password, company, position, batch, branch, otp } = req.body;
  
  try {
    const otpRecord = await prisma.otps.findFirst({
      where: { email },
      orderBy: { id: 'desc' }
    });
    if (!otpRecord || otpRecord.otp !== otp || new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let avatarUrl = "";
    let avatarFileId = null;
    
    // Handle avatar upload if provided
    if (req.file) {
      const imagekit = require('../config/imagekit');
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: `avatar_${Date.now()}_${req.file.originalname}`,
        folder: "/uploads/avatars"
      });
      avatarUrl = uploadResult.url;
      avatarFileId = uploadResult.fileId;
    }

    // Create user with avatar if provided
    const user = await prisma.users.create({
      data: { 
        name, 
        email, 
        phone, 
        password: hashedPassword,
        role: 'alumni',
        company,
        position,
        batch,
        branch,
        avatar: avatarUrl,
        avatarFileId: avatarFileId
      }
    });
    
    await prisma.otps.deleteMany({ where: { email } });

    await sendEmail(email, "Welcome to Technoverse Alumni!", emailTemplates.welcome(name));

    const token = generateToken({ id: user.id, email });
    res.status(201).json({ message: "Alumni signup successful", token, avatar: avatarUrl });
  } catch (err) {
    console.error("Signup with avatar error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// -------------------- ALUMNI OTP LOGIN --------------------
const sendAlumniLoginOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== 'alumni') return res.status(403).json({ message: "Not an alumni account" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000);
    await prisma.otps.create({
      data: { email, otp, expires_at: expiresAt }
    });
    await sendEmail(email, "Alumni Login OTP - Technoverse", emailTemplates.otp(user.name, otp));
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyAlumniLoginOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await prisma.otps.findFirst({
      where: { email },
      orderBy: { id: 'desc' }
    });
    if (!otpRecord || otpRecord.otp !== otp || new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.otps.deleteMany({ where: { email } });

    const user = await prisma.users.findUnique({ where: { email } });
    if (user) {
      await sendEmail(email, "New Alumni Sign In Detected", emailTemplates.signin(user.name));
    }
    const token = generateToken({ id: user.id, email });
    res.status(200).json({ message: "Alumni login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// -------------------- FORGOT PASSWORD --------------------
const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- GOOGLE AUTH --------------------
const googleAuth = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.users.create({
        data: { name, email, phone: '', password: '' }
      });
    }

    const token = generateToken({ id: user.id, email });

    res.status(200).json({ 
      message: "Google sign-in successful", 
      token, 
      user: { name: user.name, email: user.email },
      role: user.role
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ message: "Google authentication failed" });
  }
};

module.exports = {
  sendSignupOTP,
  verifySignupOTP,
  sendLoginOTP,
  verifyLoginOTP,
  sendAdminLoginOTP,
  verifyAdminLoginOTP,
  sendAlumniSignupOTP,
  verifyAlumniSignupOTP,
  verifyAlumniSignupOTPWithAvatar,
  sendAlumniLoginOTP,
  verifyAlumniLoginOTP,
  forgotPassword,
  googleAuth
};
