const roadmapService = require("../services/roadmapService");

// Helper to extract roadmap ID from either :id or :roadmapId param
const getRoadmapId = (req) => req.params.roadmapId || req.params.id;

exports.createRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.createRoadmap(req.user.id, req.body);
    res.status(201).json(roadmap);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getAllRoadmaps = async (req, res) => {
  try {
    const roadmaps = await roadmapService.getAllRoadmaps(req.user.id);
    res.json(roadmaps);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getRoadmapById = async (req, res) => {
  try {
    const roadmap = await roadmapService.getRoadmapById(getRoadmapId(req), req.user.id);
    res.json(roadmap);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.enrolInRoadmap = async (req, res) => {
  try {
    const result = await roadmapService.enrolInRoadmap(req.user.id, getRoadmapId(req));
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.toggleStep = async (req, res) => {
  try {
    const result = await roadmapService.toggleStep(
      req.user.id,
      getRoadmapId(req),
      req.params.stepId
    );
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getStudentProgress = async (req, res) => {
  try {
    const progress = await roadmapService.getStudentProgress(req.user.id, getRoadmapId(req));
    res.json(progress);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const students = await roadmapService.getEnrolledStudents(getRoadmapId(req));
    res.json(students);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.updateRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.updateRoadmap(getRoadmapId(req), req.user.id, req.body);
    res.json(roadmap);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.deleteRoadmap = async (req, res) => {
  try {
    const result = await roadmapService.deleteRoadmap(getRoadmapId(req), req.user.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const period = req.query.period || "all";
    const analytics = await roadmapService.getAnalytics(req.user.id, period);
    res.json(analytics);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await roadmapService.getRoadmapsByAuthor(req.user.id);
    res.json(roadmaps);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
