import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CircleCheckBig,
  UsersRound,
} from "lucide-react";

type HeroMetric = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type AboutHighlight = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: "left" | "right";
};

export const landingNavLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
] as const;

export const trustedUserImages = [
  { src: "/user-icon-1.webp", alt: "Talent Flow learner avatar" },
  { src: "/user-icon-2.webp", alt: "Talent Flow tutor avatar" },
  { src: "/user-icon-3.webp", alt: "Talent Flow instructor avatar" },
] as const;

export const heroMetrics: HeroMetric[] = [
  { value: "500+", label: "Expert Courses", icon: BookOpen },
  { value: "100+", label: "Active Learners", icon: UsersRound },
  { value: "95%", label: "Success Rate", icon: CircleCheckBig },
];

export const aboutHighlights: AboutHighlight[] = [
  {
    title: "About Us",
    description:
      "We are a comprehensive learning management platform designed to connect learners, tutors, and administrators in one seamless digital experience. Our platform goes beyond just learning. It creates an ecosystem where education is managed, delivered, and experienced efficiently without unnecessary friction.",
    imageSrc: "/about-1.webp",
    imageAlt: "Two learners reviewing content on a tablet",
    imagePosition: "right",
  },
  {
    title: "Our Mission",
    description:
      "Our mission is to simplify and enhance the way education works by empowering every part of the system, from learners gaining knowledge, to tutors delivering impactful lessons, to administrators managing operations with ease.",
    imageSrc: "/about-3.webp",
    imageAlt: "Hands joined together to represent collaboration",
    imagePosition: "left",
  },
  {
    title: "Why Choose Us",
    description:
      "We understand that education is not just about content. It is about structure, delivery, and management. That is why we built a platform that supports every role involved, ensuring a smooth, scalable, and effective learning environment.",
    imageSrc: "/about-2.webp",
    imageAlt: "Books arranged on a shelf in a learning space",
    imagePosition: "right",
  },
  {
    title: "Our Vision",
    description:
      "To build a smart, all-in-one learning ecosystem that transforms how education is delivered, managed, and experienced globally.",
    imageSrc: "/about-4.webp",
    imageAlt: "Learners holding up a sign about the future",
    imagePosition: "left",
  },
];

export const whoWeServe = [
  {
    title: "Learners/Interns",
    description:
      "Access structured courses, track progress, and learn at your own pace with an intuitive and engaging experience.",
  },
  {
    title: "Tutors",
    description:
      "Create, manage, and deliver courses effortlessly while engaging with students and tracking their performances.",
  },
  {
    title: "Administrators",
    description:
      "Oversee the entire platform, manage users, monitor activities, and ensure everything runs smoothly from a central dashboard.",
  },
] as const;

export const footerColumns = [
  {
    title: "Product",
    items: ["Dashboard", "Courses", "Assignments", "Discussions"],
  },
  {
    title: "Company",
    items: ["About Us", "Careers", "Blog", "Contact"],
  },
  {
    title: "Resources",
    items: ["Help Center", "Documentation", "Tutorials", "FAQs"],
  },
  {
    title: "Support",
    items: [
      "Support Center",
      "Report an Issue",
      "Feedback",
      "Privacy Policy",
      "Terms of Service",
    ],
  },
] as const;

export const socialLinks = [
  { label: "Twitter (X)", href: "https://x.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
] as const;
