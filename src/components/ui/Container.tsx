import { ReactNode } from "react";

export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-6 sm:px-10 lg:px-20 ${
        wide ? "max-w-[var(--container-wide)]" : "max-w-[var(--container-content)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
