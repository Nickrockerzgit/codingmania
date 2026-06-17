const jobService = require('../services/jobService');

const createAlumniJob = async (req, res) => {
  try {
    const posterId = req.user.id;
    const job = await jobService.createJob(posterId, req.body);
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: error.message || 'Failed to create job' });
  }
};

const getAllAlumniJobs = async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

const getMyAlumniJobs = async (req, res) => {
  try {
    const posterId = req.user.id;
    const jobs = await jobService.getMyJobs(posterId);
    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch your jobs' });
  }
};

const updateAlumniJob = async (req, res) => {
  try {
    const posterId = req.user.id;
    const jobId = parseInt(req.params.id);
    const job = await jobService.updateJob(jobId, posterId, req.body);
    res.json(job);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: error.message || 'Failed to update job' });
  }
};

const deleteAlumniJob = async (req, res) => {
  try {
    const posterId = req.user.id;
    const jobId = parseInt(req.params.id);
    await jobService.deleteJob(jobId, posterId);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete job' });
  }
};

module.exports = {
  createAlumniJob,
  getAllAlumniJobs,
  getMyAlumniJobs,
  updateAlumniJob,
  deleteAlumniJob,
};
