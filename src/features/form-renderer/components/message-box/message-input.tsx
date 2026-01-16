"use client";

import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
    isLoading?: boolean;
}

export function MessageInput({
    onSend,
    disabled = false,
    placeholder = "Type your message...",
    isLoading = false,
}: MessageInputProps) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() && !disabled && !isLoading) {
            onSend(message.trim());
            setMessage("");
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-200">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={disabled ? "Please select an option above" : placeholder}
                disabled={disabled || isLoading}
                className="flex-1 bg-gray-50 border-gray-300 focus:border-primary focus:ring-primary rounded-full px-4"
            />
            <Button
                onClick={handleSend}
                disabled={!message.trim() || disabled || isLoading}
                size="icon"
                className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 transition-all"
            >
                <Send className="h-4 w-4" />
            </Button>
        </div>
    );
}
