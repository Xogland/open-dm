"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2Icon, Upload, AlertCircle, FileIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import {
  ChatMessage,
  isServiceSelectionMessage,
  isTextInputMessage,
  isEmailInputMessage,
  isPhoneInputMessage,
  isAddressInputMessage,
  isWebsiteInputMessage,
  isNumberInputMessage,
  isMultipleChoiceMessage,
  isDateInputMessage,
  isFileUploadMessage,
  isUserResponseMessage,
  isSystemInfoMessage,
  isTypingMessage,
  isEndScreenMessage,
  isPaymentInputMessage,
  validateFileUpload,
  MultipleChoiceOption,
  UserResponseMessage
} from "@/lib/message-types";
import {
  StarIcon, HeartIcon, TrophyIcon, ThumbsUpIcon, SmileIcon,
  ShoppingBagIcon, GiftIcon, CrownIcon, TargetIcon, RocketIcon,
  LightbulbIcon, FlagIcon, MusicIcon, CameraIcon, VideoIcon,
  MicIcon, BriefcaseIcon, CoffeeIcon, BeerIcon, ZapIcon
} from "lucide-react";
import { PaymentMessageBox } from "./payment-message";

const ICON_MAP: Record<string, React.ElementType> = {
  Star: StarIcon,
  Heart: HeartIcon,
  Trophy: TrophyIcon,
  ThumbsUp: ThumbsUpIcon,
  Smile: SmileIcon,
  ShoppingBag: ShoppingBagIcon,
  Gift: GiftIcon,
  Crown: CrownIcon,
  Target: TargetIcon,
  Rocket: RocketIcon,
  Lightbulb: LightbulbIcon,
  Flag: FlagIcon,
  Music: MusicIcon,
  Camera: CameraIcon,
  Video: VideoIcon,
  Mic: MicIcon,
  Briefcase: BriefcaseIcon,
  Coffee: CoffeeIcon,
  Beer: BeerIcon,
  Zap: ZapIcon
};

// ============= System Message (Bot) =============
function SystemMessageBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-start mb-3 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="p-3 max-w-[85%] rounded-2xl rounded-tl-none bg-gray-100 text-gray-900 shadow-sm">
        <Typography variant="body" className="text-sm text-gray-900">
          {text}
        </Typography>
      </div>
    </div>
  );
}

// ============= User Response Bubble =============
function UserResponseBubble({ value }: { value: UserResponseMessage["value"] }) {
  if (value instanceof File) {
    return (
      <div className="flex justify-end mb-3 animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="p-3 max-w-[85%] rounded-2xl rounded-br-none bg-primary text-primary-foreground shadow-md flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <FileIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium leading-tight truncate max-w-[200px]">{value.name}</span>
            <span className="text-[10px] opacity-70">{(value.size / 1024).toFixed(1)} KB</span>
          </div>
        </div>
      </div>
    );
  }

  let displayValue: string;

  if (value instanceof Date) {
    displayValue = format(value, "PPP");
  } else if (Array.isArray(value)) {
    // Check if array of objects
    if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      displayValue = (value as MultipleChoiceOption[]).map(v => v.title).join(', ');
    } else {
      displayValue = (value as string[]).join(', ');
    }
  } else if (typeof value === 'object' && value !== null && 'title' in value) {
    displayValue = (value as MultipleChoiceOption).title;
  } else {
    displayValue = String(value);
  }

  return (
    <div className="flex justify-end mb-3 animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="p-3 max-w-[85%] rounded-2xl rounded-br-none bg-primary text-primary-foreground shadow-md">
        <Typography variant="body" className="text-sm text-primary-foreground">
          {displayValue}
        </Typography>
      </div>
    </div>
  );
}

// ============= Service Selection =============
interface ServiceSelectionProps {
  question: string;
  services: Array<{ id: string; title: string; hasPayment?: boolean }>;
  onSelect: (serviceId: string, serviceTitle: string) => void;
  disabled?: boolean;
}

function ServiceSelectionMessage({
  question,
  services,
  onSelect,
  disabled = false,
}: ServiceSelectionProps) {
  return (
    <div className="flex flex-col">
      <Typography variant="lead" className="font-semibold text-gray-900 mb-3 text-md">{question}</Typography>
      <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="max-w-[90%] transition-all">
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <Button
                key={service.id}
                variant="secondary"
                onClick={() => onSelect(service.id, service.title)}
                disabled={disabled}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 border-none justify-start h-auto w-auto py-2 px-5 font-normal rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-98 disabled:opacity-100"
              >
                {service.title}
                {service.hasPayment && <span className="ml-1.5 opacity-60 text-xs">$</span>}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ============= Multiple Choice =============
interface MultipleChoiceProps {
  question: string;
  options: MultipleChoiceOption[];
  onSelect: (option: MultipleChoiceOption | MultipleChoiceOption[] | string | string[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  selectedOptions?: (MultipleChoiceOption | string)[];
  onSelectionChange?: (options: (MultipleChoiceOption | string)[]) => void;
}

function MultipleChoiceMessage({
  question,
  options,
  onSelect,
  disabled = false,
  multiple = false,
  selectedOptions = [],
  onSelectionChange,
}: MultipleChoiceProps) {

  const toggleOption = (index: number) => {
    if (disabled) return;

    // Determine current selection based on props
    // We assume selectedOptions is an array of the actual option objects/strings
    const currentSelected = selectedOptions || [];
    const optionToToggle = options[index];

    let newSelected: (MultipleChoiceOption | string)[];

    // Check existence by reference or value equality if string
    const exists = currentSelected.some(item =>
      (typeof item === 'string' && typeof optionToToggle === 'string' && item === optionToToggle) ||
      (typeof item === 'object' && typeof optionToToggle === 'object' && (item as any).title === (optionToToggle as any).title)
    ); // Simple check - ideally ID based but title/ref is standard here

    if (exists) {
      newSelected = currentSelected.filter(item =>
        !((typeof item === 'string' && typeof optionToToggle === 'string' && item === optionToToggle) ||
          (typeof item === 'object' && typeof optionToToggle === 'object' && (item as any).title === (optionToToggle as any).title))
      );
    } else {
      newSelected = [...currentSelected, optionToToggle];
    }

    if (onSelectionChange) {
      onSelectionChange(newSelected as any[]);
    }
  };

  const handleSelectSingle = (index: number) => {
    const option = options[index];
    onSelect(option);
  }

  return (
    <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="max-w-[100%] w-full">
        <Typography variant="body" className="font-semibold text-gray-900 mb-3 text-sm">{question}</Typography>
        <div className={cn(
          "grid gap-2",
          options.length > 1 && options.some(o => typeof o === 'object' && o !== null && 'description' in o) ? "grid-cols-1 sm:grid-cols-2" : "flex flex-wrap"
        )}>
          {options.map((option, index) => {
            const title = typeof option === 'string' ? option : option.title;
            const description = typeof option === 'object' ? option.description : null;
            const price = typeof option === 'object' ? option.price : null;
            const iconName = typeof option === 'object' ? option.icon : null;

            // Determine isSelected from props
            const isSelected = selectedOptions.some(item =>
              (typeof item === 'string' && typeof option === 'string' && item === option) ||
              (typeof item === 'object' && typeof option === 'object' && (item as any).title === (option as any).title)
            );

            const Icon = iconName && ICON_MAP[iconName] ? ICON_MAP[iconName] : null;

            return (
              <Button
                key={index}
                variant="secondary"
                onClick={() => multiple ? toggleOption(index) : handleSelectSingle(index)}
                disabled={disabled}
                className={cn(
                  "border-none justify-start h-auto py-3 px-5 rounded-2xl transition-all duration-200 relative overflow-hidden group items-start text-left active:scale-98",
                  multiple
                    ? (isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" : "bg-gray-100 hover:bg-gray-200 text-gray-900")
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900 hover:scale-[1.01] hover:shadow-sm",
                  !(options.length > 1 && options.some(o => typeof o === 'object' && o !== null && 'description' in o)) && "w-auto"
                )}
              >
                {multiple && (
                  <div className={cn(
                    "w-5 h-5 mr-3 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
                    isSelected ? "bg-white border-white text-primary" : "border-gray-300 bg-transparent"
                  )}>
                    {isSelected && <CheckCircle2Icon className="w-3.5 h-3.5" />}
                  </div>
                )}

                {Icon && (
                  <div className={cn(
                    "mr-3 mt-1 p-2 rounded-xl bg-white/50 shadow-sm shrink-0 transition-colors group-hover:bg-white",
                    isSelected && "bg-black/10 text-white"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center w-full gap-2">
                    <span className="font-normal text-[13px] leading-tight truncate">{title}</span>
                    {price && (
                      <div className="flex flex-col items-end shrink-0">
                        <span className={cn("font-bold text-[13px]", isSelected ? "text-white" : "text-primary")}>{price}</span>
                      </div>
                    )}
                  </div>
                  {description && (
                    <p className={cn("text-[11px] mt-1 leading-relaxed line-clamp-2", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {description}
                    </p>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============= Date Input =============
interface DateInputProps {
  question: string;
  onSelect: (date: Date) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

function DateInputMessage({
  question,
  onSelect,
  disabled = false,
  minDate,
  maxDate,
}: DateInputProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onSelect(date);
      setOpen(false); // Close popover on selection
    }
  };

  return (
    <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="max-w-[90%]">
        <Typography variant="body" className="font-semibold mb-3 text-sm">{question}</Typography>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              disabled={disabled}
              className={cn(
                "bg-black/40 hover:bg-black/60 text-white border-none justify-start h-12 px-5 text-[17px] rounded-2xl w-auto font-medium transition-all active:scale-98",
                !selectedDate && "text-white/70"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

// ============= File Upload =============
interface FileUploadMessageProps {
  question: string;
  onUpload: (file: File) => void;
  disabled?: boolean;
  acceptedTypes?: string[];
  maxSize?: number;
}

function FileUploadMessage({
  question,
  onUpload,
  disabled = false,
  acceptedTypes,
  maxSize,
}: FileUploadMessageProps) {
  const [error, setError] = useState<string | undefined>();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFileUpload(file, acceptedTypes, maxSize);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }
      onUpload(file);
    }
  };

  return (
    <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="max-w-[90%]">
        <Typography variant="body" className="font-semibold mb-3 text-sm">{question}</Typography>
        <label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={disabled}
            accept={acceptedTypes?.join(",")}
            className="hidden"
          />
          <Button
            variant="secondary"
            disabled={disabled}
            className="bg-black/40 hover:bg-black/60 text-white border-none justify-start h-12 px-5 text-[17px] rounded-2xl w-auto font-medium transition-all active:scale-98 cursor-pointer"
            asChild
          >
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Choose file
              {maxSize && (
                <span className="text-xs ml-2 text-white/70">
                  (Max: {(maxSize / 1024 / 1024).toFixed(1)}MB)
                </span>
              )}
            </span>
          </Button>
        </label>
        {error && (
          <div className="flex items-center text-red-400 text-xs mt-2">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

// ============= Typing Indicator =============
export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3 animate-in fade-in duration-300">
      <div className="p-3 bg-gray-100 rounded-2xl rounded-tl-none">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
}

// ============= End Screen =============
interface EndScreenProps {
  title: string;
  message?: string;
  onReset?: () => void;
  showConfetti?: boolean;
}

function EndScreenMessage({ title, message, onReset }: EndScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 animate-in zoom-in-50 duration-500">
      <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
        <CheckCircle2Icon className="h-8 w-8" />
      </div>
      <Typography variant="subheading" className="text-gray-900">{title}</Typography>
      {message && <Typography variant="caption" className="text-gray-600 whitespace-pre-wrap">{message}</Typography>}
      {onReset && (
        <Button
          className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onReset}
        >
          Submit Another Response
        </Button>
      )}
    </div>
  );
}



// ============= Main Message Item Component =============
interface MessageItemProps {
  message: ChatMessage;
  onServiceSelect?: (serviceId: string, serviceTitle: string) => void;
  onOptionSelect?: (option: MultipleChoiceOption | MultipleChoiceOption[] | string | string[]) => void;
  onDateSelect?: (date: Date) => void;
  onFileUpload?: (file: File) => void;
  onTextSubmit?: (text: string) => void;
  onPaymentSuccess?: (paymentId: string) => void;
  onReset?: () => void;
  disabled?: boolean;
  selectedOptions?: (MultipleChoiceOption | string)[];
  onSelectionChange?: (options: (MultipleChoiceOption | string)[]) => void;
}

export function MessageItem({
  message,
  onServiceSelect,
  onOptionSelect,
  onPaymentSuccess,
  onReset,
  disabled = false,
  selectedOptions,
  onSelectionChange,
}: MessageItemProps) {

  // Interactive Selection Messages
  if (isServiceSelectionMessage(message)) {
    return (
      <ServiceSelectionMessage
        question={message.question}
        services={message.services}
        onSelect={onServiceSelect || (() => { })}
        disabled={disabled}
      />
    );
  }

  if (isMultipleChoiceMessage(message)) {
    return (
      <MultipleChoiceMessage
        question={message.question}
        options={message.options}
        onSelect={onOptionSelect || (() => { })}
        disabled={disabled}
        multiple={message.multiple}
        selectedOptions={selectedOptions}
        onSelectionChange={onSelectionChange}
      />
    );
  }

  // Text-based inputs AND Date/File now just render the question bubble
  // The actual input is handled by the DynamicBottomInput component
  if (
    isTextInputMessage(message) ||
    isEmailInputMessage(message) ||
    isPhoneInputMessage(message) ||
    isAddressInputMessage(message) ||
    isWebsiteInputMessage(message) ||
    isNumberInputMessage(message) ||
    isDateInputMessage(message) ||
    isFileUploadMessage(message)
  ) {
    return <SystemMessageBubble text={message.question} />;
  }

  // Standard Messages
  if (isUserResponseMessage(message)) {
    return <UserResponseBubble value={message.value} />;
  }

  if (isSystemInfoMessage(message)) {
    return <SystemMessageBubble text={message.text} />;
  }

  if (isTypingMessage(message)) {
    return <TypingIndicator />;
  }

  if (isEndScreenMessage(message)) {
    return (
      <EndScreenMessage
        title={message.title}
        message={message.message}
        onReset={onReset}
        showConfetti={message.showConfetti}
      />
    );
  }



  if (isPaymentInputMessage(message)) {
    return (
      <PaymentMessageBox
        message={message}
        onSuccess={(id) => onPaymentSuccess?.(id)}
      />
    );
  }

  return null;
}
