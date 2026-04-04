import Link from "next/link";
import Image from "next/image";
import Primarybutton from "@components/shareable/PrimaryButton";
import Secondarybutton from "@components/shareable/SecondaryButton";
import Avatar from "@components/shareable/Avartar";

export default function Landingpage() {
  return (
   
    <div className="flex w-full min-h-screen flex-col">
      
    
      <nav className="flex flex-row justify-between bg-[#07142F] p-8 text-[#FFFFFF] gap-x-24 items-center">
        <span>
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </span>
        <ul className="flex flex-row justify-between gap-x-8 items-center">
          <Link href="#">Home</Link>
          <Link href="#">About</Link>
          <Link href="#">Features</Link>
          <Link href="#">Contact</Link>
        </ul>
        <div className="flex flex-row justify-between gap-x-8">

          <Primarybutton title="Login" />
          <Secondarybutton title="Sign Up" />

         
        </div>
      </nav>

      {/* Main Hero Section */}
      {/* Use flex-1 so this section fills the remaining space after the nav */}
      <div className="w-full flex-1 bg-[#133276] flex flex-row items-center justify-between text-white">
        <div className="p-8 w-1/2 flex flex-col gap-y-8"> 
          <h1 className="font-bold text-5xl leading-tight">
            Unlock Your Potential, One Skill at a Time
          </h1>
          <p className="font-light text-lg opacity-80 max-w-md">
            Talent Flow helps you discover the right courses, master in-demand
            skills, and track your progress all in one seamless learning
            platform.
          </p>
          <div className="flex gap-x-8 mt-4">
            <Primarybutton title="Get Started" />
            <Secondarybutton title="Learn More" />
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-4">
  <Avatar src="/user1.png" zIndex={30} />
        <Avatar src="/user2.png" zIndex={20} />
        <Avatar src="/user3.png" zIndex={10} />
  </div>
            <span className="mx-8">Trusted by 50,000+ learners worldwide</span>
          </div>
          <div className="gap-x-16 flex">
<div className="flex gap-x-8">
            <div></div>
            <div>
                <h1 className="font-bold text-5xl leading-tight">500+</h1>
                <p>Expert Courses</p>
            </div>
          </div>
<div className="flex gap-x-8">
            <div></div>
            <div>
                <h1 className="font-bold text-5xl leading-tight">100+</h1>
                <p>Active Learners</p>
            </div>
          </div>
<div className="flex gap-x-8">
            <div></div>
            <div>
                <h1 className="font-bold text-5xl leading-tight">95%</h1>
                <p>Success Rate</p>
            </div>
          </div>
          </div>
          
        </div>

        <div className="p-8 w-1/2 flex justify-center">
          <Image
            src="/heroImage.png"
            alt="hero image"
            width={550}
            height={550}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}