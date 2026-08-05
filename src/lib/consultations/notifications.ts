import "server-only";

import type { Database } from "@/lib/supabase/database.types";
import { businessConfig } from "@/config/business";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

async function sendResend(apiKey: string, message: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Resend rejected notification with status ${response.status}`);
  return response.json() as Promise<{ id?: string }>;
}

export function buildFounderNotification(consultation: Consultation, photoCount: number, dashboardUrl: string) {
  const rows = [
    ["Reference", consultation.id], ["Name", consultation.name], ["Email", consultation.email],
    ...(consultation.phone ? [["Phone", consultation.phone]] : []),
    ["General location", consultation.project_location], ["Project setting", consultation.project_setting],
    ["Review preference", consultation.review_preference],
    ...(consultation.desired_timeline ? [["Timeline", consultation.desired_timeline]] : []),
    ["Photos", String(photoCount)],
  ];
  const text = [
    "New simulator consultation", ...rows.map(([label, value]) => `${label}: ${value}`),
    "", "Project description", consultation.project_description, "", `Secure dashboard: ${dashboardUrl}`,
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;color:#121820;line-height:1.55;max-width:720px;margin:0 auto"><h1 style="color:#0B1F33;font-size:24px">New simulator consultation</h1><table style="border-collapse:collapse;width:100%">${rows.map(([label,value]) => `<tr><th style="border-bottom:1px solid #D8DEE5;padding:9px 12px 9px 0;text-align:left;vertical-align:top">${escapeHtml(label)}</th><td style="border-bottom:1px solid #D8DEE5;padding:9px 0">${escapeHtml(value)}</td></tr>`).join("")}</table><h2 style="color:#0B1F33;font-size:18px;margin-top:28px">Project description</h2><p style="white-space:pre-wrap">${escapeHtml(consultation.project_description)}</p><p><a href="${escapeHtml(dashboardUrl)}">Review this consultation securely</a></p></div>`;
  return { subject: `New simulator consultation — ${consultation.id.slice(0, 8)}`, text, html };
}

export function buildCustomerConfirmation(consultation: Consultation) {
  const text = [
    `Hello ${consultation.name},`, "",
    "Zarka Construction received your simulator consultation request.",
    "We will review the room information and any optional photos before following up.",
    "This confirmation does not establish feasibility, price, schedule, acceptance, or a construction agreement.",
    "Approximate measurements and photographs may require on-site verification.", "",
    `Reference: ${consultation.id}`, "", businessConfig.tagline,
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;color:#121820;line-height:1.6;max-width:680px;margin:0 auto"><h1 style="color:#0B1F33;font-size:24px">We received your consultation request.</h1><p>Hello ${escapeHtml(consultation.name)},</p><p>Zarka Construction will review the room information and any optional photos before following up.</p><p>This confirmation does not establish feasibility, price, schedule, acceptance, or a construction agreement. Approximate measurements and photographs may require on-site verification.</p><p style="color:#66717D">Reference: ${escapeHtml(consultation.id)}</p><p><strong>${escapeHtml(businessConfig.tagline)}</strong></p></div>`;
  return { subject: "Your Zarka Construction consultation request", text, html };
}

export async function sendConsultationNotifications(consultation: Consultation, photoCount: number) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL?.trim();
  const sender = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !recipient || !sender) return { status: "failed" as const, error: "Email notification configuration is incomplete." };

  const dashboardUrl = `${businessConfig.canonicalUrl}/admin/consultations/${consultation.id}`;
  let founderSent = false;
  let customerSent = false;
  const errors: string[] = [];
  try {
    await sendResend(apiKey, { from: sender, to: [recipient], reply_to: consultation.email, ...buildFounderNotification(consultation, photoCount, dashboardUrl) });
    founderSent = true;
  } catch {
    errors.push("Founder notification failed.");
  }
  try {
    await sendResend(apiKey, { from: sender, to: [consultation.email], reply_to: recipient, ...buildCustomerConfirmation(consultation) });
    customerSent = true;
  } catch {
    errors.push("Customer confirmation failed.");
  }
  return {
    status: founderSent && customerSent ? "sent" as const : founderSent || customerSent ? "partial" as const : "failed" as const,
    error: errors.length ? errors.join(" ") : null,
  };
}
