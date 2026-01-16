export const AVAILABLE_BLOCK_TYPES: { type: BlockType; label: string }[] = [
    {
        "type": "address",
        "label": "Address",
    },
    {
        "type": "short_text",
        "label": "Short Text",
    },
    {
        "type": "long_text",
        "label": "Long Text",
    },
    {
        "type": "checkbox",
        "label": "Checkbox",
    },
    {
        "type": "contact_info",
        "label": "Contact Info",
    },
    {
        "type": "date",
        "label": "Date",
    },
    {
        "type": "email",
        "label": "Email",
    },
    {
        "type": "legal",
        "label": "Legal",
    },
    {
        "type": "matrix",
        "label": "Matrix",
    },
    {
        "type": "multiple_choice",
        "label": "Multiple Choice",
    },
    {
        "type": "number",
        "label": "Number",
    },
    {
        "type": "opinion_scale",
        "label": "Opinion Scale",
    },
    {
        "type": "phone_number",
        "label": "Phone Number",
    },
    {
        "type": "picture_choice",
        "label": "Picture Choice",
    },
    {
        "type": "rating",
        "label": "Rating",
    },
    {
        "type": "ranking",
        "label": "Ranking",
    },
    {
        "type": "statement",
        "label": "Statement",
    },
    {
        "type": "website",
        "label": "Website",
    },
    {
        "type": "yes_no",
        "label": "Yes/No",
    },
    {
        "type": "dropdown",
        "label": "Dropdown",
    },
]

export type BlockType =
    | "short_text"
    | "long_text"
    | "checkbox"
    | "contact_info"
    | "multiple_choice"
    | "dropdown"
    | "picture_choice"
    | "yes_no"
    | "legal"
    | "rating"
    | "opinion_scale"
    | "ranking"
    | "matrix"
    | "email"
    | "phone_number"
    | "address"
    | "website"
    | "number"
    | "date"
    | "statement"
    | "file_upload";

export interface BaseBlock {
    id: string;
    type: BlockType;        // 'address', 'short_text', etc.
    question?: string;   // editable question text
    label: string;
    description?: string;
    required?: boolean;
}

export interface Field {
    label?: string;
    value?: string;
    ref: string;
    placeholder?: string;
    required?: boolean;
    hidden?: boolean;
}
export interface PhoneNumberField extends Field{
    countryCode?: string;
}

// 1. Address Block
export interface AddressBlock extends BaseBlock {
    type: "address";
    fields: {
        address1: Field;
        address2: Field;
        city: Field;
        state: Field;
        zip: Field;
        country: Field;
    };
}

// 2. Short Text
export interface ShortTextBlock extends BaseBlock {
    type: "short_text";
    field: {
        label?: string;
        placeholder?: string;
        value?: string;
        enable_max_length?: boolean;
        max_length?: number;
    };
}

// 3. Long Text
export interface LongTextBlock extends BaseBlock {
    type: "long_text";
    field: {
        label?: string;
        placeholder?: string;
        value?: string;
        enable_max_length?: boolean;
        max_length?: number;
    };
}

// 4. Multiple Choice
export interface MultipleChoiceBlock extends BaseBlock {
    type: "multiple_choice";
    field: {
        choices: { label: string; ref: string; selected?: boolean }[];
        allow_multiple_selection?: boolean;
        allow_other_choice?: boolean;
        randomize?: boolean;
        value?: string | string[];
    };
}

// 5. Dropdown
export interface DropdownBlock extends BaseBlock {
    type: "dropdown";
    field: {
        choices: { label: string; ref: string }[];
        placeholder?: string;
        selected?: string;
        randomize?: boolean;
        alphabetical_order?: boolean;
    };
}

// 6. Picture Choice
export interface PictureChoiceBlock extends BaseBlock {
    type: "picture_choice";
    field: {
        choices: { label: string; ref: string; attachment?: { type: "image"; href: string }; selected?: boolean }[];
        allow_multiple_selection?: boolean;
        randomize?: boolean;
        supersized?: boolean;
        show_labels?: boolean;
        value?: string | string[];
    };
}

// 7. Yes/No
export interface YesNoBlock extends BaseBlock {
    type: "yes_no";
    field: {
        value?: boolean;
    };
}

// 8. Legal
export interface LegalBlock extends BaseBlock {
    type: "legal";
    field: {
        choices: { label: string; ref: string; accepted?: boolean }[];
        value?: string; // store selected choice ref
    };
}

// 9. Rating
export interface RatingBlock extends BaseBlock {
    type: "rating";
    field: {
        steps: number;
        shape: "star" | "heart" | "circle" | "flag" | "bookmark";
        labels: { left: string; right: string };
        value?: number;
    };
}

// 10. Opinion Scale
export interface OpinionScaleBlock extends BaseBlock {
    type: "opinion_scale";
    field: {
        steps: number;
        start_at_one?: boolean;
        labels: { left: string; right: string };
        value?: number;
    };
}

// 11. Ranking
export interface RankingBlock extends BaseBlock {
    type: "ranking";
    field: {
        choices: { label: string; ref: string }[];
        randomize?: boolean;
        allow_other_choice?: boolean;
        value?: string[]; // ordered choice refs
    };
}

// 12. Matrix
export interface MatrixBlock extends BaseBlock {
    type: "matrix";
    field: {
        columns: { label: string; ref: string }[];
        rows: { label: string; ref: string }[];
        multi_select?: boolean;
        value?: Record<string, string>; // row ref -> column ref
    };
}

// 13. Email
export interface EmailBlock extends BaseBlock {
    type: "email";
    field: {
        placeholder?: string;
        value?: string;
    };
}

// 14. Phone Number
export interface PhoneNumberBlock extends BaseBlock {
    type: "phone_number";
    field: {
        value?: string;
        country_code?: string;
    };
}

// 15. Website
export interface WebsiteBlock extends BaseBlock {
    type: "website";
    field: {
        value?: string;
        placeholder?: string;
    };
}

// 16. Number
export interface NumberBlock extends BaseBlock {
    type: "number";
    field: {
        value?: number;
        min_value?: number;
        max_value?: number;
    };
}

export type DateFormats = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY/MM/DD";
// 17. Date
export interface DateBlock extends BaseBlock {
    type: "date";
    field: {
        value: Date | null;
        structure: DateFormats;
        separator?: string;
    };
}

// 18. Statement
export interface StatementBlock extends BaseBlock {
    type: "statement";
    field: {
        button_text?: string;
    };
}

// 19. File Upload
export interface FileUploadBlock extends BaseBlock {
    type: "file_upload";
    field: {
        value?: File | null;
        max_size_mb?: number;
        allowed_file_types?: string[];
    };
}

// 20. Checkbox
export interface CheckboxBlock extends BaseBlock {
    type: "checkbox";
    field: {
        label?: string;
        placeholder?: string;
        checked?: boolean;
    };
}

// 21. Contact Info
export interface ContactInfoBlock extends BaseBlock {
    type: "contact_info";
    fields: {
        firstName: Field;
        lastName: Field;
        phoneNumber: PhoneNumberField;
        email: Field;
        company: Field;
    };
}

// Union type
export type FormBlock =
    | AddressBlock
    | ShortTextBlock
    | LongTextBlock
    | MultipleChoiceBlock
    | DropdownBlock
    | PictureChoiceBlock
    | YesNoBlock
    | LegalBlock
    | RatingBlock
    | OpinionScaleBlock
    | RankingBlock
    | MatrixBlock
    | EmailBlock
    | PhoneNumberBlock
    | WebsiteBlock
    | NumberBlock
    | DateBlock
    | StatementBlock
    | FileUploadBlock
    | CheckboxBlock
    | ContactInfoBlock
    ;