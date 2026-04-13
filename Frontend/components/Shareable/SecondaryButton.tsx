import Link from "next/link";

interface SecondaryButtonProps {
  title: string;
  link: string;
}

export default function SecondaryButton({ title, link }: SecondaryButtonProps) {
  return (
    <Link 
      href={link} 
      className="border-2 border-[#FFFFFF] bg-transparent rounded-[8px] w-[187px] h-[44px] text-[16px] leading-[24px] flex items-center justify-center transition-all hover:bg-white/10 active:scale-95"
    >
      {title}
    </Link>
  );
}