import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
    variants: {
        variant: {
            h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
            h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
            h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
            h4: "scroll-m-20 text-xl font-semibold tracking-tight",
            p: "leading-7 [&:not(:first-child)]:mt-6",
            blockquote: "mt-6 border-l-2 pl-6 italic",
            ul: "my-6 ml-6 list-disc [&>li]:mt-2",
            inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
            lead: "text-xl text-muted-foreground",
            large: "text-lg font-semibold",
            small: "text-sm font-medium leading-none",
            muted: "text-sm text-muted-foreground",
            link: "font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity",
        },
    },
    defaultVariants: {
        variant: "p",
    },
})

interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    as?: React.ElementType
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, as, ...props }, ref) => {
        const Component = as || (variant && ["h1", "h2", "h3", "h4"].includes(variant) ? (variant as unknown as React.ElementType) : (variant === "p" ? "p" : (variant === "inlineCode" ? "code" : (variant === "blockquote" ? "blockquote" : (variant === "ul" ? "ul" : "div")))))

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
