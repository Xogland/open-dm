"use client";

import React, { useEffect, useRef } from "react";
import { MessageItem } from "./message-item";
import { ChatMessage, MultipleChoiceOption } from "@/lib/message-types";

interface MessageListProps {
  messages: ChatMessage[];
  onServiceSelect?: (serviceId: string, serviceTitle: string) => void;
  onOptionSelect?: (option: MultipleChoiceOption | MultipleChoiceOption[] | string | number | string[]) => void;
  onDateSelect?: (date: Date) => void;
  onFileUpload?: (file: File) => void;
  onTextSubmit?: (text: string) => void;
  onPaymentSuccess?: (paymentId: string) => void;
  onReset?: () => void;
  disableInteractions?: boolean;
  tempSelection?: (MultipleChoiceOption | string)[];
  onTempSelectionChange?: (options: (MultipleChoiceOption | string)[]) => void;
}

export function MessageList({
  messages,
  onServiceSelect,
  onOptionSelect,
  onDateSelect,
  onFileUpload,
  onTextSubmit,
  onPaymentSuccess,
  onReset,
  disableInteractions = false,
  tempSelection,
  onTempSelectionChange,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter(Boolean);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [filteredMessages]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-full flex flex-col justify-end gap-1"
    >
      {filteredMessages.map((message, index) => {
        // Check if this message is "answered" by the next message being a user_response
        // This assumes a linear flow: Question -> Answer
        const nextMessage = filteredMessages[index + 1];
        const isAnswered = nextMessage?.type === 'user_response';

        // Also disable if it's not the last message and not a system/typing message
        // or if global interactions are disabled
        const isDisabled = disableInteractions || isAnswered || (index < filteredMessages.length - 1 && message.type !== 'system_info' && message.type !== 'typing' && message.type !== 'end_screen');

        // Hide service selection if it's already answered
        if (message.type === 'service_selection' && isAnswered) {
          return null;
        }

        return (
          <MessageItem
            key={message.id}
            message={message}
            onServiceSelect={onServiceSelect}
            onOptionSelect={onOptionSelect}
            onDateSelect={onDateSelect}
            onFileUpload={onFileUpload}
            onTextSubmit={onTextSubmit}
            onPaymentSuccess={onPaymentSuccess}
            onReset={onReset}
            disabled={isDisabled}
            selectedOptions={!isDisabled ? tempSelection : undefined}
            onSelectionChange={!isDisabled ? onTempSelectionChange : undefined}
          />
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
