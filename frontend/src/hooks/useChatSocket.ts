import { useEffect, useRef, useState, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import type { ChatUser, ChatMessage } from '@/types/socket';

/**
 * Custom hook for managing WebSocket communication for a real-time chat application.
 * Utilizes Socket.IO for message handling, user presence, and connection management.
 */
export const useChatSocket = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');
  const [typingUsers, setTypingUsers] = useState<ChatUser[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const { token, user } = useAuthStore();

  /**
   * Sends a chat message to the server.
   * @param content - The text content of the message.
   * @returns A promise that resolves with a boolean indicating if the message was sent successfully.
   */
  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!socketRef.current?.connected) return false;
    return new Promise((resolve) => {
      socketRef.current?.emit('sendMessage', content, (success: boolean) => {
        resolve(success);
      });
    });
  }, []);

  /**
   * Notifies the server when the user starts or stops typing.
   * @param isTyping - True if the user is typing, false otherwise.
   */
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (!socketRef.current?.connected) return;
    socketRef.current?.emit('typing', isTyping);
  }, []);

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
      {
        auth: { token },
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      },
    );
    socketRef.current = socket;

    const handleConnect = () => {
      setConnectionStatus('connected');
      socket.emit('joinChat');
    };

    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
    };

    const handlePreviousMessages = (messages: ChatMessage[]) => {
      setMessages(
        messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          isCurrentUser: user?.id === msg.user.id,
        })),
      );
    };

    const handleChatMessage = (message: ChatMessage) => {
      setMessages((prev) =>
        prev.some((m) => m.id === message.id)
          ? prev
          : [
              ...prev,
              {
                ...message,
                timestamp: new Date(message.timestamp),
                isCurrentUser: user?.id === message.user.id,
              },
            ],
      );
    };

    const handleUserTyping = (
      userId: string,
      userName: string,
      isTyping: boolean,
    ) => {
      setTypingUsers((prev) =>
        isTyping
          ? prev.some((u) => u.id === userId)
            ? prev
            : [...prev, { id: userId, name: userName }]
          : prev.filter((u) => u.id !== userId),
      );
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('previousMessages', handlePreviousMessages);
    socket.on('chatMessage', handleChatMessage);
    socket.on('userTyping', handleUserTyping);

    const pingInterval = setInterval(() => {
      if (socket.connected) socket.emit('ping');
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      socket.disconnect();
    };
  }, [token, user?.id]);

  return {
    messages,
    sendMessage,
    sendTypingStatus,
    typingUsers,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
  };
};
