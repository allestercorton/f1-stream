import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, ArrowDown } from 'lucide-react';
import Message from './Message';
import ChatInput from './ChatInput';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import type { ChatMessage } from '@/types/message';
import { Button } from './ui/button';

const ChatBox = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const checkScrollPosition = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    setShowJumpToBottom(scrollHeight - scrollTop - clientHeight > 100);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'nearest' });
  };

  useLayoutEffect(() => {
    if (!isChatVisible || !messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
    if (isNearBottom) setTimeout(() => scrollToBottom('smooth'), 50);
  }, [messages, isChatVisible]);

  useEffect(() => {
    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev.slice(-49), msg]);
    };

    const handleInitialMessages = (msgs: ChatMessage[]) => {
      setMessages(msgs);
      setTimeout(() => scrollToBottom('auto'), 100);
    };

    socket.emit('getMessages');
    socket.on('messages', handleInitialMessages);
    socket.on('newMessage', handleNewMessage);

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      setTimeout(checkScrollPosition, 150);
    }

    return () => {
      socket.off('messages', handleInitialMessages);
      socket.off('newMessage', handleNewMessage);
      container?.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim() || !user) return;
    socket.emit('sendMessage', {
      userId: user.id,
      name: user.name,
      content: text.trim(),
      createdAt: new Date(),
    });
    setText('');
  };

  return (
    <div className='chat-container transform-gpu rounded-2xl border border-white/10 bg-gray-950'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3'>
        <h2 className='flex items-center font-medium'>
          <span className='mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500' />
          live chat
        </h2>
        <button
          onClick={() => setIsChatVisible(!isChatVisible)}
          className='text-zinc-400 hover:text-white'
          aria-label={isChatVisible ? 'Hide chat' : 'Show chat'}
        >
          {isChatVisible ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Chat content */}
      {isChatVisible && (
        <div className='flex flex-1 flex-col overflow-hidden'>
          <div
            ref={messagesContainerRef}
            className='chat-messages scroll-contain p-4'
          >
            {messages.map((msg, i) => (
              <Message
                key={`${msg.userId}-${msg.createdAt}-${i}`}
                msg={msg}
                isCurrentUser={user?.id === msg.userId}
              />
            ))}
            <div ref={messagesEndRef} aria-hidden='true' />

            {showJumpToBottom && (
              <div className='sticky bottom-4 left-0 right-0 flex justify-center'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1 rounded-full border-none bg-white/90 px-3 text-black outline-none hover:bg-white hover:text-black'
                  onClick={() => scrollToBottom('smooth')}
                >
                  <ArrowDown size={16} />
                  <span>Jump to Latest</span>
                </Button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <ChatInput
              text={text}
              setText={setText}
              sendMessage={sendMessage}
            />
          ) : (
            <div className='border-t border-white/10 bg-black/30 p-4 text-center'>
              <Link to='/sign-in' className='text-white hover:underline'>
                Sign in
              </Link>
              <span className='text-white/50'> to join the conversation</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
