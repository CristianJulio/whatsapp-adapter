import { MetaHttp } from "../../infrastructure/meta/meta-http.js";
import type {
  MetaDestination,
  MetaInteractive,
  MetaMessage,
} from "../../infrastructure/meta/meta.types.js";
import type { InteractiveContent, SendRequest } from "./dto/send.dto.js";

export const MessageService = {
  async sendMessage(dto: SendRequest): Promise<string> {
    return MetaHttp.sendMessage(toMetaMessage(dto), toMetaDestination(dto));
  },
};

function toMetaMessage(dto: SendRequest): MetaMessage {
  switch (dto.content) {
    case "text":
      return { type: "text", text: dto.text };
    case "image":
      return { type: "image", image: dto.image };
    case "interactive":
      return { type: "interactive", interactive: toMetaInteractive(dto.interactive) };
  }
}

function toMetaInteractive(content: InteractiveContent): MetaInteractive {
  // Unset optional fields arrive as null or "", Meta expects them to be omitted
  const frame = {
    ...(content.header && { header: { type: "text" as const, text: content.header.text } }),
    body: { text: content.body_text },
    ...(content.footer_text && { footer: { text: content.footer_text } }),
  };

  switch (content.type) {
    case "list":
      return {
        ...frame,
        type: "list",
        action: {
          button: content.list.button,
          sections: content.list.sections.map((section) => ({
            ...(section.title && { title: section.title }),
            rows: section.rows.map(({ description, ...row }) => ({
              ...row,
              ...(description && { description }),
            })),
          })),
        },
      };
    case "button":
      return {
        ...frame,
        type: "button",
        action: {
          buttons: content.button.buttons.map((reply) => ({ type: "reply", reply })),
        },
      };
    case "request_contact_info":
      return {
        ...frame,
        type: "request_contact_info",
        action: { name: "request_contact_info" },
      };
  }
}

function toMetaDestination(dto: SendRequest): MetaDestination {
  return dto.destination === "to" ? { to: dto.to } : { recipient: dto.recipient };
}
