import Sidebar from '@/components/shared/dashboard/sidebar'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { LayoutDashboard, BookOpen, Users } from 'lucide-react'

const adminNav = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { name: 'Users', icon: Users, href: '/admin/users' },
  { name: 'Courses', icon: BookOpen, href: '/admin/courses' },
]
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Administrative workspace for managing Talent Flow LMS.',
}

type AdminLayoutProps = Readonly<{
  children: ReactNode
}>

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="">
      <aside className="">
        {/* Admin sidebar / navigation goes here */}
        <Sidebar navItems={adminNav} />
      </aside>
      <div className="">
        <header className="">{/* Admin topbar goes here */}</header>
        <main className="">{children}</main>
      </div>
    </div>
  )
}
