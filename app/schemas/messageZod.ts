import {z} from "zod";

export const messageZod = z.object({
    chatId : z.string().optional(),
    userId : z.string(),
    role: z.enum(["user", "assistant"]),
     content: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(100000, "Message too long"),
});

export const contentZod = z.object({
    content : z.string(),
})