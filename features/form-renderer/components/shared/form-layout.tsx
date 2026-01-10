import React from "react";
import { FormData } from "@/lib/types";
import { FormSidebar } from "./form-sidebar";
import { FormHeader } from "./form-header";
import { FormContactActions } from "./form-contact-actions";
import { FormSocialLinks } from "./form-social-links";

interface FormLayoutProps {
  formData: FormData;
  orgName: string;
  orgImage?: string;
  orgHandle?: string;
  serviceSelected: boolean;
  onReset?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isReadOnly?: boolean;
  focusedField?: string | null;
  /**
   * Used for preview to force a specific view mode.
   * If undefined, uses responsive CSS (md: breakpoints).
   */
  forcedView?: "mobile" | "desktop";
  /**
   * Scaling factor for the layout, used in preview mode.
   */
  scale?: number;
}

export function FormLayout({
  formData,
  orgName,
  orgImage,
  orgHandle,
  serviceSelected,
  onReset,
  children,
  footer,
  isReadOnly = false,
  focusedField = null,
  forcedView,
  scale = 1,
}: FormLayoutProps) {
  const isMobile = forcedView === "mobile";
  const isDesktop = forcedView === "desktop";
  const isResponsive = !forcedView;

  const description =
    formData.properties?.description ||
    (isReadOnly
      ? "Description text will appear here."
      : "Welcome! How can we help you today?");

  const containerStyle: React.CSSProperties = isDesktop
    ? {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${100 / scale}%`,
      height: `${100 / scale}%`,
      backfaceVisibility: "hidden",
      transformStyle: "preserve-3d",
    }
    : {};

  return (
    <div
      className={`w-full h-full bg-primary flex ${isResponsive ? "flex-col md:flex-row" : isDesktop ? "flex-row" : "flex-col"} overflow-hidden shadow-2xl`}
      style={containerStyle}
    >
      {/* Desktop Sidebar */}
      {(isDesktop || isResponsive) && (
        <div
          className={`
          ${isResponsive ? "hidden md:flex" : "flex"}
          flex-col md:w-1/2 shrink-0 h-full bg-primary border-r border-white/10 relative z-20 shadow-xl
        `}
        >
          <FormSidebar
            orgName={orgName}
            orgImage={orgImage}
            orgHandle={orgHandle}
            properties={formData.properties}
            focusedField={focusedField}
            isReadOnly={isReadOnly}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-primary relative overflow-hidden">
        {/* TOP SECTION: Header (Mobile) / Contact Bar (Desktop) */}
        <div
          className={`w-full shrink-0 bg-primary transition-colors duration-300`}
        >
          {/* Mobile Header */}
          {(isMobile || isResponsive) && (
            <FormHeader
              className={isResponsive ? "md:hidden" : ""}
              orgName={orgName}
              orgImage={orgImage}
              orgHandle={orgHandle}
              contactInfo={formData.properties?.contactInfo}
              tags={formData.properties?.tags}
              serviceSelected={serviceSelected}
              onReset={onReset}
              focusedField={focusedField}
              isReadOnly={isReadOnly}
            />
          )}

          {/* Desktop Contact Bar */}
          {(isDesktop || isResponsive) && (
            <div
              className={`
                w-full h-[80px] items-center bg-primary
                ${isResponsive ? "hidden md:flex" : "flex"}
              `}
            >
              <div className="flex-1 bg-primary h-full relative">
                {/* Intentional white notch - only in corner to prevent bleeding at edges */}
                <div className="absolute top-0 right-0 w-[40px] h-[40px] bg-white z-0" />
                <div className="relative z-10 bg-primary rounded-tr-[30px] h-full" />
              </div>
              <div className="bg-primary h-full">
                <FormContactActions
                  contactInfo={formData.properties?.contactInfo}
                  serviceSelected={serviceSelected}
                  onReset={onReset}
                  focusedField={focusedField}
                  isReadOnly={isReadOnly}
                />
              </div>
            </div>
          )}
        </div>

        {/* CONTENT SECTION: Socials + Messages */}
        <div className="flex-1 bg-primary relative flex flex-col min-h-0">
          <div className="absolute top-0 right-0 w-[40px] h-[40px] bg-white z-0" />
          <div className={`
            relative z-10 flex-1 flex flex-col min-h-0 bg-primary transition-colors duration-300 rounded-tr-[30px]
          `}>
            {/* Mobile Socials & Description (Hidden on Start if NOT in ReadOnly/Preview mode) */}
            {(isMobile || isResponsive) && (!serviceSelected || isReadOnly) && (
              <div
                className={`
                flex flex-col items-center px-4 pb-2 w-full mt-4
                ${isResponsive ? "md:hidden" : ""}
              `}
              >
                <FormSocialLinks
                  socialLinks={formData.properties?.socialLinks}
                  focusedField={focusedField}
                  isReadOnly={isReadOnly}
                />
                <div className="w-full mt-8 px-4 flex flex-col items-start gap-1">
                  <div
                    className={`
                    flex flex-wrap gap-3 mb-2 transition-all duration-300 px-2 -ml-2 py-1
                    ${focusedField === "title" ? "ring-2 ring-amber-400 bg-white/5 shadow-[0_0_15px_rgba(251,191,36,0.5)]" : ""}
                  `}
                  >
                    {formData.properties?.title && (
                      <span className="text-lg font-medium text-primary-foreground">
                        {formData.properties.title}
                      </span>
                    )}
                  </div>
                  <div
                    className={`
                    w-full transition-all duration-300 px-2 -ml-2 py-1
                    ${focusedField === "description" ? "ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] bg-white/5" : ""}
                  `}
                  >
                    <span
                      className="text-base text-primary-foreground/90 leading-relaxed block text-left"
                    >
                      {description}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Message Area */}
            <div
              className={`
              w-full flex-1 min-h-0 custom-scrollbar p-4 transition-all duration-300
              ${focusedField === "services" ? "ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] bg-white/5" : ""}
              ${!serviceSelected && isResponsive ? "mt-2 md:mt-0" : ""}
            `}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="w-full relative z-20 mt-auto bg-primary">
          <div className="relative bg-black/40 backdrop-blur-md rounded-t-[40px] border-t border-white/10 px-4 pt-4 pb-6">
            {footer}

            {/* Branding Footer */}
            {(isMobile || isResponsive) && (
              <div
                className={`
                flex justify-center mt-4
                ${isResponsive ? "md:hidden" : ""}
              `}
              >
                <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-default">
                  <span className="text-xs text-primary-foreground">
                    opendm.io/{orgHandle}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
