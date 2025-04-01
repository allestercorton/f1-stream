export interface ChatUser {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  user: ChatUser;
  content: string;
  timestamp: Date;
  isCurrentUser?: boolean;
}
