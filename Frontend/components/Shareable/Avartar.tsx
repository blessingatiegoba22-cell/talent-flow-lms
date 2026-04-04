import Image from "next/image";

interface AvatarProps {
  src?: string; // Made optional with '?'
  name?: string; // Optional: to show an initial if no image
  zIndex?: number;
}

export default function Avatar({ src, name, zIndex = 10 }: AvatarProps) {
  // Determine the first letter of the name for the placeholder
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div 
      className="relative w-12 h-12 rounded-full border-2 border-[#133276] overflow-hidden bg-gray-400 flex items-center justify-center text-white font-bold"
      style={{ zIndex }}
    >
      {src ? (
        <Image
          src={src}
          alt={name || "User profile"}
          fill
          className="object-cover"
        />
      ) : (
        /* This displays if no 'src' is provided */
        <div className="bg-gradient-to-br from-gray-400 to-gray-600 w-full h-full flex items-center justify-center">
          {initial}
        </div>
      )}
    </div>
  );
}