import Sidebar from '@/components/shared/dashboard/sidebar';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LayoutDashboard, BookOpen, Users } from 'lucide-react';
import Nav from '@/components/shared/dashboard/nav';

const instructorNav = [
  { name: 'Dashboard', icon: 'LayoutDashboard', href: '/instructor/dashboard' },
  { name: 'Courses',   icon: 'BookOpen',       href: '/instructor/courses' },
  { name: 'Students',  icon: 'Users',          href: '/instructor/students' },
];

export const metadata: Metadata = {
  title: 'Instructor Dashboard',
  description: 'Instructor workspace for managing teaching and course delivery.',
};

export default function InstructorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={instructorNav} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Nav/>
        <main className="flex-1 overflow-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}