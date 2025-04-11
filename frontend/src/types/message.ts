export interface ChatMessage {
  userId: string;
  name: string;
  content: string;
  createdAt: Date | string;
}

export interface MessageProps {
  msg: ChatMessage;
  isCurrentUser: boolean;
}
