/** Generic page section: hairline top border and roomy vertical rhythm. */
export function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-clip border-t border-ay-line py-[72px] max-[980px]:py-14 max-[560px]:py-11 ${className}`}
    >
      {children}
    </section>
  );
}
