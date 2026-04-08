import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const avatarToneClasses = [
  "bg-[radial-gradient(circle_at_30%_30%,#eef3ff_0%,#d8e3ff_58%,#c4d4ff_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#effaf5_0%,#d6f4e5_58%,#b8eacb_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#fff4ef_0%,#ffe2d2_58%,#ffd0b8_100%)]",
  "bg-[radial-gradient(circle_at_30%_30%,#f6f1ff_0%,#e5dbff_58%,#d3c3ff_100%)]",
];

export function getAvatarToneClass(seed: string) {
  const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarToneClasses[hash % avatarToneClasses.length];
}
