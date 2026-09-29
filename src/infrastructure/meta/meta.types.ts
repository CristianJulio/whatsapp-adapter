// Request

type TextMessage = {
  type: "text";
  text: { preview_url: boolean; body: string };
};

type ImageMessage = {
  type: "image";
  image: { link: string };
};

export type MetaMessage = TextMessage | ImageMessage;

export type MetaDestination = { to: string } | { recipient: string };

// Response

export type MetaSendResponse = {
  messaging_product: string;
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
};

export type MetaErrorResponse = {
  error?: { message?: string };
};
