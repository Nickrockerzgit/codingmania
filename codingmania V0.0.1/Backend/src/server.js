const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
// const helmet = require('helmet'); 

// Initialize environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const carouselRoutes = require('./routes/carouselRoutes');
const teamRoutes = require('./routes/teamRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const joinUsRoutes = require('./routes/joinUsRoutes');
const vlogRoutes = require('./routes/vlogRoutes');
const chatRoutes = require("./routes/chatRoutes");
const resumeAIRoutes = require("./routes/resumeAIRoutes");
const coverLetterRoutes = require("./routes/coverLetterRoutes");
const quizRoutes  = require("./routes/quizeRoutes");
const messagesRoutes = require("./routes/messagesRoutes");

const usersRoutes = require('./routes/userlistRoutes');
const tasksRoutes = require('./routes/tasksRoutes');
const webinarsRoutes = require('./routes/webinarsRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const eventAlumniRoutes = require('./routes/eventAlumniRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobAlumniRoutes = require('./routes/jobAlumniRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import Prisma client (new)
const prisma = require('../prisma/client'); // Centralized Prisma

// Import chat service
const chatService = require('./service/chatService');
const { notifyUser } = require('./utils/notify');

// Initialize Express app
const app = express();

// Trust the first proxy (e.g. Render / Nginx) so rate limiting & req.ip
// use the real client IP instead of the proxy's.
app.set('trust proxy', 1);

// Rate limiters
const { apiLimiter } = require('./middleware/rateLimiter');

// ✅ Use Helmet for basic security headers
// app.use(helmet());

// ✅ Optional: Customize Helmet (advanced usage)
// app.use(helmet({
//   contentSecurityPolicy: false, // If you want to handle CSP manually
// }));
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create upload directories if they don't exist
const uploadDirs = [
  'uploads', 
  'uploads/images', 
  'uploads/proposals', 
  'uploads/videos', 
  'uploads/thumbnails', 
  'uploads/logos'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files
app.use('/uploads', express.static('uploads'));
app.use('/uploads/proposals', express.static('uploads/proposals'));
app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/logos', express.static('uploads/logos'));
app.use('/uploads/videos', express.static('uploads/videos'));
app.use('/uploads/thumbnails', express.static('uploads/thumbnails'));

// Apply the general rate limiter to every API route.
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/join-us', joinUsRoutes);
app.use('/api/vlogs', vlogRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/cover-letters", coverLetterRoutes);
app.use("/api/", resumeAIRoutes);
app.use('/api/quiz', quizRoutes);

app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/webinars', webinarsRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/events/alumni', eventAlumniRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/alumni/jobs', jobAlumniRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);

// ================= Socket.io Setup =================
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080", // dockerized frontend (nginx)
  process.env.FRONTEND_URL, // production / custom origin
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io available to REST controllers via req.app.get('io')
app.set('io', io);

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let userId = decoded.id;
    let userEmail = decoded.email;
    
    if (!userId && userEmail) {
      const user = await prisma.users.findUnique({ where: { email: userEmail } });
      if (user) {
        userId = user.id;
      }
    }
    
    if (!userId) {
      return next(new Error("Unauthorized"));
    }
    
    socket.user = { id: userId, email: userEmail };
    next();
  } catch (err) {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.join(`user_${socket.user.id}`);

  socket.on("send_message", async (data) => {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        socket.emit("message_error", { message: "Invalid message format" });
        return;
      }
    }

    const targetUserId = Number(data.targetUserId);
    const content = data.content;

    if (!targetUserId || isNaN(targetUserId)) {
      socket.emit("message_error", { message: "Invalid target user" });
      return;
    }
    if (!content?.trim()) {
      socket.emit("message_error", { message: "Message content is required" });
      return;
    }

    try {
      const result = await chatService.sendMessage(
        socket.user.id,
        targetUserId,
        content,
      );

      const participants = await prisma.conversation_participant.findMany({
        where: { conversationId: result.conversationId },
      });

      participants.forEach((p) => {
        io.to(`user_${p.userId}`).emit("receive_message", {
          ...result.message,
          conversationId: result.conversationId,
        });
      });

      // Bell notification for every participant except the sender.
      participants
        .filter((p) => p.userId !== socket.user.id)
        .forEach((p) => {
          notifyUser(io, p.userId, {
            type: 'message',
            title: 'New message',
            message: (content || '').slice(0, 120),
            link: 'messages',
          });
        });
    } catch (err) {
      console.error("Socket send error:", err.message);
      socket.emit("message_error", { message: err.message || "Failed to send message" });
    }
  });

  socket.on("get_conversations", async () => {
    try {
      const conversations = await chatService.getUserConversations(socket.user.id);
      socket.emit("conversations_list", conversations);
    } catch (err) {
      console.error("Get conversations error:", err.message);
      socket.emit("message_error", { message: "Failed to load conversations" });
    }
  });

  socket.on("disconnect", () => {});
});

// ================= Base route =================
app.get('/', (req, res) => {
  res.json({
    message: 'TechnoVerse API Server is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      carousel: '/api/carousel',
      team: '/api/team',
      sponsors: '/api/sponsors',
      events: '/api/events',
      joinUs: '/api/join-us',
      vlogs: '/api/vlogs',
      chats : '/api/chatbot',
      resume : '/api/resume',
      quize : '/api/quize',
      
      
      users: '/api/users',                        // ← NEW: yahan bhi add kiya
      userCount: '/api/users/count',
      tasks: '/api/tasks',
      webinars: '/api/webinars',
      
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// Graceful shutdown for Prisma
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});