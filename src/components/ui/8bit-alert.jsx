import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const variantClasses = {
  default: {
    frame: "bg-[#eee8dc]",
    body: "bg-[#0d0b08] text-[#eee8dc]",
    accent: "text-cyan-100",
    description: "text-white/62",
  },
  info: {
    frame: "bg-cyan-100",
    body: "bg-cyan-300/[0.10] text-cyan-50",
    accent: "text-cyan-100",
    description: "text-cyan-50/76",
  },
  success: {
    frame: "bg-emerald-200",
    body: "bg-emerald-400/[0.10] text-emerald-50",
    accent: "text-emerald-100",
    description: "text-emerald-50/76",
  },
  warning: {
    frame: "bg-amber-200",
    body: "bg-amber-400/[0.10] text-amber-50",
    accent: "text-amber-100",
    description: "text-amber-50/78",
  },
  destructive: {
    frame: "bg-red-200",
    body: "bg-red-400/[0.10] text-red-50",
    accent: "text-red-100",
    description: "text-red-50/78",
  },
};

function Alert({ children, className, font = "normal", variant = "default", ...props }) {
  const styles = variantClasses[variant] || variantClasses.default;

  return (
    <div className={cn("relative", className)}>
      <div
        {...props}
        role={props.role || (variant === "destructive" ? "alert" : "status")}
        className={cn(
          "relative z-10 border border-white/10 p-4 shadow-[0_14px_35px_rgba(0,0,0,0.28)]",
          "before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px)] before:bg-[size:100%_8px]",
          styles.body,
          font === "retro" && "font-mono"
        )}
      >
        {children}
      </div>

      <span className={cn("absolute -top-1.5 left-1.5 h-1.5 w-[calc(50%-0.375rem)]", styles.frame)} />
      <span className={cn("absolute -top-1.5 right-1.5 h-1.5 w-[calc(50%-0.375rem)]", styles.frame)} />
      <span className={cn("absolute -bottom-1.5 left-1.5 h-1.5 w-[calc(50%-0.375rem)]", styles.frame)} />
      <span className={cn("absolute -bottom-1.5 right-1.5 h-1.5 w-[calc(50%-0.375rem)]", styles.frame)} />
      <span className={cn("absolute left-0 top-0 size-1.5", styles.frame)} />
      <span className={cn("absolute right-0 top-0 size-1.5", styles.frame)} />
      <span className={cn("absolute bottom-0 left-0 size-1.5", styles.frame)} />
      <span className={cn("absolute bottom-0 right-0 size-1.5", styles.frame)} />
      <span className={cn("absolute -left-1.5 top-1.5 h-[calc(50%-0.375rem)] w-1.5", styles.frame)} />
      <span className={cn("absolute -left-1.5 bottom-1.5 h-[calc(50%-0.375rem)] w-1.5", styles.frame)} />
      <span className={cn("absolute -right-1.5 top-1.5 h-[calc(50%-0.375rem)] w-1.5", styles.frame)} />
      <span className={cn("absolute -right-1.5 bottom-1.5 h-[calc(50%-0.375rem)] w-1.5", styles.frame)} />
    </div>
  );
}

function AlertTitle({ className, ...props }) {
  return (
    <div
      className={cn("font-display text-base font-bold leading-tight tracking-normal text-current", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      className={cn("mt-1 grid justify-items-start gap-1 text-sm leading-6 text-current/70 [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
export default Alert;
