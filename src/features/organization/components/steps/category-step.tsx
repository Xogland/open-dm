"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const CATEGORIES = [
    "Education",
    "Automotive",
    "Shopping & Retail",
    "Arts & Entertainment",
    "Beauty Cosmetics & Personal Care",
    "Finance",
    "Apparel & Clothing",
    "Health",
    "Restaurant",
    "Travel",
    "Hotel",
    "Nonprofit Organisation",
    "Event Planning",
    "Tech & Software",
    "Real Estate",
    "Marketing",
    "Consulting",
    "Fitness",
];

interface CategoryStepProps {
    category: string;
    setCategory: (category: string) => void;
    className?: string;
}

export function CategoryStep({
    category,
    setCategory,
    className,
}: CategoryStepProps) {
    return (
        <div className={cn("space-y-6 animate-in slide-in-from-right-8 duration-500", className)}>
            <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                    <Badge
                        key={cat}
                        variant="outline"
                        className={cn(
                            "py-3 px-4 justify-center cursor-pointer transition-all duration-200 text-xs border-border/60 hover:border-primary/50 hover:bg-primary/5",
                            category === cat &&
                            "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-md shadow-primary/20 scale-[1.02]"
                        )}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
