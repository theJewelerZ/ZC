import type { Metadata } from "next";

import { businessConfig } from "@/config/business";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  description: "How the Zarka Construction website handles consultation information, optional room photos, analytics, and service-provider processing.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <main className="legal-page" id="main-content"><header className="legal-hero"><div className="site-container"><p className="eyebrow">Website information</p><h1>Privacy</h1><p>Effective {businessConfig.effectiveDate}</p></div></header><article className="site-container legal-content">
    <p className="legal-intro">This notice explains how the Zarka Construction website handles information submitted through the consultation form, optional room photographs, website analytics, and supporting service providers. It is a practical starter notice and is not presented as attorney-reviewed legal advice.</p>
    <h2>Information you choose to provide</h2><p>The consultation form asks for your name, email address, optional phone number, general project location, project and review preferences, approximate timeline, project description, and optional room context, dimensions, equipment information, referral source, photo captions, and up to ten optional room photographs. Please do not submit payment information, credentials, private documents, or photographs of people without permission.</p>
    <h2>How consultation information is used</h2><p>Submitted information is stored and used to evaluate the room and inquiry, respond to you, document follow-up, maintain security, and troubleshoot delivery. Approximate measurements and photographs may require field verification. A submission is not a feasibility finding, construction agreement, price, schedule promise, or acceptance of work.</p>
    <h2>Storage, delivery, and security providers</h2><p>The website is hosted by Vercel. Supabase processes and privately stores consultation records, optional room photographs, and founder authentication. Resend processes founder notifications and customer confirmations. Cloudflare Turnstile may process technical request information to reduce automated abuse. The form also uses server validation, a hidden anti-spam field, timing checks, and request-rate controls.</p><p>Room photographs are stored in a private bucket and are not given permanent public URLs. Authorized dashboard viewing uses short-lived signed links. Access is restricted, but no internet system can be represented as risk-free.</p>
    <h2>Analytics</h2><p>Vercel Web Analytics may process aggregate page use and a small set of events such as consultation CTA activation and form completion. Custom events are not designed to include names, email addresses, phone numbers, exact locations, descriptions, captions, filenames, photographs, or consultation content.</p>
    <h2>Retention and sharing</h2><p>Incomplete upload sessions expire and are cleaned up. Completed inquiries and optional photographs are retained according to legitimate inquiry, business, project, and legal needs. Information is not sold through this website. Service providers may process information to host, secure, store, measure, or deliver the website, and this notice does not promise that third-party processors retain nothing.</p>
    <h2>Correction or deletion requests</h2><p>You may ask Zarka Construction to correct or delete consultation information. Reasonable identity verification may be required, and a request may be limited when retention is necessary for legitimate business or legal obligations. Until a public email or phone is approved for display, use the website consultation form and identify the request without uploading additional sensitive material.</p>
    <h2>Notice updates</h2><p>This notice may be revised when collection, storage, analytics, providers, retention, or business contact practices materially change. The effective date above identifies the current published version.</p>
  </article></main>;
}
