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
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--brand-blue-950)/78 px-4 py-6 text-[#111] backdrop-blur-sm sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-confirmation-title"
      aria-describedby="auth-confirmation-description"
    >
      <div className="relative grid w-fit gap-5 rounded-lg border border-(--brand-blue-950) bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] md:grid-cols-[414px_280px] md:items-center md:gap-7">
        <div className="w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={414}
            height={573}
            sizes="414px"
            className="h-auto w-full rounded-lg object-contain shadow-[0_4px_8px_rgba(7,20,47,0.18)]"
            priority
          />
        </div>

        <div className="flex min-w-0 flex-col px-1 pb-1 text-center md:px-0 md:pb-0 md:text-left">
          <h2
            id="auth-confirmation-title"
            className="mx-auto max-w-80 text-[24px] font-extrabold leading-[1.35] tracking-[0] text-(--brand-blue-800) sm:text-[28px] md:mx-0"
          >
            {title}
          </h2>
          <p
            id="auth-confirmation-description"
            className="mx-auto mt-5 max-w-80 text-[16px] font-medium leading-[1.45] text-[#151515] sm:mt-8 sm:text-[18px] md:mx-0"
          >
            {description}
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="mx-auto mt-7 flex h-14 w-full max-w-80 cursor-pointer items-center justify-center rounded-md bg-(--brand-blue-500) px-6 text-[16px] font-bold text-white shadow-[0_4px_8px_rgba(7,20,47,0.22)] transition-[transform,background-color,box-shadow] duration-300 ease-out hover:-translate-y-px hover:bg-(--brand-blue-600) hover:shadow-[0_10px_18px_rgba(7,20,47,0.24)] sm:mt-10 md:mx-0"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
