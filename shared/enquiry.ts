import { z } from "zod";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
  status: "new" | "read";
  createdAt: string;
}

/* `website` is a honeypot: it is hidden from real users, so anything that fills it in is a bot.
   Kept in the schema (rather than stripped) so the route can reject the submission. */
export const enquiryInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().min(1, "Phone number is required").max(40),
  service: z.string().trim().max(120).default(""),
  subject: z.string().trim().max(200).default(""),
  message: z.string().trim().min(1, "Message is required").max(4000),
  website: z.string().trim().max(200).optional(),
});

export type EnquiryInput = z.infer<typeof enquiryInputSchema>;
