const prisma = require("../../prisma/client");

// ─── Create a roadmap with steps ─────────────────────────────────────────────

exports.createRoadmap = async (authorId, data) => {
  if (!data.title || !data.description) {
    throw new Error("Title and description are required");
  }
  if (!data.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
    throw new Error("At least one step is required");
  }

  const category = Array.isArray(data.category)
    ? data.category.join(",")
    : data.category || "";

  const roadmap = await prisma.roadmap.create({
    data: {
      title: data.title,
      description: data.description,
      category,
      difficulty: data.difficulty || "beginner",
      duration: data.duration || "1_month",
      authorId,
      steps: {
        create: data.steps.map((step, i) => ({
          title: step.title,
          description: step.description || "",
          link: step.link || null,
          step_order: step.order ?? step.step_order ?? i + 1,
        })),
      },
    },
    include: {
      author: { select: { id: true, name: true } },
      steps: { orderBy: { step_order: "asc" } },
    },
  });

  return {
    ...roadmap,
    category: roadmap.category ? roadmap.category.split(",") : [],
    stepCount: roadmap.steps.length,
    enrolledStudents: 0,
  };
};

// ─── Update a roadmap and its steps ──────────────────────────────────────────

exports.updateRoadmap = async (roadmapId, authorId, data) => {
  const rid = Number(roadmapId);

  const existing = await prisma.roadmap.findUnique({ where: { id: rid } });
  if (!existing) throw new Error("Roadmap not found");
  if (existing.authorId !== authorId) throw new Error("Not authorized to edit this roadmap");

  const category = Array.isArray(data.category)
    ? data.category.join(",")
    : data.category || existing.category;

  // Delete old steps and create new ones in a transaction
  const roadmap = await prisma.$transaction(async (tx) => {
    await tx.roadmap_progress.deleteMany({ where: { roadmapId: rid } });
    await tx.roadmap_step.deleteMany({ where: { roadmapId: rid } });

    return tx.roadmap.update({
      where: { id: rid },
      data: {
        title: data.title ?? existing.title,
        description: data.description ?? existing.description,
        category,
        difficulty: data.difficulty ?? existing.difficulty,
        duration: data.duration ?? existing.duration,
        steps: data.steps
          ? {
              create: data.steps.map((step, i) => ({
                title: step.title,
                description: step.description || "",
                link: step.link || null,
                step_order: step.order ?? step.step_order ?? i + 1,
              })),
            }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true } },
        steps: { orderBy: { step_order: "asc" } },
      },
    });
  });

  return {
    ...roadmap,
    category: roadmap.category ? roadmap.category.split(",") : [],
    stepCount: roadmap.steps.length,
  };
};

// ─── Delete a roadmap ────────────────────────────────────────────────────────

exports.deleteRoadmap = async (roadmapId, authorId) => {
  const rid = Number(roadmapId);

  const existing = await prisma.roadmap.findUnique({ where: { id: rid } });
  if (!existing) throw new Error("Roadmap not found");
  if (existing.authorId !== authorId) throw new Error("Not authorized to delete this roadmap");

  // Cascade delete: progress → steps → roadmap
  await prisma.$transaction([
    prisma.roadmap_progress.deleteMany({ where: { roadmapId: rid } }),
    prisma.roadmap_step.deleteMany({ where: { roadmapId: rid } }),
    prisma.roadmap.delete({ where: { id: rid } }),
  ]);

  return { message: "Roadmap deleted successfully", id: rid };
};

// ─── Get all roadmaps ────────────────────────────────────────────────────────

exports.getAllRoadmaps = async (userId) => {
  const roadmaps = await prisma.roadmap.findMany({
    include: {
      author: { select: { id: true, name: true } },
      steps: { orderBy: { step_order: "asc" } },
      roadmapProgress: userId
        ? { where: { studentId: userId } }
        : false,
    },
    orderBy: { created_at: "desc" },
  });

  // Get enrollment counts per roadmap (count distinct students)
  const enrollmentRows = await prisma.$queryRaw`
    SELECT roadmapId, COUNT(DISTINCT studentId) as studentCount
    FROM roadmap_progress
    GROUP BY roadmapId
  `;
  const enrolMap = {};
  enrollmentRows.forEach((e) => {
    enrolMap[e.roadmapId] = Number(e.studentCount);
  });

  return roadmaps.map((r) => {
    const completedStepIds = r.roadmapProgress
      ? r.roadmapProgress.filter((sp) => sp.completed).map((sp) => sp.stepId)
      : [];
    const totalSteps = r.steps.length;
    const completedSteps = completedStepIds.length;
    const progressPercent =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return {
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category ? r.category.split(",") : [],
      difficulty: r.difficulty,
      duration: r.duration,
      author: r.author,
      createdAt: r.created_at,
      steps: r.steps.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        link: s.link,
        order: s.step_order,
        completed: completedStepIds.includes(s.id),
      })),
      stepCount: totalSteps,
      completedSteps,
      progressPercent,
      isEnrolled: r.roadmapProgress ? r.roadmapProgress.length > 0 : false,
      enrolledStudents: enrolMap[r.id] || 0,
    };
  });
};

// ─── Get a single roadmap by ID ──────────────────────────────────────────────

exports.getRoadmapById = async (roadmapId, userId) => {
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: Number(roadmapId) },
    include: {
      author: { select: { id: true, name: true } },
      steps: { orderBy: { step_order: "asc" } },
      roadmapProgress: userId
        ? { where: { studentId: userId } }
        : false,
    },
  });

  if (!roadmap) throw new Error("Roadmap not found");

  const completedStepIds = roadmap.roadmapProgress
    ? roadmap.roadmapProgress.filter((sp) => sp.completed).map((sp) => sp.stepId)
    : [];

  const totalSteps = roadmap.steps.length;
  const completedSteps = completedStepIds.length;
  const progressPercent =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return {
    id: roadmap.id,
    title: roadmap.title,
    description: roadmap.description,
    category: roadmap.category ? roadmap.category.split(",") : [],
    difficulty: roadmap.difficulty,
    duration: roadmap.duration,
    author: roadmap.author,
    createdAt: roadmap.created_at,
    steps: roadmap.steps.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      link: s.link,
      order: s.step_order,
      completed: completedStepIds.includes(s.id),
    })),
    stepCount: totalSteps,
    completedSteps,
    progressPercent,
    isEnrolled: roadmap.roadmapProgress ? roadmap.roadmapProgress.length > 0 : false,
  };
};

// ─── Enrol in a roadmap (creates progress records for all steps) ─────────────

exports.enrolInRoadmap = async (studentId, roadmapId) => {
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: Number(roadmapId) },
    include: { steps: true },
  });

  if (!roadmap) throw new Error("Roadmap not found");

  // Check if already enrolled
  const existing = await prisma.roadmap_progress.findFirst({
    where: { studentId, roadmapId: roadmap.id },
  });

  if (existing) throw new Error("Already enrolled in this roadmap");

  // Create progress records for all steps
  await prisma.roadmap_progress.createMany({
    data: roadmap.steps.map((step) => ({
      studentId,
      roadmapId: roadmap.id,
      stepId: step.id,
      completed: false,
    })),
    skipDuplicates: true,
  });

  return { message: "Enrolled successfully", roadmapId: roadmap.id };
};

// ─── Toggle step completion ──────────────────────────────────────────────────

exports.toggleStep = async (studentId, roadmapId, stepId) => {
  const progress = await prisma.roadmap_progress.findUnique({
    where: {
      studentId_stepId: { studentId, stepId: Number(stepId) },
    },
  });

  if (!progress) {
    throw new Error("Not enrolled in this roadmap or step not found");
  }

  const updated = await prisma.roadmap_progress.update({
    where: {
      studentId_stepId: { studentId, stepId: Number(stepId) },
    },
    data: { completed: !progress.completed },
  });

  // Recalculate overall progress
  const allProgress = await prisma.roadmap_progress.findMany({
    where: { studentId, roadmapId: Number(roadmapId) },
  });
  const completedCount = allProgress.filter((p) => p.completed).length;
  const totalCount = allProgress.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    stepId: updated.stepId,
    completed: updated.completed,
    roadmapProgress: {
      completedSteps: completedCount,
      totalSteps: totalCount,
      percent,
    },
  };
};

// ─── Get student's progress for a specific roadmap ───────────────────────────

exports.getStudentProgress = async (studentId, roadmapId) => {
  const progress = await prisma.roadmap_progress.findMany({
    where: { studentId, roadmapId: Number(roadmapId) },
    include: {
      step: { select: { id: true, title: true, step_order: true } },
    },
    orderBy: { step: { step_order: "asc" } },
  });

  if (progress.length === 0) {
    return { enrolled: false, steps: [], percent: 0 };
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const percent = Math.round((completedCount / progress.length) * 100);

  return {
    enrolled: true,
    steps: progress.map((p) => ({
      stepId: p.stepId,
      title: p.step.title,
      order: p.step.step_order,
      completed: p.completed,
    })),
    completedSteps: completedCount,
    totalSteps: progress.length,
    percent,
  };
};

// ─── Get all enrolled students for a roadmap (alumni view) ───────────────────

exports.getEnrolledStudents = async (roadmapId) => {
  const rid = Number(roadmapId);

  const roadmap = await prisma.roadmap.findUnique({
    where: { id: rid },
    include: { steps: { orderBy: { step_order: "asc" } } },
  });

  if (!roadmap) throw new Error("Roadmap not found");

  // Get all progress records for this roadmap with student info
  const progressRecords = await prisma.roadmap_progress.findMany({
    where: { roadmapId: rid },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          studentProfile: { select: { branch: true, year: true } },
        },
      },
      step: { select: { id: true, title: true, step_order: true } },
    },
    orderBy: { updated_at: "desc" },
  });

  // Group by student
  const studentMap = {};
  for (const rec of progressRecords) {
    const sid = rec.studentId;
    if (!studentMap[sid]) {
      studentMap[sid] = {
        studentId: sid,
        name: rec.student.name,
        email: rec.student.email,
        branch: rec.student.studentProfile?.branch || null,
        year: rec.student.studentProfile?.year || null,
        enrolledAt: rec.updated_at,
        steps: [],
      };
    }
    studentMap[sid].steps.push({
      stepId: rec.stepId,
      title: rec.step.title,
      order: rec.step.step_order,
      completed: rec.completed,
    });
    // Use earliest enrollment date
    if (new Date(rec.updated_at) < new Date(studentMap[sid].enrolledAt)) {
      studentMap[sid].enrolledAt = rec.updated_at;
    }
  }

  const totalSteps = roadmap.steps.length;

  return Object.values(studentMap).map((s) => {
    const completedCount = s.steps.filter((st) => st.completed).length;
    const percent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
    return {
      ...s,
      steps: s.steps.sort((a, b) => a.order - b.order),
      completedSteps: completedCount,
      totalSteps,
      progressPercent: percent,
    };
  });
};

// ─── Analytics dashboard data (alumni author view) ───────────────────────────

exports.getAnalytics = async (authorId, period = "all") => {
  // Get all roadmaps by this author with steps
  const roadmaps = await prisma.roadmap.findMany({
    where: { authorId },
    include: { steps: true },
    orderBy: { created_at: "desc" },
  });

  // Compute date range based on period
  const now = new Date();
  let dateFrom = null;
  if (period === "month") {
    dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "quarter") {
    const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
    dateFrom = new Date(now.getFullYear(), quarterMonth, 1);
  } else if (period === "year") {
    dateFrom = new Date(now.getFullYear(), 0, 1);
  }
  // "all" → dateFrom stays null

  const roadmapIds = roadmaps.map((r) => r.id);
  if (roadmapIds.length === 0) {
    return {
      totalRoadmaps: 0,
      totalEnrolled: 0,
      avgCompletion: 0,
      totalCompleted: 0,
      monthlyEnrollments: Array(12).fill(0),
      monthlyCompletions: Array(12).fill(0),
      topRoadmaps: [],
      leastCompleted: [],
      difficultyBreakdown: [],
      categoryBreakdown: [],
      recentActivity: [],
    };
  }

  // Get all progress records for these roadmaps (with optional date filter)
  const progressWhere = { roadmapId: { in: roadmapIds } };
  if (dateFrom) {
    progressWhere.updated_at = { gte: dateFrom };
  }
  const allProgress = await prisma.roadmap_progress.findMany({
    where: progressWhere,
    include: {
      student: { select: { id: true, name: true } },
      roadmap: { select: { id: true, title: true, category: true, difficulty: true, steps: true } },
    },
    orderBy: { updated_at: "desc" },
  });

  // ── Enrollment counts per roadmap (distinct students) ──
  const enrollmentMap = {}; // roadmapId → Set of studentIds
  const studentRoadmapSet = new Set(); // all unique student-roadmap pairs

  for (const p of allProgress) {
    const key = `${p.studentId}-${p.roadmapId}`;
    if (!studentRoadmapSet.has(key)) {
      studentRoadmapSet.add(key);
      if (!enrollmentMap[p.roadmapId]) enrollmentMap[p.roadmapId] = new Set();
      enrollmentMap[p.roadmapId].add(p.studentId);
    }
  }

  // ── Per-student per-roadmap progress ──
  const studentRoadmapProgress = {}; // "studentId-roadmapId" → { completed, total }
  for (const p of allProgress) {
    const key = `${p.studentId}-${p.roadmapId}`;
    if (!studentRoadmapProgress[key]) {
      studentRoadmapProgress[key] = { completed: 0, total: p.roadmap.steps.length };
    }
    if (p.completed) studentRoadmapProgress[key].completed++;
  }

  // ── Summary stats ──
  const totalEnrolled = studentRoadmapSet.size;

  let totalCompletionSum = 0;
  let totalCompletedCount = 0;
  for (const key of Object.keys(studentRoadmapProgress)) {
    const { completed, total } = studentRoadmapProgress[key];
    const pct = total > 0 ? (completed / total) * 100 : 0;
    totalCompletionSum += pct;
    if (pct === 100) totalCompletedCount++;
  }
  const avgCompletion = totalEnrolled > 0 ? Math.round(totalCompletionSum / totalEnrolled) : 0;

  // ── Monthly enrollments & completions (always full current year for charts) ──
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1);
  const yearEnd = new Date(currentYear + 1, 0, 1);
  const yearlyProgress = await prisma.roadmap_progress.findMany({
    where: {
      roadmapId: { in: roadmapIds },
      updated_at: { gte: yearStart, lt: yearEnd },
    },
    include: {
      roadmap: { select: { id: true, steps: true } },
    },
    orderBy: { updated_at: "desc" },
  });

  const monthlyEnrollments = Array(12).fill(0);
  const monthlyCompletions = Array(12).fill(0);

  // Track first enrollment per student-roadmap pair within the year
  const firstEnrollment = {};
  for (const p of yearlyProgress) {
    const key = `${p.studentId}-${p.roadmapId}`;
    if (!firstEnrollment[key] || new Date(p.updated_at) < new Date(firstEnrollment[key])) {
      firstEnrollment[key] = p.updated_at;
    }
  }
  for (const key of Object.keys(firstEnrollment)) {
    const d = new Date(firstEnrollment[key]);
    monthlyEnrollments[d.getMonth()]++;
  }

  // Track completions by month (compute per-student per-roadmap from yearly data)
  const yearlyProgressMap = {};
  for (const p of yearlyProgress) {
    const key = `${p.studentId}-${p.roadmapId}`;
    if (!yearlyProgressMap[key]) {
      yearlyProgressMap[key] = { completed: 0, total: p.roadmap.steps.length, latestDate: p.updated_at };
    }
    if (p.completed) yearlyProgressMap[key].completed++;
    if (new Date(p.updated_at) > new Date(yearlyProgressMap[key].latestDate)) {
      yearlyProgressMap[key].latestDate = p.updated_at;
    }
  }
  for (const key of Object.keys(yearlyProgressMap)) {
    const { completed, total, latestDate } = yearlyProgressMap[key];
    if (completed === total && total > 0) {
      const d = new Date(latestDate);
      monthlyCompletions[d.getMonth()]++;
    }
  }

  // ── Per-roadmap stats ──
  const roadmapStats = roadmaps.map((r) => {
    const enrolledCount = enrollmentMap[r.id]?.size || 0;
    let completionSum = 0;
    let pairCount = 0;
    for (const key of Object.keys(studentRoadmapProgress)) {
      const [sid, rid] = key.split("-").map(Number);
      if (rid === r.id) {
        const { completed, total } = studentRoadmapProgress[key];
        completionSum += total > 0 ? (completed / total) * 100 : 0;
        pairCount++;
      }
    }
    const avgPct = pairCount > 0 ? Math.round(completionSum / pairCount) : 0;
    return { id: r.id, title: r.title, enrolled: enrolledCount, completion: avgPct };
  });

  const topRoadmaps = [...roadmapStats].sort((a, b) => b.completion - a.completion).slice(0, 5);
  const leastCompleted = [...roadmapStats].sort((a, b) => a.completion - b.completion).filter((r) => r.completion < 35).slice(0, 5);

  // ── Difficulty breakdown ──
  const diffMap = { beginner: { count: 0, color: "#10b981" }, intermediate: { count: 0, color: "#f59e0b" }, advanced: { count: 0, color: "#ef4444" } };
  for (const p of allProgress) {
    const key = `${p.studentId}-${p.roadmapId}`;
    if (studentRoadmapSet.has(key) && diffMap[p.roadmap.difficulty]) {
      // Only count unique student-roadmap pairs for difficulty
    }
  }
  // Recount: which students are enrolled in which difficulty
  for (const key of Object.keys(enrollmentMap)) {
    const roadmap = roadmaps.find((r) => r.id === Number(key));
    if (roadmap && diffMap[roadmap.difficulty]) {
      diffMap[roadmap.difficulty].count += enrollmentMap[key].size;
    }
  }
  const difficultyTotal = Object.values(diffMap).reduce((s, d) => s + d.count, 0) || 1;
  const difficultyBreakdown = Object.entries(diffMap).map(([level, d]) => ({
    level: level.charAt(0).toUpperCase() + level.slice(1),
    count: d.count,
    pct: Math.round((d.count / difficultyTotal) * 100),
    color: d.color,
  }));

  // ── Category breakdown ──
  const catMap = {};
  for (const rid of Object.keys(enrollmentMap)) {
    const roadmap = roadmaps.find((r) => r.id === Number(rid));
    if (!roadmap) continue;
    const categories = roadmap.category ? roadmap.category.split(",") : ["Uncategorized"];
    for (const cat of categories) {
      const trimmed = cat.trim();
      if (!catMap[trimmed]) catMap[trimmed] = 0;
      catMap[trimmed] += enrollmentMap[rid].size;
    }
  }
  const catTotal = Object.values(catMap).reduce((s, v) => s + v, 0) || 1;
  const categoryBreakdown = Object.entries(catMap)
    .map(([category, count]) => ({ category, count, pct: Math.round((count / catTotal) * 100) }))
    .sort((a, b) => b.count - a.count);

  // ── Recent activity ──
  const recentActivity = allProgress.slice(0, 10).map((p) => ({
    student: p.student.name,
    roadmap: p.roadmap.title,
    step: p.stepId ? "progress update" : "enrolled",
    completed: p.completed,
    time: p.updated_at,
  }));

  return {
    totalRoadmaps: roadmaps.length,
    totalEnrolled,
    avgCompletion,
    totalCompleted: totalCompletedCount,
    monthlyEnrollments,
    monthlyCompletions,
    topRoadmaps,
    leastCompleted,
    difficultyBreakdown,
    categoryBreakdown,
    recentActivity,
  };
};


exports.getRoadmapsByAuthor = async (authorId) => {
  const roadmaps = await prisma.roadmap.findMany({
    where: { authorId },
    include: {
      author: { select: { id: true, name: true } },
      steps: true,
    },
    orderBy: { created_at: "desc" },
  });

  const enrollmentRows = await prisma.roadmap_progress.groupBy({
    by: ["roadmapId", "studentId"],
    where: { roadmapId: { in: roadmaps.map((roadmap) => roadmap.id) } },
  });

  const enrollmentMap = {};
  enrollmentRows.forEach((row) => {
    enrollmentMap[row.roadmapId] = (enrollmentMap[row.roadmapId] || 0) + 1;
  });

  return roadmaps.map((roadmap) => ({
    id: roadmap.id,
    title: roadmap.title,
    description: roadmap.description,
    category: roadmap.category ? roadmap.category.split(",").map((item) => item.trim()).filter(Boolean) : [],
    difficulty: roadmap.difficulty,
    duration: roadmap.duration,
    author: roadmap.author,
    createdAt: roadmap.created_at,
    stepCount: roadmap.steps.length,
    enrolledStudents: enrollmentMap[roadmap.id] || 0,
  }));
};
