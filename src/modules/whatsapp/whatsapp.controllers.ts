import { WhatsappService } from "./whatsapp.service.js";
import type {
  MessagesValue,
  StatusesValue,
  WebhookValue,
  WhatsappWebhookDto,
} from "./dto/whatsapp-webhook.dto.js";
import type { Request, Response } from "express";

export const WhatsappControllers = {
  verify(req: Request, res: Response) {
    const hub = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const verifyToken = req.query["hub.verify_token"];

    if (hub === "subscribe" && verifyToken === process.env.META_TOKEN) {
      console.log("Meta webhook verified");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(400);
    }
  },

  inbound(req: Request, res: Response) {
    res.sendStatus(200);

    const payload: WhatsappWebhookDto = req.body;

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;

        if (hasMessages(value)) {
          WhatsappService.handleIncomingMessage(value);
          console.log("It's a message!", value.messages[0]?.text);
        } else if (hasStatuses(value)) {
          console.log("It's a status update!", value.statuses[0]?.status);
        } else {
          console.warn("Unknown webhook payload", value);
        }
      }
    }
  },
};

function hasMessages(value: WebhookValue): value is MessagesValue {
  return Array.isArray(value.messages);
}

function hasStatuses(value: WebhookValue): value is StatusesValue {
  return Array.isArray(value.statuses);
}
