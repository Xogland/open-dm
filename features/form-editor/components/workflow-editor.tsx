"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  MessageSquareIcon,
  PlusIcon, Trash2Icon, ZapIcon, Settings2Icon,
  ArrowDownIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
  UserIcon,
  MailIcon,
  MapPinIcon,
  GlobeIcon,
  AlignLeftIcon,
  HashIcon,
  CheckCircle2Icon,
  ListChecksIcon,
  StarIcon, HeartIcon, TrophyIcon, ThumbsUpIcon, SmileIcon,
  ShoppingBagIcon, GiftIcon, CrownIcon, TargetIcon, RocketIcon,
  LightbulbIcon, FlagIcon, MusicIcon, CameraIcon, VideoIcon,
  MicIcon, BriefcaseIcon, CoffeeIcon, BeerIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GripVerticalIcon,
  ExternalLinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkflowData, WorkflowStep, StepType, TextStep, EmailStep, PhoneStep, AddressStep, WebsiteStep, NumberStep, DateStep, FileStep, EndScreenStep, ExternalBrowserStep, MultipleChoiceStep, MultipleChoiceOption } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  // End Screen is handled specially
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
        buttonText: 'Continue'
      } as ExternalBrowserStep;
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

const getExternalBrowserStep = (): ExternalBrowserStep => ({
  id: `external_${Date.now()}`,
  stepType: 'external_browser',
  question: 'External Redirect', // Internal label
  url: 'https://example.com',
  buttonText: 'Continue'
});


// --- Property Sub-Components ---

const CommonProps = ({ step, update, readOnly }: { step: WorkflowStep; update: (f: string, v: any) => void; readOnly?: boolean }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Question / Label</Label>
      <Textarea
        value={step.question}
        onChange={(e) => update('question', e.target.value)}
        className="min-h-[80px]"
        disabled={readOnly}
      />
    </div>
    {step.stepType !== 'end_screen' && step.stepType !== 'date' && step.stepType !== 'file' && (step as any).placeholder !== undefined && (
      <div className="space-y-2">
        <Label>Placeholder</Label>
        <Input
          value={(step as any).placeholder || ''}
          onChange={(e) => update('placeholder', e.target.value)}
          disabled={readOnly}
        />
      </div>
    )}
  </div>
);

const TextProps = ({ step, update, readOnly }: { step: TextStep; update: (f: string, v: any) => void; readOnly?: boolean }) => (
  <div className="space-y-4 pt-4">
    <div className="flex items-center justify-between">
      <Label>Multiline</Label>
      <Switch checked={step.multiline} onCheckedChange={(c) => update('multiline', c)} disabled={readOnly} />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Min Length</Label>
        <Input type="number" value={step.minLength || ''} onChange={(e) => update('minLength', parseInt(e.target.value) || undefined)} disabled={readOnly} />
      </div>
      <div className="space-y-2">
        <Label>Max Length</Label>
        <Input type="number" value={step.maxLength || ''} onChange={(e) => update('maxLength', parseInt(e.target.value) || undefined)} disabled={readOnly} />
      </div>
    </div>
  </div>
);

const RequiredProp = ({ step, update, readOnly }: { step: any; update: (f: string, v: any) => void; readOnly?: boolean }) => (
  <div className="flex items-center justify-between pt-4">
    <Label>Required</Label>
    <Switch checked={step.required} onCheckedChange={(c) => update('required', c)} disabled={readOnly} />
  </div>
);

const NumberProps = ({ step, update, readOnly }: { step: NumberStep; update: (f: string, v: any) => void; readOnly?: boolean }) => (
  <div className="grid grid-cols-2 gap-4 pt-4">
    <div className="space-y-2">
      <Label>Min</Label>
      <Input type="number" value={step.min || ''} onChange={(e) => update('min', parseFloat(e.target.value) || undefined)} disabled={readOnly} />
    </div>
    <div className="space-y-2">
      <Label>Max</Label>
      <Input type="number" value={step.max || ''} onChange={(e) => update('max', parseFloat(e.target.value) || undefined)} disabled={readOnly} />
    </div>
  </div>
);

const DateProps = ({ step, update, readOnly }: { step: DateStep; update: (f: string, v: any) => void; readOnly?: boolean }) => (
  <div className="space-y-4 pt-4">
    {/* Could add generic min/max date pickers here if needed later */}
    <p className="text-xs text-muted-foreground">Standard date picker.</p>
  </div>
);

const FileProps = ({ step, update, readOnly }: { step: FileStep; update: (f: string, v: any) => void; readOnly?: boolean }) => (
  <div className="space-y-4 pt-4">
    <div className="space-y-2">
      <Label>Max Size (MB)</Label>
      <Input
        type="number"
        value={(step.maxSize || 0) / (1024 * 1024)}
        onChange={(e) => update('maxSize', (parseFloat(e.target.value) || 5) * 1024 * 1024)}
        disabled={readOnly}
      />
    </div>
    <div className="space-y-2">
      <Label>Accepted Types</Label>
      <Input
        placeholder="e.g. .pdf, .jpg, .png"
        value={step.acceptedTypes?.join(', ') || ''}
        onChange={(e) => update('acceptedTypes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
        disabled={readOnly}
      />
      <p className="text-xs text-muted-foreground">Comma separated extensions</p>
    </div>
  </div>
);

const EndScreenProps = ({ step, update, readOnly }: { step: EndScreenStep; update: (f: string, v: any) => void; readOnly?: boolean }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Title</Label>
      <Input value={step.title} onChange={(e) => update('title', e.target.value)} disabled={readOnly} />
    </div>
    <div className="space-y-2">
      <Label>Message</Label>
      <Textarea value={step.message} onChange={(e) => update('message', e.target.value)} disabled={readOnly} />
    </div>
    <div className="flex items-center justify-between">
      <Label>Show Confetti</Label>
      <Switch checked={step.showConfetti} onCheckedChange={(c) => update('showConfetti', c)} disabled={readOnly} />
    </div>
  </div>
);

const ExternalBrowserProps = ({ step, update, readOnly }: { step: ExternalBrowserStep; update: (f: string, v: any) => void; readOnly?: boolean }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Redirect URL</Label>
      <Input
        value={step.url}
        onChange={(e) => update('url', e.target.value)}
        placeholder="https://example.com"
        type="url"
        disabled={readOnly}
      />
      <p className="text-xs text-muted-foreground">The URL to redirect users to after form submission</p>
    </div>
    <div className="space-y-2">
      <Label>Button Text</Label>
      <Input
        value={step.buttonText || 'Continue'}
        onChange={(e) => update('buttonText', e.target.value)}
        placeholder="Continue"
        disabled={readOnly}
      />
    </div>
  </div>
);


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

const IconPicker = ({ selected, onSelect, readOnly }: { selected?: string; onSelect: (icon: string) => void; readOnly?: boolean }) => {
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

const MultipleChoiceProps = ({ step, update, readOnly }: { step: MultipleChoiceStep; update: (f: string, v: any) => void; readOnly?: boolean }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addOption = () => update('options', [...step.options, {
    title: `Option ${step.options.length + 1}`,
    description: '',
    price: '',
    icon: ''
  }]);
  const removeOption = (index: number) => update('options', step.options.filter((_, i) => i !== index));
  const updateOption = (index: number, field: keyof MultipleChoiceOption, val: any) => {
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
        <Label>Allow Multiple Selection</Label>
        <Switch checked={step.multiple || false} onCheckedChange={(c) => update('multiple', c)} disabled={readOnly} />
      </div>
      <div className="space-y-4">
        <Label>Options</Label>
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
                    <IconPicker selected={icon} onSelect={(val) => updateOption(i, 'icon', val)} readOnly={readOnly} />
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
                      <Label className="text-xs">Description (Optional)</Label>
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
                        <Label className="text-xs">Price</Label>
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
    <div className="p-4 border-b border-border bg-muted/20">
      <h3 className="font-semibold flex items-center gap-2">
        <ZapIcon className="w-4 h-4 text-primary" /> Services
      </h3>
    </div>
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {services.map((s) => (
          <button
            key={s.title}
            onClick={() => onSelect(s.title)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
              selected === s.title ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground hover:text-foreground"
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

const PropertiesPanel: React.FC<{ activeStep: WorkflowStep | undefined; onUpdate: (s: WorkflowStep) => void; onDelete: (id: string) => void; readOnly?: boolean }> = ({ activeStep, onUpdate, onDelete, readOnly }) => {
  if (!activeStep) {
    return (
      <div className="w-80 border-l border-border bg-card flex flex-col items-center justify-center text-center p-6 text-muted-foreground h-full flex-shrink-0">
        <Settings2Icon className="w-8 h-8 opacity-20 mb-4" />
        <p>Select a step to configure properties</p>
      </div>
    );
  }

  const update = (field: string, value: any) => onUpdate({ ...activeStep, [field]: value } as any);

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
        <h3 className="font-semibold flex items-center gap-2">
          <Settings2Icon className="w-4 h-4" /> Properties
        </h3>
        {activeStep.stepType !== 'end_screen' && activeStep.stepType !== 'external_browser' && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(activeStep.id)} disabled={readOnly}>
            <Trash2Icon className="w-4 h-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            {activeStep.stepType.replace('_', ' ')}
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
              {activeStep.stepType === 'date' && <DateProps step={activeStep as DateStep} update={update} readOnly={readOnly} />}
              {activeStep.stepType === 'file' && <FileProps step={activeStep as FileStep} update={update} readOnly={readOnly} />}
              {activeStep.stepType === 'multiple_choice' && <MultipleChoiceProps step={activeStep as MultipleChoiceStep} update={update} readOnly={readOnly} />}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

interface WorkflowEditorProps {
  services: { title: string }[];
  workflows: WorkflowData;
  onWorkflowsChange: (data: WorkflowData) => void;
  readOnly?: boolean;
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
}

const SortableStepItem = ({ step, index, isActive, onSelect, onDelete, Icon, readOnly }: SortableStepItemProps) => {
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
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                Step {index + 1}
              </span>
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
            <p className="font-medium text-sm line-clamp-2">{step.question}</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center -mt-2 mb-2">
        <ArrowDownIcon className="w-4 h-4 text-muted-foreground/30" />
      </div>
    </div>
  );
};

export default function WorkflowEditor({ services, workflows, onWorkflowsChange, readOnly }: WorkflowEditorProps) {
  const [selectedService, setSelectedService] = useState(services[0]?.title || "General");
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const currentWorkflowRaw = workflows[selectedService] || [];

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
    <div className="w-full h-full flex bg-background overflow-hidden border rounded-lg border-border shadow-sm">
      <ServiceListPanel services={services} selected={selectedService} onSelect={setSelectedService} />

      <div className="flex-1 flex flex-col h-full bg-muted/5 min-w-0 relative" ref={containerRef}>
        <div className="h-14 flex items-center px-6 justify-between flex-shrink-0 border-b bg-background/50 backdrop-blur-sm z-10">
          <h2 className="text-lg font-semibold">{selectedService}</h2>
          <div className="text-xs text-muted-foreground">{steps.length} Steps</div>
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
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
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

                      return (
                        <button
                          key={t.label}
                          onClick={() => handleAddStep(t)}
                          className="flex flex-col items-start p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-left space-y-2 group"
                        >
                          <div className="p-2 rounded-md bg-muted group-hover:bg-background transition-colors">
                            <t.icon className="w-5 h-5 text-foreground group-hover:text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{t.label}</div>
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

      <PropertiesPanel activeStep={activeStep} onUpdate={handleUpdateStep} onDelete={handleDeleteStep} />
    </div>
  );
}