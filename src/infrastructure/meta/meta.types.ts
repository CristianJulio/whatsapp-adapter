// Request

type TextMessage = {
  type: "text";
  text: { preview_url: boolean; body: string };
};

type ImageMessage = {
  type: "image";
  image: { link: string };
};

type InteractiveMessage = {
  type: "interactive";
  interactive: MetaInteractive;
};

export type MetaMessage = TextMessage | ImageMessage | InteractiveMessage;

// Interactive

type InteractiveFrame = {
  header?: { type: "text"; text: string };
  body: { text: string };
  footer?: { text: string };
};

type ListInteractive = InteractiveFrame & {
  type: "list";
  action: {
    button: string;
    sections: {
      title?: string;
      rows: { id: string; title: string; description?: string }[];
    }[];
  };
};

type ButtonInteractive = InteractiveFrame & {
  type: "button";
  action: {
    buttons: { type: "reply"; reply: { id: string; title: string } }[];
  };
};

type RequestContactInfoInteractive = InteractiveFrame & {
  type: "request_contact_info";
  action: { name: string };
};

export type MetaInteractive = ListInteractive | ButtonInteractive | RequestContactInfoInteractive;

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
