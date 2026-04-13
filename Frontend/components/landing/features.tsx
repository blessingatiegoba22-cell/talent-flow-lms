import Image from "next/image"
import { BookOpen, TrendingUp, Users, Award, Zap, User, MonitorSmartphone } from "lucide-react"
import PrimaryButton from "@/components/Shareable/PrimaryButton"
import SecondaryButton from "@/components/Shareable/SecondaryButton"

const FEATURES_DATA = [
  {
    title: "Interactive Learning Experience",
    subtitle: "Learning that feels engaging",
    description: "Quizzes and interactive contents to make online learning dynamic and participatory",
    icon: BookOpen,
    bullets: [
      "Interactive sessions with student and tutor",
      "Interactive quizzes and assignments",
      "Real time feedback to guide improvement"
    ]
  },
  {
    title: "Progress Tracking",
    subtitle: "Track your progress with clarity not clutter",
    description: "Stay motivated with clear visual indicators of progress and performance",
    icon: TrendingUp,
    bullets: [
      "Track course completion and progress",
      "Get insights into performance and areas to improve",
      "Visual data that's easy to understand"
    ]
  },
  {
    title: "Tutor & Admin Management",
    subtitle: "Tools to keep your platform running smoothly",
    description: "Manage users, oversee courses, and control platform operations with ease",
    icon: Users,
    bullets: [
      "Oversee courses and content quality",
      "Access detail platform analytics",
      "Centralized user management and permission"
    ]
  },
  {
    title: "Certificate & Achievements",
    subtitle: "Rewards learners after completing courses",
    description: "Earn recognised certificates and track your accomplishment as you complete courses and reach learning milestone",
    icon: Award,
    bullets: [
      "Shareable Certificates",
      "Verified Skill Recognition",
      "Motivation Through Milestone"
    ]
  }
]

export default function Features() {
  return (
    <>
      {/* 1. Hero Card Section */}
    <section className="w-full bg-white px-4 py-8 md:px-12 md:py-20 font-sans">
      
      <div className="max-w-5xl mx-auto bg-[#F8FAFC] border border-gray-200 rounded-3xl overflow-hidden flex flex-col md:flex-row-reverse items-center shadow-sm">
        
        {/* Image  */}
        <div className="w-full md:w-1/2 relative min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
          <Image 
            src="/hero-students.png" 
            alt="Students learning on laptops" 
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Content Area  */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left p-8 md:p-12 space-y-6">
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-[#07142F] leading-tight tracking-tight">
            Everything you need to learn, teach, and manage all in one place
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-[400px]">
            Talent Flow is designed to remove friction, improve navigation and create a seamless experience for students, tutors, and administrators.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
            <PrimaryButton title="Get Started" link="/sign-up" />
            <SecondaryButton title="Learn More" link="/#" />
          </div>
          
        </div>

      </div>
    </section>

      {/* 2. Features Grid Section */}
      <section id="features" className="w-full max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 font-sans">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#07142F] tracking-tight">
            Our Features
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {FEATURES_DATA.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-[#07142F] mb-1">{feature.title}</h3>
                <p className="text-sm font-semibold text-gray-900 mb-3">{feature.subtitle}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="mt-auto space-y-3">
                  {feature.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <feature.icon className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-gray-600 font-medium">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Blue Banner */}
        <div className="w-full bg-[#1D4ED8] rounded-xl flex flex-col md:flex-row justify-around items-center py-6 px-4 gap-6 shadow-lg">
          <div className="flex items-center gap-3 text-white">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-sm md:text-base font-bold tracking-wide">Fast Navigation</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/30"></div>
          <div className="flex items-center gap-3 text-white">
            <User className="w-5 h-5 text-blue-200" />
            <span className="text-sm md:text-base font-bold tracking-wide">Personalized Learning</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-white/30"></div>
          <div className="flex items-center gap-3 text-white">
            <MonitorSmartphone className="w-5 h-5 text-green-300" />
            <span className="text-sm md:text-base font-bold tracking-wide">Cross Device Experience</span>
          </div>
        </div>
      </section>
    </>
  )
}