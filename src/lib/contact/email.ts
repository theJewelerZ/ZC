import type { ContactPayload } from "@/lib/contact/schema";
import {
  consultationOptions,
  serviceOptions,
  timelineOptions,
} from "@/config/business";

type SendEmailInput = {
  payload: ContactPayload;
  correlationId: string;
  recipient: string;
  sender: string;
  apiKey: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildContactEmail(
  payload: ContactPayload,
  correlationId: string,
) {
  const serviceLabel =
    serviceOptions.find((option) => option.value === payload.service)?.label ||
    payload.service;
  const consultationLabel =
    consultationOptions.find(
      (option) => option.value === payload.consultationPreference,
    )?.label || payload.consultationPreference;
  const timelineLabel =
    timelineOptions.find((option) => option.value === payload.timeline)?.label ||
    payload.timeline;
  const submittedAt = new Date().toISOString();
  const subject = `New simulator room inquiry — ${correlationId.slice(0, 8)}`;
  const text = [
    "New simulator room consultation request",
    `Reference: ${correlationId}`,
    `Submitted: ${submittedAt}`,
    "",
    "Contact and room details",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    ...(payload.phone ? [`Phone: ${payload.phone}`] : []),
    `General location: ${payload.location}`,
    `Project type: ${serviceLabel}`,
    `Preferred room review: ${consultationLabel}`,
    `Timeline: ${timelineLabel}`,
    ...(payload.referralSource
      ? [`Referral source: ${payload.referralSource}`]
      : []),
    "",
    "Room and project description",
    payload.description,
  ].join("\n");

  const rows = [
    ["Reference", correlationId],
    ["Submitted", submittedAt],
    ["Name", payload.name],
    ["Email", payload.email],
    ...(payload.phone ? [["Phone", payload.phone]] : []),
    ["General location", payload.location],
    ["Project type", serviceLabel],
    ["Preferred room review", consultationLabel],
    ["Timeline", timelineLabel],
    ...(payload.referralSource
      ? [["Referral source", payload.referralSource]]
      : []),
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;color:#121820;line-height:1.55;max-width:720px;margin:0 auto">
      <h1 style="color:#0B1F33;font-size:24px;margin:0 0 20px">New simulator room consultation request</h1>
      <table style="border-collapse:collapse;width:100%;max-width:680px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th style="border-bottom:1px solid #D8DEE5;padding:9px 12px 9px 0;text-align:left;vertical-align:top;width:150px">${escapeHtml(label)}</th>
                <td style="border-bottom:1px solid #D8DEE5;padding:9px 0">${escapeHtml(value)}</td>
              </tr>`,
          )
          .join("")}
      </table>
      <h2 style="color:#0B1F33;font-size:18px;margin-top:28px">Room and project description</h2>
      <p style="white-space:pre-wrap;margin-bottom:0">${escapeHtml(payload.description)}</p>
    </div>`;

  return { subject, text, html };
}

export async function sendContactEmail({
  payload,
  correlationId,
  recipient,
  sender,
  apiKey,
}: SendEmailInput) {
  const message = buildContactEmail(payload, correlationId);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: payload.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected the request with status ${response.status}`);
  }

  return (await response.json()) as { id?: string };
}