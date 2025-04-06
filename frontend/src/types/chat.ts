export interface User {
  _id: string;
  googleId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName?: string;
  profilePicture?: string;
}

export interface Reaction {
  type: string;
  user: User;
}

export interface Reply {
  _id?: string;
  messageId: string;
  text: string;
  user: User;
  createdAt: Date;
  editedAt?: Date;
  isDeleted?: boolean;
  originalText?: string;
}

export interface Message {
  _id: string;
  text: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  reactions?: Reaction[];
  replies?: Reply[];
  replyTo?: Message;
  editedAt?: Date;
  isDeleted?: boolean;
  originalText?: string;
}

export interface TypingUser {
  userId: string;
  displayName: string;
  timestamp: number;
}
