"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { FAQ_SECTIONS } from "../constants/faq-page-content";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function FAQAccordion() {
    const [openItems, setOpenItems] = useState<Record<string, string | null>>({});
    const [searchQuery, setSearchQuery] = useState("");

    const toggleItem = (sectionId: string, question: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [sectionId]: prev[sectionId] === question ? null : question,
        }));
    };

    const filteredSections = useMemo(() => {
        if (!searchQuery) return FAQ_SECTIONS;

        return FAQ_SECTIONS.map(section => ({
            ...section,
            items: section.items.filter(
                item =>
                    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(section => section.items.length > 0);
    }, [searchQuery]);

    return (
        <div className="w-full space-y-16">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg outline-none shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredSections.length === 0 ? (
                <div className="text-center py-12">
                    <Typography variant="lead">No results found for "{searchQuery}"</Typography>
                </div>
            ) : (
                <div className="space-y-20">
                    {filteredSections.map((section) => (
                        <div key={section.id} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <Typography variant="h2" as="h2" className="md:text-3xl text-2xl border-none pb-0">
                                    {section.title}
                                </Typography>
                                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                            </div>
                            <div className="grid gap-4">
                                {section.items.map((item, index) => {
                                    const isOpen = openItems[section.id] === item.question;
                                    return (
                                        <motion.div
                                            key={item.question}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <div
                                                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen
                                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/10 shadow-md'
                                                    : 'border-border hover:border-primary/50 bg-background hover:shadow-sm'
                                                    }`}
                                            >
                                                <button
                                                    className="w-full p-6 text-left flex items-center justify-between gap-4 group"
                                                    onClick={() => toggleItem(section.id, item.question)}
                                                >
                                                    <Typography
                                                        as="h3"
                                                        variant="large"
                                                        className={cn(
                                                            "leading-relaxed transition-colors",
                                                            isOpen ? 'text-primary' : 'text-foreground'
                                                        )}
                                                    >
                                                        {item.question}
                                                    </Typography>
                                                    <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary text-primary-foreground rotate-180' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                                                        }`}>
                                                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                                    </div>
                                                </button>
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        >
                                                            <div className="px-6 pb-6 -mt-1">
                                                                <div className="pt-4 border-t border-primary/20">
                                                                    <Typography variant="muted" className="leading-relaxed text-lg whitespace-pre-line">
                                                                        {item.answer}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
