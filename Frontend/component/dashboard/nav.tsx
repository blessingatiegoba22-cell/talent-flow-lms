import React from 'react'
import { ChevronDown } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from '@/components/ui/avatar'

export default function Nav() {
  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-10">
      <h1 className="text-black text-lg sm:text-xl md:text-3xl font-bold">Profile</h1>
      <div className="flex items-center gap-2 md:gap-3">
        <Avatar className="w-8 h-8 md:w-10 md:h-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
          <AvatarBadge className="bg-green-600" />
        </Avatar>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-800">Samuel O.</p>
          <p className="text-xs text-gray-500 font-medium">Student</p>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </header>
  )
}
