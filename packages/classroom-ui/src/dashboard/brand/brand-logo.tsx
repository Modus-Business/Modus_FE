import Image from "next/image";

import modusLogo from "../../../../assets/Modus.png";
import { cn } from "../../lib/utils";

type BrandLogoProps = {
  className?: string;
  size?: "sidebar" | "header" | "auth";
};

const sizeClasses = {
  sidebar: "h-11 w-auto max-w-[170px]",
  header: "h-8 w-auto max-w-[150px] sm:h-9 sm:max-w-[160px]",
  auth: "h-11 w-auto max-w-[190px]",
} as const;

export function BrandLogo({ className, size = "header" }: BrandLogoProps) {
  return (
    <Image
      src={modusLogo}
      alt="Modus"
      priority
      className={cn(sizeClasses[size], className)}
    />
  );
}
