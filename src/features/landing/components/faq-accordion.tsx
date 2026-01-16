"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
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

    return FAQ_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    })).filter((section) => section.items.length > 0);
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
          <Typography variant="lead">
            No results found for "{searchQuery}"
          </Typography>
        </div>
      ) : (
        <div className="space-y-20">
          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-8">
              <div className="flex items-center gap-4">
                <Typography
                  variant="h2"
                  as="h2"
                  className="md:text-3xl text-2xl border-none pb-0"
                >
                  {section.title}
                </Typography>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>
              <div className="divide-y divide-border">
                {section.items.map((item, index) => {
                  const isOpen = openItems[section.id] === item.question;
                  return (
                    <div key={item.question} className="border-b border-border">
                      <button
                        onClick={() => toggleItem(section.id, item.question)}
                        className="w-full py-6 md:py-8 flex items-center justify-between text-left group transition-all"
                      >
                        <Typography
                          variant="subheading"
                          as="h3"
                          className={cn(
                            "md:text-2xl transition-colors pr-4",
                            isOpen
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground",
                          )}
                        >
                          {item.question}
                        </Typography>
                        <div
                          className={cn(
                            "transition-all duration-300 flex-shrink-0",
                            isOpen
                              ? "rotate-45 text-primary"
                              : "rotate-0 text-muted-foreground group-hover:text-foreground",
                          )}
                        >
                          <Plus className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pb-8 space-y-6">
                              <Typography
                                variant="lead"
                                className="text-foreground/80 whitespace-pre-line"
                              >
                                {item.answer}
                              </Typography>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
