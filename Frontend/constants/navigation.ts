// constants/navigation.ts
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText,
  LucideIcon 
} from 'lucide-react';

export interface NavItem {
  name: string;
  icon: string;
  href: string;
}

export const NAVIGATION_CONFIG: Record<string, NavItem[]> = {
  admin: [
    { name: 'Dashboard', icon: 'LayoutDashboard', href: '/admin/dashboard' },
    { name: 'Users', icon: 'Users', href: '/admin/users' },
    { name: 'Courses', icon: 'BookOpen', href: '/admin/courses' },
  ],
  instructor: [
    { name: 'Dashboard', icon: 'LayoutDashboard', href: '/instructor/dashboard' },
    { name: 'Courses', icon: 'BookOpen', href: '/instructor/courses' },
    { name: 'Students', icon: 'Users', href: '/instructor/students' },
  ],
  learner: [
    { name: 'Dashboard', icon: 'LayoutDashboard', href: '/learner/dashboard' },
    { name: 'My Learning', icon: 'GraduationCap', href: '/learner/learning' },
    { name: 'Assignments', icon: 'FileText', href: '/learner/assignments' },
  ],
};