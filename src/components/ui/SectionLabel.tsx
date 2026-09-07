export function SectionLabel({
  children,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] ${
        dark ? "text-dark-muted" : "text-muted"
      } ${className}`}
    >
      {children}
    </p>
  );
}
