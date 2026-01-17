import React, { useState, useRef, useEffect } from "react";
import { Laptop, Smartphone } from "lucide-react";

import { MessageList } from "@/features/form-renderer/components/message-box/message-list";
import { DynamicBottomInput } from "@/features/form-renderer/components/message-box/dynamic-bottom-input";
import { ChatMessage } from "@/lib/message-types";
import { FormData, WorkflowStep, ExternalBrowserStep, TextStep } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FormLayout } from "@/features/form-renderer/components/shared/form-layout";

interface PreviewBoxProps {
  formData?: FormData;
  orgName?: string;
  orgImage?: string;
  focusedField?: string | null;
}

export default function PreviewBox({
  formData,
  orgName = "Username",
  orgImage,
  focusedField,
  orgHandle,
}: PreviewBoxProps & { orgHandle?: string }) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("mobile");

  // Generate preview messages based on form data
  const generatePreviewMessages = (): ChatMessage[] => {
    const messages: ChatMessage[] = [];

    // Service selection message
    if (formData?.services && formData.services.length > 0) {
      messages.push({
        id: "service-selection",
        type: "service_selection",
        timestamp: Date.now(),
        question: "Hey, How can I help you?",
        services: formData.services.map((s) => {
          // Check if this service workflow has a payment step
          const workflow = formData.workflows[s.title] || [];
          const hasPayment = workflow.some(step => step.stepType === 'payment');

          return {
            id: s.id,
            title: s.title,
            hasPayment
          };
        }),
      });
    }

    // Sample workflow steps removed to avoid confusion with service selection
    // The preview should only show the initial state (Service Selection)


    // Fallback message if no data
    if (messages.length === 0) {
      messages.push({
        id: "fallback",
        type: "system_info",
        timestamp: Date.now(),
        text: "Configure your services and workflows to see a preview here.",
      });
    }

    return messages;
  };

  const previewMessages = generatePreviewMessages();

  const containerRef = useRef<HTMLDivElement>(null);
  const [dynamicScale, setDynamicScale] = useState(0.5);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        if (viewMode === "desktop") {
          if (screenWidth > 0) {
            setDynamicScale(width / screenWidth);
          }
        } else {
          if (screenHeight > 0) {
            setDynamicScale(height / screenHeight);
          }
        }
      }
    };

    // Update initially and on resize
    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [viewMode]);

  // const previewScale = viewMode === 'desktop' ? dynamicScale : 1;
  const previewScale = dynamicScale;
  // const previewScale = 1;

  return (
    <div className={`flex flex-col items-center gap-4 h-full w-full ${viewMode === "desktop" ? "ml-6" : "pb-4"}`}>
      <div className="flex gap-2 bg-muted p-1 rounded-lg shrink-0 mt-4">
        <Button
          variant={viewMode === "desktop" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("desktop")}
          className="px-3"
          title="Desktop View"
        >
          <Laptop className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "mobile" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("mobile")}
          className="px-3"
          title="Mobile View"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 w-full flex items-center justify-center min-h-0">
        <div
          ref={containerRef}
          className={`
          transition-all duration-300 ease-in-out shadow-2xl overflow-hidden bg-white rounded-xs
          ${viewMode === "mobile"
              ? "h-full w-full max-w-[375px] border border-border"
              : "w-full aspect-video max-w-5xl border border-border"
            }
        `}
        >
          <FormLayout
            formData={
              formData ||
              ({ properties: {}, services: [], workflows: {} } as FormData)
            }
            orgName={orgName}
            orgImage={orgImage}
            orgHandle={orgHandle}
            serviceSelected={false}
            isReadOnly={true}
            focusedField={focusedField}
            forcedView={viewMode}
            scale={previewScale}
            footer={
              <div className="pointer-events-none">
                <DynamicBottomInput
                  currentStep={null}
                  isSubmitting={false}
                  onSend={() => { }}
                  overrideType="text_input"
                />
              </div>
            }
          >
            <MessageList
              messages={previewMessages}
              disableInteractions={true}
            />
          </FormLayout>
        </div>
      </div>
    </div>
  );
}
