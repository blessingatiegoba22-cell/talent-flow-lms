import Link from "next/link";

interface PrimaryButtonProps {
  title: string;
  link: string;
}

export default function PrimaryButton({ title, link }: PrimaryButtonProps) {
  return (
    <Link 
      href={link} 
      className="bg-[#1F53C4] text-white flex items-center justify-center rounded-[8px] w-[187px] h-[44px] text-[16px] leading-[24px] transition-colors hover:bg-[#163a8a]"
    >
      {title}
    </Link>
  );
}