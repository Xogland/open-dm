import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  variant?: "default" | "underline" | "no-border"
}

function Input({
                 className,
                 type,
                 variant = "default",
                 ...props
               }: InputProps) {
  const baseStyles =
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"

  const variants = {
    default: "rounded-md border border-input",
    underline: "border-b border-input rounded-none px-0 shadow-none placeholder:text-secondary-foreground/60 focus-visible:border-b-primary focus-visible:ring-0",
    "no-border": "border-0 shadow-none",
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  )
}

export { Input }
