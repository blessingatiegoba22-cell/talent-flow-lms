import type { Metadata } from "next";

import { LearnerCertificatePage } from "@/components/dashboard/learner-certificate-page";

export const metadata: Metadata = {
  title: "Certificates",
  description: "View earned learner certificates and course progress.",
};

export default function CertificatePage() {
  return <LearnerCertificatePage />;
}
