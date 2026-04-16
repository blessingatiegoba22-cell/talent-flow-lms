import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardPageHeaderProps = {
  className?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  title: string;
  titleClassName?: string;
};

export function DashboardPageHeader({
  className,
  description,
  descriptionClassName,
  title,
  titleClassName,
}: DashboardPageHeaderProps) {
  return (
    <div className={className}>
      <h1
        className={cn(
          "text-[28px] font-extrabold leading-tight text-black sm:text-[36px]",
          titleClassName,
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-3 text-[14px] font-medium leading-[1.5] text-[#8a8a8a] sm:mt-4 sm:text-[15px]",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
