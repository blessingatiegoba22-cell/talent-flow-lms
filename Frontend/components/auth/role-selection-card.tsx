import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

type RoleSelectionCardProps = {
  actionLabel: string;
  description: string;
  href: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
};

export function RoleSelectionCard({
  actionLabel,
  description,
  href,
  imageAlt,
  imageSrc,
  title,
}: RoleSelectionCardProps) {
  return (
    <article className="group mx-auto w-full max-w-[305px] overflow-hidden rounded-[5px] border border-white/75 bg-[#eef2fa] shadow-[0_20px_50px_rgba(0,0,0,0.16)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,0,0,0.22)] sm:max-w-[290px] lg:max-w-[305px]">
      <div className="relative h-[218px] overflow-hidden bg-white sm:h-[238px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 305px, (min-width: 640px) 290px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex min-h-[164px] flex-col items-center px-4 pb-6 pt-3 text-center text-[#1f2d48]">
        <h2 className="text-[22px] font-extrabold leading-tight text-[var(--brand-blue-800)]">
          {title}
        </h2>
        <p className="mt-3 max-w-[245px] text-[13px] font-bold leading-[1.45] text-[#202020]">
          {description}
        </p>

        <Link
          href={href}
          className="mt-auto inline-flex h-10 min-w-[134px] transform-gpu cursor-pointer items-center justify-center gap-3 rounded-[5px] bg-[var(--brand-blue-500)] px-5 text-[13px] font-bold text-white shadow-[0_14px_28px_rgba(37,99,235,0.28)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)] hover:shadow-[0_18px_34px_rgba(37,99,235,0.32)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.25)]"
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          {actionLabel}
        </Link>
      </div>
    </article>
  );
}
