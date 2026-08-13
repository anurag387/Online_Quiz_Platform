"use client";

export default function Avatar({
  name,
  photoUrl,
  size = 44,
  className = "",
}: {
  name?: string;
  photoUrl?: string;
  size?: number;
  className?: string;
}) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const style = { width: size, height: size };

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name || "avatar"}
        style={style}
        className={`rounded-xl object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={style}
      className={`flex items-center justify-center rounded-xl bg-sky font-bold text-white ${className}`}
    >
      {initial}
    </div>
  );
}
