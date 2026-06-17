import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Roadmap, RoadmapSummary, EnrolledStudent } from "../types";
import { useAuth } from "../../AuthContext";

export const useAlumniAuth = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const getAuthHeaders = () => {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const roadmapApi = {
    getAll: async (): Promise<RoadmapSummary[]> => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/alumni/roadmaps`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },

    getById: async (id: number): Promise<Roadmap> => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/alumni/roadmaps/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },

    getMyRoadmaps: async (): Promise<RoadmapSummary[]> => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/alumni/roadmaps/my-roadmaps`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },

    create: async (data: {
      title: string;
      description: string;
      category?: string;
      difficulty?: string;
      duration?: string;
      steps: { title: string; description: string; link?: string }[];
    }): Promise<Roadmap> => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/alumni/roadmaps`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    },

    update: async (id: number, data: Partial<Roadmap>): Promise<Roadmap> => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/alumni/roadmaps/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/alumni/roadmaps/${id}`, {
        headers: getAuthHeaders(),
      });
    },

    enrol: async (id: number): Promise<void> => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/student/roadmaps/${id}/enrol`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(response.data.message);
    },

    toggleStep: async (roadmapId: number, stepId: number) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/student/roadmaps/${roadmapId}/steps/${stepId}/toggle`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    },

    getEnrolledStudents: async (id: number): Promise<EnrolledStudent[]> => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/alumni/roadmaps/${id}/students`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    },

    getAnalytics: async (period = "all") => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/alumni/roadmaps/analytics`,
        {
          params: { period },
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    },

    getStudentProgress: async (id: number) => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/student/roadmaps/${id}/progress`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    },
  };

  return {
    getToken,
    handleLogout,
    getAuthHeaders,
    roadmapApi,
  };
};
