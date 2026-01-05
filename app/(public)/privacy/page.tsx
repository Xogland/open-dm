import { Metadata } from "next";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Privacy Policy | OpenDM",
    description: "Comprehensive Legal Privacy Policy for OpenDM - Detailed data protection and privacy disclosures.",
};

export default function PrivacyPage() {
    const lastUpdated = "January 5, 2026";

    return (
        <div className="container px-4 py-24 mx-auto max-w-4xl">
            <div className="mb-12">
                <Typography variant="h1" className="mb-4 text-4xl font-black uppercase tracking-tight">Privacy Policy</Typography>
                <div className="p-4 bg-muted/50 border-l-4 border-primary mb-8">
                    <Typography variant="p" className="text-sm italic">
                        The last update to this Privacy Policy was made on {lastUpdated}. We reserve the right to modify this policy at our sole discretion. Your continued use of the OpenDM platform after any such changes constitutes your binding acceptance of the updated policy. This document is a legally binding agreement between you and OpenDM regarding your data privacy.
                    </Typography>
                </div>
            </div>

            <div className="space-y-12 text-foreground/90 leading-[1.8] text-sm md:text-base">
                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">1. OVERVIEW AND AGREEMENT TO TERMS</Typography>
                    <Typography>
                        OpenDM ("Company," "we," "us," or "our") is dedicated to the protection of your privacy and the security of your personal information. This Privacy Policy ("Policy") explains the depth and breadth of our practices regarding the collection, use, maintenance, and disclosure of information that we obtain from and about you during your interaction with our website (opendm.io), our software applications, our web-based platform, and any ancillary services we provide (collectively, the "Service"). We operate with a policy of transparency, ensuring that you remain informed about how your data influences the Service we provide.
                    </Typography>
                    <Typography className="mt-4">
                        By accessing our Service, creating an account, or interacting with our digital presence in any capacity, you signify your unequivocal consent to the terms outlined in this Policy. If you do not agree with any provision within this document, you must cease all use of the Service immediately. This Policy is integrated into and subject to our Terms of Service. We process your data under the legal bases of contractual necessity, legitimate interests, and, where applicable, your explicit consent. We encourage you to read this entire document to fully grasp our commitment to your digital privacy.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">2. THE ROLE OF THE MERCHANT OF RECORD (LEMON SQUEEZY)</Typography>
                    <Typography>
                        A critical component of our Service delivery involves financial transactions and subscription management. To ensure the highest level of security and global compliance, we utilize <strong>Lemon Squeezy, LLC</strong> as our online reseller and official Merchant of Record. This means that when you purchase a subscription or provide payment information, Lemon Squeezy is the legal entity responsible for the sale, financial processing, and tax collection. They handle the complexities of global sales tax, VAT, and PCI-DSS compliance on our behalf, providing a secure environment for your financial identifiers.
                    </Typography>
                    <Typography className="mt-4">
                        Consequently, any data you provide during the checkout process is initially collected and processed by Lemon Squeezy under their own privacy standards and security protocols. We receive only the necessary metadata—such as your subscription status, the specific plan tier you have selected, and non-sensitive billing tokens—to facilitate your access to our premium features. We do not store full credit card numbers or sensitive CVV codes on our servers. We strongly advise you to consult Lemon Squeezy’s Privacy Policy at <Link href="https://www.lemonsqueezy.com/privacy" className="text-primary hover:underline font-bold">lemonsqueezy.com/privacy</Link> to fully understand their processing activities.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">3. CATEGORIES OF PERSONAL DATA COLLECTED</Typography>
                    <Typography>
                        We collect information that identifies, relates to, describes, or could reasonably be linked with you. This data collection is categorized into several streams. First, "Account Identifiers" include your full name, email address, and any profile imagery you provide through third-party authentication services like Google or GitHub. These are essential for establishing your identity within our ecosystem. Second, "Service Engagement Data" includes the names of organizations you create, the custom handles you claim, and the logical configuration of the intake forms you build.
                    </Typography>
                    <Typography className="mt-4">
                        Third, we collect "Professional and Employment-Related Information" if you represent a business entity during your use of our platform. This includes your business name and role. Fourth, we collect "Communication Metadata" when you interact with our support staff or send us feedback. Fifth, we collect "Commercial Information" via Lemon Squeezy, which includes your purchase history and subscription details. We do not collect "Sensitive Personal Information" as defined under various data protection laws, such as biometric data, health information, or precise geolocation, unless explicitly required and disclosed for a specific feature.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">4. METHODS OF DIRECT DATA COLLECTION</Typography>
                    <Typography>
                        Data collection occurs most prominently when you interact directly with the platform interface. When you register for an account, we capture the data sent to us via secure OAuth protocols. When you build a form, we store the specific field types, labels, and validation rules you define. This data is necessary for the platform to render your forms and process incoming submissions correctly. We also collect information when you participate in surveys, sign up for waitlists, or download marketing collateral. Each action you take that involves inputting text or uploading files is a point of direct collection.
                    </Typography>
                    <Typography className="mt-4">
                        Furthermore, we store help desk correspondence to ensure continuity in our support services. If you email us, we retain the email address and the content of the message to better serve your needs in the future. We may also collect information you provide in public forums, social media interactions, or during community events hosted by OpenDM. By providing this information, you represent that you have the legal right to share such data and that it is accurate to the best of your knowledge. Inaccurate data may hinder our ability to provide the Service.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">5. AUTOMATED DATA COLLECTION AND TRACKING</Typography>
                    <Typography>
                        As is standard practice for modern web applications, our servers automatically log certain technical information whenever you visit our site or use the platform. This "Log Data" includes your IP address, browser type, operating system version, the referring web page, and the specific pages you visit on our site. This information is primarily used for security monitoring, load balancing, and diagnostic purposes. It allows us to identify malicious traffic patterns and ensure that our infrastructure remains resilient against unauthorized access attempts or distributed denial-of-service (DDoS) attacks.
                    </Typography>
                    <Typography className="mt-4">
                        We also use "Cookies" and similar tracking technologies (such as web beacons and local storage) to enhance your experience. These allow us to maintain your login session across browser restarts and to remember your UI preferences, such as "dark mode" settings or language selections. We use both session-based cookies, which expire once you close your browser, and persistent cookies, which remain on your device. You can manage your cookie preferences through your browser settings, though disabling certain cookies may render some platform features inoperable. We do not currently respond to "Do Not Track" signals from web browsers.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">6. THIRD-PARTY DATA SOURCES</Typography>
                    <Typography>
                        Beyond the information you provide and what we collect automatically, we receive data from third-party partners. Most significantly, as previously mentioned, we receive transaction and customer data from Lemon Squeezy. This synchronization ensures that your account status (e.g., active, past due, or canceled) is always reflected accurately within your dashboard. We also receive information from identity providers like Clerk or similar authentication services that manage the secure login flow and password security for our platform.
                    </Typography>
                    <Typography className="mt-4">
                        We may also aggregate data from public databases or professional networking sites (like GitHub or LinkedIn) to enrich our understanding of our user base, provided such data is made public by you. This enrichment allows us to tailor our Service offerings and communication strategies to better fit the professional needs of our community. Any third-party data we receive is handled with the same level of care and security as the data we collect directly, and only used in accordance with the permissions granted by you to those third-party services.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">7. PURPOSES FOR PROCESSING PERSONAL DATA</Typography>
                    <Typography>
                        Our processing of your data is strictly governed by the need to provide and improve the Service. The primary purpose is "Service Delivery," which includes account creation, management, and the execution of the core form-building and workflow automation features. Without your data, we cannot route submissions to your inbox or customize the handles that represent your professional brand. We also process data for "Technical Maintenance," which involves monitoring system performance, identifying and fixing software bugs, and optimizing our database queries for faster response times.
                    </Typography>
                    <Typography className="mt-4">
                        Secondly, we process data for "Customer Support and Communication," enabling us to respond to your inquiries and send you critical updates regarding your account or the Service's status. Thirdly, we engage in "Product Development," using aggregated and anonymized usage patterns to determine which features are most valuable and where we should invest our engineering resources. Fourthly, we process data for "Legal and Security Compliance," ensuring that we meet tax obligations, prevent fraudulent use of the platform, and respond to legitimate legal requests from authorities.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">8. LEGAL BASES FOR DATA PROCESSING</Typography>
                    <Typography>
                        Under the General Data Protection Regulation (GDPR), we must define the legal grounds upon which we process your data. The most common ground is "Contractual Necessity," where data processing is required to fulfill our obligations under our Terms of Service (e.g., providing the account you signed up for). The second ground is "Legitimate Interests," where processing is necessary for our business operations and does not override your fundamental rights (e.g., improving platform security or performing basic product analytics).
                    </Typography>
                    <Typography className="mt-4">
                        The third ground is "Consent," where we explicitly ask for your permission before collecting certain data or sending marketing communications. You have the right to withdraw this consent at any time through your account settings. The fourth ground is "Legal Obligation," where we are required by law to process or retain certain data, such as for financial audits or law enforcement requests. By using our Service, you acknowledge these legal bases and understand that our ability to provide the Service is contingent upon these processing activities.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">9. DATA RETENTION AND ARCHIVAL POLICIES</Typography>
                    <Typography>
                        Our retention policy is designed to keep your personal data only for as long as it is necessary to provide the Service and fulfill the purposes described in this Policy. For "Account Data," we retain your information as long as your account remains active. If you choose to delete your account, we trigger a deletion process that removes your personal identifiers from our primary databases within a reasonable timeframe, typically within 60 days, unless a longer retention period is required by law.
                    </Typography>
                    <Typography className="mt-4">
                        For "Inbound Submissions" processed by your forms, you are the controller of that data. We store these submissions on your behalf, and they are retained until you manually delete them or delete your account. "Log Data" and "Usage Statistics" are typically anonymized or purged after 12 months. Please be aware that some data may remain in our encrypted backup archives for a limited duration after deletion from our production systems. We maintain strict security controls over these backups and only access them for disaster recovery purposes.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">10. INTERNAL DATA SECURITY ARCHITECTURE</Typography>
                    <Typography>
                        We take the security of your data seriously and have implemented a multi-layered security architecture. All data transmitted between your browser and our servers is protected using Transport Layer Security (TLS) encryption. At the database level, sensitive information is encrypted at rest using industry-standard AES-256 protocols. We leverage the infrastructure of specialized providers like Convex and Vercel, who maintain rigorous security certifications and world-class physical security for their data centers.
                    </Typography>
                    <Typography className="mt-4">
                        Access to our production databases is strictly limited to a small number of authorized engineers and is protected by multi-factor authentication (MFA). We conduct internal security reviews and utilize automated tools to scan for system vulnerabilities and dependency risks. Despite these measures, it is important to remember that no method of transmission or electronic storage is 100% secure. We cannot guarantee absolute security and encourage you to take personal steps to protect your account, such as using strong passwords and never sharing your login credentials.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">11. EXTERNAL DATA SHARING AND SUB-PROCESSORS</Typography>
                    <Typography>
                        We do not sell your personal data to advertisers or third-party data brokers. We share your information only with trusted "Sub-processors" who are essential to our Service's operation. These include: <strong>Convex, Inc.</strong> (our backend database provider), <strong>Vercel, Inc.</strong> (our hosting and edge network provider), <strong>Lemon Squeezy, LLC</strong> (our payments partner), and <strong>Clerk</strong> or <strong>Convex Auth</strong> (our identity management partners). Each of these partners is bound by contractual obligations to protect your data and only process it according to our instructions.
                    </Typography>
                    <Typography className="mt-4">
                        We may also disclose data to professional advisors such as lawyers, auditors, or insurers when necessary for our business operations. In the event of a "Business Transfer," such as a merger, acquisition, or sale of assets, your information may be among the assets transferred to a new entity. We will provide notice before your personal data is transferred and becomes subject to a different privacy policy. Lastly, we will disclose data if required to do so by law or in the good faith belief that such action is necessary to comply with legal obligations.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">12. INTERNATIONAL DATA TRANSFERS (GLOBAL DISCLOSURE)</Typography>
                    <Typography>
                        OpenDM is a global platform, and your information may be processed and stored in the United States or other countries where our sub-processors maintain operations. These jurisdictions may have data protection laws that differ from those in your home country. By using the Service, you consent to this cross-border transfer of information. We take steps to ensure that your data receives an adequate level of protection regardless of where it is processed. This includes the use of Standard Contractual Clauses (SCCs) approved by the European Commission.
                    </Typography>
                    <Typography className="mt-4">
                        These clauses provide contractual guarantees that your data will be handled in accordance with GDPR-level standards even when it leaves the European Economic Area (EEA). We regularly monitor the legal landscape regarding international data transfers and update our agreements and protocols to remain in compliance with the latest judicial rulings and regulatory guidance. If you have specific questions about where your data is stored or the safeguards in place for international transfers, please contact our privacy team at the address provided at the end of this document.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">13. DATA SUBJECT RIGHTS (EEA AND UK USERS)</Typography>
                    <Typography>
                        If you are located in the European Economic Area (EEA) or the United Kingdom, you have specific rights under the GDPR. These include the "Right of Access" to request a copy of the data we hold about you and the "Right to Rectification" to have any errors corrected. You also have the "Right to Erasure" (the right to be forgotten), allowing you to request the deletion of your data when it is no longer needed. The "Right to Restrict Processing" allows you to limit how we use your data in certain circumstances.
                    </Typography>
                    <Typography className="mt-4">
                        Furthermore, you have the "Right to Data Portability," enabling you to receive your data in a structured, commonly used format. You also have the "Right to Object" to processing based on our legitimate interests or for direct marketing. To exercise any of these rights, please contact us via our support email. We will respond to your request within 30 days. You also have the right to lodge a complaint with your local Data Protection Authority (DPA) if you believe our processing of your data violates applicable law.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">14. CALIFORNIA PRIVACY RIGHTS (CCPA/CPRA)</Typography>
                    <Typography>
                        California residents have additional rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA). You have the right to know what categories of personal information we collect and whether that information is "sold" or "shared" for cross-context behavioral advertising. As stated previously, we do not sell your personal information. You have the right to request the deletion of your personal information and the right to correct inaccurate information. You also have the right to opt-out of the sharing of your data for advertising purposes.
                    </Typography>
                    <Typography className="mt-4">
                        We will not discriminate against you for exercising your CCPA rights; for example, we will not deny you Service or provide a different level of quality. California users may also request a list of the third parties to whom we have disclosed personal information for their direct marketing purposes (under California's "Shine the Light" law). To make a request under the CCPA, please contact us at our legal email. We may require you to provide additional information to verify your identity before reflecting your request in our systems.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">15. CHILDREN’S PRIVACY AND AGE RESTRICTIONS</Typography>
                    <Typography>
                        The Service is intended for professional use by individuals aged 18 and older. We do not knowingly collect personal information from children under the age of 13 (or 16 in certain jurisdictions inside the European Union). Protectively, if we become aware that we have inadvertently collected data from a minor without verifiable parental consent, we will take immediate steps to remove that information from our active and backup systems. Our platform does not contain content directed at children.
                    </Typography>
                    <Typography className="mt-4">
                        If you are a parent or legal guardian and you believe that your child has provided us with personal information, please contact us immediately at our support email. We will work with you to locate and delete the data. We encourage parents to take an active role in their children’s online activities and to use parental control tools where appropriate to ensure a safe digital environment. We strictly adhere to the Children's Online Privacy Protection Act (COPPA) and similar global regulations.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">16. PRODUCT ANALYTICS AND PERFORMANCE MONITORING</Typography>
                    <Typography>
                        Aggregated data is a vital tool for maintaining a high-quality platform. We use internal tools and occasionally third-party analytics providers (like PostHog or Google Analytics) to monitor user behavior at scale. This data is typically stripped of direct identifiers and used to generate heatmaps, clickstream reports, and funnel analyses. We use this information to understand where users encounter friction and to prioritize the development of new features that solve real-world problems for our community.
                    </Typography>
                    <Typography className="mt-4">
                        We may also use performance monitoring tools to capture technical errors in real-time. These tools help our engineering team identify bug patterns and deploy hotfixes before they impact the broader user base. The data collected by these tools is strictly for internal improvement and is never used to build advertisement profiles or sold to external marketing agencies. You can opt-out of certain third-party tracking through your browser's "privacy" settings or by using browser extensions designed to block trackers.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">17. USER CONTENT AND PRIVACY RESPONSIBILITY</Typography>
                    <Typography>
                        As a platform that enables the creation of intake forms, you (the User) are responsible for the privacy of the data you collect from third parties through OpenDM. We act as a "Data Processor" for the submissions you receive, while you act as the "Data Controller." This means you are responsible for ensuring that your own use of OpenDM complies with privacy laws, including providing your own privacy notice to your form respondents and obtaining any necessary consents for the data you capture.
                    </Typography>
                    <Typography className="mt-4">
                        You must not use OpenDM to collect sensitive information—such as government-issued identification numbers, precise health data, or financial credentials—unless you have implemented the necessary legal safeguards and are on a platform tier that supports such collection. We provide the tools for you to manage the data you collect, including deletion and export features, but the ultimate responsibility for the ethical use of that data rests with you. We reserve the right to suspend accounts that are found to be using the Service for deceptive or illegal data collection practices.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">18. COOKIE POLICY AND LOCAL STORAGE DISCLOSURE</Typography>
                    <Typography>
                        We use both cookies and browser "Local Storage" to provide a seamless user experience. Cookies are small data files stored on your hard drive, while Local Storage is a mechanism for storing key-value pairs in the web browser. We use "Necessary Cookies" for core platform functionality, such as security and session management. "Preference Cookies" allow us to remember your settings between visits. "Analytical Cookies" help us understand how users interact with our marketing pages.
                    </Typography>
                    <Typography className="mt-4">
                        You can view a detailed list of the cookies we use by inspecting your browser's privacy settings. You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, please be aware that if you choose to decline cookies, you may not be able to sign in or use other interactive features of our Service that depend on cookies. Local Storage is primarily used to store ephemeral UI state and is cleared when you log out or clear your browser history.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">19. THIRD-PARTY LINKS AND EXTERNAL SERVICES</Typography>
                    <Typography>
                        The Service may contain links to external websites or services that are not operated by OpenDM. Please be aware that we have no control over the content and privacy practices of these third-party sites and cannot accept responsibility or liability for their respective privacy policies. When you click on a link that takes you away from opendm.io, you are subject to the terms and privacy policy of that new site. We encourage you to review the privacy notices of every site you visit.
                    </Typography>
                    <Typography className="mt-4">
                        This include links to social media platforms, professional networks, and the websites of our business partners. Furthermore, if you integrate OpenDM with other software via webhooks or APIs, you are responsible for the data security of those integrations. We provide secure endpoints for data transmission, but the security of the destination system is outside of our control. Always ensure that the third-party services you connect to OpenDM meet your own standards for data protection and privacy.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">20. MODIFICATIONS TO THIS PRIVACY POLICY</Typography>
                    <Typography>
                        We reserve the right to update or change our Privacy Policy at any time. Any changes will be effective immediately upon posting the revised Policy on our website. If we make material changes to how we treat our users' personal information, we will notify you through a notice on our website's homepage or via the email address associated with your account. The date the Privacy Policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date, active, and deliverable email address for you.
                    </Typography>
                    <Typography className="mt-4">
                        We also encourage you to periodically review this Privacy Policy to stay informed about how we are protecting information we collect. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy. If you do not agree with the updated terms, your only recourse is to stop using the Service and request the deletion of your account and personal data.
                    </Typography>
                </section>

                <section>
                    <Typography variant="h2" className="text-xl font-bold mb-4 border-b pb-2">21. CONTACT INFORMATION AND GRIEVANCE REDRESSAL</Typography>
                    <Typography>
                        If you have any questions, concerns, or complaints about this Privacy Policy or our data handling practices, please do not hesitate to contact our dedicated privacy team. We are committed to resolving any grievances in a timely and transparent manner. You can reach us via email at: <strong>support@opendm.io</strong>. For formal legal inquiries, please address your correspondence to "OpenDM Legal Department" at the same email address.
                    </Typography>
                    <Typography className="mt-4">
                        We strive to acknowledge all privacy-related inquiries within 48 hours and provide a substantive response within 30 days. If your concern involves data processed by our Merchant of Record, we may coordinate with Lemon Squeezy to provide a comprehensive answer. We take your feedback seriously as it helps us refine our privacy posture and better serve our global community of creators and businesses. Thank you for trusting OpenDM with your digital presence.
                    </Typography>
                </section>
            </div>


        </div>
    );
}
