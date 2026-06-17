const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  description?: string;
  applicationLink?: string;
  tags: string[];
  posterId: number;
  poster?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getJobs = async (): Promise<{ data: Job[] }> => {
  const response = await fetch(`${API_BASE_URL}/jobs`);
  if (!response.ok) throw new Error("Failed to fetch jobs");
  const data = await response.json();
  return { data: Array.isArray(data) ? data : [] };
};

export const getMyJobs = async (): Promise<{ data: Job[] }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/alumni/jobs/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch your jobs");
  const data = await response.json();
  return { data: Array.isArray(data) ? data : [] };
};

export const createJob = async (jobData: Partial<Job>): Promise<{ data: Job }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/alumni/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error("Failed to create job");
  const data = await response.json();
  return { data };
};

export const updateJob = async (id: number, jobData: Partial<Job>): Promise<{ data: Job }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/alumni/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error("Failed to update job");
  const data = await response.json();
  return { data };
};

export const deleteJob = async (id: number): Promise<{ data: { message: string } }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/alumni/jobs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete job");
  const data = await response.json();
  return { data };
};
