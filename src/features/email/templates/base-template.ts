/**
 * Base Email Template
 * 
 * Provides a responsive, professional HTML email template base.
 * Uses inline styles for maximum email client compatibility.
 */

export interface BaseTemplateOptions {
    /** Main content HTML */
    content: string;
    /** Optional pre-header text (preview text) */
    preheader?: string;
    /** Brand/Company name */
    brandName?: string;
    /** Logo URL */
    logoUrl?: string;
    /** Primary brand color (hex) */
    primaryColor?: string;
    /** Footer content */
    footer?: string;
    /** Unsubscribe link */
    unsubscribeUrl?: string;
    /** Custom CSS (will be inlined) */
    customStyles?: string;
}

/**
 * Generates a responsive HTML email template.
 * Compatible with major email clients including Gmail, Outlook, and Apple Mail.
 */
export function generateBaseEmailTemplate(options: BaseTemplateOptions): string {
    const {
        content,
        preheader = "",
        brandName = "Open DM",
        logoUrl,
        primaryColor = "#6366f1",
        footer,
        unsubscribeUrl,
        customStyles = "",
    } = options;

    const footerContent = footer ?? `
    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
      &copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.
    </p>
    ${unsubscribeUrl ? `
    <p style="margin: 8px 0 0; font-size: 12px; color: #9ca3af;">
      <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">
        Unsubscribe
      </a>
    </p>
    ` : ""}
  `;

    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>${brandName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #f3f4f6;
    }
    
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .mobile-padding {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .mobile-full-width {
        width: 100% !important;
        display: block !important;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body, .email-body {
        background-color: #1f2937 !important;
      }
      .email-content {
        background-color: #374151 !important;
      }
      .email-text {
        color: #f3f4f6 !important;
      }
      .email-muted {
        color: #9ca3af !important;
      }
    }
    
    ${customStyles}
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  
  <!-- Preheader (hidden preview text) -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f3f4f6;">
    ${preheader}
    ${"&nbsp;&zwnj;".repeat(50)}
  </div>
  
  <!-- Email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;" class="email-body">
    <tr>
      <td style="padding: 40px 16px;">
        
        <!-- Email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center" class="email-container" style="max-width: 600px; margin: 0 auto;">
          
          <!-- Logo/Header -->
          <tr>
            <td style="padding: 0 0 24px; text-align: center;">
              ${logoUrl ? `
              <img src="${logoUrl}" alt="${brandName}" width="150" style="max-width: 150px; height: auto;">
              ` : `
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: ${primaryColor};">
                ${brandName}
              </h1>
              `}
            </td>
          </tr>
          
          <!-- Main content card -->
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);" class="email-content">
                <tr>
                  <td style="padding: 40px;" class="mobile-padding">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 0 0; text-align: center;">
              ${footerContent}
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}

// ============================================================================
// Pre-built Template Components
// ============================================================================

/**
 * Generates a call-to-action button.
 */
export function generateButtonHtml(
    text: string,
    url: string,
    options?: {
        backgroundColor?: string;
        textColor?: string;
        align?: "left" | "center" | "right";
        fullWidth?: boolean;
    }
): string {
    const {
        backgroundColor = "#6366f1",
        textColor = "#ffffff",
        align = "center",
        fullWidth = false,
    } = options ?? {};

    return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td align="${align}">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:48px;v-text-anchor:middle;width:${fullWidth ? "100%" : "auto"};" arcsize="10%" strokecolor="${backgroundColor}" fillcolor="${backgroundColor}">
            <w:anchorlock/>
            <center style="color:${textColor};font-family:sans-serif;font-size:16px;font-weight:600;">${text}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${url}" target="_blank" style="
            display: inline-block;
            background-color: ${backgroundColor};
            color: ${textColor};
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            padding: 12px 32px;
            border-radius: 8px;
            ${fullWidth ? "width: 100%; text-align: center; box-sizing: border-box;" : ""}
          ">
            ${text}
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generates a heading element.
 */
export function generateHeadingHtml(
    text: string,
    options?: {
        level?: 1 | 2 | 3;
        color?: string;
        align?: "left" | "center" | "right";
    }
): string {
    const { level = 1, color = "#111827", align = "left" } = options ?? {};

    const sizes = {
        1: { fontSize: "28px", lineHeight: "36px", marginBottom: "16px" },
        2: { fontSize: "24px", lineHeight: "32px", marginBottom: "12px" },
        3: { fontSize: "20px", lineHeight: "28px", marginBottom: "8px" },
    };

    const style = sizes[level];

    return `
    <h${level} style="
      margin: 0 0 ${style.marginBottom};
      font-size: ${style.fontSize};
      line-height: ${style.lineHeight};
      font-weight: 700;
      color: ${color};
      text-align: ${align};
    " class="email-text">
      ${text}
    </h${level}>
  `;
}

/**
 * Generates a paragraph element.
 */
export function generateParagraphHtml(
    text: string,
    options?: {
        color?: string;
        align?: "left" | "center" | "right";
        muted?: boolean;
    }
): string {
    const {
        color = "#374151",
        align = "left",
        muted = false,
    } = options ?? {};

    return `
    <p style="
      margin: 0 0 16px;
      font-size: ${muted ? "14px" : "16px"};
      line-height: ${muted ? "20px" : "24px"};
      color: ${muted ? "#6b7280" : color};
      text-align: ${align};
    " class="${muted ? "email-muted" : "email-text"}">
      ${text}
    </p>
  `;
}

/**
 * Generates a divider.
 */
export function generateDividerHtml(): string {
    return `
    <hr style="
      margin: 24px 0;
      border: 0;
      border-top: 1px solid #e5e7eb;
    ">
  `;
}

/**
 * Generates an info box/callout.
 */
export function generateCalloutHtml(
    content: string,
    options?: {
        type?: "info" | "success" | "warning" | "error";
    }
): string {
    const { type = "info" } = options ?? {};

    const colors = {
        info: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
        success: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
        warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
        error: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
    };

    const style = colors[type];

    return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 16px 0;">
      <tr>
        <td style="
          padding: 16px;
          background-color: ${style.bg};
          border-left: 4px solid ${style.border};
          border-radius: 0 8px 8px 0;
        ">
          <p style="
            margin: 0;
            font-size: 14px;
            line-height: 20px;
            color: ${style.text};
          ">
            ${content}
          </p>
        </td>
      </tr>
    </table>
  `;
}
