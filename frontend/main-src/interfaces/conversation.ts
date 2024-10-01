export type ChatMessage = {
  role: string;
  content: string;
  end_turn?: boolean;
};

export type ConversationRequest = {
  id?: string;
  messages: ChatMessage[];
  file?: File;
};
