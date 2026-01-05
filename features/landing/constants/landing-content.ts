import { ListChecks, Route, UserSquare2, DollarSign, Settings2, Users2, Puzzle, Globe, Code2, Briefcase, MessageSquare, Users, FileText, Zap } from "lucide-react";

export const HERO_CONTENT = {
    title: "Your Professional Contact Link.",
    description: "Share one link everywhere to capture intent, qualified inquiries, filter spammers and enable paid DMs for priority access.",
    features: ["Filter spam inquiries", "Capture intent upfront", "Monetize access"],
    cta: "Start Free Trial"
};

export const TESTIMONIALS = [
    {
        quote: "OpenDM finally turned my chaotic inbox into a managed process.",
        author: "CVagent.io (CEO)",
        role: "CEO"
    },
    {
        quote: "Cut my inbox spams by 99% and started earning from priority support & sponsorship inquiries ",
        author: "Xogland (Creator)",
        role: "Creator"
    },
    {
        quote: "Switching to OpenDM did two things: it organized my inbox and eliminated spam completely ",
        author: "Life Coach",
        role: "Life Coach"
    },
    {
        quote: "Now our team can instantly see if an inquiry is a press inquiry, a lead, or a partnership.",
        author: "BBC Journalist",
        role: "Journalist"
    }
];

export const HOW_IT_WORKS = [
    {
        number: "01",
        title: "1. Create Your Professional Contact Link",
        description: "Set up your branded contact profile in 2 minutes. Choose opendm.io/yourname, define inquiry types, and create a custom lead qualification workflow.",
        gradient: "from-violet-500 to-purple-500",
        bgGradient: "from-violet-500/10 to-purple-500/10"
    },
    {
        number: "02",
        title: "2. Share Your Link Everywhere",
        description: "Add your OpenDM link in bio for professionals, website, email signature, or speaker profile. Use a custom domain for a fully branded business contact portal.",
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
        number: "03",
        title: "3. Receive Only Qualified Inquiries",
        description: "Visitors state their intent upfront. You get structured contact forms, not spam. Monetize access by setting fees for priority paid consultation requests.",
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-500/10 to-teal-500/10"
    }
];

export const FEATURES = [
    {
        icon: Route,
        title: "1. Capture inquiry and Manage Routing +",
        description: "Each inquiry path asks the right questions so every inbound arrives clear, qualified, and routed correctly to your email or your team for:",
        items: [
            "Services & Business Inquiries",
            "Partnerships & Sponsorships",
            "Paid Advice & Priority Messages",
            "Project Support & Feedback",
            "General Contact"
        ],
        footer: "OpenDM manages lead qualification and email routing.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: DollarSign,
        title: "2. Monetize Your Access +",
        description: "OpenDM enables paid business inquiries to prioritize conversation and keep spammers out of conversations, use paid DMs for:",
        items: [
            "Professional advice and consultation",
            "Partnership and sponsorship inquiries ",
            "Priority access and extended support"
        ],
        footer: "Set one time fees, collect payments instantly through Stripe, and manage access, all with 0% platform fees.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        icon: UserSquare2,
        title: "3. Professional Relationships Hub +",
        description: "Every inquiry is captured with full context in your OpenDM workspace:",
        items: [
            "Complete conversation history",
            "Original inquiry intent and category",
            "Contact details and source tracking",
            "Internal notes and custom tags"
        ],
        footer: "Designed for managing professional relationships.",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        icon: Globe,
        title: "4. Embed Anywhere, Share Everywhere +",
        description: "Make your professional contact gateway a seamless part of your existing digital presence. Embed the power of OpenDM directly into your websites and profiles to capture qualified inquiries wherever your audience finds you.",
        subsections: [
            {
                title: "Universal Contact & Bio Link",
                description: "Replace your basic link in bio, traditional landing pages and contact pages with a powerful, conversion-focused contact gateway. Capture intent, showcase services, and enable payments directly from your Instagram, TikTok, LinkedIn, YouTube, X, Threads, GitHub or any social profile, turning passive followers into business leads."
            },
            {
                title: "WordPress Plugin - Coming Soon",
                description: "Add your OpenDM contact gateway to any WordPress site in minutes. It works as a native widget, page, or form, maintaining your site’s design while adding powerful inquiry capture and payment features."
            },
            {
                title: "React / Next.js Component - Coming Soon",
                description: "Drop a fully-functional contact widget into your modern web applications. Built for developers, it integrates cleanly with your stack and gives you full control over styling and behavior."
            }
        ],
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        icon: Settings2,
        title: "5. Designed to Adapt +",
        items: [
            "Custom Intake Flows: Design different question paths for different inquiries.",
            "Team Collaboration: Assign conversations and manage internal handoffs.",
            "Tool Integrations: Connect Calendly, Google Calendar, Zoom, and more",
            "Connect Your Domain: Use a custom domain for a fully professional presence."
        ],
        color: "text-pink-500",
        bg: "bg-pink-500/10"
    }
];

export const WHO_ITS_FOR = [
    {
        icon: Briefcase,
        title: "For Leaders & Professionals +",
        description: "Reduce inbox noise while ensuring important contacts reach you through the right channel. Protect your time while staying accessible. Link your social media and bio, manage access to your time in your terms.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: MessageSquare,
        title: "For Creators & Influencers +",
        description: "Turn partnership inquiries into closed deals. Monetize your influence with paid DMs, manage your global business page, attract serious brands deals and eliminate spammers — all from a single platform. More revenue, Less noise, Maximum control.",
        link: "Creators.OpenDM.io",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        icon: Users,
        title: "For Consultants & Coaches +",
        description: "Qualify leads before they become conversations. Manage your global business and contact profile, list your service and route inquiries to the right team member, schedule paid consultation calls or personal advises automatically.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        icon: FileText,
        title: "For Journalists & Media +",
        description: "Filter sources, personal messages, press inquiries, share documents and lead management efficiently. Never miss a story lead in a cluttered inbox.",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        icon: Users2,
        title: "For Agencies & Businesses +",
        description: "Manage client inquiries from multiple channel and coordinate them across your team with clear routing, full context, and seamless collaboration with your teams.",
        color: "text-pink-500",
        bg: "bg-pink-500/10"
    }
];

export const FAQS = [
    {
        question: "1. What exactly is OpenDM?",
        answer: "OpenDM is your professional contact link that replaces chaotic inboxes. It’s a structured contact portal where visitors choose their intent (business, sponsorship, paid advice) before messaging, ensuring you receive only qualified, actionable inquiries."
    },
    {
        question: "2. How does OpenDM help me make money?",
        answer: "You can monetize inquiries directly. Set fees for paid consultation requests or priority DMs. Payments go instantly to your Stripe account—OpenDM charges 0% platform fees, turning your contact link into a revenue stream."
    },
    {
        question: "3. Is this just another \"link in bio\" tool?",
        answer: "No. It’s a professional contact link designed for serious business. While it works perfectly in social bios, it goes beyond links by capturing intent, qualifying leads, and filtering spam inquiries before they reach you."
    },
    {
        question: "4. Can I use my own domain?",
        answer: "Yes. On all paid plans, you can connect a custom domain (e.g., contact.yourdomain.com or yourdomain.com) for a fully branded, professional business contact portal."
    },
    {
        question: "5. How does it reduce spam?",
        answer: "By requiring visitors to select an inquiry type and often answer qualifying questions, OpenDM’s structured contact form deters bots and low-effort messages. Users typically report a 90%+ reduction in inbox spam."
    },
    {
        question: "6. Does it work for teams and agencies?",
        answer: "Absolutely. Pro and Max plans include team collaboration features: shared inbox, internal notes, and conversation assignment—perfect for managing client inquiries across your agency."
    },
    {
        question: "7. How secure is my data?",
        answer: "We use bank-level encryption and are SOC 2 compliant. You own your contact data. We are a secure contact management platform built for professionals."
    },
    {
        question: "8. Is there a free plan to try it?",
        answer: "Yes, start for free. Our FREE \"Launch\" plan gives you a professional contact link, basic inquiry types, and 1GB storage. Upgrade anytime to unlock paid DMs, custom domains, and team features."
    }
];

export const PRICING_PLANS = [
    {
        name: "FREE — Launch Contact",
        price: 0,
        period: "month per profile",
        description: "",
        features: [
            "Business & Contact profile",
            "Connect all social media accounts",
            "Connect Tools and websites",
            "Unlimited inquiry",
            "3 inquiry subjects",
            "Storage space up to 1 GB",
            "Inbox with history",
            "Client management portal",
            "Connect domain"
        ],
        cta: "Start Free",
        popular: false
    },
    {
        name: "PRO — Grow Contact",
        price: 29,
        period: "month per profile",
        description: "",
        features: [
            "Everything in Free+",
            "Team access with 5 seats",
            "Email routing up to 1000 messages",
            "12 inquiry subjects",
            "Storage space up to 5 GB",
            "Full access to workflow manager",
            "Paid DMs or Paid inquiry requests",
            "Stripe payments (0% platform fees)"
        ],
        cta: "Start Pro",
        popular: true
    },
    {
        name: "MAX — Scale Contact",
        price: 69,
        period: "month per profile",
        description: "",
        features: [
            "Everything in Pro+",
            "Team access with 50 seats",
            "Email routing up to 10,000 messages",
            "Storages space up to 50 GB",
            "Advance Analytics",
            "Client management portals",
            "Priority support"
        ],
        cta: "Start Max",
        popular: false
    }
];

export const FINAL_CTA_CONTENT = {
    title: "Ready to Transform Your Inbound Conversations?",
    replaces: [
        "Chaotic email threads",
        "Unqualified lead forms",
        "Missed sponsorship opportunities",
        "Unproductive “quick question” DMs",
        "Time-consuming inquiry triage"
    ],
    provides: [
        "Structured, intent-based conversations",
        "Qualified, actionable messages",
        "Revenue from paid inquiries",
        "Professional contact management",
        "Hours reclaimed every week"
    ],
    cta: "Start Your Free Trial Today"
};

export const ONE_SYSTEM_CONTENT = {
    title: "One System. Two Ways to Use It.",
    description: "Use OpenDM as a public inbound profile or embed it on your website — every inbound request starts the same way and lands in one unified inbox.",
    options: [
        {
            icon: Globe,
            title: "1. Public Inbound Page",
            description: "Share your OpenDM handle as your primary professional contact profile anywhere online.",
            items: [
                "Your public contact handle",
                "A replacement for publicly posting email",
                "Inside link-in-bio for business inquiry",
                "Connect domain name to build web profile"
            ],
            footer: "Visitors choose why they're reaching out, answer relevant questions, and submit a qualified inbound request."
        },
        {
            icon: Code2,
            title: "2. Embed It on Your Website",
            description: "Drop OpenDM into your site without changing your layout.",
            items: [
                "Replace traditional contact forms",
                "Embed as a smart intake form or popup",
                "Works with WordPress or custom sites"
            ],
            footer: "Let inbound inquiries self-qualify before they reach your unified inbox."
        }
    ]
};

export const BETTER_WAY_CONTENT = {
    title: "The Better Way to Handle Inbound",
    features: [
        {
            icon: ListChecks,
            title: "1. Your Structured Intake Solution",
            description: "Unstructured inquiries waste time, create unnecessary calls, and lead to unclear conversations. OpenDM fixes this at the source with structured inbound intake solution designed for real business use — not a generic contact forms.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Route,
            title: "2. Intent-Based Inquiry Routing",
            description: "People choose why they're reaching out before messaging you like: Services and Business inquiry, Projects and After-sales support, Partnerships and Sponsorship, Paid advice and Paid DMs, Feedback and Personal messages.",
            sub: "Each inquiry path asks the right questions, so every inbound arrives clear, qualified, and get routed to the right person.",
            badge: "Lead qualification - Built In",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            icon: UserSquare2,
            title: "3. Built-In Client Manager (Inbound CRM)",
            description: "Every inbound inquiry is automatically captured with full context: Conversation history, Inquiry type and intent, Client details, Add Custom tags and notes.",
            sub: "No spreadsheets. No manual tracking. No lost inquiries. Designed specifically for inbound inquiry management — not retrofitted sales pipelines.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            icon: DollarSign,
            title: "4. Get Paid for Your Time (Paid DM)",
            description: "Not every conversation should be free. OpenDM lets you charge for inbound messages and advice before the conversation starts.",
            useCases: ["Advice requests", "Consultation requests", "Strategy questions", "After-sales support"],
            sub: "Set one-time fees, collect payment via Stripe, and define expectations upfront — with 0% platform fees. Stop unpaid support. Stop scope creep. Monetize inbound requests smartly.",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ]
};

export const ACTUALLY_WORK_CONTENT = {
    title: "Adapted to How You Actually Work",
    items: [
        {
            icon: Settings2,
            title: "1. Custom Intake Flows",
            description: "Design different intake structures for different inquiry types. Each inbound request follows its own logic — no forced funnels.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Users2,
            title: "2. Team Collaboration",
            description: "Assign and manage inbound inquiries across your team as you grow — without changing how inbound starts.",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            icon: Puzzle,
            title: "3. Calendar & Tool Integrations",
            description: "Connect Calendly, portfolios, and tools directly inside the inquiry flow — with context and payment handled upfront.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        }
    ]
};

export const WHY_CHOOSE_CONTENT = {
    title: "Why Professionals Choose OpenDM",
    description: "Businesses today are built on conversations and OpenDM gives people access to you on your terms.",
    subTitle: "OpenDM me @ opendm.io/CEO",
    items: [
        {
            title: "For Leaders & Professionals",
            description: "Reduce inbox noise while ensuring important contacts reach you through the right channel. Protect your time while staying accessible. Link your social media and bio, manage access to your time in your terms."
        },
        {
            title: "For Creators & Influencers",
            description: "Turn partnership inquiries into closed deals. Monetize your influence with paid DMs, manage your global business page, attract serious brands deals and eliminate spammers — all from a single platform. More revenue, Less noise, Maximum control.",
            link: {
                label: "Learn More",
                url: "https://Creators.OpenDM.io"
            }
        },
        {
            title: "For Consultants & Coaches",
            description: "Qualify leads before they become conversations. Manage your global business and contact profile, list your service and route inquiries to the right team member, schedule paid consultation calls or personal advises automatically."
        },
        {
            title: "For Journalists & Media",
            description: "Filter sources, personal messages, press inquiries, share documents and lead management efficiently. Never miss a story lead in a cluttered inbox."
        },
        {
            title: "For Agencies & Businesses",
            description: "Manage client inquiries from multiple channel and coordinate them across your team with clear routing, full context, and seamless collaboration with your teams."
        }
    ]
};
