"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CodeSentConfirmation() {
  const router = useRouter()

  return (
    <div className="w-full max-w-4xl bg-white rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-2xl mx-auto font-sans flex flex-col md:flex-row items-center gap-8 md:gap-16">
      
      {/* Left Side: The Phone/Mail Illustration */}
      <div className="relative w-full md:w-1/2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden shrink-0 shadow-inner">
        <Image 
          src="/mail-notification.png" 
          alt="Mail Notification" 
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Right Side: Text & Button */}
      <div className="w-full md:w-1/2 flex flex-col items-start text-left">
        
        <h2 className="text-2xl md:text-[32px] font-bold text-[#07142F] tracking-tight mb-4 leading-tight">
          Reset code Request<br />Successfully sent
        </h2>
        
        <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed mb-8 max-w-sm">
          Check your email for the code, ensure to check your spam folders too.
        </p>

        {/* The Routing Button */}
        <Button 
          onClick={() => router.push("/reset-password")}
          className="w-full md:w-[200px] h-12 md:h-14 bg-[#1D4ED8] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 text-base"
        >
          Continue
        </Button>
        
      </div>

    </div>
  )
}