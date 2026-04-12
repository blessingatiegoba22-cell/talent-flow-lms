"use client"

import Image from "next/image"
import Link from "next/link"
import { Lock, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// 1. The Validation Rules
const resetPasswordSchema = z.object({
  code: z.string().min(4, "Please enter the full code"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

// 2. The Prop Interface for the state swap
interface ResetPasswordFormProps {
  onSuccess: () => void
}

export default function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordValues) => {
   
    
  
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onSuccess()
  }

  return (
    <div className="w-full max-w-lg bg-[#020617] rounded-[2rem] p-8 md:p-12 shadow-2xl mx-auto font-sans relative">
      
      {/* Return Icon */}
      <Link href="/forgot-password" className="absolute top-6 left-6 md:top-8 md:left-8 transition-transform hover:scale-110 z-10">
        <Image src="/icon-park_return.svg" alt="Return" width={35} height={35} style={{ height: 'auto' }} />
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center text-center mt-6">
        <Image 
          src="/authImage.png"          
          alt="TalentFlow Logo"
          width={180} height={40} priority
          className="mb-8 w-[150px] md:w-[180px]" 
          style={{ height: 'auto' }} 
        />
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
          Reset Password
        </h2>
        <p className="text-xs md:text-sm text-gray-400 font-medium">
          Enter the code sent to your email address
        </p>
      </div>
   
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        
        {/* Code Input */}
        <div className="relative">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input 
            {...register("code")}
            type="text" 
            placeholder="Code" 
            className="pl-12 h-12 md:h-14 bg-white border-none rounded-xl text-black font-medium focus:ring-2 focus:ring-blue-500"
          />
          {errors.code && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.code.message}</p>}
        </div>

        {/* New Password Input */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input 
            {...register("password")}
            type="password" 
            placeholder="New Password" 
            className="pl-12 h-12 md:h-14 bg-white border-none rounded-xl text-black font-medium focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input 
            {...register("confirmPassword")}
            type="password" 
            placeholder="Confirm new Password" 
            className="pl-12 h-12 md:h-14 bg-white border-none rounded-xl text-black font-medium focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 md:h-14 mt-2 bg-[#1D4ED8] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>

        {/* Resend Code Link */}
        <div className="text-center mt-6">
          <span className="text-[10px] md:text-xs text-gray-400 font-medium">
            Didn&apos;t get a code?{" "}
          </span>
          <button type="button" className="text-[10px] md:text-xs text-white font-bold hover:underline">
            Resend Code
          </button>
        </div>

      </form>
    </div>
  )
}