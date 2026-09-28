export type IncomingMessageDto = {
  object: "whatsapp_business_account";
  entry: Entry[];
};

type Entry = {
  id: string;
  changes: Change[];
};

type Change = {
  value: Value;
  field: "messages";
};

type Value = {
  messaging_product: "whatsapp";
  metadata: Metadata;
  contacts: Contact[];
  messages: Message[];
};

type Metadata = {
  display_phone_number: string;
  phone_number_id: string;
};

type Contact = {
  profile: Profile;
  wa_id: string;
  user_id: string;
};

type Profile = { name: string; username: string };

type Message = TextMessage;

type TextMessage = {
  from: string;
  from_user_id: string;
  id: string;
  timestamp: string;
  text: TextMessageBody;
  type: "text";
};

type TextMessageBody = { body: string };
