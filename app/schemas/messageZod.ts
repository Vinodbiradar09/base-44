import {z} from "zod";

export const contentZod = z.object({
  content: z.string().min(1, "Content is required").max(500000, "Content is too long"),
});

export const messageZod = z.object({
    chatId : z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1, "Content is required").max(500000, "Content is too long"),
});