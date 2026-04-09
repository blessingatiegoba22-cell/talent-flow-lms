import Link from "next/link";
import Image from "next/image";
// import PrimaryButton from "./shareable/PrimaryButton";
// import SecondaryButton from "./shareable/SecondaryButton";
// import Avatar from "./shareable/Avartar";
import { Users, CircleCheck, BookOpen } from "lucide-react";
import PrimaryButton from "./Shareable/PrimaryButton";
import SecondaryButton from "./Shareable/SecondaryButton";
import Avatar from "./Shareable/Avartar";

export default function Landingpage() {
  return (
    <div className="flex w-full min-h-screen flex-col">
      <nav className="flex flex-row justify-between bg-[#07142F] p-4 text-[#FFFFFF] gap-x-24 items-center h-[60]">
        <span>
          <Image src="/logo.png" alt="logo" width={235} height={60} loading="eager" />
        </span>
        <ul className="flex flex-row justify-between gap-x-8 items-center text-[14px] leading-5.25">
          <Link href="/">Home</Link>
          <Link href="#">About</Link>
          <Link href="#">Features</Link>
          <Link href="#">Contact</Link>
        </ul>
        <div className="flex flex-row justify-between gap-x-8">
          <PrimaryButton title="Login" link="/sign-in" />
          <SecondaryButton title="Sign Up" link="/sing-up" />
        </div>
      </nav>

      {/* Main Hero Section */}
      {/* Use flex-1 so this section fills the remaining space after the nav */}
      <div className="w-full flex-1 bg-[#133276] flex flex-row items-center justify-evenly text-white m-auto">
        <div className="p-6 w-1/3 flex flex-col gap-y-8 ">
          <h1 className="font-bold text-[32px] leading-12">
            Unlock Your Potential, One Skill at a Time
          </h1>
          <p className="font-light text-lg opacity-80 max-w-md">
            Talent Flow helps you discover the right courses, master in-demand
            skills, and track your progress all in one seamless learning
            platform.
          </p>
          <div className="flex gap-x-8 mt-4">
            <PrimaryButton title="Get Started" link="/sign-up" />
            <SecondaryButton title="Learn More" link="/#" />
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-4">
              <Avatar src="/userIcon.png" zIndex={30} />
              <Avatar src="/userIcon.png" zIndex={20} />
              <Avatar src="/userIcon.png" zIndex={10} />
            </div>
            <span className="mx-8">Trusted by 50,000+ learners worldwide</span>
          </div>
          <div className="gap-x-8 flex">
            <div className="flex gap-x-2 justify-center items-center">
              <BookOpen />

              <div>
                <h1 className="font-bold text-5xl leading-tight">500+</h1>
                <p>Expert Courses</p>
              </div>
            </div>
            <div className="flex gap-x-2 justify-center items-center">
              <Users />
              <div>
                <h1 className="font-bold text-5xl leading-tight">100+</h1>
                <p>Active Learners</p>
              </div>
            </div>
            <div className="flex gap-x-2 justify-center items-center">
              <CircleCheck />
              <div>
                <h1 className="font-bold text-5xl leading-tight">95%</h1>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 w-1/2 flex justify-center ">
          <Image
            src="/heroImage.png"
            alt="hero image"
            width={606}
            height={619}
            className="object-contain"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
