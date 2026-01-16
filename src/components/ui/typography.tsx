import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
    variants: {
        variant: {
            heading: "text-5xl md:text-7xl leading-tight",
            subheading: "text-xl leading-snug",
            body: "leading-relaxed text-muted-foreground",
            lead: "text-xl text-muted-foreground leading-relaxed",
            caption: "text-sm text-muted-foreground",
            stat: "text-3xl",
            code: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded",
        },
    },
    defaultVariants: {
        variant: "body",
    },
})

// Default element mapping for each variant
const elementMap: Record<string, React.ElementType> = {
    heading: "h1",
    subheading: "h2",
    body: "p",
    lead: "p",
    caption: "span",
    stat: "div",
    code: "code",
}

interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    as?: React.ElementType
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant = "body", as, ...props }, ref) => {
        const Component = as || elementMap[variant || "body"] || "p"

        return (
            <Component
                className={cn(typographyVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Typography.displayName = "Typography"

export { Typography, typographyVariants }
