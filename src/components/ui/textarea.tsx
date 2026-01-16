import * as React from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  variant?: "default" | "underline" | "no-border";
};

function Textarea({
  className,
  variant = "default",
  rows = 1,
  ...props
}: TextareaProps) {
  const baseStyles =
    // 💡 CHANGE: Replaced 'min-h-16' with a height equivalent to a single line (e.g., min-h-[2.5rem])
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content **min-h-[2.5rem]** w-full bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none";

  const variants = {
    default: "rounded-md border",
    underline:
      "border-b rounded-none px-0 disabled:cursor-default placeholder:text-secondary-foreground/60 disabled:opacity-100 shadow-none focus-visible:border-primary focus-visible:ring-0",
    "no-border": "border-0 shadow-none",
  };

  return (
    <textarea
      data-slot="textarea"
      className={cn(baseStyles, variants[variant], className)}
      rows={rows} // Passes the default/custom rows value
      {...props}
    />
  );
}

export { Textarea };
