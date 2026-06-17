import {
  LayoutDashboard,
  User,
  Map,
  CheckSquare,
  GraduationCap,
  MessageSquare,
  Calendar,
  Briefcase,
  Award,
} from "lucide-react";

export interface StudentProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  branch: string;
  year: string;
  role: string;
  bio?: string;
  avatar?: string;
}

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

export const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "dashboard" },
  { icon: User, label: "Profile", path: "profile" },
  { icon: Map, label: "Roadmaps", path: "roadmaps" },
  { icon: CheckSquare, label: "Tasks", path: "tasks" },
  { icon: GraduationCap, label: "Mentors", path: "mentors" },
  { icon: Calendar, label: "Events", path: "events" },
  { icon: Calendar, label: "Events 2", path: "events2" },
  { icon: Award, label: "Certificates", path: "certificates" },
  { icon: Briefcase, label: "Jobs", path: "jobs" },
  { icon: MessageSquare, label: "Messages", path: "messages" },
];

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  link?: string;
  step_order: number;
  completed?: boolean;
}

export interface Roadmap {
  id: number;
  title: string;
  description: string;
  category?: string;
  difficulty: string;
  duration?: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  steps: RoadmapStep[];
  stepCount: number;
  completedSteps?: number;
  progressPercent?: number;
  isEnrolled?: boolean;
  enrolledCount?: number;
}

export interface RoadmapSummary {
  id: number;
  title: string;
  description: string;
  category?: string;
  difficulty: string;
  duration?: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  stepCount: number;
  completedSteps?: number;
  progressPercent?: number;
  isEnrolled: boolean;
  enrolledCount: number;
}

export interface MenuItem {
  icon: typeof Map;
  title: string;
  description: string;
  comingSoon: boolean;
  path?: string;
}

export const menuItems: MenuItem[] = [
  { icon: Map, title: "Roadmaps", description: "Learning paths and career guidance", comingSoon: false, path: "roadmaps" },
  { icon: CheckSquare, title: "Tasks", description: "Track your coursework and assignments", comingSoon: false, path: "tasks" },
  { icon: GraduationCap, title: "Mentors", description: "Connect with alumni mentors", comingSoon: false, path: "mentors" },
  { icon: Calendar, title: "Events", description: "Discover hackathons and workshops", comingSoon: false, path: "events" },
  { icon: Calendar, title: "Events 2", description: "My Registered Events", comingSoon: false, path: "events2" },
  { icon: Award, title: "Certificates", description: "View and manage certifications", comingSoon: false, path: "certificates" },
  { icon: Briefcase, title: "Jobs", description: "Find internships and jobs", comingSoon: false, path: "jobs" },
  { icon: MessageSquare, title: "Messages", description: "Chat with alumni and peers", comingSoon: false, path: "messages" },
];
