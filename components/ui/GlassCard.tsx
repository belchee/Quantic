import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-sm border border-white/8 rounded-2xl p-6",
        hover && "hover:border-blue-500/30 hover:bg-white/8 hover:scale-[1.02] transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
