import Sidebar from '@/components/shared/dashboard/sidebar'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { LayoutDashboard, BookOpen, Users } from 'lucide-react'

const instructorNav = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/instructor/dashboard' },
  { name: 'Courses', icon: BookOpen, href: '/instructor/courses' },
  { name: 'Students', icon: Users, href: '/instructor/students' },
]

export const metadata: Metadata = {
  title: 'Instructor Dashboard',
  description: 'Instructor workspace for managing teaching and course delivery.',
}

type InstructorLayoutProps = Readonly<{
  children: ReactNode
}>

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  return (
    <div className="">
      <aside className="">
        {/* Instructor sidebar / navigation goes here */}
        <Sidebar navItems={instructorNav} />
      </aside>
      <div className="">
        <header className="">{/* instrustor topbar goes here */}</header>
        <main className="">{children}</main>
      </div>
    </div>
  )
}
