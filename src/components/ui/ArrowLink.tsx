import Link from "next/link";

export function ArrowLink({
  href,
  children,
  dark = false,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
  external?: boolean;
  className?: string;
}) {
  const classes = `group inline-flex items-center gap-2 font-sans text-sm tracking-[0.02em] border-b pb-1 transition-colors duration-300 ${
    dark
      ? "border-dark-fg/30 text-dark-fg hover:border-dark-fg"
      : "border-ink/30 text-ink hover:border-ink"
  } ${className}`;

  const arrow = (
    <span className="inline-block transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:translate-x-1">
      {external ? "↗" : "→"}
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
