import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .trim()
    .toLowerCase(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long (max 2000 characters)")
    .trim(),
  // Honeypot — must be empty (bots fill this, humans don't)
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type ContactSchema = z.infer<typeof contactSchema>;
