"use client"

import Image from "next/image"
import Link from "next/link"

const ROLES = [
  {
    id: "student",
    title: "Student /Intern",
    description: "Start Your learning journey, get industry sought-out skills.",
    image: "/student.png", 
    buttonText: "Join",
    link: "/sign-up/student",
    loginLink: "/sign-in"
  },
  {
    id: "mentor",
    title: "Mentor/Teacher",
    description: "Share your unique knowledge and skills with others.",
    image: "/mentor.png",
    buttonText: "Get Invite",
    link: "/sign-up/mentor",
    loginLink: "/sign-in"
  }
]

export default function RoleSelection() {
  return (
    <main className="min-h-screen w-full bg-[#07142F] flex flex-col items-center py-10 px-6 font-sans text-white">
      
      {/* Header Area */}
      <div className="w-full max-w-5xl flex flex-col items-center relative mb-12">
      
        <Link 
          href="/" 
          className="absolute left-0 top-0 transition-transform hover:scale-110 active:scale-95"
        >
          <Image 
            src="/icon-park_return.svg" 
            alt="Go Back"
            width={36}
            height={36}
            className="object-contain"
          />
        </Link>
        
        <Image 
          src="/logo.png" 
          alt="TalentFlow Logo" 
          width={180} 
          height={40} 
          className="  mb-8"
        />

        <h1 className="text-2xl md:text-[32px] font-bold mb-3 tracking-tight">
          Welcome to TalentFlow LMS
        </h1>
        <p className="text-gray-400 text-sm md:text-base text-center max-w-md opacity-90">
          Students, Interns, and Mentors all in one powerful learning platform.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl items-stretch">
        {ROLES.map((role) => (
          <div key={role.id} className="flex flex-col items-center h-full">
            
            {/* Main Card*/}
            <div className="bg-white rounded-2xl overflow-hidden w-full max-w-[380px] shadow-2xl flex flex-col h-full transition-transform hover:-translate-y-1 duration-300">
              
              {/* Image Container */}
              <div className="relative w-full aspect-[16/11] shrink-0 border-b border-gray-100">
                <Image 
                  src={role.image} 
                  alt={role.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              {/* Card Content Area */}
              <div className="p-8 flex flex-col items-center text-center flex-1">
                <h2 className="text-[#07142F] text-xl font-black mb-4 tracking-tight">
                  {role.title}
                </h2>
                
                
                <div className="flex-grow flex items-center justify-center mb-8">
                  <p className="text-gray-500 text-sm leading-relaxed px-2">
                    {role.description}
                  </p>
                </div>
                
                <Link 
                  href={role.link}
                  className="w-full max-w-[200px] bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 transition-all active:scale-95 mt-auto shadow-lg shadow-blue-500/20"
                >
                  <span className="text-[12px] border border-white/40 px-1.5 py-0.5 rounded-md leading-none">▷</span>
                  {role.buttonText}
                </Link>
              </div>
            </div>

      
            <div className="mt-8 bg-white py-3 px-10 rounded-2xl flex gap-3 items-center shadow-xl border border-white/10">
              <span className="text-gray-500 text-xs font-medium">Already have an account</span>
              <Link href={role.loginLink} className="text-[#1D4ED8] font-black text-xs hover:underline uppercase tracking-wider">
                login
              </Link>
            </div>
            
          </div>
        ))}
      </div>
    </main>
  )
}