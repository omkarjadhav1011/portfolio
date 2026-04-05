"use server";

import { contactSchema } from "@/lib/validations";
import { getResend } from "@/lib/resend";
import { profile } from "@/data/profile";

export interface ContactActionResult {
  success: boolean;
  message: string;
}

export async function sendContactEmail(
  formData: FormData
): Promise<ContactActionResult> {
  // Parse form data
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    honeypot: formData.get("honeypot"),
  };

  // Validate
  const result = contactSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.errors[0]?.message ?? "Invalid form data";
    return { success: false, message: firstError };
  }

  const { name, email, message } = result.data;

  // Honeypot check (extra safety)
  if (raw.honeypot) {
    // Silently succeed — don't tell bots they were detected
    return { success: true, message: "Message delivered to origin/inbox" };
  }

  try {
    const resend = getResend();
    const toEmail = process.env.CONTACT_TO_EMAIL ?? profile.email;

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      reply_to: email,
      subject: `[Portfolio] New message from ${name}`,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; background: #0d1117; color: #e6edf3; padding: 24px; border-radius: 8px; border: 1px solid #30363d;">
          <h2 style="color: #00ff88; margin: 0 0 16px;">$ git send-email --incoming</h2>
          <p style="color: #8b949e; margin: 0 0 16px;">New message from your portfolio contact form</p>
          <hr style="border: none; border-top: 1px solid #30363d; margin: 16px 0;" />
          <p><span style="color: #58a6ff;">From:</span> ${name} &lt;${email}&gt;</p>
          <p><span style="color: #58a6ff;">Date:</span> ${new Date().toISOString()}</p>
          <hr style="border: none; border-top: 1px solid #30363d; margin: 16px 0;" />
          <pre style="white-space: pre-wrap; color: #c9d1d9; line-height: 1.6;">${message}</pre>
          <hr style="border: none; border-top: 1px solid #30363d; margin: 16px 0;" />
          <p style="color: #484f58; font-size: 12px;">Reply directly to this email to respond to ${name}</p>
        </div>
      `,
    });

    return {
      success: true,
      message: "Message delivered to origin/inbox",
    };
  } catch (error) {
    console.error("[contact] Email send failed:", error);
    return {
      success: false,
      message: "fatal: failed to connect to remote — try again later",
    };
  }
}
