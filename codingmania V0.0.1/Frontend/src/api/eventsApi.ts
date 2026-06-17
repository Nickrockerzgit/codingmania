const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  endDate: string;
  organizer: string;
  tags: string[];
  status: string;
  description?: string;
  link?: string;
  creatorId: number;
  createdAt: string;
}

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getEvents = async (): Promise<{ data: Event[] }> => {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) throw new Error("Failed to fetch events");
  const data = await response.json();
  return { data: Array.isArray(data) ? data : [] };
};

export const getMyEvents = async (): Promise<{ data: Event[] }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/events/alumni/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch your events");
  const data = await response.json();
  return { data: Array.isArray(data) ? data : [] };
};

export const createEvent = async (eventData: Partial<Event>): Promise<{ data: Event }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/events/alumni`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error("Failed to create event");
  const data = await response.json();
  return { data };
};

export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<{ data: Event }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/events/alumni/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error("Failed to update event");
  const data = await response.json();
  return { data };
};

export const deleteEvent = async (id: number): Promise<{ data: { message: string } }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/events/alumni/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete event");
  const data = await response.json();
  return { data };
};