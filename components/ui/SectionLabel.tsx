import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 mb-4", className)}>
      <span className="w-8 h-px bg-cyan-400/60" />
      <span className="text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] font-medium">
        {children}
      </span>
      <span className="w-8 h-px bg-cyan-400/60" />
    </div>
  );
}
