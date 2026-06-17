import {
  LayoutDashboard,
  User,
  MessageSquare,
  Briefcase,
  Map,
  GraduationCap,
  Calendar,
  Award,
} from "lucide-react";

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  batch: string;
  branch: string;
  role: string;
  bio?: string;
  location?: string;
  avatar?: string;
}

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
  enrolledCount?: number;
  isEnrolled?: boolean;
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
  enrolledCount: number;
}

export interface EnrolledStudent {
  studentId: number;
  name: string;
  email: string;
  enrolledAt: string;
  steps: {
    stepId: number;
    title: string;
    step_order: number;
    completed: boolean;
  }[];
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
}

export interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
}

export interface MenuItem {
  icon: typeof User;
  title: string;
  description: string;
  comingSoon: boolean;
}

export const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "dashboard" },
  { icon: User, label: "Profile", path: "profile" },
  { icon: Calendar, label: "Events", path: "events" },
  { icon: Calendar, label: "Events 2", path: "events2" },
  { icon: Award, label: "Certificates", path: "certificates" },
  { icon: MessageSquare, label: "Messages", path: "messages" },
  { icon: Briefcase, label: "Jobs", path: "jobs" },
  { icon: Map, label: "Roadmaps", path: "roadmaps" },
];

export const menuItems: MenuItem[] = [
  { icon: Calendar, title: "Events", description: "Create and manage events", comingSoon: false, path: "events" },
  { icon: Calendar, title: "Events 2", description: "My Registered Events", comingSoon: false, path: "events2" },
  { icon: Award, title: "Certificates", description: "View and manage certifications", comingSoon: false, path: "certificates" },
  { icon: Briefcase, title: "Jobs", description: "Post job opportunities", comingSoon: false, path: "jobs" },
  { icon: MessageSquare, title: "Messages", description: "Network with alumni", comingSoon: false, path: "messages" },
  { icon: Map, title: "Roadmaps", description: "Create learning paths", comingSoon: false, path: "roadmaps" },
  { icon: User, title: "Directory", description: "Connect with fellow alumni", comingSoon: true, path: "directory" },
];