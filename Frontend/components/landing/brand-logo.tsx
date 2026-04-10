import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  href?: string;
  priority?: boolean;
};

export function BrandLogo({
  className,
  href = "#home",
  priority = false,
}: BrandLogoProps) {
  return (
    <a
      href={href}
      className={cn("inline-flex items-center gap-3 transition-transform", className)}
    >
      <Image
        src="/logo.png"
        alt="Talent Flow icon"
        width={50}
        height={48}
        priority={priority}
        className="h-10 w-auto sm:h-11"
      />
      <Image
        src="/logo-text.png"
        alt="TalentFlow"
        width={177}
        height={48}
        priority={priority}
        className="h-8 w-auto sm:h-9"
      />
    </a>
  );
}
