import type React from 'react';
import { useState, useRef, type FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { formatTime } from '@/utils/timeUtils';
import { getInitials } from '@/utils/getInitials';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuthStore } from '@/store/authStore';
import { AvatarGroup } from './ui/avatar-group';
import EmojiPicker from './EmojiPicker';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const {
    messages,
    sendMessage,
    sendTypingStatus,
    connectionStatus,
    typingUsers,
  } = useChatSocket();
  const { user } = useAuthStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom only within chat container
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      return;
    }

    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    // Calculate if we're near the bottom (within 100px)
    const isNearBottom =
      scrollArea.scrollHeight - scrollArea.scrollTop <=
      scrollArea.clientHeight + 100;

    if (isNearBottom) {
      // Use smooth scroll only for user-initiated messages
      const behavior = messages[messages.length - 1]?.isCurrentUser
        ? 'smooth'
        : 'auto';

      scrollToBottomRef.current?.scrollIntoView({
        behavior,
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [messages, typingUsers, hasInitialized]);

  // Handle typing status with debounce
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTypingStatus(false);
      }, 3000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, sendTypingStatus]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || isSending) return;

    try {
      setIsSending(true);
      await sendMessage(message);
      setMessage('');
      setIsTyping(false);
      sendTypingStatus(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    const wasTyping = isTyping;
    const nowTyping = e.target.value.length > 0;

    if (nowTyping !== wasTyping) {
      setIsTyping(nowTyping);
      sendTypingStatus(nowTyping);
    } else if (nowTyping && !wasTyping) {
      // Ensure we send typing status when starting to type
      sendTypingStatus(true);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    // Focus the input after emoji selection
    inputRef.current?.focus();

    // Set typing status
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }
  };

  // Filter out current user from typing users
  const activeTypingUsers = typingUsers.filter((u) => u.id !== user?.id);

  // Format typing users text
  const getTypingText = (users: typeof activeTypingUsers) => {
    if (users.length === 0) return '';
    if (users.length === 1) return `${users[0].name} is typing...`;
    if (users.length === 2)
      return `${users[0].name} and ${users[1].name} are typing...`;
    if (users.length === 3)
      return `${users[0].name}, ${users[1].name}, and ${users[2].name} are typing...`;
    return `${users[0].name}, ${users[1].name}, and ${users.length - 2} others are typing...`;
  };

  return (
    <div className='flex h-full flex-col rounded-lg border border-white/10 bg-black/20 shadow-lg'>
      {/* Header - Always visible */}
      <div className='flex items-center justify-between border-b border-white/10 bg-black/30 p-3'>
        <div className='flex items-center gap-2'>
          <h2 className='text-base font-medium text-white/90'>Live Chat</h2>
          <span
            className={`h-2 w-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-green-500'
                : connectionStatus === 'connecting'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
          ></span>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6 rounded-full hover:bg-white/5'
          onClick={() => setIsChatExpanded(!isChatExpanded)}
          aria-label={isChatExpanded ? 'Collapse chat' : 'Expand chat'}
        >
          <ChevronDown
            size={14}
            className={`transform transition-transform duration-700 ease-in-out ${isChatExpanded ? '' : 'rotate-180'}`}
          />
        </Button>
      </div>

      {/* Messages area with enhanced smooth transition */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-700 ease-in-out ${
          isChatExpanded
            ? 'max-h-[calc(100vh-200px)] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        <ScrollArea
          className='h-full p-3'
          ref={scrollAreaRef}
          onPointerEnter={() => {
            setHasInitialized(false); // Pause auto-scroll when user interacts
          }}
        >
          <div className='space-y-3'>
            {messages.map((message) => {
              const timestamp = new Date(message.timestamp);
              return (
                <div
                  key={`${message.id}-${timestamp.getTime()}`}
                  className={`flex items-start gap-2 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isCurrentUser && (
                    <Avatar className='h-6 w-6 shrink-0 bg-gray-800'>
                      <AvatarFallback className='bg-gray-800 text-xs'>
                        {getInitials(message.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`relative max-w-[80%] break-words rounded-lg px-3 py-2 text-sm sm:max-w-[75%] ${
                      message.isCurrentUser
                        ? 'bg-blue-600/80 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className='relative z-10'>
                      <div className='mb-1 flex flex-wrap justify-between gap-1'>
                        <span
                          className={`text-xs font-medium ${message.isCurrentUser ? 'text-blue-100' : 'text-gray-700'}`}
                        >
                          {message.user.name}
                        </span>
                        <span
                          className={`text-xs ${message.isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}
                        >
                          {formatTime(timestamp)}
                        </span>
                      </div>
                      <p className='break-words'>{message.content}</p>
                    </div>
                  </div>
                  {message.isCurrentUser && (
                    <Avatar className='h-6 w-6 shrink-0 bg-gray-800'>
                      <AvatarFallback className='bg-gray-800 text-xs'>
                        {getInitials(message.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}

            {/* Multiple typing users indicator */}
            {activeTypingUsers.length > 0 && (
              <div className='flex animate-pulse items-start gap-2'>
                <AvatarGroup
                  avatars={activeTypingUsers.map((user) => ({
                    name: getInitials(user.name),
                  }))}
                  max={3}
                  size='sm'
                />
                <div className='relative flex flex-col gap-1 rounded-lg bg-gray-200 px-3 py-2'>
                  <div className='absolute left-[-5px] top-2 h-3 w-3 rotate-45 bg-gray-200'></div>
                  <div className='relative z-10'>
                    <span className='text-xs text-gray-600'>
                      {getTypingText(activeTypingUsers)}
                    </span>
                    <div className='flex gap-1'>
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-gray-500'
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-gray-500'
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-gray-500'
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollToBottomRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input area with enhanced smooth transition */}
      <div
        className={`border-t border-white/10 bg-gray-900 transition-all duration-700 ease-in-out ${
          isChatExpanded
            ? 'max-h-20 translate-y-0 transform p-3 opacity-100'
            : 'max-h-0 translate-y-10 transform overflow-hidden p-0 opacity-0'
        }`}
        style={{
          transitionProperty: 'max-height, opacity, padding, transform',
        }}
      >
        {user ? (
          <form onSubmit={handleSubmit} className='flex gap-2'>
            <div className='relative flex flex-1 items-center'>
              <Input
                ref={inputRef}
                value={message}
                onChange={handleInputChange}
                placeholder='Type a message...'
                className='bg-gray-900 pr-10'
                disabled={!user || !isChatExpanded}
              />
              <div className='absolute right-2'>
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            </div>
            <Button
              type='submit'
              size='icon'
              disabled={!message.trim() || isSending || !isChatExpanded}
              aria-label='Send message'
              className='flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white/80'
            >
              {isSending ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </form>
        ) : (
          <div className='text-center'>
            <Link to='/sign-in' className='text-blue-500 hover:underline'>
              Sign In
            </Link>{' '}
            to chat
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
