const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface AlumniProfile {
  id: number;
  userId: number;
  name: string;
  email?: string;
  avatar?: string;
  imageUrl?: string;
  batch?: string;
  branch?: string;
  company?: string;
  position?: string;
  bio?: string;
  location?: string;
}

export const getAllAlumni = async (): Promise<{ data: AlumniProfile[] }> => {
  const response = await fetch(`${API_BASE_URL}/alumni`);
  if (!response.ok) throw new Error("Failed to fetch alumni");
  const data = await response.json();
  return { data: Array.isArray(data) ? data : [] };
};