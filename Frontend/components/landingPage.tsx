import Link from "next/link";
import Image from "next/image";
export default function LandingPage() {
  return (
    <div className="">
      <nav className="flex flex-row justify-between bg-[#07142F] p-8 text-[#FFFFFF] gap-x-24 align-center">
        <span>
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </span>
        <ul className="flex flex-row justify-between gap-x-8 ">
          <Link href="#">Home</Link>
          <Link href="#">About</Link>
          <Link href="#">Features</Link>
          <Link href="#">Contact</Link>
        </ul>
        <div className="flex flex-row justify-between gap-x-8">
          <button className="bg-[#1F53C4] p-4 rounded-xl w-46.75">Login</button>
          <button className="border-4 border-[#FFFFFF] bg-transparent p-4 rounded-xl w-46.75">
            Sign Up
          </button>
        </div>
      </nav>
      <div className="w-full h-full bg-[#133276] flex flex-row justify-between">
        <div className="p-16 w-1/3">
          <h1>Unlock Your Potential, One Skill at a Time</h1>
          <p>
            Talent Flow helps you discover the right courses, master in demands
            skills, and track your progress all in one seamless learning
            platform,
          </p>
        </div>
        <div className="p-16">
          <Image
            src="/heroImage.png"
            alt="hero image"
            width={350}
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
