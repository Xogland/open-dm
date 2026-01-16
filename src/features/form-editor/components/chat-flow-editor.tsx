"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDaysIcon, FileTextIcon, SmartphoneIcon,
  PlusIcon, Trash2Icon, ZapIcon, Settings2Icon,
  UserIcon,
  MailIcon,
  MapPinIcon,
  GlobeIcon,
  AlignLeftIcon,
  HashIcon,
  ListChecksIcon,
  StarIcon, HeartIcon, TrophyIcon, ThumbsUpIcon, SmileIcon,
  ShoppingBagIcon, GiftIcon, CrownIcon, TargetIcon, RocketIcon,
  LightbulbIcon, FlagIcon, MusicIcon, CameraIcon, VideoIcon,
  MicIcon, BriefcaseIcon, CoffeeIcon, BeerIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  LockIcon,
  CreditCardIcon,
  CoinsIcon,
  SparklesIcon,
  LayersIcon,
  InfoIcon,
  Loader2,
  GripVerticalIcon,
  ArrowDownIcon,
  CheckCircle2Icon,
  MessageSquareIcon,
  ZoomOutIcon,
  ZoomInIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { WorkflowData, WorkflowStep, StepType, TextStep, EmailStep, PhoneStep, AddressStep, WebsiteStep, NumberStep, DateStep, FileStep, EndScreenStep, ExternalBrowserStep, MultipleChoiceStep, MultipleChoiceOption, PaymentStep } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { isAdvancedWorkflowType } from "@/features/subscription/config/plan-config";
import { SubscriptionLimitModal } from "@/features/subscription/components/subscription-limit-modal";
import { Id } from "@/convex/_generated/dataModel";
import { StripeSettingsForm } from "@/features/organization/components/stripe-settings-form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// User-friendly lists
const STEP_TEMPLATES: { type: StepType; label: string; icon: React.ElementType; description: string; defaultQuestion: string }[] = [
  { type: "text", label: "Contact Name", icon: UserIcon, description: "Ask for the user's name", defaultQuestion: "What is your name?" },
  { type: "email", label: "Email", icon: MailIcon, description: "Collect email address", defaultQuestion: "What is your email address?" },
  { type: "phone", label: "Phone", icon: SmartphoneIcon, description: "Collect phone number", defaultQuestion: "What is your phone number?" },
  { type: "address", label: "Address", icon: MapPinIcon, description: "Collect physical address", defaultQuestion: "What is your address?" },
  { type: "website", label: "Website", icon: GlobeIcon, description: "Collect website URL", defaultQuestion: "What is your website URL?" },
  { type: "text", label: "Message", icon: AlignLeftIcon, description: "Long text message", defaultQuestion: "How can we help you?" },
  { type: "number", label: "Number", icon: HashIcon, description: "Collect a numeric value", defaultQuestion: "Enter a number" },
  { type: "date", label: "Date", icon: CalendarDaysIcon, description: "Select a date", defaultQuestion: "Select a date" },
  { type: "file", label: "File Upload", icon: FileTextIcon, description: "Request a file attachment", defaultQuestion: "Please upload a file" },
  { type: "multiple_choice", label: "Multiple Choice", icon: ListChecksIcon, description: "Select from options", defaultQuestion: "Please make a selection" },
  { type: "external_browser", label: "External URL", icon: ExternalLinkIcon, description: "Redirect to another website", defaultQuestion: "External Redirect" },
  { type: "payment", label: "Payment", icon: CreditCardIcon, description: "Accept a payment", defaultQuestion: "Please complete the payment" },
];

export const getEmptyStep = (template: typeof STEP_TEMPLATES[0]): WorkflowStep => {
  const base = {
    id: `step_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    question: template.defaultQuestion,
  };

  switch (template.type) {
    case 'text':
      return { ...base, stepType: 'text', placeholder: "Your answer...", multiline: template.label === 'Message' } as TextStep;
    case 'email':
      return { ...base, stepType: 'email', placeholder: "name@example.com", required: true } as EmailStep;
    case 'phone':
      return { ...base, stepType: 'phone', placeholder: "+1 234 567 8900", required: true } as PhoneStep;
    case 'address':
      return { ...base, stepType: 'address', placeholder: "123 Main St...", required: true } as AddressStep;
    case 'website':
      return { ...base, stepType: 'website', placeholder: "https://example.com", required: true } as WebsiteStep;
    case 'number':
      return { ...base, stepType: 'number', placeholder: "0", min: 0 } as NumberStep;
    case 'date':
      return { ...base, stepType: 'date' } as DateStep;
    case 'file':
      return { ...base, stepType: 'file', maxSize: 5 * 1024 * 1024, acceptedTypes: [] } as FileStep;
    case 'multiple_choice':
      return {
        ...base, stepType: 'multiple_choice', options: [
          { title: 'Option 1', description: '', price: '', icon: '' },
          { title: 'Option 2', description: '', price: '', icon: '' }
        ]
      } as MultipleChoiceStep;
    case 'external_browser':
      return {
        ...base,
        stepType: 'external_browser',
        url: 'https://example.com',
        title: 'Thank you!',
        message: 'Click the button below to continue.',
        buttonText: 'Continue'
      } as ExternalBrowserStep;
    case 'payment':
      return {
        ...base,
        stepType: 'payment',
        paymentType: 'fixed',
        amount: 10,
        currency: 'USD',
        description: 'Payment description'
      } as PaymentStep;
    default:
      return { ...base, stepType: 'text' } as TextStep;
  }
};

const getEndScreenStep = (): EndScreenStep => ({
  id: `end_${Date.now()}`,
  stepType: 'end_screen',
  question: 'End Screen', // Internal label
  title: 'Thank you!',
  message: 'Your submission has been received.',
  showConfetti: true,
  animationType: 'fade'
});

// Type definition for update values
type StepValue = string | number | boolean | undefined | string[] | MultipleChoiceOption[] | null;


// --- Property Sub-Components ---

const CommonProps = ({ step, update, readOnly }: { step: WorkflowStep; update: (f: string, v: StepValue) => void; readOnly?: boolean }) => (
  <div className="space-y-4">
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Question / Label</Label>
      <Textarea
        value={step.question}
        onChange={(e) => update('question', e.target.value)}
        className="min-h-[80px] text-sm bg-transparent border-border/60 focus:border-primary transition-all p-3"
        placeholder="e.g. What is your name?"
        disabled={readOnly}
      />
    </div>
    {step.stepType !== 'end_screen' && step.stepType !== 'date' && step.stepType !== 'file' && (step as TextStep).placeholder !== undefined && (
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Placeholder</Label>
        <Input
          value={(step as TextStep).placeholder || ''}
          onChange={(e) => update('placeholder', e.target.value)}
          placeholder="e.g. Type your answer here..."
          className="h-9 text-sm bg-transparent border-border/60 focus:border-primary"
          disabled={readOnly}
        />
      </div>
    )}
    <Separator className="my-2 opacity-40" />
  </div>
);

const TextProps = ({ step, update, readOnly }: { step: TextStep; update: (f: string, v: StepValue) => void; readOnly?: boolean }) => (
  <div className="space-y-4 pt-2">
    <div className="flex items-center justify-between">
      <Typography variant="caption" className="font-semibold text-xs">Multiline Input</Typography>
      <Switch checked={step.multiline} onCheckedChange={(c) => update('multiline', c)} disabled={readOnly} />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase text-muted-foreground font-bold">Min Length</Label>
        <Input
          type="number"
          value={step.minLength || ''}
          onChange={(e) => update('minLength', parseInt(e.target.value) || undefined)}
          className="h-8 text-xs bg-transparent border-border/60"
          disabled={readOnly}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase text-muted-foreground font-bold">Max Length</Label>
        <Input
          type="number"
          value={step.maxLength || ''}
          onChange={(e) => update('maxLength', parseInt(e.target.value) || undefined)}
          className="h-8 text-xs bg-transparent border-border/60"
          disabled={readOnly}
        />
      </div>
    </div>
  </div>
);

const RequiredProp = ({ step, update, readOnly }: { step: EmailStep | PhoneStep | AddressStep | WebsiteStep; update: (f: string, v: StepValue) => void; readOnly?: boolean }) => (
  <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
    <div className="flex items-center gap-2 text-primary">
      <SparklesIcon className="w-3.5 h-3.5" />
      <Typography variant="caption" className="font-bold text-xs uppercase tracking-tight">Required</Typography>
    </div>
    <Switch checked={step.required} onCheckedChange={(c) => update('required', c)} disabled={readOnly} />
  </div>
);

const NumberProps = ({ step, update, readOnly }: { step: NumberStep; update: (f: string, v: StepValue) => void; readOnly?: boolean }) => (
  <div className="space-y-3 pt-2">
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase text-muted-foreground font-bold">Min Value</Label>
        <Input
          type="number"
          value={step.min || ''}
          onChange={(e) => update('min', parseFloat(e.target.value) || undefined)}
          className="h-8 text-xs bg-transparent border-border/60"
          disabled={readOnly}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase text-muted-foreground font-bold">Max Value</Label>
        <Input
          type="number"
          value={step.max || ''}
          onChange={(e) => update('max', parseFloat(e.target.value) || undefined)}
          className="h-8 text-xs bg-transparent border-border/60"
          disabled={readOnly}
        />
      </div>
    </div>
  </div>
);

const DateProps = () => (
  <div className="pt-2">
    <div className="p-3 rounded-lg bg-muted/20 border border-border/40 flex items-center gap-2">
      <InfoIcon className="w-4 h-4 text-muted-foreground" />
      <Typography variant="caption" className="text-[11px] text-muted-foreground">
        Standard browser date picker will be used.
      </Typography>
    </div>
  </div>
);

const FileProps = ({ step, update, readOnly }: { step: FileStep; update: (f: string, v: StepValue) => void; readOnly?: boolean }) => (
  <div className="space-y-3 pt-2">
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase text-muted-foreground font-bold">Max Size (MB)</Label>
      <Input
        type="number"
        value={(step.maxSize || 0) / (1024 * 1024)}
        onChange={(e) => update('maxSize', (parseFloat(e.target.value) || 5) * 1024 * 1024)}
        className="h-8 text-xs bg-transparent border-border/60"
        disabled={readOnly}
      />
    </div>
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase text-muted-foreground font-bold">Accepted Types</Label>
      <Input
        placeholder="e.g. .pdf, .jpg, .png"
        value={step.acceptedTypes?.join(', ') || ''}
        onChange={(e) => update('acceptedTypes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
        className="h-8 text-xs bg-transparent border-border/60"
        disabled={readOnly}
      />
    </div>
  </div>
);

const EndScreenProps = ({ step, update, readOnly }: { step: EndScreenStep; update: (f: string, v: StepValue) => void; readOnly?: boolean }) => (
  <div className="space-y-5">
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase text-muted-foreground font-bold">Title</Label>
      <Input
        value={step.title}
        onChange={(e) => update('title', e.target.value)}
        className="h-9 text-sm font-bold bg-transparent border-border/60"
        disabled={readOnly}
      />
    </div>
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase text-muted-foreground font-bold">Message</Label>
      <Textarea
        value={step.message}
        onChange={(e) => update('message', e.target.value)}
        className="min-h-[100px] text-sm bg-transparent border-border/60 resize-none p-3"
        disabled={readOnly}
      />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-3.5 h-3.5 text-primary" />
        <Typography variant="caption" className="font-semibold text-xs text-foreground/80">Success Confetti</Typography>
      </div>
      <Switch checked={step.showConfetti} onCheckedChange={(c) => update('showConfetti', c)} disabled={readOnly} />
    </div>
  </div>
);

const ExternalBrowserProps = ({ step, update, readOnly }: { step: ExternalBrowserStep; update: (f: string, v: StepValue) => void; readOnly?: boolean }) => (
  <div className="space-y-5">
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase text-muted-foreground font-bold">Redirect URL</Label>
      <Input
        value={step.url}
        onChange={(e) => update('url', e.target.value)}
        placeholder="https://example.com"
        type="url"
        className="h-9 text-xs bg-transparent border-border/60"
        disabled={readOnly}
      />
    </div>
    <div className="p-3 rounded-lg bg-muted/20 border border-border/40 flex items-center gap-2">
      <InfoIcon className="w-4 h-4 text-muted-foreground" />
      <Typography variant="caption" className="text-[11px] text-muted-foreground">
        The user will be automatically redirected to this URL after submission.
      </Typography>
    </div>
  </div>
);

const PaymentProps = ({
  step,
  update,
  readOnly,
  isStripeConfigured,
  allSteps = []
}: {
  step: PaymentStep;
  update: (f: string, v: StepValue) => void;
  readOnly?: boolean;
  isStripeConfigured?: boolean;
  allSteps?: WorkflowStep[];
}) => {
  const selectionSteps = allSteps.filter(s => s.stepType === 'multiple_choice' && s.id !== step.id);

  return (
    <div className="space-y-6 pt-2">
      {!isStripeConfigured && (
        <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10 flex items-center gap-2">
          <InfoIcon className="w-3.5 h-3.5 text-destructive" />
          <Typography variant="caption" className="text-[11px] text-destructive leading-tight font-medium">
            Connect Stripe in Organization Settings.
          </Typography>
        </div>
      )}

      {/* Payment Strategy Selection */}
      <div className="space-y-2">
        <Label className="text-[10px] uppercase text-muted-foreground font-bold">Payment Mode</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={step.paymentType === 'fixed' || !step.paymentType ? "default" : "outline"}
            size="sm"
            onClick={() => update('paymentType', 'fixed')}
            className="flex-1 h-8 text-[11px] gap-1.5"
            disabled={readOnly}
          >
            <CoinsIcon className="w-3.5 h-3.5" />
            Fixed
          </Button>
          <Button
            type="button"
            variant={step.paymentType === 'selection' ? "default" : "outline"}
            size="sm"
            onClick={() => update('paymentType', 'selection')}
            className="flex-1 h-8 text-[11px] gap-1.5"
            disabled={readOnly}
          >
            <LayersIcon className="w-3.5 h-3.5" />
            Dynamic
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {(step.paymentType === 'fixed' || !step.paymentType) ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground font-bold">Amount</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                <Input
                  type="number"
                  value={step.amount}
                  onChange={(e) => update('amount', parseFloat(e.target.value) || 0)}
                  disabled={readOnly}
                  className="pl-6 h-8 text-xs bg-transparent border-border/60"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground font-bold">Currency</Label>
              <Select value={step.currency} onValueChange={(v) => update('currency', v)} disabled={readOnly}>
                <SelectTrigger className="h-8 text-xs bg-transparent border-border/60">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground font-bold">Price Source Step</Label>
            <Select
              value={step.linkedStepId}
              onValueChange={(v) => update('linkedStepId', v)}
              disabled={readOnly || selectionSteps.length === 0}
            >
              <SelectTrigger className="h-9 text-xs bg-transparent border-border/60">
                <SelectValue placeholder={selectionSteps.length === 0 ? "No choice steps found" : "Select question..."} />
              </SelectTrigger>
              <SelectContent>
                {selectionSteps.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.question.substring(0, 30)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1.5 pt-1">
          <Label className="text-[10px] uppercase text-muted-foreground font-bold">Invoice Label</Label>
          <Input
            value={step.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="e.g. Service Fee"
            disabled={readOnly}
            className="h-8 text-xs bg-transparent border-border/60"
          />
        </div>
      </div>
    </div>
  );
};


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

const IconPicker = ({ selected, readOnly }: { selected?: string; readOnly?: boolean }) => {
  return (
    <PopoverTrigger asChild>
      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={readOnly}>
        {selected && ICON_MAP[selected] ? (
          React.createElement(ICON_MAP[selected], { className: "w-4 h-4" })
        ) : (
          <PlusIcon className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>
    </PopoverTrigger>
  );
};

const MultipleChoiceProps = ({ step, update, readOnly }: { step: MultipleChoiceStep; update: (f: string, v: StepValue) => void; readOnly?: boolean }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addOption = () => update('options', [...step.options, {
    title: `Option ${step.options.length + 1}`,
    description: '',
    price: '',
    icon: ''
  }]);
  const removeOption = (index: number) => update('options', step.options.filter((_, i) => i !== index));
  const updateOption = (index: number, field: keyof MultipleChoiceOption, val: string | number | undefined) => {
    const newOptions = [...step.options];
    newOptions[index] = { ...newOptions[index], [field]: val };
    update('options', newOptions);
  };

  const handlePriceBlur = (index: number) => {
    const opt = step.options[index];
    if (typeof opt !== 'object' || !opt.price) return;

    // Check if price has a currency symbol (simplified check)
    if (!/^[\D]/.test(opt.price)) {
      updateOption(index, 'price', `$${opt.price}`);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <Typography variant="caption" className="font-semibold">Allow Multiple Selection</Typography>
        <Switch checked={step.multiple || false} onCheckedChange={(c) => update('multiple', c)} disabled={readOnly} />
      </div>
      <div className="space-y-4">
        <Typography variant="caption" className="font-semibold">Options</Typography>
        <div className="space-y-3">
          {step.options.map((opt, i) => {
            const isExpanded = expandedIndex === i;
            // Handle legacy strings if any exist in DB
            const title = typeof opt === 'string' ? opt : opt.title;
            const description = typeof opt === 'object' ? opt.description : '';
            const price = typeof opt === 'object' ? opt.price : '';
            const icon = typeof opt === 'object' ? opt.icon : '';

            return (
              <div key={i} className="border rounded-md p-3 bg-card transition-all">
                <div className="flex items-center gap-2">
                  {/* Icon Picker */}
                  <Popover>
                    <IconPicker selected={icon} readOnly={readOnly} />
                    <PopoverContent className="w-64 p-2 grid grid-cols-5 gap-2">
                      {Object.entries(ICON_MAP).map(([name, Icon]) => (
                        <button
                          key={name}
                          onClick={() => updateOption(i, 'icon', name)}
                          disabled={readOnly}
                          className={cn("p-2 rounded hover:bg-muted flex items-center justify-center", icon === name ? "bg-primary/10 text-primary" : "")}
                          title={name}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      ))}
                      <button
                        onClick={() => updateOption(i, 'icon', '')}
                        disabled={readOnly}
                        className="p-2 rounded hover:bg-muted flex items-center justify-center text-xs text-muted-foreground col-span-5 border-t mt-2"
                      >
                        No Icon
                      </button>
                    </PopoverContent>
                  </Popover>

                  <Input
                    value={title}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) updateOption(i, 'title', e.target.value);
                    }}
                    className="h-8 flex-1"
                    placeholder="Option Title"
                    disabled={readOnly}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedIndex(isExpanded ? null : i)}>
                    {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeOption(i)} disabled={step.options.length <= 1 || readOnly}>
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-3 pl-10 border-l-2 ml-4">
                    <div>
                      <Typography variant="caption" className="text-xs font-semibold">Description (Optional)</Typography>
                      <Textarea
                        value={description || ''}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) updateOption(i, 'description', e.target.value);
                        }}
                        className="h-16 mt-1 text-xs"
                        placeholder="Add details..."
                        disabled={readOnly}
                      />
                      <div className="text-[10px] text-muted-foreground text-right">{(description?.length || 0)}/100</div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <Typography variant="caption" className="text-xs font-semibold">Price</Typography>
                        <Input
                          value={price || ''}
                          onChange={(e) => updateOption(i, 'price', e.target.value)}
                          onBlur={() => handlePriceBlur(i)}
                          className="h-7 mt-1 text-xs"
                          placeholder="$0.00"
                          title="Enter price (e.g. $10 or €5). Defaults to $."
                          disabled={readOnly}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Button variant="outline" size="sm" onClick={addOption} className="w-full mt-2" disabled={readOnly}>
          <PlusIcon className="w-4 h-4 mr-2" /> Add Option
        </Button>
      </div>
    </div>
  );
};


// --- Panels ---

const ServiceListPanel: React.FC<{ services: { title: string }[]; selected: string; onSelect: (s: string) => void }> = ({ services, selected, onSelect }) => (
  <div className="w-64 border-r border-border bg-card flex flex-col h-full flex-shrink-0">
    <div className="h-14 px-6 border-b border-border bg-muted/5 flex items-center">
      <Typography variant="caption" className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 text-muted-foreground">
        <ZapIcon className="w-3.5 h-3.5 text-primary" /> Services
      </Typography>
    </div>
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {services.map((s) => (
          <button
            key={s.title}
            onClick={() => onSelect(s.title)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
              selected === s.title ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {s.title}
            {selected === s.title && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>
    </ScrollArea>
  </div>
);

const PropertiesPanel: React.FC<{
  activeStep: WorkflowStep | undefined;
  onUpdate: (s: WorkflowStep) => void;
  onDelete: (id: string) => void;
  allSteps?: WorkflowStep[];
  readOnly?: boolean;
  isStripeConfigured?: boolean;
}> = ({ activeStep, onUpdate, onDelete, allSteps, readOnly, isStripeConfigured }) => {
  if (!activeStep) {
    return (
      <div className="w-80 border-l border-border bg-card flex flex-col items-center justify-start text-center text-muted-foreground h-full flex-shrink-0">
        <div className="h-14 w-full px-6 border-b border-border flex justify-between items-center bg-muted/5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Settings2Icon className="w-3.5 h-3.5" />
            </div>
            <Typography variant="caption" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Properties</Typography>
          </div>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
            <Settings2Icon className="w-8 h-8 opacity-20" />
          </div>
          <Typography variant="subheading" className="font-semibold text-foreground/80 mb-2">Step Properties</Typography>
          <Typography variant="caption" className="max-w-[180px] leading-relaxed">
            Select any step from the editor to customize its behavior and appearance.
          </Typography>
        </div>
      </div>
    );
  }

  const update = (field: string, value: StepValue) => onUpdate({ ...activeStep, [field]: value } as WorkflowStep);

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full flex-shrink-0 animate-in slide-in-from-right-4 duration-300">
      <div className="h-14 px-6 border-b border-border flex justify-between items-center bg-muted/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <Settings2Icon className="w-3.5 h-3.5" />
          </div>
          <Typography variant="caption" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Properties</Typography>
        </div>
        {activeStep.stepType !== 'end_screen' && activeStep.stepType !== 'external_browser' && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full" onClick={() => onDelete(activeStep.id)} disabled={readOnly}>
            <Trash2Icon className="w-4 h-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] uppercase font-bold tracking-tighter">
              {activeStep.stepType.replace('_', ' ')}
            </Badge>
          </div>

          {activeStep.stepType === 'end_screen' ? (
            <EndScreenProps step={activeStep as EndScreenStep} update={update} readOnly={readOnly} />
          ) : activeStep.stepType === 'external_browser' ? (
            <ExternalBrowserProps step={activeStep as ExternalBrowserStep} update={update} readOnly={readOnly} />
          ) : (
            <>
              <CommonProps step={activeStep} update={update} readOnly={readOnly} />

              {activeStep.stepType === 'text' && <TextProps step={activeStep as TextStep} update={update} readOnly={readOnly} />}
              {(activeStep.stepType === 'email' || activeStep.stepType === 'phone' || activeStep.stepType === 'address' || activeStep.stepType === 'website') &&
                <RequiredProp step={activeStep} update={update} readOnly={readOnly} />
              }
              {activeStep.stepType === 'number' && <NumberProps step={activeStep as NumberStep} update={update} readOnly={readOnly} />}
              {activeStep.stepType === 'date' && <DateProps />}
              {activeStep.stepType === 'file' && <FileProps step={activeStep as FileStep} update={update} readOnly={readOnly} />}
              {activeStep.stepType === 'multiple_choice' && <MultipleChoiceProps step={activeStep as MultipleChoiceStep} update={update} readOnly={readOnly} />}
              {activeStep.stepType === 'payment' && (
                <PaymentProps
                  step={activeStep as PaymentStep}
                  update={update}
                  readOnly={readOnly}
                  isStripeConfigured={isStripeConfigured}
                  allSteps={allSteps}
                />
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

interface ChatFlowEditorProps {
  services: { title: string }[];
  workflows: WorkflowData;
  onWorkflowsChange: (data: WorkflowData) => void;
  readOnly?: boolean;
  plan?: string;
  organisationId?: Id<"organisations">;
}

// --- Sub-components ---

interface SortableStepItemProps {
  step: WorkflowStep;
  index: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  Icon: React.ElementType;
  readOnly?: boolean;
  isStripeConfigured?: boolean;
}

const SortableStepItem = ({ step, index, isActive, onSelect, onDelete, Icon, readOnly, isStripeConfigured }: SortableStepItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full max-w-xl group outline-none">
      <Card
        className={cn(
          "relative mb-4 cursor-pointer transition-all hover:shadow-md border-l-4",
          isActive ? "border-l-primary ring-1 ring-primary/20" : "border-l-transparent"
        )}
        onClick={(e) => { e.stopPropagation(); onSelect(step.id); }}
      >
        <CardContent className="p-4 flex items-start gap-3">
          <div
            {...attributes}
            {...listeners}
            className={cn("p-1 -ml-1 hover:bg-muted rounded touch-none", !readOnly && "cursor-grab active:cursor-grabbing")}
          >
            <GripVerticalIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className={cn("p-2 rounded-md", isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <Typography variant="caption" className="text-xs text-muted-foreground mb-1 block">
                Step {index + 1}
              </Typography>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mr-2 -mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={readOnly}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(step.id);
                }}
              >
                <Trash2Icon className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Typography variant="body" className="font-medium text-sm line-clamp-2">{step.question}</Typography>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center -mt-2 mb-2">
        <ArrowDownIcon className="w-4 h-4 text-muted-foreground/30" />
      </div>

      {step.stepType === 'payment' && !isStripeConfigured && (
        <div className="flex justify-center -mt-2 mb-4">
          <Badge variant="destructive" className="animate-pulse flex items-center gap-1 cursor-pointer" onClick={() => (window as unknown as { openStripeModal?: () => void }).openStripeModal?.()}>
            <LockIcon className="w-3 h-3" /> Stripe keys missing! Click to configure.
          </Badge>
        </div>
      )}
    </div>
  );
};

export default function ChatFlowEditor({ services, workflows, onWorkflowsChange, readOnly, plan = "free", organisationId }: ChatFlowEditorProps) {
  const [selectedService, setSelectedService] = useState(services[0]?.title || "General");
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const organisation = useQuery(api.organisation.getOrganisation,
    organisationId ? { id: organisationId } : "skip"
  );

  const isStripeConfigured = !!organisation?.stripeConfig?.publishableKey;

  useEffect(() => {
    (window as unknown as { openStripeModal: () => void }).openStripeModal = () => setStripeModalOpen(true);
    return () => { delete (window as unknown as { openStripeModal?: () => void }).openStripeModal; };
  }, []);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ctrl+Wheel Zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation(); // prevent browser zoom
        const delta = e.deltaY * -0.0005;
        setZoom(z => Math.min(Math.max(0.2, z + delta), 2));
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // Ensure selected service exists in workflow data with an end screen or external browser
  const currentWorkflowRaw = useMemo(() => workflows[selectedService] || [], [workflows, selectedService]);

  // Memoized standardized workflow with enforced End Screen (unless external browser exists)
  const steps = useMemo(() => {
    const hasEndScreen = currentWorkflowRaw.some(s => s.stepType === 'end_screen');
    const hasExternalBrowser = currentWorkflowRaw.some(s => s.stepType === 'external_browser');

    // If external browser exists, don't show end screen
    if (hasExternalBrowser) {
      return currentWorkflowRaw.filter(s => s.stepType !== 'end_screen');
    }

    // If no end screen and no external browser, add end screen
    if (!hasEndScreen) {
      return [...currentWorkflowRaw, getEndScreenStep()];
    }

    return currentWorkflowRaw;
  }, [currentWorkflowRaw]);

  // If steps changed (End Screen added), update parent state
  useEffect(() => {
    const hasEndScreen = currentWorkflowRaw.some(s => s.stepType === 'end_screen');
    const hasExternalBrowser = currentWorkflowRaw.some(s => s.stepType === 'external_browser');

    if (!hasEndScreen && !hasExternalBrowser && steps.length > currentWorkflowRaw.length) {
      onWorkflowsChange({
        ...workflows,
        [selectedService]: steps
      });
    }
  }, [steps, workflows, selectedService, currentWorkflowRaw, onWorkflowsChange]);

  const activeStep = steps.find(s => s.id === activeStepId);

  const handleAddStep = (template: typeof STEP_TEMPLATES[0]) => {
    if (readOnly) return;

    const isRestricted = plan === "free" && isAdvancedWorkflowType(template.type);
    if (isRestricted) {
      setLimitModalOpen(true);
      setAddDialogOpen(false);
      return;
    }

    if (template.type === 'payment' && !isStripeConfigured) {
      setStripeModalOpen(true);
      setAddDialogOpen(false);
      return;
    }

    const newStep = getEmptyStep(template);

    let newWorkflow: WorkflowStep[];

    if (template.type === 'external_browser') {
      // Replace end screen with external browser
      newWorkflow = [...steps.filter(s => s.stepType !== 'end_screen' && s.stepType !== 'external_browser'), newStep];
    } else {
      // Insert before End Screen or External Browser
      const terminalIndex = steps.findIndex(s => s.stepType === 'end_screen' || s.stepType === 'external_browser');
      newWorkflow = [...steps];

      if (terminalIndex !== -1) {
        newWorkflow.splice(terminalIndex, 0, newStep);
      } else {
        newWorkflow.push(newStep);
      }
    }

    onWorkflowsChange({ ...workflows, [selectedService]: newWorkflow });
    setActiveStepId(newStep.id);
    setAddDialogOpen(false);
  };

  const handleUpdateStep = (updated: WorkflowStep) => {
    if (readOnly) return;
    onWorkflowsChange({
      ...workflows,
      [selectedService]: steps.map(s => s.id === updated.id ? updated : s)
    });
  };

  const handleDeleteStep = (id: string) => {
    if (readOnly) return;
    const stepToDelete = steps.find(s => s.id === id);

    // If deleting external browser, restore end screen
    if (stepToDelete?.stepType === 'external_browser') {
      const newWorkflow = steps.filter(s => s.id !== id);
      // Add back end screen from original workflow or create new one
      const originalEndScreen = currentWorkflowRaw.find(s => s.stepType === 'end_screen');
      if (originalEndScreen) {
        newWorkflow.push(originalEndScreen);
      } else {
        newWorkflow.push(getEndScreenStep());
      }
      onWorkflowsChange({
        ...workflows,
        [selectedService]: newWorkflow
      });
    } else {
      onWorkflowsChange({
        ...workflows,
        [selectedService]: steps.filter(s => s.id !== id)
      });
    }

    if (activeStepId === id) setActiveStepId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (readOnly) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex(s => s.id === active.id);
      const newIndex = steps.findIndex(s => s.id === over.id);

      const activeStep = steps[oldIndex];
      const overStep = steps[newIndex];

      // Prevent dragging terminal steps (end_screen, external_browser)
      if (activeStep.stepType === 'end_screen' || activeStep.stepType === 'external_browser') {
        return;
      }

      // Prevent dragging over terminal steps
      if (overStep.stepType === 'end_screen' || overStep.stepType === 'external_browser') {
        return;
      }

      const newSteps = arrayMove(steps, oldIndex, newIndex);
      onWorkflowsChange({
        ...workflows,
        [selectedService]: newSteps
      });
    }
  };

  const StepIcon = (type: StepType) => {
    const t = STEP_TEMPLATES.find(t => t.type === type);
    if (t) return t.icon;
    if (type === 'end_screen') return CheckCircle2Icon;
    if (type === 'external_browser') return ExternalLinkIcon;
    return MessageSquareIcon;
  };

  const hasExternalBrowser = steps.some(s => s.stepType === 'external_browser');
  const draggableSteps = steps.filter(s => s.stepType !== 'end_screen' && s.stepType !== 'external_browser');

  return (
    <div className="w-full h-full flex bg-background overflow-hidden border border-border shadow-sm">
      <ServiceListPanel services={services} selected={selectedService} onSelect={setSelectedService} />

      <div className="flex-1 flex flex-col h-full bg-muted/5 min-w-0 relative" ref={containerRef}>
        <div className="h-14 flex items-center px-6 justify-between flex-shrink-0 border-b bg-background z-10">
          <div className="flex items-center gap-3">
            <Typography variant="subheading" className="text-sm font-bold text-foreground/80">{selectedService}</Typography>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <Typography variant="caption" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{steps.length} Steps</Typography>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="p-8 pb-32 flex flex-col items-center min-h-full" style={{ zoom }} onClick={() => setActiveStepId(null)}>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={draggableSteps.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {/* Draggable Steps */}
                {draggableSteps.map((step, index) => (
                  <SortableStepItem
                    key={step.id}
                    step={step}
                    index={index}
                    isActive={step.id === activeStepId}
                    onSelect={setActiveStepId}
                    onDelete={handleDeleteStep}
                    Icon={StepIcon(step.stepType)}
                    readOnly={readOnly}
                    isStripeConfigured={isStripeConfigured}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Terminal Step (End Screen or External Browser) */}
            {steps.filter(s => s.stepType === 'end_screen' || s.stepType === 'external_browser').map((step) => {
              const Icon = StepIcon(step.stepType);
              const isActive = step.id === activeStepId;
              const isExternal = step.stepType === 'external_browser';

              return (
                <div key={step.id} className="w-full max-w-xl group">
                  <Card
                    className={cn(
                      "relative mb-4 cursor-pointer transition-all hover:shadow-md border-l-4",
                      isActive ? "border-l-primary ring-1 ring-primary/20" : "border-l-transparent",
                      isExternal ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-500/20" : "bg-green-50/50 dark:bg-green-900/10 border-green-500/20"
                    )}
                    onClick={(e) => { e.stopPropagation(); setActiveStepId(step.id); }}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={cn("p-2 rounded-md", isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-muted-foreground mb-1 block">
                            {isExternal ? 'External Redirect' : 'End Screen'}
                          </span>
                          {isExternal && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleDeleteStep(step.id); }} disabled={readOnly}>
                              <Trash2Icon className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                        <p className="font-medium text-sm line-clamp-2">{step.question}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}

            {/* Add Button */}
            <div className="my-4 flex gap-2">
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full border-dashed border-2 px-6" onClick={(e) => e.stopPropagation()} disabled={readOnly}>
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Step
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Choose Step Type</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {STEP_TEMPLATES.map((t) => {
                      // Don't show external browser option if one already exists
                      if (t.type === 'external_browser' && hasExternalBrowser) return null;

                      const isRestricted = plan === "free" && isAdvancedWorkflowType(t.type);

                      return (
                        <button
                          key={t.label}
                          onClick={() => handleAddStep(t)}
                          className={cn(
                            "flex flex-col items-start p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-left space-y-2 group relative",
                            isRestricted && "opacity-80"
                          )}
                        >
                          <div className="flex w-full justify-between items-start">
                            <div className="p-2 rounded-md bg-muted group-hover:bg-background transition-colors">
                              <t.icon className="w-5 h-5 text-foreground group-hover:text-primary" />
                            </div>
                            {isRestricted && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-1.5 py-0 text-[10px] flex items-center gap-1">
                                <LockIcon className="w-2.5 h-2.5" /> Premium
                              </Badge>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{t.label}</div>
                            <div className="text-xs text-muted-foreground">{t.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 right-6 flex bg-background/80 backdrop-blur border shadow-sm rounded-full p-1 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}><ZoomOutIcon className="w-4 h-4" /></Button>
          <div className="w-12 text-center text-xs font-mono py-2">{Math.round(zoom * 100)}%</div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(z => Math.min(2, z + 0.1))}><ZoomInIcon className="w-4 h-4" /></Button>
        </div>
      </div>

      <PropertiesPanel
        activeStep={activeStep}
        onUpdate={handleUpdateStep}
        onDelete={handleDeleteStep}
        allSteps={steps}
        readOnly={readOnly}
        isStripeConfigured={isStripeConfigured}
      />

      <SubscriptionLimitModal
        open={limitModalOpen}
        onOpenChange={setLimitModalOpen}
        type="advancedWorkflows"
        organisationId={organisationId}
      />
      <Dialog open={stripeModalOpen} onOpenChange={setStripeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-primary" />
              Stripe Configuration Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Typography variant="body" className="text-sm text-muted-foreground">
              To add a payment step, you must first configure your Stripe API keys.
            </Typography>

            {organisation && (
              <StripeSettingsForm
                organization={organisation}
                hideCard
                onSuccess={() => setStripeModalOpen(false)}
              />
            )}

            {!organisation && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStripeModalOpen(false)} className="text-muted-foreground">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}