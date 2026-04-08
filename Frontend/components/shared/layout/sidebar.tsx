'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as LucideIcons from 'lucide-react'
import {
  GraduationCap,
  Bell,
  User,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavItem = {
  name: string
  icon: string
  href: string
}

interface SidebarProps {
  navItems: NavItem[]
}

export default function Sidebar({ navItems }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button size="icon" variant="outline" onClick={() => setOpen(true)} className="border-neutral-600 bg-background">
          <Menu className="text-brand-blue-950" />
        </Button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-ink-950/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:static z-50 top-0 left-0 h-screen w-[260px] md:w-[280px]",
          "bg-brand-blue-950 text-neutral-50 flex flex-col shrink-0",
          "transform transition-transform duration-300",
          open ? 'translate-x-0' : '-translate-x-full',
          "md:translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <Button size="icon" variant="ghost" onClick={() => setOpen(false)} className="text-neutral-50 hover:bg-white/10">
            <X />
          </Button>
        </div>

        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="relative w-8 h-8 flex shrink-0 items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={45}
                height={45}
                sizes='45px'
                className="object-contain"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-neutral-50">
              TalentFlow
            </span>
          </div>
        </div>

        {/* Navigation - Scrollable area that takes remaining space */}
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-brand-blue-600 text-neutral-50 shadow-lg shadow-brand-blue-950/20" 
                    : "text-neutral-400 hover:text-neutral-50 hover:bg-white/5"
                )}>
                  <IconComponent 
                    size={20} 
                    className={cn(
                      "transition-colors",
                      isActive ? "text-neutral-50" : "text-neutral-400 group-hover:text-neutral-50"
                    )} 
                  />
                  <span className="text-sm font-semibold">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neutral-50 animate-pulse" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Fixed Bottom Section */}
        <div className="p-6 space-y-4 bg-brand-blue-950 border-t-2 border-white">
          <div className="flex items-center gap-3 px-4 py-2 text-neutral-400 cursor-pointer hover:text-neutral-50 transition-colors group">
            <Bell size={20} className="group-hover:animate-bounce" />
            <span className="text-sm font-medium">Notifications</span>
          </div>

          <Button className="p-6 space-y-4 bg-brand-blue-950 border-none">
            <div className="flex items-center justify-center gap-3 w-full">
              <User size={18} />
              <span className="text-sm font-bold">Profile</span>
            </div>
          </Button>

          {/* Banner Marketing */}
          <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 p-5 rounded-2xl border border-brand-blue-400/20">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
              <GraduationCap size={18} className="text-brand-blue-200" />
            </div>
            <p className="text-[13px] font-bold text-neutral-50 mb-1 leading-tight">
              Keep Learning, Keep growing
            </p>
            <p className="text-[11px] text-neutral-300 mb-4 leading-tight">
              Browse new courses and continue your learning journey
            </p>
            <Button className="bg-neutral-50 text-brand-blue-950 hover:bg-neutral-100 text-[12px] font-bold h-9 w-full flex items-center justify-between px-4">
              Explore
              <span>→</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}