import Link from "next/link";

interface SecondaryButtonProps {
  title: string;
  link: string;
}
export default function SecondaryButton({title, link}: SecondaryButtonProps){
    return (
         <Link href={link}className="border-2 border-[#FFFFFF] bg-transparent p-2 rounded-[8px] w-[187px] h-[44px] text-[16px] leading-[24px]">{title}</Link>
    )
}