const jwt = require('jsonwebtoken');
const prisma = require('../../prisma/client');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;

    if (decoded?.id) {
      user = await prisma.users.findUnique({ where: { id: decoded.id } });
    }

    if (!user && decoded?.email) {
      user = await prisma.users.findUnique({ where: { email: decoded.email } });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireAdminCapability = (req, res, next) => {
  if (!req.user?.adminAccess && !req.user?.superAdminAccess) {
    return res.status(403).json({ message: 'Approved admin access required' });
  }

  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.user?.superAdminAccess) {
    return res.status(403).json({ message: 'Super admin access required' });
  }

  next();
};

module.exports = { authenticateToken, requireAdminCapability, requireSuperAdmin };
