"use server";

export interface InquiryData {
  name: string;
  email: string;
  location: string;
  scope: string;
  budget: string;
  message: string;
}

export interface InquiryResult {
  success: boolean;
  error?: string;
}

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

  // Stub: log and return success. Replace body with Resend / Sanity write.
  console.log("[Inquiry stub]", data);

  return { success: true };
}
