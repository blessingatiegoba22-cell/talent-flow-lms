import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Talent Flow LMS",
    template: "%s | Talent Flow LMS",
  },
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Talent Flow LMS helps learners discover relevant courses, build in-demand skills, and track growth in one place.",
  applicationName: "Talent Flow LMS",
  keywords: [
    "Talent Flow LMS",
    "learning management system",
    "online learning",
    "skill development",
    "course platform",
  ],
  openGraph: {
    title: "Talent Flow LMS",
    description:
      "Discover courses, build practical skills, and track your learning journey with Talent Flow LMS.",
    siteName: "Talent Flow LMS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talent Flow LMS",
    description:
      "Discover courses, build practical skills, and track your learning journey with Talent Flow LMS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
