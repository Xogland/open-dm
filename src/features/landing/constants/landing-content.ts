import { ListChecks, Route, UserSquare2, DollarSign, Settings2, Users2, Puzzle, Globe, Code2, Briefcase, MessageSquare, Users, FileText, Zap } from "lucide-react";

export const HERO_CONTENT = {
    title: "Your Contact Link.",
    description:
        "Share one link everywhere to capture inquiries, route them to your inbox, block spam, and enable paid DMs for priority access.",
    features: [
        "Filter spam inquiries",
        "Capture intent upfront",
        "Monetize access",
    ],
    cta: "Pre-register Now",
};

export const TESTIMONIALS = [
    {
        quote:
            "OpenDM finally transformed my chaotic inbox into a beautifully managed, automated process.",
        author: "CEO",
        role: "CEO",
    },
    {
        quote:
            "Cut my inbox spams by 99% and started earning from priority & sponsorship inquiries ",
        author: "Influencer",
        role: "Creator",
    },
    {
        quote:
            "Switching to OpenDM did two things: it organized my inbox and eliminated spam completely ",
        author: "Life Coach",
        role: "Life Coach",
    },
    {
        quote:
            "Now our team can instantly see if an inquiry is a press inquiry, a lead, or a partnership.",
        author: "Journalist",
        role: "Journalist",
    },
];

export const HOW_IT_WORKS = [
    {
        number: "01",
        title: "Create Professional Contact Link",
        description: "Set up your branded contact profile in 2 minutes. Choose opendm.io/yourname, define inquiry types, and create a custom lead qualification workflow.",
        gradient: "from-violet-500 to-purple-500",
        bgGradient: "from-violet-500/10 to-purple-500/10"
    },
    {
        number: "02",
        title: "Share Your Link Everywhere",
        description: "Add your OpenDM link in bio for professionals, website, email signature, or speaker profile. Use a custom domain for a fully branded business contact portal.",
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
        number: "03",
        title: "Receive Only Qualified Inquiries",
        description: "Visitors state their intent upfront. You get structured contact forms, not spam. Monetize access by setting fees for priority paid consultation requests.",
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-500/10 to-teal-500/10"
    }
];

export const FEATURES = [
    {
        icon: Globe,
        title: "Professional Contact Link",
        description: "OpenDM replaces the traditional contact form with a professional contact link designed for intent capture. As a link in bio for professionals, it works across websites and social platforms, turning passive traffic into structured, qualified inbound messages.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: ListChecks,
        title: "Filter Spam Automatically",
        description: "Every inquiry flows through a structured contact form and lead qualification workflow. OpenDM qualifies leads automatically, routes messages correctly, and ensures only relevant, high-intent inquiries reach you.",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        icon: MessageSquare,
        title: "Forward inquiries to Email",
        description: "OpenDM forwards every message directly to your connected email address. You can reply from your own inbox as usual, and the sender receives your response seamlessly. There is no new inbox to manage, no login friction, and no disruption to your existing workflow.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        icon: Users2,
        title: "Team Collaboration Support",
        description: "OpenDM supports teams by allowing inquiries to be shared, assigned, and handled collaboratively. Conversations can be routed to the right person, internal handoffs stay organized, and everyone works from the same context. This makes OpenDM suitable for agencies, startups, and growing teams managing business inquiries together.",
        color: "text-pink-500",
        bg: "bg-pink-500/10"
    },
    {
        icon: Briefcase,
        title: "Client Management Portal",
        description: "Each inquiry is also captured inside OpenDM as a complete business contact portal. Conversation history, inquiry intent, contact details, and source tracking are stored in one place, supporting sponsorship inquiry management and long-term professional relationships.",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        icon: DollarSign,
        title: "Paid Consultation Requests",
        description: "OpenDM supports paid consultation requests with one-time fees collected instantly through Stripe. You control pricing, access, and priority with zero platform fees, making it easy to monetize expertise without compromising professionalism.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: Settings2,
        title: "Connect Custom Domain",
        description: "OpenDM provides a custom domain contact page that replaces outdated contact forms and static landing pages. Use it as a link in bio, embed it on your website, or share it anywhere your audience engages.",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
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
        answer: "Yes. On all plans, you can connect a custom domain (e.g., contact.yourdomain.com or yourdomain.com) for a fully branded, professional business contact portal."
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
        answer: "Yes, start for free. Our FREE plan gives you a professional contact link, basic inquiry types, and 20 inbound submissions per month. Upgrade anytime to unlock more submissions, storage, and team features."
    }
];

import { PLAN_CONFIGS } from "../../subscription/config/plan-config";

export const PRICING_PLANS = [
    {
        ...PLAN_CONFIGS.free,
        name: "FREE — Explore OpenDM",
        price: PLAN_CONFIGS.free.pricing.monthly,
        period: "month forever",
        description: "Perfect for exploring the platform",
        features: PLAN_CONFIGS.free.ui.displayFeatures || [],
        cta: PLAN_CONFIGS.free.ui.cta || "Start Free",
        popular: PLAN_CONFIGS.free.ui.popular
    },
    {
        ...PLAN_CONFIGS.beginner,
        name: "BEGINNER — Launch Contact",
        price: PLAN_CONFIGS.beginner.pricing.monthly,
        period: "month per profile",
        description: "For individuals and small setups",
        features: PLAN_CONFIGS.beginner.ui.displayFeatures || [],
        cta: PLAN_CONFIGS.beginner.ui.cta || "Start Beginner",
        popular: PLAN_CONFIGS.beginner.ui.popular
    },
    {
        ...PLAN_CONFIGS.pro,
        name: "PRO — Grow Contact",
        price: PLAN_CONFIGS.pro.pricing.monthly,
        period: "month per profile",
        description: "For growing teams and professionals",
        features: PLAN_CONFIGS.pro.ui.displayFeatures || [],
        cta: PLAN_CONFIGS.pro.ui.cta || "Start Pro",
        popular: PLAN_CONFIGS.pro.ui.popular
    },
    {
        ...PLAN_CONFIGS.max,
        name: "MAX — Scale Contact",
        price: PLAN_CONFIGS.max.pricing.monthly,
        period: "month per profile",
        description: "Unlimited scale for high volume businesses",
        features: PLAN_CONFIGS.max.ui.displayFeatures || [],
        cta: PLAN_CONFIGS.max.ui.cta || "Start Max",
        popular: PLAN_CONFIGS.max.ui.popular
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
    cta: "Pre-register Now"
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
    description:
        "Businesses today are built on conversations and OpenDM gives people access to you on your terms",
    subTitle: "OpenDM me @opendm.io/CEO",
    items: [
        {
            title: "For Leaders & Professionals",
            description:
                "Reduce inbox noise while ensuring important contacts reach you through the right channel. Protect your time while staying accessible. Link your social media and bio, manage access to your time in your terms.",
        },
        {
            title: "For Creators & Influencers",
            description:
                "Turn partnership inquiries into closed deals. Monetize your influence with paid DMs, manage your global business page, attract serious brands deals and eliminate spammers — all from a single platform. More revenue, Less noise, Maximum control.",
        },
        {
            title: "For Consultants & Coaches",
            description:
                "Qualify leads before they become conversations. Manage your global business and contact profile, list your service and route inquiries to the right team member, schedule paid consultation calls or personal advises automatically.",
        },
        {
            title: "For Journalists & Media",
            description:
                "Filter sources, personal messages, press inquiries, share documents and lead management efficiently. Never miss a story lead in a cluttered inbox.",
        },
        {
            title: "For Agencies & Businesses",
            description:
                "Empower your agency with a platform built for scale. Effortlessly manage multiple organizations and team members from a single account, with the flexibility to assign specific roles and route data to multiple emails simultaneously. Combined with adaptable pricing based on your contact profiles, it’s the streamlined solution designed to keep your business agile and your team synchronized.",
        },
    ],
};
