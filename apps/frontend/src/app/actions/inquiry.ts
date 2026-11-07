"use server";

import { createClient } from "next-sanity";
import { Resend } from "resend";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-05-23",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export interface InquiryData {
  name: string;
  email: string;
  location: string;
  scope: string;
  budget: string;
  message: string;
}

export type InquiryResult =
  { success: true } | { success: false; error: string };

export async function submitInquiry(
  formData: FormData,
): Promise<InquiryResult> {
  const data: InquiryData = {
    name: (formData.get("name") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    location: (formData.get("location") as string) ?? "",
    scope: (formData.get("scope") as string) ?? "",
    budget: (formData.get("budget") as string) ?? "",
    message: (formData.get("message") as string) ?? "",
  };

  if (!data.name || !data.email || !data.message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  let inquiryId: string;
  try {
    const created = await writeClient.create({
      _type: "inquirySubmission",
      name: data.name,
      email: data.email,
      location: data.location,
      scope: data.scope,
      budget: data.budget,
      message: data.message,
      submittedAt: new Date().toISOString(),
      status: "new",
      emailSent: false,
    });
    inquiryId = created._id;
  } catch (err) {
    console.error("[Inquiry] Sanity write failed:", err);
    return {
      success: false,
      error: "Failed to save your inquiry. Please try again.",
    };
  }

  let emailSent = false;
  try {
    const { error: sendError } = await resend.emails.send({
      from: "Emery Studio <noreply@emerydesign.studio>",
      to: process.env.RESEND_TO_EMAIL!,
      subject: `New inquiry from ${data.name}`,
      html: `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Location:</strong> ${data.location || "—"}</p>
        <p><strong>Scope:</strong> ${data.scope || "—"}</p>
        <p><strong>Budget:</strong> ${data.budget || "—"}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    });
    if (sendError) throw sendError;
    emailSent = true;
  } catch (err) {
    // Email failure is non-fatal — submission is already saved in Sanity,
    // and its `emailSent: false` flags it for manual follow-up in Studio.
    console.error("[Inquiry] Resend failed:", err);
  }

  if (emailSent) {
    try {
      await writeClient.patch(inquiryId).set({ emailSent: true }).commit();
    } catch (err) {
      // Worst case the doc still says emailSent: false — errs toward a
      // harmless manual check rather than a missed lead.
      console.error("[Inquiry] emailSent patch failed:", err);
    }
  }

  return { success: true };
}
