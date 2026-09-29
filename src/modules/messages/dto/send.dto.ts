import { z } from "zod";

const TextContentSchema = z.object({
  preview_url: z.boolean(),
  body: z.string().trim().min(1).max(4096),
});

const ImageContentSchema = z.object({
  link: z.url(),
});

// Interactive

const InteractiveBodyTextSchema = (max: number) => z.string().trim().min(1).max(max);

const InteractiveFrameSchema = {
  // Optional message field: the loader sends null when it's unset
  header: z.object({ text: z.string().trim().min(1).max(60) }).nullish(),
  // Optional string field: the loader sends "" when it's unset
  footer_text: z.string().trim().max(60),
};

const ListRowSchema = z.object({
  id: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(24),
  description: z.string().trim().max(72), // Optional: proto sends "" when unset
});

const ListSectionSchema = z.object({
  title: z.string().trim().max(24),
  rows: z.array(ListRowSchema).min(1),
});

const ListActionSchema = z
  .object({
    button: z.string().trim().min(1).max(20),
    sections: z.array(ListSectionSchema).min(1).max(10),
  })
  .superRefine((action, ctx) => {
    const rows = action.sections.flatMap((section) => section.rows);

    if (rows.length > 10) {
      ctx.addIssue({
        code: "custom",
        message: "A list can have at most 10 rows across all sections",
        path: ["sections"],
      });
    }

    if (action.sections.length > 1) {
      action.sections.forEach((section, index) => {
        if (!section.title) {
          ctx.addIssue({
            code: "custom",
            message: "Section title is required when there is more than one section",
            path: ["sections", index, "title"],
          });
        }
      });
    }

    for (const id of findDuplicates(rows.map((row) => row.id))) {
      ctx.addIssue({ code: "custom", message: `Duplicate row id "${id}"`, path: ["sections"] });
    }
  });

const ReplyButtonSchema = z.object({
  id: z.string().trim().min(1).max(256),
  title: z.string().trim().min(1).max(20),
});

const ButtonActionSchema = z
  .object({
    buttons: z.array(ReplyButtonSchema).min(1).max(3),
  })
  .superRefine((action, ctx) => {
    for (const id of findDuplicates(action.buttons.map((button) => button.id))) {
      ctx.addIssue({ code: "custom", message: `Duplicate button id "${id}"`, path: ["buttons"] });
    }

    for (const title of findDuplicates(action.buttons.map((button) => button.title))) {
      ctx.addIssue({ code: "custom", message: `Duplicate button title "${title}"`, path: ["buttons"] });
    }
  });

const RequestContactInfoActionSchema = z.object({});

const InteractiveContentSchema = z.discriminatedUnion("type", [
  z.object({
    ...InteractiveFrameSchema,
    type: z.literal("list"),
    body_text: InteractiveBodyTextSchema(4096),
    list: ListActionSchema,
  }),
  z.object({
    ...InteractiveFrameSchema,
    type: z.literal("button"),
    body_text: InteractiveBodyTextSchema(1024),
    button: ButtonActionSchema,
  }),
  z.object({
    ...InteractiveFrameSchema,
    type: z.literal("request_contact_info"),
    body_text: InteractiveBodyTextSchema(1024),
    request_contact_info: RequestContactInfoActionSchema,
  }),
]);

// Request

const DestinationSchema = z.discriminatedUnion("destination", [
  z.object({ destination: z.literal("to"), to: z.string().regex(/^\+?\d{7,15}$/) }),
  z.object({ destination: z.literal("recipient"), recipient: z.string().trim().min(1) }),
]);

const ContentSchema = z.discriminatedUnion("content", [
  z.object({ content: z.literal("text"), text: TextContentSchema }),
  z.object({ content: z.literal("image"), image: ImageContentSchema }),
  z.object({ content: z.literal("interactive"), interactive: InteractiveContentSchema }),
]);

export const SendRequestSchema = z.intersection(DestinationSchema, ContentSchema);

export type TextContent = z.infer<typeof TextContentSchema>;
export type ImageContent = z.infer<typeof ImageContentSchema>;
export type InteractiveContent = z.infer<typeof InteractiveContentSchema>;
export type SendRequest = z.infer<typeof SendRequestSchema>;

export type SendReply = {
  message_id: string;
};

function findDuplicates(values: string[]): string[] {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}
