export type StepType =
    | 'text'
    | 'email'
    | 'phone'
    | 'address'
    | 'website'
    | 'number'
    | 'date'
    | 'file'
    | 'service_selection'
    | 'multiple_choice'
    | 'end_screen'
    | 'external_browser'
    | 'payment';

export interface BaseWorkflowStep {
    id: string;
    stepType: StepType;
    question: string;
}

export interface TextStep extends BaseWorkflowStep {
    stepType: 'text';
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    multiline?: boolean;
}

export interface EmailStep extends BaseWorkflowStep {
    stepType: 'email';
    placeholder?: string;
    required?: boolean;
}

export interface PhoneStep extends BaseWorkflowStep {
    stepType: 'phone';
    placeholder?: string;
    required?: boolean;
}

export interface AddressStep extends BaseWorkflowStep {
    stepType: 'address';
    placeholder?: string;
    required?: boolean;
}

export interface WebsiteStep extends BaseWorkflowStep {
    stepType: 'website';
    placeholder?: string;
    required?: boolean;
}

export interface NumberStep extends BaseWorkflowStep {
    stepType: 'number';
    placeholder?: string;
    min?: number;
    max?: number;
}

export interface DateStep extends BaseWorkflowStep {
    stepType: 'date';
    minDate?: string; // ISO date string
    maxDate?: string;
}

export interface FileStep extends BaseWorkflowStep {
    stepType: 'file';
    acceptedTypes?: string[];
    maxSize?: number;
}

export interface MultipleChoiceOption {
    title: string;
    description?: string;
    price?: string;
    icon?: string;
}

export interface MultipleChoiceStep extends BaseWorkflowStep {
    stepType: 'multiple_choice';
    options: MultipleChoiceOption[];
    multiple?: boolean;
}

export interface ServiceSelectionStep extends BaseWorkflowStep {
    stepType: 'service_selection';
    // Services are usually derived from the global services list, but could be specific here
}

export interface EndScreenStep extends BaseWorkflowStep {
    stepType: 'end_screen';
    title: string;
    message?: string;
    showConfetti?: boolean;
    animationType?: 'fade' | 'zoom' | 'bounce';
}

export interface ExternalBrowserStep extends BaseWorkflowStep {
    stepType: 'external_browser';
    url: string;
    title?: string;
    message?: string;
    buttonText?: string;
}

export interface PaymentStep extends BaseWorkflowStep {
    stepType: 'payment';
    paymentType: 'fixed' | 'variable' | 'selection';
    amount: number;
    currency: string;
    description?: string;
    linkedStepId?: string; // For 'selection' type
}

export type WorkflowStep =
    | TextStep
    | EmailStep
    | PhoneStep
    | AddressStep
    | WebsiteStep
    | NumberStep
    | DateStep
    | FileStep
    | MultipleChoiceStep
    | ServiceSelectionStep
    | EndScreenStep
    | ExternalBrowserStep
    | PaymentStep;

export interface WorkflowData {
    [serviceTitle: string]: WorkflowStep[];
}

// Service definition
export interface Service {
    id: string;
    title: string;
    [key: string]: unknown;
}

// Contact info grouped under properties
export interface ContactInfo {
    type?: string;
    email?: string;
    profile?: string;
    phone?: string;
    website?: string;
    calendarLink?: string;
}

export interface SocialLinks {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    [key: string]: string | undefined;
}

// Form properties
export interface FormProperties {
    description?: string;
    title?: string;
    contactInfo?: ContactInfo;
    tags?: string[];
    socialLinks?: SocialLinks;
    [key: string]: unknown;
}

// Complete form data structure
export interface FormData {
    properties: FormProperties;
    services: Service[];
    workflows: WorkflowData;
}

// Organisation type (from database)
export interface Organisation {
    _id: string;
    _creationTime: number;
    name: string;
    handle: string;
    owner: string;
    image?: string;
    plan: string;
    subscriptionStatus?: string;
    formId: string;
}

// Team Management Types
export type TeamRole = 'owner' | 'editor' | 'viewer';

export type TeamMemberStatus = 'active' | 'inactive';

export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface TeamInvite {
    _id: string;
    _creationTime: number;
    organisationId: string;
    invitedBy: string;
    role: TeamRole;
    allowedServices?: string[]; // Service IDs for member role. undefined = All.
    token: string;
    status: InviteStatus;
    expiresAt: number;
}

export interface TeamMember {
    _id: string;
    organisationId: string;
    userId: string;
    role: TeamRole;
    status: TeamMemberStatus;
    allowedServices?: string[]; // Service IDs for member role. undefined = All.
}
