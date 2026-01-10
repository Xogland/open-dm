"use client";

import React, { useState, useEffect } from "react";

import { MessageList } from "./message-box/message-list";
import { DynamicBottomInput } from "./message-box/dynamic-bottom-input";
import { ChatMessage } from "@/lib/message-types";
import { FormData, WorkflowStep } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Inbox, InboxIcon } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { toast } from "sonner";
import { FormSidebar } from "./shared/form-sidebar";
import { FormContactActions } from "./shared/form-contact-actions";
import { FormSocialLinks } from "./shared/form-social-links";
import { FormLayout } from "./shared/form-layout";

// Import step types for type casting
import {
  TextStep,
  EmailStep,
  PhoneStep,
  AddressStep,
  WebsiteStep,
  NumberStep,
  DateStep,
  FileStep,
  MultipleChoiceStep,
  EndScreenStep,
} from "@/lib/types";

interface ChatFormViewProps {
  formData: FormData;
  orgName: string;
  orgImage?: string;
  orgHandle?: string;
  onSubmit: (answers: Record<string, any>) => Promise<void>;
  isSubmitting: boolean;
  limitReached?: boolean;
}

export default function ChatFormView({
  formData,
  orgName,
  orgImage,
  orgHandle,
  onSubmit,
  isSubmitting,
  limitReached = false,
}: ChatFormViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const answersRef = React.useRef(answers);
  const [serviceSelected, setServiceSelected] = useState<boolean>(false);

  // Sync ref with state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const [isInputDisabled, setIsInputDisabled] = useState(false);

  // Get current workflow steps
  const currentWorkflow = selectedService
    ? formData.workflows[selectedService] || []
    : [];
  const currentStep = currentWorkflow[currentStepIndex] || null;

  // Contact and Socials Logic
  // ----------------------------------------------------------------------
  const contactInfo = formData.properties?.contactInfo || {};
  const socialLinks = formData.properties?.socialLinks || {};

  const validContacts = [
    {
      type: "profile",
      value: contactInfo.profile, // Removed fallback
      action: (v: string) => {
        navigator.clipboard.writeText(v);
        toast.success("Profile link copied!");
      },
    },
    {
      type: "phone",
      value: contactInfo.phone,
      action: (v: string) => window.open(`tel:${v}`),
    },
    {
      type: "email",
      value: contactInfo.email,
      action: (v: string) => window.open(`mailto:${v}`),
    },
    {
      type: "website",
      value: contactInfo.website,
      action: (v: string) =>
        window.open(v.startsWith("http") ? v : `https://${v}`, "_blank"),
    },
    {
      type: "calendarLink",
      value: contactInfo.calendarLink,
      action: (v: string) =>
        window.open(v.startsWith("http") ? v : `https://${v}`, "_blank"),
    },
  ].filter(
    (c) => c.value && typeof c.value === "string" && c.value.trim() !== "",
  );

  // const visibleContacts = validContacts.slice(0, 2); // Unused

  // ----------------------------------------------------------------------

  // Create initial message
  const createInitialMessage = (): ChatMessage => ({
    id: "service-selection",
    type: "service_selection",
    timestamp: Date.now(),
    question: "Hey, How can I help you?",
    services: formData.services,
  });

  // Initialize with service selection message
  useEffect(() => {
    if (formData.services && formData.services.length > 0) {
      setMessages([createInitialMessage()]);
    }
  }, [formData.services]);

  const reset = () => {
    setMessages([createInitialMessage()]);
    setCurrentStepIndex(0);
    setSelectedService(null);
    setAnswers({});
    setServiceSelected(false);
    setIsInputDisabled(false);
  };

  // Handle service selection
  const handleServiceSelect = (serviceId: string, serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setServiceSelected(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user_response",
      timestamp: Date.now(),
      value: serviceTitle,
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const typingMessage: ChatMessage = {
        id: "typing",
        type: "typing",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, typingMessage]);

      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.type !== "typing"));
        addNextWorkflowStep(serviceTitle, 0);
      }, 800);
    }, 300);
  };

  // Add next workflow step as a message
  const addNextWorkflowStep = (service: string, stepIndex: number) => {
    const workflow = formData.workflows[service];
    if (!workflow || stepIndex >= workflow.length) {
      handleFormSubmit();
      return;
    }

    const step = workflow[stepIndex];
    let stepMessage: ChatMessage;

    // Use string casting to allow potential legacy values without TS error
    const type = step.stepType as string;

    switch (type) {
      case "text":
      case "text_input":
        const textStep = step as TextStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "text_input",
          timestamp: Date.now(),
          question: step.question,
          placeholder: textStep.placeholder,
          stepId: step.id,
          minLength: textStep.minLength,
          maxLength: textStep.maxLength,
        };
        break;

      case "email":
      case "email_input":
        const emailStep = step as EmailStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "email_input",
          timestamp: Date.now(),
          question: step.question,
          placeholder: emailStep.placeholder,
          stepId: step.id,
          required: emailStep.required,
        };
        break;

      case "phone":
      case "phone_input":
        const phoneStep = step as PhoneStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "phone_input",
          timestamp: Date.now(),
          question: step.question,
          placeholder: phoneStep.placeholder,
          stepId: step.id,
          required: phoneStep.required,
        };
        break;

      case "address":
      case "address_input":
        const addressStep = step as AddressStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "address_input",
          timestamp: Date.now(),
          question: step.question,
          placeholder: addressStep.placeholder,
          stepId: step.id,
          required: addressStep.required,
        };
        break;

      case "website":
      case "website_input":
        const websiteStep = step as WebsiteStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "website_input",
          timestamp: Date.now(),
          question: step.question,
          placeholder: websiteStep.placeholder,
          stepId: step.id,
          required: websiteStep.required,
        };
        break;

      case "number":
      case "number_input":
        const numberStep = step as NumberStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "number_input",
          timestamp: Date.now(),
          question: step.question,
          placeholder: numberStep.placeholder,
          stepId: step.id,
          min: numberStep.min,
          max: numberStep.max,
        };
        break;

      case "multiple_choice":
        const mcStep = step as MultipleChoiceStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "multiple_choice",
          timestamp: Date.now(),
          question: step.question,
          options: mcStep.options || [],
          stepId: step.id,
          multiple: mcStep.multiple,
        };
        break;

      case "date":
      case "date_input":
        const dateStep = step as DateStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "date_input",
          timestamp: Date.now(),
          question: step.question,
          stepId: step.id,
          minDate: dateStep.minDate ? new Date(dateStep.minDate) : undefined,
          maxDate: dateStep.maxDate ? new Date(dateStep.maxDate) : undefined,
        };
        break;

      case "file":
      case "file_upload":
        const fileStep = step as FileStep;
        stepMessage = {
          id: `step-${step.id}`,
          type: "file_upload",
          timestamp: Date.now(),
          question: step.question,
          stepId: step.id,
          acceptedTypes: fileStep.acceptedTypes,
          maxSize: fileStep.maxSize,
        };
        break;

      case "end_screen":
      case "external_browser":
        // Instead of just showing the message, we trigger submission.
        // The actual message will be shown by handleFormSubmit.
        handleFormSubmit();
        return;

      default:
        proceedToNextStep();
        return;
    }

    setMessages((prev) => [...prev, stepMessage]);
  };

  const handleInputSubmit = async (value: string | Date | File) => {
    if (!currentStep || isSubmitting) return;

    if (value instanceof Date) {
      handleDateSelect(value);
    } else if (value instanceof File) {
      await handleFileUpload(value);
    } else {
      handleTextSubmit(value);
    }
  };

  const handleTextSubmit = (value: string) => {
    let finalValue: any = value;
    const type = currentStep?.stepType as string;
    if (type === "number" || type === "number_input") {
      finalValue = parseFloat(value);
    }

    setAnswers((prev) => ({
      ...prev,
      [currentStep!.id]: {
        answer: finalValue,
        question: currentStep!.question,
        type: currentStep!.stepType,
      },
    }));

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user_response",
      timestamp: Date.now(),
      value: value,
    };
    setMessages((prev) => [...prev, userMessage]);

    proceedToNextStep();
  };

  const handleOptionSelect = (option: any) => {
    if (!currentStep || isSubmitting) return;

    setAnswers((prev) => ({
      ...prev,
      [currentStep.id]: {
        answer: option,
        question: currentStep.question,
        type: currentStep.stepType,
      },
    }));

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user_response",
      timestamp: Date.now(),
      value: option,
    };
    setMessages((prev) => [...prev, userMessage]);

    proceedToNextStep();
  };

  const handleDateSelect = (date: Date) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep!.id]: {
        answer: date.toISOString(),
        question: currentStep!.question,
        type: currentStep!.stepType,
      },
    }));

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user_response",
      timestamp: Date.now(),
      value: date,
    };
    setMessages((prev) => [...prev, userMessage]);

    proceedToNextStep();
  };

  const generateUploadUrl = useMutation(api.attachment.generateUploadUrl);

  const handleFileUpload = async (file: File) => {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        console.error("Upload failed");
      }

      const { storageId } = await result.json();

      const fileRef = {
        type: "file_reference",
        storageId,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      };

      setAnswers((prev) => ({
        ...prev,
        [currentStep!.id]: {
          answer: fileRef,
          question: currentStep!.question,
          type: currentStep!.stepType,
        },
      }));

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: "user_response",
        timestamp: Date.now(),
        value: file,
      };
      setMessages((prev) => [...prev, userMessage]);

      proceedToNextStep();
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  const proceedToNextStep = () => {
    const typingMessage: ChatMessage = {
      id: "typing",
      type: "typing",
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, typingMessage]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.type !== "typing"));
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      if (selectedService) {
        addNextWorkflowStep(selectedService, nextIndex);
      }
    }, 800);
  };

  const handleFormSubmit = async () => {
    const submissionData = {
      service: selectedService,
      ...answersRef.current,
    };

    try {
      await onSubmit(submissionData);

      // Determine the end message based on the current step or default
      const lastStep = currentWorkflow[currentWorkflow.length - 1]; // This might be the end_workflow step if index reached end
      // Better: check if the 'currentStep' (based on index) is an end_screen step
      // We use the step at `currentStepIndex`. If we are here because index >= length, we look at last step.

      // If the loop ended because of an end_screen step, `currentStepIndex` should be pointing to it?
      // Wait, addNextWorkflowStep calls handleFormSubmit if it sees end_screen.
      // But currentStepIndex has just been incremented to point to that step.

      // If the current step (where we stopped) is End Screen, use its config.
      // If we ran out of steps (index >= length), check if the LAST step was effectively an end screen (unlikely if logic is correct) or just use default.

      let title = "Thank you!";
      let message = "Your response has been submitted successfully.";
      let showConfetti = false;
      let animationType = undefined;

      // Check if we are physically ON an end_screen step
      const currentWorkflowStep = currentWorkflow[currentStepIndex];

      if (
        currentWorkflowStep &&
        currentWorkflowStep.stepType === "end_screen"
      ) {
        const endStep = currentWorkflowStep as EndScreenStep;
        title = endStep.title || currentWorkflowStep.question || title;
        message = endStep.message || message;
        showConfetti = endStep.showConfetti || false;
        animationType = endStep.animationType;

        const successMessage: ChatMessage = {
          id: "success",
          type: "end_screen",
          timestamp: Date.now(),
          title: title,
          message: message,
          showConfetti: showConfetti,
          animationType: animationType as any,
        };
        setMessages((prev) => [...prev, successMessage]);
      } else if (
        currentWorkflowStep &&
        currentWorkflowStep.stepType === "external_browser"
      ) {
        const extBrowserStep = currentWorkflowStep as any;
        const successMessage: ChatMessage = {
          id: "success",
          type: "external_browser",
          timestamp: Date.now(),
          url: extBrowserStep.url,
          buttonText: extBrowserStep.buttonText,
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        // Fallback or generic success
        const successMessage: ChatMessage = {
          id: "success",
          type: "end_screen",
          timestamp: Date.now(),
          title: title,
          message: message,
          showConfetti: showConfetti,
        };
        setMessages((prev) => [...prev, successMessage]);
      }
      setIsInputDisabled(true);
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("Failed to submit form. Please try again.");
      setIsInputDisabled(false);
    }
  };

  // ----------------------------------------------------------------------

  const description =
    formData.properties?.description || "Welcome! How can we help you today?";

  // Determine if we need to show a special state for bottom input
  let overrideInputType = undefined;
  if (!selectedService && messages.length > 0) {
    overrideInputType = "service_selection";
  } else if (currentStep?.stepType === "end_screen" || currentStep?.stepType === "external_browser") {
    overrideInputType = "end_screen";
  }




  if (limitReached) {
    return (
      <FormLayout
        formData={formData}
        orgName={orgName}
        orgImage={orgImage}
        orgHandle={orgHandle}
        serviceSelected={false}
        onReset={reset}
        footer={null}
      >
        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="bg-white/5 p-4 rounded-full">
            <InboxIcon className="w-8 h-8 text-white opacity-50" />
          </div>
          <div className="space-y-2">
            <Typography variant="subheading" className="text-white/80">
              Inbox at capacity
            </Typography>
            {/* <Typography variant="body" className="text-white/40 text-sm max-w-[280px]">
              {orgName} is currently receiving a high volume of messages. Please try again later or reach out via socials.
            </Typography> */}
          </div>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      formData={formData}
      orgName={orgName}
      orgImage={orgImage}
      orgHandle={orgHandle}
      serviceSelected={serviceSelected}
      onReset={reset}
      footer={
        !isInputDisabled && !isSubmitting && (
          <DynamicBottomInput
            currentStep={currentStep}
            onSend={handleInputSubmit}
            isSubmitting={isSubmitting}
            overrideType={overrideInputType}
          />
        )
      }
    >
      <MessageList
        messages={messages}
        onServiceSelect={handleServiceSelect}
        onOptionSelect={handleOptionSelect}
        onDateSelect={() => { }} // Now handled by input
        onFileUpload={() => { }} // Now handled by input
        onTextSubmit={() => { }} // Now handled by input
        disableInteractions={
          isSubmitting || !!(currentStep?.stepType === "end_screen" || currentStep?.stepType === "external_browser")
        }
      />
    </FormLayout>
  );
}
