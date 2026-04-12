"use client";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "../lib";

type PasswordVisibilityButtonProps = {
  visible: boolean;
  onToggle: () => void;
  className?: string;
};

export function PasswordVisibilityButton({
  visible,
  onToggle,
  className,
}: PasswordVisibilityButtonProps) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-white/70 hover:text-foreground sm:right-4",
        className,
      )}
      aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
    >
      <Icon className="size-4" />
    </button>
  );
}
