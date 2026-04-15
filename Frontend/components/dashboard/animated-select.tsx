"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type AnimatedSelectProps = {
  ariaLabel?: string;
  buttonClassName?: string;
  className?: string;
  defaultValue?: string;
  menuClassName?: string;
  onChange?: (value: string) => void;
  optionClassName?: string;
  options: readonly string[];
  placeholder: string;
  selectedOptionClassName?: string;
  value?: string;
};

export function AnimatedSelect({
  ariaLabel,
  buttonClassName,
  className,
  defaultValue = "",
  menuClassName,
  onChange,
  optionClassName,
  options,
  placeholder,
  selectedOptionClassName,
  value,
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedValue = value ?? internalValue;
  const displayValue = selectedValue || placeholder;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(option: string) {
    if (value === undefined) {
      setInternalValue(option);
    }

    onChange?.(option);
    setIsOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md bg-[#f7f7f7] px-4 text-left text-[14px] font-extrabold text-black transition-all duration-300 ease-in-out hover:bg-white hover:text-(--brand-blue-600) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(37,99,235,0.14)]",
          isOpen &&
            "bg-white text-(--brand-blue-700) shadow-[0_10px_22px_rgba(37,99,235,0.12)]",
          buttonClassName,
        )}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel ?? placeholder}
      >
        <span className="min-w-0 truncate">{displayValue}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={listboxId}
        role="listbox"
        aria-hidden={!isOpen}
        className={cn(
          "absolute left-0 top-full z-30 mt-2 w-full min-w-[190px] origin-top rounded-lg border border-[#d7d7d7] bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.16)] transition-all duration-200 ease-out",
          menuClassName,
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        {options.map((option) => {
          const isSelected = option === selectedValue;

          return (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={isSelected}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => handleSelect(option)}
              className={cn(
                "flex min-h-9 w-full cursor-pointer items-center rounded-md px-3 text-left text-[13px] font-semibold text-[#2b2b2b] transition-colors duration-200 hover:bg-[#eef3ff] hover:text-(--brand-blue-700)",
                optionClassName,
                isSelected &&
                  "bg-[#eef3ff] text-(--brand-blue-700)",
                isSelected && selectedOptionClassName,
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
