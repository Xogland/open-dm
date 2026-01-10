"use client";

import React, { useEffect, useState } from "react";
import { useBotDetector } from "@/hooks/use-bot-detector";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import ChatFormView from "./chat-form-view";
import { Typography } from "@/components/ui/typography";

export default function FormView({
  onSubmitted,
}: {
  onSubmitted: (success: boolean) => void;
}) {
  const { handle } = useParams() as { handle: string };
  const formWithOrg = useQuery(api.form.getFormWithOrganisationByHandle, {
    handle: handle,
  });

  const { executeRecaptcha } = useGoogleReCaptcha();
  const submitForm = useMutation(api.submission.createSubmission);

  const {
    honeypotValue,
    setHoneypotValue,
    handlers: detectionHandlers,
    calculateScore,
  } = useBotDetector();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAttachment = useMutation(api.attachment.createAttachment);
  const incrementView = useMutation(api.organisation.incrementView);
  const hasViewedRef = React.useRef(false);

  useEffect(() => {
    if (formWithOrg && !hasViewedRef.current) {
      hasViewedRef.current = true;
      incrementView({ organisationId: formWithOrg.organisation._id });
    }
  }, [formWithOrg, incrementView]);

  const handleSubmit = async (submissionData: Record<string, any>) => {
    if (!formWithOrg) return;

    setIsSubmitting(true);
    const endTime = Date.now();
    const result = calculateScore(endTime);

    // Bot detection with reCAPTCHA
    /*if (result.isBot) {
      if (executeRecaptcha) {
        const token = await executeRecaptcha("form_submit");
        const response = await fetch("/api/verify-captcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          console.error("Failed to verify captcha");
          setIsSubmitting(false);
          return;
        }
      }
    }*/

    try {
      // Extract email from workflow answers
      let email = "";
      const values = Object.values(submissionData);

      const emailEntry = values.find(
        (val) =>
          val &&
          typeof val === "object" &&
          (val.type === "email" || val.type === "email_input"),
      );

      if (emailEntry && emailEntry.answer) {
        email = emailEntry.answer;
      }

      const service = submissionData.service || "General Inquiry";

      const submissionId = await submitForm({
        formId: formWithOrg.form._id,
        organisation: formWithOrg.organisation._id,
        service: service,
        workflowAnswers: submissionData,
        email: email,
        timeToSubmit: result.tracking.ttsInMs,
        score: result.score,
        accessControl: { type: "organisation" },
      });

      // Create attachments for any file references in the answers
      const attachmentPromises = values.map(async (val) => {
        if (
          val &&
          val.answer &&
          typeof val.answer === "object" &&
          val.answer.type === "file_reference"
        ) {
          const fileRef = val.answer;
          await createAttachment({
            submission: submissionId,
            organisation: formWithOrg.organisation._id,
            name: fileRef.name,
            type: fileRef.mimeType,
            size: fileRef.size,
            storageId: fileRef.storageId,
          });
        }
      });

      await Promise.all(attachmentPromises);

      onSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formWithOrg) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const { form, organisation, limitReached } = formWithOrg;

  return (
    <div
      className="flex flex-col h-screen w-full bg-background"
      onMouseMove={detectionHandlers.handleMouseMove}
    >
      <div className="flex-1 flex items-center justify-center">
        <ChatFormView
          formData={{
            properties: form.properties,
            services: form.services,
            workflows: form.workflows,
          }}
          orgName={organisation.name}
          orgImage={organisation.image ?? undefined}
          orgHandle={organisation.handle}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
