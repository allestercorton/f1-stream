import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Message from './Message';
import ChatInput from './ChatInput';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import type { ChatMessage } from '@/types/message';

const ChatBox = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auth states
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // scroll to latest message after render
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  useLayoutEffect(() => {
    if (isChatVisible && isAuthenticated && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isChatVisible, isAuthenticated]);

  // setup socket listeners
  useEffect(() => {
    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev.slice(-49), msg]);
    };

    const handleInitialMessages = (msgs: ChatMessage[]) => {
      setMessages(msgs);
    };

    socket.emit('getMessages');
    socket.on('messages', handleInitialMessages);
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('messages', handleInitialMessages);
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim() || !user) return;

    const newMessage: ChatMessage = {
      userId: user.id,
      name: user.name,
      content: text.trim(),
      createdAt: new Date(),
    };

    socket.emit('sendMessage', newMessage);
    setText('');
  };

  return (
    <div className='flex h-full flex-col bg-black/20'>
      {/* Header */}
      <div className='border-b border-white/10 bg-black/30 px-4 py-3'>
        <div className='flex items-center justify-between'>
          <h2 className='flex items-center font-medium'>
            <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
            Live Chat
          </h2>
          <button
            onClick={() => setIsChatVisible(!isChatVisible)}
            className='text-zinc-400 hover:text-white'
            aria-label={isChatVisible ? 'Hide chat' : 'Show chat'}
          >
            {isChatVisible ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronUp size={20} />
            )}
          </button>
        </div>
      </div>

      {isChatVisible && (
        <>
          <div className='scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent flex-1 overflow-y-auto p-4'>
            {messages.map((msg, i) => (
              <Message
                key={`${msg.userId}-${i}`}
                msg={msg}
                isCurrentUser={user?.id === msg.userId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input or login prompt */}
          {isAuthenticated ? (
            <ChatInput
              text={text}
              setText={setText}
              sendMessage={sendMessage}
            />
          ) : (
            <div className='border-t border-white/10 bg-black/30 p-4 text-center'>
              <Link
                to='/sign-in'
                className='cursor-pointer text-white hover:underline'
                aria-label='Link to sign in'
              >
                Sign in
              </Link>{' '}
              <span className='text-white/50'>to join the conversation.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
