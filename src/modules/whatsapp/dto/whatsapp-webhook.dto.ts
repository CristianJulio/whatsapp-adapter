export type WhatsappWebhookDto = {
  object: "whatsapp_business_account";
  entry: Entry[];
};

type Entry = {
  id: string;
  changes: Change[];
};

type Change = {
  value: WebhookValue;
  field: "messages";
};

export type WebhookValue = {
  messaging_product: "whatsapp";
  metadata: Metadata;
  contacts?: Contact[];
  messages?: Message[];
  statuses?: Status[];
};

export type MessagesValue = WebhookValue & { messages: Message[] };
export type StatusesValue = WebhookValue & { statuses: Status[] };

type Metadata = {
  display_phone_number: string;
  phone_number_id: string;
};

type Contact = {
  profile?: Profile;
  wa_id: string;
  user_id: string;
};

type Profile = { name: string; username: string };

export type Message = TextMessage;

type TextMessage = {
  from: string;
  from_user_id: string;
  id: string;
  timestamp: string;
  text: TextMessageBody;
  type: "text";
};

type TextMessageBody = { body: string };

export type Status = DeliveredStatus | SentStatus | ReadStatus | FailedStatus;

type DeliveredStatus = {
  id: string;
  status: "delivered";
  timestamp: string;
  recipient_id: string;
  recipient_user_id: string;
  conversation: {
    id: string;
    origin: { type: string };
  };
  pricing: {
    billable: boolean;
    pricing_model: string;
    category: string;
    type: string;
  };
};

type SentStatus = {
  id: string;
  status: "sent";
  timestamp: string;
  recipient_id: string;
  recipient_user_id: string;
  conversation: {
    id: string;
    expiration_timestamp: string;
    origin: { type: string };
  };
  pricing: {
    billable: boolean;
    pricing_model: string;
    category: string;
    type: string;
  };
};

type ReadStatus = {
  id: string;
  status: "read";
  timestamp: string;
  recipient_id: string;
  recipient_user_id: string;
  conversation: {
    id: string;
    origin: { type: string };
  };
  pricing: {
    billable: boolean;
    pricing_model: string;
    category: string;
    type: string;
  };
};

type FailedStatus = {
  id: string;
  status: "failed";
  timestamp: string;
  recipient_id: string;
  recipient_user_id: string;
  errors: FailedStatusError[];
};

type FailedStatusError = {
  code: number;
  title: string;
  message: string;
  error_data: FailedStatusErrorData;
  href: string;
};

type FailedStatusErrorData = {
  details: string;
};
