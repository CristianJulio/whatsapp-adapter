import type { Request, Response, NextFunction } from "express";
import type { IncomingMessageDto } from "./dto/incoming-message.dto.js";
import type { IncomingStatusDto } from "./dto/incoming-status.dto.js";

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

    const payload: IncomingMessageDto | IncomingStatusDto = req.body;

    const payloadType = isMessageOrStatus(payload);
    if (payloadType === "MESSAGE") {
      console.log(
        "It's a message!",
        (payload as IncomingMessageDto).entry[0]?.changes[0]?.value.messages[0]?.text,
      );
      return;
    }

    console.log(
      "It's a status update!",
      (payload as IncomingStatusDto).entry[0]?.changes[0]?.value.statuses[0]?.status,
    );
    // console.dir(req.body, { depth: null, colors: true });
  },
};

function isMessageOrStatus(dto: IncomingMessageDto | IncomingStatusDto) {
  const value = dto.entry[0]?.changes[0]?.value;
  if (!value) throw new Error("Unknown payload");

  if (Object.hasOwn(value, "messages")) return "MESSAGE";

  return "STATUS";
}
