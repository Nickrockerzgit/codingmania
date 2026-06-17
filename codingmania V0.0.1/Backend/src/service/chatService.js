const prisma = require('../../prisma/client');

const buildPairKey = (id1, id2) => {
  return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
};

const getEffectiveRole = (user) => {
  const appliedRole = user?.appliedRole;
  const applicationStatus = user?.applicationStatus;

  if (
    (appliedRole === "student" || appliedRole === "alumni") &&
    (applicationStatus === "approved" || applicationStatus === "pending")
  ) {
    return appliedRole;
  }

  return user?.role;
};

const isValidStudentAlumniPair = (user1, user2) => {
  const role1 = getEffectiveRole(user1);
  const role2 = getEffectiveRole(user2);

  return (
    (role1 === "student" && role2 === "alumni") ||
    (role1 === "alumni" && role2 === "student")
  );
};

const getConversationInclude = () => ({
  participants: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          appliedRole: true,
          applicationStatus: true,
          avatar: true,
          alumniProfile: {
            select: {
              batch: true,
              branch: true,
            },
          },
          studentProfile: {
            select: {
              branch: true,
              yearOfStudy: true,
            },
          },
        },
      },
    },
  },
});

const createOrGetConversation = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("Cannot chat with yourself");
  }

  const users = await prisma.users.findMany({
    where: { id: { in: [currentUserId, targetUserId] } },
  });

  if (users.length !== 2) {
    throw new Error("User not found");
  }

  const user1 = users.find((u) => u.id === currentUserId);
  const user2 = users.find((u) => u.id === targetUserId);

  if (!isValidStudentAlumniPair(user1, user2)) {
    throw new Error("Only student to alumni chat allowed");
  }

  const pairKey = buildPairKey(currentUserId, targetUserId);

  return prisma.conversation.upsert({
    where: { userPairKey: pairKey },
    update: {},
    create: {
      userPairKey: pairKey,
      participants: {
        create: [
          { userId: currentUserId },
          { userId: targetUserId },
        ],
      },
    },
    include: getConversationInclude(),
  });
};

const getMessages = async (conversationId, userId) => {
  const isParticipant = await prisma.conversation_participant.findFirst({
    where: { conversationId, userId },
  });

  if (!isParticipant) {
    throw new Error("Unauthorized");
  }

  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const getUserConversations = async (userId) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      ...getConversationInclude(),
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: {
      lastMessageAt: "desc",
    },
  });

  return conversations.map((conv) => {
    const otherParticipant = conv.participants.find(
      (p) => p.userId !== userId
    );

    const user = otherParticipant.user;

    const profile =
      getEffectiveRole(user) === "student"
        ? user.studentProfile
        : user.alumniProfile;

    return {
      id: conv.id,
      lastMessageAt: conv.lastMessageAt,
      lastMessage: conv.messages[0] || null,
      otherUser: {
        id: user.id,
        name: user.name,
        role: getEffectiveRole(user),
        branch: profile?.branch || null,
        batch: profile?.batch || profile?.yearOfStudy || null,
        avatar: user.avatar || null,
      },
    };
  });
};

const sendMessage = async (senderId, targetUserId, content) => {
  if (!content?.trim()) {
    throw new Error("Message content is required");
  }

  if (senderId === targetUserId) {
    throw new Error("Cannot message yourself");
  }

  const users = await prisma.users.findMany({
    where: {
      id: { in: [senderId, targetUserId] },
    },
  });

  if (users.length !== 2) {
    throw new Error("User not found");
  }

  const sender = users.find((u) => u.id === senderId);
  const target = users.find((u) => u.id === targetUserId);

  if (!isValidStudentAlumniPair(sender, target)) {
    throw new Error("Only student to alumni chat allowed");
  }

  const pairKey = buildPairKey(senderId, targetUserId);

  const conversation = await prisma.conversation.upsert({
    where: { userPairKey: pairKey },
    update: {},
    create: {
      userPairKey: pairKey,
      participants: {
        create: [
          { userId: senderId },
          { userId: targetUserId },
        ],
      },
    },
  });

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        content,
        senderId,
        conversationId: conversation.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
      },
    }),
  ]);

  return {
    conversationId: conversation.id,
    message,
  };
};

module.exports = {
  createOrGetConversation,
  sendMessage,
  getMessages,
  getUserConversations,
};
