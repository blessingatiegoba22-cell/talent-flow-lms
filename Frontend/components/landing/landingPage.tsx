import Link from "next/link";
import Image from "next/image";
import { Users, CircleCheck, BookOpen } from "lucide-react";
import PrimaryButton from "../Shareable/PrimaryButton";
import SecondaryButton from "../Shareable/SecondaryButton";
import Avatar from "../Shareable/Avartar";


   export default function Landingpage() {
  return (
    <div className="flex w-full min-h-screen flex-col">
 
      <div className="w-full flex-1 bg-[#133276] flex flex-col lg:flex-row items-center justify-between text-white px-6 py-12 lg:px-20 lg:py-0">
        
        {/* Text Content */}
        <div className="w-full lg:w-5/12 flex flex-col gap-y-6 lg:gap-y-8 mb-12 lg:mb-0">
          <h1 className="font-bold text-[32px] md:text-[48px] lg:text-[56px] leading-tight">
            Unlock Your Potential, One Skill at a Time
          </h1>
          <p className="font-light text-base md:text-lg opacity-80 max-w-md">
            Talent Flow helps you discover the right courses, master in-demand
            skills, and track your progress all in one seamless learning
            platform.
          </p>
          
          <div className="flex flex-row gap-x-4 md:gap-x-8 mt-4">
            <PrimaryButton title="Get Started" link="/sign-up" />
            <SecondaryButton title="Learn More" link="/#" />
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex -space-x-4">
              <Avatar src="/userIcon.png" zIndex={30} />
              <Avatar src="/userIcon.png" zIndex={20} />
              <Avatar src="/userIcon.png" zIndex={10} />
            </div>
            <span className="text-sm md:text-base">Trusted by 50,000+ learners worldwide</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            <div className="flex gap-x-2 items-center">
              <BookOpen className="w-6 h-6 lg:w-8 lg:h-8" />
              <div>
                <h1 className="font-bold text-2xl lg:text-4xl">500+</h1>
                <p className="text-xs lg:text-sm">Expert Courses</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center">
              <Users className="w-6 h-6 lg:w-8 lg:h-8" />
              <div>
                <h1 className="font-bold text-2xl lg:text-4xl">100+</h1>
                <p className="text-xs lg:text-sm">Active Learners</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center">
              <CircleCheck className="w-6 h-6 lg:w-8 lg:h-8" />
              <div>
                <h1 className="font-bold text-2xl lg:text-4xl">95%</h1>
                <p className="text-xs lg:text-sm">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            src="/heroImage.png"
            alt="hero image"
            width={606}
            height={619}
            className="object-contain w-full max-w-[400px] lg:max-w-full h-auto"
            loading="eager"
          />
        </div>
      </div>
    </div>

  );
}
