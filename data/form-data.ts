export interface SubjectOption {
  option: string;
  access:
  | {
    type: "all";
  }
  | {
    type: "specific";
    users: string[];
  };
}

export interface Form {
  nameProperties: {
    enabled: boolean;
  };
  ccProperties: {
    enabled: boolean;
  };
  subjectProperties: {
    enabled: boolean;
    allowTyping: boolean;
    options: {
      option: string;
      access:
      | {
        type: "all";
      }
      | {
        type: "specific";
        users: string[];
      };
    }[];
  };
  attachmentProperties: {
    enabled: boolean;
  };
  settings: {
    color: string;
    theme: "dark" | "light" | "system";
  };
  botCheck: boolean;
}

export function newForm(): Form {
  return {
    nameProperties: {
      enabled: true,
    },
    settings: {
      color: "#8C5CFF",
      theme: "system",
    },
    attachmentProperties: {
      enabled: true,
    },
    ccProperties: {
      enabled: true,
    },
    subjectProperties: {
      enabled: true,
      allowTyping: true,
      options: [
        { option: "Billing", access: { type: "all" } },
        { option: "Support", access: { type: "all" } },
        { option: "General", access: { type: "all" } },
      ],
    },
    botCheck: true,
  };
}
