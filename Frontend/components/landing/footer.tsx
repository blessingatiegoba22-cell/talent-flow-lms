"use client"

import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// 1. The Validation Schema (The "Safe Check")
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type NewsletterValues = z.infer<typeof newsletterSchema>


const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Courses", href: "/courses" },
      { name: "Assignments", href: "/assignments" },
      { name: "Discussions", href: "/discussions" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "#contact" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "/docs" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "FAQs", href: "/faqs" }
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Support Center", href: "/support" },
      { name: "Report an Issue", href: "/report" },
      { name: "Feedback", href: "/feedback" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" }
    ]
  }
]

export default function Footer() {
  // 3. Form Initialization
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubscribe = async (data: NewsletterValues) => {
  
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert("Subscription successful!")
    reset()
  }

  return (
    <footer className="w-full bg-[#07142F] text-white pt-16 pb-8 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP: Logo & Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-8 mb-16">
          
          <div className="col-span-2 flex flex-col space-y-4">
            <Image 
              src="/authImage.png" 
              alt="TalentFlow Logo" 
              width={180} height={40} 
              
            />
            <p className="text-sm text-gray-400 max-w-[200px] leading-relaxed">
              Unlock Your Potential, One Skill at a Time
            </p>
          </div>

          {/* Mapping through link groups with real hrefs */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="flex flex-col space-y-4">
              <h4 className="font-bold text-base">{group.title}</h4>
              <ul className="flex flex-col space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* MIDDLE: Zod-Validated Newsletter */}
        <div className="border-t border-gray-800 pt-12 pb-16">
          <h4 className="font-bold text-lg mb-6">Newsletter</h4>
          <form onSubmit={handleSubmit(onSubscribe)} className="flex flex-col gap-2 max-w-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow relative">
                <Input 
                  {...register("email")}
                  type="text" 
                  placeholder="Enter Your Email" 
                  className={`h-12 bg-white border-none text-black rounded-md focus:ring-2 ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
                />
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 bg-white text-[#07142F] hover:bg-gray-100 font-bold rounded-md shrink-0 active:scale-95 transition-all"
              >
                {isSubmitting ? "..." : "Subscribe"}
              </Button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-pulse">
                {errors.email.message}
              </p>
            )}
          </form>
        </div>

        {/* BOTTOM: Socials & Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-400">
          <p>© 2026 TalentFlow. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="https://twitter.com" className="hover:text-white transition-colors">Twitter (X)</Link>
            <Link href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="https://instagram.com" className="hover:text-white transition-colors">Instagram</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}