import { AboutSection } from "./about-section";
import { FeaturesSection } from "./features-section";
import { FooterSection } from "./footer-section";
import { HeroSection } from "./hero-section";
import { LandingNavbar } from "./landing-navbar";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      <LandingNavbar />

      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
      </main>

      <FooterSection />
    </div>
  );
}
