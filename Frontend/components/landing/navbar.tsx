<<<<<<< HEAD
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import PrimaryButton from "@/components/Shareable/PrimaryButton" 
import SecondaryButton from "@/components/Shareable/SecondaryButton"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
=======
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import PrimaryButton from "@/components/Shareable/PrimaryButton";
import SecondaryButton from "@/components/Shareable/SecondaryButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
>>>>>>> d7a00c2984d512ee393309b88e95bf0090585b1a

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "#contact" },
<<<<<<< HEAD
  ]
=======
  ];
>>>>>>> d7a00c2984d512ee393309b88e95bf0090585b1a

  return (
    <nav className="w-full bg-[#07142F] sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-row justify-between px-4 md:px-12 py-4 text-white items-center h-[70px] md:h-[80px]">
<<<<<<< HEAD
        
        {/* 1. Logo */}
        <Link href="/" className="shrink-0">
          <Image 
            src="/logo.png" 
            alt="TalentFlow Logo" 
            width={180} 
            height={45} 
            priority 
=======
        {/* 1. Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="TalentFlow Logo"
            width={180}
            height={45}
            priority
>>>>>>> d7a00c2984d512ee393309b88e95bf0090585b1a
            className="w-[130px] md:w-[180px] h-auto"
          />
        </Link>

        {/* 2. Desktop Links (Hidden on Mobile) */}
        <ul className="hidden lg:flex flex-row gap-x-8 items-center text-[14px] font-medium">
          {navLinks.map((link) => (
<<<<<<< HEAD
            <Link key={link.name} href={link.href} className="hover:text-blue-400 transition-colors">
=======
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-blue-400 transition-colors"
            >
>>>>>>> d7a00c2984d512ee393309b88e95bf0090585b1a
              {link.name}
            </Link>
          ))}
        </ul>

        {/* 3. CTA Buttons + Mobile Toggle */}
        <div className="flex items-center gap-x-2 md:gap-x-4">
          <div className="hidden sm:flex flex-row gap-x-2">
            <PrimaryButton title="Login" link="/sign-in" />
<<<<<<< HEAD
            <SecondaryButton title="Sign Up" link="/sign-up" />
          </div>

          {/* Hamburger Button (Only shows on Mobile/Tablet) */}
          <button 
=======
            <SecondaryButton title="Sign Up" link="/role-selection" />
          </div>

          {/* Hamburger Button (Only shows on Mobile/Tablet) */}
          <button
>>>>>>> d7a00c2984d512ee393309b88e95bf0090585b1a
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 4. Mobile Overlay Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-[70px] left-0 w-full bg-[#07142F] border-b border-white/10 flex flex-col p-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-y-6 text-lg font-medium">
<<<<<<< HEAD
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)} // Close menu when link clicked
                className="hover:text-blue-400 border-b border-white/5 pb-2"
=======
            {/* Added text-white for the mobile menu links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)} // Close menu when link clicked
                className="hover:text-blue-400 border-b border-white/5 pb-2 text-white"
>>>>>>> d7a00c2984d512ee393309b88e95bf0090585b1a
              >
                {link.name}
              </Link>
            ))}
          </ul>
<<<<<<< HEAD
          
=======

>>>>>>> d7a00c2984d512ee393309b88e95bf0090585b1a
          {/* Mobile CTAs (Shows here if screen is very small) */}
          <div className="flex flex-col gap-y-4 sm:hidden">
            <PrimaryButton title="Login" link="/sign-in" />
            <SecondaryButton title="Sign Up" link="/role-selection" />
          </div>
        </div>
      )}
    </nav>
<<<<<<< HEAD
  )
}
=======
  );
}
>>>>>>> d7a00c2984d512ee393309b88e95bf0090585b1a
