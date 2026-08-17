import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Container({
  children,
  className,
  wrapperClassName,
  ...props
}: ContainerProps) {
  return (
    <section
      className={cn(
        "w-full border-b border-black/[0.07] px-9 py-16",
        wrapperClassName,
      )}
    >
      <div
        className={cn("mx-auto max-w-7xl px-4 lg:px-12", className)}
        {...props}
      >
        {children}
      </div>
    </section>
  );
}
