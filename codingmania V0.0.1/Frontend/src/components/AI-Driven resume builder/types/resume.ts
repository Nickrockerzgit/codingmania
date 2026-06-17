export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  professionalSummary: string;
}

export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'tools';
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  percentage?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  socialLinks: SocialLinks;
}

export type Template = 'modern' | 'classic' | 'creative' | 'minimal';