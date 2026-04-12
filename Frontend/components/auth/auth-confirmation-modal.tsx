import Image from "next/image";

type AuthConfirmationModalProps = {
  buttonLabel: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
  onContinue: () => void;
  title: string;
};

export function AuthConfirmationModal({
  buttonLabel,
  description,
  imageAlt,
  imageSrc,
  onContinue,
  title,
}: AuthConfirmationModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(7,20,47,0.72)] px-4 py-8 text-[#111] backdrop-blur-[3px] sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-confirmation-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.24),transparent_38%)]" />

      <div className="relative grid w-full max-w-[980px] gap-8 rounded-lg border border-[var(--brand-blue-950)] bg-white p-5 shadow-[0_28px_70px_rgba(0,0,0,0.32)] sm:p-6 md:grid-cols-[minmax(320px,414px)_minmax(300px,1fr)] md:items-center md:gap-10 lg:gap-14">
        <div className="overflow-hidden rounded-lg bg-[#e9edf2] shadow-[0_4px_8px_rgba(7,20,47,0.18)]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={414}
            height={573}
            sizes="(min-width: 768px) 414px, calc(100vw - 72px)"
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <div className="px-1 pb-2 md:px-0 md:pb-0">
          <h2
            id="auth-confirmation-title"
            className="max-w-[360px] text-[27px] font-extrabold leading-[1.35] tracking-[0] text-[var(--brand-blue-800)] sm:text-[31px]"
          >
            {title}
          </h2>
          <p className="mt-10 max-w-[360px] text-[18px] font-medium leading-[1.55] text-[#151515] sm:text-[20px]">
            {description}
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-14 flex h-14 w-full max-w-[320px] cursor-pointer items-center justify-center rounded-lg bg-[var(--brand-blue-500)] px-6 text-[18px] font-bold text-white shadow-[0_4px_8px_rgba(7,20,47,0.22)] transition-[transform,background-color,box-shadow] duration-500 ease-out hover:-translate-y-px hover:bg-[var(--brand-blue-600)] hover:shadow-[0_10px_18px_rgba(7,20,47,0.24)]"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
