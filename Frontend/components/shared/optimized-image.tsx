import Image, { type ImageProps } from "next/image";

const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dce8fb'/%3E%3Cstop offset='0.55' stop-color='%23f4f7fb'/%3E%3Cstop offset='1' stop-color='%23c7d7f2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='16' height='10' fill='url(%23g)'/%3E%3C/svg%3E";

export function OptimizedImage({
  alt,
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  decoding = "async",
  loading,
  placeholder = "blur",
  preload,
  priority,
  quality = 74,
  ...props
}: ImageProps) {
  const shouldPreload = preload ?? priority;

  return (
    <Image
      {...props}
      alt={alt}
      blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
      decoding={decoding}
      loading={shouldPreload ? undefined : (loading ?? "lazy")}
      placeholder={placeholder}
      preload={shouldPreload}
      quality={quality}
    />
  );
}
