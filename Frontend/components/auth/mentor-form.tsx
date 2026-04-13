"use client"

import Image from "next/image"
import Link from "next/link"
import { User, Mail, Briefcase, Link as LinkIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Validation rules for Mentor Request
const mentorSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  skill: z.string().min(2, "Please specify your skill or role"),
  portfolio: z.string().url("Please enter a valid URL (e.g., https://...)"),
})

type MentorFormValues = z.infer<typeof mentorSchema>

export function MentorForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema),
  })

  const onSubmit = (data: MentorFormValues) => {
    console.log("Mentor Request Data:", data)
    
  }

  return (
    <div className="w-full max-w-5xl bg-[#020617] rounded-[2rem] p-6 sm:p-10 md:p-16 relative shadow-2xl min-h-fit lg:min-h-[800px] font-sans mx-auto">
      
      {/* 1. Return Icon */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-12 md:left-12 transition-transform hover:scale-110 z-10"
      >
        <Image 
          src="/icon-park_return.svg" 
          alt="Return" 
          width={45} 
          height={45} 
          className="w-[35px] h-[35px] md:w-[45px] md:h-[45px]"
          style={{ height: 'auto' }}
        />
      </Link>

      {/* 2. Top Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12 mt-8 md:mt-0">
        <Image 
          src="/authImage.png" 
          alt="TalentFlow Logo" 
          width={180} 
          height={40} 
          className="mb-6 w-[160px] md:w-[180px]" 
          style={{ height: 'auto' }}
          priority
        />
        
        <div className="bg-[#1D4ED8] text-white px-6 md:px-8 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold tracking-wide shadow-lg">
          Mentor Request
        </div>
        
        <p className="text-[10px] md:text-[11px] text-gray-400 mt-6 max-w-md md:max-w-lg leading-relaxed uppercase tracking-[0.2em] font-semibold px-2">
          Please enter your details to request an invite. Note: Invite is subject to our discretion based on merit and availability of roles.
        </p>
      </div>

      {/* 3. Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center">
        
        {/* Left: Image */}
        <div className="hidden lg:block w-[380px] h-[480px] relative">
          <Image 
            src="/mentor.png" 
            alt="Mentor" 
            fill
            sizes="(max-width: 1024px) 0vw, 380px"
            className="rounded-2xl object-cover object-top" 
            priority
          />
        </div>

        {/* Right: The Form Fields */}
        <div className="w-full max-w-[420px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <Input 
                {...register("fullName")}
                className="pl-12 bg-white text-black h-12 md:h-14 border-none rounded-xl font-medium focus:ring-2 focus:ring-blue-500" 
                placeholder="Full Name" 
              />
              {errors.fullName && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.fullName.message}</p>}
            </div>
            
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <Input 
                {...register("email")}
                className="pl-12 bg-white text-black h-12 md:h-14 border-none rounded-xl font-medium focus:ring-2 focus:ring-blue-500" 
                placeholder="Email" 
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.email.message}</p>}
            </div>

            {/* Skill */}
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <Input 
                {...register("skill")}
                className="pl-12 bg-white text-black h-12 md:h-14 border-none rounded-xl font-medium" 
                placeholder="Skill: eg Product Designer" 
              />
              {errors.skill && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.skill.message}</p>}
            </div>

            {/* Portfolio */}
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <Input 
                {...register("portfolio")}
                className="pl-12 bg-white text-black h-12 md:h-14 border-none rounded-xl font-medium" 
                placeholder="Portfolio Link" 
              />
              {errors.portfolio && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.portfolio.message}</p>}
            </div>
            
            {/* Upload Box */}
            <div className="flex justify-center w-full py-2">
               <div className="bg-white rounded-xl flex items-center justify-center h-24 md:h-28 border-2 border-dashed border-gray-200 w-full max-w-[280px] hover:border-blue-500 transition-all cursor-pointer group">
                <label className="flex flex-col items-center cursor-pointer w-full">
                  <Upload className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2" size={24} />
                  <span className="text-gray-400 group-hover:text-blue-500 text-[10px] font-bold uppercase tracking-tighter">Upload Resume</span>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-[#1D4ED8] hover:bg-blue-700 h-12 md:h-14 text-base font-bold rounded-xl transition-all active:scale-95 shadow-lg">
              Send Request
            </Button>
          </form>
        </div>
      </div>

      {/* 4. The Footer */}
      <div className="mt-8 md:mt-12 flex justify-center w-full pb-4">
        <div className="bg-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-sm">
           <span className="text-black text-[10px] md:text-xs font-medium">Already have an account?</span>
           <Link href="/sign-in" className="text-blue-600 text-[10px] md:text-xs font-bold hover:underline">login</Link>
        </div>
      </div>
    </div>
  )
}