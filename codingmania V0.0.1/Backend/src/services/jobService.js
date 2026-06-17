const prisma = require('../../prisma/client');

const createJob = async (posterId, data) => {
  const job = await prisma.job.create({
    data: {
      title: data.title,
      company: data.company,
      location: data.location,
      type: data.type || "FULL_TIME",
      deadline: data.deadline,
      description: data.description,
      applicationLink: data.applicationLink,
      tags: data.tags ? data.tags.join(',') : null,
      posterId,
    },
  });

  return {
    ...job,
    tags: job.tags ? job.tags.split(',') : [],
  };
};

const getAllJobs = async () => {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      poster: {
        select: { id: true, name: true },
      },
    },
  });

  return jobs.map(job => ({
    ...job,
    tags: job.tags ? job.tags.split(',') : [],
  }));
};

const getMyJobs = async (posterId) => {
  const jobs = await prisma.job.findMany({
    where: { posterId },
    orderBy: { createdAt: 'desc' },
  });

  return jobs.map(job => ({
    ...job,
    tags: job.tags ? job.tags.split(',') : [],
  }));
};

const updateJob = async (jobId, posterId, data) => {
  const existing = await prisma.job.findFirst({
    where: { id: jobId, posterId },
  });

  if (!existing) {
    throw new Error('Job not found or unauthorized');
  }

  const job = await prisma.job.update({
    where: { id: jobId },
    data: {
      title: data.title,
      company: data.company,
      location: data.location,
      type: data.type,
      deadline: data.deadline,
      description: data.description,
      applicationLink: data.applicationLink,
      tags: data.tags ? data.tags.join(',') : undefined,
    },
  });

  return {
    ...job,
    tags: job.tags ? job.tags.split(',') : [],
  };
};

const deleteJob = async (jobId, posterId) => {
  const existing = await prisma.job.findFirst({
    where: { id: jobId, posterId },
  });

  if (!existing) {
    throw new Error('Job not found or unauthorized');
  }

  await prisma.job.delete({
    where: { id: jobId },
  });

  return { message: 'Job deleted successfully' };
};

module.exports = {
  createJob,
  getAllJobs,
  getMyJobs,
  updateJob,
  deleteJob,
};
