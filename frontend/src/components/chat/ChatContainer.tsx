import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { socket } from '../../services/socket';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import type { Message, TypingUser } from '../../types/chat';
import { Button } from '../ui/button';

const ChatContainer: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChatExpanded, setIsChatExpanded] = useState<boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    // listen for previous messages
    socket.on('previous-messages', (data: Message[]) => {
      setMessages(data);
      // Use immediate scroll on initial load
      if (isInitialLoadRef.current) {
        scrollToBottomImmediate();
        isInitialLoadRef.current = false;
      } else {
        scrollToBottom();
      }
      setIsLoading(false);
    });

    // listen for new messages
    socket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // listen for message updates (reactions, replies, edits, deletes)
    socket.on('message-updated', (updatedMessage: Message) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg,
        ),
      );
    });

    // listen for typing indicators
    socket.on('typing-users', (users: TypingUser[]) => {
      // filter out current user from typing indicators
      const filteredUsers = users.filter(
        (typingUser) => !user || typingUser.userId !== user._id,
      );
      setTypingUsers(filteredUsers);
    });

    // Add resize event listener for responsive adjustments
    const handleResize = () => {
      if (messagesContainerRef.current) {
        const vh = window.innerHeight;
        const containerHeight = isChatExpanded ? `${vh - 220}px` : '0px';
        messagesContainerRef.current.style.height = containerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Initial scroll to bottom when component mounts
    scrollToBottomImmediate();

    return () => {
      socket.off('previous-messages');
      socket.off('new-message');
      socket.off('message-updated');
      socket.off('typing-users');
      window.removeEventListener('resize', handleResize);
    };
  }, [user, isChatExpanded]);

  // Immediate scroll without animation for initial load
  const scrollToBottomImmediate = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  // Smooth scroll for new messages
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const messageData: { text: string; replyTo?: string } = {
      text: text.trim(),
    };

    if (replyingTo) {
      messageData.replyTo = replyingTo._id;
      setReplyingTo(null);
    }

    socket.emit('send-message', messageData);
  };

  const handleTyping = () => {
    if (isAuthenticated) {
      socket.emit('typing');
    }
  };

  const handleStopTyping = () => {
    if (isAuthenticated) {
      socket.emit('stop-typing');
    }
  };

  const handleReaction = (messageId: string, reaction: string) => {
    if (isAuthenticated) {
      socket.emit('add-reaction', { messageId, reaction });
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleSendReply = (text: string, messageId: string) => {
    if (!text.trim() || !isAuthenticated) return;

    socket.emit('add-reply', { messageId, text: text.trim() });
  };

  const handleEditMessage = (messageId: string, text: string) => {
    if (!text.trim() || !isAuthenticated) return;

    socket.emit('edit-message', { messageId, text: text.trim() });
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!isAuthenticated) return;

    socket.emit('delete-message', { messageId });
  };

  const handleEditReply = (
    messageId: string,
    replyIndex: number,
    text: string,
  ) => {
    if (!text.trim() || !isAuthenticated) return;

    socket.emit('edit-reply', { messageId, replyIndex, text: text.trim() });
  };

  const handleDeleteReply = (messageId: string, replyIndex: number) => {
    if (!isAuthenticated) return;

    socket.emit('delete-reply', { messageId, replyIndex });
  };

  const toggleChat = () => {
    setIsChatExpanded(!isChatExpanded);

    // add animation class to container
    if (chatContainerRef.current) {
      chatContainerRef.current.classList.add('chat-transition');
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.classList.remove('chat-transition');
        }
      }, 300);
    }
  };

  return (
    <div
      ref={chatContainerRef}
      className='flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-lg backdrop-blur-sm'
    >
      <div className='flex items-center justify-between border-b border-white/10 bg-black/30 p-3 backdrop-blur-sm'>
        <div className='flex items-center gap-2'>
          <MessageSquare size={18} className='text-zinc-300' />
          <h2 className='text-base font-medium text-white'>Live Chat</h2>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='h-7 w-7 rounded-full text-zinc-300 hover:bg-white/10 hover:text-white'
          onClick={toggleChat}
          aria-label={isChatExpanded ? 'Collapse chat' : 'Expand chat'}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isChatExpanded ? '' : 'rotate-180'}`}
          />
        </Button>
      </div>

      <div
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-3 transition-all duration-300 ease-in-out ${
          isChatExpanded
            ? 'max-h-[calc(100vh-220px)] opacity-100'
            : 'max-h-0 overflow-hidden p-0 opacity-0'
        }`}
        style={{ height: 'calc(100vh - 220px)' }}
      >
        {isLoading ? (
          <div className='flex h-full items-center justify-center'>
            <div className='flex flex-col items-center gap-2'>
              <div className='h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-blue-500'></div>
              <p className='text-sm text-zinc-400'>Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className='flex h-full items-center justify-center text-zinc-500'>
            <div className='flex flex-col items-center gap-3 text-center'>
              <MessageSquare size={24} className='text-zinc-600' />
              <p>No messages yet. Be the first to chat!</p>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {messages.map((message) => (
              <ChatMessage
                key={message._id}
                message={message}
                currentUser={user}
                onReaction={handleReaction}
                onReply={handleReply}
                onSendReply={handleSendReply}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onEditReply={handleEditReply}
                onDeleteReply={handleDeleteReply}
              />
            ))}

            {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {!isLoading && (
        <div
          className={`border-t border-white/10 bg-black/30 p-3 backdrop-blur-sm transition-all duration-300 ease-in-out ${
            isChatExpanded
              ? 'max-h-[120px] opacity-100'
              : 'max-h-0 overflow-hidden border-t-0 p-0 opacity-0'
          }`}
        >
          {isAuthenticated ? (
            <ChatInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
              replyingTo={replyingTo}
              onCancelReply={cancelReply}
            />
          ) : (
            <div className='flex items-center justify-center rounded-lg bg-zinc-800/50 p-4 backdrop-blur-sm'>
              <button
                onClick={() =>
                  (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
                }
                className='flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-500'
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
