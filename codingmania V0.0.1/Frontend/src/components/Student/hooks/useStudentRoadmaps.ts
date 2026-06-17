import axios from "axios";
import { toast } from "react-hot-toast";
import { Roadmap, RoadmapSummary } from "../types";

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const useStudentRoadmaps = () => {
  const roadmapApi = {
    getAll: async (): Promise<RoadmapSummary[]> => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/student/roadmaps`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    },

    getById: async (id: number): Promise<Roadmap> => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/student/roadmaps/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    },

    enrol: async (id: number): Promise<void> => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/student/roadmaps/${id}/enrol`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(response.data.message || "Enrolled successfully");
    },

    toggleStep: async (roadmapId: number, stepId: number) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/student/roadmaps/${roadmapId}/steps/${stepId}/toggle`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    },
  };

  return {
    getToken,
    getAuthHeaders,
    roadmapApi,
  };
};
