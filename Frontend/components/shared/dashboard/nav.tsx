import { ChevronDown } from 'lucide-react'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from '@/components/ui/avatar'

interface NavProps {
  title?: string
  name?: string
  role?: string
  image?: string
  fallback?: string
}

export default function Nav({
  title = 'Profile',
  name = 'Samuel O.',
  role = 'Student',
  image = 'https://github.com/shadcn.png',
  fallback = 'CN',
}: NavProps) {
  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-10">
      <h1 className="text-black text-lg sm:text-xl md:text-3xl font-bold">
        {title}
      </h1>

      <div className="flex items-center gap-2 md:gap-3">
        <Avatar className="w-8 h-8 md:w-10 md:h-10">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{fallback}</AvatarFallback>
          <AvatarBadge className="bg-green-600" />
        </Avatar>

        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-800">{name}</p>
          <p className="text-xs text-gray-500 font-medium">{role}</p>
        </div>

        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </header>
  )
}