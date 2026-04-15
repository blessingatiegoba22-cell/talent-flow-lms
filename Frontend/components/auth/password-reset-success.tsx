"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PasswordResetSuccess() {
  const router = useRouter()

  return (
    <div className="w-full max-w-4xl bg-white rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-2xl mx-auto font-sans flex flex-col md:flex-row items-center gap-8 md:gap-16">
      
      {/* Left Side: The Celebration Illustration */}
      <div className="relative w-full md:w-1/2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden shrink-0 shadow-inner bg-[#B9D0EA]">
        <Image 
          src="/success.png" 
          alt="Password Reset Success" 
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Right Side: Text & Button */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left">
        
        <h2 className="text-2xl md:text-[32px] font-bold text-[#07142F] tracking-tight mb-4 leading-tight">
          Password successfully<br />reset
        </h2>
        
        <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed mb-8 max-w-[280px]">
          Keep your password safe, store it in a private folder.
        </p>

        {/* Back to Login Button */}
        <Button 
          onClick={() => router.push("/sign-in")}
          className="w-full md:w-[200px] h-12 md:h-14 bg-[#1D4ED8] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 text-base"
        >
          Continue to login
        </Button>
        
      </div>
    </div>
  )
}