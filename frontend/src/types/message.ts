export interface User {
  _id: string;
  displayName: string;
  profilePicture: string;
}

export interface ChatMessage {
  userId: string;
  name: string;
  avatar: string;
  content: string;
  createdAt: Date | string;
}

export interface MessageProps {
  msg: ChatMessage;
  isCurrentUser: boolean;
}
