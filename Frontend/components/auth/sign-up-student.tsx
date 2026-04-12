"use client"

import Image from "next/image"
import Link from "next/link"
import { User, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Form validation rules
const signUpSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignUpValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = (data: SignUpValues) => {
    console.log("Form Data:", data)
   
  }

  return (
    <div className="w-full max-w-5xl bg-[#020617] rounded-[2rem] p-6 sm:p-10 md:p-16 relative shadow-2xl min-h-fit lg:min-h-[750px] font-sans mx-auto">
      
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

      <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-10 mt-8 md:mt-0">
        <Image 
          src="/authImage.png" 
          alt="TalentFlow Logo" 
          width={180} 
          height={40} 
          className="mb-6 w-[160px] md:w-[180px]" 
          style={{ height: 'auto' }}
          priority
        />
        
        <div className="bg-[#1D4ED8] text-white px-8 py-2 rounded-md text-xs md:text-sm font-bold tracking-wide shadow-lg">
          Student/Interns
        </div>
        
        <p className="text-[10px] md:text-[11px] text-gray-400 mt-6 uppercase tracking-[0.2em] font-semibold px-4">
          Please enter your details to create an account
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
        
        <div className="hidden lg:block w-[380px] h-[450px] relative">
          <Image 
            src="/student.png" 
            alt="Student and Intern" 
            fill
            sizes="(max-width: 1024px) 0vw, 380px"
            className="rounded-2xl object-cover" 
            priority
          />
        </div>

        <div className="w-full max-w-[400px]">
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

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <Input 
                {...register("password")}
                className="pl-12 bg-white text-black h-12 md:h-14 border-none rounded-xl font-medium" 
                type="password" 
                placeholder="Password" 
              />
              {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <Input 
                {...register("confirmPassword")}
                className="pl-12 bg-white text-black h-12 md:h-14 border-none rounded-xl font-medium" 
                type="password" 
                placeholder="Confirm Password" 
              />
              {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.confirmPassword.message}</p>}
            </div>
            
            <div className="flex items-center gap-2 py-1">
                <input type="checkbox" id="remember" className="rounded border-gray-600 bg-transparent" />
                <label htmlFor="remember" className="text-[10px] md:text-xs text-gray-400 font-medium cursor-pointer">Remember Me</label>
            </div>
            
            <Button type="submit" className="w-full bg-[#1D4ED8] hover:bg-blue-700 h-12 md:h-14 text-base font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg">
              Sign Up
            </Button>

            <div className="relative py-2 md:py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
                <span className="relative bg-[#020617] px-4 text-[9px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest">Or</span>
            </div>

            <Button 
              type="button"
              variant="outline" 
              className="w-full h-12 md:h-14 bg-white text-black hover:bg-gray-100 border-none rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-bold text-sm">Sign up with Google</span>
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-8 md:mt-10 flex justify-center w-full pb-4">
        <div className="bg-white px-6 md:px-8 py-2 md:py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
           <span className="text-black text-[10px] md:text-[11px] font-bold">Already have an account?</span>
           <Link href="/sign-in" className="text-blue-600 text-[10px] md:text-[11px] font-black hover:underline uppercase tracking-tighter">login</Link>
        </div>
      </div>
    </div>
  )
}