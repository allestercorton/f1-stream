export interface ChatMessage {
  id: string;
  user: {
    id: string;
    name: string;
  };
  content: string;
  timestamp: Date;
  isCurrentUser?: boolean;
}

export interface SocketData {
  user?: {
    id: string;
    name: string;
  };
  authenticated: boolean;
}

export interface TypingUser {
  id: string;
  name: string;
}

export interface ClientToServerEvents {
  sendMessage: (content: string, callback: (success: boolean) => void) => void;
  joinChat: () => void;
  typing: (isTyping: boolean) => void;
  ping: () => void;
}

export interface ServerToClientEvents {
  chatMessage: (message: ChatMessage) => void;
  previousMessages: (messages: ChatMessage[]) => void;
  error: (message: string) => void;
  userTyping: (userId: string, userName: string, isTyping: boolean) => void;
}
