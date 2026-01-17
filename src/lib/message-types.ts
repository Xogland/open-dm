// Comprehensive type system for chat-based form messages

export type MessageType =
    | 'service_selection'
    | 'text_input'
    | 'email_input'
    | 'phone_input'
    | 'address_input'
    | 'website_input'
    | 'number_input'
    | 'multiple_choice'
    | 'date_input'
    | 'file_upload'
    | 'user_response'
    | 'system_info'
    | 'typing'
    | 'end_screen'
    | 'external_browser'
    | 'payment_input';

// Base message interface
export interface BaseMessage {
    id: string;
    type: MessageType;
    timestamp: number;
}

// Service selection message
export interface ServiceSelectionMessage extends BaseMessage {
    type: 'service_selection';
    question: string;
    services: Array<{
        id: string;
        title: string;
        hasPayment?: boolean;
    }>;
}

// Text input Question
export interface TextInputMessage extends BaseMessage {
    type: 'text_input';
    question: string;
    placeholder?: string;
    stepId: string;
    minLength?: number;
    maxLength?: number;
    multiline?: boolean;
}

// Email Input
export interface EmailInputMessage extends BaseMessage {
    type: 'email_input';
    question: string;
    placeholder?: string;
    stepId: string;
    required?: boolean; // Can be null if false
}

// Phone Input
export interface PhoneInputMessage extends BaseMessage {
    type: 'phone_input';
    question: string;
    placeholder?: string;
    stepId: string;
    required?: boolean;
}

// Address Input (Multi-line)
export interface AddressInputMessage extends BaseMessage {
    type: 'address_input';
    question: string;
    placeholder?: string;
    stepId: string;
    required?: boolean;
}

// Website Input
export interface WebsiteInputMessage extends BaseMessage {
    type: 'website_input';
    question: string;
    placeholder?: string;
    stepId: string;
    required?: boolean;
}

// Number input question message
export interface NumberInputMessage extends BaseMessage {
    type: 'number_input';
    question: string;
    placeholder?: string;
    stepId: string;
    min?: number;
    max?: number;
}

// Multiple choice question message
export interface MultipleChoiceOption {
    title: string;
    description?: string;
    price?: string;
    icon?: string;
}

export interface MultipleChoiceMessage extends BaseMessage {
    type: 'multiple_choice';
    question: string;
    options: MultipleChoiceOption[];
    stepId: string;
    multiple?: boolean;
}

// Date input question message
export interface DateInputMessage extends BaseMessage {
    type: 'date_input';
    question: string;
    stepId: string;
    minDate?: Date;
    maxDate?: Date;
}

// File upload question message
export interface FileUploadMessage extends BaseMessage {
    type: 'file_upload';
    question: string;
    stepId: string;
    acceptedTypes?: string[];
    maxSize?: number; // in bytes
}

// User response message (answer to any question)
export interface UserResponseMessage extends BaseMessage {
    type: 'user_response';
    value: string | number | Date | File | string[] | MultipleChoiceOption | MultipleChoiceOption[];
    stepId?: string;
}

// System info message (non-interactive)
export interface SystemInfoMessage extends BaseMessage {
    type: 'system_info';
    text: string;
}

// Typing indicator
export interface TypingMessage extends BaseMessage {
    type: 'typing';
}

// End screen / success message
export interface EndScreenMessage extends BaseMessage {
    type: 'end_screen';
    title: string;
    message?: string;
    showConfetti?: boolean;
    animationType?: 'fade' | 'zoom' | 'bounce';
}

// External browser redirect
export interface ExternalBrowserMessage extends BaseMessage {
    type: 'external_browser';
    url: string;
    title?: string;
    message?: string;
    buttonText?: string;
}

// Payment Input Question
export interface PaymentInputMessage extends BaseMessage {
    type: 'payment_input';
    question: string;
    stepId: string;
    amount: number;
    currency: string;
    description?: string;
    publishableKey: string;
    clientSecret?: string;
}

// Union type for all messages
export type ChatMessage =
    | ServiceSelectionMessage
    | TextInputMessage
    | EmailInputMessage
    | PhoneInputMessage
    | AddressInputMessage
    | WebsiteInputMessage
    | NumberInputMessage
    | MultipleChoiceMessage
    | DateInputMessage
    | FileUploadMessage
    | UserResponseMessage
    | SystemInfoMessage
    | TypingMessage
    | EndScreenMessage
    | ExternalBrowserMessage
    | PaymentInputMessage;

// Type guards
export function isServiceSelectionMessage(msg: ChatMessage): msg is ServiceSelectionMessage {
    return msg.type === 'service_selection';
}
export function isTextInputMessage(msg: ChatMessage): msg is TextInputMessage {
    return msg.type === 'text_input';
}
export function isEmailInputMessage(msg: ChatMessage): msg is EmailInputMessage {
    return msg.type === 'email_input';
}
export function isPhoneInputMessage(msg: ChatMessage): msg is PhoneInputMessage {
    return msg.type === 'phone_input';
}
export function isAddressInputMessage(msg: ChatMessage): msg is AddressInputMessage {
    return msg.type === 'address_input';
}
export function isWebsiteInputMessage(msg: ChatMessage): msg is WebsiteInputMessage {
    return msg.type === 'website_input';
}
export function isNumberInputMessage(msg: ChatMessage): msg is NumberInputMessage {
    return msg.type === 'number_input';
}
export function isMultipleChoiceMessage(msg: ChatMessage): msg is MultipleChoiceMessage {
    return msg.type === 'multiple_choice';
}
export function isDateInputMessage(msg: ChatMessage): msg is DateInputMessage {
    return msg.type === 'date_input';
}
export function isFileUploadMessage(msg: ChatMessage): msg is FileUploadMessage {
    return msg.type === 'file_upload';
}
export function isUserResponseMessage(msg: ChatMessage): msg is UserResponseMessage {
    return msg.type === 'user_response';
}
export function isSystemInfoMessage(msg: ChatMessage): msg is SystemInfoMessage {
    return msg.type === 'system_info';
}
export function isTypingMessage(msg: ChatMessage): msg is TypingMessage {
    return msg.type === 'typing';
}
export function isEndScreenMessage(msg: ChatMessage): msg is EndScreenMessage {
    return msg.type === 'end_screen';
}
export function isExternalBrowserMessage(msg: ChatMessage): msg is ExternalBrowserMessage {
    return msg.type === 'external_browser';
}
export function isPaymentInputMessage(msg: ChatMessage): msg is PaymentInputMessage {
    return msg.type === 'payment_input';
}

// Validation functions
export function validateTextInput(value: string, minLength?: number, maxLength?: number): { valid: boolean; error?: string } {
    if (!value || value.trim().length === 0) {
        return { valid: false, error: 'Please enter a value' };
    }
    if (minLength && value.length < minLength) {
        return { valid: false, error: `Minimum ${minLength} characters requires` };
    }
    if (maxLength && value.length > maxLength) {
        return { valid: false, error: `Maximum ${maxLength} characters allowed` };
    }
    return { valid: true };
}

export function validateEmail(value: string, required: boolean = true): { valid: boolean; error?: string } {
    if (!value || value.trim().length === 0) {
        if (!required) return { valid: true };
        return { valid: false, error: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return { valid: false, error: 'Please enter a valid email address' };
    }
    return { valid: true };
}

export function validatePhone(value: string, required: boolean = true): { valid: boolean; error?: string } {
    if (!value || value.trim().length === 0) {
        if (!required) return { valid: true };
        return { valid: false, error: 'Phone number is required' };
    }
    // Basic validation, detailed validation should happen in the component or via a library

    if (value.length < 5) { // minimal length check
        return { valid: false, error: 'Please enter a valid phone number' };
    }
    return { valid: true };
}

export function validateWebsite(value: string, required: boolean = true): { valid: boolean; error?: string } {
    if (!value || value.trim().length === 0) {
        if (!required) return { valid: true };
        return { valid: false, error: 'Website is required' };
    }

    // specific regex to ensure domain structure (e.g. example.com)
    // 1. Optional protocol (http:// or https://)
    // 2. Domain name (including subdomains)
    // 3. TLD (at least 2 chars)
    // 4. Optional port and path
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;

    if (!urlRegex.test(value)) {
        return { valid: false, error: 'Please enter a valid website (e.g. example.com)' };
    }

    return { valid: true };
}

export function validateNumberInput(value: string, min?: number, max?: number): { valid: boolean; error?: string } {
    const num = parseFloat(value);
    if (isNaN(num)) {
        return { valid: false, error: 'Please enter a valid number' };
    }
    if (min !== undefined && num < min) {
        return { valid: false, error: `Value must be at least ${min}` };
    }
    if (max !== undefined && num > max) {
        return { valid: false, error: `Value must be at most ${max}` };
    }
    return { valid: true };
}

export function validateFileUpload(
    file: File,
    acceptedTypes?: string[],
    maxSize?: number
): { valid: boolean; error?: string } {
    if (acceptedTypes && acceptedTypes.length > 0) {
        const fileType = file.type;
        const isAccepted = acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
                return fileType.startsWith(type.replace('/*', ''));
            }
            return fileType === type;
        });
        if (!isAccepted) {
            return { valid: false, error: `File type not accepted. Accepted types: ${acceptedTypes.join(', ')}` };
        }
    }
    if (maxSize && file.size > maxSize) {
        return { valid: false, error: `File size exceeds maximum of ${(maxSize / 1024 / 1024).toFixed(2)}MB` };
    }
    return { valid: true };
}
