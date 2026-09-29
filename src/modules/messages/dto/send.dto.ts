import { z } from "zod";

const TextContentSchema = z.object({
  preview_url: z.boolean(),
  body: z.string().trim().min(1).max(4096),
});

const ImageContentSchema = z.object({
  link: z.url(),
});

const DestinationSchema = z.discriminatedUnion("destination", [
  z.object({ destination: z.literal("to"), to: z.string().regex(/^\+?\d{7,15}$/) }),
  z.object({ destination: z.literal("recipient"), recipient: z.string().trim().min(1) }),
]);

const ContentSchema = z.discriminatedUnion("content", [
  z.object({ content: z.literal("text"), text: TextContentSchema }),
  z.object({ content: z.literal("image"), image: ImageContentSchema }),
]);

export const SendRequestSchema = z.intersection(DestinationSchema, ContentSchema);

export type TextContent = z.infer<typeof TextContentSchema>;
export type ImageContent = z.infer<typeof ImageContentSchema>;
export type SendRequest = z.infer<typeof SendRequestSchema>;

export type SendReply = {
  message_id: string;
};
