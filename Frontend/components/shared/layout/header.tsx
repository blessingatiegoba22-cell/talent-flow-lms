'use client';

import React from 'react';
import { ChevronDown, User as UserIcon, Bell, Search, Menu } from 'lucide-react'; // Ajout de Menu
import { User } from '@/types/user';
import Image from 'next/image';

interface NavProps {
  user: User;
  onOpenSidebar: () => void;
}

export default function DashboardHeader({
  onOpenSidebar,
  user,
}: NavProps) {
  const { name, role, profileImageUrl: image } = user;

  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-10 border-b border-border/40 bg-background shrink-0">
      
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-lg md:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <div className="relative w-full max-w-md group hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-700 group-focus-within:text-brand-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search courses, students and more ..."
            className="
              w-full h-11 pl-10 pr-4 
              bg-neutral-200 border border-neutral-600 rounded-xl
              text-sm font-medium text-ink-500
              placeholder:text-neutral-700
              focus:ring-2 focus:ring-brand-blue-500/20 focus:bg-neutral-100
              transition-all outline-none
            "
          />
        </div>

        <div className="md:hidden font-black text-brand-blue-950 tracking-tighter italic text-xl">
          TF
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <button className="relative p-2 text-neutral-900 hover:text-brand-blue-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-blue-500 rounded-full border-2 border-background" />
        </button>

        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-neutral-300">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden bg-neutral-300 flex items-center justify-center border border-neutral-400 group-hover:border-brand-blue-400 transition-colors">
              {image ? (
                <Image 
                  src={image} 
                  alt={name} 
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon size={20} className="text-neutral-700" />
              )}
            </div>
            
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          </div>

          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-ink-500 leading-none mb-1 whitespace-nowrap">
              {name}
            </p>
            <p className="text-[10px] font-semibold text-neutral-900 uppercase tracking-wider">
              {role}
            </p>
          </div>

          <button className="p-1 hover:bg-neutral-200 rounded-md transition-colors">
            <ChevronDown size={16} className="text-neutral-700" />
          </button>
        </div>
      </div>
    </header>
  );
}