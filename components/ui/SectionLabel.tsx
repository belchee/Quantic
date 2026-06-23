import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 mb-4", className)}>
      <span className="w-8 h-px bg-blue-600/40" />
      <span className="text-blue-600 text-xs font-semibold uppercase tracking-[0.15em]">
        {children}
      </span>
      <span className="w-8 h-px bg-blue-600/40" />
    </div>
  );
}
