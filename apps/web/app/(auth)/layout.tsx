import type { ReactNode } from "react";
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-svh overflow-hidden bg-[#eef3fb]">
      <div className="relative mx-auto max-w-[1400px] px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
        <div className="h-[calc(100svh-1.5rem)] overflow-hidden lg:h-[calc(100svh-3rem)]">{children}</div>
      </div>
    </div>
  );
}
