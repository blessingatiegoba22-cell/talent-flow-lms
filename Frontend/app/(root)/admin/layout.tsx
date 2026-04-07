import Sidebar from '@/components/shared/dashboard/sidebar';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LayoutDashboard, BookOpen, Users } from 'lucide-react';
import Nav from '@/components/shared/dashboard/nav';

const adminNav = [
  { name: 'Dashboard', icon: 'LayoutDashboard', href: '/admin/dashboard' },
  { name: 'Users',     icon: 'Users',           href: '/admin/users' },
  { name: 'Courses',   icon: 'BookOpen',        href: '/admin/courses' },
];

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Administrative workspace for managing Talent Flow LMS.',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={adminNav}/>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Nav/>
        <main className="flex-1 overflow-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}