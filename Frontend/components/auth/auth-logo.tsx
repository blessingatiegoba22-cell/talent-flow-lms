import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AuthLogoProps = {
  className?: string;
  priority?: boolean;
};

export function AuthLogo({ className, priority = false }: AuthLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-[1.02]",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt="Talent Flow icon"
        width={50}
        height={48}
        priority={priority}
        className="h-11 w-auto"
      />
      <Image
        src="/logo-text.png"
        alt="TalentFlow"
        width={177}
        height={48}
        priority={priority}
        className="h-9 w-auto"
      />
    </Link>
  );
}
