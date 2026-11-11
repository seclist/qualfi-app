/**
 * Editorial section marker: an italic serif index, a hairline rule, then the label.
 * Used at the top of every major section so the page reads as a numbered sequence.
 */
export function SectionEyebrow({
  index,
  children,
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#d9532f] ${className}`}
    >
      <span className="font-serif text-base font-normal italic normal-case leading-none tracking-normal">
        {index}
      </span>
      <span aria-hidden="true" className="h-px w-8 bg-[#d9532f]/40" />
      <span>{children}</span>
    </span>
  );
}
