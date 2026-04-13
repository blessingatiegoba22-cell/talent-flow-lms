import Navbar from "@/components/landing/navbar"
import About from "@/components/landing/about"
import Features from "@/components/landing/features"
import Landingpage from "@/components/landing/landingPage"
import Footer from "@/components/landing/footer"

export default function Page() {
  return (
    <div className="flex w-full min-h-screen flex-col bg-white text-[#07142F]">
      
      {/* 1. The Global Navbar */}
      <Navbar />

      {/* 2. Main Page Content */}
      <main className="flex-grow w-full flex flex-col items-center">
        
        {/* The Hero Section */}
        <Landingpage />

        {/*  About  */}
        <About />

        {/*  Features  */}
          <Features />
         
          {/*  footer  */}
          <Footer />

      </main>

    </div>
  )
}