import { MessageService } from "./messages.service.js";
import { SendRequestSchema, type SendReply } from "./dto/send.dto.js";
import { z } from "zod";
import grpc from "@grpc/grpc-js";
import type { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";

export const MessagesGrpc = {
  Send: async (call: ServerUnaryCall<unknown, SendReply>, callback: sendUnaryData<SendReply>) => {
    const parsed = SendRequestSchema.safeParse(call.request);

    if (!parsed.success) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: z.prettifyError(parsed.error),
      });
    }

    try {
      const messageId = await MessageService.sendMessage(parsed.data);
      callback(null, { message_id: messageId });
    } catch (err) {
      console.error("Failed to send message:", err);
      callback({
        code: grpc.status.INTERNAL,
        details: err instanceof Error ? err.message : "Failed to send message",
      });
    }
  },
};
