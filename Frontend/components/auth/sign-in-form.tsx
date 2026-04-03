"use client"

import Image from "next/image";
import Link from "next/link"
import { Mail, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation" 
import { useAuthStore } from "../../store/useAuthStore" 

export default function SignInForm() {
  const router = useRouter()
  const { setLoading, isLoading } = useAuthStore()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault() 
    setLoading(true)
    
    // Simulate a 1.5 second "Login" check
    setTimeout(() => {
      setLoading(false)
      router.push("/dashboard") 
    }, 1500)
  }

  return (
    <div className="w-full max-w-[400px] mx-auto space-y-8">
      
      {/* LOGO & HEADER */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-8">
          <Image 
            src="/authImage.png"          
            alt="TalentFlow Logo"
            width={235}
            height={60}
            priority
            className="object-contain" 
          />
        </div>
        <h2 className="text-display-sm font-semibold text-white">Welcome Back!</h2>
        <p className="text-sm text-ink-100 mt-2">please sign in to your account.</p>
      </div>
   
      {/* ADDED: onSubmit here connects the button to the function */}
      <form onSubmit={handleSignIn} className="mt-8 space-y-6">
        <div className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-ink-400" />
            <Input 
              type="email" 
              placeholder="Email" 
              required
              className="pl-10 h-12 bg-white border-neutral-300 text-ink-900 placeholder:text-ink-200 focus:ring-brand-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-ink-400" />
            <Input 
              type="password" 
              placeholder="Password" 
              required
              className="pl-10 pr-28 h-12 bg-white border-neutral-300 text-ink-900 placeholder:text-ink-200 focus:ring-brand-blue-500"
            />
            <Link 
              href="/forgot-password" 
              className="absolute right-3 top-3.5 text-xs text-brand-blue-500 font-medium hover:text-brand-blue-600"
            >
              Forgot password
            </Link>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            className="h-5 w-5 bg-neutral-50 border-neutral-300 data-[state=checked]:bg-brand-blue-500 data-[state=checked]:text-white transition-colors duration-200" 
          />
          <Label 
            htmlFor="remember" 
            className="text-sm text-ink-100 font-normal cursor-pointer select-none"
          >
            Remember Me
          </Label>
        </div>

        {/* Sign in button */}
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-brand-blue-500 hover:bg-brand-blue-600 text-white font-semibold"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-ink-400"></div>
          <span className="flex-shrink mx-4 text-ink-200 text-xs uppercase tracking-widest">Or</span>
          <div className="flex-grow border-t border-ink-400"></div>
        </div>

       <Button 
  type="button" 
  variant="outline" 
  className="w-full h-12 bg-white text-ink-950 hover:bg-neutral-100 flex items-center justify-center gap-3 border-none shadow-sm"
>
  {/* Official Google SVG Icon */}
  {/* lucide react icon doesnt have google icon */}
  <svg 
    className="h-5 w-5" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
  
  <span className="font-medium">Sign in with Google</span>
</Button>

        <p className="text-center text-sm text-ink-100">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-white font-bold hover:underline">
             Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}