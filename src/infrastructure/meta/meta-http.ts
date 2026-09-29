import type {
  MetaDestination,
  MetaErrorResponse,
  MetaMessage,
  MetaSendResponse,
} from "./meta.types.js";

export const MetaHttp = {
  async sendMessage(message: MetaMessage, destination: MetaDestination): Promise<string> {
    const { apiUrl, authToken } = getConfig();

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        ...destination,
        ...message,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const reason = (data as MetaErrorResponse | null)?.error?.message ?? response.statusText;
      throw new Error(`Meta API error: ${reason}`);
    }

    const messageId = (data as MetaSendResponse | null)?.messages?.[0]?.id;
    if (!messageId) throw new Error("Meta API response did not include a message id");

    return messageId;
  },
};

function getConfig() {
  const apiUrl = process.env.META_API_URL;
  if (!apiUrl) throw new Error("META_API_URL is not set");

  const authToken = process.env.META_AUTH_TOKEN;
  if (!authToken) throw new Error("META_AUTH_TOKEN is not set");

  return { apiUrl, authToken };
}
