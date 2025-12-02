export function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <div className="border-b pb-4 mb-4 last:border-none last:pb-0">
      <h3 className="text-sm font-semibold text-black/80 mb-2">
        {title}
      </h3>

      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
