import { MetaHttp } from "../../infrastructure/meta/meta-http.js";
import type { MetaDestination, MetaMessage } from "../../infrastructure/meta/meta.types.js";
import type { SendRequest } from "./dto/send.dto.js";

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
  }
}

function toMetaDestination(dto: SendRequest): MetaDestination {
  return dto.destination === "to" ? { to: dto.to } : { recipient: dto.recipient };
}
