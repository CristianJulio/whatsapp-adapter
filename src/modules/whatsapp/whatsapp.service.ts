import type { MessagesValue } from "./dto/whatsapp-webhook.dto.js";

export const WhatsappService = {
  handleIncomingMessage(value: MessagesValue) {
    console.log(value);
  },
};
