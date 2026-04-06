'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  MessageSquare,
  Bell,
  User,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type NavItem = {
  name: string
  icon: any
  href: string
}

interface SidebarProps {
  navItems: NavItem[]
}

export default function Sidebar({ navItems }: SidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button size="icon" variant="outline" onClick={() => setOpen(true)}>
          <Menu />
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`
          fixed md:static z-50 top-0 left-0 min-h-screen w-[260px] md:w-[280px]
          bg-[#0B1933] text-white flex flex-col shrink-0
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="md:hidden flex justify-end p-4">
          <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="relative w-8 h-8 flex shrink-0 items-center justify-center">
              <Image
                src="/Vector.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight">TalentFlow</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5 transition-all">
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
            <Bell size={20} />
            <span className="text-sm font-medium">Notifications</span>
          </div>

          <Button className="w-full">
            <div className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1F53C4] text-white rounded-lg w-full">
              <User size={20} />
              <span className="text-sm font-medium">Profile</span>
            </div>
          </Button>

          <div className="bg-[#1F53C4] p-4 rounded border border-blue-500/30">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3">
              <GraduationCap size={18} />
            </div>
            <p className="text-[13px] font-bold text-white mb-1 leading-tight">
              Keep Learning, Keep growing
            </p>
            <p className="text-[11px] text-gray-300 mb-4 leading-tight">
              Browse new courses and continue your learning journey
            </p>
            <Button className="bg-white text-[#0B1933] text-[12px] font-bold py-3 px-3 rounded-lg w-full flex items-center justify-between">
              Browse Courses
              <span>→</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
