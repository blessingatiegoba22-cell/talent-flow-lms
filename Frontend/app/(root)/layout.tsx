import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Sidebar from '@/component/dashboard/Sidebar'
import { ChevronDown } from 'lucide-react'
import DashboardNav from '@/component/dashboard/nav'

export const metadata: Metadata = {
  title: 'TALENT | Home',
  description: 'Explore the Talent Flow LMS experience and discover a smarter way to learn.',
}

type LayoutProps = Readonly<{
  children: ReactNode
}>

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNav />
        {/* Main Content Scroll Area */}
        <main className="p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
